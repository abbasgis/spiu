# Generated by Django 4.0.2 on 2023-06-22 05:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0005_labsunit_tblreports_capacity_of_wwtp_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tblreports',
            name='complete_case_path',
            field=models.FileField(blank=True, help_text='(Letter, Form-D, Form-B and Analysis Report) مکمل کیس اپ لوڈ کریں بشمول', null=True, upload_to='lab_reports_case', verbose_name='Upload Complete Case'),
        ),
        migrations.AddField(
            model_name='tblreports',
            name='photo1_path',
            field=models.FileField(blank=True, help_text='Attach sampling point location photo with surrounding', null=True, upload_to='lab_reports_photos', verbose_name='Photo-1'),
        ),
        migrations.AddField(
            model_name='tblreports',
            name='photo2_path',
            field=models.FileField(blank=True, help_text='Attach plant photo covering its surrounding', null=True, upload_to='lab_reports_photos', verbose_name='Photo-2'),
        ),
        migrations.AlterField(
            model_name='tblreports',
            name='form_b_path',
            field=models.FileField(blank=True, null=True, upload_to='form_b', verbose_name='Form-B'),
        ),
        migrations.AlterField(
            model_name='tblreports',
            name='form_d_path',
            field=models.FileField(blank=True, null=True, upload_to='form_d', verbose_name='Form-D'),
        ),
        migrations.AlterField(
            model_name='tblreports',
            name='letter_path',
            field=models.FileField(blank=True, null=True, upload_to='letters', verbose_name='Letter'),
        ),
    ]