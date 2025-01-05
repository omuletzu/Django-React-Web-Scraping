from django.contrib.auth.models import User # type: ignore
from .models import Note
from rest_framework import serializers # type: ignore

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user_id', 'url', 'result', 'created_at', 'prompt']
        extra_kwargs = {'user_id' : {'required': True}, 'url': {'required': True}, 'result': {'required': True}}

    def create(self, validated_data):
        note = Note.objects.create(**validated_data)
        return note