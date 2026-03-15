# backend/api/urls.py
from django.urls import path
from .views import CategoryListView, HealthCheckView, AppUserListView, UserTaskListView

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("users/", AppUserListView.as_view(), name="user_list"),
    path("users/<int:user_id>/tasks/", UserTaskListView.as_view(), name="user_task_list"),
]