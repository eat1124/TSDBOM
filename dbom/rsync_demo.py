"""
    Rsync自动化备份
"""
import paramiko
import re


class RsyncBackup(object):
    """
    Rsync备份：
        单一安装Rsync
        集体安装Rsync
        配置Rsync 多个模块
        添加虚拟用户
        启动服务
        配置密码文件
        设置开机自启
        服务端/客户端
        执行Rsync的命令选项
        执行Rsync的参数：服务器端文件地址，虚拟用户名，IP地址，模块名称
    """

    def __init__(self, server):
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.msg = ''
        self.server = server
        try:
            self.client.connect(hostname=server['hostname'], username=server['username'], password=server['password'], timeout=2)
        except:
            self.msg = '远程连接失败。'
        else:
            self.msg = '远程连接成功。'

        self.verify_shell_cmd = ';if [ $? -eq 0 ]; then' + '\n' + \
                                '   echo "cmd_succeed"' + '\n' + \
                                'else' + '\n' + \
                                '   echo "cmd_failed"' + '\n' + \
                                'fi'
        # self.sudo_permission = 'echo {0}|sudo sh -c '.format(server['password']) if server['username'] != 'root' else ''
        # sudo sh -c 'echo "This is testPage." >/usr/local/nginx/html/index.html'

    def close_connection(self):
        self.client.close()

    def run_shell_cmd(self, shell_cmd, get_pty=True):
        result = 1
        info = ''
        # 区分主备密码
        print("本次执行命令: echo '{0}'|sudo -S sh -c '{1}'".format(self.server["password"], shell_cmd) if self.server["username"] != "root" else shell_cmd)
        # root/普通用户
        stdin, stdout, stderr = self.client.exec_command("echo '{0}'|sudo -S sh -c '{1} {2}'".format(self.server["password"], shell_cmd, self.verify_shell_cmd) if self.server["username"] != "root" else shell_cmd + self.verify_shell_cmd, get_pty=get_pty)
        stdout_init = ''
        stderr_init = ''
        if not stderr.readlines():
            for num, data in enumerate(stdout.readlines()):
                stdout_init += data
            if 'cmd_succeed' in stdout_init:
                stdout_init = stdout_init.replace('cmd_succeed', '')
                result = 1
            else:
                stdout_init = stdout_init.replace('cmd_failed', '')
                result = 0
            info = stdout_init if self.server["username"] == "root" else stdout_init.split(":", maxsplit=1)[1]
        else:
            result = 0
            for data in stderr.readlines():
                stderr_init += data
            info = stderr_init
        return result, info

    def check_file_path_existed(self, file_path):
        """
        检查文件路径是否存在
        :param file_path:
        :return:
        """
        check_file_cmd = ';if [ -d {0} ]; then'.format(file_path) + '\n' + \
                         '   echo "doc"' + '\n' + \
                         'elif [ -f {1} ]; then'.format(file_path) + '\n' + \
                         '   echo "file"' + '\n' + \
                         'else' + '\n' + \
                         '   echo "not existed"' + '\n' + \
                         'fi'
        result, info = self.run_shell_cmd(check_file_cmd)
        if result == "doc":
            result = 1
        elif result == "file":
            result = 2
        else:
            result = 0
        return result, info

    def install_rsync_by_yum(self):
        result, info = self.run_shell_cmd('yum install rsync -y')
        return result, info

    def check_ever_existed(self):
        """
        查看rsync是否已经安装
        :return:
        """
        result, info = self.run_shell_cmd('rsync --help')
        return result, info

    def set_rsync_server_config(self, model_list, client_ip):
        """
        secrets file 默认/etc/rsync.password
        auth users  默认rsync_backup
        :param model_list: [{"origin_path": "", ""dest_path": "", "model_name": ""}]
        :return:
        """
        result = 1
        info = ""
        # 设置服务端密码
        server_passwd_ret, server_passwd_info = self.set_server_password()
        if server_passwd_ret == 0:
            result = 0
            info = "服务端密码配置失败:{0}".format(server_passwd_info)
        else:
            # 配置Rsync用户
            rsync_virtual_result, rsync_virtual_info = self.set_rsync_virtual_auth()
            if rsync_virtual_result == 0:
                result = 0
                info = "虚拟用户rsync设置失败:{0}".format(rsync_virtual_info)
            else:
                base_config = "uid = rsync" + '\n' + \
                              'gid = rsync' + '\n' + \
                              'use chroot = no' + '\n' + \
                              'max connections = 200' + '\n' + \
                              'timeout = 300' + '\n' + \
                              'pid file = /var/run/rsyncd.pid' + '\n' + \
                              'lock file = /var/run/rsyncd.lock ' + '\n' + \
                              'log file = /var/log/rsyncd.log' + '\n' + \
                              'fake super = yes'

                # 路径加入配置文件，并设置备份地址权限
                for temp_model in model_list:
                    origin_path = temp_model['origin_path']

                    mode_auth_ret, mode_auth_info = self.run_shell_cmd('chown -R rsync.rsync {0}'.format(origin_path))
                    if mode_auth_ret == 0:
                        return mode_auth_ret, "源端备份路径权限配置失败:{0}".format(mode_auth_info)
                    base_config += '\n' + \
                                   '[{0}]'.format(temp_model['model_name']) + '\n' + \
                                   'path = {0}'.format(origin_path if origin_path.endswith("/") else "{0}/".format(origin_path)) + '\n' + \
                                   'ignore errors' + '\n' + \
                                   'read only = false' + '\n' + \
                                   'list = false' + '\n' + \
                                   'hosts allow = {0}/24'.format(client_ip) + '\n' + \
                                   'auth users = rsync_backup' + '\n' + \
                                   'secrets file = /etc/rsync.password'

                rsync_config_result, rsync_config_info = self.run_shell_cmd("""echo "{0}" > /etc/rsyncd.conf""".format(base_config))
                if rsync_config_result == 0:
                    result = 0
                    info = "Rsync配置文件写入失败:{0}".format(rsync_config_info)
                else:
                    result = 1
                    info = "Rsync配置成功。"
                    # 设置防火墙开放端口
                    # port_result, port_info = self.open_873_port()
                    # if port_result == 0:
                    #     result = 0
                    #     info = "873端口设置失败:{0}".format(port_info)
                    # else:
                    #     # 启动rsync
                    #     start_rysnc_result, start_rsync_info = self.start_rsync()
                    # if start_rysnc_result == 0:
                    #     result = 0
                    #     info = "启动rsync失败:{0}".format(start_rsync_info)

        return result, info

    def set_rsync_virtual_auth(self):
        result, info = self.run_shell_cmd('cat /etc/passwd')
        if result == 1 and 'rsync:' not in info:
            result, info = self.run_shell_cmd('useradd rsync -s /sbin/nologin -M')

        return result, info

    def set_client_password(self):
        """
        客户端密码
        :return:
        """
        server_passwd_result, server_passwd_info = self.run_shell_cmd('echo "{0}" > /etc/rsync_server.password'.format('password'))
        if server_passwd_result == 1:
            chmod_result, chmod_info = self.run_shell_cmd('chmod 600 /etc/rsync_server.password')
            if chmod_result == 1:
                result = 1
                info = "客户端Rsync密码设置成功。"
            else:
                result = 0
                info = "客户端Rsync密码权限设置失败：{0}".format(chmod_info)
        else:
            result = 0
            info = "客户端Rsync密码设置失败：{0}".format(server_passwd_info)
        return result, info

    def set_server_password(self):
        """
        服务端密码
        :return:
        """
        server_passwd_result, server_passwd_info = self.run_shell_cmd('echo "{0}" > /etc/rsync.password'.format('rsync_backup:password'))
        if server_passwd_result == 1:
            chmod_result, chmod_info = self.run_shell_cmd('chmod 600 /etc/rsync.password')
            if chmod_result == 1:
                result = 1
                info = "服务器Rsync密码设置成功。"
            else:
                result = 0
                info = "服务器Rsync密码权限设置失败：{0}".format(chmod_info)
        else:
            result = 0
            info = "服务器Rsync密码设置失败：{0}".format(server_passwd_info)
        return result, info

    def cat_rsync_log(self):
        shell_cmd = 'cat /var/log/rsyncd.log'
        result = 1
        info = ''
        print("本次执行命令: echo '{0}'|sudo -S sh -c '{1}'".format(self.server["password"], shell_cmd) if self.server["username"] != "root" else shell_cmd)
        stdin, stdout, stderr = self.client.exec_command("echo '{0}'|sudo -S sh -c '{1}' {2}".format(self.server["password"], shell_cmd, self.verify_shell_cmd) if self.server["username"] != "root" else shell_cmd, get_pty=True)

        stdout_init = ''
        stderr_init = ''
        if not stderr.readlines():
            pre_task = ""
            num = 0
            for data in stdout.readlines()[::-1]:
                com = re.compile('\[\d+\]')
                task_list = com.findall(data)
                if task_list:
                    task_id = task_list[0][1:-1]
                    if num > 0 and pre_task != task_id:
                        break

                    if task_id == pre_task or num == 0:
                        stdout_init += data
                    pre_task = task_id
                    num += 1
            info = stdout_init
        else:
            result = 0
            for data in stderr.readlines():
                stderr_init += data
            info = stderr_init
        return result, info

    def start_rsync(self):
        """
        以守护进程方式启动，不需要设置伪终端，所以需要设置get_pty=False
        :return:
        """
        result, info = self.run_shell_cmd('ps -ef|grep rsync|grep -v grep')
        if "rsync" in info:
            result = 0
            info = 'rsync已经在运行中。'
        else:
            result, info = self.run_shell_cmd('rsync --daemon', get_pty=False)
        return result, info

    def stop_rsync(self):
        result, info = self.run_shell_cmd('ps -ef|grep rsync|grep -v grep')
        if "rsync" not in info:
            result = 0
            info = 'rsync未运行。'
        else:
            result, info = self.run_shell_cmd('pkill rsync')
        return result, info

    def open_873_port(self):
        """
        与centos版本相关
        :return:
        """
        # 查看centos版本
        result, info = 1, ""
        centOS_version_result, info = self.run_shell_cmd("cat /etc/redhat-release")
        if " 7." in info:
            set_port_result, set_port_info = self.run_shell_cmd('firewall-cmd --zone=public --add-port=873/tcp --permanent')  # centos7
            if set_port_result == 1:
                restart_firewalld_result, restart_firewalld_info = self.run_shell_cmd('systemctl restart firewalld.service')
                if restart_firewalld_result == 1:
                    result = 1
                    info = "防火墙设置成功。"
                else:
                    result = 0
                    info = "防火墙设置失败：{0}".format(restart_firewalld_info)
            else:
                result = 0
                info = "端口设置失败：{0}".format(set_port_info)
        else:
            set_port_result, set_port_info = self.run_shell_cmd('/sbin/iptables -I INPUT -p tcp --dport 873 -j ACCEPT')  # centos6
            if set_port_result == 1:
                save_port_result, save_port_info = self.run_shell_cmd('/etc/init.d/iptables save')
                if save_port_result == 1:
                    restart_iptables_result, restart_iptables_info = self.run_shell_cmd('service iptables restart')
                    if restart_iptables_result == 1:
                        result = 1
                        info = "防火墙设置成功。"
                    else:
                        result = 0
                        info = "防火墙重启失败：{0}".format(restart_iptables_info)
                else:
                    result = 0
                    info = "端口设置保存失败：{0}".format(save_port_info)
            else:
                result = 0
                info = "端口设置失败：{0}".format(set_port_info)

        return result, info

    def restart_rsync(self):
        result, info = 1, ""
        check_rsync_result, check_rsync_info = self.run_shell_cmd('ps -ef|grep rsync|grep -v grep')
        if "rsync" in check_rsync_info:
            pkill_rsync_result, pkill_rsync_info = self.run_shell_cmd('pkill rsync', get_pty=False)
            if pkill_rsync_result == 1:
                run_rsync_result, run_rsync_info = self.run_shell_cmd('rsync --daemon', get_pty=False)
                if run_rsync_result == 1:
                    result = 1
                    info = "rsync启动成功。"
                else:
                    result = 0
                    info = run_rsync_info
            else:
                run_rsync_result, run_rsync_info = self.start_rsync()
                if run_rsync_result == 1:
                    result = 1
                    info = "rsync启动成功。"
                else:
                    result = 0
                    info = run_rsync_info
        else:
            run_rsync_result, run_rsync_info = self.start_rsync()
            if run_rsync_result == 1:
                result = 1
                info = "rsync启动成功。"
            else:
                result = 0
                info = run_rsync_info
        return result, info

    def rsync_push(self, local_dir, dest_server, model_name, delete=False):
        """
        -avz 方式备份
        :param dest_dir: 服务器备份路径
        :param auth_user: 虚拟用户
        :param dest_server: 目标服务器地址
        :param model_name: rsync模块名称
        :param delete: 表示无差异备份，默认是增量
        :return:
        """
        # 异常处理
        if delete:
            result, info = self.run_shell_cmd(r'rsync -avz {0} rsync_backup@{1}::{2}/ --password-file=/etc/rsync_server.password --delete'.format(local_dir, dest_server, model_name))
        else:
            result, info = self.run_shell_cmd(r'rsync -avz {0} rsync_backup@{1}::{2}/ --password-file=/etc/rsync_server.password'.format(local_dir, dest_server, model_name))
        return result, info

    def rsync_pull(self, local_dir, dest_server, model_name, delete=False):
        """
        -avz 方式备份
        :param dest_dir: 服务器备份路径
        :param auth_user: 虚拟用户
        :param dest_server: 目标服务器地址
        :param model_name: rsync模块名称
        :param delete: 表示无差异备份，默认是增量
        :return:
        """
        # 异常处理
        if delete:
            result, info = self.run_shell_cmd(r'rsync -avz rsync_backup@{1}::{2}/ {0} --password-file=/etc/rsync_server.password --delete'.format(local_dir, dest_server, model_name))
        else:
            result, info = self.run_shell_cmd(r'rsync -avz rsync_backup@{1}::{2}/ {0} --password-file=/etc/rsync_server.password'.format(local_dir, dest_server, model_name))
        return result, info


