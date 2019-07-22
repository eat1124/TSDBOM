$(document).ready(function () {
    // 1.获取整个路径
    // 2.新增子节点
    // 3.点击事件
    function originPathClick() {
        // input-click
        $("input[name^='origin_path']").click(function () {
            $("#static_main_select").modal();
            $("#main_plan").val($(this).prop("name"));

            var mainHostId = $("#main_host_ip").val();
            $('#main_file_tree').jstree("destroy");
            // 请求源端路径
            $.ajax({
                type: "POST",
                url: "../get_file_path/",
                data: {
                    hostId: mainHostId,
                },
                success: function (data) {
                    if (data.ret == 1) {
                        var mainTreeData = data.info;
                        $('#main_file_tree').jstree({
                            'core': {
                                "themes": {
                                    "responsive": false
                                },
                                "check_callback": true,
                                'data': mainTreeData
                            },

                            "types": {
                                "node": {
                                    "icon": "fa fa-folder icon-state-warning icon-lg"
                                },
                                "fun": {
                                    "icon": "fa fa-file icon-state-warning icon-lg"
                                }
                            },
                            "plugins": ["types", "role"]
                        })
                            .bind('select_node.jstree', function (event, data) {
                                if (data.node.text != "/") {
                                    // 清空子节点
                                    $('#main_file_tree').jstree(true).delete_node(data.node.children);

                                    // 新增子节点
                                    var curNode = data.node;
                                    var parentNodeText = "";
                                    var prePath = ""

                                    function customParentNodeText(tempNode) {
                                        var parentNode = data.instance.get_node(tempNode.parent);
                                        if (parentNode.text != "/") {
                                            parentNodeText = parentNode.text + "/" + parentNodeText;
                                            var preParentNode = data.instance.get_node(parentNode.parent);
                                            if (preParentNode) {
                                                customParentNodeText(parentNode);
                                            }
                                        }
                                    }

                                    customParentNodeText(curNode)
                                    prePath = "/" + parentNodeText + curNode.text;

                                    // 将路径写入页面
                                    $("#main_select_path").val(prePath);

                                    $.ajax({
                                        type: "POST",
                                        url: "../get_child_file_path/",
                                        data: {
                                            hostId: mainHostId,
                                            pre_path: prePath,
                                        },
                                        success: function (data) {
                                            console.log(data.info)
                                            if (data.ret == 1) {
                                                // 返回数组，循环新增子节点
                                                for (var i = 0; i < data.info.length; i++) {
                                                    $('#main_file_tree').jstree(true).create_node(curNode, {
                                                        "text": data.info[i],
                                                    });
                                                }
                                            } else
                                                alert("源端子目录加载失败，请检查服务器是否开启。");
                                        },
                                        error: function (e) {
                                            alert("源端子目录加载失败，请检查服务器是否已选择。");
                                        }
                                    });
                                } else {
                                    $("#main_select_path").val("/");
                                }
                            });
                    } else
                        alert("源端根目录加载失败，请检查服务器是否开启。");
                },
                error: function (e) {
                    alert("源端根目录加载失败，请检查服务器是否已选择。");
                }
            });
        });
    }

    function destPathClick() {
        $("input[name^='dest_path']").click(function () {
            $("#static_dest_select").modal();
            $("#dest_plan").val($(this).prop("name"));

            var destHostId = $("#backup_host_ip").val();
            $('#dest_file_tree').jstree("destroy");
            // 请求源端路径
            $.ajax({
                type: "POST",
                url: "../get_file_path/",
                data: {
                    hostId: destHostId,
                },
                success: function (data) {
                    if (data.ret == 1) {
                        var destTreeData = data.info;
                        $('#dest_file_tree').jstree({
                            'core': {
                                "themes": {
                                    "responsive": false
                                },
                                "check_callback": true,
                                'data': destTreeData
                            },

                            "types": {
                                "node": {
                                    "icon": "fa fa-folder icon-state-warning icon-lg"
                                },
                                "fun": {
                                    "icon": "fa fa-file icon-state-warning icon-lg"
                                }
                            },
                            "plugins": ["types", "role"]
                        })
                            .bind('select_node.jstree', function (event, data) {
                                if (data.node.text != "/") {
                                    // 清空子节点
                                    $('#dest_file_tree').jstree(true).delete_node(data.node.children);

                                    // 新增子节点
                                    var curNode = data.node;
                                    var parentNodeText = "";
                                    var prePath = ""

                                    function customParentNodeText(tempNode) {
                                        var parentNode = data.instance.get_node(tempNode.parent);
                                        if (parentNode.text != "/") {
                                            parentNodeText = parentNode.text + "/" + parentNodeText;
                                            var preParentNode = data.instance.get_node(parentNode.parent);
                                            if (preParentNode) {
                                                customParentNodeText(parentNode);
                                            }
                                        }
                                    }

                                    customParentNodeText(curNode)
                                    prePath = "/" + parentNodeText + curNode.text;

                                    // 将路径写入页面
                                    $("#dest_select_path").val(prePath);

                                    $.ajax({
                                        type: "POST",
                                        url: "../get_child_file_path/",
                                        data: {
                                            hostId: destHostId,
                                            pre_path: prePath,
                                        },
                                        success: function (data) {
                                            if (data.ret == 1) {
                                                // 返回数组，循环新增子节点
                                                for (var i = 0; i < data.info.length; i++) {
                                                    $('#dest_file_tree').jstree(true).create_node(curNode, {
                                                        "text": data.info[i],
                                                    });
                                                }
                                            } else
                                                alert("终端子目录加载失败，请检查服务器是否开启。");
                                        },
                                        error: function (e) {
                                            alert("终端子目录加载失败，请检查服务器是否已选择。");
                                        }
                                    });
                                } else {
                                    $("#dest_select_path").val("/");
                                }
                            });
                    } else
                        alert("终端根目录加载失败，请检查服务器是否开启。");
                },
                error: function (e) {
                    alert("终端根目录加载失败，请检查服务器是否已选择。");
                }
            });
        });
    }

    $("#main_ensure").click(function () {
        var mainPlan = $("#main_plan").val();
        var mainSelectPath = $("#main_select_path").val();

        $("input[name='mainplan']".replace("mainplan", mainPlan)).val(mainSelectPath);
        $("#static_main_select").modal("hide");
    });

    $("#dest_ensure").click(function () {
        var destPlan = $("#dest_plan").val();
        var destSelectPath = $("#dest_select_path").val();
        $("input[name='destplan']".replace("destplan", destPlan)).val(destSelectPath);
        $("#static_dest_select").modal("hide");
    });

    // select2
    $(".select2").select2({
        width: null,
    });

    // time-picker
    $("#per_time").timepicker({
        showMeridian: false,
        minuteStep: 5,
    }).on('show.timepicker', function () {
        $('#static').removeAttr('tabindex');
    }).on('hide.timepicker', function () {
        $('#static').attr('tabindex', -1);
    });

    // bootstrap-switch
    $("#status").bootstrapSwitch();

    $('#sample_1').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../rsync_config_data/",
        "columns": [{
            "data": "id"
        }, {
            "data": "interval_id"
        }, {
            "data": "periodictask_id"
        }, {
            "data": "main_host_id"
        }, {
            "data": "main_host"
        }, {
            "data": "minutes"
        }, {
            "data": "hours"
        }, {
            "data": "per_week"
        }, {
            "data": "per_month"
        }, {
            "data": "backup_host"
        }, {
            "data": null
        }, {
            "data": "status"
        }, {
            "data": null
        }],
        "columnDefs": [{
            "targets": -12,
            "visible": false
        }, {
            "targets": -11,
            "visible": false
        }, {
            "targets": -10,
            "visible": false
        }, {
            "data": null,
            "targets": -9,
            "render": function (data, type, full) {
                if (full.main_host_status == 1) {
                    return "<td>" + full.main_host + " <i class='fa fa-fire' style='color:#ff1c1c' title='服务已启动'></i></td>";
                } else {
                    return "<td>" + full.main_host + "</td>";
                }
            }
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
            "targets": -5,
            "visible": false
        }, {
            "data": null,
            "targets": -4,
            "render": function (data, type, full) {
                // 备机
                if (full.backup_host_status == 1) {
                    return "<td>" + full.backup_host + " <i class='fa fa-fire' style='color:#ff1c1c' title='服务已启动'></i></td>";
                } else {
                    return "<td>" + full.backup_host + "</td>";
                }
            },
        }, {
            "data": null,
            "targets": -3,
            "render": function (data, type, full) {
                if (full.interval_id) {
                    var interval_period = ""
                    if (full.interval_period == "minutes") {
                        interval_period = "分钟";
                    } else if (full.interval_period == "hours") {
                        interval_period = "小时";
                    } else if (full.interval_period == "days") {
                        interval_period == "天";
                    } else {
                        interval_period == "毫秒";
                    }
                    // 间隔任务
                    return "<td>" + full.interval_every + interval_period + "</td>"
                } else {
                    // 定时任务
                    var per_week = full.per_week && full.per_week != "*" ? '/ 周per_week/ '.replace("per_week", full.per_week) : "";
                    var per_month = full.per_month && full.per_month != "*" ? 'per_month月'.replace("per_month", full.per_month) : "";
                    return "<td>" + full.hours + ":" + full.minutes + per_week + per_month + "</td>"
                }
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
                data: {
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
        $("#backup_host_ip").val(data.backup_host_id);
        $("#periodictask_id").val(data.periodictask_id);

        // 模块
        $("#path_info_div").empty();
        for (i = 0; i < data.model.length; i++) {
            $("#path_info_div").append('<div class="col-md-12" style="margin-bottom:9px;padding-left: 0px;padding-right: 0px;">\n' +
                '    <label class="col-md-2 control-label"><span style="color:red;">*</span>模块名称:</label>\n' +
                '    <div class="col-md-4" style="padding-right:0px;">\n' +
                '        <input type="text" class="form-control" name="origin_path_' + (i + 1) + '" value="' + data.model[i].main_path + '" placeholder="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '    </div>\n' +
                '    <label class="col-md-2 control-label"><span style="color:red;">*</span>备份路径:</label>\n' +
                '    <div class="col-md-4" style="padding-right:0px;">\n' +
                '        <input type="text" class="form-control" name="dest_path_' + (i + 1) + '" value="' + data.model[i].dest_path + '" placeholder="">\n' +
                '        <div class="form-control-focus"></div>\n' +
                '<span hidden>\n' +
                '    <input type="text" class="form-control" name="model_id_' + (i + 1) + '" value="' + data.model[i].id + '" placeholder="">\n' +
                '</span>' +
                '    </div>\n'
            );
        }

        if (data.interval_id) {
            $('#periodictask_tab a:last').tab('show');
            $("#per_time").val("00:00").timepicker("setTime", "00:00");
            $("#per_week").val("").trigger("change");
            $("#per_month").val("").trigger("change");
        } else {
            $('#periodictask_tab a:first').tab('show');
            $("#intervals").val("").trigger("change");
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
        // 间隔
        $("#intervals").val(data.interval_id).trigger("change");

        originPathClick();
        destPathClick();
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
        $("#origin_host").val(data.main_host);
        $("#dest_host").val(data.backup_host);
        $("#dest_host_id").val(data.backup_host_id);
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
        $("#exchange_backup_host").val(data.backup_host);
        $("#exchange_backup_host_id").val(data.backup_host_id);
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
                "origin_host": $("#origin_host").val(),
                "backup_host": $("#dest_host_id").val(),
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
                "backup_host": $("#exchange_backup_host_id").val(),
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

        $("#intervals").val("0");
        $('#periodictask_tab a:first').tab('show');

        $("#id").val("0");
        $("#main_host_ip").val("0");
        $("#backup_host_ip").val("0");
        // 模块，移除/新增
        $("#path_info_div").empty();
        $("#path_info_div").append('<div class="col-md-12" style="margin-bottom:9px;padding-left: 0px;padding-right: 0px;">\n' +
            '    <label class="col-md-2 control-label"><span style="color:red; ">*</span>源端路径:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="origin_path_1"\n' +
            '               placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '    <label class="col-md-2 control-label"><span style="color:red; ">*</span>终端路径:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="dest_path_1"\n' +
            '               placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '    <span hidden>\n' +
            '        <input type="text" class="form-control" name="model_id_1" placeholder="">\n' +
            '    </span>\n' +
            '</div>');
        $("#per_time").val("00:00").timepicker("setTime", "00:00");
        $("#per_week").val("").trigger("change");
        $("#per_month").val("").trigger("change");
        $("#intervals").val("").trigger("change");
        $("#status").bootstrapSwitch("state", false);

        originPathClick();
        destPathClick();
    });

    $('#save').click(function () {
        $("#rsync_loading").show();
        $("#save").prop("disabled", true);
        $("#close").prop("disabled", true);
        $("#rsync_modal_close").prop("disabled", true);

        var table = $('#sample_1').DataTable();

        if ($('#periodictask_tab li:first').hasClass("active")) {
            $("#periodictask_type").val("crontabs");
        } else {
            $("#periodictask_type").val("intervals");
        }

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "../rsync_config_save/",
            data: $("#rsync_config_form").serialize(),
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
        var cNum = $("#path_info_div").children("div").length + 1;
        $("#path_info_div").append('<div class="col-md-12" style="margin-bottom:9px;padding-left: 0px;padding-right: 0px;">\n' +
            '    <label class="col-md-2 control-label"><span style="color:red;">*</span>源端路径:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="origin_path_' + cNum + '" placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '    <label class="col-md-2 control-label"><span style="color:red;">*</span>终端路径:</label>\n' +
            '    <div class="col-md-4" style="padding-right:0px;">\n' +
            '        <input type="text" class="form-control" name="dest_path_' + cNum + '" placeholder="">\n' +
            '        <div class="form-control-focus"></div>\n' +
            '    </div>\n' +
            '<span hidden>\n' +
            '    <input type="text" class="form-control" name="path_id_' + cNum + '" placeholder="">\n' +
            '</span>' +
            '</div>'
        );
        if ($("#path_info_div").children("div").length > 1) {
            $("#node_del").css("visibility", "visible");
        } else {
            $("#node_del").css("visibility", "hidden");
        }
        $("input[name^='origin_path']").unbind("click");
        $("input[name^='dest_path']").unbind("click");
        originPathClick();
        destPathClick();
    });

    $("#node_del").click(function () {
        // 删除最后一个子元素
        if ($("#path_info_div").children("div").length > 1) {
            $("#path_info_div").children("div:last-child").remove();
        }
        if ($("#path_info_div").children("div").length <= 1) {
            $("#node_del").css("visibility", "hidden");
        }
    });
});