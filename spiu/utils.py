import calendar
import json
import re
import urllib.request
import datetime

import math

from django.apps import apps
from django.db import connection, connections
from django.utils.formats import get_format

from io import BytesIO
from django.http import HttpResponse
from django.template.loader import get_template


def delete_property(prop, obj):
    if prop in obj:
        del obj[prop]


def str_join(*args):
    return "".join(map(str, args))


def getJSONFromDB(sql):
    cursor = connection.cursor()
    cursor.execute(sql)
    data = dictfetchall(cursor)
    json_data = json.dumps(data, default=date_handler)
    return json_data


def getResultFromDB(sql):
    cursor = connection.cursor()
    cursor.execute(sql)
    data = dictfetchall(cursor)
    return data


def updateRecordInDB(sql):
    cursor = connection.cursor()
    cursor.execute(sql)
    return True


def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else str(obj)


def date_format_handler(obj):
    if isinstance(obj, datetime.datetime):
        # Format created_at field as "14 Oct 2023, 12:24 PM"
        return obj.strftime("%d %b %Y, %I:%M %p")


def method_name(obj):
    data = {'__class__': obj.__class__.__name__,
            '__module__': obj.__module__
            }
    data.update(obj.__dict__)
    return data
    # data is dict object in this case


def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


def get_type(value):
    return type(value).__name__


def get_model_by_db_table(db_table):
    for model in apps.get_models():
        if model._meta.db_table == db_table:
            return model
    else:
        return None
