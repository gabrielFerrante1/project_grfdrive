from django.urls import path
from .views import AccountLogin, AccountCreate
urlpatterns = [
    path('login', AccountLogin.as_view()),
    path('register', AccountCreate.as_view()),
]
