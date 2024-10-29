from rest_framework import serializers
from .models import Lista, Tarea

class ListaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lista
        fields = ['id', 'nombre']  # No incluyas 'usuario' aquí para que no sea modificable por el cliente

class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = ['id', 'titulo', 'descripcion', 'fecha_creacion', 'fecha_vencimiento', 'prioridad', 'estado', 'lista', 'posicion', 'etiquetas']

