from django.urls import path

from giz.views import get_giz_page

urlpatterns = [
    path('main1/', get_giz_page, name='main1'),
]
