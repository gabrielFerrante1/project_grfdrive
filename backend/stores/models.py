from django.db import models
from accounts.models import User


# Create your models here.
class Storage(models.Model):
    name = models.CharField(max_length=150) 
    extension = models.CharField(max_length=45, blank=True)
    size = models.CharField(max_length=150, blank=True) 
    description =  models.TextField(blank=True)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = 'storages'

class StorageOwner(models.Model):
    storage_password =  models.TextField(blank=True)
    storage_is_deleted = models.BooleanField(default=False)
    storage_is_favorite = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True) 
    storage_higher_level_id = models.IntegerField()
    storage = models.ForeignKey(Storage,  on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'storages_owner'

class StorageAction(models.Model):
    name = models.CharField(max_length=150) 
    codename = models.CharField(max_length=100, unique=True) 

    class Meta:
        db_table = 'storages_action'

class StorageModification(models.Model):
    visible_all = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True) 
    action_codename = models.ForeignKey(StorageAction, to_field='codename',  on_delete=models.CASCADE, db_column='action_codename')
    storage = models.ForeignKey(Storage,  on_delete=models.CASCADE)
    owner = models.ForeignKey(StorageOwner, on_delete=models.CASCADE)

    class Meta:
        db_table = 'storages_modification'

class StorageShare(models.Model):
    from_user_id = models.IntegerField()
    to_user_id = models.IntegerField()
    status = models.CharField(max_length=50)
    created_at =  models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = 'storages_share'

class StorageShareStorage(models.Model):
    share = models.ForeignKey(StorageShare, on_delete=models.CASCADE)
    storage = models.ForeignKey(Storage, on_delete=models.CASCADE) 

    class Meta:
        db_table = 'storages_share_storage'

class StorageOnlineEditors(models.Model): 
    storage = models.ForeignKey(Storage, on_delete=models.CASCADE) 
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    permission = models.CharField(max_length=20, default='full')
    editing_room = models.CharField(max_length=200)
    sid = models.TextField(default='')

    class Meta:
        db_table = 'storages_online_editors'
