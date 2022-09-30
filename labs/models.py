from django.contrib.auth.models import User
from django.db import models

from spiu_gis.models import TblDistricts, TblIndustryMainCategory, TblIndustryCategory


class TblReportsWasteWater(models.Model):
    SAMPLE_TYPE = (
        ('Grab', 'Grab'),
        ('Composite', 'Composite')
    )
    TF_TYPES = (
        ('Primary', 'Primary'),
        ('Secondary', 'Secondary'),
        ('Tertiary', 'Tertiary'),
    )
    # gid = models.AutoField()
    laboratory_name = models.CharField(max_length=254)
    letter_no = models.CharField(max_length=254)
    letter_date = models.DateField(blank=True, null=True)
    name_industry = models.CharField(max_length=254)
    district_id = models.ForeignKey(TblDistricts, models.DO_NOTHING, verbose_name="Name of District")
    main_category = models.ForeignKey(TblIndustryMainCategory, models.DO_NOTHING,
                                      verbose_name="Name of Main Category")
    category = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING,
                                 verbose_name="Name of Category")
    address_industry = models.CharField(max_length=354)
    sample_type = models.CharField(max_length=254, choices=SAMPLE_TYPE)
    sampling_point = models.CharField(max_length=254)
    treatment_facility = models.CharField(max_length=254, choices=TF_TYPES)
    treatment_facility_description = models.CharField(max_length=254)
    process_generating_wastewater = models.CharField(max_length=254)
    discharge = models.CharField(max_length=254, blank=True, null=True)
    sampling_date = models.DateField(blank=True, null=True)
    sample_receiving_date = models.DateField(blank=True, null=True)
    sample_id_no = models.CharField(max_length=254)
    sample_received_from = models.CharField(max_length=254)
    sample_received_by = models.CharField(max_length=254)
    form_d_path = models.FileField(upload_to='form_d')
    form_b_path = models.FileField(upload_to='form_b')
    letter_path = models.FileField(upload_to='letters')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tbl_reports_waste_water'
        verbose_name_plural = "Waste Water Reports"


class TblLabAnalysisWasteWater(models.Model):
    report_id = models.ForeignKey(TblReportsWasteWater, models.DO_NOTHING)
    sample_id_no = models.CharField(max_length=254)
    parameter = models.CharField(max_length=254)
    peqs_limit = models.CharField(max_length=254)
    concentration = models.FloatField(blank=True, null=True)
    method_used = models.CharField(max_length=254)
    remarks = models.CharField(max_length=254)

    class Meta:
        managed = True
        db_table = 'tbl_lab_analysis_waste_water'
        verbose_name_plural = "Lab Analysis Waste Water"
