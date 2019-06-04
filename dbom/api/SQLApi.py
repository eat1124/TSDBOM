import pymssql
import datetime


class DataMonitor(object):
    def __init__(self, credit):
        self.host = credit["host"]
        self.user = credit["user"]
        self.password = credit["password"]
        self.database = credit["database"]
        self._conn = self._connection
        self.msg = ""

    @property
    def _connection(self):
        try:
            connection = pymssql.connect(host=self.host, user=self.user, password=self.password, database=self.database)
        except pymssql.OperationalError as e:
            self.msg = "链接数据库失败。"
            return None
        else:
            return connection

    def fetch_one(self, temp_sql):
        result = None
        if self._conn:
            with self._conn.cursor() as cursor:
                cursor.execute(temp_sql)
                result = cursor.fetchone()
                # self._conn.close()
        return result

    def fetch_all(self, temp_sql):
        result = []
        if self._conn:
            with self._conn.cursor() as cursor:
                cursor.execute(temp_sql)
                result = cursor.fetchall()
                # self._conn.close()
        return result


class CVApi(DataMonitor):
    def get_all_install_clients(self):
        clients_sql = """SELECT [ClientId],[Client],[NetworkInterface],[OS [Version]]],[Hardware],[GalaxyRelease],[InstallTime],[UninstallTime],[DeletedTime],[ClientStatus],[ClientBkpEnable],[ClientRstEnable]
                            FROM [commserv].[dbo].[CommCellClientConfig] WHERE [ClientStatus]='installed'"""

        installed_clients = []
        content = self.fetch_all(clients_sql)
        for i in content:
            installed_clients.append({
                "client_id": i[0],
                "client_name": i[1],
                "network_interface": i[2],
                "os": i[3],
                "hardware": i[4],
                "galaxy_release": i[5],
                "install_time": i[6],
                "client_bkp_enable": i[7],
                "client_rst_enable": i[8],
            })

        return installed_clients

    def get_single_installed_client(self, client):
        if isinstance(client, int):
            client_sql = """SELECT [ClientId],[Client],[NetworkInterface],[OS [Version]]],[Hardware],[GalaxyRelease],[InstallTime],[UninstallTime],[DeletedTime],[ClientStatus],[ClientBkpEnable],[ClientRstEnable]
                            FROM [commserv].[dbo].[CommCellClientConfig] WHERE [ClientId]='{0}' AND [ClientStatus]='installed'""".format(client)
        elif isinstance(client, str):
            client_sql = """SELECT [ClientId],[Client],[NetworkInterface],[OS [Version]]],[Hardware],[GalaxyRelease],[InstallTime],[UninstallTime],[DeletedTime],[ClientStatus],[ClientBkpEnable],[ClientRstEnable]
                            FROM [commserv].[dbo].[CommCellClientConfig] WHERE [Client]='{0}' AND [ClientStatus]='installed'""".format(client)
        else:
            self.msg = "请传入正确的客户端id或名称。"
            return None
        content = self.fetch_one(client_sql)
        if content:
            client_info = {
                "client_id": content[0],
                "client_name": content[1],
                "network_interface": content[2],
                "os": content[3],
                "hardware": content[4],
                "galaxy_release": content[5],
                "install_time": content[6],
                "client_bkp_enable": content[7],
                "client_rst_enable": content[8],
            }
        else:
            client_info = None
        return client_info

    def get_installed_sub_clients(self, client):
        if isinstance(client, int):
            sub_client_sql = """SELECT [appid],[clientid],[clientname],[idataagent],[idataagentstatus],[idagentbkenable],[idagentrstenable],[instance],[backupset],[subclient],[subclientstatus],[schedjobpattern],
                                [schedbackupday],[schedbackuptime],[schednextbackuptime],[data_sp],[data_sp_copy],[data_sp_copy_retendays],[data_sp_copy_fullcycles],[data_sp_schedauxcopypattern],[data_sp_schedauxcopyday],[data_sp_schedauxcopytime],
                                [data_sp_schednextauxcopytime],[data_sp_scheddestcopy],[log_sp],[LastFullBkpSize(Bytes)],[LastIncBkpSize(Bytes)],[LastDiffBkpSize(Bytes)],[QDisplayName],[xmlDisplayName]
                                FROM [commserv].[dbo].[CommCellSubClientConfig] WHERE [clientid]='{0}' AND [idataagentstatus]='installed'""".format(client)
        elif isinstance(client, str):
            sub_client_sql = """SELECT [appid],[clientid],[clientname],[idataagent],[idataagentstatus],[idagentbkenable],[idagentrstenable],[instance],[backupset],[subclient],[subclientstatus],[schedjobpattern],
                                [schedbackupday],[schedbackuptime],[schednextbackuptime],[data_sp],[data_sp_copy],[data_sp_copy_retendays],[data_sp_copy_fullcycles],[data_sp_schedauxcopypattern],[data_sp_schedauxcopyday],[data_sp_schedauxcopytime],
                                [data_sp_schednextauxcopytime],[data_sp_scheddestcopy],[log_sp],[LastFullBkpSize(Bytes)],[LastIncBkpSize(Bytes)],[LastDiffBkpSize(Bytes)],[QDisplayName],[xmlDisplayName]
                                FROM [commserv].[dbo].[CommCellSubClientConfig] WHERE [clientname]='{0}' AND [idataagentstatus]='installed'""".format(client)
        else:
            self.msg = "请传入正确的客户端id或名称。"
            return None
        sub_clients = []
        content = self.fetch_all(sub_client_sql)
        for i in content:
            sub_clients.append({
                "appid": i[0],
                "clientid": i[0],
                "clientname": i[0],
                "idataagent": i[0],
                "idataagentstatus": i[0],
                "idagentbkenable": i[0],
                "idagentrstenable": i[0],
                "instance": i[0],
                "backupset": i[0],
                "subclient": i[0],
                "subclientstatus": i[0],
                "schedjobpattern": i[0],
                "schedbackupday": i[0],
                "schedbackuptime": i[0],
                "schednextbackuptime": i[0],
                "data_sp": i[0],
                "data_sp_copy": i[0],
                "data_sp_copy_retendays": i[0],
                "data_sp_copy_fullcycles": i[0],
                "data_sp_schedauxcopypattern": i[0],
                "data_sp_schedauxcopytime": i[0],
                "data_sp_schednextauxcopytime": i[0],
                "data_sp_scheddestcopy": i[0],
                "log_sp": i[0],
                "LastFullBkpSize": i[0],
                "LastIncBkpSize": i[0],
                "LastDiffBkpSize": i[0],
                "QDisplayName": i[0],
                "xmlDisplayName": i[0],
            })
        return sub_clients

    def get_all_storage(self):
        storage_sql = """SELECT [storagepolicy],[defaultcopy],[hardwarecompress],[maxstreams],[drivepool],[library],[appid],[clientname],[idataagent],[instance],[backupset],[subclient]
                          FROM [commserv].[dbo].[CommCellStoragePolicy]"""

        storages = []
        content = self.fetch_all(storage_sql)
        for i in content:
            storages.append({
                "storagepolicy": i[0],
                # "defaultcopy": i[1],
                # "hardwarecompress": i[2],
                # "maxstreams": i[3],
                # "drivepool": i[4],
                # "library": i[5],
                # "appid": i[6],
                "clientname": i[7],
                "idataagent": i[8],
                "instance": i[9],
                "backupset": i[10],
                "subclient": i[11],
            })
        return storages

    def get_all_schedules(self):
        schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
        ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
        FROM [commserv].[dbo].[CommCellBkScheduleForSubclients]"""

        schedules = []
        content = self.fetch_all(schedule_sql)
        period_chz = {
            "One time": "次",
            "Daily": "日",
            "Weekly": "周",
            "Monthly": "月",
            "Monthly relative": "月",
            "Yearly": "年",
            "Yearly relative": "年",
            "Automatic schedule": "自动",
        }

        schedbackupday_chz = {
            "Sunday": "周日",
            "Monday": "周一",
            "Tuesday": "周二",
            "Wednesday": "周三",
            "Thursday": "周四",
            "Friday": "周五",
            "Saturday": "周六",
        }

        type_chz = {
            "Full": "全备",
            "Incremental": "增量",
            "Synthetic Full": "综合完全",
            "NONE": "无",
            "Differential": "差量",
            "Unknown": "预选备份类型"
        }

        month_chz = {
            "January": "1月",
            "February": "2月",
            "March": "3月",
            "April": "4月",
            "May": "5月",
            "June": "6月",
            "July": "7月",
            "August": "8月",
            "September": "9月",
            "October": "10月",
            "November": "11月",
            "December": "12月",
        }

        for i in content:
            # 处理schedbackupday
            schedbackupday = ""
            schedinterval = ""
            if i[7] == "Weekly":
                for day in i[9].split(" "):
                    if day:
                        schedbackupday += "/" + schedbackupday_chz[day] if day in schedbackupday_chz.keys() else day
                schedbackupday = schedbackupday[1:]

                # 重复schedinterval
                if i[8] == "Every 0":
                    schedinterval = "不重复"
                else:
                    schedinterval = i[8].replace("Every", "每") + "周"

            if i[7] == "One time":
                schedbackupday = "仅一次"  # 具体时间

                if i[8] == "Every 0":
                    schedinterval = "不重复"
                else:
                    schedinterval = i[8].replace("Every", "每") + "次"

            if i[7] == "Daily":
                schedbackupday = "每天"

                if i[8] == "Every 0":
                    schedinterval = "不重复"
                else:
                    schedinterval = i[8].replace("Every", "每") + "天"

            if i[7] in ["Monthly", "Monthly relative"]:
                schedbackupday = "每月第{0}天".format(i[9])

                if i[8] == "Every 0":
                    schedinterval = "不重复"
                else:
                    schedinterval = i[8].replace("Every", "每") + "个月"

            if i[7] in ["Yearly", "Yearly relative"]:
                year_list = i[9].split(" of ")
                schedbackupday = "每年{0}{1}日".format(month_chz[year_list[1]] if year_list[1] in month_chz.keys() else year_list[1], year_list[0])

                if i[8] == "Every 0":
                    schedinterval = "不重复"
                else:
                    schedinterval = i[8].replace("Every", "每") + "年"
            # 缺少自动/连续

            schedpattern = period_chz[i[7]] if i[7] in period_chz.keys() else i[7]
            schedbackuptype = type_chz[i[6]] if i[6] in type_chz.keys() else i[6]
            schedules.append({
                # "CommCellId": i[0],
                # "CommCellName": i[1],
                "scheduleId": i[2],
                "scheduePolicy": i[3],
                "scheduleName": i[4],
                "scheduletask": i[5],
                "schedbackuptype": schedbackuptype,
                "schedpattern": schedpattern,
                "schedinterval": schedinterval,
                "schedbackupday": schedbackupday,
                # "schedbackupTime": i[10] if i[7] != "One time" else i[11].strftime("%Y-%m-%d %H:%M:%S"),
                "schednextbackuptime": i[11].strftime("%Y-%m-%d %H:%M:%S"),
                "clientName": i[13],
                "idaagent": i[14],
                "instance": i[15],
                "backupset": i[16],
                "subclient": i[17],
            })
        return schedules

    def get_all_backup_content(self):
        backupset_content_sql = """SELECT [clientname],[idataagent],[backupset],[subclient],[content]
                                   FROM [commserv].[dbo].[CommCellClientFSFilters]
                                   WHERE [subclientstatus]='valid'"""

        instance_content_sql = """SELECT [clientname],[idataagent],[instance],[backupset],[subclient]
                                  FROM [commserv].[dbo].[CommCellSubClientConfig]
                                  WHERE [idataagentstatus] = 'installed' AND [data_sp]!='not assigned'"""
        backupset_content = self.fetch_all(backupset_content_sql)
        instance_content = self.fetch_all(instance_content_sql)

        backupset_content_list = []
        for i in backupset_content:
            if i[1] in ["Mysql", "Windows File System", "Linux File System", "Virtual Server"]:
                # 虚机备份的是vmdk
                backupset_content_list.append({
                    "clientname": i[0],
                    "idataagent": i[1],
                    "backupset": i[2],
                    "subclient": i[3],
                    "content": i[4],
                })
        for i in instance_content:
            if i[1] in ["Oracle Database", "SQL Server"]:
                backupset_content_list.append({
                    "clientname": i[0],
                    "idataagent": i[1],
                    "backupset": i[3],
                    "subclient": i[4],
                    "content": i[2],
                })

        return backupset_content_list

    def get_schedules(self, client=None, agent=None, backup_set=None, sub_client=None, schedule=None, schedule_type=None):
        if all([client, agent, backup_set, sub_client, schedule, schedule_type]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}'AND [subclient]='{3}' AND [scheduePolicy]='{4}' AND [schedbackuptype]='{5}'""". \
                format(client, agent, backup_set, sub_client, schedule, schedule_type)
        elif all([client, agent, backup_set, sub_client, schedule]) and not schedule_type:
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}' AND [subclient]='{3}' AND [scheduePolicy]='{4}'""". \
                format(client, agent, backup_set, sub_client, schedule)
        elif all([client, agent, backup_set, sub_client]) and not any([schedule, schedule_type]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}' AND [subclient]='{3}'""". \
                format(client, agent, backup_set, sub_client)
        elif all([client, agent, backup_set]) and not any([sub_client, schedule, schedule_type]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}'""". \
                format(client, agent, backup_set)
        elif all([client, agent]) and not any([backup_set, sub_client, schedule, schedule_type]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}'""". \
                format(client, agent)
        elif all([client]) and not any([agent, backup_set, sub_client, schedule, schedule_type]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}'""". \
                format(client)
        else:
            self.msg = "至少传入一个参数。"
            return []
        schedules = []

        content = self.fetch_all(schedule_sql)
        for i in content:
            schedules.append({
                # "CommCellId": i[0],
                # "CommCellName": i[1],
                "scheduleId": i[2],
                "scheduePolicy": i[3],
                "scheduleName": i[4],
                "scheduletask": i[5],
                "schedbackuptype": i[6],
                "schedpattern": i[7],
                "schedinterval": i[8],
                "schedbackupday": i[9],
                # "schedbackupTime": i[10],
                # "schednextbackuptime": i[11],
                "appid": i[12],
                "clientName": i[13],
                "idaagent": i[14],
                "instance": i[15],
                "backupset": i[16],
                "subclient": i[17],
            })
        return schedules

    def get_all_backup_jobs(self):
        """
        前1000个
        :return:
        """
        status_list = {"Running": "运行", "Waiting": "等待", "Pending": "阻塞", "Suspend": "终止", "Completed": "正常",
                       "Failed": "失败", "Failed to Start": "启动失败", "Killed": "杀掉",
                       "Completed w/ one or more errors": "已完成，但有一个或多个错误",
                       "Completed w/ one or more warnings": "已完成，但有一个或多个警告"}

        job_sql = """SELECT TOP 1000 [jobid],[clientname],[idataagent],[instance],[backupset],[subclient],[data_sp],[backuplevel],[incrlevel],[jobstatus],[jobfailedreason],[startdate],[enddate],[totalBackupSize]
                    FROM [commserv].[dbo].[CommCellBackupInfo]
                    ORDER BY [startdate] DESC"""
        content = self.fetch_all(job_sql)
        backup_jobs = []
        for i in content:
            backup_jobs.append({
                "jobid": i[0],
                "clientname": i[1],
                "idataagent": i[2],
                "instance": i[3],
                "backupset": i[4],
                "subclient": i[5],
                "data_sp": i[6],
                "backuplevel": i[7],
                "incrlevel": i[8],
                "jobstatus": i[9],
                "jobfailedreason": i[10],
                "startdate": i[11],
                "enddate": i[12],
                "totalBackupSize": i[13],
            })
        return backup_jobs

    def get_all_auxcopys(self):
        auxcopy_sql = """SELECT [storagepolicy], [jobstatus], [sourcecopyid], [destcopyid] FROM [commserv].[dbo].[CommCellAuxCopyInfo] 
                        WHERE [destcopyid] != '' ORDER BY [startdate] DESC"""
        content = self.fetch_all(auxcopy_sql)
        auxcopys = []
        for i in content:
            auxcopys.append({
                "storagepolicy": i[0],
                "jobstatus": i[1],
                "sourcecopyid": i[2],
                "destcopyid": i[3],
            })
        return auxcopys

    def get_library_list(self):
        """
        获取库列表
        :return:
        """
        pass

    def get_library_info(self, library_name):
        """
        获取库信息
        :param library_name:
        :return:
        """
        pass


