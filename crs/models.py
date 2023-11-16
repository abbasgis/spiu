from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db import models
from django_admin_geomap import GeoItem

from spiu_gis.models import TblDistricts


# Create your models here.
class CrsComplaintsDetail(models.Model, GeoItem):
    SOURCE_CHOICES = (
        ('PMDU', 'PMDU'), ('DC Office', 'DC Office'), ('MC', 'MC'),
        ('By hand EPD/Head office', 'By hand EPD/Head office'),
        ('Receive at EPD+PMDU', 'Receive at EPD+PMDU'), ('Ombudsman', 'Ombudsman'),
        ('any other source', 'any other source'),
    )
    ENV_ISSUE_CHOICES = (('Air', 'Air Pollution'),)
    complaint_number = models.IntegerField(blank=True, null=True)
    district_name = models.CharField(max_length=255)
    district = models.ForeignKey(TblDistricts, models.DO_NOTHING, db_column='district_id', blank=True, null=True)
    complainant_name = models.CharField(max_length=255, verbose_name='Complainant Name')
    complainant_mobile = models.CharField(max_length=255, verbose_name='Complainant Mobile #')
    complainant_address = models.CharField(max_length=255, verbose_name='Complainant Address')
    complaint_source = models.CharField(max_length=255, choices=SOURCE_CHOICES, verbose_name='Complaint Source')
    unit_name = models.CharField(max_length=255, verbose_name='Unit Name')
    unit_address = models.CharField(max_length=255, verbose_name='Unit Address')
    latitude = models.FloatField(verbose_name='Unit Latitude')
    longitude = models.FloatField(verbose_name='Unit Longitude')
    air_pollution = models.BooleanField(default=False, verbose_name='Air Pollution')
    noise_pollution = models.BooleanField(default=False, verbose_name='Noise Pollution')
    hazardous_waste = models.BooleanField(default=False, verbose_name='Hazardous Waste')
    municipal_solid_waste = models.BooleanField(default=False, verbose_name='Municipal Solid Waste')
    noc_cancellation = models.BooleanField(default=False, verbose_name='Cancellation of NOC')
    operation_without_noc = models.BooleanField(default=False, verbose_name='Operation Without NOC ')
    untreated_waste_water = models.BooleanField(default=False, verbose_name='Untreated Waste Water')
    sub_standard_fuel = models.BooleanField(default=False, verbose_name='Sub-standard  Fuel Used')
    soil_pollution = models.BooleanField(default=False, verbose_name='Soil Pollution')
    land_degradation = models.BooleanField(default=False, verbose_name='Land Degradation')
    other_issue = models.BooleanField(default=False, verbose_name='Other Issue')
    preliminary_examination = models.BooleanField(default=False, verbose_name='Preliminary Examination')
    hearing_notice_issued = models.BooleanField(default=False, verbose_name='Hearing Notice Issued')
    hearing_notice_date = models.DateField(null=True, blank=True,verbose_name='Hearing Notice Date')
    smr_issued = models.BooleanField(default=False, verbose_name='SMR Issued?')
    smr_date = models.DateField(null=True, blank=True, verbose_name='SMR Date')
    epo_issued = models.BooleanField(default=False, verbose_name='EPO Issued')
    epo_date = models.DateField(null=True, blank=True, verbose_name='EPO Date')
    under_trial = models.BooleanField(default=False, verbose_name='Under Trial PET')
    final_decision = models.BooleanField(default=False, verbose_name='Final Decision of PET')
    sealed = models.BooleanField(default=False)
    desealed = models.BooleanField(default=False)
    firs_arrested = models.BooleanField(default=False, verbose_name='FIRs/ Person Arrested')
    complaint_resolved = models.BooleanField(default=False, verbose_name='Complaint Resolved')
    fine_court_or_staff = models.BooleanField(default=False, verbose_name='Fine by Court or Staff')
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    created_by = models.IntegerField(blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)

    @property
    def geomap_longitude(self):
        return '' if self.longitude is None else str(self.longitude)

    @property
    def geomap_latitude(self):
        return '' if self.latitude is None else str(self.latitude)

    class Meta:
        managed = True
        db_table = 'crs_complaints_detail'
        verbose_name = ' Environmental Complaint'
        verbose_name_plural = ' Environmental Complaints'
