from django.contrib import admin

# Register your models here.
from labs.models import TblReportsWasteWater, TblLabAnalysisWasteWater
from spiu_gis.admin import TblIndustryMainCategoryAdmin, TblIndustryCategoryAdmin
from spiu_gis.models import TblIndustryMainCategory, TblIndustryCategory

admin.site.register(TblIndustryMainCategory, TblIndustryMainCategoryAdmin)
admin.site.register(TblIndustryCategory, TblIndustryCategoryAdmin)


class TblLabAnalysisWasteWaterInline(admin.TabularInline):
    model = TblLabAnalysisWasteWater
    exclude = ('sample_id_no',)
    extra = 8
    can_delete = False


@admin.register(TblReportsWasteWater)
class TblReportsWasteWaterAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TblReportsWasteWater._meta.fields if
                    field.name not in ("id",)]
    inlines = [TblLabAnalysisWasteWaterInline, ]
    save_on_bottom = True
