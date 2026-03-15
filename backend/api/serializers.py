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

class TaskReadSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.description', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ('task_id', 'title', 'description', 'status', 'category', 'full_name')
    
    def get_full_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'.strip()


class TaskWriteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Task
        fields = ('title', 'description', 'status', 'category_id')
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True, 'allow_null': True},
            'status': {'required': False},
        }

    def validate_status(self, value):
        if value == 'Completada':
            raise serializers.ValidationError('Una tarea no puede crearse como Completada.')
        return value
