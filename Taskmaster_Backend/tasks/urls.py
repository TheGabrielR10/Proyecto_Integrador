from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListaViewSet, TareaViewSet

router = DefaultRouter()
router.register(r'listas', ListaViewSet)
router.register(r'tareas', TareaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
