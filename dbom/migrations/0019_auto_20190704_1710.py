# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-07-04 17:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbom', '0018_auto_20190703_1456'),
    ]

    operations = [
        migrations.AddField(
            model_name='rsyncrecord',
            name='backup_host',
            field=models.CharField(blank=True, max_length=512, verbose_name='关联备份主机'),
        ),
        migrations.AddField(
            model_name='rsyncrecord',
            name='main_host',
            field=models.CharField(blank=True, max_length=512, verbose_name='关联主机'),
        ),
    ]