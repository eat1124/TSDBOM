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
from djcelery.models import PeriodicTask


@shared_task
def test():
    print('测试')


@shared_task
def remote_sync(main_host_ip, dest_host_ip, model_list, periodictask_id):
    """

    :param main_host_ip:
    :param backup_host_list:
    :param model_list:
    :param periodictask_id:
    :return:
    """
    model_list = eval(model_list)
    temp_log = ''
    start_time = datetime.datetime.now()
    end_time = ''
    cur_rsync_record = RsyncRecord()
    try:
        cur_periodictask = PeriodicTask.objects.get(id=int(periodictask_id))
    except:
        pass
    else:
        cur_rsync_config = cur_periodictask.rsyncconfig
        try:
            cur_rsync_host = RsyncHost.objects.get(id=int(main_host_ip))
        except RsyncHost.DoesNotExist as e:
            pass
        else:
            client = {
                'hostname': cur_rsync_host.ip_addr,
                'username': cur_rsync_host.username,
                'password': cur_rsync_host.password,
            }
            rsync_backup = RsyncBackup(client)
            if rsync_backup.msg == "远程连接成功。":
                try:
                    cur_backup_host = RsyncHost.objects.get(id=int(dest_host_ip))
                except RsyncHost.DoesNotExist as e:
                    temp_log += info
                    result = 0
                    cur_rsync_record.starttime = start_time
                    cur_rsync_record.endtime = datetime.datetime.now()
                    cur_rsync_record.status = 2
                    cur_rsync_record.log = "备份服务器不存在：%s" % temp_log
                    cur_rsync_record.rsync_config_id = cur_rsync_config.id
                    cur_rsync_record.save()
                    return
                else:
                    log_init = ""
                    for cur_model in model_list:
                        result, info = rsync_backup.rsync_pull(cur_model["origin_path"], cur_backup_host.ip_addr, cur_model["model_name"], delete=True)
                        if result == 1:
                            print("成功备份。")
                        else:
                            print("备份失败。")
                            temp_log += info
                            cur_rsync_record.starttime = start_time
                            cur_rsync_record.endtime = datetime.datetime.now()
                            cur_rsync_record.status = 2
                            cur_rsync_record.log = "备份服务器不存在：%s" % temp_log
                            cur_rsync_record.rsync_config_id = cur_rsync_config.id
                            cur_rsync_record.save()
                            return
                # 对比日志保存
                log_result, log_info = 1, ""
                # 查看服务端日志
                try:
                    server_host = RsyncHost.objects.get(id=int(dest_host_ip))
                except RsyncHost.DoesNotExist as e:
                    pass
                else:
                    client = {
                        'hostname': server_host.ip_addr,
                        'username': server_host.username,
                        'password': server_host.password,
                    }
                    server_rsync = RsyncBackup(client)
                    if server_rsync.msg == "远程连接成功。":
                        log_result, log_info = server_rsync.cat_rsync_log()

                cur_rsync_record.log = log_info
                cur_rsync_record.starttime = start_time
                cur_rsync_record.endtime = datetime.datetime.now()
                cur_rsync_record.status = 1
                cur_rsync_record.main_host = cur_rsync_host.ip_addr
                cur_rsync_record.backup_host = cur_backup_host.ip_addr
                cur_rsync_record.rsync_config_id = cur_rsync_config.id
                cur_rsync_record.save()
            else:
                cur_rsync_record.starttime = start_time
                cur_rsync_record.endtime = datetime.datetime.now()
                cur_rsync_record.status = 2
                cur_rsync_record.log = "远程连接失败。"
                cur_rsync_record.rsync_config_id = cur_rsync_config.id
                cur_rsync_record.save()


@shared_task
def check_server_status():
    """
    每隔半小时检查所有rsync主机服务器是否开启，若关闭则取消定时任务。
    :return:
    """
    all_rsync_configs = RsyncConfig.objects.exclude(state="9")
    for rsync_config in all_rsync_configs:
        main_host = rsync_config.main_host
        server = {
            'hostname': main_host.ip_addr,
            'username': main_host.username,
            'password': main_host.password,
        }
        rsync_backup = RsyncBackup(server)
        if rsync_backup.msg == "远程连接失败。":
            cur_periodictask = rsync_config.dj_periodictask
            cur_periodictask.enabled = 0
            cur_periodictask.save()

