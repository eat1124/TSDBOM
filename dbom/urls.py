from django.conf.urls import url
from dbom.views import *

urlpatterns = [
    #测试
    url(r'^test_index/$', test_index, {'funid': '2'}),
    url(r'^test_jobs/$', test_jobs, {'funid': '2'}),



    #首页
    url(r'^$', index, {'funid': '2'}),
    url(r'^test/$', test),
    url(r'^processindex/(\d+)/$', processindex),
    url(r'^index/$', index, {'funid': '2'}),
    url(r'^get_process_rto/$', get_process_rto),
    url(r'^get_daily_processrun/$', get_daily_processrun),
    url(r'^get_process_index_data/$', get_process_index_data),

    # 用户登录
    url(r'^login/$', login),
    url(r'^userlogin/$', userlogin),
    url(r'^forgetPassword/$', forgetPassword),
    url(r'^resetpassword/([0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12})/$',
        resetpassword),
    url(r'^reset/$', reset),
    url(r'^password/$', password),
    url(r'^userpassword/$', userpassword),

    # 系统维护
    url(r'^organization/$', organization, {'funid': '91'}),
    url(r'^orgdel/$', orgdel),
    url(r'^orgmove/$', orgmove),
    url(r'^orgpassword/$', orgpassword),
    url(r'^group/$', group, {'funid': '92'}),
    url(r'^groupsave/$', groupsave),
    url(r'^groupdel/$', groupdel),
    url(r'^getusertree/$', getusertree),
    url(r'^groupsaveusertree/$', groupsaveusertree),
    url(r'^getfuntree/$', getfuntree),
    url(r'^groupsavefuntree/$', groupsavefuntree),
    url(r'^function/$', function, {'funid': '93'}),
    url(r'^fundel/$', fundel),
    url(r'^funmove/$', funmove),

    # 备份状态
    url(r'^backup_status/$', backup_status, {'funid': '31'}),
    url(r'^get_backup_status/$', get_backup_status),

    # 备份内容
    url(r'^backup_content/$', backup_content, {'funid': '32'}),
    url(r'^get_backup_content/$', get_backup_content),

    # 计划策略
    url(r'^schedule_policy/$', schedule_policy, {'funid': '33'}),
    url(r'^get_schedule_policy/$', get_schedule_policy),

    # 存储策略
    url(r'^storage_policy/$', storage_policy, {'funid': '34'}),
    url(r'^get_storage_policy/$', get_storage_policy),

    # rsync备份
    url(r'^rsync_hosts/$', rsync_hosts, {'funid': '97'}),
    url(r'^rsync_hosts_save/$', rsync_hosts_save),
    url(r'^rsync_hosts_data/$', rsync_hosts_data),
    url(r'^rsync_config/$', rsync_config, {'funid': '98'}),
    url(r'^rsync_config_data/$', rsync_config_data),
    url(r'^rsync_host_del/$', rsync_host_del),
    url(r'^rsync_reinstall/$', rsync_reinstall),
    url(r'^rsync_config_save/$', rsync_config_save),
    url(r'^rsync_config_del/$', rsync_config_del),
    url(r'^rsync_recover/$', rsync_recover),
    url(r'^rsync_history/$', rsync_history, {'funid': '99'}),
    url(r'^rsync_history_data/$', rsync_history_data),
    url(r'^rsync_history_del/$', rsync_history_del),
    url(r'^server_exchange/$', server_exchange),
    url(r'^get_file_path/$', get_file_path),
    url(r'^get_child_file_path/$', get_child_file_path),

    # 运维记录
    url(r'^inspection/$', inspection_report, {'funid': 62}),  # 巡检报告
    url(r'^save_inspection/$', save_inspection),
    url(r'^get_client_data/$', get_client_data),  # 客户信息
    url(r'^get_clients_info/$', get_clients_info),
    url(r'^inspection_report_data/$', inspection_report_data),
    url(r'^inspection_del/$', inspection_del),
    url(r'^download_inspection/$', download_inspection),

    # 客户录入
    url(r'^clients/$', client_data_index, {'funid': 95}),
    url(r'^clients_data/$', clients_data),
    url(r'^client_data_save/$', client_data_save),
    url(r'^client_data_del/$', client_data_del),



    # 场景管理
    url(r'^scene/$', scene, {'funid': '70'}),
    url(r'^scenedel/$', scenedel),
    url(r'^scenemove/$', scenemove),


    # 预案管理
    url(r'^script/$', script, {'funid': '32'}),
    url(r'^scriptdata/$', scriptdata),
    url(r'^scriptdel/$', scriptdel),
    url(r'^scriptsave/$', scriptsave),
    url(r'^scriptexport/$', scriptexport),
    url(r'^processconfig/$', processconfig, {'funid': '31'}),
    url(r'^processscriptsave/$', processscriptsave),
    url(r'^get_script_data/$', get_script_data),
    url(r'^remove_script/$', remove_script),
    url(r'^setpsave/$', setpsave),
    url(r'^custom_step_tree/$', custom_step_tree),
    url(r'^processconfig/$', processconfig, {'funid': '63'}),
    url(r'^del_step/$', del_step),
    url(r'^move_step/$', move_step),
    url(r'^get_all_groups/$', get_all_groups),
    url(r'^processdesign/$', process_design, {"funid": "33"}),
    url(r'^process_data/$', process_data),
    url(r'^process_save/$', process_save),
    url(r'^process_del/$', process_del),
    url(r'^verify_items_save/$', verify_items_save),
    url(r'^get_verify_items_data/$', get_verify_items_data),
    url(r'^remove_verify_item/$', remove_verify_item),
    # *************************add
    url(r'^processdraw/(\d+)/$', processdraw, {'funid': '67'}),
    url(r'^getprocess/$', getprocess),
    url(r'^processdrawsave/$', processdrawsave),
    url(r'^processdrawrelease/$', processdrawrelease),
    url(r'^processdrawtest/$', processdrawtest),
    url(r'^processcopy/$', processcopy),

    # 切换演练
    url(r'^falconstorswitch/(?P<process_id>\d+)$', falconstorswitch),
    url(r'^falconstorswitchdata/$', falconstorswitchdata),
    url(r'^falconstorrun/$', falconstorrun),
    url(r'^falconstor/(\d+)/$', falconstor, {'funid': '49'}),
    url(r'^save_invitation/$', save_invitation),
    url(r'^falconstor_run_invited/$', falconstor_run_invited),
    url(r'^fill_with_invitation/$', fill_with_invitation),
    url(r'^save_modify_invitation/$', save_modify_invitation),

    url(r'^getrunsetps/$', getrunsetps),
    url(r'^falconstorcontinue/$', falconstorcontinue),
    url(r'^processsignsave/$', processsignsave),
    url(r'^get_current_scriptinfo/$', get_current_scriptinfo),
    url(r'^ignore_current_script/$', ignore_current_script),
    url(r'^stop_current_process/$', stop_current_process),
    url(r'^verify_items/$', verify_items),
    url(r'^show_result/$', show_result),
    url(r'^reject_invited/$', reject_invited),
    url(r'^reload_task_nums/$', reload_task_nums),
    url(r'^delete_current_process_run/$', delete_current_process_run),
    url(r'^get_celery_tasks_info/$', get_celery_tasks_info),
    url(r'^revoke_current_task/$', revoke_current_task),
    url(r'^get_script_log/$', get_script_log),
    url(r'^save_task_remark/$', save_task_remark),
    url(r'^get_server_time_very_second/$', get_server_time_very_second),

    # 历史查询
    url(r'^custom_pdf_report/$', custom_pdf_report),
    url(r'^falconstorsearch/$', falconstorsearch, {'funid': '64'}),
    url(r'^falconstorsearchdata/$', falconstorsearchdata),
    url(r'^tasksearch/$', tasksearch, {'funid': '65'}),
    url(r'^tasksearchdata/$', tasksearchdata),

    # 其他
    url(r'^downloadlist/$', downloadlist, {'funid': '7'}),
    url(r'^download/$', download),
    url(r'^download_list_data/$', download_list_data),
    url(r'^knowledge_file_del/$', knowledge_file_del),

    # 邀请
    url(r'^invite/$', invite),
    url(r'^get_all_users/$', get_all_users),
]
