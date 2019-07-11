$(document).ready(function () {
    // select2
    $(".select2").select2({
        width: null,
    });

    // time-picker
    $("#per_time").timepicker({
        showMeridian: false,
        minuteStep: 5,

    });

    // bootstrap-switch
    $("#status").bootstrapSwitch();

    $('#sample_1').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../rsync_config_data/",
        "columns": [
            {"data": "id"},
            {"data": "periodictask_id"},
            {"data": "main_host_id"},
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
            "targets": -12,
            "visible": false
        }, {
            "targets": -11,
            "visible": false
        }, {
            "data": null,
            "targets": -10,
            "render": function (data, type, full) {
                if (full.main_host_status == 1) {
                    return "<td>" + full.main_host + " <i class='fa fa-fire' style='color:#ff1c1c' title='服务已启动'></i></td>";
                } else {
                    return "<td>" + full.main_host + "</td>";
                }
            }
        }, {
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
                    if (full.backup_host[i].backup_host_status == 1) {
                        backup_host_init += full.backup_host[i].backup_host + " <i class='fa fa-fire' style='color:#ff1c1c' title='服务已启动'></i>" + ','
                    } else {
                        backup_host_init += full.backup_host[i].backup_host + ','
                    }
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
                    model_init += full.model[i].model_name + ' ,'
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
                if (full.status === "off") {
                    status = "关闭"
                }
                if (full.status === "on") {
                    status = "开启"
                }
                return "<td>" + status + "</td>";
            },
        }, {
            "data": null,
            "width": "120px",
            "targets": -1,
            "render": function (data, type, full) {
                var exec_tag = "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-edit'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>";
                exec_tag += "<button title='切换' id='exchange_btn' data-toggle='modal'  data-target='#static_exchange'  class='btn btn-xs btn-info' type='button'><i class='fa fa-exchange'></i></button>";
                exec_tag += "<button title='恢复' id='recover_btn' data-toggle='modal'  data-target='#static_recover'  class='btn btn-xs btn-warning' type='button'><i class='fa fa-reply-all'></i></button>";
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
                url: "../rsync_config_del/",
                data:
                    {
                        id: data.id,
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
        $("#rsync_loading").hide();
        $("#save").removeProp("disabled");
        $("#close").removeProp("disabled");
        $("#rsync_modal_close").removeProp("disabled");

        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $("#id").val(data.id);
        $("#main_host_ip").val(data.main_host_id);
        $("#periodictask_id").val(data.periodictask_id);
        var backup_host_id_list = []
        for (var i = 0; i < data.backup_host.length; i++) {
            backup_host_id_list.push(data.backup_host[i].id);
        }
        $("#backup_host_ip").val(backup_host_id_list).trigger("change");
        // 模块
        $("#model_info_div").empty();
        for (i = 0; i < data.model.length; i++) {
            $("#model_info_div").append('<div class="col-md-12" style="margin-bottom:9px;padding-left: 0px;padding-right: 0px;">\n' +
                '    <label class="col-md-2 control-label"><span style="color:red;">*</span>模块名称:</label>\n' +
                '    <div class="col-md-4" style="padding-right:0px;">\n' +
                '        <input type="text" class="form-control" name="model_name_' + (i + 1) + '" value="' + data.model[i].model_name + '" placeholder="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '    <label class="col-md-2 control-label"><span style="color:red;">*</span>备份路径:</label>\n' +
                '    <div class="col-md-4" style="padding-right:0px;">\n' +
                '        <input type="text" class="form-control" name="backup_path_' + (i + 1) + '" value="' + data.model[i].rsync_path + '" placeholder="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '<span hidden>\n' +
                '    <input type="text" class="form-control" name="model_id_' + (i + 1) + '" value="' + data.model[i].id + '" placeholder="">\n' +
                '</span>' +
                '    </div>\n'
            );
        }

        // 设置定时器
        var per_time = data.hours + ":" + data.minutes;
        $("#per_time").val(per_time).timepicker("setTime", per_time);
        $("#per_week").val(data.per_week != "*" ? data.per_week : 0).trigger("change");
        $("#per_month").val(data.per_month != "*" ? data.per_month : 0).trigger("change");
        if (data.status === "on") {
            $("#status").bootstrapSwitch("state", true);
        } else {
            $("#status").bootstrapSwitch("state", false);
        }

    });
    $('#sample_1 tbody').on('click', 'button#recover_btn', function () {
        $("#rsync_recover_loading").hide();
        $("#recover").removeProp("disabled");
        $("#recover_close").removeProp("disabled");
        $("#recover_modal_close").removeProp("disabled");

        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $("#recover_id").val(data.main_host_id);
        $("#rsync_config_id").val(data.id);
        // 恢复
        $("#dest_main_host").val(data.main_host);
        $("#selected_backup_host").empty();
        for (var i = 0; i < data.backup_host.length; i++) {
            $("#selected_backup_host").append('<option value="' + data.backup_host[i]["id"] + '">' + data.backup_host[i]["backup_host"] + '</option>');
        }
    });
    $('#sample_1 tbody').on('click', 'button#exchange_btn', function () {
        $("#exchange_recover_loading").hide();
        $("#exchange").removeProp("disabled");
        $("#exchange_close").removeProp("disabled");
        $("#exchange_modal_close").removeProp("disabled");

        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $("#exchange_id").val(data.main_host_id);
        $("#rsync_config_id").val(data.id);

        $("#exchange_main_host").val(data.main_host);
        $("#exchange_backup_host").empty();
        for (var i = 0; i < data.backup_host.length; i++) {
            $("#exchange_backup_host").append('<option value="' + data.backup_host[i]["id"] + '">' + data.backup_host[i]["backup_host"] + '</option>');
        }
    });
    $("#recover").click(function () {
        $("#rsync_recover_loading").show();
        $("#recover").prop("disabled", true);
        $("#recover_close").prop("disabled", true);
        $("#recover_modal_close").prop("disabled", true);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "../rsync_recover/",
            data: {
                "id": $("#rsync_config_id").val(),
                "dest_main_host": $("#dest_main_host").val(),
                "backup_host": $("#selected_backup_host").val(),
            },
            success: function (data) {
                alert(data.info);
                if (data.ret == 1) {
                    $("#static_recover").modal("hide");
                } else {
                    $("#rsync_recover_loading").hide();
                    $("#recover").removeProp("disabled");
                    $("#recover_close").removeProp("disabled");
                    $("#recover_modal_close").removeProp("disabled");
                }
            },
            error: function (e) {
                alert("页面出现错误，请于管理员联系。");
                $("#rsync_recover_loading").hide();
                $("#recover").removeProp("disabled");
                $("#recover_close").removeProp("disabled");
                $("#recover_modal_close").removeProp("disabled");
            }
        })
    });
    $("#exchange").click(function () {
        $("#exchange_recover_loading").show();
        $("#exchange").prop("disabled", true);
        $("#exchange_close").prop("disabled", true);
        $("#exchange_modal_close").prop("disabled", true);
        var table = $('#sample_1').DataTable();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "../server_exchange/",
            data: {
                "id": $("#rsync_config_id").val(),
                "main_host": $("#exchange_main_host").val(),
                "backup_host": $("#exchange_backup_host").val(),
            },
            success: function (data) {
                alert(data.info);
                if (data.ret == 1) {
                    $("#static_exchange").modal("hide");
                    table.ajax.reload();
                } else {
                    $("#exchange_recover_loading").hide();
                    $("#exchange").removeProp("disabled");
                    $("#exchange_close").removeProp("disabled");
                    $("#exchange_modal_close").removeProp("disabled");
                }
            },
            error: function (e) {
                alert("页面出现错误，请于管理员联系。");
                $("#exchange_recover_loading").hide();
                $("#exchange").removeProp("disabled");
                $("#exchange_close").removeProp("disabled");
                $("#exchange_modal_close").removeProp("disabled");
            }
        })
    });

    $("#new").click(function () {
        $("#rsync_loading").hide();
        $("#save").removeProp("disabled");
        $("#close").removeProp("disabled");
        $("#rsync_modal_close").removeProp("disabled");

        $("#rsync_recover_loading").hide();
        $("#recover").removeProp("disabled");
        $("#recover_close").removeProp("disabled");
        $("#recover_modal_close").removeProp("disabled");

        $("#main_host_ip").val("0");
        $("#id").val("0");
        $("#main_host_ip").val("");
        $("#backup_host_ip").val("").trigger("change");
        // 模块，移除/新增
        $("#model_info_div").empty();
        $("#model_info_div").append('<div class="col-md-12" style="margin-bottom:9px;padding-left: 0px;padding-right: 0px;">\n' +
            '    <label class="col-md-2 control-label"><span style="color:red; ">*</span>模块名称:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="model_name_1"\n' +
            '               placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '    <label class="col-md-2 control-label"><span style="color:red; ">*</span>备份路径:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="backup_path_1"\n' +
            '               placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '    <span hidden>\n' +
            '        <input type="text" class="form-control" name="model_id_1" placeholder="">\n' +
            '    </span>\n' +
            '</div>');
        $("#per_time").val("00:00").timepicker("setTime", "00:00");
        $("#per_week").val("0").trigger("change");
        $("#per_month").val("0").trigger("change");
        $("#status").bootstrapSwitch("state", false);
    });

    $('#save').click(function () {
        $("#rsync_loading").show();
        $("#save").prop("disabled", true);
        $("#close").prop("disabled", true);
        $("#rsync_modal_close").prop("disabled", true);

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
                var myres = data.ret;
                var mydata = data.data;
                if (myres === 1) {
                    $('#static').modal('hide');
                    table.ajax.reload();
                } else {
                    $("#rsync_loading").hide();
                    $("#save").removeProp("disabled");
                    $("#close").removeProp("disabled");
                    $("#rsync_modal_close").removeProp("disabled");
                }
                alert(mydata);
            },
            error: function (e) {
                alert("页面出现错误，请于管理员联系。");
                $("#rsync_loading").hide();
                $("#save").removeProp("disabled");
                $("#close").removeProp("disabled");
                $("#rsync_modal_close").removeProp("disabled");
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
});