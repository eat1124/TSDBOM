$(document).ready(function () {
    var csrfToken = $("[name='csrfmiddlewaretoken']").val();
    var get_pk = 1;
    $("#client_name").editable({
        pk: get_pk,
        url: '/save_inspection/',
        title: '请输入客户名',
        success: function (response, new_value) {
            if (response.status == 'error') {
                return response.msg;
            }
        }
    });
    $("#inspection_date").editable({
        pk: get_pk,
        url: '/save_inspection/',
        title: '请输入巡检时间',
        success: function (response, new_value) {
            if (response.status == 'error') {
                return response.msg;
            }
        }
    });
    $("#position").editable({
        pk: get_pk,
        url: '/save_inspection/',
        title: '请输入职位',
        placeholder:"职位",
        value: "未填写",
        success: function (response, new_value) {
            if (response.status == 'error') {
                return response.msg;
            }
        }
    });
    $('#hardware').editable({
        pk: get_pk,
        url: '/save_inspection/',
        title: '请选择是否有硬件故障',
        value: 1,
        source: [
            {value: 1, text: '是'},
            {value: 2, text: '否'},
        ],
        success: function (response, new_value) {
            if (response.status == 'error') {
                return response.msg;
            }
        }
    });
    $('#suggestion').editable({
        pk: get_pk,
        url: '/save_inspection/',
        title: '请输入建议与总结',
        value: "请输入..."
    });
});