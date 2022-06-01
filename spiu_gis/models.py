from django.contrib.auth.models import User
from django.contrib.gis.db import models
from django.core.validators import RegexValidator


class TblDivisions(models.Model):
    #  gid = models.AutoField()
    division_id = models.AutoField(primary_key=True)
    division_name = models.CharField(max_length=254)
    division_code = models.CharField(max_length=254)

    # geom = models.GeometryField(srid=0, blank=True, null=True)

    def __str__(self):
        return self.division_name

    class Meta:
        managed = False
        db_table = 'tbl_divisions'


class TblDistricts(models.Model):
    # gid = models.AutoField()
    district_id = models.IntegerField(primary_key=True)
    division = models.ForeignKey('TblDivisions', models.DO_NOTHING)
    district_name = models.CharField(max_length=254)
    district_code = models.CharField(max_length=254)

    # geom = models.GeometryField(srid=0, blank=True, null=True)

    def __str__(self):
        return self.district_name

    class Meta:
        managed = False
        db_table = 'tbl_districts'
        ordering = ['district_name', ]
        verbose_name_plural = "Districts"


class TblTehsils(models.Model):
    # gid = models.AutoField()
    tehsil_id = models.AutoField(primary_key=True)
    district = models.ForeignKey(TblDistricts, models.DO_NOTHING)
    division = models.ForeignKey(TblDivisions, models.DO_NOTHING)
    tehsil_name = models.CharField(max_length=254)
    tehsil_code = models.CharField(unique=True, max_length=254)

    # geom = models.GeometryField(srid=0, blank=True, null=True)
    # extent = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tbl_tehsils'


#
# class SpiuProfile(models.Model):
#     DESIGNATION = (
#         ('AD', 'Assistant Director'),
#         ('DD', 'Deputy Director'),
#     )
#     id = models.BigAutoField(primary_key=True)
#     email = models.CharField(max_length=150, blank=True, null=True)
#     mobile_no = models.BigIntegerField(blank=True, null=True)
#     cnic = models.CharField(max_length=32, blank=True, null=True)
#     district = models.CharField(max_length=100, blank=True, null=True)
#     district_id = models.OneToOneField(TblDistricts, models.DO_NOTHING)
#     district_incharge = models.CharField(max_length=100, blank=True, null=True)
#     district_incharge_designation = models.CharField(max_length=100, blank=True, null=True, choices=DESIGNATION)
#     user = models.OneToOneField(User, models.DO_NOTHING)
#     is_disclaimer_agreed = models.BooleanField(blank=True, null=True)
#
#     class Meta:
#         managed = True
#         db_table = 'spiu_profile'
#         verbose_name_plural = "User Profile"


class TblPoultryFarms(models.Model):
    ENV_APPROVAL = (
        ('Yes', 'Yes'),
        ('No', 'No'),
        ('Under Process', 'Under Process')
    )
    PF_TYPE = (
        ('Broiler', 'Broiler'),
        ('Layer', 'Layer'),
        ('Parent Stock', 'Parent Stock'),
        ('Grand Parent Stock', 'Grand Parent Stock')
    )
    sr_no = models.IntegerField(blank=True, null=True)
    times_tamp = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=255, blank=True, null=True)
    district_incharge = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    name_entry_person = models.CharField(max_length=255, blank=True, null=True)
    name_poultry_farm = models.CharField(max_length=255, blank=True, null=True)
    type_poultry_farm = models.CharField(max_length=255, blank=True, null=True, choices=PF_TYPE)
    area_poultry_farm = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    environmental_approval_obtained = models.CharField(max_length=255, blank=True, null=True, choices=ENV_APPROVAL)
    environmental_approval_date = models.CharField(max_length=255, blank=True, null=True)
    geom = models.GeometryField(blank=True, null=True)

    # objects = models.GeoManager()

    class Meta:
        managed = False
        db_table = 'tbl_poultry_farms'
        verbose_name_plural = 'Poultry Farms'


