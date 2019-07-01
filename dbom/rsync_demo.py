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
        self.sudo_permission = 'echo {0}|sudo -S '.format(server['password']) if server['username'] != 'root' else ''

    def run_shell_cmd(self, shell_cmd, get_pty=True):
        result = 1
        info = ''
        # root用户
        stdin, stdout, stderr = self.client.exec_command(self.sudo_permission + shell_cmd + ';' + self.verify_shell_cmd, get_pty=get_pty)
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
        result, info = self.run_shell_cmd('rsync')
        return result, info

    def set_rsync_server_config(self, model_list):
        """
        secrets file 默认/etc/rsync.password
        auth users  默认rsync_backup
        :param model_list: [{"model_name": "", "host_allowd": "", "backup_path": ""}]
        :return:
        """
        # 设置互通密码
        self.set_server_password()
        self.set_client_password()

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
            # 设置备份地址权限
            result, info = self.run_shell_cmd('chown -R rsync.rsync {0}'.format(temp_model['backup_path']))

            base_config += '\n' + \
                           '[{0}]'.format(temp_model['model_name']) + '\n' + \
                           'path = {0}'.format(temp_model['backup_path']) + '\n' + \
                           'ignore errors' + '\n' + \
                           'read only = false' + '\n' + \
                           'list = false' + '\n' + \
                           'hosts allow = *' + '\n' + \
                           'auth users = rsync_backup' + '\n' + \
                           'secrets file = /etc/rsync_server.password'
        result, info = self.run_shell_cmd("echo '{0}' > /etc/rsyncd.conf".format(base_config))

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
        if result:
            result = 0
            info = 'rsync已经在运行中。'
        else:
            result, info = self.run_shell_cmd('rsync --daemon', get_pty=False)
        return result, info

    def stop_rsync(self):
        result, info = self.run_shell_cmd('ps -ef|grep rsync|grep -v grep')
        if not result:
            result = 0
            info = 'rsync未运行。'
        else:
            result, info = self.run_shell_cmd('pkill rsync')
        return result, info

    def rsync_exec_avz(self, dest_dir, auth_user, dest_server, model_name, delete=False):
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
        # 1.dest_dir是否存在



        if delete:
            result, info = self.run_shell_cmd('rsync -avz {0} {1}@{2}::{3}/ --password-file=/etc/rsync.password --delete'.format(dest_dir, auth_user, dest_server, model_name))
        else:
            result, info = self.run_shell_cmd('rsync -avz {0} {1}@{2}::{3}/ --password-file=/etc/rsync.password'.format(dest_dir, auth_user, dest_server, model_name))
        return result, info


if __name__ == '__main__':
    server = {
        'hostname': '192.168.85.134',
        'username': 'miaokela',
        'password': 'password'
    }
    rsync_backup = RsyncBackup(server)
    # result, info = rsync_backup.start_rsync()
    # result, info = rsync_backup.stop_rsync()
    # result, info = rsync_backup.run_shell_cmd('ls')
    result, info = rsync_backup.install_rsync_by_yum()
    # result, info = rsync_backup.rsync_exec_avz(r'/root/backup/', 'rsync_backup', '192.168.85.151', 'server01', delete=True)
    # result, info = rsync_backup.tail_rsync_log()
    # result, info = rsync_backup.set_rsync_server_config([{"model_name": "server01", "host_allowd": "192.168.85.151", "backup_path": "/root/backup"}])
    print(result, info)
