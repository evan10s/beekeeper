from django.contrib import admin
from django.conf import settings
# Register your models here.
from .models import Treatment

class TreatmentAdmin(admin.ModelAdmin):
    fields = ['owner','timestamp','bg','dose']

admin.site.register(Treatment)
