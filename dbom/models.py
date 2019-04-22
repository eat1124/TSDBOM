# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User


class Fun(models.Model):
    pnode = models.ForeignKey('self', blank=True, null=True, related_name='children', verbose_name='父节点')
    name = models.CharField("功能名称", max_length=100)
    sort = models.IntegerField("排序", blank=True, null=True)
    type = models.CharField("类型", blank=True, null=True, max_length=20)
    url = models.CharField("地址", blank=True, null=True, max_length=500)
    icon = models.CharField("图标", blank=True, null=True, max_length=100)


class Group(models.Model):
    name = models.CharField("组名", blank=True, null=True, max_length=50)
    fun = models.ManyToManyField(Fun)
    remark = models.CharField("说明", blank=True, null=True, max_length=5000)
    state = models.CharField("状态", blank=True, null=True, max_length=20)
    sort = models.IntegerField("排序", blank=True, null=True)


class UserInfo(models.Model):
    user = models.OneToOneField(User, blank=True, null=True, )
    userGUID = models.CharField("GUID", null=True, max_length=50)
    fullname = models.CharField("姓名", blank=True, max_length=50)
    phone = models.CharField("电话", blank=True, null=True, max_length=50)
    group = models.ManyToManyField(Group)
    pnode = models.ForeignKey('self', blank=True, null=True, related_name='children', verbose_name='父节点')
    type = models.CharField("类型", blank=True, null=True, max_length=20)
    state = models.CharField("状态", blank=True, null=True, max_length=20)
    sort = models.IntegerField("排序", blank=True, null=True)
    remark = models.CharField("说明", blank=True, null=True, max_length=5000)
    company = models.CharField("公司", blank=True, null=True, max_length=100)
    tell = models.CharField("电话", blank=True, null=True, max_length=50)
    forgetpassword = models.CharField("修改密码地址", blank=True, null=True, max_length=50)


class KnowledgeFileDownload(models.Model):
    """
    知识库
    """
    person = models.CharField("上传人", blank=True, null=True, max_length=64)
    upload_time = models.DateTimeField("上传时间", blank=True, null=True)
    remark = models.CharField("备注", blank=True, null=True, max_length=500)
    file_name = models.CharField("文件名称", blank=True, null=True, max_length=128)
    state = models.CharField("状态", blank=True, null=True, max_length=20)


class ClientData(models.Model):
    """
    客户资料
    """
    client_name = models.CharField("客户名称", max_length=256, blank=True, default="")
    address = models.CharField("客户地址", max_length=256, blank=True, default="")
    contact = models.CharField("联系人", max_length=128, blank=True, default="")
    position = models.CharField("职位", max_length=128, blank=True, default="")
    tel = models.CharField("联系电话", max_length=128, blank=True, default="")
    fax = models.CharField("传真", max_length=128, blank=True, default="")
    email = models.CharField("电子邮件", max_length=128, blank=True, default="")


class InspectionOperate(models.Model):
    """
    巡检操作
    """
    startdate = models.DateTimeField("开始时间", null=True)
    enddate = models.DateTimeField("结束时间", null=True)
    version = models.CharField("Commvault版本", max_length=128, blank=True, default="")
    host_name = models.CharField("OS平台/主机名", max_length=128, blank=True, default="")
    patch = models.CharField("补丁", max_length=128, blank=True, default="")
    all_client = models.IntegerField("全部客户端", default=0)
    offline_client = models.IntegerField("脱机客户端", default=0)
    offline_client_content = models.CharField("脱机故障内容", max_length=512, blank=True, default="")
    backup_time = models.IntegerField("备份次数", default=0)
    fail_time = models.IntegerField("失败次数", default=0)
    fail_log = models.CharField("失败日志", max_length=512, blank=True, default="")
    total_capacity = models.IntegerField("存储总容量", default=0)
    used_capacity =  models.IntegerField("已用容量", default=0)
    increase_capacity = models.IntegerField("平均每月增长量", default=0)


class InspectionReport(models.Model):
    """
    巡检报告
    """
    inspection_operate = models.OneToOneField(InspectionOperate, null=True, verbose_name='巡检操作')
    client_data = models.ForeignKey(ClientData, null=True, verbose_name='客户资料')
    title = models.CharField("报告标题", max_length=256)
    cur_date = models.DateTimeField("巡检日期", null=True)
    engineer = models.CharField("责任工程师", max_length=128, blank=True, default="")
    last_date = models.DateTimeField("上次巡检日期", null=True)
    next_date = models.DateTimeField("预计下次巡检日期", null=True)
    first_choices = (
            (1, "正常"),
            (0, "异常"),
        )
    second_choices = (
            (1, "是"),
            (0, "否"),
        )
    third_choices = (
            (1, "有"),
            (0, "否"),
        ) 
    hardware_error = models.IntegerField("是否硬件故障", choices=first_choices, default=1)
    hardware_error_content = models.CharField("硬件故障备注", max_length=512, blank=True, default="")
    software_error = models.IntegerField("是否软件故障", choices=first_choices, default=1)
    software_error_content = models.CharField("软件故障备注", max_length=512, blank=True, default="")
    aging_plan_run = models.IntegerField("数据时效计划运行情况", choices=first_choices, default=1)   
    aging_plan_remark = models.CharField("时效计划运行备注", max_length=512, blank=True, default="")
    backup_plan_run = models.IntegerField("数据备份计划运行情况", choices=first_choices, default=1)
    backup_plan_run_remark = models.CharField("备份计划运行备注", max_length=512, blank=True, default="")
    running_status = models.IntegerField("报告运行情况", choices=first_choices, default=1)
    running_remark = models.CharField("运行情况备注", max_length=512, blank=True, default="")
    client_add = models.IntegerField("最近是否打算要增加新的客户端", choices=second_choices, default=1)
    client_add_remark = models.CharField("新增客户端备注", max_length=512, blank=True, default="")
    backup_plan = models.IntegerField("备份计划", choices=first_choices, default=1)
    backup_plan_remark = models.CharField("备份计划", max_length=512, blank=True, default="")
    aging_plan = models.IntegerField("数据时效计划", choices=first_choices, default=1)
    aging_plan_remark = models.CharField("时效计划备注", max_length=512, blank=True, default="")
    error_send = models.IntegerField("有否发给cvadmin用户的错误报告", choices=third_choices, default=1)
    error_send_remark = models.CharField("错误报告备注", max_length=512, blank=True, default="")
    cdr_running = models.IntegerField("CDR运行情况", choices=first_choices, default=1)
    cdr_running_remark = models.CharField("CDR运行备注", max_length=512, blank=True, default="")
    media_run = models.IntegerField("备份介质运行状态", choices=first_choices, default=1)
    media_run_remark = models.CharField("备份介质运行备注", max_length=512, blank=True, default="")

    extra_error_content = models.CharField("其他错误报告内容", max_length=2000, blank=True, default="")
    suggestion_and_summary = models.CharField("其他错误报告内容", max_length=2000, blank=True, default="")

    client_sign = models.DateTimeField("客户签字日期", null=True)
    engineer_sign = models.DateTimeField("维修工程师签字日期", null=True)





