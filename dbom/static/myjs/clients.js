$('#sample_1').dataTable({
    "bAutoWidth": true,
    "bSort": false,
    "bProcessing": true,
    "ajax": "../clients_data/",
    "columns": [
        {"data": "id"},
        {"data": "client_name"},
        {"data": "address"},
        {"data": "contact"},
        {"data": "position"},
        {"data": "tel"},
        {"data": "fax"},
        {"data": "email"},
        {"data": null}
    ],

    "columnDefs": [{
        "targets": -1,
        "data": null,
        "width": "100px",
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
$('#sample_1 tbody').on('click', 'button#delrow', function () {
    if (confirm("确定要删除该条数据？")) {
        var table = $('#sample_1').DataTable();
        var data = table.row($(this).parents('tr')).data();
        $.ajax({
            type: "POST",
            url: "../client_data_del/",
            data:
                {
                    id: data.id
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
    $("#id").val(data.id);
    $("#client_name").val(data.client_name);
    $("#address").val(data.address);
    $("#contact").val(data.contact);
    $("#position").val(data.position);
    $("#tel").val(data.tel);
    $("#fax").val(data.fax);
    $("#email").val(data.email);
});

$("#new").click(function () {
    $("#id").val("0");
    $("#client_name").val("");
    $("#address").val("");
    $("#contact").val("");
    $("#position").val("");
    $("#tel").val("");
    $("#fax").val("");
    $("#email").val("");
});    
$('#save').click(function () {
    var table = $('#sample_1').DataTable();

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "../client_data_save/",
        data:
            {
                id: $("#id").val(),
                client_name: $("#client_name").val(),
                address: $("#address").val(),
                contact: $("#contact").val(),
                position: $("#position").val(),
                tel: $("#tel").val(),
                fax: $("#fax").val(),
                email: $("#email").val(),
            },
        success: function (data) {
            if (data.ret == 1) {
                $('#static').modal('hide');
                table.ajax.reload();
            } 
            alert(data.data);
        },
        error: function (e) {
            alert("页面出现错误，请于管理员联系。");
        }
    });
});