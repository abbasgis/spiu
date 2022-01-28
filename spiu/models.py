from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=150, blank=True)
    mobile_no = models.BigIntegerField(max_length=254, blank=True)
    cnic = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    is_disclaimer_agreed = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def update_profile_signal(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
