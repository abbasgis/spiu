from django import forms
from django.contrib import admin
from django.db import models
from django.forms import Textarea
from django.http import HttpResponseRedirect

from .models import SchemeDetail, PhysicalProgress
from datetime import datetime, timedelta


class PhysicalProgressInline(admin.TabularInline):
    model = PhysicalProgress
    exclude = ('updated_by',)
    extra = 1
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3})}
    }


class SchemeDetailAdmin(admin.ModelAdmin):
    inlines = [PhysicalProgressInline]
    list_display = ['scheme_name', 'id', 'completion_date', 'approved_cost', 'gestation_start_date',
                    'gestation_end_date', 'upload_pc1_pdf', 'upload_pc1_word', 'ddsc_date',
                    'upload_ddsc_meeting_notice', 'ddsc_mom_issue_date', 'upload_ddsc_mom', 'approval_status',
                    'aa_date', 'upload_aa', 'tendered_date', 'award_date', 'company_name', 'get_physical_progress_date',
                    'get_physical_progress_remarks']
    ordering = ['id', ]
    list_filter = ('completion_date', 'approval_status',)

    def get_physical_progress_date(self, obj):
        last_related = obj.physicalprogress_set.last()
        if last_related:
            return last_related.physical_progress_date
        return None

    get_physical_progress_date.short_description = 'Physical Progress Date'

    def get_physical_progress_remarks(self, obj):
        last_related = obj.physicalprogress_set.last()
        if last_related:
            return last_related.physical_progress_remarks
        return None

    get_physical_progress_remarks.short_description = 'Physical Progress Remarks'

    def physical_progress_remarks(self, obj):
        return obj.physical_progress_remarks

    fieldsets = (
        ('Scheme Detail', {
            'fields': (
                ('scheme_name'), ('approved_cost', 'completion_date', 'gestation_start_date', 'gestation_end_date'),)
        }),
        ('PC-I Detail', {
            'fields': (('upload_pc1_pdf', 'upload_pc1_word', 'upload_revised_pc1_pdf', 'upload_revised_pc1_word'),)
        }),
        ('DDSC Detail', {
            'fields': (('ddsc_date', 'upload_ddsc_meeting_notice', 'ddsc_mom_issue_date', 'upload_ddsc_mom',
                        ), ('revised_ddsc_date', 'revised_upload_ddsc_meeting_notice', 'revised_ddsc_mom_issue_date',
                            'upload_revised_ddsc_mom'))
        }),
        ('Approval Status', {
            'fields': (('approval_status', 'aa_date', 'upload_aa'),)
        }),
        ('Tender Detail', {
            'fields': (('tendered_date', 'award_date', 'company_name',),)
        }),
    )

    def save_model(self, request, obj, form, change):
        is_in_add_view = True
        if obj.id is None:
            obj.updated_by = request.user.id
            is_in_add_view = True
        super().save_model(request, obj, form, change)
        if is_in_add_view:
            p_count = PhysicalProgress.objects.filter(scheme=obj.pk).count()
            if p_count == 0:
                self.insert_physical_progress_dates(obj)
            url = "/admin/imar/schemedetail/" + str(obj.pk) + "/change/"
            return HttpResponseRedirect(url)

    def insert_physical_progress_dates(self, obj):
        start_date = datetime(2023, 1, 1)
        end_date = datetime(2024, 3, 1)
        current_date = start_date
        scheme = SchemeDetail.objects.get(id=obj.pk)
        while current_date <= end_date:
            p_count = PhysicalProgress.objects.filter(scheme=obj.pk, physical_progress_date=current_date).count()
            if p_count == 0:
                PhysicalProgress.objects.create(
                    scheme=scheme,
                    physical_progress_date=current_date,
                    physical_progress_remarks=''
                )
                current_date = current_date.replace(day=1)
                if current_date.month == 12:
                    current_date = current_date.replace(year=current_date.year + 1, month=1)
                else:
                    current_date = current_date.replace(month=current_date.month + 1)

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == 'approval_status':
            kwargs['widget'] = forms.Select(choices=[(False, 'Not Approved'), (True, 'Approved')])
        return super().formfield_for_dbfield(db_field, **kwargs)


class PhysicalProgressAdmin(admin.ModelAdmin):
    list_display = ['scheme', 'physical_progress_date', 'physical_progress_remarks']
    exclude = ('updated_by',)


admin.site.register(SchemeDetail, SchemeDetailAdmin)
admin.site.register(PhysicalProgress, PhysicalProgressAdmin)
