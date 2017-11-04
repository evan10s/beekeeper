from django.db import models
from django.contrib.auth.models import User #this line is from http://www.b-list.org/weblog/2006/jun/06/django-tips-extending-user-model/
from decimal import Decimal

"""
Models:
Treatment:
    User
    Timestamp
    BG: Int
    Carbs: Int
    Insulin: Decimal
    Notes
"""

class Treatment(models.Model):
    #owner = models.ForeignKey(User, on_delete=models.CASCADE)
    meal = models.CharField(max_length=25)
    bg = models.IntegerField(verbose_name="BG")
    dose = models.DecimalField(verbose_name="Insulin dose",max_digits=4, decimal_places=2)
    carbs = models.IntegerField()

    def __str__(self):
        return self.meal + " " + str(self.dose)
