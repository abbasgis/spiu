from django.contrib.auth.models import User
from django.db import models


# Create your models here.

class ProjectCategory(models.Model):
    name = models.CharField(max_length=254)
    description = models.CharField(max_length=254, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = True


class ProjectSubCategory(models.Model):
    name = models.CharField(max_length=254)
    description = models.CharField(max_length=254, blank=True, null=True)
    project_category_id = models.ForeignKey(ProjectCategory, models.DO_NOTHING)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = True
