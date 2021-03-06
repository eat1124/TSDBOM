# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-04-26 13:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbom', '0005_auto_20190423_1411'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inspectionoperate',
            name='increase_capacity',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='平均每月增长量'),
        ),
        migrations.AlterField(
            model_name='inspectionoperate',
            name='total_capacity',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='存储总容量'),
        ),
        migrations.AlterField(
            model_name='inspectionoperate',
            name='used_capacity',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='已用容量'),
        ),
    ]