if __name__ == '__main__':
    server = {
        'hostname': '192.168.85.124',
        'username': 'root',
        'password': 'password'
    }

    # server = {
    #     'hostname': '192.168.85.123',
    #     'username': 'rsync_demo',
    #     'password': 'password'
    # }
    rsync_backup = RsyncBackup(server)
    # result, info = rsync_backup.set_rsync_virtual_auth()
    # print(rsync_backup.msg)
    # result, info = rsync_backup.start_rsync()
    # result, info = rsync_backup.run_shell_cmd("ls /")
    # result, info = rsync_backup.stop_rsync()
    # result, info = rsync_backup.run_shell_cmd('ls')
    # result, info = rsync_backup.install_rsync_by_yum()
    # result, info = rsync_backup.check_ever_existed()
    # result, info = rsync_backup.cat_rsync_log()
    # result, info = rsync_backup.set_client_password()
    # result, info = rsync_backup.rsync_pull(r'/home/rsync_demo/clientcenter/', '192.168.85.124', 'test', delete=True)
    result, info = rsync_backup.rsync_push(r'/home/rsync_demo/clientcenter/', '192.168.85.124', 'test', delete=True)
    # result, info = rsync_backup.tail_rsync_log()
    # model_list: [{"origin_path": "", ""dest_path": ""}]
    # result, info = rsync_backup.set_server_password()
    # result, info = rsync_backup.set_rsync_server_config([{"origin_path": "/home/rsync_demo/datacenter/", "dest_path": "", "model_name": "test"}], "192.168.85.123")
    rsync_backup.close_connection()
    # sudo sh -c 'echo "This is testPage." >/usr/local/nginx/html/index.html'
    # 将一个字串作为完整的命令来执行
    # sudo仅有root的部分权限
    print(result, info)

    # 做以下修改：
    #   1.数据库保存路径时，提示不支持单文件复制
    #   2.根目录下文件不能提供选择
    #   3.添加拉取数据的方式
    #   4.只配置服务器端
