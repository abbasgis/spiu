from django.contrib import admin

# Register your models here.
from django.http import HttpResponseRedirect
from import_export import resources
from import_export.admin import ExportActionMixin

from labs.models import TblReportsWasteWater, TblLabAnalysisWasteWater, TblWasteWaterParameters, TblLaboratories, \
    TblReportsAir, TblLabAnalysis
from spiu_gis.admin import TblIndustryMainCategoryAdmin, TblIndustryCategoryAdmin
from spiu_gis.models import TblIndustryMainCategory, TblIndustryCategory

admin.site.register(TblIndustryMainCategory, TblIndustryMainCategoryAdmin)
admin.site.register(TblIndustryCategory, TblIndustryCategoryAdmin)


@admin.register(TblLaboratories)
class TblLaboratoriesAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblLaboratories._meta.fields if
                    field.name not in ("created_by", "updated_by", "created_at", "updated_at",)]


@admin.register(TblWasteWaterParameters)
class TblWasteWaterParametersAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblWasteWaterParameters._meta.fields if
                    field.name not in ("id",)]


class TblLabAnalysisWasteWaterInline(admin.TabularInline):
    model = TblLabAnalysisWasteWater
    fields = ('report_id', 'peqs_limit', 'concentration', 'method_used', 'remarks')
    # readonly_fields = ('peqs_limit',)
    extra = 9
    can_delete = False


class TblLabAnalysisInline(admin.TabularInline):
    model = TblLabAnalysis
    fields = ('report_id', 'peqs_limit', 'concentration', 'method_used', 'remarks')
    # readonly_fields = ('peqs_limit',)
    extra = 2
    can_delete = False


@admin.register(TblReportsWasteWater)
class TblReportsWasteWaterAdmin(ExportActionMixin, admin.ModelAdmin):
    list_display = [field.name for field in TblReportsWasteWater._meta.fields if
                    field.name not in ("",)]
    inlines = [TblLabAnalysisWasteWaterInline, ]
    save_on_bottom = True
    exclude = ('created_by', 'updated_by')
    list_filter = ('created_by', 'updated_at')
    fieldsets = (
        (None, {
            'fields': (
                ('report_title', 'laboratory_name'),
                ('letter_no', 'letter_date', 'letter_issued_by'),
                ('name_industry', 'address_industry', 'district_id'),
                ('category', 'sample_type', 'sampling_point'),
                ('latitude', 'longitude'),
                ('treatment_facility', 'treatment_facility_type', 'process_generating_wastewater'),
                ('discharge', 'sampling_date', 'sample_receiving_date'),
                ('sample_id_no', 'sample_received_from', 'sample_received_by'),
                ('form_d_path', 'form_b_path', 'letter_path'),
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
            self.insert_lab_analysis_parameters(obj)
            url = "admin/labs/tblreportswastewater/" + str(obj.pk) + "/change/"
            return HttpResponseRedirect(url)

    def get_inlines(self, request, obj=None):
        if obj:
            return [TblLabAnalysisWasteWaterInline]
        else:
            return []

    def insert_lab_analysis_parameters(self, obj):
        rows = list(TblWasteWaterParameters.objects.all().values())
        for r in rows:
            r['report_id'] = TblReportsWasteWater.objects.get(id=obj.pk)
            r['sample_id_no'] = obj.sample_id_no
            del r['id']
            new_r = TblLabAnalysisWasteWater(**r)
            new_r.save(force_insert=True)

    class Media:
        js = ('/static/admin/js/show_hide_fields.js',)
        css = {
            'all': ('/static/assets/css/dropdown.css',)
        }


@admin.register(TblLabAnalysis)
class TblLabAnalysisAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblLabAnalysis._meta.fields if
                    field.name not in ("",)]


@admin.register(TblLabAnalysisWasteWater)
class TblLabAnalysisWasteWaterAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblLabAnalysisWasteWater._meta.fields if
                    field.name not in ("id",)]


@admin.register(TblReportsAir)
class TblReportsAirAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblReportsAir._meta.fields if
                    field.name not in ("id",)]
    inlines = [TblLabAnalysisInline, ]
    save_on_bottom = True
    exclude = ('created_by', 'updated_by')
    fieldsets = (
        (None, {
            'fields': (
                ('report_title', 'report_no', 'laboratory_name'),
                ('letter_no', 'letter_date', 'letter_issued_by'),
                ('name_industry', 'address_industry', 'district_id'),
                ('category', 'sampling_source', 'fuel_type'),
                ('emission_control_system', 'monitoring_date', 'sample_monitored_by'),
                ('latitude', 'longitude'),
                ('form_d_path', 'form_b_path', 'letter_path'),
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
            self.insert_lab_analysis_air_parameters(obj)
            url = "admin/labs/tblreportsair/" + str(obj.pk) + "/change/"
            return HttpResponseRedirect(url)

    def get_inlines(self, request, obj=None):
        if obj:
            return [TblLabAnalysisInline]
        else:
            return []

    def insert_lab_analysis_air_parameters(self, obj):

        rows = list(TblWasteWaterParameters.objects.filter(report_type=obj.report_title).values())
        for r in rows:
            r['report_id'] = TblReportsAir.objects.get(id=obj.pk)
            r['sample_id_no'] = obj.report_no  # No sample id so report no
            r['report_type'] = obj.report_title
            del r['id']
            new_r = TblLabAnalysis(**r)
            new_r.save(force_insert=True)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        self.add_update_lab_analysis_parameters(object_id)
        extra_context = extra_context or {}
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

    def add_update_lab_analysis_parameters(self, object_id):
        obj = TblReportsAir.objects.get(id=object_id)
        rows = list(TblWasteWaterParameters.objects.filter(report_type=obj.report_title).values())
        for r in rows:
            r['report_id'] = TblReportsAir.objects.get(id=obj.pk)
            r['sample_id_no'] = obj.report_no  # No sample id so report no
            r['report_type'] = obj.report_title
            del r['id']
            rs = TblLabAnalysis.objects.filter(report_id=obj.pk, parameter=r['parameter'])
            if rs.count() == 0:
                new_r = TblLabAnalysis(**r)
                new_r.save(force_insert=True)

    class Media:
        js = ('/static/admin/js/show_hide_fields.js',)
        css = {
            'all': ('/static/assets/css/dropdown.css',)
        }
