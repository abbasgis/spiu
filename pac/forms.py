from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from spiu.models import GENDER_CHOICES
from spiu_gis.models import TblDistricts
from .models import Activity, Photo


class SignupForm(UserCreationForm):
    mobile_no = forms.IntegerField(required=False, label="Mobile No")
    email = forms.EmailField(max_length=200, help_text='Required')
    district_id = forms.ModelChoiceField(label='District Name',
                                         queryset=TblDistricts.objects.all().order_by('district_name'))
    organization_name = forms.CharField(required=True, max_length=250, label="Organization Name")
    gender = forms.CharField(
        max_length=100,
        required=False,  # You can set this to True if the field is mandatory
        widget=forms.Select(choices=GENDER_CHOICES),
        # Add any other relevant attributes like blank, null, etc.
    )

    class Meta:
        model = User
        fields = (
            'first_name', 'username', 'district_id', 'gender', 'mobile_no', 'email', 'organization_name', 'password1',
            'password2')
        labels = {'mobile_no': 'Mobile Number', }


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class ActivityPhotoForm(forms.ModelForm):
    district = forms.ModelChoiceField(
        queryset=TblDistricts.objects.all().order_by('district_name'),
        empty_label="Select a District",
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    images = MultipleFileField(label='Select files', required=False)

    class Meta:
        model = Activity
        fields = ['district', 'activity_name', 'activity_address', 'activity_remarks', 'latitude', 'longitude',
                  'images']

    def save(self, commit=True, request=None):
        activity = super().save(commit=False)
        images = self.files.getlist('images')

        if request:
            user = request.user
            if user.is_authenticated:
                activity.created_by = user

        if commit:
            activity.save()

        # Create a new Photo instance for each uploaded image
        if images:
            for image in images:
                Photo.objects.create(activities=activity, image=image)

        return activity
