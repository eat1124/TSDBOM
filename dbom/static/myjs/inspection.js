$(document).ready(function() {
    var csrfToken = $("[name='csrfmiddlewaretoken']").val();

    // $('#client_name').select2();
    $('#client_name').change(function(){
        var client_id = $(this).val();
        $.ajax({
            type: "POST",
            url: "../get_client_data/",
            data: {
                "client_id":client_id,
                "csrfmiddlewaretoken": csrfToken,
            },
            success: function (data) {
                if (data.ret==1){
                    $("#address").val(data.data.address);
                    $("#contact").val(data.data.contact);
                    $("#position").val(data.data.position);
                    $("#tel").val(data.data.tel);
                    $("#fax").val(data.data.fax);
                    $("#email").val(data.data.email);
                } else{
                    alert(data.data)
                }

            }
        })
    });

    $('#startdate').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $('#enddate').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $('#inspection_date').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    $('#next_inspection_date').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        startView: 2,
        minView: 2,
    });
    next_inspection_date
    $("#inspection_save").click(function() {
        var inspection_data = $('#inspection_form').serializeObject();
        $.ajax({
            type: "POST",
            url: "/save_inspection/",
            data: {
                inspection_data: inspection_data
            },
            success: function(data) {
                console.log(data)
            }
        })
    });
});