# backend/api/views.py
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, AppUser, Task
from .serializers import (
    CategorySerializer,
    AppUserSerializer,
    TaskReadSerializer,
    TaskWriteSerializer,
)

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

class AppUserListView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = AppUserSerializer
    queryset = AppUser.objects.all().order_by('first_name', 'last_name')

class UserTaskListView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return (
            Task.objects
            .select_related('user', 'category')
            .filter(user_id=user_id)
            .order_by('task_id')
        )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TaskWriteSerializer
        return TaskReadSerializer

    def perform_create(self, serializer):
        serializer.save(user_id=self.kwargs['user_id'])


class CompleteTaskView(APIView):
    authentication_classes = []
    permission_classes = []

    def patch(self, request, user_id, task_id):
        task = Task.objects.filter(task_id=task_id, user_id=user_id).first()
        if not task:
            return Response(
                {"detail": "Tarea no encontrada para este usuario."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if task.status == "Completada":
            serializer = TaskReadSerializer(task)
            return Response(serializer.data, status=status.HTTP_200_OK)

        task.status = "Completada"
        task.save(update_fields=["status"])

        serializer = TaskReadSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateTaskStatusView(APIView):
    authentication_classes = []
    permission_classes = []
    allowed_statuses = {"Pendiente", "En progreso", "Completada"}

    def patch(self, request, user_id, task_id):
        task = Task.objects.filter(task_id=task_id, user_id=user_id).first()
        if not task:
            return Response(
                {"detail": "Tarea no encontrada para este usuario."},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get("status")
        if new_status not in self.allowed_statuses:
            return Response(
                {
                    "detail": "Estado inválido.",
                    "allowed_statuses": sorted(self.allowed_statuses),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if task.status != new_status:
            task.status = new_status
            task.save(update_fields=["status"])

        serializer = TaskReadSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
