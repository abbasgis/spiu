import json

from django.db.models import Count

from django.http import HttpResponse
from django.template import loader

from giz.models import TblGizData, TblOrganizations
from spiu.utils import date_handler


# Create your views here.
def get_giz_page(request):
    template = loader.get_template('giz_page.html')
    return HttpResponse(template.render({}, request))


def get_sunburst_data(request):
    id = request.GET.get('id', 2)
    chart = request.GET.get('chart', -1)
    data = []
    if chart == 'chart_dept':
        qs = TblGizData.objects.filter(org_id=id)
        if qs.count() > 0:
            qs = qs.values_list('id', flat=True)
            child_ids = list(qs)
            data = TblGizData.get_parent_rows_recursively(child_ids)
            # data = TblGizData.exclude_last_child(data, child_ids)
            # data = get_parent_records(child_ids)
    else:
        qs = get_all_child_records(id)
        data = qs.values()
    data = list(data)
    # data1 = [obj for obj in data if obj['level'] < 5]
    for item in data:
        item['id'] = str(item['id'])
        item['parent'] = str(item['parent']) if item['parent'] is not None else None
    response = json.dumps(data, default=date_handler)
    return HttpResponse(response)


def get_all_child_records(parent_id):
    # parent = TblGizData.objects.get(id=parent_id)
    child_records = TblGizData.objects.filter(parent=parent_id)
    all_child_records = child_records | TblGizData.objects.filter(id=parent_id)
    for record in child_records:
        all_child_records = all_child_records | get_all_child_records(record.id)
    return all_child_records


def get_parent_records(child_ids):
    parent_records = []

    def get_parent(record):
        if record.parent:
            parent = TblGizData.objects.get(id=record.parent)
            # parent = record.parent
            if parent:
                obj = get_parent_obj(parent)
                parent_records.append(obj)
                get_parent(parent)

    for child_id in child_ids:
        child_record = TblGizData.objects.get(id=child_id)
        obj = get_parent_obj(child_record)
        parent_records.append(obj)
        get_parent(child_record)

    return parent_records


def get_parent_obj(qs):
    return {'id': qs.id, 'name': qs.name, 'label': qs.label, 'parent': qs.parent, 'level': qs.level}


def get_organization_data(request):
    leaf_id = 51  # ID of the leaf node
    leaf_node = TblGizData.objects.filter(org_id=69).values_list('id', flat=True)
    # parents_up_to_root = leaf_node.get_parents_up_to_root(leaf_id)
    # leaf_ids = [78, 67, 98]
    records_with_hierarchy = parent_rows = TblGizData.get_parent_rows_recursively(leaf_node)

    qs = TblOrganizations.objects.all().order_by('category', 'name')
    data = list(qs.values())
    summary_qs = TblOrganizations.objects.exclude(category_level__isnull=True).values('category', 'category_level')
    summary_qs = summary_qs.annotate(count=Count('*')).order_by('category')
    summary = list(summary_qs)
    chart_data = create_chart_series_data(summary_qs)
    # summary = list(summary)
    for item in data:
        item['id'] = str(item['id'])
        item['parent'] = str(item['parent']) if item['parent'] is not None else None
    res = {'data': data, 'chart_data': chart_data, 'summary': summary}
    response = json.dumps(res, default=date_handler)
    return HttpResponse(response)


def create_chart_series_data(queryset):
    # Prepare data for categories and series
    attached_series = []
    parent_series = []
    categories = list(queryset.values_list('category', flat=True).distinct().order_by('category'))
    for key in categories:
        qs = list(queryset.filter(category=key))
        for k in qs:
            if k['category_level'] == 'attached':
                attached_series.append(k['count'])
            else:
                parent_series.append(k['count'])
    return {'categories': categories, 'arr_attached': attached_series, 'arr_parents': parent_series}


def get_environment_data(request):
    qs = TblGizData.objects.filter(level__lte=3)
    data = list(qs.values())
    for item in data:
        item['id'] = str(item['id'])
        item['parent'] = str(item['parent']) if item['parent'] is not None else None
    response = json.dumps(data, default=date_handler)
    return HttpResponse(response)


def is_last_two_children(obj, data):
    excluded = False
    for item in data:
        if item['level'] == 6:
            excluded = True
    return excluded
