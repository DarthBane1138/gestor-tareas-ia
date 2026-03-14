from django.db import models

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'category'
        managed = False