from .base import Base

from core.socktes import socket  

from rest_framework.response import Response
from rest_framework.exceptions import APIException 

from stores.models import Storage, StorageOwner

import os

class StorageChange(Base):
    def put(self, request, storage_id):
        body = self.request.data.get('body')

        if not Storage.objects.filter(id=storage_id).exists():
            raise APIException("Esse arquivo não existe", 'storage_not_found')

        if not StorageOwner.objects.filter(storage_id=storage_id, user_id=request.user.id).exists():
            raise APIException("Você não tem permissão para editar esse arquivo", 'storage_permission_denid')

        if not body:
             raise APIException("Envie o novo conteúdo do arquivo", 'validators')

        
        room = f'editing_room_{storage_id}'
        socket.emit('recevie_file_body', room=room, data=body )

        owner_id = StorageOwner.objects.values('user_id').filter(storage_id=storage_id, is_owner=True).first()['user_id']
        path = os.getcwd() + r'\assets\storages\storage_'+str(owner_id)+'\{storage_id}'.format(storage_id=storage_id)

        with open("{path}.txt".format(path=path), 'w') as f:
            f.write(body)

        return Response({ "error": ""}) 
