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
            "targets": -1,
            "data": null,
            "width": "80px",
            "defaultContent": "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-search'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>"
        }],
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

    $("#version").val(data.version);
    $("#host_name").val(data.host_name);
    $("#os_platform").val(data.os_platform);
    $("#patch").val(data.patch);

    $("#all_client").val(data.all_client);
    $("#offline_client").val(data.offline_client);
    $("#offline_client_content").val(data.offline_client_content);

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

    // 清空agent_backup_status
    for (var i = 0; i < agent_backup_status.length; i++) {
        $("#form_body").children().eq(22).remove();
    }

    // 加载agent_backup_status
    var pre_num = 21
    var init_html = ""
    for (index in agent_backup_status) {
        index = parseInt(index)
        for (index_inner in agent_backup_status) {
            index_inner = parseInt(index_inner)
            if (agent_backup_status[index_inner].tag == index + 1) {
                if (agent_backup_status[index_inner].agent_name.indexOf("total_") != -1 && agent_backup_status[index_inner].agent_name.indexOf("_tag") == -1) {
                    var pre_check = "";
                    if (agent_backup_status[index_inner].status == 1) {
                        pre_check = "checked";
                    }
                    // var pre_check = "";
                    // if (agent_backup_status[index_inner].status == 1) {
                    //     pre_check = "checked";
                    // }
                    init_html += '<div class="form-group">\n' +
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
                        '</div>';
                }
                if (agent_backup_status[index_inner].agent_name.indexOf("part_") != -1 && agent_backup_status[index_inner].agent_name.indexOf("_tag") == -1) {
                    var pre_check = "";
                    if (agent_backup_status[index_inner].status == 1) {
                        pre_check = "checked";
                    }
                    init_html += '<div class="form-group">\n' +
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
                pre_num++
            }
        }
    }
    $("#form_body").children().eq(21).after(init_html);

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
    $("#period_capacity_remark").val(period_capacity.status);

    $("input[name='auxiliary_copy']:radio[value='" + auxiliary_copy.status + "']").prop('checked', 'true');
    $("#auxiliary_copy_remark").val(auxiliary_copy.remark);

    $("input[name='library_status']:radio[value='" + library_status.status + "']").prop('checked', 'true');
    $("#library_status_remark").val(library_status.remark);

    $("input[name='recover_status']:radio[value='" + recover_status.status + "']").prop('checked', 'true');
    $("#recover_remark").val(recover_status.remark);

    $("#extra_error_content").val(data.extra_error_content);
    $("#suggestion_and_summary").val(data.suggestion_and_summary);
    $("#client_sign").val(data.client_sign);
    $("#engineer_sign").val(data.engineer_sign);
    $("#client_sign_date").val(data.client_sign_date);
    $("#engineer_sign_date").val(data.engineer_sign_date);

    // 隐藏
    $('#inspection_form').find('input[type="text"]').prop("readonly", true);
    $('#inspection_form').find('input[type="radio"]').prop("disabled", true);
    $('#inspection_form').find('input[type="datetime"]').prop("disabled", true);
    $('#inspection_form').find('textarea').prop("readonly", true);
    $('#inspection_form').find('select').prop("disabled", true);

    $('#inspection_save').hide();
});

function search_cv() {
    $.ajax({
        type: "POST",
        url: "../get_clients_info/",
        data: {},
        success: function (data) {
            if (data.ret == 1) {
                $("#all_client").val(data.data.all_client);
                // $("#version").val(data.data.version);
                // $("#host_name").val(data.data.host_name);
                // $("#patch").val(data.data.patch);
                // $("#os_platform").val(data.data.os_platform);
                $("#offline_client").val(data.data.offline_client);


            } else {
                alert(data.data)
            }
        }
    })
}


$("#new").click(function () {
    search_cv();


    // 展示
    $('#inspection_form').find('input[type="text"]').prop("readonly", false).val("");
    $('#inspection_form').find('input[type="number"]').prop("readonly", false).val("");
    $('#inspection_form').find('input[type="radio"]').prop("disabled", false);
    $('#inspection_form').find('input[type="datetime"]').prop("disabled", false).val("");
    $('#inspection_form').find('textarea').prop("readonly", false).val("");
    $('#inspection_form').find('select').prop("disabled", false).val("");
    $('#last_inspection_date').prop("readonly", true);
    // radio重置
    $('#inspection_form').find("input:radio[value='0']").prop('checked', false);
    $('#inspection_form').find("input:radio[value='1']").prop('checked', true);

    $('#inspection_save').show();

    $('#inspection_id').val(0);
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