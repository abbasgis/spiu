from django.contrib.auth.models import User
from django.db import models
from django_admin_geomap import GeoItem

from spiu_gis.models import TblTehsils, TblIndustryCategory


class IndustryDetail(models.Model, GeoItem):
    name_industry = models.CharField(max_length=254, verbose_name="Name of Industry")
    address_industry = models.CharField(max_length=354, verbose_name="Address of Industry")
    tehsil_name = models.ForeignKey(TblTehsils, models.DO_NOTHING, verbose_name="Name of Tehsil from Address")
    project_sub_category = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING, verbose_name="Industrial Category")
    latitude = models.FloatField(verbose_name='latitude of sample location',
                                 help_text="up to 6 decimals between 25 to 40")
    longitude = models.FloatField(verbose_name='longitude of sample location',
                                  help_text="up to 6 decimals between 60 to 80")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', )
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.name_industry)

    @property
    def geomap_longitude(self):
        return '' if self.longitude is None else str(self.longitude)

    @property
    def geomap_latitude(self):
        return '' if self.latitude is None else str(self.latitude)

    class Meta:
        managed = True
