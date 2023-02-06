from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken 

from rest_framework.permissions import AllowAny 

from accounts.auth import Authentication

import os


class AccountLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
     
        user = Authentication.signin(self, email=email, password=password)
        refresh = RefreshToken.for_user(user)
      
        return Response({
            "error": "",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })


class AccountCreate(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = Authentication.signup(
            self, name=name, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        
        # Create content storage
        path = os.getcwd() + r'\assets\storages\storage_'+str(user.id)
        os.mkdir(path)

        return Response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
