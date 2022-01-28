
from django.urls import path

from spiu_gis.views import get_population_count, get_feature_geom, get_population_count_by_taskid

urlpatterns = [
    # url(r'^$', get_projects_detail_page, name='projects'),
    path('get_population_count/', get_population_count, name='get_population_count'),
    path('get_population_count_by_taskid/', get_population_count_by_taskid, name='get_population_count_by_taskid'),
    path('get_feature_geom/', get_feature_geom, name='get_feature_geom'),

]
