# backend/api/urls.py
from django.urls import path
from .views import CategoryListView, HealthCheckView

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
]