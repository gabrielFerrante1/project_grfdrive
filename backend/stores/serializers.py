from rest_framework import serializers
from .models import Storage, StorageOwner, StorageModification, StorageShare
from accounts.models import User
 

class StoragesSerializer(serializers.ModelSerializer): 
    is_protected = serializers.SerializerMethodField(read_only=True) 
    owner = serializers.SerializerMethodField(read_only=True)  

    class Meta:
        model = Storage
        fields = [ 'id', 'name',  'extension',  'type', 'size', 'is_protected',  'owner']

    def get_is_protected(self, obj):
        request = self.context.get("request") 

        return password_exists(request.user, obj)

    def get_owner(self, obj):
        return get_owner(self, obj)



class StorageSerializer(serializers.ModelSerializer): 
    is_protected = serializers.SerializerMethodField(read_only=True)
    owner = serializers.SerializerMethodField(read_only=True)
    created_at = serializers.SerializerMethodField(read_only=True)
 
    class Meta:
        model = Storage
        fields = [ 'id', 'name',  'extension',  'type', 'size', 'is_protected',  'owner', 'description', 'created_at']

    def get_is_protected(self, obj):
        request = self.context.get("request") 

        return password_exists(request.user, obj)

    def get_owner(self, obj):
        return get_owner(self, obj)

    def get_created_at(self, obj):
        get_owner = StorageOwner.objects.values('created_at').filter(storage_id=obj.id, is_owner=True).first()

        return  get_owner['created_at'].strftime("%d/%m/%y - %H:%M")

class StorageModificationSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)
    date = serializers.SerializerMethodField(read_only=True)
    action = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StorageModification
        fields = (  
            'date',
            'action',
            'owner',
        ) 

    def get_action(self, obj): 
        return obj.action_codename.name

    def get_date(self, obj):
        return obj.created_at.strftime("%d/%m/%y - %H:%M")
    
    def get_owner(self, obj):
        user = self.context.get("request").user
        user_email = {
            'id': user.id,
            'email': user.email
        }

        if not user.is_authenticated:
            return user_email

        get_owner = StorageOwner.objects.values('user_id').filter(id=obj.owner_id ).first()

        if get_owner['user_id'] == user.id:
            return user_email

        if get_owner:
            owner_user = User.objects.values('id', 'email').filter(id=get_owner['user_id']).first()
            user_email = {
                'id': owner_user['id'],
                'email': owner_user['email']
            }
        
        return user_email


class StorageShareSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField(read_only=True) 
    to_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StorageShare
        fields = ( 
            'id',
            'to_user',
            'status',
            'date', 
        ) 
 
    def get_to_user(self, obj):
        user  = User.objects.filter(id=obj.to_user_id).first()
        return user.email

    def get_date(self, obj):
        return obj.created_at.strftime("%d/%m/%y - %H:%M") 



def password_exists(user, obj):
    if not user.is_authenticated:
        return False

    user_id = user.id
    if StorageOwner.objects.filter(storage_id=obj.id, user_id=user_id, storage_password__exact='').exists():
        return False
 
    return True

def get_owner(self, obj):
    user = self.context.get("request").user
    user_email = {
        'id': user.id,
        'email': user.email
    }

    if not user.is_authenticated:
        return user_email

    get_owner = StorageOwner.objects.values('user_id').filter(storage_id=obj.id, is_owner=True).first()

    if get_owner['user_id'] == user.id:
        return user_email

    if get_owner:
        owner_user = User.objects.values('id', 'email').filter(id=get_owner['user_id']).first()
        user_email = {
            'id': owner_user['id'],
            'email': owner_user['email']
        }
    
    return user_email
