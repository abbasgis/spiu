from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from spiu_gis.models import TblDistricts

DESIGNATION = (
    ('AD', 'Assistant Director'),
    ('DD', 'Deputy Director'),
)
GENDER_CHOICES = (
    ('male', 'Male'),
    ('female', 'Female'),
    ('-', 'Rather not say'),
)


class Profile(models.Model):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    mobile_no = models.BigIntegerField(blank=True, null=True)
    cnic = models.CharField(max_length=32, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    district_id = models.OneToOneField(TblDistricts, models.DO_NOTHING, db_column='district_id', blank=True, null=True)
    district_incharge = models.CharField(max_length=100, blank=True, null=True)
    district_incharge_designation = models.CharField(max_length=100, blank=True, null=True, choices=DESIGNATION)
    user = models.OneToOneField(User, models.DO_NOTHING)
    is_disclaimer_agreed = models.BooleanField(blank=True, null=True)
    gender = models.CharField(max_length=100, blank=True, null=True, choices=GENDER_CHOICES)
    organization_name = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def update_profile_signal(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
