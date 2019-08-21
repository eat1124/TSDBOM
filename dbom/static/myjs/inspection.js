var csrfToken = $("[name='csrfmiddlewaretoken']").val();
$('#sample_1').dataTable({
    "bAutoWidth": true,
    "bSort": false,
    "bProcessing": true,
    "ajax": "../inspection_report_data/",
    "columns": [
        {"data": "inspection_id"},
        {"data": "report_title"},
        {"data": "inspection_date"},
        {"data": "client_name"},
        {"data": "engineer"},
        {"data": "host_name"},
        // 隐藏
        {"data": null}
    ],

    "columnDefs": [
        {
            "targets": -2,
            "data": null,
            "render": function (data, type, full) {
                return "<td>" + full.os_platform + "/" + full.host_name + "</td>";
            }
        },
        {
            "targets": -1,
            "data": null,
            "width": "80px",
            "render": function (data, type, full) {
                return "<td><button title='下载' class='btn btn-xs btn-primary' type='button'><a href='/download_inspection/?inspection_id=inspection_id_submit'>".replace("inspection_id_submit", full.inspection_id) +
                    "<i class='fa fa-arrow-circle-down'  style='color: white'></i></a></button>" +
                    "<button id='edit' title='查看' data-toggle='modal' data-target='#static' class='btn btn-xs btn-primary' type='button'><i class='fa fa-search'></i></button>" +
                    "<button title='删除' id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button></td>";
            }
        }
    ],
    "oLanguage": {
        "sLengthMenu": "每页显示 _MENU_ 条记录",
        "sZeroRecords": "抱歉， 没有找到",
        "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
        "sInfoEmpty": "没有数据",
        "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
        "sSearch": "搜索",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "前一页",
            "sNext": "后一页",
            "sLast": "尾页"
        },
        "sZeroRecords": "没有检索到数据",
    }
});


// 行按钮
$('#sample_1 tbody').on('click', 'button#delrow', function () {
    if (confirm("确定要删除该条数据？")) {
        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $.ajax({
            type: "POST",
            url: "../inspection_del/",
            data: {
                inspection_id: data.inspection_id
            },
            success: function (data) {
                if (data == 1) {
                    table.ajax.reload();
                    alert("删除成功！");
                } else
                    alert("删除失败，请于管理员联系。");
            },
            error: function (e) {
                alert("删除失败，请于管理员联系。");
            }
        });

    }
});

