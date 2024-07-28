from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Session

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ["date", "goal", "reflection", "self_evaluation", "score", "user", "type"]
        extra_kwargs = {"user": {"read_only": True}}