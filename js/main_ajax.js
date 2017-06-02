var farmer_info_name_Arr = [];
var farmer_info_paddress = [];
var farmer_info_panme = [];
var farmer_info_profileimg = [];
var farmers_products_name = [];
var farmers_products_thumbnail = [];
var farmers_products_price = [];

var farmers_products_name = [];
var farmers_products_thumbnail = [];
var farmers_products_price = [];
var farmers_products_unit = [];

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


            for( var i = 1 ; i < farmerlength+1 ; i++){

                farmer_info_name_Arr.push( result_data.farmers[i].info.name );
                farmer_info_paddress.push( result_data.farmers[i].info.paddress );
                farmer_info_panme.push( result_data.farmers[i].info.pname );
                farmer_info_profileimg.push( result_data.farmers[i].info.profileimg );

                var farmer_products_length = Object.keys(result_data.farmers[i].products).length;
                // console.log("farmer_products_length는", farmer_products_length);
                for(var j = 1 ; j < farmer_products_length+1 ; j ++){

                    farmers_products_name.push( result_data.farmers[i].products[j]["name"] );
                    farmers_products_thumbnail.push( result_data.farmers[i].products[j]["thumbnail"] );
                    farmers_products_price.push( result_data.farmers[i].products[j]["price"] );
                    farmers_products_unit.push( result_data.farmers[i].products[j]["unit"] );

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



function addProduct() {



    var i = 0;
    var product_img_url = [
        "./img/main/product_ex1.jpg",
        "./img/main/product_ex2.jpg",
        "./img/main/product_ex3.jpg",
        "./img/main/product_ex4.jpg"
    ]
    var farmer_name = ["새아침농장 노환표농부", "새아침농장 노환표농부", "새아침농장 노환표농부", "새아침농장 노환표농부"];
    var product_name = ["동결건조 딸기칩", "동결건조 사과칩", "동결건조 배칩", "동결건조 단감칩"];
    var product_amount = ["25g", "30g", "30g", "30g"];
    var product_price = [5000, 5000, 5000, 5000];
    for (i = 0; i < 4; i++) {
        var product_div = document.createElement("div");
        product_div.id = "product" + (i + 1);
        product_div.className = "product-container";
        product_div.innerHTML += "<img class='product-img' src='" + product_img_url[i] + "'> " +
            "<div class='product-farmer-container'>" +
            "<span class='product-farmer'>" + farmer_name[i] + "</span>" +
            "<span class='product-farmer-end'>" + "님의" + "</span></div>" +
            "<div class='product-name'>" + product_name[i] + "</div>" +
            "<div class='product-amount'>" + product_amount[i] + "</div>" +
            "<div class='product-price'>" + product_price[i] + "원" + "</div>" +
            "</div>";
        document.getElementById("product-section").appendChild(product_div);
    }
}

function modifySize() {
    var containerHeight = document.getElementById("farmer2").clientHeight;
    var FOCUS_TOP_RATIO = 7.31;
    document.getElementById("farmer-section").style.height = containerHeight + "px";
    document.getElementById("farmer-focus").style.top = "-" + (containerHeight * FOCUS_TOP_RATIO / 100) + "px";
}

function order_query(){
    var DeviceId = '10259273-4a1a-e95b-b29b-4ba0ba47a352';
    var Accesstoken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJleHAiOiIxNDkxODE5MDk3IiwiYXVkIjoiMTAyNTkyNzMtNGExYS1lOTViLWIyOWItNGJhMGJhNDdhMzUyIiwidXNlcmluZm8iOnsic2F2ZWRpbmZvIjp7fSwibmlja25hbWUiOiJcdWQxNGNcdWMyYTRcdWQyYjgiLCJpZCI6OTk5LCJzb2NpYWwiOjF9LCJpYXQiOiIxNDkwNjA5NDk3IiwiaXNzIjoiZW9samFuZ19zZXJ2ZXIiLCJzdWIiOiJsb2dpbnNlc3Npb24ifQ.QjVT950Yg0Q7Cyo-QpLsOLciXQUYMuAqDyGSWABMrmcFNpUFjTHm4TicX-a9pdA4';

    $.ajax({
        type: "POST",
        url: "https://api.eoljang.com/order/query",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
            xhr.setRequestHeader("content-type" , "application/x-www-form-urlencoded");
        },
        "data": {
          "type": "0"
        },
        success: function (data) {
            // console.log(JSON.stringify(data));
            var result_data = data.data;
            var message = data.message;

            var Arr = [];
            var Arr2 = [];

            function objToArr(obj, new_arr , new_arr2){
                for(var key in obj){
                    if(typeof obj[key]=='object'){
                        objToArr(obj[key], new_arr);
                    }else{
                        new_arr.push(obj[key]);
                        new_arr2.push(key);
                    }
                }
                return new_arr;
            };


            console.log("Arr", Arr);
            console.log("Arr2", Arr2);

            var orders = result_data.orders;
            //시킨 물건들
            //orders의 length구하면 주문 몇번 했는지 알 수있다.
            var bought_items = orders[0].bought_items;
            var BoughtItemsCheck = [ "bought_items"];
            if( orders[0].BoughtItemCheck != undefined ){
                var resultArr = [];
                objToArr( orders[0].BoughtItemCheck, resultArr);

                console.log(resultArr);




            }else {
                orders[0].BoughtItemCheck

            }


            objToArr( bought_items , Arr, Arr2);

            console.log( Arr );
            console.log( Arr2 );

            var bought_items = [ "bought_items"];

            console.log();
            orders[0]






            var BoughtItemsSize = Object.keys(bought_items).length;
            console.log("sizenew는", BoughtItemsSize);
            var OrderByDetail = orders[0].order_by_detail;
            console.log("OrderByDetail은 ",OrderByDetail);



            console.log(OrderByDetail.address);
            //못찾음
            console.log(OrderByDetail.email);
            console.log(OrderByDetail.name);
            console.log(OrderByDetail.phone);


            console.log(orders.pdate);
            console.log(orders.state);
            console.log(orders.type);





        },
        error: function (e) {
            console.log("error");
            console.log(e);
        },

        complete: function () {

            console.log("hi");

        }

    });
}

// var sixarray_list = ["1"];
//
//
// function farmer_detail(){
//     var DeviceId = '10259273-4a1a-e95b-b29b-4ba0ba47a352';
//
//     $.ajax({
//         type: "GET",
//         url: "./farmer/detail/"+sixarray_list[0],
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("X-Device-Id" , DeviceId);
//         },
//         dataType:"json",
//         cache:false,
//         contentType: "application/json",
//         success: function (data) {
//             // console.log(JSON.stringify(data));
//             /* 결과값 */
//             result_data = data.data;
//
//
//             console.log("result_data.info",result_data.info);
//             console.log(result_data.products);
//
//             //object로 왔고
//             console.log(result_data.info.name);
//             console.log(result_data.info.peddress);
//             console.log(result_data.info.pbgimg);
//             console.log(result_data.info.pcontact);
//
//
//             console.log(result_data.products["2"].name);
//             // 농부이름
//             console.log(result_data.products["2"].thumbnail);
//
//             /*
//             sessionStorage.setItem('accesstoken', result_data.accesstoken);
//             sessionStorage.setItem('email', result_data.email);
//             sessionStorage.setItem('expire', result_data.expire);
//             */
//             /*sessionStorage에 넣는 것 확인하는 코드
//                 var data = sessionStorage.getItem('email');
//                 console.log(data);
//             */
//         },
//         error: function (e) {
//             console.log("error");
//             console.log(e);
//         }
//         /*,
//         complete: function () {
//             var parentWindow = window.opener;
//             parentWindow.location.href = './main.html'
//         }
//         */
//     });
// }


window.onload = function () {
    addProduct();
    modifySize();
    farmerList();
    order_query();
    // farmer_detail()
}

$(document).ready(function(){
    $(window).resize(modifySize())
});
