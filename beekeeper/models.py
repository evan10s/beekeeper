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
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField('date submitted')
    bg = models.IntegerField(name="BG")
    dose = models.DecimalField(max_digits=4, decimal_places=2)

    def __str__(self):
        return self.owner.username + " " + str(self.timestamp)
