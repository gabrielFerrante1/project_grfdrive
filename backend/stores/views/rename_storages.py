from .base import Base
 
from rest_framework.response import Response
from rest_framework.exceptions import APIException 

from ..models import Storage, StorageOwner

from ..serializers import StoragesSerializer 



class RenameStorages(Base):
    def put(self, request, storage_id): 
        name = self.request.data.get('name')

        if not Storage.objects.filter(id=storage_id).exists():
            raise APIException("Esta pasta não existe", 'storage_not_found')

        if not StorageOwner.objects.filter(storage_id=storage_id, user_id=request.user.id, is_owner=True).exists():
            raise APIException("Você não tem permissão para renomear o storage", 'storage_permission_denid')

        if name:
            Storage.objects.filter(id=storage_id).update(
                name=name
            )

            # Save a modification of storage
            self.create_an_modification(
                request.user.id,
                storage_id=storage_id,
                codename='renamed',
                visible_all=True
            )

 
        return Response({ "error": ""}) 
 