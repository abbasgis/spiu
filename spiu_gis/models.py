from django.contrib.auth.models import User
from django.contrib.gis.db import models


class SpiuProfile(models.Model):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    mobile_no = models.BigIntegerField(blank=True, null=True)
    cnic = models.CharField(max_length=32, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    user = models.OneToOneField(User, models.DO_NOTHING)
    is_disclaimer_agreed = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'spiu_profile'


# Create your models here.
class TblDivisions(models.Model):
    #  gid = models.AutoField()
    division_id = models.AutoField(primary_key=True)
    division_name = models.CharField(max_length=254)
    division_code = models.CharField(max_length=254)
    geom = models.GeometryField(srid=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tbl_divisions'


class TblDistricts(models.Model):
    # gid = models.AutoField()
    district_id = models.AutoField(primary_key=True)
    division = models.ForeignKey('TblDivisions', models.DO_NOTHING)
    district_name = models.CharField(max_length=254)
    district_code = models.CharField(max_length=254)
    geom = models.GeometryField(srid=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tbl_districts'


class TblTehsils(models.Model):
    # gid = models.AutoField()
    tehsil_id = models.AutoField(primary_key=True)
    district = models.ForeignKey(TblDistricts, models.DO_NOTHING)
    division = models.ForeignKey(TblDivisions, models.DO_NOTHING)
    tehsil_name = models.CharField(max_length=254)
    tehsil_code = models.CharField(unique=True, max_length=254)
    geom = models.GeometryField(srid=0, blank=True, null=True)
    extent = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tbl_tehsils'


class TblPoultryFarms(models.Model):
    sr_no = models.IntegerField(blank=True, null=True)
    times_tamp = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=255, blank=True, null=True)
    district_incharge = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    name_entry_person = models.CharField(max_length=255, blank=True, null=True)
    name_poultry_farm = models.CharField(max_length=255, blank=True, null=True)
    type_poultry_farm = models.CharField(max_length=255, blank=True, null=True)
    area_poultry_farm = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    environmental_approval_obtained = models.CharField(max_length=255, blank=True, null=True)
    environmental_approval_date = models.CharField(max_length=255, blank=True, null=True)
    geom = models.GeometryField(blank=True, null=True)

    # objects = models.GeoManager()

    class Meta:
        managed = False
        db_table = 'tbl_poultry_farms'
        verbose_name_plural = 'Poultry Farms'
