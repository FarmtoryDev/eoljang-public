var farmer_info_name_Arr = [];
var farmer_info_paddress = [];


function farmerList(){
    var DeviceId = '10259273-4a1a-e95b-b29b-4ba0ba47a352';
    $.ajax({
        type: "GET",
        url: "https://api.eoljang.com/farmer/list",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        cache:false,
        contentType: "application/json",
        success: function (data) {
            // console.log(JSON.stringify(data));
            var result_data = data.data;
            //object로 왔고
            console.log(result_data.farmers["1"]);
            var farmerlength = Object.keys(result_data.farmers).length;
            console.log("farmerlength는", farmerlength);


            for( var i = 1 ; i < farmerlength ; i++){
                console.log("i값",i);
                console.log(result_data.farmers[i].info.name);
                console.log(result_data.farmers[i].info.paddress);
                console.log(result_data.farmers[i].info.pname);
                console.log(result_data.farmers[i].info.profileimg);
                console.log("--------------------------------------");
                var farmer_products_length = Object.keys(result_data.farmers[i].products).length;
                console.log("farmer_products_length는", farmer_products_length);

                for(var j = 1 ; j < farmer_products_length ; j ++){
                    console.log(result_data.farmers[i].products[j].name);
                    console.log(result_data.farmers[i].products[j].unit);

                }

            }




            // console.log(result_data.products["2"].name);
            // // 농부이름
            // console.log(result_data.products["2"].thumbnail);
            //
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
    farmerList();
}
