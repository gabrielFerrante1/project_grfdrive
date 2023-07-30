from .base import Base

from django.db.models import Q
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from ..models import Storage, StorageShare, StorageOwner, StorageShareStorage

from ..serializers import StorageShareSerializer

from accounts.models import User
from core.socktes import socket

class SharesStorage(Base):
    def get(self, request):
        storage_shares = StorageShare.objects.filter(from_user_id=request.user.id).all()

        serializer = StorageShareSerializer(storage_shares, many=True)

        return Response({"storage_shares": serializer.data,   "error": ""})


class ShareStorage(Base):
    def post(self, request, storage_id):
        user_email = request.data.get('user_email') 

        if not Storage.objects.filter(id=storage_id).exists() or not \
               StorageOwner.objects.filter(storage_id=storage_id, user_id=request.user.id, is_owner=True).exists():
            raise APIException("Esta pasta ou este arquivo não existe", 'storage_not_found')

        user_check = User.objects.filter(email=user_email).exclude(id=request.user.id).first() 
        if not user_check:
            raise APIException("Este usuário não existe em nossa plataforma", 'user_not_found') 
 
        share = StorageShare.objects.create(
            from_user_id=request.user.id,
            to_user_id=user_check.id,
            status='aguardando'
        )
        StorageShareStorage.objects.create(
            share_id=share.id,
            storage_id=storage_id
        )

        # Alert to user that goes received
        socket.emit('user-{uid}-received-share'.format(uid=user_check.id), {'data': {
            'from_user': {
                'id': request.user.id,
                'name': request.user.name,
                'email': request.user.email
            },
            'to_user':{
                'id': user_check.id,
                'name': user_check.name,
                'email': user_check.email
            },
            'share_id': share.id
        }})

        return Response({"error": ""})


class ShareStorageReceive(Base):
    def post(self, request, share_id):
        type_response = request.data.get('type_response')
        user_id = request.user.id

        share = StorageShare.objects.filter(Q(to_user_id=user_id), Q(id=share_id))
        share_storage = StorageShareStorage.objects.filter(share_id=share_id).first()

        if not share:
            raise APIException("Esse compartilhamento não existe", 'share_not_found') 

        def copy_storage(storage_id, user_id, list_storages): 
            storage_owner = StorageOwner.objects.filter(Q(storage_id=storage_id) | Q(storage_higher_level_id=storage_id) & Q(user_id=user_id)).first()

            storage_higher_level_id = 0
            if storage_owner.storage_higher_level_id in list_storages:
                storage_higher_level_id = storage_owner.storage_higher_level_id
        
            StorageOwner.objects.create(
                is_owner=False,
                storage_higher_level_id=storage_higher_level_id,
                storage_id=storage_owner.storage_id,
                user_id=request.user.id
            )

        if type_response == "accepted": 
            share.update(
                status='aceito'
            )

            share = share.first()
 
            get_all_childreens_id = self.get_all_children_from_a_store(
                share.from_user_id, 
                self.get_first_degree_children_from_storage( 
                    storage_higher_level_id=share_storage.storage_id,
                    user_id=share.from_user_id
                )
            )
            get_all_childreens_id.append(share_storage.storage_id)

            for id in get_all_childreens_id:
                copy_storage(id, share.from_user_id, get_all_childreens_id)

        elif type_response == "refused":
            share.update(
                status='recusado'
            )

            raise APIException("Você recusou o compartilhamento", 'refused_share') 
        else: 
            raise APIException("Esse compartilhamento não existe", 'validators_error') 


        return Response({"error": ""})