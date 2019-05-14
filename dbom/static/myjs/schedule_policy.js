$(document).ready(function () {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../get_schedule_policy/',
        data: {
            "csrfmiddlewaretoken": $("[name='csrfmiddlewaretoken']").val(),
        },
        success: function (data) {
            if (data.ret == 0) {
                alert(data.data)
            } else {
                // 加载数据
                var schedule_data = data.data;
                var schedule_el = ""
                var schedule_tag_one = ""
                for (var i = 0; i < schedule_data.length; i++) {
                    schedule_el += "<tr>"
                    schedule_el += "<td>" + (i + 1) + "</td>"
                    for (var key in schedule_data[i]) {
                        schedule_el += "<td>" + schedule_data[i][key] + "</td>"
                    }


                    schedule_el += "</tr>"

                }
                $("tbody").append(schedule_el)

                // $("tbody").append("你好")

            }
        }
    })
});