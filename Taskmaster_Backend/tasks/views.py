from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Lista, Tarea
from .serializers import ListaSerializer, TareaSerializer

class ListaViewSet(viewsets.ModelViewSet):
    queryset = Lista.objects.all()
    serializer_class = ListaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar listas para que solo se muestren las del usuario autenticado
        return Lista.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asignar automáticamente el usuario autenticado al crear una lista
        serializer.save(usuario=self.request.user)

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar tareas para que solo se muestren las del usuario autenticado
        return Tarea.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asignar automáticamente el usuario autenticado al crear una tarea
        serializer.save(usuario=self.request.user)
