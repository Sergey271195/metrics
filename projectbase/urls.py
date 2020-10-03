
from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    # If you need admin panel
    #path('admin/', admin.site.urls),


    path('', include('frontend.urls')),
    path('api/', include('projectapi.urls'))
]
