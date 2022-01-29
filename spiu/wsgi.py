"""
WSGI config for ferrp project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os

import sys

sys.path.append('/home/env/python-www/spiu')
sys.path.append('/home/env/python-www/spiu/venv/lib/python3.9/site-packages')

from django.contrib.staticfiles.handlers import StaticFilesHandler
from django.core.wsgi import get_wsgi_application

from spiu import settings

#
# # add the virtualenv site-packages path to the sys.path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "spiu.settings")

if settings.DEBUG:
    application = StaticFilesHandler(get_wsgi_application())
else:
    application = get_wsgi_application()
