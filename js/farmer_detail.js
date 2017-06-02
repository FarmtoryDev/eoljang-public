var sixarray_list = ["1"];


function farmer_detail(){
    var DeviceId = '10259273-4a1a-e95b-b29b-4ba0ba47a352';

    $.ajax({
        type: "GET",
        url: "https://api.eoljang.com/farmer/detail/"+sixarray_list[0],
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        cache:false,
        contentType: "application/json",
        success: function (data) {
            // console.log(JSON.stringify(data));
            /* 결과값 */
            result_data = data.data;

            $.each( result_data , function( key, value ) {
              console.log( key + ": " + value );
            });

            /*
            console.log(result_data.info);
            console.log(result_data.products);
            */
            //object로 왔고
            console.log(result_data.info.name);
            console.log(result_data.info.peddress);
            console.log(result_data.info.pbgimg);
            console.log(result_data.info.pcontact);


            console.log(result_data.products["2"].name);
            // 농부이름
            console.log(result_data.products["2"].thumbnail);

            /*
            sessionStorage.setItem('accesstoken', result_data.accesstoken);
            sessionStorage.setItem('email', result_data.email);
            sessionStorage.setItem('expire', result_data.expire);
            */
            /*sessionStorage에 넣는 것 확인하는 코드
                var data = sessionStorage.getItem('email');
                console.log(data);
            */
        },
        error: function (e) {
            console.log("error");
            console.log(e);
        }
        /*,
        complete: function () {
            var parentWindow = window.opener;
            parentWindow.location.href = './main.html'
        }
        */
    });
}


window.onload = function () {
    farmer_detail();
}
