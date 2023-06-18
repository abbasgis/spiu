from django.db import models


# Create your models here.
class TblGizData(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    label = models.CharField(max_length=255, blank=True, null=True)
    parent_name = models.CharField(max_length=255, blank=True, null=True)
    parent = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    org_id = models.IntegerField(blank=True, null=True)

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
