from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models

from spiu_gis.models import TblDistricts, TblIndustryMainCategory, TblIndustryCategory

REPORT_TYPE = (
    ('Air', 'Stack Emission/ Air'),
    ('Noise', 'Noise'),
    ('Water', 'Liquid Effluent/ Water'),
    ('WWTP', 'Waste Water Treatment Plants'),
)


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


class TblReports(models.Model):
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
    report_title = models.CharField(max_length=254, default="Air", verbose_name="Report Title",
                                    choices=REPORT_TYPE)
    report_no = models.CharField(max_length=254, verbose_name="Sample/Report No")
    laboratory_name = models.ForeignKey(TblLaboratories, models.DO_NOTHING, verbose_name="Name of Laboratory")
    letter_no = models.CharField(max_length=254, verbose_name="Letter No")
    letter_date = models.DateField(verbose_name="Letter Date")
    letter_issued_by = models.CharField(max_length=254, verbose_name="Letter Issued By (Name & Designation)")
    name_industry = models.CharField(max_length=254, verbose_name="Name of Industry")
    address_industry = models.CharField(max_length=354, verbose_name="Address of Industry")
    district_id = models.ForeignKey(TblDistricts, models.DO_NOTHING, verbose_name="Name of District from Address")
    category = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING, verbose_name="Name of Category")
    sampling_source = models.CharField(max_length=254, default="Not Available", verbose_name="Sampling/Emission Source")
    monitoring_date = models.DateField(verbose_name="Monitoring Date")
    fuel_type = models.CharField(max_length=254, default="Not Available", verbose_name="Type of Fuel")
    emission_control_system = models.CharField(max_length=254, default="Not Available",
                                               verbose_name="Emission Control System")
    sample_monitored_by = models.CharField(max_length=254, verbose_name="Monitored By")
    # for water start
    sample_type = models.CharField(max_length=254, choices=SAMPLE_TYPE, default="Grab", verbose_name="Sample Type")
    sampling_point = models.CharField(max_length=254, default="Not Available", verbose_name="Sampling Point")
    treatment_facility = models.CharField(max_length=254, verbose_name="Treatment Facility", default="Not Available")
    treatment_facility_type = models.CharField(max_length=254, choices=TF_TYPES, verbose_name="Treatment Facility Type",
                                               default='Primary')
    process_generating_wastewater = models.CharField(max_length=254, default="Not Available",
                                                     verbose_name="Process Generating Waste Water")
    discharge = models.CharField(max_length=254, default="Not Available")
    sampling_date = models.DateField(verbose_name="Sample Date", blank=True, null=True)
    sample_receiving_date = models.DateField(verbose_name="Date of Sample Receiving in Lab", blank=True, null=True)
    sample_id_no = models.CharField(max_length=254, verbose_name="Sample ID No", blank=True, null=True)
    sample_received_from = models.CharField(max_length=254, verbose_name="Sample Received From", blank=True, null=True)
    sample_received_by = models.CharField(max_length=254, verbose_name="Sample Received By", blank=True, null=True)
    # for water end
    latitude = models.FloatField(verbose_name='latitude of sample location',
                                 help_text="up to 6 decimals between 25 to 40")
    longitude = models.FloatField(verbose_name='longitude of sample location',
                                  help_text="up to 6 decimals between 60 to 80")
    form_d_path = models.FileField(upload_to='form_d', verbose_name="Form-D")
    form_b_path = models.FileField(upload_to='form_b', verbose_name="Form-B")
    letter_path = models.FileField(upload_to='letters', verbose_name="Letter")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.report_no)

    class Meta:
        managed = True
        db_table = 'tbl_reports'
        verbose_name = "Report"
        verbose_name_plural = "Reports"


class TblReportsAnalysis(models.Model):
    REMARKS = (
        ('Complies PEQS', 'Complies PEQS'),
        ('Non Complies PEQS', 'Non Complies PEQS')
    )
    report_id = models.ForeignKey(TblReports, models.DO_NOTHING, verbose_name="Report ID")
    sample_id_no = models.CharField(max_length=254, blank=True, null=True)
    parameter = models.CharField(max_length=254)
    peqs_limit = models.CharField(max_length=254, verbose_name="PEQS Limit")
    concentration = models.FloatField(blank=True, null=True, verbose_name="Concentration/Results")
    method_used = models.CharField(max_length=254, verbose_name="Method Used")
    remarks = models.CharField(max_length=254, blank=True, null=True, choices=REMARKS, default="Complies PEQS")
    remarks_calculated = models.CharField(max_length=254, blank=True, null=True)
    report_type = models.CharField(max_length=254, blank=True, null=True, choices=REPORT_TYPE)

    def __str__(self):
        return self.parameter

    class Meta:
        managed = True
        db_table = 'tbl_reports_analysis'
        verbose_name = "Report Analysis"
        verbose_name_plural = "Reports Analysis"


class TblReportParameters(models.Model):
    parameter = models.CharField(max_length=254)
    peqs_limit = models.CharField(max_length=254)
    concentration = models.FloatField(blank=True, null=True, verbose_name="Results")
    method_used = models.CharField(max_length=254)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    report_type = models.CharField(max_length=254, blank=True, null=True, choices=REPORT_TYPE)

    def __str__(self):
        return self.parameter

    class Meta:
        managed = False
        db_table = 'tbl_reports_parameters'
        verbose_name = "Report Parameters"
        verbose_name_plural = "Report Parameters"

