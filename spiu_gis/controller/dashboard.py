import datetime
import json

from django.db.models import Count, F
from django.http import HttpResponse

from spiu.utils import getJSONFromDB, date_handler
from spiu_gis.models import PoultryFarms


def get_highmap_json(request):
    global sql
    division_id = request.GET.get('division_id', -1)
    level = request.GET.get('level', 'division')
    result = PoultryFarms.objects.values('district_id__division__division_name',
                                         'approval_construction_phase').annotate(
        name=F('district_id__division__division_name'),
        dcount=Count('*')).order_by()
    tiles = PoultryFarms.objects.values('approval_construction_phase').annotate(
        name=F('approval_construction_phase'),
        dcount=Count('*'))
    if level == 'division':
        sql = "with tbl_poultry_farms_data_rs as (select tbl_districts.division_id,tbl_poultry_farms_data.* from tbl_districts INNER JOIN tbl_poultry_farms_data on tbl_districts.district_id=tbl_poultry_farms_data.district_id_id) SELECT row_to_json(fc) as geojson FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json ( (SELECT l FROM ( SELECT lg.division_name as name  ,Count(*) total ,lg.division_id code FROM tbl_poultry_farms_data_rs sr WHERE sr.division_id=lg.division_id GROUP BY lg.division_name,lg.division_id  ) As l ) ) As properties FROM public.tbl_divisions  As lg    ) As f )  As fc;"
    elif level == 'district':
        sql = "with tbl_poultry_farms_data_rs as (select tbl_districts.division_id,tbl_poultry_farms_data.* from tbl_districts INNER JOIN tbl_poultry_farms_data on tbl_districts.district_id=tbl_poultry_farms_data.district_id_id) SELECT row_to_json(fc) as geojson FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json ( (SELECT l FROM ( SELECT lg.district_name as name ,Count(*) total ,lg.district_id code FROM tbl_poultry_farms_data_rs sr WHERE sr.district_id_id=lg.district_id GROUP BY lg.district_name,lg.district_id  ) As l ) ) As properties FROM public.tbl_districts  As lg where lg.division_id=" + division_id + "   ) As f )  As fc;"
        # result = (PoultryFarms.objects.filter(district_id__division__division_id=division_id)
        #           .values('district_id__district_name', 'approval_construction_phase')
        #           .annotate(dcount=Count('*'))
        #           .order_by()
        #           )
        result = PoultryFarms.objects.filter(district_id__division__division_id=division_id).values(
            'district_id__district_name',
            'approval_construction_phase').annotate(
            name=F('district_id__district_name'),
            dcount=Count('*')).order_by()
        tiles = PoultryFarms.objects.filter(district_id__division__division_id=division_id).values(
            'approval_construction_phase').annotate(
            name=F('approval_construction_phase'),
            dcount=Count('*'))
    jsonData = getJSONFromDB(sql)
    rs = []
    if result.count() > 0:
        rs = list(result)
    tiles = list(tiles)
    tiles_data = json.dumps(tiles, default=date_handler)
    data = json.dumps(rs, default=date_handler)
    response = {'high_maps': jsonData, 'chart': data, 'tiles_data': tiles_data}
    response = json.dumps(response, default=date_handler)
    return HttpResponse(response)


def get_district_count_report_json(request):
    start_date = request.POST.get('start_date', '')
    end_date = request.POST.get('end_date', '')
    if start_date != '':
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    if end_date != '':
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
    data = PoultryFarms.objects.filter(updated_at__gte=start_date, updated_at__lte=end_date).values(
        'district_id__district_name').annotate(
        name=F('district_id__district_name'),
        dcount=Count('*')).order_by('district_id__district_name')
    data = list(data)
    response = json.dumps(data, default=date_handler)
    return HttpResponse(response)
