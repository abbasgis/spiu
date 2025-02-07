# Generated by Django 4.0.2 on 2024-02-01 13:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('spiu_gis', '0014_gpsdata_alter_poultryfarms_options_and_more'),
        ('pim', '0002_industrydetail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectsubcategory',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='projectsubcategory',
            name='project_category_id',
        ),
        migrations.AlterField(
            model_name='industrydetail',
            name='project_sub_category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='spiu_gis.tblindustrycategory', verbose_name='Industrial Category'),
        ),
        migrations.DeleteModel(
            name='ProjectCategory',
        ),
        migrations.DeleteModel(
            name='ProjectSubCategory',
        ),
    ]
