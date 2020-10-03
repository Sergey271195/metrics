from django.urls import path
from .views import templateapiview

urlpatterns = [
    path('', templateapiview)
]