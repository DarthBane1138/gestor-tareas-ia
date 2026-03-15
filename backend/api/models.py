from django.db import models

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'category'
        managed = False

class AppUser(models.Model):
    user_id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'app_user'
        managed = False

class Task(models.Model):
    task_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AppUser, models.DO_NOTHING, db_column='user_id', related_name='tasks')
    category = models.ForeignKey(Category, models.DO_NOTHING, db_column='category_id', related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        db_table = 'task'
        managed = False