class CustomFilter(CVApi):
    def custom_all_backup_content(self):
        whole_content_list = []

        all_clients = self.get_all_install_clients()

        all_content_list = self.get_all_backup_content()

        client_row_list = []
        agent_row_list = []
        backupset_row_list = []
        subclient_row_list = []
        content_row_list = []

        for client in all_clients:
            specific_content_one = []
            for content_one in all_content_list:
                if content_one["clientname"] == client["client_name"]:
                    specific_content_one.append(content_one)

            if len(specific_content_one) != 0:
                client_row_list.append(len(specific_content_one))

            agent_list = []
            for one in specific_content_one:
                if one["idataagent"] not in agent_list:
                    agent_list.append(one["idataagent"])
            for agent in agent_list:

                specific_content_two = []
                for content_two in all_content_list:
                    if content_two["clientname"] == client["client_name"] and content_two["idataagent"] == agent:
                        specific_content_two.append(content_two)

                agent_row_list.append(len(specific_content_two))

                backup_set_list = []
                for two in specific_content_two:
                    if two["backupset"] not in backup_set_list:
                        backup_set_list.append(two["backupset"])
                for backup_set in backup_set_list:

                    specific_content_three = []
                    for content_three in all_content_list:
                        if content_three["clientname"] == client["client_name"] and content_three["idataagent"] == agent and content_three["backupset"] == backup_set:
                            specific_content_three.append(content_three)

                    backupset_row_list.append(len(specific_content_three))

                    sub_client_list = []
                    for three in specific_content_three:
                        if three["subclient"] not in sub_client_list:
                            sub_client_list.append(three["subclient"])
                    for sub_client in sub_client_list:

                        specific_content_four = []
                        for content_four in all_content_list:
                            if content_four["clientname"] == client["client_name"] and content_four["idataagent"] == agent and content_four["backupset"] == backup_set and content_four["subclient"] == sub_client:
                                specific_content_four.append(content_four)

                        subclient_row_list.append(len(specific_content_four))

                        content_list = []
                        for four in specific_content_four:
                            if four["content"] not in content_list:
                                content_list.append(four["content"])
                        for content in content_list:

                            specific_content_five = []
                            for content_five in all_content_list:
                                if content_five["clientname"] == client["client_name"] and content_five["idataagent"] == agent and content_five["backupset"] == backup_set and content_five["subclient"] == sub_client and content_five["content"] == content:
                                    specific_content_five.append(content_five)

                            content_row_list.append(len(specific_content_five))

                            if specific_content_five:
                                whole_content_list.extend(specific_content_five)

        row_dict = {
            "client_row_list": client_row_list,
            "agent_row_list": agent_row_list,
            "backupset_row_list": backupset_row_list,
            "subclient_row_list": subclient_row_list,
            "content_row_list": content_row_list,
        }
        return whole_content_list, row_dict

    def custom_all_storages(self):
        whole_storage_list = []

        all_clients = self.get_all_install_clients()

        all_storage_list = self.get_all_storage()

        client_row_list = []
        agent_row_list = []
        backupset_row_list = []
        subclient_row_list = []
        storage_row_list = []

        for client in all_clients:
            specific_storage_one = []
            for storage_one in all_storage_list:
                if storage_one["clientname"] == client["client_name"]:
                    specific_storage_one.append(storage_one)

            if len(specific_storage_one) != 0:
                client_row_list.append(len(specific_storage_one))

            agent_list = []
            for one in specific_storage_one:
                if one["idataagent"] not in agent_list:
                    agent_list.append(one["idataagent"])
            for agent in agent_list:

                specific_storage_two = []
                for storage_two in all_storage_list:
                    if storage_two["clientname"] == client["client_name"] and storage_two["idataagent"] == agent:
                        specific_storage_two.append(storage_two)

                agent_row_list.append(len(specific_storage_two))

                backup_set_list = []
                for two in specific_storage_two:
                    if two["backupset"] not in backup_set_list:
                        backup_set_list.append(two["backupset"])
                for backup_set in backup_set_list:

                    specific_storage_three = []
                    for storage_three in all_storage_list:
                        if storage_three["clientname"] == client["client_name"] and storage_three["idataagent"] == agent and storage_three["backupset"] == backup_set:
                            specific_storage_three.append(storage_three)

                    backupset_row_list.append(len(specific_storage_three))

                    sub_client_list = []
                    for three in specific_storage_three:
                        if three["subclient"] not in sub_client_list:
                            sub_client_list.append(three["subclient"])
                    for sub_client in sub_client_list:

                        specific_storage_four = []
                        for storage_four in all_storage_list:
                            if storage_four["clientname"] == client["client_name"] and storage_four["idataagent"] == agent and storage_four["backupset"] == backup_set and storage_four["subclient"] == sub_client:
                                specific_storage_four.append(storage_four)

                        subclient_row_list.append(len(specific_storage_four))

                        storage_list = []
                        for four in specific_storage_four:
                            if four["storagepolicy"] not in storage_list:
                                storage_list.append(four["storagepolicy"])
                        for storage in storage_list:

                            specific_storage_five = []
                            for storage_five in all_storage_list:
                                if storage_five["clientname"] == client["client_name"] and storage_five["idataagent"] == agent and storage_five["backupset"] == backup_set and storage_five["subclient"] == sub_client and storage_five["storagepolicy"] == storage:
                                    specific_storage_five.append(storage_five)

                            storage_row_list.append(len(specific_storage_five))

                            if specific_storage_five:
                                whole_storage_list.extend(specific_storage_five)

        row_dict = {
            "client_row_list": client_row_list,
            "agent_row_list": agent_row_list,
            "backupset_row_list": backupset_row_list,
            "subclient_row_list": subclient_row_list,
            "storage_row_list": storage_row_list,
        }
        return whole_storage_list, row_dict

    def custom_all_schedules(self):
        whole_schedule_list = []
        # 1.排序
        all_clients = self.get_all_install_clients()

        # 2.所有schedule的列表
        all_schedule_list = self.get_all_schedules()

        client_row_list = []
        agent_row_list = []
        backupset_row_list = []
        subclient_row_list = []
        schedule_row_list = []
        schedule_type_row_list = []

        for client in all_clients:
            # specific_schedule_one = self.get_schedules(client=client["client_name"])  # 请求的方式

            # 遍历的方式
            specific_schedule_one = []
            for schedule_one in all_schedule_list:
                if schedule_one["clientName"] == client["client_name"]:
                    specific_schedule_one.append(schedule_one)

            if len(specific_schedule_one) != 0:
                client_row_list.append(len(specific_schedule_one))

            agent_list = []
            for one in specific_schedule_one:
                if one["idaagent"] not in agent_list:
                    agent_list.append(one["idaagent"])
            for agent in agent_list:
                # specific_schedule_two = self.get_schedules(client=client["client_name"], agent=agent)

                specific_schedule_two = []
                for schedule_two in all_schedule_list:
                    if schedule_two["clientName"] == client["client_name"] and schedule_two["idaagent"] == agent:
                        specific_schedule_two.append(schedule_two)

                agent_row_list.append(len(specific_schedule_two))

                backup_set_list = []
                for two in specific_schedule_two:
                    if two["backupset"] not in backup_set_list:
                        backup_set_list.append(two["backupset"])
                for backup_set in backup_set_list:

                    specific_schedule_three = []
                    for schedule_three in all_schedule_list:
                        if schedule_three["clientName"] == client["client_name"] and schedule_three["idaagent"] == agent and schedule_three["backupset"] == backup_set:
                            specific_schedule_three.append(schedule_three)

                    backupset_row_list.append(len(specific_schedule_three))

                    sub_client_list = []
                    for three in specific_schedule_three:
                        if three["subclient"] not in sub_client_list:
                            sub_client_list.append(three["subclient"])
                    for sub_client in sub_client_list:

                        specific_schedule_four = []
                        for schedule_four in all_schedule_list:
                            if schedule_four["clientName"] == client["client_name"] and schedule_four["idaagent"] == agent and schedule_four["backupset"] == backup_set and schedule_four["subclient"] == sub_client:
                                specific_schedule_four.append(schedule_four)

                        subclient_row_list.append(len(specific_schedule_four))

                        schedule_list = []
                        for four in specific_schedule_four:
                            if four["scheduePolicy"] not in schedule_list:
                                schedule_list.append(four["scheduePolicy"])
                        for schedule in schedule_list:

                            specific_schedule_five = []
                            for schedule_five in all_schedule_list:
                                if schedule_five["clientName"] == client["client_name"] and schedule_five["idaagent"] == agent and schedule_five["backupset"] == backup_set and schedule_five["subclient"] == sub_client and schedule_five["scheduePolicy"] == schedule:
                                    specific_schedule_five.append(schedule_five)

                            schedule_row_list.append(len(specific_schedule_five))

                            schedules = []
                            for five in specific_schedule_five:
                                if five["schedbackuptype"] not in schedules:
                                    schedules.append(five["schedbackuptype"])
                            for c_schedule in schedules:

                                specific_schedule_six = []
                                for schedule_six in all_schedule_list:
                                    if schedule_six["clientName"] == client["client_name"] and schedule_six["idaagent"] == agent and schedule_six["backupset"] == backup_set and schedule_six["subclient"] == sub_client and schedule_six["scheduePolicy"] == schedule and schedule_six[
                                        "schedbackuptype"] == c_schedule:
                                        specific_schedule_six.append(schedule_six)

                                schedule_type_row_list.append(len(specific_schedule_six))

                                if specific_schedule_six:
                                    whole_schedule_list.extend(specific_schedule_six)

        row_dict = {
            "client_row_list": client_row_list,
            "agent_row_list": agent_row_list,
            "backupset_row_list": backupset_row_list,
            "subclient_row_list": subclient_row_list,
            "schedule_row_list": schedule_row_list,
            "schedule_type_row_list": schedule_type_row_list,
        }
        return whole_schedule_list, row_dict

    def custom_concrete_job_list(self):
        """
        并发请求所有agent下的job
        :param cv_api:
        :param client_id:
        :param client_name:
        :return:
        """
        status_list = {"Running": "运行", "Waiting": "等待", "Pending": "阻塞", "Suspend": "终止", "Completed": "正常",
                       "Failed": "失败", "Failed to Start": "启动失败", "Killed": "杀掉",
                       "Completed w/ one or more errors": "已完成，但有一个或多个错误",
                       "Completed w/ one or more warnings": "已完成，但有一个或多个警告", "Success": "成功"}
        whole_list = []
        job_list = self.get_all_backup_jobs()
        all_clients = self.get_all_install_clients()
        all_auxcopys = self.get_all_auxcopys()
        for client in all_clients:
            agent_job_list = []
            pre_agent_list = []

            for job in job_list:
                if job["idataagent"] not in pre_agent_list and job["clientname"] == client["client_name"]:
                    pre_agent_list.append(job["idataagent"])

                    job_status = job["jobstatus"]
                    try:
                        job_status_str = status_list[job_status]
                    except:
                        job_status_str = job_status

                    if job_status_str in ["运行", "正常", "等待", "QueuedCompleted", "Queued", "PartialSuccess", "成功"]:
                        status_label = "label-success"
                    elif job_status_str in ["阻塞", "已完成，但有一个或多个错误", "已完成，但有一个或多个警告"]:
                        status_label = "label-warning"
                    else:
                        status_label = "label-danger"

                    aux_copy_status = ""
                    for auxcopy in all_auxcopys:
                        if auxcopy["storagepolicy"] == job["data_sp"]:
                            aux_copy_status = auxcopy["jobstatus"]

                    try:
                        aux_copy_status_str = status_list[aux_copy_status]
                    except:
                        aux_copy_status_str = aux_copy_status

                    if aux_copy_status_str in ["运行", "正常", "等待", "QueuedCompleted", "Queued", "PartialSuccess", "成功"]:
                        aux_status_label = "label-success"
                    elif aux_copy_status_str in ["阻塞", "已完成，但有一个或多个错误", "已完成，但有一个或多个警告"]:
                        aux_status_label = "label-warning"
                    else:
                        aux_status_label = "label-danger"

                    agent_job_list.append({
                        "client_name": client["client_name"],
                        "agent_type_name": job["idataagent"],
                        "job_start_time": job["startdate"].strftime("%Y-%m-%d %H:%M:%S"),
                        "job_backup_status": job_status_str,
                        "status_label": status_label,
                        "aux_copy_status": aux_copy_status_str,
                        "aux_status_label": aux_status_label,
                    })
            if agent_job_list:
                whole_list.append({
                    "agent_job_list": agent_job_list,
                    "agent_length": len(agent_job_list)
                })
        return whole_list


if __name__ == '__main__':
    credit = {
        "host": "192.168.100.149\COMMVAULT",
        "user": "sa_cloud",
        "password": "1qaz@WSX",
        "database": "CommServ",
    }
    dm = CustomFilter(credit)
    # print(dm.connection)
    ret = dm.get_all_install_clients()
    print(len(ret), "\n", ret)
    # ret = dm.get_single_installed_client(2)
    # ret = dm.get_installed_sub_clients(2)
    # ret = dm.get_schedules(client="cv-server")
    # ret, row_dict = dm.custom_all_schedules()
    # ret, row_dict = dm.custom_all_storages()
    # ret, row_dict = dm.custom_all_backup_content()
    # ret = dm.get_all_backup_content()
    # ret = dm.get_all_backup_jobs()
    # ret = dm.get_all_auxcopys()
    # ret = dm.custom_concrete_job_list()
    # ret = dm.get_all_schedules()
    # print(ret)
    # for i in ret:
    #     print(i)
    # import json
    # with open("1.json", "w") as f:
    #     f.write(json.dumps(ret))
