$(document).ready(function () {
    var csrfToken = $("[name='csrfmiddlewaretoken']").val();


    $("#inspection_save").click(function () {
        var inspection_data = $('#inspection_form').serializeObject();
        $.ajax({
            type: "POST",
            url: "/save_inspection/",
            data: {
                inspection_data: inspection_data
            },
            success: function (data) {
                console.log(data)
            }
        })
    });
});