from django.contrib import admin

from giz.models import TblGizData, TblOrganizations


# Register your models here.
@admin.register(TblGizData)
class LabsUnitAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblGizData._meta.fields if
                    field.name not in ("",)]


@admin.register(TblOrganizations)
class LabsUnitAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblOrganizations._meta.fields if
                    field.name not in ("",)]
