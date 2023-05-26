from django.urls import path

from labs.views import get_labs_page, get_labs_dashboard_page, get_labs_highmap_json, \
    get_district_count_labs_report_json, get_laboratory_wise_report_count, get_labs_reports_json, get_reports_no_param

urlpatterns = [
    path('labs_page/', get_labs_page, name='labs_page'),
    path('labs_dashboard/', get_labs_dashboard_page, name='labs_dashboard'),
    path('get_labs_highmap_json/', get_labs_highmap_json, name='get_labs_highmap_json'),
    path('get_district_reports_count/', get_district_count_labs_report_json, name='get_district_reports_count'),
    path('get_laboratory_reports_count/', get_laboratory_wise_report_count, name='get_laboratory_reports_count'),
    path('get_labs_reports/', get_labs_reports_json, name='get_labs_reports'),
    path('get_reports_no_param/', get_reports_no_param, name='get_reports_no_param'),

]
