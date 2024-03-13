from django.contrib.auth.models import User
from django.db import models


class SchemeDetail(models.Model):
    scheme_name = models.CharField(max_length=256, verbose_name='Scheme Name')
    completion_date = models.DateField(blank=True, null=True, verbose_name='Completion Date')
    gestation_start_date = models.DateField(blank=True, null=True, verbose_name='Gestation Start Date')
    gestation_end_date = models.DateField(blank=True, null=True, verbose_name='Gestation End Date')
    approved_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                        verbose_name='Approved Cost')
    upload_pc1_pdf = models.FileField(upload_to='imar/pc1_pdfs/', blank=True, null=True,
                                      verbose_name='Upload PC-I (PDF File)')
    upload_pc1_word = models.FileField(upload_to='imar/pc1_word/', blank=True, null=True,
                                       verbose_name='Upload PC-I (Word File)')
    upload_revised_pc1_pdf = models.FileField(upload_to='imar/revised_pc1_pdfs/', blank=True, null=True,
                                              verbose_name='Upload Revised PC-I PDF')
    upload_revised_pc1_word = models.FileField(upload_to='imar/revised_pc1_word/', blank=True, null=True,
                                               verbose_name='Upload Revised PC-I Word')
    ddsc_date = models.DateField(blank=True, null=True, verbose_name='DDSC Date')
    upload_ddsc_meeting_notice = models.FileField(upload_to='imar/ddsc_meeting_notices/', blank=True, null=True,
                                                  verbose_name='Upload DDSC Meeting Notice')
    ddsc_mom_issue_date = models.DateField(blank=True, null=True, verbose_name='DDSC Minute of Meeting Issue Date')
    upload_ddsc_mom = models.FileField(upload_to='imar/ddsc_moms/', blank=True, null=True,
                                       verbose_name='Upload DDSC Minute of Meeting (PDF)')
    # for revised
    revised_ddsc_date = models.DateField(blank=True, null=True, verbose_name='Revised DDSC Date')
    revised_upload_ddsc_meeting_notice = models.FileField(upload_to='imar/revised_ddsc_meeting_notices/', blank=True,
                                                          null=True, verbose_name='Upload Revised DDSC Meeting Notice')
    revised_ddsc_mom_issue_date = models.DateField(blank=True, null=True,
                                                   verbose_name='Revised DDSC MOM Issue Date')
    upload_revised_ddsc_mom = models.FileField(upload_to='imar/ddsc_moms/', blank=True, null=True,
                                               verbose_name='Upload Revised DDSC MOM (PDF FIle)')
    approval_status = models.BooleanField(default=False, verbose_name='Approval Status')
    aa_date = models.DateField(blank=True, null=True, verbose_name='Administrative Approval Date')
    upload_aa = models.FileField(upload_to='imar/aa/', blank=True, null=True,
                                 verbose_name='Upload Administrative Approval')
    tendered_date = models.DateField(blank=True, null=True, verbose_name='Tended Date')
    award_date = models.DateField(blank=True, null=True, verbose_name='Award Date')
    company_name = models.CharField(blank=True, null=True, max_length=100, verbose_name='Company Name')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='created_by', blank=True, null=True)
    updated_by = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.scheme_name


class PhysicalProgress(models.Model):
    scheme = models.ForeignKey('SchemeDetail', on_delete=models.CASCADE)
    physical_progress_date = models.DateField(verbose_name='Physical Progress Date')
    physical_progress_remarks = models.TextField(verbose_name='Physical Progress Remarks', blank=True, null=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, db_column='updated_by', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"{self.scheme.scheme_name} - {self.physical_progress_date}"
