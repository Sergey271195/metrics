from django.urls import path
from .views import tokenview

urlpatterns = [
    path('token/', tokenview)
]