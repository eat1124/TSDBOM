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


@shared_task
def test():
    print('测试')


@shared_task
def remote_sync(dest_dir, backup_host_list, model_list):
    """

    :param dest_dir:
    :param backup_host_list:
    :param model_list:
    :return:
    """
    print("定时任务开启。。。", dest_dir, backup_host_list, model_list)
