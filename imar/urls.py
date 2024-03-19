from django.urls import path

from imar.views import imar_page, get_scheme_details

urlpatterns = [
    path('', imar_page, name='imar_page'),
    path('get-scheme-details/<int:scheme_id>/', get_scheme_details, name='get_scheme_details'),
    # path('pac_add_activity', pac_add_activity, name='pac_add_activity'),

]
