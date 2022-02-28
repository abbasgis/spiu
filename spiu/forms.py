from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from spiu.models import DESIGNATION
from spiu_gis.models import TblDistricts


class SignUpForm(UserCreationForm):
    mobile_no = forms.IntegerField(required=False, label="Mobile No")  # newly added
    email = forms.EmailField(max_length=200)
    # district = forms.CharField(max_length=200)
    district_id = forms.ModelChoiceField(label='District Name',
                                         queryset=TblDistricts.objects.all().order_by('district_name'))

    class Meta:
        model = User
        fields = ('username', 'mobile_no', 'email', 'district_id', 'password1')
        labels = {'mobile_no': 'Mobile Number', }  # newly added