class TblIndustryMainCategory(models.Model):
    name = models.CharField(max_length=254)
    description = models.CharField(max_length=254, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = True
        db_table = 'tbl_industry_main_category'
        ordering = ['name']
        verbose_name_plural = "Industry Main Category"


class TblIndustryCategory(models.Model):
    name = models.CharField(max_length=254)
    description = models.CharField(max_length=254, blank=True, null=True)
    capacity_unit = models.CharField(max_length=254, blank=True, null=True, verbose_name="Capacity Unit")
    is_area_field_shown = models.BooleanField(blank=True, null=True, default=True)
    code = models.CharField(blank=True, null=True, max_length=254)
    main_category = models.ForeignKey(TblIndustryMainCategory, models.DO_NOTHING)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = True
        db_table = 'tbl_industry_category'
        ordering = ['name', ]
        verbose_name_plural = "Industry Category"


class TblDistrictsIncharge(models.Model):
    DESIGNATION = (
        ('AD', 'Assistant Director'),
        ('DD', 'Deputy Director'),
    )
    name = models.CharField(max_length=254)
    designation = models.CharField(max_length=255, blank=True, null=True, choices=DESIGNATION)
    district_id = models.ForeignKey(TblDistricts, on_delete=models.CASCADE, db_column='district_id', blank=True,
                                    null=True, verbose_name="District")
    email = models.EmailField(max_length=254)
    # mobile_no = models.IntegerField(blank=True, null=True, help_text="3334567788")
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: '03000000000'. Up to 11 digits allowed.")
    mobile_no = models.CharField(validators=[phone_regex], max_length=11, blank=True,
                                 null=True)  # validators should be a list
    remarks = models.CharField(max_length=254, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = True
        db_table = 'tbl_district_incharge'
        ordering = ['name', ]
        verbose_name_plural = "District Officers Detail"


class PoultryFarms(models.Model):
    ENV_APPROVAL = (
        ('Yes', 'Yes'),
        ('No', 'No'),
        ('Under Process', 'Under Process')
    )
    PF_TYPE = (
        ('Broiler', 'Broiler'),
        ('Layer', 'Layer'),
        ('Parent Stock', 'Parent Stock'),
        ('Grand Parent Stock', 'Grand Parent Stock')
    )
    district_id = models.ForeignKey(TblDistricts, models.DO_NOTHING, verbose_name="Name of District")
    district_incharge = models.ForeignKey(TblDistrictsIncharge, models.DO_NOTHING,
                                          verbose_name="Name of District Incharge")
    category = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING, null=True,
                                 verbose_name="Name of Category")
    name_poultry_farm = models.CharField(max_length=255, blank=True, null=True,
                                         verbose_name="Name of Poultry Farm/ Control Shed")
    type_poultry_farm = models.CharField(max_length=255, blank=True, null=True, choices=PF_TYPE,
                                         verbose_name="Type of Poultry Farm / Control Shed")
    area_poultry_farm = models.FloatField(blank=True, null=True, verbose_name="Area in Kanals")
    owner_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Name of Owner")
    production_capacity = models.IntegerField(blank=True, null=True,verbose_name="No of Birds")
    latitude = models.FloatField(blank=True, null=True,
                                 help_text="Latitude in Decimal Degree format upto 6 decimals like XX.XXXXXX, value would be between 25 to 40")
    longitude = models.FloatField(blank=True, null=True,
                                  help_text="Longitude in Decimal Degree format upto 6 decimals like XX.XXXXXX, value would be between 60 to 80")
    approval_construction_phase = models.CharField(max_length=255, blank=True, null=True, choices=ENV_APPROVAL,
                                                   help_text="Environmental Approval for Construction Phase Obtained?, Date (if Yes, then provide the following date)")
    construction_phase_approval_date = models.DateField(blank=True, null=True,
                                                        help_text="approval date or in case of under process enter application date")
    approval_operational_phase = models.CharField(max_length=255, blank=True, null=True, choices=ENV_APPROVAL,
                                                  help_text="Environmental Approval for Operation Phase Obtained, Date (if Yes, then provide the following date)")
    operational_phase_approval_date = models.DateField(blank=True, null=True,
                                                       help_text="operationla phase approval date or in case of under process enter application date")
    remarks = models.CharField(max_length=254, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    geom = models.GeometryField(srid=4326, blank=True, null=True)
    unique_code = models.CharField(unique=True, blank=True, null=True, max_length=100, db_index=True)

    # objects = models.GeoManager()

    class Meta:
        managed = True
        db_table = 'tbl_poultry_farms_data'
        verbose_name_plural = 'Poultry Farms Data'


class Establishments(models.Model):
    ENV_APPROVAL = (
        ('Yes', 'Yes'),
        ('No', 'No'),
        ('Under Process', 'Under Process')
    )
    district_id = models.ForeignKey(TblDistricts, models.DO_NOTHING, verbose_name="Name of District")
    district_incharge = models.ForeignKey(TblDistrictsIncharge, models.DO_NOTHING,
                                          verbose_name="Name of District Incharge")
    main_category = models.ForeignKey(TblIndustryMainCategory, models.DO_NOTHING,
                                      verbose_name="Name of Main Category")
    category = models.ForeignKey(TblIndustryCategory, models.DO_NOTHING,
                                 verbose_name="Name of Category")
    name_of_establishment = models.CharField(max_length=255, null=True,
                                             verbose_name="Name of Establishment")
    area_in_kanals = models.FloatField(blank=True, null=True, verbose_name="Area in Kanals")
    owner_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Name of Owner")
    capacity = models.IntegerField(blank=True, null=True)
    latitude = models.FloatField(null=True,
                                 help_text="Latitude in Decimal Degree format upto 6 decimals like XX.XXXXXX, value would be between 25 to 40")
    longitude = models.FloatField(null=True,
                                  help_text="Longitude in Decimal Degree format upto 6 decimals like XX.XXXXXX, value would be between 60 to 80")
    approval_construction_phase = models.CharField(max_length=255, null=True, choices=ENV_APPROVAL,
                                                   help_text="Environmental Approval for Construction Phase Obtained?, Date (if Yes, then provide the following date)")
    construction_phase_approval_date = models.DateField(blank=True, null=True,
                                                        help_text="approval date or in case of under process enter application date")
    approval_operational_phase = models.CharField(max_length=255, blank=True, null=True, choices=ENV_APPROVAL,
                                                  help_text="Environmental Approval for Operation Phase Obtained, Date (if Yes, then provide the following date)")
    operational_phase_approval_date = models.DateField(blank=True, null=True,
                                                       help_text="operationla phase approval date or in case of under process enter application date")
    remarks = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    geom = models.GeometryField(srid=4326, blank=True, null=True)
    unique_code = models.CharField(unique=True, blank=True, null=True, max_length=100, db_index=True)

    # objects = models.GeoManager()

    class Meta:
        managed = True
        db_table = 'tbl_establishments'
        verbose_name_plural = 'Establishments'


class GpsData(models.Model):
    id = models.AutoField(primary_key=True)
    sr_no = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    name_of_industry = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    sub_category = models.CharField(max_length=255, blank=True, null=True)
    process = models.CharField(max_length=255, blank=True, null=True)
    date = models.CharField(max_length=255, blank=True, null=True)
    time = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    accuracy = models.FloatField(blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=255, blank=True, null=True)
    name_of_inspector = models.CharField(max_length=255, blank=True, null=True)
    contact_number_of_inspector = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'gps_data'