$('#sample_1 tbody').on('click', 'button#edit', function () {
    var table = $('#sample_1').DataTable();
    var data = table.row($(this).parents('tr')).data();
    $("#inspection_id").val(data.inspection_id);

    $("#report_title").val(data.report_title);
    $("#client_name").val(data.client_id);
    $("#inspection_date").val(data.inspection_date);
    $("#engineer").val(data.engineer);
    $("#last_inspection_date").val(data.last_inspection_date);
    $("#next_inspection_date").val(data.next_inspection_date);

    $("#address").val(data.address);
    $("#contact").val(data.contact);
    $("#position").val(data.position);
    $("#tel").val(data.tel);
    $("#fax").val(data.fax);
    $("#email").val(data.email);

    $("#commv_version").val(data.version);
    $("#commv_host_name").val(data.host_name);
    $("#commv_os_platform").val(data.os_platform);
    $("#commv_patch").val(data.patch);

    $("#all_client").val(data.all_client);
    $("#offline_client").val(data.offline_client);
    $("#offline_client_content").val(data.offline_client_content);
    // 介质服务器
    var library_server = JSON.parse(data.library_server);

    // 系统错误报告
    var hardware_error = JSON.parse(data.hardware_error);
    var software_error = JSON.parse(data.software_error);
    var aging_plan_run = JSON.parse(data.aging_plan_run);
    var backup_plan_run = JSON.parse(data.backup_plan_run);
    var running_status = JSON.parse(data.running_status);
    var client_add = JSON.parse(data.client_add);
    var error_send = JSON.parse(data.error_send);
    var cdr_running = JSON.parse(data.cdr_running);

    var commserver_status = JSON.parse(data.commserver_status);
    var agent_backup_status = JSON.parse(data.agent_backup_status);

    var period_capacity = JSON.parse(data.period_capacity);
    var auxiliary_copy = JSON.parse(data.auxiliary_copy);
    var library_status = JSON.parse(data.library_status);
    var recover_status = JSON.parse(data.recover_status);

    // 找到介质服务器的位置
    var pre_num = 0
    $("#form_body").children().each(function (i) {
        if ($(this).find('label').text() == "介质服务器") {
            // 请求，添加介质服务器,添加系统错误报告
            pre_num = i;

            // 清空该节点后所有子节点
            $(this).nextAll().remove();

            // 加载agent_backup_status
            var init_html = "";
            for (var i = 0; i < library_server.length; i++) {
                var j = i + 1;
                init_html += '<div class="form-group">\n' +
                    '    <label class="col-md-2 control-label">' + library_server[i].ma_name + '</label>\n' +
                    '    <input type="text" name="library_lib_name_' + j + '" value="' + library_server[i].lib_name + '" hidden>\n' +
                    '    <input type="text" name="library_ma_name_' + j + '" value="' + library_server[i].ma_name + '" hidden>\n' +
                    '    <div class="col-md-2">\n' +
                    '        <input autocomplete="off" type="text" name="library_ma_ip_' + j + '"\n' +
                    '               class="form-control" placeholder="" value="' + library_server[i].ma_ip + '" readonly>\n' +
                    '        <div class="form-control-focus"></div>\n' +
                    '    </div>\n' +
                    '    <div class="col-md-8">\n' +
                    '        <label class="col-md-2 control-label">备份空间</label>\n' +
                    '        <div class="col-md-2">\n' +
                    '            <input autocomplete="off" type="text" name="library_all_capacity_' + j + '"\n' +
                    '                   class="form-control" placeholder="" value="' + library_server[i].all_capacity + '" readonly>\n' +
                    '            <div class="form-control-focus"></div>\n' +
                    '        </div>\n' +
                    '        <label class="col-md-2 control-label">剩余空间</label>\n' +
                    '        <div class="col-md-2">\n' +
                    '            <input autocomplete="off" type="text" name="library_used_capacity_' + j + '"\n' +
                    '                   class="form-control" placeholder="" value="' + library_server[i].used_capacity + '" readonly>\n' +
                    '            <div class="form-control-focus"></div>\n' +
                    '        </div>\n' +
                    '        <label class="col-md-2 control-label">月增长率</label>\n' +
                    '        <div class="col-md-2">\n' +
                    '            <input autocomplete="off" type="text"\n' +
                    '                   name="library_increase_capacity_' + j + '" class="form-control" placeholder="" value="' + library_server[i].increase_capacity + '"\n' +
                    '                   readonly>\n' +
                    '            <div class="form-control-focus"></div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>';
            }

            init_html += '\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-2 control-label"\n' +
                '           style="font-weight:bold;font-size:15px;">系统错误报告</label>\n' +
                '    <div class="col-md-10">\n' +
                '        <hr>\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">有否硬件故障</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="hardware" id="hardware1" value="1" checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="hardware" id="hardware2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">故障内容</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="hardware_error_content" autocomplete="off" type="text"\n' +
                '               name="hardware_error_content" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">有否软件故障</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="software" id="software1" value="1" checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="software" id="software2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">故障内容</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="software_error_content" autocomplete="off" type="text"\n' +
                '               name="software_error_content" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">CommServer灾难运行情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio"  value="1" name="commserver_status" id="commserver_status1"\n' +
                '                       checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" value="0" name="commserver_status" id="commserver_status2">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input autocomplete="off" type="text" id="commserver_status_remark" name="commserver_status_remark"\n' +
                '                class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>';

            // 系统错误报告
            for (index in agent_backup_status) {
                index = parseInt(index);

                var inner_init_html = "";
                var sorted_list = [];
                for (index_inner in agent_backup_status) {
                    index_inner = parseInt(index_inner);
                    if (agent_backup_status[index_inner].tag == index + 1) {
                        if (agent_backup_status[index_inner].agent_name.indexOf("total_") != -1 && agent_backup_status[index_inner].agent_name.indexOf("_tag") == -1) {
                            var pre_check = "";
                            if (agent_backup_status[index_inner].status == 1) {
                                pre_check = "checked";
                            }
                            inner_init_html = '<div class="form-group">\n' +
                                '<label class="col-md-3 control-label">' + agent_backup_status[index_inner].agent_name.replace("total_", "") + '最近二次全备份情况</label>\n' +
                                '<div class="col-md-2">\n' +
                                '    <div class="radio-list" style="margin-left: 20px;">\n' +
                                '        <label class="radio-inline">\n' +
                                '            <input type="radio"  value="1" name="total_' + agent_backup_status[index_inner].agent_name + '" id="total_' + agent_backup_status[index_inner].agent_name + '1"\n' +
                                '                   checked>\n'.replace("checked", agent_backup_status[index_inner].status == 1 ? "checked" : "") +
                                '            正常\n' +
                                '        </label>\n' +
                                '        <label class="radio-inline">\n' +
                                '            <input type="radio" value="0" name="total_' + agent_backup_status[index_inner].agent_name + '" id="total_' + agent_backup_status[index_inner].agent_name + '2"\n' +
                                '                   checked>\n'.replace("checked", agent_backup_status[index_inner].status == 0 ? "checked" : "") +
                                '            异常\n' +
                                '        </label>\n' +
                                '    </div>\n' +
                                '</div>\n' +
                                '<label class="col-md-1 control-label">备注</label>\n' +
                                '<div class="col-md-6">\n' +
                                '    <input autocomplete="off" type="text" name="total_' + agent_backup_status[index_inner].agent_name + '_remark" id="total_' + agent_backup_status[index_inner].agent_name + '_remark"\n' +
                                '            class="form-control" placeholder="" value="' + agent_backup_status[index_inner].remark + '">\n' +
                                '    <input type="number" name="total_{{agent}}_tag" id="total_' + agent_backup_status[index_inner].agent_name + '_tag" value="' + index_inner + 1 + '" hidden>\n' +
                                '    <div class="form-control-focus"></div>\n' +
                                '</div>\n' +
                                '</div>' + inner_init_html;
                        }
                        if (agent_backup_status[index_inner].agent_name.indexOf("part_") != -1 && agent_backup_status[index_inner].agent_name.indexOf("_tag") == -1) {
                            var pre_check = "";
                            if (agent_backup_status[index_inner].status == 1) {
                                pre_check = "checked";
                            }
                            inner_init_html = inner_init_html + '<div class="form-group">\n' +
                                '<label class="col-md-3 control-label">' + agent_backup_status[index_inner].agent_name.replace("part_", "") + '最近一周期增量/差异全备份情况</label>\n' +
                                '<div class="col-md-2">\n' +
                                '    <div class="radio-list" style="margin-left: 20px;">\n' +
                                '        <label class="radio-inline">\n' +
                                '            <input type="radio"  value="1" name="part_' + agent_backup_status[index_inner].agent_name + '" id="part_' + agent_backup_status[index_inner].agent_name + '1"\n' +
                                '                   checked>\n'.replace("checked", agent_backup_status[index_inner].status == 1 ? "checked" : "") +
                                '            正常\n' +
                                '        </label>\n' +
                                '        <label class="radio-inline">\n' +
                                '            <input type="radio" value="0" name="part_' + agent_backup_status[index_inner].agent_name + '" id="part_' + agent_backup_status[index_inner].agent_name + '2"\n' +
                                '                   checked>\n'.replace("checked", agent_backup_status[index_inner].status == 0 ? "checked" : "") +
                                '            异常\n' +
                                '        </label>\n' +
                                '    </div>\n' +
                                '</div>\n' +
                                '<label class="col-md-1 control-label">备注</label>\n' +
                                '<div class="col-md-6">\n' +
                                '    <input autocomplete="off" type="text" name="part_' + agent_backup_status[index_inner].agent_name + '_remark" id="part_' + agent_backup_status[index_inner].agent_name + '_remark"\n' +
                                '            class="form-control" placeholder="" value="' + agent_backup_status[index_inner].remark + '">\n' +
                                '    <input type="number" name="part_{{agent}}_tag" id="part_' + agent_backup_status[index_inner].agent_name + '_tag" value="' + index_inner + 1 + '" hidden>\n' +
                                '    <div class="form-control-focus"></div>\n' +
                                '</div>\n' +
                                '</div>';
                        }
                        pre_num++;
                    }
                }
                init_html += inner_init_html;
            }

            init_html += '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">数据时效计划运行情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="aging_plan_run" id="aging_plan_run1" value="1"\n' +
                '                       checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="aging_plan_run" id="aging_plan_run2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="aging_plan_run_remark" autocomplete="off" type="text"\n' +
                '               name="aging_plan_run_remark" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">数据备份计划运行情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="backup_plan_run" id="backup_plan_run1" value="1"\n' +
                '                       checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="backup_plan_run" id="backup_plan_run2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="backup_plan_run_remark" autocomplete="off" type="text"\n' +
                '               name="backup_plan_run_remark" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">报告计划运行情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="running_status" id="running_status1" value="1"\n' +
                '                       checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="running_status" id="running_status2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="running_remark" autocomplete="off" type="text" name="running_remark"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">最近是否打算要增加新的客户端</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="client_add" id="client_add1" value="1" checked>\n' +
                '                是\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="client_add" id="client_add2" value="0">\n' +
                '                否\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="client_add_remark" autocomplete="off" type="text"\n' +
                '               name="client_add_remark" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">一个周期数据大概容量</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="period_capacity" id="period_capacity1" value="1" checked>\n' +
                '                ≤1000G\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="period_capacity" id="period_capacity2" value="0">\n' +
                '                >1000G\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="period_capacity_remark" autocomplete="off" type="text"\n' +
                '               name="period_capacity_remark" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">有否发给cvadmin用户的错误报告</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="error_send" id="error_send1" value="1" checked>\n' +
                '                有\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="error_send" id="error_send2" value="0">\n' +
                '                否\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="error_send_remark" autocomplete="off" type="text"\n' +
                '               name="error_send_remark" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">CDR运行情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="cdr_running" id="cdr_running1" value="1" checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="cdr_running" id="cdr_running2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="cdr_running_remark" autocomplete="off" type="text"\n' +
                '               name="cdr_running_remark" class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">辅助拷贝运行情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" value="1" name="auxiliary_copy" id="auxiliary_copy1" checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" value="0"name="auxiliary_copy" id="auxiliary_copy2">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="auxiliary_copy_remark" autocomplete="off" type="text" name="auxiliary_copy_remark"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">备份介质运行状态</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="library_status" id="media_run1" value="1" checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" name="library_status" id="media_run2" value="0">\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="library_status_remark" autocomplete="off" type="text" name="library_status_remark"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-3 control-label">数据恢复演练情况</label>\n' +
                '    <div class="col-md-2">\n' +
                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" value="1"  name="recover" id="recover1" checked>\n' +
                '                正常\n' +
                '            </label>\n' +
                '            <label class="radio-inline">\n' +
                '                <input type="radio" value="0" name="recover" id="recover2" >\n' +
                '                异常\n' +
                '            </label>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <label class="col-md-1 control-label">备注</label>\n' +
                '    <div class="col-md-6">\n' +
                '        <input id="recover_remark" autocomplete="off" type="text" name="recover_remark"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group ">\n' +
                '    <label class="col-md-3 control-label">其他错误报告内容</label>\n' +
                '    <div class="col-md-9">\n' +
                '        <textarea class="form-control" rows="6" id="extra_error_content"\n' +
                '                  name="extra_error_content"></textarea>\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <div class="col-md-5">\n' +
                '        <hr>\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '    <label class="col-md-2 control-label"\n' +
                '           style="font-weight: bold;font-size:20px;text-align: center">总结和建议</label>\n' +
                '    <div class="col-md-5">\n' +
                '        <hr>\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group ">\n' +
                '    <div class="col-md-1"></div>\n' +
                '    <div class="col-md-11">\n' +
                '        <textarea class="form-control" rows="15" id="suggestion_and_summary"\n' +
                '                  name="suggestion_and_summary"></textarea>\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-2 control-label"><span style="color:red;">*</span>客户签字</label>\n' +
                '    <div class="col-md-4">\n' +
                '        <input id="client_sign" autocomplete="off" type="text" name="client_sign"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '    <label class="col-md-2 control-label">签字日期</label>\n' +
                '    <div class="col-md-4">\n' +
                '        <input id="client_sign_date" autocomplete="off" type="datetime" name="client_sign_date"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div class="form-group">\n' +
                '    <label class="col-md-2 control-label"><span style="color:red;">*</span>维修工程师签字</label>\n' +
                '    <div class="col-md-4">\n' +
                '        <input id="engineer_sign" autocomplete="off" type="text" name="engineer_sign"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '    <label class="col-md-2 control-label">签字日期</label>\n' +
                '    <div class="col-md-4">\n' +
                '        <input id="engineer_sign_date" autocomplete="off" type="datetime" name="engineer_sign_date"\n' +
                '               class="form-control" placeholder="" value="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '</div>\n' +
                '<div style="height: 50px;">\n' +
                '</div>';
            $(this).after(init_html);
        }
    });

    $("input[name='hardware']:radio[value='" + hardware_error.status + "']").prop('checked', 'true');
    $("#hardware_error_content").val(hardware_error.remark);

    $("input[name='software']:radio[value='" + software_error.status + "']").prop('checked', 'true');
    $("#software_error_content").val(software_error.remark);

    $("input[name='aging_plan_run']:radio[value='" + aging_plan_run.status + "']").prop('checked', 'true');
    $("#aging_plan_run_remark").val(aging_plan_run.remark);

    $("input[name='backup_plan_run']:radio[value='" + backup_plan_run.status + "']").prop('checked', 'true');
    $("#backup_plan_run_remark").val(backup_plan_run.remark);

    $("input[name='running_status']:radio[value='" + running_status.status + "']").prop('checked', 'true');
    $("#running_remark").val(running_status.remark);

    $("input[name='client_add']:radio[value='" + client_add.status + "']").prop('checked', 'true');
    $("#client_add_remark").val(client_add.remark);

    $("input[name='error_send']:radio[value='" + error_send.status + "']").prop('checked', 'true');
    $("#error_send_remark").val(error_send.remark);

    $("input[name='cdr_running']:radio[value='" + cdr_running.status + "']").prop('checked', 'true');
    $("#cdr_running_remark").val(cdr_running.remark);

    $("input[name='commserver_status']:radio[value='" + commserver_status.status + "']").prop('checked', 'true');
    $("#commserver_status_remark").val(commserver_status.remark);

    $("input[name='period_capacity']:radio[value='" + period_capacity.status + "']").prop('checked', 'true');
    $("#period_capacity_remark").val(period_capacity.remark);

    $("input[name='auxiliary_copy']:radio[value='" + auxiliary_copy.status + "']").prop('checked', 'true');
    $("#auxiliary_copy_remark").val(auxiliary_copy.remark);

    $("input[name='library_status']:radio[value='" + library_status.status + "']").prop('checked', 'true');
    $("#library_status_remark").val(library_status.remark);

    $("input[name='recover']:radio[value='" + recover_status.status + "']").prop('checked', 'true');
    $("#recover_remark").val(recover_status.remark);

    $("#extra_error_content").val(data.extra_error_content);
    $("#suggestion_and_summary").val(data.suggestion_and_summary);
    $("#client_sign").val(data.client_sign);
    $("#engineer_sign").val(data.engineer_sign);
    $("#client_sign_date").val(data.client_sign_date);
    $("#engineer_sign_date").val(data.engineer_sign_date);

    // 隐藏
    $('#inspection_form').find('input[type="number"]').prop("readonly", true);
    $('#inspection_form').find('input[type="text"]').prop("readonly", true);
    $('#inspection_form').find('input[type="radio"]').prop("disabled", true);
    $('#inspection_form').find('input[type="datetime"]').prop("disabled", true);
    $('#inspection_form').find('textarea').prop("readonly", true);
    $('#inspection_form').find('select').prop("disabled", true);

    $('#inspection_save').hide();
});


