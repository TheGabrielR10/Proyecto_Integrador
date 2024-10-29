from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Lista (models.Model):
    nombre = models.CharField(max_length=100)
    usuario  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) # Nuevo campo de usuario

    def __str__(self):
        return self.nombre

class Tarea(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField(blank=True, null=True)
    prioridad = models.CharField(max_length=10, choices=[('alta','Alta'),('media',  'Media'),('baja', 'Baja')])
    estado =  models.CharField(max_length=20, choices=[('pendiente', 'Pendiente'),('en_Progreso',  'En Progreso'),('completada', 'Completada')])
    lista = models.ForeignKey(Lista, related_name='tareas', on_delete=models.PROTECT)
    posicion = models.PositiveBigIntegerField()
    etiquetas = models.CharField(max_length=200, blank=True, null=True) #falta implementar en board
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Relación con el usuario

    def  __str__(self):
        return self.titulo
