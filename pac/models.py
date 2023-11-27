from django.contrib.auth.models import User
from django.db import models

from spiu_gis.models import TblDistricts


class Activity(models.Model):
    district = models.ForeignKey(TblDistricts, on_delete=models.CASCADE, db_column='district_id', blank=True, null=True,
                                 verbose_name="District")
    activity_name = models.CharField(max_length=255)
    activity_address = models.TextField()
    activity_remarks = models.TextField(blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)


class Photo(models.Model):
    image = models.ImageField(upload_to='activity_photos/')
    image_name = models.CharField(max_length=255, blank=True, null=True)
    activities = models.ForeignKey(Activity, on_delete=models.CASCADE, blank=True, null=True)
