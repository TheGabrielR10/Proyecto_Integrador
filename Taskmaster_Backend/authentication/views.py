from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer,PasswordResetRequestSerializer,SetNewPasswordSerializer,UserUpdateSerializer,ContraUpdateSerializer 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.views import PasswordResetView

from rest_framework.views import APIView
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.urls import reverse
from .tokens import custom_token_generator  # Token personalizado
from django.utils.http import urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
class UserUpdateView (generics.UpdateAPIView):
    queryset= User.objects.all()
    serializer_class = UserUpdateSerializer 
    
class UdatContraseñaView(generics.UpdateAPIView) :
    queryset = User.objects.all()
    serializer_class = ContraUpdateSerializer 

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'id':user.id,
            'username': user.username,
            'nombre': user.nombre,
            'cedula':user.cedula,
            'apellidos': user.apellidos,
            'direccion': user.direccion,
            'email': user.email,
            'estado': user.estado
        }
        return Response(user_data)
    
    

@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetView(PasswordResetView):
    pass

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Comprobar la contraseña antigua
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": "Incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

            # Cambiar la contraseña
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "Contraseña actualizada con éxito"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetCompleteView(APIView):
    def get(self, request):
        return Response({"message": "Tu contraseña ha sido restablecida con éxito."}, status=status.HTTP_200_OK)
    
    

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            # Generar el token de restablecimiento de contraseña
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = custom_token_generator.make_token(user)

            # Crear el enlace de restablecimiento de contraseña
            reset_link = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            reset_url = f"http://localhost:3000/api/auth/password-reset-confirm/{uid}/{token}/"

            # Enviar el correo electrónico
            subject = 'Recuperación de contraseña'
            message = render_to_string('password_reset_email.html', {
                'user': user,
                'reset_url': reset_url,
            })
            send_mail(subject, message, 'noreply@myapp.com', [email])

            return Response({"message": "Correo de recuperación de contraseña enviado."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            # Decodificar el UID del usuario
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            logger.info(f"UID decoded successfully: {uid}")
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            logger.error("Invalid UID")
            return Response({"error": "Enlace inválido."}, status=status.HTTP_400_BAD_REQUEST)


        # Verificar si el token es válido
        if not custom_token_generator.check_token(user, token):
            logger.error("Token is invalid or expired")
            return Response({"error": "El enlace para restablecer la contraseña es inválido o ha expirado."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el token es válido, permitir al usuario cambiar la contraseña
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            logger.info ("Password reset successfull")
            return Response({"message": "La contraseña ha sido restablecida con éxito."}, status=status.HTTP_200_OK)
        logger.error("invalid data in SetNewPasswordSerializer")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
