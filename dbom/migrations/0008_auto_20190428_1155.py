# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-04-28 11:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbom', '0007_auto_20190428_1155'),
    ]

    operations = [
        migrations.AddField(
            model_name='inspectionreport',
            name='client_sign',
            field=models.CharField(blank=True, default='', max_length=512, verbose_name='客户签字'),
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='engineer_sign',
            field=models.CharField(blank=True, default='', max_length=512, verbose_name='维修工程师签字'),
        ),
    ]