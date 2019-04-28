# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-04-28 11:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbom', '0006_auto_20190426_1341'),
    ]

    operations = [
        migrations.RenameField(
            model_name='inspectionreport',
            old_name='client_sign',
            new_name='client_sign_date',
        ),
        migrations.RenameField(
            model_name='inspectionreport',
            old_name='engineer_sign',
            new_name='engineer_sign_date',
        ),
        migrations.AddField(
            model_name='inspectionoperate',
            name='os_platform',
            field=models.CharField(blank=True, default='', max_length=128, verbose_name='OS平台'),
        ),
        migrations.AlterField(
            model_name='inspectionoperate',
            name='host_name',
            field=models.CharField(blank=True, default='', max_length=128, verbose_name='主机名'),
        ),
    ]
