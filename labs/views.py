import datetime
import json

from django.contrib.auth.models import User
from django.db.models import F, Count
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader

from labs.models import ViewLabsReports, TblReportsAir, TblLabAnalysis, TblLabAnalysisWasteWater, TblReportsWasteWater, \
    TblLaboratories
from spiu.utils import date_handler, getJSONFromDB
from spiu_gis.models import TblDistricts, TblIndustryCategory


def get_labs_page(request):
    template = loader.get_template('labs.html')
    return HttpResponse(template.render({}, request))


def get_labs_dashboard_page(request):
    template = loader.get_template('dashboard_labs.html')
    return HttpResponse(template.render({}, request))


def get_labs_highmap_json(request):
    global sql
    division_id = request.GET.get('division_id', -1)
    level = request.GET.get('level', 'division')
    result = ViewLabsReports.objects.values('district_id__division__division_name',
                                            'report_title').annotate(
        name=F('district_id__division__division_name'),
        dcount=Count('*')).order_by()
    tiles = ViewLabsReports.objects.values('report_title').annotate(
        name=F('report_title'),
        dcount=Count('*'))
    if level == 'division':
        sql = "with tbl_reports_waste_water_rs as (select tbl_districts.division_id,tbl_reports_waste_water.* from tbl_districts INNER JOIN tbl_reports_waste_water on tbl_districts.district_id=tbl_reports_waste_water.district_id_id) SELECT row_to_json(fc) as geojson FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json ( (SELECT l FROM ( SELECT lg.division_name as name  ,Count(*) total ,lg.division_id code FROM tbl_reports_waste_water_rs sr WHERE sr.division_id=lg.division_id GROUP BY lg.division_name,lg.division_id  ) As l ) ) As properties FROM public.tbl_divisions  As lg    ) As f )  As fc;"
    elif level == 'district':
        sql = "with tbl_reports_waste_water_rs as (select tbl_districts.division_id,tbl_reports_waste_water.* from tbl_districts INNER JOIN tbl_reports_waste_water on tbl_districts.district_id=tbl_reports_waste_water.district_id_id) SELECT row_to_json(fc) as geojson FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json ( (SELECT l FROM ( SELECT lg.district_name as name ,Count(*) total ,lg.district_id code FROM tbl_reports_waste_water_rs sr WHERE sr.district_id_id=lg.district_id GROUP BY lg.district_name,lg.district_id  ) As l ) ) As properties FROM public.tbl_districts  As lg where lg.division_id=" + division_id + "   ) As f )  As fc;"
        result = ViewLabsReports.objects.filter(district_id__division__division_id=division_id).values(
            'district_id__district_name',
            'report_title').annotate(
            name=F('district_id__district_name'),
            dcount=Count('*')).order_by()
        tiles = ViewLabsReports.objects.filter(district_id__division__division_id=division_id).values(
            'report_title').annotate(
            name=F('report_title'),
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


def get_district_count_labs_report_json(request):
    start_date = request.POST.get('start_date', '')
    end_date = request.POST.get('end_date', '')
    if start_date != '':
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    if end_date != '':
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
    qs = ViewLabsReports.objects.all()
    if end_date != '':
        qs = ViewLabsReports.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
    data = qs.values(
        'district_id__district_name').annotate(
        name=F('district_id__district_name'),
        report_title=F('report_title'),
        dcount=Count('*')).order_by('district_id__district_name')
    data = list(data)
    response = json.dumps(data, default=date_handler)
    return HttpResponse(response)


def get_laboratory_wise_report_count(request):
    start_date = request.POST.get('start_date', '')
    end_date = request.POST.get('end_date', '')
    if start_date != '':
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    if end_date != '':
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
    qs = ViewLabsReports.objects.all()
    if end_date != '':
        qs = ViewLabsReports.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
    data = qs.values(
        'laboratory_name__lab_name').annotate(
        name=F('laboratory_name__lab_name'),
        report_title=F('report_title'),
        dcount=Count('*')).order_by('laboratory_name__lab_name')
    data = list(data)
    response = json.dumps(data, default=date_handler)
    return HttpResponse(response)


def get_labs_reports_json(request):
    start_date = request.POST.get('start_date', '')
    end_date = request.POST.get('end_date', '')
    report_type = request.GET.get('report_type', 'air')
    model_report = TblReportsAir
    model_params = TblLabAnalysis
    if report_type == 'water':
        model_report = TblReportsWasteWater
        model_params = TblLabAnalysisWasteWater
    if start_date != '':
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    if end_date != '':
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
    qs = model_report.objects.all()
    if end_date != '':
        qs = model_report.objects.filter(created_at__gte=start_date, created_at__lte=end_date)
    data_params = []
    if request.user.id:
        qs = qs.filter(created_by=request.user)
        data = qs.values()
        data = list(data)
        for r in data:
            r['laboratory_name'] = TblLaboratories.objects.get(id=r['laboratory_name_id']).lab_name
            r['district'] = TblDistricts.objects.get(district_id=r['district_id_id']).district_name
            r['category'] = TblIndustryCategory.objects.get(id=r['category_id']).name
            r['created_by'] = User.objects.get(id=r['created_by_id']).username
            params = model_params.objects.filter(report_id=r['id']).values()
            if params.count() > 0:
                params = list(params)
                for p in params:
                    r[p['parameter']] = p['concentration']
                    # r['peqs_limit'] = p['peqs_limit']
                    # r['method_used'] = p['method_used']
                    # r['remarks'] = p['remarks']
                data_params.append(r)
    response = json.dumps(data_params, default=date_handler)
    return HttpResponse(response)
