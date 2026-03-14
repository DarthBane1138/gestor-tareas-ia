# backend/api/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category
from .serializers import CategorySerializer

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
