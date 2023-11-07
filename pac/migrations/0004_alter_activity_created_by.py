# Generated by Django 4.0.2 on 2023-11-01 11:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pac', '0003_activity_activity_remarks_activity_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='created_by',
            field=models.ForeignKey(blank=True, db_column='created_by', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
