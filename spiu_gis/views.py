import json
import requests
from django.http import HttpResponse
from spiu.utils import date_handler, getResultFromDB, get_model_by_db_table, getJSONFromDB


def get_population_count(request):
    lat = request.GET.get('lat')
    long = request.GET.get('long')
    r = request.GET.get('r', 'null')  # radious
    data = {}
    pf_count = 0
    try:
        # sql = "SELECT st_asgeojson(ST_Buffer(ST_GeomFromText('POINT(" + long + " " + lat + ")',4326),0.004, 'quad_segs=8'))"
        # data = getResultFromDB(sql)
        # g = data[0]['st_asgeojson']
        # url = 'https://api.worldpop.org/v1/services/stats?dataset=wpgppop&year=2020&geojson=' + g
        # response = requests.get(url)
        # task_id = response.json()['taskid']
        query = "SELECT * from tbl_poultry_farms where st_within(geom,st_buffer(ST_GeomFromText('POINT(" + long + " " + lat + ")',4326),0.008))"
        pf = getResultFromDB(query)
        pf_count = len(pf)
        # res = requests.get('https://api.worldpop.org/v1/tasks/' + task_id)
        # data = res.json()
        pop_sql = "SELECT (stats).count,round((stats).sum::numeric, 0) as sum FROM (select ST_SummaryStatsAgg(ST_Clip(rast,ST_Buffer(ST_Transform(ST_SetSRID( ST_Point( " + long + ", " + lat + "), 4326), 3857),500)),1,true)  as stats from pop_2020_punjab_3857) bar"
        pop_data = getResultFromDB(pop_sql)
        data = {'total_population': pop_data[0]['sum'], 'status_code': 200}
        code = 200  # data having rows more than 500
    except:
        code = 400
    response = {'code': code, 'data': data, 'pf_count': pf_count}
    response = json.dumps(response, default=date_handler)
    return HttpResponse(response)


def get_population_count_by_taskid(request):
    task_id = request.GET.get('task_id', 'null')
    pf_count = request.GET.get('pf_count', '0')
    data = {}
    try:
        res = requests.get('https://api.worldpop.org/v1/tasks/' + task_id)
        data = res.json()
        code = 200  # data having rows more than 500
    except:
        code = 400
    response = {'code': code, 'data': data, 'pf_count': pf_count}
    response = json.dumps(response, default=date_handler)
    return HttpResponse(response)


def get_feature_geom(request):
    layer = request.GET.get('layer')
    attr_name = request.GET.get('attr_name')
    attr_val = request.GET.get('attr_val')
    data = []
    code = 404
    try:
        model = get_model_by_db_table(layer)
        if model:
            if attr_val != '-1':
                sql = "SELECT row_to_json(fc) result FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) " \
                      "As features FROM(SELECT 'Feature' As type , st_asgeojson(lg.geom, 4, 2)::json As  geometry," \
                      " row_to_json((SELECT l FROM(SELECT  ) As l )) As properties " \
                      " FROM " + layer + " As lg where lg.geom is not null and " + attr_name + "='" + attr_val + "') As f )  As fc"
                data = getJSONFromDB(sql)
                code = 200  # data having rows more than 500
    except:
        code = 400
    response = {'code': code, 'data': data}
    response = json.dumps(response, default=date_handler)
    return HttpResponse(response)
