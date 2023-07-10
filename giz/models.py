from django.db import models
from django.db.models import Q


# Create your models here.
class TblGizData(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)
    parent_name = models.CharField(max_length=255, blank=True, null=True)
    parent = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    org_id = models.IntegerField(blank=True, null=True)

    @classmethod
    def exclude_last_child(cls, parent_rows, child_ids):
        excluded_ids = set()
        for row in parent_rows:
            if row.parent_id in child_ids:
                excluded_ids.add(row.id)
        return parent_rows.exclude(id__in=excluded_ids)

    @classmethod
    def get_parent_rows_recursively(cls, child_ids):
        parent_rows = cls.objects.filter(id__in=child_ids).values('id', 'name', 'label', 'parent', 'level', 'org_id')
        parent_ids = parent_rows.values_list('parent', flat=True)
        if parent_ids:
            parent_rows = parent_rows.union(cls.get_parent_rows_recursively(parent_ids))
        return parent_rows

    class Meta:
        managed = False
        db_table = 'giz_data_inventory'


class TblOrganizations(models.Model):
    CATEGORY_TYPES = (
        ('intl', 'International'),
        ('govt', 'Government'),
        ('academia', 'Academia'),
        ('all', 'All'),
    )
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True, choices=CATEGORY_TYPES)
    parent_name = models.CharField(max_length=255, blank=True, null=True)
    category_level = models.CharField(max_length=255, blank=True, null=True)
    parent = models.IntegerField(blank=True, null=True)
    child_count = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'giz_organizations'
