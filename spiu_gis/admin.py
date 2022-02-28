from django.contrib import admin

# Register your models here.
from django.contrib.gis.admin import GeoModelAdmin

from spiu.models import Profile
from spiu_gis.forms.frm_pultry_farm import PoultryFarmsForm
from spiu_gis.models import TblPoultryFarms, PoultryFarms, TblDistrictsIncharge, TblIndustryMainCategory, \
    TblIndustryCategory, TblDistricts


@admin.register(Profile)
class SpiuProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'email', 'district_id', 'mobile_no', 'cnic', 'is_disclaimer_agreed')
    # ordering = ('district')
    # add_fieldsets = ('email')


@admin.register(TblDistricts)
class TblDistrictsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblDistricts._meta.fields]


@admin.register(TblIndustryMainCategory)
class TblIndustryMainCategoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblIndustryMainCategory._meta.fields if
                    field.name not in ("id", "updated_by", "updated_at")]

    def save_model(self, request, obj, form, change):
        if obj.id is None:
            obj.created_by = request.user
            super().save_model(request, obj, form, change)
        else:
            obj.updated_by = request.user.id
            super().save_model(request, obj, form, change)


@admin.register(TblIndustryCategory)
class TblIndustryCategoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblIndustryCategory._meta.fields if
                    field.name not in ("id", "updated_by", "updated_at")]

    def save_model(self, request, obj, form, change):
        if obj.id is None:
            obj.created_by = request.user
            super().save_model(request, obj, form, change)
        else:
            obj.updated_by = request.user.id
            super().save_model(request, obj, form, change)


@admin.register(TblDistrictsIncharge)
class TblDistrictsInchargeAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'district_id', 'email', 'mobile_no', 'created_by', 'created_at')


@admin.register(PoultryFarms)
class TblPoultryFarmsAdmin(GeoModelAdmin):
    list_display = ('district_id', 'district_incharge',
                    'name_poultry_farm', 'type_poultry_farm', 'area_poultry_farm', 'owner_name', 'production_capacity',
                    'latitude', 'longitude', 'approval_construction_phase', 'construction_phase_approval_date',
                    'approval_operational_phase', 'operational_phase_approval_date', 'created_by', 'created_at')
    # form = PoultryFarmsForm
    search_fields = ('name_poultry_farm', 'district_id',)
    list_filter = ('district_id',)
    # fields = ('municipality_name',)
    ordering = ('district_id',)
    default_lon = 74.3333826
    default_lat = 31.5118868
    default_zoom = 10
    map_srid = 4326
    display_srid = 4326
    exclude = ('created_by', 'created_at', 'updated_by', 'geom')

    # fields = ('district_id', 'district_incharge',
    #           'name_poultry_farm', 'type_poultry_farm', 'area_poultry_farm', 'owner_name', 'production_capacity',
    #           'latitude', 'longitude', 'approval_construction_phase', 'construction_phase_approval_date',
    #           'approval_operational_phase', 'operational_phase_approval_date',)

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

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        field = super(TblPoultryFarmsAdmin, self).formfield_for_dbfield(db_field, request, **kwargs)
        obj = PoultryFarms.objects.all()
        if obj.count() > 0:
            obj = obj.latest('id')
            if db_field.name == 'district_id':
                field.initial = obj.district_id
            if db_field.name == 'district_incharge':
                field.initial = obj.district_incharge
            if db_field.name == 'type_poultry_farm':
                field.initial = obj.type_poultry_farm
        return field

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "district_id":
    #         db_field.widget.attrs = {'label': 'shakir', 'data-live-search': 'true'}
    #         # kwargs["data-live-search"] = True
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)
    class Media:
        js = ('/static/admin/js/show_hide_fields.js',)
