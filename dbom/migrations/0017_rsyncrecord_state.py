# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-07-03 13:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbom', '0016_auto_20190701_1139'),
    ]

    operations = [
        migrations.AddField(
            model_name='rsyncrecord',
            name='state',
            field=models.CharField(blank=True, default='', max_length=16, verbose_name="逻辑删除:'9'"),
        ),
    ]