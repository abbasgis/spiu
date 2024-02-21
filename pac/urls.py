from django.urls import path

from pac.views import pac_login_page, pac_signup_page, pac_add_activity, pac_page, pac_view_activity, \
    get_activity_photos, download_certificate

urlpatterns = [
    path('', pac_page, name='pac_page'),
    path('pac_add_activity', pac_add_activity, name='pac_add_activity'),
    path('pac_view_activity', pac_view_activity, name='pac_view_activity'),
    path('pac_login/', pac_login_page, name='pac_login_page'),
    path('pac_signup/', pac_signup_page, name='pac_signup_page'),
    path('get_act_photos/', get_activity_photos, name='get_act_photos'),
    path('download_certificate/<certificate>/', download_certificate, name='download_certificate'),

    # path('upload/', views.upload_activity, name='upload_activity'),
]
