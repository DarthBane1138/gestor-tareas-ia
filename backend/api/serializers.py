from rest_framework import serializers
from .models import AppUser, Category, Task

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('category_id', 'description')

class AppUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = AppUser
        fields = ('user_id', 'first_name', 'last_name', 'full_name')
    
    def get_full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()

class TaskSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.description', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ('task_id', 'title', 'description', 'status', 'category', 'full_name')
    
    def get_full_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'.strip()