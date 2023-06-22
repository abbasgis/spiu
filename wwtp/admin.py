from django.contrib import admin

from django_admin_geomap import ModelAdmin

from spiu.models import Profile
from .models import WwtpDetail


@admin.register(WwtpDetail)
class WwtpDetailAdmin(ModelAdmin):
    geomap_field_longitude = "id_longitude"
    geomap_field_latitude = "id_latitude"
    geomap_default_longitude = "74.1849"
    geomap_default_latitude = "32.2637"
    geomap_default_zoom = "7"
    geomap_height = "300px"
    geomap_show_map_on_list = False
    list_display = ['id', 'district', 'category_id', 'name', 'is_valid', 'address', 'wwtp_type', 'remarks', 'latitude',
                    'longitude']
    save_on_bottom = True
    exclude = ('created_by', 'updated_by', 'created_at', 'updated_at')
    search_fields = ['name']

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

    fieldsets = (
        (None, {
            'fields': (
                ('name', 'address', 'category_id', 'wwtp_type'),
                ('photo1_path', 'photo2_path', 'latitude', 'longitude'),
                ('is_valid', 'remarks'),
            ),
        }),
    )

    class Media:
        # js = ('/static/admin/js/show_hide_reports_fields.js',)
        css = {
            'all': ('/static/assets/css/dropdown.css',)
        }

# admin.site.register(WwtpDetail, WwtpDetailAdmin)
