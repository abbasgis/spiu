# Generated by Django 4.0.2 on 2023-11-01 09:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pac', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='latitude',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='activity',
            name='longitude',
            field=models.FloatField(),
        ),
    ]
