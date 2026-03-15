# backend/api/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, AppUser, Task
from .serializers import CategorySerializer, AppUserSerializer, TaskSerializer

class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok"})

class CategoryListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by('category_id')

class AppUserListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = AppUserSerializer
    queryset = AppUser.objects.all().order_by('first_name', 'last_name')

class UserTaskListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = TaskSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return (
            Task.objects
            .select_related('user', 'category')
            .filter(user_id=user_id)
            .order_by('task_id')
        )
