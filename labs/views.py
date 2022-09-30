from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader


def get_labs_page(request):
    template = loader.get_template('labs.html')
    return HttpResponse(template.render({}, request))