from django.contrib import admin

# Register your models here.
from django.http import HttpResponseRedirect
from django.utils.safestring import mark_safe
from django_admin_geomap import ModelAdmin

from labs.models import TblReportParameters, TblLaboratories, \
    TblReports, TblReportsAnalysis, LabsUnit
from spiu_gis.admin import TblIndustryMainCategoryAdmin, TblIndustryCategoryAdmin
from spiu_gis.models import TblIndustryMainCategory, TblIndustryCategory

admin.site.register(TblIndustryMainCategory, TblIndustryMainCategoryAdmin)
admin.site.register(TblIndustryCategory, TblIndustryCategoryAdmin)


@admin.register(TblLaboratories)
class TblLaboratoriesAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblLaboratories._meta.fields if
                    field.name not in ("created_by", "updated_by", "created_at", "updated_at",)]

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False


@admin.register(TblReportParameters)
class TblReportParametersAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblReportParameters._meta.fields if
                    field.name not in ("id",)]


class TblLabAnalysisInline(admin.TabularInline):
    model = TblReportsAnalysis
    fields = ('report_id', 'peqs_limit', 'concentration', 'method_used', 'remarks')
    # readonly_fields = ('peqs_limit',)
    extra = 2
    can_delete = False


@admin.register(TblReportsAnalysis)
class TblReportsAnalysisAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblReportsAnalysis._meta.fields if
                    field.name not in ("",)]


@admin.register(LabsUnit)
class LabsUnitAdmin(admin.ModelAdmin):
    list_display = [field.name for field in LabsUnit._meta.fields if
                    field.name not in ("",)]


@admin.register(TblReports)
class TblReportsAdmin(ModelAdmin):
    geomap_field_longitude = "id_longitude"
    geomap_field_latitude = "id_latitude"
    geomap_default_longitude = "74.1849"
    geomap_default_latitude = "32.2637"
    geomap_default_zoom = "7"
    geomap_height = "300px"
    geomap_show_map_on_list = False
    arr_list_display = [field.name for field in TblReports._meta.fields if
                        field.name not in ("id_", "letter_issued_by")]
    arr_list_display.insert(7, 'sample_location')
    list_display = arr_list_display
    inlines = [TblLabAnalysisInline, ]
    # list_filter = ('report_title',)
    save_on_bottom = True
    exclude = ('created_by', 'updated_by')
    list_filter = ('district_id__district_name', 'report_title', 'created_at')

    def sample_location(self, obj):
        if obj.longitude:
            return mark_safe(
                f'<a target="_blank" href="https://www.google.com/maps/search/{obj.latitude},{obj.longitude}">Google Map Link</a>')
        return None

    sample_location.allow_tags = True
    fieldsets = (
        (None, {
            'fields': (
                ('report_title', 'report_no', 'letter_no', 'letter_date'),
                ('laboratory_name', 'name_industry', 'address_industry', 'district_id'),
                ('sampling_source', 'fuel_type', 'emission_control_system'),
                ('category', 'monitoring_date', 'sample_monitored_by'),
                # water st
                ('sample_type', 'sampling_point', 'treatment_facility'),
                ('treatment_facility_type', 'process_generating_wastewater', 'discharge_value'),
                ('discharge_unit', 'capacity_of_wwtp', 'capacity_unit'),
                ('sampling_date', 'sample_receiving_date', 'sample_id_no'),
                ('sample_taken_stage', 'sample_received_from', 'sample_received_by'),
                # water end
                ('report_path', 'latitude', 'longitude')

            ),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        else:
            return qs.filter(created_by=request.user)

    def save_model(self, request, obj, form, change):
        is_in_add_view = False
        if obj.id is None:
            obj.created_by = request.user
            is_in_add_view = True
            # super().save_model(request, obj, form, change)
        else:
            obj.updated_by = request.user.id
        super().save_model(request, obj, form, change)
        if is_in_add_view:
            self.insert_report_parameters(obj)
            url = "/admin/labs/tblreports/" + str(obj.pk) + "/change/"
            return HttpResponseRedirect(url)

    def get_inlines(self, request, obj=None):
        if obj:
            return [TblLabAnalysisInline]
        else:
            return []

    def insert_report_parameters(self, obj):
        report_type = obj.report_title
        if obj.report_title == 'WWTP':
            report_type = 'Water'
        rows = list(TblReportParameters.objects.filter(report_type=report_type).values())
        for r in rows:
            r['report_id'] = TblReports.objects.get(id=obj.pk)
            r['sample_id_no'] = obj.report_no  # No sample id so report no
            r['report_type'] = obj.report_title
            del r['id']
            new_r = TblReportsAnalysis(**r)
            new_r.save(force_insert=True)

    def get_readonly_fields(self, request, obj=None):
        # Disable the 'my_field' field when editing an existing object
        if obj:
            return ['report_title', ]
        # Enable the 'my_field' field when adding a new object
        else:
            return []

    def formfield_for_dbfield(self, db_field, **kwargs):
        field = super(TblReportsAdmin, self).formfield_for_dbfield(db_field, **kwargs)
        if db_field.name == 'laboratory_name':
            request = kwargs['request']
            lab = TblLaboratories.objects.filter(lab_name=request.user.first_name)
            if lab.count() > 0:
                field.initial = lab.get().pk
                field.disabled = True
        return field

    def change_view(self, request, object_id, form_url='', extra_context=None):
        self.add_update_report_parameters(object_id)
        extra_context = extra_context or {}
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

    def add_update_report_parameters(self, object_id):
        obj = TblReports.objects.get(id=object_id)
        rows = list(TblReportParameters.objects.filter(report_type=obj.report_title).values())
        for r in rows:
            r['report_id'] = TblReports.objects.get(id=obj.pk)
            r['sample_id_no'] = obj.report_no  # No sample id so report no
            r['report_type'] = obj.report_title
            del r['id']
            rs = TblReportsAnalysis.objects.filter(report_id=obj.pk, parameter=r['parameter'])
            if rs.count() == 0:
                new_r = TblReportsAnalysis(**r)
                new_r.save(force_insert=True)

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    class Media:
        js = ('/static/admin/js/show_hide_reports_fields.js',)
        css = {
            # 'all': ('/static/assets/css/dropdown.css',)
        }
