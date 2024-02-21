from django.contrib import admin
from django.utils.safestring import mark_safe

from pim.models import IndustryDetail
from django_admin_geomap import ModelAdmin


# Register your models here.
@admin.register(IndustryDetail)
class IndustryDetailAdmin(ModelAdmin):
    geomap_field_longitude = "id_longitude"
    geomap_field_latitude = "id_latitude"
    geomap_default_longitude = "74.1849"
    geomap_default_latitude = "32.2637"
    geomap_default_zoom = "7"
    # geomap_height = "400px"
    geomap_show_map_on_list = False
    arr_list_display = [field.name for field in IndustryDetail._meta.fields if
                        field.name not in ("created_by", "updated_at", "updated_by")]
    list_display = arr_list_display
    save_on_bottom = True
    exclude = ('created_by', 'updated_by')
    list_filter = ('created_at', 'tehsil_name__district',)

    def sample_location(self, obj):
        if obj.longitude:
            return mark_safe(
                f'<a target="_blank" href="https://www.google.com/maps/search/{obj.latitude},{obj.longitude}">Google Map Link</a>')
        return None

    sample_location.allow_tags = True
    fieldsets = (
        (None, {
            'fields': (
                ('name_industry', 'address_industry'),
                ('tehsil_name', 'project_sub_category'),
                ('latitude', 'longitude')
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

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    def delete_model(self, request, obj):
        if request.user.is_superuser:
            IndustryDetail.objects.filter(report_id=obj.id).delete()
            obj.delete()

    # class Media:
    #     js = ('/static/admin/js/show_hide_reports_fields.js',)
    #     css = {
    #         # 'all': ('/static/assets/css/dropdown.css',)
    #     }
