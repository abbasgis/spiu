from django.urls import path

from giz.views import get_giz_page, get_sunburst_data, get_organization_data, get_environment_data

urlpatterns = [
    path('main/', get_giz_page, name='main'),
    path('get_sunburst_data/', get_sunburst_data, name='get_sunburst_data'),
    path('get_org_data/', get_organization_data, name='get_org_data'),
    path('get_env_data/', get_environment_data, name='get_env_data'),

]
