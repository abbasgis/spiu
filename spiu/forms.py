from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
    mobile_no = forms.IntegerField(required=False)  # newly added
    cnic = forms.CharField(max_length=200, required=False)  # newly added
    email = forms.EmailField(max_length=200)
    district = forms.CharField(max_length=200)

    class Meta:
        model = User
        fields = ('username', 'mobile_no', 'email', 'cnic', 'district', 'password1')
        labels = {'mobile_no': 'Mobile Number', }  # newly added
