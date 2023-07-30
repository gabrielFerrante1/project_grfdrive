from .base import Base
 
from rest_framework.response import Response
from rest_framework.exceptions import APIException 

from ..models import Storage, StorageOwner

from ..serializers import StoragesSerializer 

import os
 
class StorageUploads(Base):
    def post(self, request ):
        storage_higher_level_id = request.data.get('storage_higher_level_id', '0')
        file = request.FILES.get('file')

        # Validators 
        if not file:
            raise APIException("Envie um arquivo", "upload_error")

        file_name = file.name.split('.')[0]
        extension = file.name.split('.')[-1]
        type_extension = self.get_type_of_extension(extension)

        self.check_if_exists_directory_by_id(
            user_id=request.user.id,
            storage_id=storage_higher_level_id
        )
        self.check_if_storage_higher_level_exists_by_name(
            user_id=request.user.id,
            storage_higher_level_id=storage_higher_level_id,
            file_name=file_name,
            file_extension=extension
        ) 

        storage = Storage.objects.create(
            name=file_name, 
            extension=extension,
            size=round(file.size / 1024),
            type=type_extension
        )

        storage_owner = StorageOwner.objects.create(
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

        try: 
            path = os.getcwd() + r'\assets\storages\storage_'+str(request.user.id)+'\{storage_id}'.format(storage_id=storage.id)
            
            with open("{path}.{ext}".format(path=path, ext=extension), 'wb') as out:
                out.write(file.read()) 
        except:
            storage.delete()
            storage_owner.delete()

            raise APIException("Ocorreu um erro com o upload, tente novamente mais tarde", "upload_error")

        # Create an modification notification
        self.create_an_modification(request.user.id, storage_id=storage.id, codename='uploaded')

        serializer = StoragesSerializer(storage, context={'request': request})

        return Response({"storage": serializer.data, "error": ""})

 