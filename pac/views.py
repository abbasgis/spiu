import json

from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.template import loader

from spiu.utils import date_handler, date_format_handler
from .models import Photo, Activity


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
    return render(request, 'pac_index.html', {})


def pac_view_activity(request):
    if request.user.is_superuser:
        activities = Activity.objects.all()
    else:
        activities = Activity.objects.filter(created_by=request.user.id)
    data = list(
        activities.values('id', 'district__district_name', 'activity_name', 'activity_address', 'latitude', 'longitude',
                          'created_at'))
    data = json.dumps(data, default=date_format_handler)
    return render(request, 'pac_view_activities.html', {'data': data})


def get_activity_photos(request):
    activity_id = request.GET.get('activity_id')

    # Assuming you have a Photo model with a ForeignKey to Activity
    photos = Photo.objects.filter(activities=activity_id)

    # Assuming the Photo model has an 'image' field to store image URLs
    photo_data = [{'image_url': photo.image.url} for photo in photos]

    return JsonResponse(photo_data, safe=False)
