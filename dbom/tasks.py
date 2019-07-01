from __future__ import absolute_import
from celery import shared_task
import pymssql
from dbom.models import *
from django.db import connection
from xml.dom.minidom import parse, parseString
from . import remote
from .models import *
from .funcs import *
import datetime
from django.db.models import Q
import time
from .CVApi_bak import CVRestApiToken, CVApiOperate
from .rsync_demo import RsyncBackup


@shared_task
def test():
    print('测试')


@shared_task
def remote_sync(main_host_ip, backup_host_list, model_list):
    """

    :param main_host_ip:
    :param backup_host_list:
    :param model_list:
    :return:
    """
    backup_host_list = eval(backup_host_list)
    model_list = eval(model_list)
    temp_log = ''
    try:
        cur_rsync_host = RsyncHost.objects.get(id=main_host_ip)
    except RsyncHost.DoesNotExist as e:
        pass
    else:
        server = {
            'hostname': cur_rsync_host.ip_addr,
            'username': cur_rsync_host.username,
            'password': cur_rsync_host.password,
        }
        rsync_backup = RsyncBackup(server)
        if rsync_backup.msg == "远程连接成功。":
            for backup_host in backup_host_list:
                try:
                    cur_backup_host = RsyncHost.objects.get(id=int(backup_host))
                except RsyncHost.DoesNotExist as e:
                    temp_log += info
                else:
                    for cur_model in model_list:
                        print(cur_model["backup_path"])
                        result, info = rsync_backup.rsync_exec_avz(cur_model["backup_path"], cur_backup_host.ip_addr, cur_model["model_name"], delete=True)
                        if result == 1:
                            print("成功备份。")
                        else:
                            print("备份失败。")
                            temp_log += info
        else:
            temp_log += "远程连接失败。"

    print(temp_log)
