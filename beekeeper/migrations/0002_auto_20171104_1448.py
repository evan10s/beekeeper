# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-04 18:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beekeeper', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='treatment',
            name='timestamp',
        ),
        migrations.AddField(
            model_name='treatment',
            name='meal',
            field=models.TextField(default='Lunch', max_length=25),
            preserve_default=False,
        ),
    ]
