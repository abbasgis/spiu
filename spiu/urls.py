"""spiu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from fire_points.views import get_fire_points, get_fp_page
from spiu import settings
from spiu.views import homepage, signup, disclaimer_page, spiu_page, dashboard_page

urlpatterns = [
                  # path('grappelli/', include('grappelli.urls')),  # grappelli URLS
                  path('admin/', admin.site.urls),
                  path('^', include('django.contrib.auth.urls')),
                  path('disclaimer/', disclaimer_page, name='disclaimer'),
                  path('dashboard/', dashboard_page, name='dashboard'),
                  path('home/', homepage, name='home'),
                  path('gis/', include('spiu_gis.urls')),
                  path('signup/', signup, name='signup'),
                  path('', spiu_page, name='spiu'),
                  path('spiu/', spiu_page, name='spiu'),
                  path('labs/', include('labs.urls')),
                  path('ioed/', include('giz.urls')),
                  path('wwtp/', include('wwtp.urls')),
                  path('fire_points/', get_fire_points, name='fire_points'),
                  path('fp/', get_fp_page, name='fp'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
