from django import forms

from spiu_gis.models import PoultryFarms


class PoultryFarmsForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(PoultryFarmsForm, self).__init__(*args, **kwargs)
        self.fields['district_id'].widget.attrs = {'label': 'shakir', 'data-live-search': 'true'}
        # self.fields['district_id']["data-live-search"] = 'true'

    class Meta:
        model = PoultryFarms
        exclude = ['created_at']
