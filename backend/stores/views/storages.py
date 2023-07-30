from .base import Base
 
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import APIException 

from ..models import Storage, StorageOwner, StorageModification

from ..serializers import StoragesSerializer, StorageSerializer, StorageModificationSerializer

from ..utils.parsers import p_bool

import os
from core.socktes import socket


class Storages(Base):
    def get(self, request): 
        path = self.request.query_params.get('storage_higher_level_id', '0')
        is_deleted = self.request.query_params.get('is_deleted', False)
        is_favorite = self.request.query_params.get('is_favorite', False)

        try:
            path = int(path)
        except ValueError:
            path = '0'
        
        is_deleted = p_bool(is_deleted) 
        is_favorite = p_bool(is_favorite)

        kwargs = {'storage_higher_level_id': path}
        if is_deleted | is_favorite:
            kwargs = {}

        if is_favorite:
            kwargs = {'storage_is_favorite': True}

        storages = self.get_storages(user_id=request.user.id, storage_is_deleted=is_deleted, **kwargs)
      
        serializer = StoragesSerializer(storages, context={'request': request}, many=True)
       
        return Response({"storages": serializer.data, "error": ""}) 


    def post(self, request): 
        name = request.data.get('name')
        extension = request.data.get('extension')
        storage_higher_level_id = request.data.get('storage_higher_level_id')

        # Validators
        if name == None:
            raise APIException("Nome é um campo obrigátorio", 'invalid_validators')

        extension = extension.replace('.', '')
        if extension == '':
            extension = None

        self.check_if_exists_directory_by_id(user_id=request.user.id, storage_id=storage_higher_level_id)
        self.check_if_storage_higher_level_exists_by_name(
            user_id=request.user.id, 
            storage_higher_level_id=storage_higher_level_id,
            file_name=name,
            file_extension=extension
        )
 
        type_storage = self.get_type_of_extension(extension=extension) 

        storage = Storage.objects.create(
            name=name,
            extension=extension,
            size=1,
            type=type_storage
        )

        StorageOwner.objects.create(
            is_owner=True,
            storage_higher_level_id=storage_higher_level_id,
            storage_id=storage.id,
            user_id=request.user.id
        )
 
        owners = StorageOwner.objects.values('user_id').filter(
            storage_id=storage_higher_level_id
        ).exclude(user_id=request.user.id)

        for owner in owners:
            StorageOwner.objects.create(
                is_owner=False,
                storage_higher_level_id=storage_higher_level_id,
                storage_id=storage.id,
                user_id=owner['user_id']
            )

        if extension != None: 
            # Creating file null
            path = os.getcwd() + r'\assets\storages\storage_'+str(request.user.id)+'\{storage_id}'.format(storage_id=storage.id)
            
            with open("{path}.{ext}".format(path=path, ext=extension), 'a') as out:
                out.write('') 

        # Create an modification notification
        self.create_an_modification(request.user.id, storage_id=storage.id, codename='created')

        serializer = StoragesSerializer(storage, context={'request': request})

        return Response({"storage": serializer.data, "error": ""}) 

class StorageView(Base):
    def get(self, request, storage_id): 
        if not StorageOwner.objects.filter(user_id=request.user.id, storage_id=storage_id).exists(): 
            raise APIException("Esse storage não existe", 'storage_404')

        storage = Storage.objects.filter(id=storage_id).first()
        query_storages_modification = StorageModification.objects.filter(storage_id=storage_id).all()
         
        storages_modification = []
        for item in query_storages_modification:
            if not item.visible_all:
                owner_user = StorageOwner.objects.filter(id=item.owner_id, user_id=request.user.id).exists()
                if owner_user:
                    storages_modification.append(item)
            else:
                storages_modification.append(item) 

        serializer = StorageSerializer(storage, context={'request': request} )
        serializerModification = StorageModificationSerializer(storages_modification, context={'request': request}, many=True )

        returnData = {
            "storage": serializer.data, 
            "modifications": serializerModification.data,
            "error": ""
        }

        if storage.extension == 'txt': 
            owner_id = StorageOwner.objects.values('user_id').filter(storage_id=storage.id, is_owner=True).first()['user_id']
            path = os.getcwd() + r'\assets\storages\storage_'+str(owner_id)+'\{storage_id}'.format(storage_id=storage.id)
            
            with open("{path}.{ext}".format(path=path, ext=storage.extension), 'r') as f:
                returnData['file_body'] = f.read()

        return Response(returnData) 