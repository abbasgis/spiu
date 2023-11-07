from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from spiu_gis.models import TblDistricts
from .models import Activity, Photo


class SignupForm(UserCreationForm):
    email = forms.EmailField(max_length=200, help_text='Required')

    class Meta:
        model = User
        fields = ('first_name', 'username', 'email', 'password1', 'password2')


class ActivityPhotoForm(forms.ModelForm):
    district = forms.ModelChoiceField(
        queryset=TblDistricts.objects.all().order_by('district_name'),
        empty_label="Select a District",
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    class Meta:
        model = Activity
        fields = ['district', 'activity_name', 'activity_address', 'activity_remarks', 'latitude', 'longitude']

    # Add the 'image' field from the Photo model to the form
    images = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False, label='Images')

    # You can also add additional fields or customize the form as needed

    def save(self, commit=True, request=None):
        activity = super().save(commit=True)
        images = self.files.getlist('images')
        if request:
            user = request.user
            if user.is_authenticated:
                activity.created_by = user
            activity.save()
        # Create a new Photo instance and associate it with the activity
        if images:
            for image in images:
                Photo.objects.create(activities=activity, image=image)
        return activity
