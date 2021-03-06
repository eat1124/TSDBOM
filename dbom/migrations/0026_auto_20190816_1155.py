# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2019-08-16 11:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbom', '0025_auto_20190723_1055'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inspectionreport',
            name='aging_plan',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='aging_plan_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='aging_plan_run_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='backup_plan',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='backup_plan_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='backup_plan_run_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='cdr_running_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='client_add_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='error_send_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='hardware_error_content',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='media_run_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='running_remark',
        ),
        migrations.RemoveField(
            model_name='inspectionreport',
            name='software_error_content',
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='agent_backup_status',
            field=models.CharField(blank=True, default='', max_length=2000, verbose_name='各类agent备份情况'),
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='commserver_status',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='CommServer灾难运行情况'),
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='library_server',
            field=models.CharField(blank=True, default='', max_length=2000, verbose_name='介质服务器'),
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='library_status',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='备份介质运行状态'),
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='per_week_capacity',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='一个周期数据大概容量:<=1000,>=1000'),
        ),
        migrations.AddField(
            model_name='inspectionreport',
            name='recover_status',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='数据恢复演练情况'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='aging_plan_run',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='数据时效计划运行情况'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='backup_plan_run',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='数据备份计划运行情况'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='cdr_running',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='CDR运行情况'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='client_add',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='增加新的客户端'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='error_send',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='发给cvadmin用户的错误报告'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='extra_error_content',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='其他错误报告内容'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='hardware_error',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='硬件故障信息(json)'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='media_run',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='备份介质'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='running_status',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='报告运行情况'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='software_error',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='软件故障信息'),
        ),
        migrations.AlterField(
            model_name='inspectionreport',
            name='suggestion_and_summary',
            field=models.CharField(blank=True, default='', max_length=640, verbose_name='其他错误报告内容'),
        ),
    ]
