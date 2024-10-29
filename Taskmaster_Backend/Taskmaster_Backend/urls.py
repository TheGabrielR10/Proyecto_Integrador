"""
URL configuration for Taskmaster_Backend project.
"""
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),   # Incluye rutas de la aplicaion
    path('api/auth/', include('authentication.urls')),
    
]
