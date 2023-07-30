from .base import Base
 
from rest_framework.response import Response
from rest_framework.exceptions import APIException 

from ..models import Storage, StorageOwner
 
class PasswordStorages(Base):
    def get(self, request, storage_id): 
        password = self.request.query_params.get('password')
 
        if not StorageOwner.objects.filter(storage_id=storage_id, user_id=request.user.id, storage_password=password).exists():
            return Response({"error": "password_invalid", "message": "A senha não é válida para o storage"}) 

        return Response({"error": ""}) 

    def post(self, request, storage_id): 
        password = self.request.data.get('password')

        if not Storage.objects.filter(id=storage_id).exists():
            raise APIException("Esta pasta não existe", 'storage_not_found')

        if not StorageOwner.objects.filter(storage_id=storage_id, user_id=request.user.id).exists():
            raise APIException("Este storage não é seu", 'storage_permission_denid')

        if not password:
            raise APIException("Envie uma senha", 'validators')

        
        StorageOwner.objects.filter(storage_id=storage_id, user_id=request.user.id).update(
            storage_password=password
        )

        # Save a modification of storage
        self.create_an_modification(
            request.user.id,
            storage_id=storage_id,
            codename='alter_password',
            visible_all=False
        )

 
        return Response({"error": ""}) 
 