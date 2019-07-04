"""
    Rsync自动化备份
"""
import paramiko


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

        self.verify_shell_cmd = 'if [ $? -eq 0 ]; then' + '\n' + \
                                '   echo "cmd_succeed"' + '\n' + \
                                'else' + '\n' + \
                                '   echo "cmd_failed"' + '\n' + \
                                'fi'
        # self.sudo_permission = 'echo {0}|sudo sh -c '.format(server['password']) if server['username'] != 'root' else ''
        # sudo sh -c 'echo "This is testPage." >/usr/local/nginx/html/index.html'

    def close_rsync(self):
        self.client.close()

    def run_shell_cmd(self, shell_cmd, get_pty=True):
        result = 1
        info = ''
        print("本次执行命令: echo {0}|sudo -S sh -c '{1}'".format(self.server["password"], shell_cmd) if self.server["username"] != "root" else shell_cmd)
        # root/普通用户
        stdin, stdout, stderr = self.client.exec_command("echo {0}|sudo -S sh -c '{1}'".format(self.server["password"], shell_cmd) if self.server["username"] != "root" else shell_cmd + self.verify_shell_cmd, get_pty=get_pty)

        stdout_init = ''
        stderr_init = ''
        if not stderr.readlines():
            for num, data in enumerate(stdout.readlines()):
                stdout_init += data
            if 'cmd_succeed' in stdout_init:
                stdout_init = stdout_init.replace('cmd_succeed', '')
                result = 1
            if 'cmd_failed' in stdout_init:
                stdout_init = stdout_init.replace('cmd_failed', '')
                result = 0

            info = stdout_init
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
        result, info = self.run_shell_cmd('ls {0}'.format(file_path))
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

    def set_rsync_server_config(self, model_list):
        """
        secrets file 默认/etc/rsync.password
        auth users  默认rsync_backup
        :param model_list: [{"model_name": "", ""backup_path": ""}]
        :return:
        """
        result = 1
        info = ""
        # 设置互通密码
        server_passwd_ret, server_passwd_info = self.set_server_password()
        if server_passwd_ret == 0:
            result = 0
            info = "服务端密码配置失败:{0}".format(server_passwd_info)
        else:
            client_passwd_ret, client_passwd_info = self.set_client_password()
            if client_passwd_ret == 0:
                result = 0
                info = "客户端端密码配置失败:{0}".format(server_passwd_info)
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

                for temp_model in model_list:
                    backup_path = temp_model['backup_path']
                    cur_path = backup_path.replace(backup_path.split("/")[-1], "")
                    # self.run_shell_cmd('chown -R rsync.rsync {0}'.format(cur_path))

                    # 设置备份地址权限
                    mode_auth_ret, mode_auth_info = self.run_shell_cmd('chown -R rsync.rsync {0}'.format(cur_path))
                    if mode_auth_ret == 0:
                        return mode_auth_ret, "备份路径权限配置失败:{0}".format(mode_auth_info)
                    base_config += '\n' + \
                                   '[{0}]'.format(temp_model['model_name']) + '\n' + \
                                   'path = {0}'.format(cur_path) + '\n' + \
                                   'ignore errors' + '\n' + \
                                   'read only = false' + '\n' + \
                                   'list = false' + '\n' + \
                                   'hosts allow = *' + '\n' + \
                                   'auth users = rsync_backup' + '\n' + \
                                   'secrets file = /etc/rsync_server.password'
                rsync_config_result, rsync_config_info = self.run_shell_cmd("""echo "{0}" > /etc/rsyncd.conf""".format(base_config))
                if rsync_config_result == 0:
                    result = 0
                    info = "Rsync配置文件写入失败:{0}".format(rsync_config_info)
                else:
                    # 配置Rsync用户
                    rsync_virtual_result, rsync_virtual_info = self.set_rsync_virtual_auth()
                    if rsync_virtual_result == 0:
                        result = 0
                        info = "虚拟用户rsync设置失败:{0}".format(rsync_virtual_info)
                    else:
                        # 设置防火墙开放端口
                        port_result, port_info = self.open_873_port()
                        if port_result == 0:
                            result = 0
                            info = "873端口设置失败:{0}".format(port_info)
                        else:
                            # 启动rsync
                            start_rysnc_result, start_rsync_info = self.start_rsync()
                            # if start_rysnc_result == 0:
                            #     result = 0
                            #     info = "启动rsync失败:{0}".format(start_rsync_info)

        return result, info

    def set_rsync_virtual_auth(self):
        result, info = self.run_shell_cmd('tail -l /etc/passwd')
        if result == 1 and 'rsync' not in info:
            result, info = self.run_shell_cmd('useradd rsync -s /sbin/nologin -M')

        return result, info

    def set_server_password(self):
        result, info = self.run_shell_cmd('echo "{0}" > /etc/rsync_server.password'.format('rsync_backup:password'))
        result, info = self.run_shell_cmd('chmod 600 /etc/rsync_server.password')
        return result, info

    def set_client_password(self):
        result, info = self.run_shell_cmd('echo "{0}" > /etc/rsync.password'.format('password'))
        result, info = self.run_shell_cmd('chmod 600 /etc/rsync.password')
        return result, info

    def tail_rsync_log(self):
        result, info = self.run_shell_cmd('tail /var/log/rsyncd.log')
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

    def rsync_exec_avz(self, dest_dir, dest_server, model_name, delete=False):
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
            result, info = self.run_shell_cmd(r'rsync -avz {0} rsync_backup@{1}::{2}/ --password-file=/etc/rsync.password --delete'.format(dest_dir, dest_server, model_name))
        else:
            result, info = self.run_shell_cmd(r'rsync -avz {0} rsync_backup@{1}::{2}/ --password-file=/etc/rsync.password'.format(dest_dir, dest_server, model_name))
        return result, info


if __name__ == '__main__':
    server = {
        'hostname': '192.168.85.101',
        'username': 'miaokela',
        'password': 'tesunet123'
    }
    rsync_backup = RsyncBackup(server)
    print(rsync_backup.msg)
    # result, info = rsync_backup.start_rsync()
    # result, info = rsync_backup.stop_rsync()
    # result, info = rsync_backup.run_shell_cmd('ls')
    result, info = rsync_backup.install_rsync_by_yum()
    # result, info = rsync_backup.check_ever_existed()

    # result, info = rsync_backup.rsync_exec_avz(r'/temp_data', '192.168.85.138', 'temp_model', delete=True)
    # result, info = rsync_backup.tail_rsync_log()
    # result, info = rsync_backup.set_rsync_server_config([{"model_name": "temp_model", "backup_path": "/base_dir/temp_data"}])
    rsync_backup.close_rsync()
    # sudo sh -c 'echo "This is testPage." >/usr/local/nginx/html/index.html'
    # 将一个字串作为完整的命令来执行
    # sudo仅有root的部分权限
    print(result, info)
