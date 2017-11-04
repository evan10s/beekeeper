from django.contrib import admin
from django.conf import settings
# Register your models here.
from .models import Treatment

admin.site.register(Treatment)
