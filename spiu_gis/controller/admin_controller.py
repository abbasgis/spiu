# f'{n:03}'
import json

from django.contrib.gis.admin import GeoModelAdmin
from django.http import HttpResponse

from spiu.utils import updateRecordInDB, date_handler
from spiu_gis.models import Establishments, TblIndustryMainCategory, TblIndustryCategory
from django import forms
from django.contrib import admin


class EstablishmentsForm(forms.ModelForm):
    class Meta:
        model = Establishments
        exclude = ('created_by', 'created_at', 'updated_by', 'geom', 'unique_code')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['approval_construction_phase'].widget = forms.RadioSelect(
            choices=self.fields['approval_construction_phase'].choices
        )
        # for field in self._meta.fields:
        #     if field in ('approval_construction_phase', 'approval_operational_phase'):
        #         attrs = {'class': 'col-md-3'}
        #         self.fields[field].widget = forms.RadioSelect()
        # self.fields[field].widget.attrs.update(attrs)


class EstablishmentsAdmin(GeoModelAdmin):
    # form = EstablishmentsForm
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
    change_form_template = 'admin/change_form_establishment.html'
    # fieldsets = [
    #     (None, {'fields': (['district_id', 'district_incharge']), }),
    # ]

    fieldsets = (
        (None, {
            'fields': (
                'district_id', 'district_incharge', 'main_category', 'category',
                ('name_of_establishment', 'area_in_kanals', 'owner_name'), ('capacity',
                                                                            'latitude', 'longitude'),
                'approval_construction_phase', 'construction_phase_approval_date',
                'approval_operational_phase', 'operational_phase_approval_date', 'created_at',
            ),
        }),
    )

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
    # class Media:
    #     js = ('/static/admin/js/establishments.js',)


def generate_unique_code(district_code, category_code, industry_code):
    category_code = f'{category_code:03}'
    industry_code = f'{industry_code:04}'
    code = district_code + '-' + str(category_code) + '-' + str(industry_code)
    return code


def update_geom_column(obj):
    if obj.latitude is not None:
        sql = "UPDATE " + obj._meta.db_table + " SET geom = ST_SetSRID(ST_MakePoint(" + str(obj.longitude) + ", " \
              + str(obj.latitude) + "), 4326) where id=" + str(obj.id)
        rs = updateRecordInDB(sql)
        # sql = "UPDATE " + obj._meta.db_table + " SET geom =  st_geomfromtext('POINT(" + str(obj.longitude) + " " \
        #       + str(obj.latitude) + ")', 4326) where id=" + str(obj.id)
        # rs = updateRecordInDB(sql)
        # sql = "UPDATE " + obj._meta.db_table + " SET geom =  ST_SetSRID(geom, 4326) where id=" + str(obj.id)
        # rs = updateRecordInDB(sql)
        return rs


def update_unique_code(obj):
    code = generate_unique_code(obj.district_id.district_code, obj.category.id, obj.id)
    obj.unique_code = code
    obj.save()


def get_categories_list(request):
    main_category = request.GET.get('main_category', '-1')
    rs = TblIndustryCategory.objects.filter(main_category=int(main_category))
    data = list(rs.values('name', 'id'))
    response = json.dumps(data, default=date_handler)
    return HttpResponse(response)


def get_category_detail(request):
    category = request.GET.get('category', '-1')
    rs = TblIndustryCategory.objects.filter(id=category).values()
    response = json.dumps(list(rs), default=date_handler)
    return HttpResponse(response)


def update_category_code(obj):
    obj.category_code = f'{obj.id:03}'
    obj.save()
