
from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [

    # If you need admin panel
    #path('admin/', admin.site.urls),


    
    path('api/', include('projectapi.urls')),
    path('', include('frontend.urls')),
]
