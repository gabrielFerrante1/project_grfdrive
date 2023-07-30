from django.urls import path

# Exec functions of editor sockets
import stores.sockets.editor_sockets

from .views.storages import Storages, StorageView

from .views.favorite_storages import StorageFavorites
from .views.garbage_storages import StorageDumps
from .views.upload_storages import StorageUploads
from .views.rename_storages import RenameStorages
from .views.password_storages import PasswordStorages
from .views.change_storages import StorageChange
from .views.share import ShareStorage, SharesStorage, ShareStorageReceive

urlpatterns = [
    path('',  Storages.as_view()),
    path('<int:storage_id>',  StorageView.as_view()),
    path('upload',  StorageUploads.as_view()), 
    path('<int:storage_id>/dumps',  StorageDumps.as_view()), 
    path('<int:storage_id>/favorites',  StorageFavorites.as_view()),
    
    path('<int:storage_id>/rename',  RenameStorages.as_view()),
    path('<int:storage_id>/password',  PasswordStorages.as_view()),
    path('<int:storage_id>/edit',  StorageChange.as_view()),
    
    path('shares', SharesStorage.as_view()),
    path('shares/<int:share_id>', ShareStorageReceive.as_view()), 
    path('<int:storage_id>/shares', ShareStorage.as_view()), 
]
