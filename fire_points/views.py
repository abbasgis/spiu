import json

import nasa_wildfires
from django.http import HttpResponse
from django.template import loader

from spiu.utils import getResultFromDB, date_handler


def get_district_name(prop):
    sql = "select district_name from tbl_districts where st_within(ST_geomfromtext('POINT(" + prop['longitude'] + " " + \
          prop['latitude'] + ")',4326), geom)"
    data = getResultFromDB(sql)
    if len(data) > 0:
        prop['district'] = data[0]['district_name']
        url = "https://www.google.com/maps/place/" + prop['latitude'] + "+" + prop['longitude'] + "/@" + prop[
            'latitude'] + "," + prop['longitude'] + ",14z/"
        prop['gmap_link'] = url
        return prop
    return False


def get_fire_points(request):
    sat = request.GET.get("sat")
    period = request.GET.get("period")
    if sat == "noaa":
        data = nasa_wildfires.get_viirs_noaa(region="south-asia", time_range=period)
    elif sat == "suomi":
        data = nasa_wildfires.get_viirs_suomi(region="south-asia", time_range=period)
    else:
        data = nasa_wildfires.get_modis(region="south-asia", time_range=period)
    # data_s = nasa_wildfires.get_viirs_suomi(region="south-asia", time_range="7d")
    # data_n = nasa_wildfires.get_viirs_noaa(region="south-asia", time_range="7d")
    final_data = []
    if data and 'features' in data:
        f = data['features']
        for r in f:
            d = get_district_name(r['properties'])
            if d:
                final_data.append(d)
    json_data = json.dumps(final_data, default=date_handler)
    return HttpResponse(json_data)


def get_fp_page(request):
    template = loader.get_template('fire_points.html')
    return HttpResponse(template.render({}, request))
