import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.db.models import Count
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template import loader

from spiu_gis.models import PoultryFarms
from .models import Profile

from .forms import SignUpForm
from .utils import date_handler
from django.template.defaultfilters import register


@register.filter(name='has_group')
def has_group(user, group_name):
    return user.groups.filter(name=group_name).exists()


def spiu_page(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render({}, request))


@login_required
def homepage(request):
    p = Profile.objects.get(user_id=request.user.id)
    template = loader.get_template('map.html')
    if not p.is_disclaimer_agreed or p.is_disclaimer_agreed is None:
        template = loader.get_template('disclaimer.html')
    return HttpResponse(template.render({}, request))


def disclaimer_page(request):
    template = loader.get_template('disclaimer.html')
    if 'chk_disclaimer_agreed' in request.POST:
        p = Profile.objects.get(user_id=request.user.id)
        p.is_disclaimer_agreed = True
        p.save()
        template = loader.get_template('map.html')
    return HttpResponse(template.render({}, request))


@login_required
def dashboard_page(request):
    rs = (PoultryFarms.objects.all())
    total_records = rs.count()
    start_date = str(rs.earliest('updated_at').updated_at.date())
    end_date = str(rs.latest('updated_at').updated_at.date())
    template = loader.get_template('dashboard.html')
    return HttpResponse(
        template.render({'total': total_records, 'start_date': start_date, 'end_date': end_date}, request))


# newly added function
def update_user_data(user):
    Profile.objects.update_or_create(user=user, defaults={'mobile_no': user.profile.mobile_no})


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user_name = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password1')
            user = User.objects.create_user(user_name, email, password)
            user.profile.mobile_no = form.cleaned_data.get('mobile_no')
            user.profile.email = form.cleaned_data.get('email')
            user.profile.district_id = form.cleaned_data.get('district_id')
            user.save()
            # Profile.objects.get(user_id=user.id).update(cnic=cnic)
            # load the profile instance created by the signal
            # user.save()
            raw_password = form.cleaned_data.get('password1')

            # login user after signing up
            user = authenticate(username=user.username, password=raw_password)
            login(request, user)

            # redirect user to home page
            return redirect('home')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


@login_required
def reset_password_spiu(request):
    try:
        if request.user.is_superuser:
            user_email = request.GET.get('email')
            new_password = request.GET.get('password')
            user = User.objects.get(email=user_email)
            user.password = make_password(new_password)
            # Save the user object to persist the changes
            user.save()
            return HttpResponse('password change successfully to ' + new_password)
    except User.DoesNotExist:
        # Handle the case where the user does not exist
        return HttpResponse('User does not exist')
