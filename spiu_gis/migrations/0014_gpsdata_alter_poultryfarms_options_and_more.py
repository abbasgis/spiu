# Generated by Django 4.0.2 on 2022-09-28 05:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spiu_gis', '0013_tblindustrycategory_is_area_field_shown'),
    ]

    operations = [
        migrations.CreateModel(
            name='GpsData',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('sr_no', models.DecimalField(blank=True, decimal_places=65535, max_digits=65535, null=True)),
                ('name_of_industry', models.CharField(blank=True, max_length=255, null=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('category', models.CharField(blank=True, max_length=255, null=True)),
                ('sub_category', models.CharField(blank=True, max_length=255, null=True)),
                ('process', models.CharField(blank=True, max_length=255, null=True)),
                ('date', models.CharField(blank=True, max_length=255, null=True)),
                ('time', models.CharField(blank=True, max_length=255, null=True)),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('accuracy', models.FloatField(blank=True, null=True)),
                ('remarks', models.CharField(blank=True, max_length=255, null=True)),
                ('district', models.CharField(blank=True, max_length=255, null=True)),
                ('name_of_inspector', models.CharField(blank=True, max_length=255, null=True)),
                ('contact_number_of_inspector', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'gps_data',
                'managed': False,
            },
        ),
        migrations.AlterModelOptions(
            name='poultryfarms',
            options={'managed': True, 'verbose_name_plural': 'Poultry Farms Data'},
        ),
        migrations.AlterField(
            model_name='poultryfarms',
            name='production_capacity',
            field=models.IntegerField(blank=True, null=True, verbose_name='No of Birds'),
        ),
    ]
