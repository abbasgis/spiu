# Generated by Django 4.0.2 on 2022-03-14 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spiu_gis', '0012_tblindustrycategory_capacity_unit'),
    ]

    operations = [
        migrations.AddField(
            model_name='tblindustrycategory',
            name='is_area_field_shown',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
    ]
