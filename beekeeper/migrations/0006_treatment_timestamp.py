# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-11-04 20:30
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beekeeper', '0005_auto_20171104_1515'),
    ]

    operations = [
        migrations.AddField(
            model_name='treatment',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2017, 10, 5, 12, 0)),
            preserve_default=False,
        ),
    ]