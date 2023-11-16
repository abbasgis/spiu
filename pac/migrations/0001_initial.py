# Generated by Django 4.0.2 on 2023-10-25 11:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('spiu_gis', '0014_gpsdata_alter_poultryfarms_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_name', models.CharField(max_length=255)),
                ('activity_address', models.TextField()),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('photos', models.ImageField(blank=True, null=True, upload_to='activity_photos/')),
                ('district', models.ForeignKey(blank=True, db_column='district_id', null=True, on_delete=django.db.models.deletion.CASCADE, to='spiu_gis.tbldistricts', verbose_name='District')),
            ],
        ),
    ]