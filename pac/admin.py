from django.contrib import admin

from pac.models import Activity


# Register your models here.
@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Activity._meta.fields if
                    field.name not in ("created_by", "updated_by", "created_at", "updated_at",)]