$("#new").click(function () {
    // 展示
    $('#inspection_form').find('input[type="text"]:not(input[name^="library_"]):not(input[name^="commv_"])').val("");
    $('#inspection_form').find('input[type="text"]:not(input[name^="last_inspection"])').prop("readonly", false);
    $('#inspection_form').find('input[type="number"]').prop("readonly", false);
    $('#inspection_form').find('input[type="radio"]').prop("disabled", false);
    $('#inspection_form').find('input[type="datetime"]').prop("disabled", false).val("");
    $('#inspection_form').find('textarea').prop("readonly", false).val("");
    $('#inspection_form').find('select').prop("disabled", false).val("");
    $('#last_inspection_date').prop("readonly", true);
    $.ajax({
        type: "POST",
        url: "../get_clients_info/",
        data: {},
        success: function (data) {
            if (data.ret == 1) {
                var library_space_info = data.data.library_space_info;
                var agent_list = data.data.agent_list;

                // 找到介质服务器的位置
                var pre_num = 0
                $("#form_body").children().each(function (i) {
                    if ($(this).find('label').text() == "介质服务器") {
                        // 请求，添加介质服务器,添加系统错误报告
                        pre_num = i;

                        // 清空该节点后所有子节点
                        $(this).nextAll().remove();

                        // 加载agent_backup_status
                        var init_html = ""
                        for (var i = 0; i < library_space_info.length; i++) {
                            var j = i + 1
                            init_html += '<div class="form-group">\n' +
                                '    <label class="col-md-2 control-label">' + library_space_info[i].MAName + '</label>\n' +
                                '    <input type="text" name="library_lib_name_' + j + '" value="' + library_space_info[i].LibraryName + '" hidden>\n' +
                                '    <input type="text" name="library_ma_name_' + j + '" value="' + library_space_info[i].MAName + '" hidden>\n' +
                                '    <div class="col-md-2">\n' +
                                '        <input autocomplete="off" type="text" name="library_ma_ip_' + j + '"\n' +
                                '               class="form-control" placeholder="" value="" readonly>\n' +
                                '        <div class="form-control-focus"></div>\n' +
                                '    </div>\n' +
                                '    <div class="col-md-8">\n' +
                                '        <label class="col-md-2 control-label">备份空间</label>\n' +
                                '        <div class="col-md-2">\n' +
                                '            <input autocomplete="off" type="text" name="library_all_capacity_' + j + '"\n' +
                                '                   class="form-control" placeholder="" value="' + library_space_info[i].TotalSpaceMB + '" readonly>\n' +
                                '            <div class="form-control-focus"></div>\n' +
                                '        </div>\n' +
                                '        <label class="col-md-2 control-label">剩余空间</label>\n' +
                                '        <div class="col-md-2">\n' +
                                '            <input autocomplete="off" type="text" name="library_used_capacity_' + j + '"\n' +
                                '                   class="form-control" placeholder="" value="' + library_space_info[i].TotalFreeSpaceMB + '" readonly>\n' +
                                '            <div class="form-control-focus"></div>\n' +
                                '        </div>\n' +
                                '        <label class="col-md-2 control-label">月增长率</label>\n' +
                                '        <div class="col-md-2">\n' +
                                '            <input autocomplete="off" type="text"\n' +
                                '                   name="library_increase_capacity_' + j + '" class="form-control" placeholder="" value=""\n' +
                                '                   readonly>\n' +
                                '            <div class="form-control-focus"></div>\n' +
                                '        </div>\n' +
                                '    </div>\n' +
                                '</div>'
                        }

                        init_html += '\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-2 control-label"\n' +
                            '           style="font-weight:bold;font-size:15px;">系统错误报告</label>\n' +
                            '    <div class="col-md-10">\n' +
                            '        <hr>\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">有否硬件故障</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="hardware" id="hardware1" value="1" checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="hardware" id="hardware2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">故障内容</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="hardware_error_content" autocomplete="off" type="text"\n' +
                            '               name="hardware_error_content" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">有否软件故障</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="software" id="software1" value="1" checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="software" id="software2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">故障内容</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="software_error_content" autocomplete="off" type="text"\n' +
                            '               name="software_error_content" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">CommServer灾难运行情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio"  value="1" name="commserver_status" id="commserver_status1"\n' +
                            '                       checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" value="0" name="commserver_status" id="commserver_status2">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input autocomplete="off" type="text" id="commserver_status_remark" name="commserver_status_remark"\n' +
                            '                class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>'

                        // 系统错误报告
                        for (var i = 0; i < agent_list.length; i++) {
                            var j = i + 1;
                            init_html += '<div class="form-group">\n' +
                                '    <label class="col-md-3 control-label">' + agent_list[i] + '最近二次全备份情况</label>\n' +
                                '    <div class="col-md-2">\n' +
                                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                                '            <label class="radio-inline">\n' +
                                '                <input type="radio"  value="1" name="total_' + agent_list[i] + '" id="total_' + agent_list[i] + '1"\n' +
                                '                       checked>\n' +
                                '                正常\n' +
                                '            </label>\n' +
                                '            <label class="radio-inline">\n' +
                                '                <input type="radio" value="0" name="total_' + agent_list[i] + '" id="total_' + agent_list[i] + '2">\n' +
                                '                异常\n' +
                                '            </label>\n' +
                                '        </div>\n' +
                                '    </div>\n' +
                                '    <label class="col-md-1 control-label">备注</label>\n' +
                                '    <div class="col-md-6">\n' +
                                '        <input autocomplete="off" type="text" name="total_' + agent_list[i] + '_remark" id="total_' + agent_list[i] + '_remark"\n' +
                                '                class="form-control" placeholder="" value="">\n' +
                                '        <input type="number" name="total_' + agent_list[i] + '_tag" id="total_' + agent_list[i] + '_tag" value="' + j + '" hidden>\n' +
                                '        <div class="form-control-focus"></div>\n' +
                                '    </div>\n' +
                                '</div>\n' +
                                '<div class="form-group">\n' +
                                '    <label class="col-md-3 control-label">' + agent_list[i] + '最近一周期增量/差异全备份情况</label>\n' +
                                '    <div class="col-md-2">\n' +
                                '        <div class="radio-list" style="margin-left: 20px;">\n' +
                                '            <label class="radio-inline">\n' +
                                '                <input type="radio"  value="1" name="part_' + agent_list[i] + '" id="part_' + agent_list[i] + '1"\n' +
                                '                       checked>\n' +
                                '                正常\n' +
                                '            </label>\n' +
                                '            <label class="radio-inline">\n' +
                                '                <input type="radio" value="0" name="part_' + agent_list[i] + '" id="part_' + agent_list[i] + '2">\n' +
                                '                异常\n' +
                                '            </label>\n' +
                                '        </div>\n' +
                                '    </div>\n' +
                                '    <label class="col-md-1 control-label">备注</label>\n' +
                                '    <div class="col-md-6">\n' +
                                '        <input autocomplete="off" type="text" name="part_' + agent_list[i] + '_remark" id="part_' + agent_list[i] + '_remark"\n' +
                                '                class="form-control" placeholder="" value="">\n' +
                                '        <input type="number" name="part_' + agent_list[i] + '_tag" id="part_' + agent_list[i] + '_tag" value="' + j + '" hidden>\n' +
                                '        <div class="form-control-focus"></div>\n' +
                                '    </div>\n' +
                                '</div>'
                        }

                        init_html += '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">数据时效计划运行情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="aging_plan_run" id="aging_plan_run1" value="1"\n' +
                            '                       checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="aging_plan_run" id="aging_plan_run2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="aging_plan_run_remark" autocomplete="off" type="text"\n' +
                            '               name="aging_plan_run_remark" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">数据备份计划运行情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="backup_plan_run" id="backup_plan_run1" value="1"\n' +
                            '                       checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="backup_plan_run" id="backup_plan_run2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="backup_plan_run_remark" autocomplete="off" type="text"\n' +
                            '               name="backup_plan_run_remark" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">报告计划运行情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="running_status" id="running_status1" value="1"\n' +
                            '                       checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="running_status" id="running_status2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="running_remark" autocomplete="off" type="text" name="running_remark"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">最近是否打算要增加新的客户端</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="client_add" id="client_add1" value="1" checked>\n' +
                            '                是\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="client_add" id="client_add2" value="0">\n' +
                            '                否\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="client_add_remark" autocomplete="off" type="text"\n' +
                            '               name="client_add_remark" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">一个周期数据大概容量</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="period_capacity" id="period_capacity1" value="1" checked>\n' +
                            '                ≤1000G\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="period_capacity" id="period_capacity2" value="0">\n' +
                            '                >1000G\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="period_capacity_remark" autocomplete="off" type="text"\n' +
                            '               name="period_capacity_remark" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">有否发给cvadmin用户的错误报告</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="error_send" id="error_send1" value="1" checked>\n' +
                            '                有\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="error_send" id="error_send2" value="0">\n' +
                            '                否\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="error_send_remark" autocomplete="off" type="text"\n' +
                            '               name="error_send_remark" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">CDR运行情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="cdr_running" id="cdr_running1" value="1" checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="cdr_running" id="cdr_running2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="cdr_running_remark" autocomplete="off" type="text"\n' +
                            '               name="cdr_running_remark" class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">辅助拷贝运行情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" value="1" name="auxiliary_copy" id="auxiliary_copy1" checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" value="0"name="auxiliary_copy" id="auxiliary_copy2">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="auxiliary_copy_remark" autocomplete="off" type="text" name="auxiliary_copy_remark"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">备份介质运行状态</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="library_status" id="media_run1" value="1" checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" name="library_status" id="media_run2" value="0">\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="library_status_remark" autocomplete="off" type="text" name="library_status_remark"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-3 control-label">数据恢复演练情况</label>\n' +
                            '    <div class="col-md-2">\n' +
                            '        <div class="radio-list" style="margin-left: 20px;">\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" value="1"  name="recover" id="recover1" checked>\n' +
                            '                正常\n' +
                            '            </label>\n' +
                            '            <label class="radio-inline">\n' +
                            '                <input type="radio" value="0" name="recover" id="recover2" >\n' +
                            '                异常\n' +
                            '            </label>\n' +
                            '        </div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-1 control-label">备注</label>\n' +
                            '    <div class="col-md-6">\n' +
                            '        <input id="recover_remark" autocomplete="off" type="text" name="recover_remark"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group ">\n' +
                            '    <label class="col-md-3 control-label">其他错误报告内容</label>\n' +
                            '    <div class="col-md-9">\n' +
                            '        <textarea class="form-control" rows="6" id="extra_error_content"\n' +
                            '                  name="extra_error_content"></textarea>\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <div class="col-md-5">\n' +
                            '        <hr>\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-2 control-label"\n' +
                            '           style="font-weight: bold;font-size:20px;text-align: center">总结和建议</label>\n' +
                            '    <div class="col-md-5">\n' +
                            '        <hr>\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group ">\n' +
                            '    <div class="col-md-1"></div>\n' +
                            '    <div class="col-md-11">\n' +
                            '        <textarea class="form-control" rows="15" id="suggestion_and_summary"\n' +
                            '                  name="suggestion_and_summary"></textarea>\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-2 control-label"><span style="color:red;">*</span>客户签字</label>\n' +
                            '    <div class="col-md-4">\n' +
                            '        <input id="client_sign" autocomplete="off" type="text" name="client_sign"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-2 control-label">签字日期</label>\n' +
                            '    <div class="col-md-4">\n' +
                            '        <input id="client_sign_date" autocomplete="off" type="datetime" name="client_sign_date"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div class="form-group">\n' +
                            '    <label class="col-md-2 control-label"><span style="color:red;">*</span>维修工程师签字</label>\n' +
                            '    <div class="col-md-4">\n' +
                            '        <input id="engineer_sign" autocomplete="off" type="text" name="engineer_sign"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '    <label class="col-md-2 control-label">签字日期</label>\n' +
                            '    <div class="col-md-4">\n' +
                            '        <input id="engineer_sign_date" autocomplete="off" type="datetime" name="engineer_sign_date"\n' +
                            '               class="form-control" placeholder="" value="">\n' +
                            '        <div class="form-control-focus"></div>\n' +
                            '    </div>\n' +
                            '</div>\n' +
                            '<div style="height: 50px;">\n' +
                            '</div>';
                        $(this).after(init_html);
                    }
                });

                $("#all_client").val(data.data.all_client);
                $("#commv_version").val(data.data.version);
                $("#commv_host_name").val(data.data.host_name);
                $("#commv_patch").val(data.data.patch);
                $("#commv_os_platform").val(data.data.os_platform);
                $("#offline_client").val(data.data.offline_client);

                // radio重置
                $('#inspection_form').find("input:radio[value='0']").prop('checked', false);
                $('#inspection_form').find("input:radio[value='1']").prop('checked', true);

                $('#inspection_save').show();

                $('#inspection_id').val(0);

                $('#inspection_form').find('input[type="text"]:not(input[name^="last_inspection"])').prop("readonly", false);

                $('#inspection_date').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                });
                $('#next_inspection_date').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                });
                $('#client_sign_date').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                });
                $('#engineer_sign_date').datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                });

            } else {
                alert(data.data)
            }
        }
    });
});

