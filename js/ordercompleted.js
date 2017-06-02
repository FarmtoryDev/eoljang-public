var basketListLength, basketCount , basketProductId , basketProductInfo , PrdctFarmerName , PrdctName , PrdctPrice , PrdctThumbnail , unit_count , unit ;
var bsktLstCnt= [];
var bsktLstPid= [];
var bsktLstPInfo = [];
var PrdctUnito = [];
var PrdctUnitz = [];
var PrdctThumbnail = [];
var PrdctPrice = [];
var PrdctName = [];
var PrdctFarmerName = [];


function basketList(){

    $.ajax({
        type: "POST",
        url: "./basket/list",
        cache:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
        },
        dataType:"json",
        contentType: "application/json",
        success: function (data) {
            console.log(JSON.stringify(data));
            result_data = data.data;
            var bsktLngth = result_data.basket_list.length;

            for(i = 0 ; i < bsktLngth ; i++){
                bsktLstCnt.push( result_data.basket_list[i]["count"] );
                bsktLstPid.push( result_data.basket_list[i]["product_id"] );
                bsktLstPInfo.push( result_data.basket_list[i]["product_info"] );
                PrdctFarmerName.push( bsktLstPInfo[i].farmer_name );
                PrdctName.push( bsktLstPInfo[i].name );
                PrdctPrice.push( bsktLstPInfo[i].price );
                PrdctThumbnail.push( bsktLstPInfo[i].thumbnail[0] );
                PrdctUnitz.push( bsktLstPInfo[i].unit[0] );
                PrdctUnito.push( bsktLstPInfo[i].unit[1] );
            }





            /*
            error처리
            if(result_data != succsss){
                var returnValue = alert("에러가 났습니다.");
                document.write(returnValue);

                location.href='./main.html';

            }
            */
        },
        error: function (e) {

            /*
            error처리
            var returnValue = alert("에러가 났습니다.");
            document.write(returnValue);

            location.href='./main.html';
            */
            console.log("error");
            console.log(e);
        }
    });
}

window.onload = function () {
    basketList();
}
