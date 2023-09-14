from django.urls import path

from labs.views import get_labs_page, get_labs_dashboard_page, get_labs_highmap_json, \
    get_district_count_labs_report_json, get_laboratory_wise_report_count, get_labs_reports_json, get_reports_no_param

urlpatterns = [
    path('crs_page/', get_labs_page, name='crs_page'),
]