$('#client_name').change(function () {
    var client_id = $(this).val();
    $.ajax({
        type: "POST",
        url: "../get_client_data/",
        data: {
            "client_id": client_id,
            "csrfmiddlewaretoken": csrfToken,
        },
        success: function (data) {
            if (data.ret == 1) {
                $("#address").val(data.data.address);
                $("#contact").val(data.data.contact);
                $("#position").val(data.data.position);
                $("#tel").val(data.data.tel);
                $("#fax").val(data.data.fax);
                $("#email").val(data.data.email);
                $('#last_inspection_date').val(data.data.last_inspection_date);
            } else {
                alert(data.data)
            }
        }
    })
});

$("#inspection_save").click(function () {
    var table = $('#sample_1').DataTable();
    var inspection_date = $('#inspection_date').val();
    var next_inspection_date = $('#next_inspection_date').val();
    var inspection_date_sec = new Date(inspection_date);
    var next_inspection_date_sec = new Date(next_inspection_date);

    if (next_inspection_date_sec.getTime() < inspection_date_sec.getTime()) {
        alert("下次时间不可小于本次巡检时间，请重新选择。");
        $('#next_inspection_date').val(inspection_date);
    } else {
        var inspection_data = $('#inspection_form').serialize();
        $.ajax({
            type: "POST",
            url: "../save_inspection/",
            data: $('#inspection_form').serializeArray(),
            success: function (data) {
                if (data.ret == 1) {
                    $('#static').modal('hide');
                    table.ajax.reload();
                }
                alert(data.data);
            }
        });
    }
});
