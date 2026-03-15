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
    TaskClassificationRequestSerializer,
    TaskClassificationResponseSerializer,
)
from .services.task_classifier import (
    LangChainTaskClassifier,
    TaskClassifierError,
    TaskClassifierUnavailableError,
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


class ClassifyTaskView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, user_id):
        if not AppUser.objects.filter(user_id=user_id).exists():
            return Response(
                {"detail": "Usuario no encontrado.", "code": "user_not_found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        request_serializer = TaskClassificationRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            first_error = next(iter(request_serializer.errors.values()))
            detail = first_error[0] if isinstance(first_error, list) else str(first_error)
            return Response(
                {"detail": detail, "code": "validation_error"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        categories = list(
            Category.objects.order_by("category_id").values("category_id", "description")
        )
        if not categories:
            return Response(
                {"detail": "No hay categorias disponibles.", "code": "validation_error"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        classifier = LangChainTaskClassifier()
        payload = request_serializer.validated_data
        try:
            result = classifier.classify_task(
                title=payload["title"],
                description=payload.get("description"),
                categories=categories,
            )
        except (TaskClassifierUnavailableError, TaskClassifierError):
            return Response(
                {
                    "detail": "Servicio de clasificacion no disponible.",
                    "code": "ai_unavailable",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        category_map = {category["category_id"]: category["description"] for category in categories}
        response_payload = {
            "suggested_category_id": result.suggested_category_id,
            "suggested_category": category_map[result.suggested_category_id],
            "confidence": result.confidence,
            "reason": result.reason,
            "provider": result.provider,
            "model": result.model,
        }
        response_serializer = TaskClassificationResponseSerializer(data=response_payload)
        response_serializer.is_valid(raise_exception=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
