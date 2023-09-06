from django.urls import path

from giz.views import get_giz_page, get_sunburst_data, get_organization_data, get_environment_data, get_org_detail, \
    submit_message_form, ioed_report_content

urlpatterns = [
    path('main/', get_giz_page, name='main'),
    path('get_sunburst_data/', get_sunburst_data, name='get_sunburst_data'),
    path('get_org_data/', get_organization_data, name='get_org_data'),
    path('get_env_data/', get_environment_data, name='get_env_data'),
    path('get_org_detail/', get_org_detail, name='get_org_detail'),
    path('ioed_report', ioed_report_content, name='ioed_report'),
    path('submit_message/', submit_message_form, name='submit_message'),

]
