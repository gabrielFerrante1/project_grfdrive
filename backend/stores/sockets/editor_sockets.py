from core.socktes import socket  

from accounts.models import User 

from stores.models import StorageOnlineEditors, StorageOwner
 

@socket.event
def enter_editing_room(sid, data): 
    storageId = data['storageId']
    userId = data['userId']

    room = f'editing_room_{storageId}'

    socket.enter_room(sid, room)

    if not StorageOnlineEditors.objects.filter(storage_id=storageId, user_id=userId).exists():
        StorageOnlineEditors.objects.create(
            storage_id=storageId,
            user_id=userId,
            editing_room=room,
            sid=sid
        )
     
    emitOnlineEditors(storageId, room)

@socket.event
def kick_editing_room(sid, data):
    storageId = data['storageId']
    userId = data['userId']

    socket.emit(f'kick_{userId}_editing_room_{storageId}', '')

    editor = StorageOnlineEditors.objects.values('storage_id', 'editing_room').filter(storage_id=storageId, user_id=userId).first()

    if editor:
        StorageOnlineEditors.objects.filter(storage_id=storageId, user_id=userId).delete()

        emitOnlineEditors(editor['storage_id'], editor['editing_room']) 

@socket.event
def revoke_file_access(sid, data):
    storageId = data['storageId']
    userId = data['userId']

    StorageOwner.objects.filter(storage_id=storageId, user_id=userId).delete()

    socket.emit(f'kick_{userId}_editing_room_{storageId}', '')

    editor = StorageOnlineEditors.objects.values('storage_id', 'editing_room').filter(storage_id=storageId, user_id=userId).first()

    if editor:
        StorageOnlineEditors.objects.filter(storage_id=storageId, user_id=userId).delete()

        emitOnlineEditors(editor['storage_id'], editor['editing_room']) 

@socket.event
def disconnect(data):
    editor = StorageOnlineEditors.objects.values('storage_id', 'editing_room').filter(sid=data).first()

    if editor:
        StorageOnlineEditors.objects.filter(sid=data).delete()

        emitOnlineEditors(editor['storage_id'], editor['editing_room']) 
 

def emitOnlineEditors(storage_id, room):
    onlineEditors = StorageOnlineEditors.objects.values('user_id').filter(storage_id=storage_id).all()
    editorsUser = []

    for editor in onlineEditors:
        user = User.objects.values('id', 'name', 'email').filter(id=editor['user_id']).first()
        editorsUser.append({
            'id': user['id'],
            'name': user['name'],
            'email': user['email']
        })

    socket.emit('online_editors', room=room, data=editorsUser)