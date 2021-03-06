# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from djcelery import models as djmodels


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
    state = models.CharField("状态", blank=True, max_length=20, default="")


class InspectionOperate(models.Model):
    """
    巡检操作
    """
    version = models.CharField("Commvault版本", max_length=128, blank=True, default="")
    host_name = models.CharField("主机名", max_length=128, blank=True, default="")
    os_platform = models.CharField("OS平台", max_length=128, blank=True, default="")
    patch = models.CharField("补丁", max_length=128, blank=True, default="")
    all_client = models.IntegerField("全部客户端", default=0)
    offline_client = models.IntegerField("脱机客户端", default=0)
    offline_client_content = models.CharField("脱机故障内容", max_length=512, blank=True, default="")
    # 介质服务器
    library_server = models.TextField("介质服务器", blank=True, default="")
    # [{
    #     "ma_name": "",
    #     "ma_ip": "",
    #     "total_capacity": 0,
    #     "used_capacity": 0,
    #     "per_month_add_rate": 0
    # }...]
    state = models.CharField("状态", blank=True, max_length=20, default="")


class InspectionReport(models.Model):
    """
    巡检报告
    """
    inspection_operate = models.OneToOneField(InspectionOperate, null=True, verbose_name='巡检操作')
    client_data = models.ForeignKey(ClientData, null=True, verbose_name='客户资料')
    title = models.CharField("报告标题", max_length=256)
    cur_date = models.DateField("巡检日期", null=True)
    engineer = models.CharField("责任工程师", max_length=128, blank=True, default="")
    last_date = models.DateField("上次巡检日期", null=True)
    next_date = models.DateField("预计下次巡检日期", null=True)

    hardware_error = models.CharField("硬件故障信息(json)", max_length=640, blank=True, default="")
    software_error = models.CharField("软件故障信息", max_length=640, blank=True, default="")
    aging_plan_run = models.CharField("数据时效计划运行情况", max_length=640, blank=True, default="")
    backup_plan_run = models.CharField("数据备份计划运行情况", max_length=640, blank=True, default="")
    running_status = models.CharField("报告运行情况", max_length=640, blank=True, default="")
    client_add = models.CharField("增加新的客户端", max_length=640, blank=True, default="")
    error_send = models.CharField("发给cvadmin用户的错误报告", max_length=640, blank=True, default="")
    cdr_running = models.CharField("CDR运行情况", max_length=640, blank=True, default="")

    extra_error_content = models.CharField("其他错误报告内容", max_length=640, blank=True, default="")
    suggestion_and_summary = models.CharField("建议和总结", max_length=640, blank=True, default="")

    client_sign = models.CharField("客户签字", max_length=512, blank=True, default="")
    client_sign_date = models.DateField("客户签字日期", null=True)
    engineer_sign = models.CharField("维修工程师签字", max_length=512, blank=True, default="")
    engineer_sign_date = models.DateField("维修工程师签字日期", null=True)
    state = models.CharField("状态", blank=True, max_length=20, default="")

    # modify
    commserver_status = models.CharField("CommServer灾难运行情况", max_length=640, blank=True, default="")

    agent_backup_status = models.TextField("各类agent备份情况", blank=True, default="")
    # [{
    #     "agent_name": "",
    #     "status": 1/0,
    #     "remark": ""
    # },...]

    period_capacity = models.CharField("一个周期数据大概容量:<=1000,>=1000", max_length=640, blank=True, default="")
    auxiliary_copy = models.CharField("辅助拷贝", max_length=640, blank=True, default="")
    library_status = models.CharField("备份介质运行状态", max_length=640, blank=True, default="")
    recover_status = models.CharField("数据恢复演练情况", max_length=640, blank=True, default="")


class RsyncHost(models.Model):
    """
    Rsync主机模型
    """
    ip_addr = models.CharField("主机ip", max_length=128)
    username = models.CharField("用户名", max_length=64)
    password = models.CharField("密码", max_length=256)
    log = models.CharField("安装错误日志", max_length=512, blank=True)
    state = models.CharField("逻辑删除:'9'", max_length=16, blank=True, default="")
    status_choices = (
        (1, "服务启动"),
        (2, "服务关闭"),
    )
    status = models.IntegerField("Web服务状态", choices=status_choices, default=2)


class RsyncConfig(models.Model):
    """
    Rsync配置
    """
    main_host = models.ForeignKey(RsyncHost, null=True, related_name="main_host", verbose_name="源端")
    backup_host = models.ForeignKey(RsyncHost, null=True, related_name="backup_host", verbose_name="终端")
    dj_periodictask = models.OneToOneField(djmodels.PeriodicTask, null=True, verbose_name="定时任务")
    log = models.CharField("配置失败日志", max_length=512, blank=True, default="")
    state = models.CharField("逻辑删除:'9'", max_length=16, blank=True, default="")


class RsyncModel(models.Model):
    """
    Rsync模块>>备份路径
    """
    rsync_config = models.ForeignKey(RsyncConfig, null=True, verbose_name="Rsync配置")
    main_path = models.CharField("源端路径", max_length=512, default="")
    dest_path = models.CharField("终端路径", max_length=512, default="")
    model_name = models.CharField("模块名称", max_length=128, default="")
    state = models.CharField("逻辑删除:'9'", max_length=16, blank=True, default="")


class RsyncRecord(models.Model):
    """
    Rsync备份记录
    """
    rsync_config = models.ForeignKey(RsyncConfig, null=True, verbose_name="Rsync配置")
    starttime = models.DateTimeField("开始时间", blank=True)
    endtime = models.DateTimeField("结束时间", blank=True)
    main_host = models.CharField("关联主机", max_length=512, blank=True)
    backup_host = models.CharField("关联备份主机", max_length=512, blank=True)
    log = models.CharField("备份失败日志", max_length=5000, blank=True)
    status_choices = (
        (1, "成功"),
        (2, "失败"),
    )
    status = models.IntegerField("备份状态", choices=status_choices, default=1)
    state = models.CharField("逻辑删除:'9'", max_length=16, blank=True, default="")
