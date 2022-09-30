from django.urls import path

from labs.views import get_labs_page

urlpatterns = [
    path('labs_page/', get_labs_page, name='labs_page'),

]
