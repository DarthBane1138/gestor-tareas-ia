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


class TaskClassificationRequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200, trim_whitespace=True)
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('El título es obligatorio.')
        return value


class TaskClassificationResponseSerializer(serializers.Serializer):
    suggested_category_id = serializers.IntegerField(min_value=1)
    suggested_category = serializers.CharField(max_length=255)
    confidence = serializers.FloatField(min_value=0.0, max_value=1.0)
    reason = serializers.CharField()
    provider = serializers.CharField(max_length=50)
    model = serializers.CharField(max_length=100)


class TaskClassificationErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()
    code = serializers.CharField()
