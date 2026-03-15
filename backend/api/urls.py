# backend/api/urls.py
from django.urls import path
from .views import (
    CategoryListView,
    HealthCheckView,
    AppUserListView,
    UserTaskListView,
    CompleteTaskView,
    UpdateTaskStatusView,
    ClassifyTaskView,
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("users/", AppUserListView.as_view(), name="user_list"),
    path("users/<int:user_id>/tasks/", UserTaskListView.as_view(), name="user_task_list"),
    path(
        "users/<int:user_id>/tasks/<int:task_id>/complete/",
        CompleteTaskView.as_view(),
        name="complete_task",
    ),
    path(
        "users/<int:user_id>/tasks/<int:task_id>/status/",
        UpdateTaskStatusView.as_view(),
        name="update_task_status",
    ),
    path(
        "users/<int:user_id>/tasks/classify/",
        ClassifyTaskView.as_view(),
        name="classify_task",
    ),
]
