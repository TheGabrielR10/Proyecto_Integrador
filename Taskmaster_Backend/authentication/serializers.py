from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'nombre', 'apellidos', 'email', 'direccion', 'cedula', 'estado']
       
       

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','nombre','apellidos','email', 'password','direccion', 'cedula', 'estado']
        extra_kwargs = {'password': {'write_only': True}}


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            nombre=validated_data['nombre'],
            apellidos=validated_data['apellidos'],
            email=validated_data['email'],
            direccion=validated_data['direccion'],
            cedula=validated_data['cedula'],
            estado=validated_data['estado'],
            password=validated_data['password'],
            
        )
        return user
    
class ContraUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        exclude = ['email', 'apellidos','username','cedula','direccion','nombre',]    

    
class UserUpdateSerializer(serializers. ModelSerializer):
    class Meta:
        model = User
        exclude = ['password', 'email']
        
       
        
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()   
    
    def validate_email(self, value):
        
        # Verificar si el correo existe en la base de datos
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No hay ningún usuario con este correo.")
        return value 

class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
