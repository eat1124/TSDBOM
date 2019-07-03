$(document).ready(function () {
    $('#sample_1').dataTable({
        "bAutoWidth": true,
        "bSort": false,
        "bProcessing": true,
        "ajax": "../rsync_history_data?startdate=" + $('#startdate').val() + "&enddate=" + $('#enddate').val(),
        "columns": [
            {"data": "rsync_history_id"},
            {"data": "main_host"},
            {"data": "backup_host"},
            {"data": "start_time"},
            {"data": "end_time"},
            {"data": "status"},
            {"data": "rsync_log"},
            {"data": null},
        ],
        "columnDefs": [{
            "targets": -1,  // 指定最后一列添加按钮；
            "data": null,
            "render": function (data, type, full) {
                return "<button title='删除'  id='delrow' class='btn btn-xs btn-primary' type='button'><i class='fa fa-trash-o'></i></button></td>"
            }
        }],

        "oLanguage": {
            "sLengthMenu": "&nbsp;&nbsp;每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉， 没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": '',
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
    $('#sample_1 tbody').on('click', 'button#delrow', function () {
        if (confirm("确定要删除该条数据？")) {
            var table = $('#sample_1').DataTable();
            var data = table.row($(this).parents('tr')).data();
            $.ajax({
                type: "POST",
                url: "../../rsync_history_del/",
                data:
                    {
                        rsync_history_id: data.rsync_history_id
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

    $('#startdate').datetimepicker({
        autoclose: true,
        minView: "month",
        format: 'yyyy-mm-dd',
    });
    $('#enddate').datetimepicker({
        autoclose: true,
        minView: "month",
        format: 'yyyy-mm-dd',
    });
    $('#cx').click(function () {
        var table = $('#sample_1').DataTable();
        table.ajax.url("../rsync_history_data?startdate=" + $('#startdate').val() + "&enddate=" + $('#enddate').val()).load();
    })

});