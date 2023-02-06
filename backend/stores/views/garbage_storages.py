from .base import Base
 
from rest_framework.response import Response

from ..models import StorageOwner, Storage

from django.db.models import Q

import os

class StorageDumps(Base):
    def put(self, request, storage_id):
        user_id = request.user.id

        get_all_childreens_id = self.get_all_children_from_a_store(
            request.user.id,
            self.get_first_degree_children_from_storage(
                user_id=request.user.id,
                storage_higher_level_id=storage_id,
            )
        )

        # Change the status of deleted
        def deleted_status_change(self, storage_id,  user_id, storage_id_modification):
            storage = StorageOwner.objects.values('id', 'storage_is_deleted').filter(
                Q(storage_id=storage_id),
                Q(user_id=user_id) 
            ).first()

            if storage:
                status = bool(1 - int(storage['storage_is_deleted']))

                if not self.notified:
                    if status: 
                        codename = 'move_to_bin'
                    else:
                        codename = 'recovered_to_bin'

                    # Save a modification of storage
                    self.create_an_modification(
                        user_id,
                        storage_id=storage_id_modification,
                        codename=codename,
                        visible_all=False
                    )

                    # Set to already saved the modification
                    self.notified = True

                if not status:
                    self.action = 'recovered_to_bin'
                
                StorageOwner.objects.filter(id=storage['id']).update(
                    storage_is_deleted= status
                )

        # Have you already saved the modification
        self.notified = False
        self.action = 'move_to_bin'

        if storage_id != 0:
            deleted_status_change(
                self,
                storage_id=storage_id,
                user_id=user_id,
                storage_id_modification=storage_id
            )

            for i in get_all_childreens_id:
                deleted_status_change(
                    self,
                    storage_id=i,
                    user_id=user_id,
                    storage_id_modification=storage_id
                )

        return Response({"error": "", "action": self.action})

    def delete(self, request, storage_id):
        def delete_storage(storage_id_p):
            storage = Storage.objects.filter(
                id=storage_id_p
            ).first()
            storage_owner = StorageOwner.objects.filter(
                storage_id=storage_id_p,
                user_id=request.user.id,
                storage_is_deleted=True
            ).exists()

            if not storage or not storage_owner: return

            if storage.extension != None:
                path = r'{path_prefix}\assets\storages\storage_{user_id}\{storage_path}'.format(
                    path_prefix= os.getcwd(),
                    user_id=request.user.id,
                    storage_path=str(storage.id) + '.' + storage.extension
                )
                os.remove(path)

            storage.delete()

        get_all_childreens_id = self.get_all_children_from_a_store(
            request.user.id, 
            self.get_first_degree_children_from_storage(
                user_id=request.user.id,
                storage_higher_level_id=storage_id, 
                storage_is_deleted=True
            )
        )

        if storage_id != 0:
            delete_storage(
                storage_id_p=storage_id
            )

            for id in get_all_childreens_id:
                delete_storage( 
                    storage_id_p=id
                )

        return Response({"error": ""}) 