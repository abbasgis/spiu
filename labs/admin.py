from django.contrib import admin

# Register your models here.
from django.http import HttpResponseRedirect

from labs.models import TblReportsWasteWater, TblLabAnalysisWasteWater, TblWasteWaterParameters, TblLaboratories
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


@admin.register(TblReportsWasteWater)
class TblReportsWasteWaterAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblReportsWasteWater._meta.fields if
                    field.name not in ("id",)]
    inlines = [TblLabAnalysisWasteWaterInline, ]
    save_on_bottom = True
    exclude = ('created_by', 'updated_by')
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
            self.insert_waste_water_parameters(obj)
            url = "admin/labs/tblreportswastewater/" + str(obj.pk) + "/change/"
            return HttpResponseRedirect(url)

    def get_inlines(self, request, obj=None):
        if obj:
            return [TblLabAnalysisWasteWaterInline]
        else:
            return []

    def insert_waste_water_parameters(self, obj):
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
