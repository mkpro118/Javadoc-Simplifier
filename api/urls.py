from django.urls import path
from .views import home, api

urlpatterns = [
    path('', home, name='home'),
    path('api/<str:url>', api, name='api'),
]
