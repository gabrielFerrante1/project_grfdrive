"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import eventlet.wsgi
import eventlet
import socketio
from core.socktes import socket
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application( )

application = socketio.WSGIApp(socket, application)


eventlet.wsgi.server(eventlet.listen(('', 8000)), application)
