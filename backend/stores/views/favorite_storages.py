from .base import Base
 
from rest_framework.response import Response  

from ..models import StorageOwner
 
class StorageFavorites(Base):
    def put(self, request, storage_id):
        user_id = request.user.id

        get_all_childreens_id = self.get_all_children_from_a_store(
            request.user.id, 
            self.get_first_degree_children_from_storage(
                user_id=request.user.id, 
                storage_higher_level_id=storage_id, 
                storage_is_deleted=False
            )
        )

        # Change the status of deleted
        def deleted_status_change(self, storage_id,  user_id, storage_id_modification):
            storage = StorageOwner.objects.values('id', 'storage_is_favorite').filter(
                        storage_id=storage_id, 
                        user_id=user_id
                    ).first()

            if storage:
                status = bool(1 - int(storage['storage_is_favorite']))
            
                if not self.notified:
                    if status:
                        codename = 'favorited'
                    else:
                        codename = 'disfavored'

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
                    self.action = 'disfavored'
    
                StorageOwner.objects.filter(id=storage['id']).update(
                    storage_is_favorite=status
                )

        # Have you already saved the modification
        self.notified = False
        self.action = 'favorited'

        if not get_all_childreens_id:
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


