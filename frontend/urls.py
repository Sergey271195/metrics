from django.urls import path, include
from .views import mainview


urlpatterns = [
    path('', mainview)
]