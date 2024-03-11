import json
import os

from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, FileResponse
from django.shortcuts import render
from django.template import loader

from spiu.settings import MEDIA_ROOT
from spiu.utils import date_handler, date_format_handler
from spiu_gis.models import TblDistricts
from .models import Photo, Activity, PacCertificates


# Create your views here.
def get_pac_page(request):
    template = loader.get_template('pac_index.html')
    return HttpResponse(template.render({}, request))


from django.shortcuts import render, redirect
from .forms import ActivityPhotoForm, SignupForm


def pac_login_page(request):
    user_name = request.POST.get('username')
    password = request.POST.get('password')
    next_url = request.GET.get('next', '/pac')
    try:
        user = authenticate(username=user_name, password=password)
        login(request, user)
        return redirect(next_url)
    except Exception as e:
        print(e.args)
    return render(request, 'pac_login.html', {})


def pac_signup_page(request):
    if request.method == 'POST':
        data = request.POST
        post_data_copy = request.POST.copy()
        post_data_copy['username'] = data['email']
        post_data_copy['password2'] = data['password1']
        form = SignupForm(post_data_copy)
        if form.is_valid():
            user = form.save()
            user.profile.mobile_no = form.cleaned_data.get('mobile_no')
            user.profile.email = form.cleaned_data.get('email')
            district_id = form.cleaned_data.get('district_id')
            user.profile.district_id = district_id
            user.profile.district = district_id.district_name
            user.profile.gender = form.cleaned_data.get('gender')
            user.profile.organization_name = form.cleaned_data.get('organization_name')
            user.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return redirect('/pac')  # Redirect to the home page after signup
    else:
        form = SignupForm()
    return render(request, 'pac_register.html', {'form': form})


def pac_add_activity(request):
    if request.method == 'POST':
        form = ActivityPhotoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save(commit=False, request=request)  # Get the Activity instance without saving to the database
            messages.success(request, 'Activity uploaded successfully.')
        else:
            messages.error(request, form.errors)
    else:
        form = ActivityPhotoForm()
    return render(request, 'pac_add_activity.html', {'form': form})


def pac_page(request):
    reg_users = User.objects.filter(id__gt=95).count()
    act_count = Activity.objects.all().count()
    return render(request, 'pac_index.html', {'reg_users': reg_users, 'activities_count': act_count})


def pac_view_activity(request):
    if request.user.is_superuser or request.user.id == 192:
        activities = Activity.objects.all()
    else:
        activities = Activity.objects.filter(created_by=request.user.id)
    data = list(
        activities.values('id', 'district__district_name', 'activity_name', 'activity_address', 'latitude', 'longitude',
                          'created_at', 'created_by__username'))
    data = json.dumps(data, default=date_format_handler)
    return render(request, 'pac_view_activities.html', {'data': data})


def get_activity_photos(request):
    activity_id = request.GET.get('activity_id')

    # Assuming you have a Photo model with a ForeignKey to Activity
    photos = Photo.objects.filter(activities=activity_id)

    # Assuming the Photo model has an 'image' field to store image URLs
    photo_data = [{'image_url': photo.image.url} for photo in photos]

    return JsonResponse(photo_data, safe=False)


@login_required
def download_certificate(request, certificate):
    try:
        user_id = request.user.id
        certificate_instance = PacCertificates.objects.filter(pk=user_id)
        if certificate_instance.count() == 0:
            return HttpResponse(
                "Message: You are not registered with this campaign",
                status=500)
        else:
            certificate_instance = PacCertificates.objects.get(pk=user_id)
        # file_name = '1.png'
        file_name = str(user_id) + '.pdf'
        if certificate and certificate == 'a':
            url = MEDIA_ROOT + '/pac/certificates/awards/' + file_name
            certificate_instance.award_download = True
        else:
            url = MEDIA_ROOT + '/pac/certificates/registration/' + file_name
            certificate_instance.reg_download = True
        # content_type = get_content_type(file_name)
        response = FileResponse(open(url, 'rb'), content_type='application/pdf')
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        response['X-Frame-Options'] = 'ALLOWALL'
        # response['Content-Security-Policy'] = "frame-ancestors 'self' http://localhost:86"
        # response["Content-Disposition"] = "filename={}".format(file_name)
        response["Content-Disposition"] = "attachment; filename={}".format(file_name)
        certificate_instance.save()
        return response
    except Exception as e:
        return HttpResponse(
            "Award certificate is only issued to those who conducted activities in schools, For any query please contact at 0333-6862840 or email at adgis@epd.punjab.gov.pk ",
            status=500)


def get_content_type(file_name):
    file_extension = os.path.splitext(file_name)[1].lower()
    content_type = ""
    if file_extension == '.pdf':
        content_type = "application/pdf"
    elif file_extension == '.png':
        content_type = "image/png"
    elif file_extension == '.jpg' or file_extension == '.jpeg':
        content_type = "image/jpeg"
    else:
        # Handle unsupported file types or provide a default content type
        content_type = "application/octet-stream"
    return content_type
