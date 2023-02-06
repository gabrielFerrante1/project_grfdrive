from accounts.models import User
from rest_framework import exceptions
 
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

class Authentication():
    def signin(self, email=None, password=None): 
        exception_auth = exceptions.AuthenticationFailed(
            'Email e/ou senha incorretos')
        try:
            user = User.objects.get(email=email)
            user_password = user.password
            if check_password(password, user_password):
                return user
            else:
                raise exception_auth 
        except User.DoesNotExist:
            raise exception_auth

    def signup(self, name, email, password): 
        if not name or name == '':
           raise exceptions.APIException('Nome é um campo obrigatório') 
        if not email or email == '':
            raise exceptions.APIException('Email é um campo obrigatório')
        if not password or password == '':
            raise exceptions.APIException('Senha é um campo obrigatório')
 
        if User.objects.filter(email=email).exists():
           raise exceptions.APIException('Este email já existe na plataforma')

        password = make_password(password)
 
        user = User.objects.create(
            name=name,
            email=email,
            password=password
        )
 
        return user