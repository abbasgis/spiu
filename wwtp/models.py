from django.contrib.auth.models import User
from django.db import models
from django_admin_geomap import GeoItem

from spiu_gis.models import TblDistricts, TblIndustryCategory

TF_TYPES = (
    ('Primary', 'Primary'),
    ('Secondary', 'Secondary'),
    ('Tertiary', 'Tertiary'),
)


# Create your models here.
class WwtpDetail(models.Model, GeoItem):
    sno = models.IntegerField(blank=True, null=True)
    district_name = models.CharField(max_length=255)
    district = models.ForeignKey(TblDistricts, models.DO_NOTHING, db_column='district_id', blank=True, null=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    category_id = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING, db_column='category_id',
                                    verbose_name="Industry Category")
    wwtp_type = models.CharField(max_length=255, blank=True, null=True, choices=TF_TYPES, verbose_name="WWTP Type")
    remarks = models.CharField(max_length=255, blank=True, null=True, help_text="Write extra info, if any")
    # geom = models.GeometryField(srid=4326, blank=True, null=True)
    is_valid = models.BooleanField(default=False,verbose_name="Yes, confirmed", help_text="Please confirm that all the information above in this form is correct")
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    photo1_path = models.FileField(upload_to='wwtp_photo', verbose_name="Photo-1", blank=True, null=True,
                                   help_text="Attach Zoom Photo of Plant")
    photo2_path = models.FileField(upload_to='wwtp_photo', verbose_name="Photo-2", blank=True, null=True,
                                   help_text="Attach plant photo covering its surrounding")
    latitude = models.FloatField(verbose_name='latitude',
                                 help_text="up to 6 decimals between 25 to 40")
    longitude = models.FloatField(verbose_name='longitude',
                                  help_text="up to 6 decimals between 60 to 80")

    @property
    def geomap_longitude(self):
        return '' if self.longitude is None else str(self.longitude)

    @property
    def geomap_latitude(self):
        return '' if self.latitude is None else str(self.latitude)

    class Meta:
        managed = False
        db_table = 'wwtp_detail'
