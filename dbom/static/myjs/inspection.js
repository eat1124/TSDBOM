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
});