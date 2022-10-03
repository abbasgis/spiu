from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models

from spiu_gis.models import TblDistricts, TblIndustryMainCategory, TblIndustryCategory


class TblLaboratories(models.Model):
    DESIGNATION = (
        ('AD', 'Assistant Director (Lab)'),
        ('DD', 'Deputy Director (Lab)'),
    )
    lab_name = models.CharField(max_length=254)
    officer_name = models.CharField(max_length=254)
    designation = models.CharField(max_length=255, blank=True, null=True, choices=DESIGNATION)
    district_id = models.ForeignKey(TblDistricts, on_delete=models.CASCADE, db_column='district_id', blank=True,
                                    null=True, verbose_name="District")
    email = models.EmailField(max_length=254)
    # mobile_no = models.IntegerField(blank=True, null=True, help_text="3334567788")
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: '03000000000'. Up to 11 digits allowed.")
    mobile_no = models.CharField(validators=[phone_regex], max_length=11, blank=True,
                                 null=True)  # validators should be a list
    address = models.CharField(max_length=254, blank=True, null=True)
    area_of_jurisdiction = models.CharField(max_length=254, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.lab_name)

    class Meta:
        managed = False
        db_table = 'tbl_laboratories'
        ordering = ['lab_name', ]
        verbose_name_plural = "Laboratories Detail"


class TblReportsWasteWater(models.Model):
    REPORT_TITLE = (
        ('Waste Water', 'Waste Water'),
        ('Surface Water', 'Surface Water')
    )
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
    report_title = models.CharField(max_length=254, default="Waste Water", verbose_name="Report Title")
    laboratory_name = models.ForeignKey(TblLaboratories, models.DO_NOTHING, verbose_name="Name of Laboratory")
    letter_no = models.CharField(max_length=254, verbose_name="Letter No")
    letter_date = models.DateField(verbose_name="Letter Date")
    letter_issued_by = models.CharField(max_length=254, blank=True, null=True, verbose_name="Letter Issued By")
    name_industry = models.CharField(max_length=254, verbose_name="Name of Industry")
    address_industry = models.CharField(max_length=354, verbose_name="Address of Industry")
    district_id = models.ForeignKey(TblDistricts, models.DO_NOTHING, verbose_name="Name of District from Address")
    category = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING, verbose_name="Name of Category")
    sample_type = models.CharField(max_length=254, choices=SAMPLE_TYPE, default="Grab", verbose_name="Sample Type")
    sampling_point = models.CharField(max_length=254, default="Not Provided", verbose_name="Sampling Point")
    treatment_facility = models.CharField(max_length=254, verbose_name="Treatment Facility")
    treatment_facility_type = models.CharField(max_length=254, choices=TF_TYPES, verbose_name="Treatment Facility Type")
    process_generating_wastewater = models.CharField(max_length=254, default="Not Provided",
                                                     verbose_name="Process Generating Waste Water")
    discharge = models.CharField(max_length=254, default="Not Provided")
    sampling_date = models.DateField(verbose_name="Sample Date")
    sample_receiving_date = models.DateField(blank=True, null=True, verbose_name="Date of Sample Receiving in Lab")
    sample_id_no = models.CharField(max_length=254, verbose_name="Sample ID No")
    sample_received_from = models.CharField(max_length=254, verbose_name="Sample Received From")
    sample_received_by = models.CharField(max_length=254, verbose_name="Sample Received By")
    form_d_path = models.FileField(upload_to='form_d', verbose_name="Form-D")
    form_b_path = models.FileField(upload_to='form_b', verbose_name="Form-B")
    letter_path = models.FileField(upload_to='letters', verbose_name="Letter")
    latitude = models.FloatField(blank=True, null=True,
                                 help_text="up to 6 decimals between 25 to 40")
    longitude = models.FloatField(blank=True, null=True,
                                  help_text="up to 6 decimals between 60 to 80")

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.sample_id_no)

    class Meta:
        managed = True
        db_table = 'tbl_reports_waste_water'
        verbose_name = "Waste Water Report"
        verbose_name_plural = "Waste Water Reports"


class TblLabAnalysisWasteWater(models.Model):
    REMARKS = (
        ('Complies PEQS', 'Complies PEQS'),
        ('Non Complies PEQS', 'Non Complies PEQS')
    )
    report_id = models.ForeignKey(TblReportsWasteWater, models.DO_NOTHING,verbose_name="Report ID")
    sample_id_no = models.CharField(max_length=254)
    parameter = models.CharField(max_length=254)
    peqs_limit = models.CharField(max_length=254, verbose_name="PEQS Limit")
    concentration = models.FloatField(blank=True, null=True)
    method_used = models.CharField(max_length=254, verbose_name="Method Used")
    remarks = models.CharField(max_length=254, blank=True, null=True, choices=REMARKS, default="Complies PEQS")
    remarks_calculated = models.CharField(max_length=254, blank=True, null=True)

    def __str__(self):
        return self.parameter

    class Meta:
        managed = True
        db_table = 'tbl_lab_analysis_waste_water'
        verbose_name = "Lab Analysis Waste Water"
        verbose_name_plural = "Lab Analysis Waste Water"


class TblWasteWaterParameters(models.Model):
    parameter = models.CharField(max_length=254)
    peqs_limit = models.CharField(max_length=254)
    concentration = models.FloatField(blank=True, null=True)
    method_used = models.CharField(max_length=254)
    remarks = models.CharField(max_length=254, blank=True, null=True)

    def __str__(self):
        return self.parameter

    class Meta:
        managed = False
        db_table = 'tbl_waste_water_parameters'
        verbose_name = "Waste Water Parameters"
        verbose_name_plural = "Waste Water Parameters"
