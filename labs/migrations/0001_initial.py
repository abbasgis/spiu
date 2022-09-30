# Generated by Django 4.0.2 on 2022-09-28 06:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('spiu_gis', '0014_gpsdata_alter_poultryfarms_options_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TblReportsWasteWater',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('laboratory_name', models.CharField(max_length=254)),
                ('letter_no', models.CharField(max_length=254)),
                ('letter_date', models.DateField(blank=True, null=True)),
                ('name_industry', models.CharField(max_length=254)),
                ('address_industry', models.CharField(max_length=354)),
                ('sample_type', models.CharField(choices=[('Grab', 'Grab'), ('Composite', 'Composite')], max_length=254)),
                ('sampling_point', models.CharField(max_length=254)),
                ('treatment_facility', models.CharField(choices=[('Primary', 'Primary'), ('Secondary', 'Secondary'), ('Tertiary', 'Tertiary')], max_length=254)),
                ('treatment_facility_description', models.CharField(max_length=254)),
                ('process_generating_wastewater', models.CharField(max_length=254)),
                ('discharge', models.CharField(blank=True, max_length=254, null=True)),
                ('sampling_date', models.DateField(blank=True, null=True)),
                ('sample_receiving_date', models.DateField(blank=True, null=True)),
                ('sample_id_no', models.CharField(max_length=254)),
                ('sample_received_from', models.CharField(max_length=254)),
                ('sample_received_by', models.CharField(max_length=254)),
                ('report_path', models.FileField(upload_to='reports')),
                ('letter_path', models.FileField(upload_to='letters')),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tblindustrycategory', verbose_name='Name of Category')),
                ('created_by', models.ForeignKey(blank=True, db_column='created_by', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('district_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tbldistricts', verbose_name='Name of District')),
                ('main_category', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tblindustrymaincategory', verbose_name='Name of Main Category')),
            ],
            options={
                'verbose_name_plural': 'Waste Water Reports',
                'db_table': 'tbl_reports_waste_water',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TblLabAnalysisWasteWater',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sample_id_no', models.CharField(max_length=254)),
                ('parameter', models.CharField(max_length=254)),
                ('peqs_limit', models.CharField(max_length=254)),
                ('concentration', models.DateField(blank=True, null=True)),
                ('method_used', models.CharField(max_length=254)),
                ('remarks', models.CharField(max_length=254)),
                ('report_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='labs.tblreportswastewater')),
            ],
            options={
                'verbose_name_plural': 'Lab Analysis Waste Water',
                'db_table': 'tbl_lab_analysis_waste_water',
                'managed': True,
            },
        ),
    ]
