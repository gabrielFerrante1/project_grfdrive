import socketio

 
socket = socketio.Server(cors_allowed_origins='*')
 
@socket.event
def connect(sid, environ):
    #socket.emit('ping', {'response': 'my response'})
    ...
 
"""@socket.event
def message(sid, data):
    print(data)
    
    socket.enter_room(sid, 'chat_users')
    #socket.emit('ping', {'response': 'my response'})
    pass """

"""""""""""

CUIDADO EM CRIAR SALAS AUTOMATICAS, POIS SE FIZER ISSO ELE PODE DUPLICAR A SALA, SEMPRE UTILIZE UM BOTÂO PARA CONBTROLAR A QUANTIDADE DE SALAS


"""