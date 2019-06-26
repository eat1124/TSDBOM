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
            {"data": null},
            {"data": null}
        ],

        "columnDefs": [{
            "targets": -2,
            "render": function (data, type, full) {
                var log_tag = ""
                if (full.status == "失败") {
                    var log_tag = '  <span class="fa fa-info" style="color:red;border:solid 1px;padding: 0 3px 0 3px" title="服务器没开起来"></span>'
                }
                return "<td>" + full.status + log_tag + "</td>";
            }
        }, {
            "data": null,
            "width": "100px",
            "targets": -1,
            "render": function (data, type, full) {
                var exec_tag = "<button  id='edit' title='编辑' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-primary' type='button'><i class='fa fa-edit'></i></button><button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button>"
                if ($.inArray(full.status, ['失败', '未安装']) != -1) {
                    exec_tag += "<button  id='edit' title='重装' data-toggle='modal'  data-target='#static'  class='btn btn-xs btn-info' type='button'><i class='fa fa-refresh'></i></button>"
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
        $("#code").val("");
        $("#name").val("");
        $("#remark").val("");
        $("#sign").val("");
        $("#rto").val("");
        $("#rpo").val("");
        $("#sort").val("");
        $("#process_color").val("");
    });

    $('#save').click(function () {
        var table = $('#sample_1').DataTable();

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "../process_save/",
            data:
                {
                    id: $("#id").val(),
                    code: $("#code").val(),
                    name: $("#name").val(),
                    remark: $("#remark").val(),
                    sign: $("#sign").val(),
                    rto: $("#rto").val(),
                    rpo: $("#rpo").val(),
                    sort: $("#sort").val(),
                    color: $("#process_color").val(),
                },
            success: function (data) {
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

    $('#error').click(function () {
        $(this).hide()
    })
});