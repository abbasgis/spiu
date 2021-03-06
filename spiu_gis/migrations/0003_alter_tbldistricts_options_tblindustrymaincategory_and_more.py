# Generated by Django 4.0.2 on 2022-02-20 19:20

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('spiu_gis', '0002_delete_spiuprofile'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tbldistricts',
            options={'managed': False, 'ordering': ['district_name']},
        ),
        migrations.CreateModel(
            name='TblIndustryMainCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254)),
                ('description', models.CharField(blank=True, max_length=254, null=True)),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, db_column='created_by', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tbl_industry_main_category',
                'ordering': ['name'],
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TblIndustryCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254)),
                ('description', models.CharField(blank=True, max_length=254, null=True)),
                ('code', models.CharField(max_length=254)),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, db_column='created_by', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('main_category', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tblindustrymaincategory')),
            ],
            options={
                'db_table': 'tbl_industry_category',
                'ordering': ['name'],
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TblDistrictsIncharge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=254)),
                ('designation', models.CharField(blank=True, choices=[('AD', 'Assistant Director'), ('DD', 'Deputy Director')], max_length=255, null=True)),
                ('email', models.EmailField(max_length=254)),
                ('mobile_no', models.IntegerField(blank=True, help_text='3334567788', null=True)),
                ('remarks', models.CharField(blank=True, max_length=254, null=True)),
                ('updated_by', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, db_column='created_by', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tbldistricts')),
            ],
            options={
                'db_table': 'tbl_district_incharge',
                'ordering': ['name'],
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PoultryFarms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_poultry_farm', models.CharField(blank=True, max_length=255, null=True)),
                ('type_poultry_farm', models.CharField(blank=True, choices=[('Broiler', 'Broiler'), ('Layer', 'Layer'), ('Parent Stock', 'Parent Stock'), ('Grand Parent Stock', 'Grand Parent Stock')], max_length=255, null=True)),
                ('area_poultry_farm', models.FloatField(blank=True, null=True)),
                ('owner_name', models.CharField(blank=True, max_length=255, null=True)),
                ('production_capacity', models.IntegerField(blank=True, null=True)),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('approval_construction_phase', models.CharField(blank=True, choices=[('Yes', 'Yes'), ('No', 'No'), ('Under Process', 'Under Process')], help_text='Environmental Approval for Section 12 of PEPA (amended 2012) Construction Phase Obtained, Date (if Yes, then provide the following date)', max_length=255, null=True)),
                ('construction_phase_approval_date', models.DateField(blank=True, help_text='approval date or in case of under process enter application date', null=True)),
                ('approval_operational_phase', models.CharField(blank=True, choices=[('Yes', 'Yes'), ('No', 'No'), ('Under Process', 'Under Process')], max_length=255, null=True)),
                ('operational_phase_approval_date', models.DateField(blank=True, help_text='approval date or in case of under process enter application date', null=True)),
                ('remarks', models.CharField(blank=True, max_length=254, null=True)),
                ('geom', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tbldistricts')),
                ('district_incharge', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tbldistrictsincharge')),
            ],
            options={
                'verbose_name_plural': 'Poultry Farms New',
                'db_table': 'tbl_poultry_farms_data',
                'managed': True,
            },
        ),
    ]
