$(document).ready(function() {
    var csrfToken = $("[name='csrfmiddlewaretoken']").val();
    $('#sample_1').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../inspection_report_data/",
        "columns": [
            { "data": "inspection_id" },
            { "data": "report_title" },
            { "data": "inspection_date" },
            { "data": "client_name" },
            { "data": "engineer" },
            { "data": "host_name" },
            { "data": null }
        ],

        "columnDefs": [{
            "targets": -1,
            "data": null,
            "width": "80px",
            "defaultContent": "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-edit'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>"
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
    $('#sample_1 tbody').on('click', 'button#delrow', function() {
        if (confirm("确定要删除该条数据？")) {
            var table = $('#sample_1').DataTable();
            var data = table.row($(this).parents('tr')).data();
            $.ajax({
                type: "POST",
                url: "../inspection_del/",
                data: {
                    id: data.inspection_id
                },
                success: function(data) {
                    if (data == 1) {
                        table.ajax.reload();
                        alert("删除成功！");
                    } else
                        alert("删除失败，请于管理员联系。");
                },
                error: function(e) {
                    alert("删除失败，请于管理员联系。");
                }
            });

        }
    });
    $('#sample_1 tbody').on('click', 'button#edit', function() {
        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $("#inspection_id").val(data.inspection_id);

        $("#report_title").val(data.report_title);
        $("#client_name").val(data.client_id);
        $("#inspection_date").val(data.inspection_date);
        $("#engineer").val(data.engineer);
        $("#last_inspection_date").val(data.last_inspection_date);
        $("#next_inspection_date").val(data.next_inspection_date);

        $("input[name='hardware']:radio[value='" + data.hardware + "']").attr('checked', 'true');
        $("#hardware_error_content").val(data.hardware_error_content);

        $("input[name='software']:radio[value='" + data.software + "']").attr('checked', 'true');
        $("#software_error_content").val(data.software_error_content);

        $("input[name='aging_plan_run']:radio[value='" + data.aging_plan_run + "']").attr('checked', 'true');
        $("#aging_plan_run_remark").val(data.aging_plan_run_remark);

        $("input[name='backup_plan_run']:radio[value='" + data.backup_plan_run + "']").attr('checked', 'true');
        $("#backup_plan_run_remark").val(data.backup_plan_run_remark);

        $("input[name='running_status']:radio[value='" + data.running_status + "']").attr('checked', 'true');
        $("#running_remark").val(data.running_remark);

        $("input[name='client_add']:radio[value='" + data.client_add + "']").attr('checked', 'true');
        $("#client_add_remark").val(data.client_add_remark);

        $("input[name='backup_plan']:radio[value='" + data.backup_plan + "']").attr('checked', 'true');
        $("#backup_plan_remark").val(data.backup_plan_remark);

        $("input[name='aging_plan']:radio[value='" + data.aging_plan + "']").attr('checked', 'true');
        $("#aging_plan_remark").val(data.aging_plan_remark);

        $("input[name='error_send']:radio[value='" + data.error_send + "']").attr('checked', 'true');
        $("#error_send_remark").val(data.error_send_remark);

        $("input[name='cdr_running']:radio[value='" + data.cdr_running + "']").attr('checked', 'true');
        $("#cdr_running_remark").val(data.cdr_running_remark);

        $("input[name='media_run']:radio[value='" + data.media_run + "']").attr('checked', 'true');
        $("#media_run_remark").val(data.media_run_remark);

        $("#extra_error_content").val(data.extra_error_content);
        $("#suggestion_and_summary").val(data.suggestion_and_summary);
        $("#client_sign").val(data.client_sign);
        $("#engineer_sign").val(data.engineer_sign);

        $("#address").val(data.address);
        $("#contact").val(data.contact);
        $("#position").val(data.position);
        $("#tel").val(data.tel);
        $("#fax").val(data.fax);
        $("#email").val(data.email);

        $("#startdate").val(data.startdate);
        $("#enddate").val(data.enddate);
        $("#version").val(data.version);
        $("#host_name").val(data.host_name);
        $("#patch").val(data.patch);
        $("#all_client").val(data.all_client);
        $("#offline_client").val(data.offline_client);
        $("#offline_client_content").val(data.offline_client_content);
        $("#backup_time").val(data.backup_time);
        $("#fail_time").val(data.fail_time);
        $("#fail_log").val(data.fail_log);
        $("#total_capacity").val(data.total_capacity);
        $("#used_capacity").val(data.used_capacity);
        $("#increase_capacity").val(data.increase_capacity);
    });
    $("#new").click(function() {
        $('#inspection_id').val(0);
        $("#report_title").val("");
        $("#client_name").val("");
        $("#inspection_date").val("");
        $("#engineer").val("");
        $("#last_inspection_date").val("");
        $("#next_inspection_date").val("");

        $("#hardware").val("");
        $("#hardware_error_content").val("");
        $("#software").val("");
        $("#software_error_content").val("");
        $("#aging_plan_run").val("");
        $("#aging_plan_run_remark").val("");
        $("#backup_plan_run").val("");
        $("#backup_plan_run_remark").val("");
        $("#running_status").val("");
        $("#running_remark").val("");
        $("#client_add").val("");
        $("#client_add_remark").val("");
        $("#backup_plan").val("");
        $("#backup_plan_remark").val("");
        $("#aging_plan").val("");
        $("#aging_plan_remark").val("");
        $("#error_send").val("");
        $("#error_send_remark").val("");
        $("#cdr_running").val("");
        $("#cdr_running_remark").val("");
        $("#media_run").val("");
        $("#media_run_remark").val("");
        $("#extra_error_content").val("");
        $("#suggestion_and_summary").val("");
        $("#client_sign").val("");
        $("#engineer_sign").val("");

        $("#address").val("");
        $("#contact").val("");
        $("#position").val("");
        $("#tel").val("");
        $("#fax").val("");
        $("#email").val("");

        $("#startdate").val("");
        $("#enddate").val("");
        $("#version").val("");
        $("#host_name").val("");
        $("#patch").val("");
        $("#all_client").val("");
        $("#offline_client").val("");
        $("#offline_client_content").val("");
        $("#backup_time").val("");
        $("#fail_time").val("");
        $("#fail_log").val("");
        $("#total_capacity").val("");
        $("#used_capacity").val("");
        $("#increase_capacity").val("");
    });

    // $('#client_name').select2();
    $('#client_name').change(function() {
        var client_id = $(this).val();
        $.ajax({
            type: "POST",
            url: "../get_client_data/",
            data: {
                "client_id": client_id,
                "csrfmiddlewaretoken": csrfToken,
            },
            success: function(data) {
                if (data.ret == 1) {
                    $("#address").val(data.data.address);
                    $("#contact").val(data.data.contact);
                    $("#position").val(data.data.position);
                    $("#tel").val(data.data.tel);
                    $("#fax").val(data.data.fax);
                    $("#email").val(data.data.email);
                } else {
                    alert(data.data)
                }
            }
        })
    });

    $('#startdate').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $('#enddate').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $('#search_cv').click(function() {
        var start_date = $('#startdate').val();
        var end_date = $('#enddate').val();
        var start_date_sec = new Date(start_date);
        var end_date_sec = new Date(end_date);
        if (end_date_sec.getTime() < start_date_sec.getTime()) {
            alert("结束时间不可小于开始时间，请重新选择。");
            $('#enddate').val(start_date);
        } else {
            $.ajax({
                type: "POST",
                url: "../get_clients_info/",
                data: {
                    "start_date": start_date,
                    "end_date": end_date,
                    "csrfmiddlewaretoken": csrfToken,
                },
                success: function(data) {
                    if (data.ret == 1) {
                        $("#all_client").val(data.data.all_client);
                        $("#backup_time").val(data.data.backup_time);
                        $("#fail_time").val(data.data.fail_time);
                    } else {
                        alert(data.data)
                    }
                }
            })
        }
    })
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
    $('#client_sign').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $('#engineer_sign').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $("#inspection_save").click(function() {
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
                data: $('#inspection_form').serialize(),
                success: function(data) {
                    if (data.ret == 1) {
                        $('#static').modal('hide');
                        table.ajax.reload();
                    } else {
                        alert(data.data)
                    }
                }
            });
        }
    });
});