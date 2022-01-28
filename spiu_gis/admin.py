from django.contrib import admin

# Register your models here.
from django.contrib.gis.admin import GeoModelAdmin

from spiu_gis.models import TblPoultryFarms


@admin.register(TblPoultryFarms)
class TblMunicipalityAdmin(GeoModelAdmin):
    list_display = ('sr_no', 'times_tamp', 'email', 'district', 'district_incharge', 'designation', 'name_entry_person',
                    'name_poultry_farm', 'type_poultry_farm', 'area_poultry_farm', 'latitude', 'longitude',
                    'environmental_approval_obtained', 'environmental_approval_date')
    search_fields = ('name_poultry_farm', 'district',)
    list_filter = ('district', 'designation')
    # fields = ('municipality_name',)
    ordering = ('district',)
    default_lon = 74.3333826
    default_lat = 31.5118868
    default_zoom = 10
    map_srid = 4326
    display_srid = 4326
    # template_name = 'gis/admin/osm.html'

    # actions = ['add_property_detail']

    def has_add_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    # def add_property_detail(self, request, queryset):
    #     rs = list(queryset)
    #     selected = len(rs)
    #     if selected == 0 or selected > 1:
    #         self.message_user(request, "You Have Selected " + str(selected) + ' rows, please select only one row',
    #                           level=messages.WARNING)
    #     else:
    #         return HttpResponseRedirect(
    #             "/admin/mamis/tblassets/add/?lg_code=" + rs[0].municipality_completecode)
    #
    # add_property_detail.short_description = "Add Property"
    # add_property_detail.acts_on_all = True
