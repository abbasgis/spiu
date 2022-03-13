# f'{n:03}'
from django.contrib.gis.admin import GeoModelAdmin

from spiu.utils import updateRecordInDB
from spiu_gis.models import Establishments


def generate_unique_code(district_code, category_code, industry_code):
    category_code = f'{category_code:03}'
    industry_code = f'{industry_code:04}'
    code = district_code + '-' + str(category_code) + '-' + str(industry_code)
    return code


def update_geom_column(obj):
    if obj.latitude is not None:
        sql = "UPDATE " + obj._meta.db_table + " SET geom = ST_SetSRID(ST_MakePoint(" + str(obj.longitude) + ", " \
              + str(obj.latitude) + "), 4326) where id=" + str(obj.id)
        updateRecordInDB(sql)


def update_unique_code(obj):
    code = generate_unique_code(obj.district_id.district_code, obj.category.id, obj.id)
    obj.unique_code = code
    obj.save()


class EstablishmentsAdmin(GeoModelAdmin):
    list_display = ('unique_code', 'district_id', 'district_incharge', 'main_category', 'category',
                    'name_of_establishment', 'area_in_kanals', 'owner_name', 'capacity',
                    'latitude', 'longitude', 'approval_construction_phase', 'construction_phase_approval_date',
                    'approval_operational_phase', 'operational_phase_approval_date', 'created_by', 'created_at')
    # form = PoultryFarmsForm
    search_fields = ('name_of_establishment', 'district_id',)
    list_filter = ('district_id', 'main_category', 'category')
    # fields = ('municipality_name',)
    ordering = ('district_id',)
    default_lon = 74.3333826
    default_lat = 31.5118868
    default_zoom = 10
    map_srid = 4326
    display_srid = 4326
    exclude = ('created_by', 'created_at', 'updated_by', 'geom', 'unique_code')
    readonly_fields = ('created_at',)

    # fields = ('district_id', 'district_incharge',
    #           'name_of_establishment', 'type_poultry_farm', 'area_poultry_farm', 'owner_name', 'production_capacity',
    #           'latitude', 'longitude', 'approval_construction_phase', 'construction_phase_approval_date',
    #           'approval_operational_phase', 'operational_phase_approval_date',)

    def save_model(self, request, obj, form, change):
        if obj.id is None:
            obj.created_by = request.user
            # super().save_model(request, obj, form, change)
        else:
            obj.updated_by = request.user.id
        super().save_model(request, obj, form, change)
        update_geom_column(obj)
        update_unique_code(obj)

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
        field = super(EstablishmentsAdmin, self).formfield_for_dbfield(db_field, request, **kwargs)
        obj = Establishments.objects.all()
        if obj.count() > 0:
            obj = obj.latest('id')
            if db_field.name == 'district_id':
                field.initial = obj.district_id
            if db_field.name == 'district_incharge':
                field.initial = obj.district_incharge
            if db_field.name == 'main_category':
                field.initial = obj.main_category
            if db_field.name == 'category':
                field.initial = obj.category
        return field

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "district_id":
    #         db_field.widget.attrs = {'label': 'shakir', 'data-live-search': 'true'}
    #         # kwargs["data-live-search"] = True
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)
    class Media:
        js = ('/static/admin/js/establishments.js',)
