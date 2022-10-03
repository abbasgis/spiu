from django.urls import path

from spiu_gis.controller.admin_controller import get_categories_list, get_category_detail
from spiu_gis.controller.dashboard import get_highmap_json, get_district_count_report_json
from spiu_gis.views import get_population_count, get_feature_geom, get_population_count_by_taskid, get_forms_page

urlpatterns = [
    # url(r'^$', get_projects_detail_page, name='projects'),
    path('get_population_count/', get_population_count, name='get_population_count'),
    path('get_population_count_by_taskid/', get_population_count_by_taskid, name='get_population_count_by_taskid'),
    path('get_feature_geom/', get_feature_geom, name='get_feature_geom'),
    path('forms_page/', get_forms_page, name='forms_page'),
    path('get_categories_list/', get_categories_list, name='get_categories_list'),
    path('get_category_detail/', get_category_detail, name='get_category_detail'),
    path('get_highmap_json/', get_highmap_json, name='get_highmap_json'),
    path('get_report_json/', get_district_count_report_json, name='get_report_json'),

]
