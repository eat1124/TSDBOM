$(document).ready(function () {
    $('#sample_1').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../rsync_hosts_data/",
        "columns": [
            {"data": "id"},
            {"data": "ip_addr"},
            {"data": "username"},
            {"data": "password"},
            {"data": "server_status"},
            {"data": null},
            {"data": null},
        ],

        "columnDefs": [{
            "targets": -2,
            "render": function (data, type, full) {
                var log_tag = ""
                if (full.install_status == "失败") {
                    var log_tag = '  <span class="fa fa-info" style="color:red;border:solid 1px;padding: 0 3px 0 3px" title="' + full.log + '"></span>'
                }
                return "<td>" + full.install_status + log_tag + "</td>";
            }
        }, {
            "data": null,
            "width": "100px",
            "targets": -1,
            "render": function (data, type, full) {
                // 什么时候需要重装：开启and未安装/失败
                var exec_tag = "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-edit'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>"
                if ($.inArray(full.install_status, ['失败', '未安装']) != -1 && full.server_status == '开启') {
                    exec_tag += "<button  id='reinstall' title='重装' class='btn btn-xs btn-info' type='button'><i class='fa fa-refresh'></i></button>"
                }
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
                url: "../rsync_host_del/",
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
        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $("#id").val(data.process_id);
        $("#ip_addr").val(data.ip_addr);
        $("#username").val(data.username);
        $("#password").val(data.password);
    });

    $("#new").click(function () {
        $("#id").val("0");
        $("#ip_addr").val("");
        $("#username").val("");
        $("#password").val("");

    });

    $('#save').click(function () {
        $("#rsync_loading").show();

        var table = $('#sample_1').DataTable();
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "../rsync_hosts_save/",
            data:
                {
                    id: $("#id").val(),
                    ip_addr: $("#ip_addr").val(),
                    username: $("#username").val(),
                    password: $("#password").val(),
                },
            success: function (data) {
                $("#rsync_loading").hide();
                var myres = data["res"];
                var mydata = data["data"];
                if (myres == "保存成功。") {
                    $("#id").val(data["data"]);
                    $('#static').modal('hide');
                    table.ajax.reload();
                }
                alert(myres);
            },
            error: function (e) {
                alert("页面出现错误，请于管理员联系。");
            }
        });
    })

    // 重新安装
    $('#sample_1 tbody').on('click', 'button#reinstall', function () {
        alert(1)
        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $.ajax({
            type: "POST",
            url: "../rsync_reinstall/",
            data:
                {
                    id: data.id,
                },
            success: function (data) {
                table.ajax.reload();
                alert(data.data)
            },
            error: function (e) {
                alert("安装失败，请于管理员联系。");
            }
        });
    });

    $('#error').click(function () {
        $(this).hide()
    })
});