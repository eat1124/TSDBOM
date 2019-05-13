import pymssql
import copy


class DataMonitor(object):
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.conn = self.connection
        self.msg = ""

    @property
    def connection(self):
        try:
            connection = pymssql.connect(host=self.host, user=self.user, password=self.password, database=self.database)
        except pymssql.OperationalError as e:
            print(e)
            return None
        else:
            return connection

    def fetch_one(self, temp_sql):
        result = None
        if self.conn:
            with self.conn.cursor() as cursor:
                cursor.execute(temp_sql)
                result = cursor.fetchone()
                self.conn.close()
        return result

    def fetch_all(self, temp_sql):
        result = []
        if self.conn:
            with self.conn.cursor() as cursor:
                cursor.execute(temp_sql)
                result = cursor.fetchall()
                self.conn.close()
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

    def get_all_schedules(self):
        schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
        ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
        FROM [commserv].[dbo].[CommCellBkScheduleForSubclients]"""

        schedules = []
        content = self.fetch_all(schedule_sql)
        for i in content:
            schedules.append({
                "CommCellId": i[0],
                "CommCellName": i[1],
                "scheduleId": i[2],
                "scheduePolicy": i[3],
                "scheduletask": i[4],
                "schedbackuptype": i[5],
                "schedpattern": i[6],
                "schedinterval": i[7],
                "schedbackupday": i[8],
                "schedbackupTime": i[9],
                "schednextbackuptime": i[10],
                "clientName": i[11],
                "idaagent": i[12],
                "instance": i[13],
                "backupset": i[14],
                "subclient": i[15],
            })
        return schedules

    def get_schedules(self, client=None, agent=None, backup_set=None, instance=None, sub_client=None, schedule=None):
        schedules = []
        if all([client, agent, backup_set, instance, sub_client, schedule]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}' AND [instance]='{3}' AND [sub_client]='{4}' AND [schedule]='{5}'""". \
                format(client, agent, backup_set, instance, sub_client, schedule)
        elif all([client, agent, backup_set, instance, sub_client]) and not schedule:
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}' AND [instance]='{3}' AND [sub_client]='{4}'""". \
                format(client, agent, backup_set, instance, sub_client)
        elif all([client, agent, backup_set, instance]) and not any([sub_client, schedule]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}' AND [instance]='{3}'""". \
                format(client, agent, backup_set, instance)
        elif all([client, agent, backup_set]) and not any([instance, sub_client, schedule]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}' AND [backupset]='{2}'""". \
                format(client, agent, backup_set)
        elif all([client, agent]) and not any([backup_set, instance, sub_client, schedule]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}' AND [idaagent]='{1}'""". \
                format(client, agent)
        elif all([client]) and not any([agent, backup_set, instance, sub_client, schedule]):
            schedule_sql = """SELECT [CommCellId],[CommCellName],[scheduleId],[scheduePolicy],[scheduleName],[scheduletask],[schedbackuptype],[schedpattern],[schedinterval]
            ,[schedbackupday],[schedbackupTime],[schednextbackuptime],[appid],[clientName],[idaagent],[instance],[backupset],[subclient]
            FROM [commserv].[dbo].[CommCellBkScheduleForSubclients] WHERE [clientName]='{0}'""". \
                format(client)
        else:
            self.msg = "至少传入一个参数。"
            return None
        schedules = []
        content = self.fetch_all(schedule_sql)
        for i in content:
            schedules.append({
                "CommCellId": i[0],
                "CommCellName": i[1],
                "scheduleId": i[2],
                "scheduePolicy": i[3],
                "scheduletask": i[4],
                "schedbackuptype": i[5],
                "schedpattern": i[6],
                "schedinterval": i[7],
                "schedbackupday": i[8],
                "schedbackupTime": i[9],
                "schednextbackuptime": i[10],
                "clientName": i[11],
                "idaagent": i[12],
                "instance": i[13],
                "backupset": i[14],
                "subclient": i[15],
            })
        return schedules


class CustomFilter(CVApi):
    def custom_all_schedules(self):
        whole_schedule_list = []
        all_schedules = self.get_all_schedules()
        if all_schedules:
            c_schedule = all_schedules[0]
            specific_schedule_one = self.get_schedules(client=c_schedule["clientName"], agent=c_schedule["idaagent"], backup_set=c_schedule["backupset"], sub_client=c_schedule["subclient"], schedule=c_schedule["scheduePolicy"])
            specific_schedule_two = self.get_schedules(client=c_schedule["clientName"], agent=c_schedule["idaagent"], backup_set=c_schedule["backupset"], sub_client=c_schedule["subclient"])
            specific_schedule_three = self.get_schedules(client=c_schedule["clientName"], agent=c_schedule["idaagent"], backup_set=c_schedule["backupset"])
            specific_schedule_four = self.get_schedules(client=c_schedule["clientName"], agent=c_schedule["idaagent"])
            specific_schedule_five = self.get_schedules(client=c_schedule["clientName"])
            # 区分备份集和实例
            if c_schedule["idaagent"] in ["Windows File System", "Virtual Server", "Linux File System"]:
                if specific_schedule_one:
                    first_length = len(specific_schedule_one)
                    specific_schedule_one[0]["first_length"] = first_length
                    whole_schedule_list.append(specific_schedule_one)



            if c_schedule["idaagent"] in ["SQL Server", "Oracle Database", "Mysql"]:
                specific_schedule = self.get_schedules(client=c_schedule["clientName"], agent=c_schedule["idaagent"], instance=c_schedule["instance"], sub_client=c_schedule["subclient"])


if __name__ == '__main__':
    dm = CustomFilter(r'192.168.100.149\COMMVAULT', 'sa_cloud', '1qaz@WSX', 'CommServ')
    # print(dm.connection)
    # ret = dm.get_all_install_clients()
    # ret = dm.get_single_installed_client(2)
    ret = dm.get_installed_sub_clients(2)
    # print(ret)
