from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellidos = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    cedula= models.CharField(max_length=10, unique=True)
    estado = models.BooleanField(default=True)

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def _str_(self):
        return self.email
