$(document).ready(function () {
    $('#sample_1').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../rsync_config_data/",
        "columns": [
            {"data": "id"},
            {"data": "main_host"},
            // visible_false
            {"data": "minutes"},
            {"data": "hours"},
            {"data": "per_week"},
            {"data": "per_month"},

            {"data": "backup_host"},
            {"data": "model"},
            {"data": null},
            {"data": "status"},
            {"data": null}
        ],

        "columnDefs": [{
            "targets": -9,
            "visible": false
        }, {
            "targets": -8,
            "visible": false
        }, {
            "targets": -7,
            "visible": false
        }, {
            "targets": -6,
            "visible": false
        }, {
            "data": null,
            "targets": -5,
            "render": function (data, type, full) {
                // 备机
                var backup_host_init = '';
                for (var i = 0; i < full.backup_host.length; i++) {
                    console.log(full.backup_host[i])
                    console.log(typeof(full.backup_host[i]))
                    backup_host_init += full.backup_host[i].backup_host + ','
                }
                return "<td>" + backup_host_init ? backup_host_init.slice(0, -1) : '' + "</td>";
            },
        }, {
            "data": null,
            "targets": -4,
            "render": function (data, type, full) {
                // 模块
                var model_init = '';
                for (var i = 0; i < full.model.length; i++) {
                    model_init += full.model[i].model_name + ','
                }
                return "<td>" + model_init ? model_init.slice(0, -1) : '' + "</td>";
            },
        }, {
            "data": null,
            "targets": -3,
            "render": function (data, type, full) {
                // 定时任务
                var per_week = full.per_week && full.per_week != "*" ? '/ 周per_week/ '.replace("per_week", full.per_week) : "";
                var per_month = full.per_month && full.per_month != "*" ? 'per_month月'.replace("per_month", full.per_month) : "";
                return "<td>" + full.hours + ":" + full.minutes + per_week + per_month + "</td>"
            },
        }, {
            "data": null,
            "targets": -2,
            "render": function (data, type, full) {
                var status = ""
                if (full.status === "off"){
                    status = "关闭"
                }
                if (full.status === "on") {
                    status = "开启"
                }
                return "<td>" + status + "</td>";
            },
        }, {
            "data": null,
            "width": "100px",
            "targets": -1,
            "render": function (data, type, full) {
                var exec_tag = "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-edit'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>";
                exec_tag += "<button title='恢复'  id='recover' class='btn btn-xs btn-warning' type='button'><i class='fa fa-reply-all'></i></button>"

                return "<td>" + exec_tag + "</td>";
            },
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
                url: "../process_del/",
                data:
                    {
                        id: data.process_id,
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
        $("#id").val(data.process_id);
        $("#code").val(data.process_code);
        $("#name").val(data.process_name);
        $("#remark").val(data.process_remark);
        $("#sign").val(data.process_sign);
        $("#rto").val(data.process_rto);
        $("#rpo").val(data.process_rpo);
        $("#sort").val(data.process_sort);
        $("#process_color").val(data.process_color);
    });

    $("#new").click(function () {
        $("#id").val("0");


    });

    $('#save').click(function () {
        var table = $('#sample_1').DataTable();
        var selected = $("#backup_host_ip").select2('data');//选择的值
        var selected_backup_host_list = new Array();
        for (var i = 0; i < selected.length; i++) {
            selected_backup_host_list.push(selected[i].id)
        }
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "../rsync_config_save/",
            data: $("#rsync_config_form").serialize() + '&selected_backup_host=' + selected_backup_host_list,
            success: function (data) {
                console.log(data);
                console.log(data.ret)
                var myres = data.ret;
                var mydata = data.data;
                if (myres === 1) {
                    $('#static').modal('hide');
                    table.ajax.reload();
                }
                alert(mydata);
            },
            error: function (e) {
                alert("页面出现错误，请于管理员联系。");
            }
        });
    });

    $('#error').click(function () {
        $(this).hide()
    });

    $("#node_new").click(function () {
        var cNum = $("#model_info_div").children("div").length + 1;
        $("#model_info_div").append('<div class="col-md-12" style="margin-bottom:9px;padding-left: 0px;padding-right: 0px;">\n' +
            '    <label class="col-md-2 control-label"><span style="color:red;">*</span>模块名称:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="model_name_' + cNum + '" placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '    <label class="col-md-2 control-label"><span style="color:red;">*</span>备份路径:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="backup_path_' + cNum + '" placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '<span hidden>\n' +
            '    <input type="text" class="form-control" name="model_id_' + cNum + '" placeholder="">\n' +
            '</span>' +
            '</div>'
        );
        if ($("#model_info_div").children("div").length > 1) {
            $("#node_del").css("visibility", "visible");
        } else {
            $("#node_del").css("visibility", "hidden");
        }
    });

    $("#node_del").click(function () {
        // 删除最后一个子元素
        if ($("#model_info_div").children("div").length > 1) {
            $("#model_info_div").children("div:last-child").remove();
        }
        if ($("#model_info_div").children("div").length <= 1) {
            $("#node_del").css("visibility", "hidden");
        }
    });

    // select2
    $(".select2").select2({
        width: null,
    });

    // time-picker
    $("#per_time").timepicker({
        showMeridian: false,
    });
});