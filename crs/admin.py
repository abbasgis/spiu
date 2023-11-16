from django.contrib import admin
from import_export.admin import ExportActionModelAdmin

from crs.models import CrsComplaintsDetail
from django_admin_geomap import ModelAdmin

from spiu.models import Profile


# Register your models here.
@admin.register(CrsComplaintsDetail)
class CrsComplaintsDetailAdmin(ModelAdmin, ExportActionModelAdmin):
    geomap_field_longitude = "id_longitude"
    geomap_field_latitude = "id_latitude"
    geomap_default_longitude = "74.1849"
    geomap_default_latitude = "32.2637"
    geomap_default_zoom = "7"
    geomap_height = "300px"
    geomap_show_map_on_list = False
    list_display = [field.name for field in CrsComplaintsDetail._meta.fields if
                    field.name not in (
                        'complaint_number', 'district_name', 'created_by', 'updated_by', 'created_at', 'updated_at')]
    save_on_bottom = True
    exclude = ('created_by', 'updated_by', 'created_at', 'updated_at')
    search_fields = ['name']
    list_filter = ('complaint_source', 'created_at')
    actions = ['export']

    def get_list_filter(self, request):
        list_filter = super().get_list_filter(request)
        if request.user.is_superuser:
            list_filter = ('complaint_source', 'district_id__district_name', 'created_at')
        return list_filter

    def save_model(self, request, obj, form, change):
        if obj.id is None:
            obj.created_by = request.user.id
            obj_user = Profile.objects.filter(user=request.user.id).get()
            obj.district_id = obj_user.district_id.district_id
            obj.district_name = obj_user.district_id.district_name
        else:
            obj.updated_by = request.user.id
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # qs = qs.exclude(latitude__isnull=True)
        if request.user.is_superuser:
            return qs
        else:
            obj = Profile.objects.filter(user=request.user.id).get()
            if obj.district_id is not None:
                qs = qs.filter(district=obj.district_id)
            else:
                qs = qs.filter(created_by=request.user)
            return qs

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    fieldsets = [
        (None, {
            'fields': (
                ('complaint_source', 'complainant_name', 'complainant_mobile', 'complainant_address'),
                ('unit_name', 'unit_address', 'latitude', 'longitude'),

            ),
        }),
        (
            "Type of Environmental Issue? (Tick the Relevant)",
            {
                "classes": ["collapse"],
                "fields": (
                    ('air_pollution', 'noise_pollution', 'hazardous_waste', 'municipal_solid_waste', 'noc_cancellation',
                     'operation_without_noc'),
                    ('untreated_waste_water', 'sub_standard_fuel', 'soil_pollution', 'land_degradation', 'other_issue'),
                ),

            },
        ),
        (
            "Actions Taken related to the Complaint? (Tick the Relevant)",
            {
                "classes": ["collapse"],
                "fields": (
                    ('preliminary_examination', 'hearing_notice_issued', 'smr_issued', 'epo_issued', 'under_trial',
                     'final_decision',),
                    ('sealed', 'desealed', 'firs_arrested', 'complaint_resolved', 'fine_court_or_staff',),
                ),

            },
        ),
    ]
