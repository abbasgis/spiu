# Generated by Django 4.0.2 on 2023-06-22 09:59

import django.core.validators
from django.db import migrations, models
import django_admin_geomap


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LabsUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit', models.CharField(max_length=254)),
                ('unit_category', models.CharField(blank=True, choices=[('discharge', 'Discharge'), ('capacity', 'Capacity'), ('other', 'Others')], max_length=254, null=True)),
            ],
            options={
                'verbose_name_plural': 'Laboratories Units',
                'db_table': 'labs_units',
                'ordering': ['unit'],
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TblLaboratories',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lab_name', models.CharField(max_length=254)),
                ('officer_name', models.CharField(max_length=254)),
                ('designation', models.CharField(blank=True, choices=[('AD', 'Assistant Director (Lab)'), ('DD', 'Deputy Director (Lab)')], max_length=255, null=True)),
                ('email', models.EmailField(max_length=254)),
                ('mobile_no', models.CharField(blank=True, max_length=11, null=True, validators=[django.core.validators.RegexValidator(message="Phone number must be entered in the format: '03000000000'. Up to 11 digits allowed.", regex='^\\+?1?\\d{9,15}$')])),
                ('address', models.CharField(blank=True, max_length=254, null=True)),
                ('area_of_jurisdiction', models.CharField(blank=True, max_length=254, null=True)),
                ('remarks', models.CharField(blank=True, max_length=254, null=True)),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Laboratories Detail',
                'db_table': 'tbl_laboratories',
                'ordering': ['lab_name'],
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TblReportParameters',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parameter', models.CharField(max_length=254)),
                ('peqs_limit', models.CharField(max_length=254)),
                ('concentration', models.FloatField(blank=True, null=True, verbose_name='Results')),
                ('method_used', models.CharField(max_length=254)),
                ('remarks', models.CharField(blank=True, max_length=254, null=True)),
                ('report_type', models.CharField(blank=True, choices=[('Air', 'Stack Emission/ Air'), ('Noise', 'Noise'), ('Water', 'Liquid Effluent/ Water'), ('WWTP', 'Waste Water Treatment Plants')], max_length=254, null=True)),
            ],
            options={
                'verbose_name': 'Report Parameters',
                'verbose_name_plural': 'Report Parameters',
                'db_table': 'tbl_reports_parameters',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TblReports',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_title', models.CharField(choices=[('Air', 'Stack Emission/ Air'), ('Noise', 'Noise'), ('Water', 'Liquid Effluent/ Water'), ('WWTP', 'Waste Water Treatment Plants')], default='Air', max_length=254, verbose_name='Report Type')),
                ('report_no', models.CharField(max_length=254, verbose_name='Report No')),
                ('letter_no', models.CharField(max_length=254, verbose_name='Reports Letter No')),
                ('letter_date', models.DateField(verbose_name='Letter Date')),
                ('letter_issued_by', models.CharField(blank=True, max_length=254, null=True, verbose_name='Letter Issued By (Name & Designation)')),
                ('name_industry', models.CharField(max_length=254, verbose_name='Name of Industry')),
                ('address_industry', models.CharField(max_length=354, verbose_name='Address of Industry')),
                ('sampling_source', models.CharField(default='Not Available', max_length=254, verbose_name='Sampling/Emission Source')),
                ('monitoring_date', models.DateField(verbose_name='Monitoring Date')),
                ('fuel_type', models.CharField(default='Not Available', max_length=254, verbose_name='Fuel Type')),
                ('emission_control_system', models.CharField(default='Not Available', max_length=254, verbose_name='Emission Control System')),
                ('sample_monitored_by', models.CharField(blank=True, max_length=254, null=True, verbose_name='Monitored By')),
                ('sample_type', models.CharField(choices=[('Grab', 'Grab'), ('Composite', 'Composite')], default='Grab', max_length=254, verbose_name='Sample Type')),
                ('sampling_point', models.CharField(default='Not Available', max_length=254, verbose_name='Sampling Point')),
                ('treatment_facility', models.CharField(default='Not Available', max_length=254, verbose_name='Treatment Facility')),
                ('treatment_facility_type', models.CharField(choices=[('Primary', 'Primary'), ('Secondary', 'Secondary'), ('Tertiary', 'Tertiary'), ('NA', 'Not Available')], default='Primary', max_length=254, verbose_name='Treatment Facility Type')),
                ('process_generating_wastewater', models.CharField(default='Not Available', max_length=254, verbose_name='Process Generating Waste Water')),
                ('discharge', models.CharField(default='Not Available', max_length=254)),
                ('sampling_date', models.DateField(blank=True, null=True, verbose_name='Sample Date')),
                ('sample_receiving_date', models.DateField(blank=True, null=True, verbose_name='Date of Sample Receiving in Lab')),
                ('sample_id_no', models.CharField(blank=True, max_length=254, null=True, verbose_name='Sample ID No')),
                ('sample_taken_stage', models.CharField(blank=True, choices=[('before', 'Before Treatment'), ('after', 'After Treatment')], default='before', max_length=254, null=True, verbose_name='Sample Taken Stage')),
                ('sample_received_from', models.CharField(blank=True, max_length=254, null=True, verbose_name='Sample Received From')),
                ('sample_received_by', models.CharField(blank=True, max_length=254, null=True, verbose_name='Sample Received By')),
                ('discharge_value', models.FloatField(blank=True, null=True, verbose_name='Waste Water Discharge')),
                ('capacity_of_wwtp', models.FloatField(blank=True, null=True, verbose_name='Capacity of WWTP')),
                ('latitude', models.FloatField(help_text='up to 6 decimals between 25 to 40', verbose_name='latitude of sample location')),
                ('longitude', models.FloatField(help_text='up to 6 decimals between 60 to 80', verbose_name='longitude of sample location')),
                ('form_d_path', models.FileField(blank=True, null=True, upload_to='form_d', verbose_name='Form-D')),
                ('form_b_path', models.FileField(blank=True, null=True, upload_to='form_b', verbose_name='Form-B')),
                ('letter_path', models.FileField(blank=True, null=True, upload_to='letters', verbose_name='Letter')),
                ('report_path', models.FileField(blank=True, null=True, upload_to='reports', verbose_name='Analysis Report')),
                ('complete_case_path', models.FileField(blank=True, help_text='(Letter, Form-D, Form-B and Analysis Report) مکمل کیس اپ لوڈ کریں بشمول', null=True, upload_to='lab_reports_case', verbose_name='Upload Complete Case')),
                ('photo1_path', models.FileField(blank=True, help_text='Attach sampling point location photo with surrounding', null=True, upload_to='lab_reports_photos', verbose_name='Photo-1')),
                ('photo2_path', models.FileField(blank=True, help_text='Attach plant photo covering its surrounding & gate', null=True, upload_to='lab_reports_photos', verbose_name='Photo-2')),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'verbose_name': 'Report',
                'verbose_name_plural': 'Reports',
                'db_table': 'tbl_reports',
                'managed': False,
            },
            bases=(models.Model, django_admin_geomap.GeoItem),
        ),
        migrations.CreateModel(
            name='TblReportsAnalysis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sample_id_no', models.CharField(blank=True, max_length=254, null=True)),
                ('parameter', models.CharField(max_length=254)),
                ('peqs_limit', models.CharField(max_length=254, verbose_name='PEQS Limit')),
                ('concentration', models.FloatField(blank=True, null=True, verbose_name='Concentration/Results')),
                ('method_used', models.CharField(max_length=254, verbose_name='Method Used')),
                ('remarks', models.CharField(blank=True, choices=[('Complies PEQS', 'Complies PEQS'), ('Non Complies PEQS', 'Non Complies PEQS')], default='Complies PEQS', max_length=254, null=True)),
                ('remarks_calculated', models.CharField(blank=True, max_length=254, null=True)),
                ('report_type', models.CharField(blank=True, choices=[('Air', 'Stack Emission/ Air'), ('Noise', 'Noise'), ('Water', 'Liquid Effluent/ Water'), ('WWTP', 'Waste Water Treatment Plants')], max_length=254, null=True)),
            ],
            options={
                'verbose_name': 'Report Analysis',
                'verbose_name_plural': 'Reports Analysis',
                'db_table': 'tbl_reports_analysis',
                'managed': False,
            },
        ),
    ]
