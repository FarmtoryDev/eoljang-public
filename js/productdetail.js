var productDetailResult;

var order_product_count = 1;
var product_id = 0;
var order_product_price = 0;

function onClick(name) {
    // 버튼 클릭 이벤트 모음
    switch (name) {
        case "btn-basket" :
            // 장바구니 담기
            // token 유효한지 검사해서 유효하지 않을 경우 로그인 페이지로 보내는 부분 추가 필요
            if (Accesstoken == undefined) {
                location.replace("login.html");
            } else {
                basketUpdate(DeviceId, Accesstoken, product_id, order_product_count);
            }
            break;
        case "btn-order" :
            // 주문하기 (장바구니를 거치지 않고 해당 상품만 구매)
            if (Accesstoken == undefined) {
                location.replace("login.html");
            } else {
                location.replace("order.html?basket=false&id=" + product_id + "&count=" + order_product_count);
            }
            break;
        case "btn-minus" :
            if (order_product_count > 1) {
                order_product_count--;
                refreshCount();
            } else {
                alert("최소 1개 이상 주문 가능합니다.")
            }
            break;
        case "btn-plus" :
            if (order_product_count < 99) {
                order_product_count++;
                refreshCount();
            } else {
                alert("최대 99개까지 주문 가능합니다.")
            }
            break;
        default :
            break;
    }
}

function onChange(name) {
    // input 값 수정 이벤트 모음
    switch (name) {
        case "product-select" :
            var inputCount = parseInt(document.getElementById("product-select").value);
            if (inputCount > 0 && inputCount < 100) {
                order_product_count = inputCount;
                refreshCount();
            } else if (inputCount < 0) {
                alert("최소 1개 이상 주문 가능합니다.");
                order_product_count = 1;
                refreshCount();
            } else {
                alert("최대 99개까지 주문 가능합니다.");
                order_product_count = 99;
                refreshCount();
            }
            break;
        default :
            break;
    }
}

function setContents(product_data) {
    var product_img = document.getElementById("product-img");
    var product_farmer = document.getElementById("product-farmer");
    var product_name = document.getElementById("product-name");
    var product_amount = document.getElementById("product-amount");
    var product_price = document.getElementById("product-price");
    var product_country = document.getElementById("product-country");
    var product_producer = document.getElementById("product-producer");
    var product_type = document.getElementById("product-type");
    var product_standard = document.getElementById("product-standard");
    var product_select = document.getElementById("product-select");
    var product_allprice = document.getElementById("product-allprice");
    var load_detail = document.getElementById("load-detail");

    product_array = product_data;
    order_product_price = product_array.price;

    product_img.src = product_array.thumbnail[0];
    product_farmer.innerHTML = product_array.farmer_pname + " " + product_array.farmer_name;
    product_name.innerHTML = product_array.name;
    product_amount.innerHTML = product_array.unit[0] + product_array.unit[1];
    product_price.innerHTML = numberWithCommas(order_product_price) + "원";
    product_country.innerHTML = product_array.farmer_paddress;
    product_producer.innerHTML = product_array.farmer_name;
    product_type.innerHTML = growType(product_array.farmer_growinfo);
    product_standard.innerHTML = product_array.unit[0] + product_array.unit[1];
    product_select.innerHTML = order_product_count;
    product_allprice.innerHTML = numberWithCommas(order_product_price * order_product_count) + "원";

    load_detail.innerHTML = product_array.description;
    //$("#load-detail").load("productsample.html")
    // local 파일은 불러올 수 없는 점 참고할 것
}

function growType(type) {
    // 재배정보를 타입코드에서 텍스트로 변환하는 함수
    var growArray = new Array;
    for (i = 0; i < type.length; i++) {
        var growInfo = "기타";
        switch (type[i]) {
            case 1:
                growInfo = "유기농인증";
                break;
            case 2:
                growInfo = "무농약인증";
                break;
            case 3:
                growInfo = "유기가공식품인증";
                break;
            case 4:
                growInfo = "유기축산물인증";
                break;
            case 5:
                growInfo = "무항생제인증";
                break;
            case 6:
                growInfo = "USDA";
                break;
            case 7:
                growInfo = "무농무비";
                break;
            case 8:
                growInfo = "무농저비";
                break;
            case 9:
                growInfo = "저농무비";
                break;
            case 10:
                growInfo = "저농저비";
                break;
            case 11:
                growInfo = "관행재배";
                break;
            default:
                break;
        }
        growArray.push(growInfo);
    }
    return growArray;
}

function refreshCount() {
    var product_select = document.getElementById("product-select");
    var product_allprice = document.getElementById("product-allprice");
    product_select.value = order_product_count;
    product_allprice.innerHTML = numberWithCommas(order_product_price * order_product_count) + "원";
}


function productDetail(DeviceId, productId){
    // 상품 정보 가져오기
    $.ajax({
        type: "GET",
        url: "./product/detail/" + productId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            result_data = data.data;
            productDetailResult = result_data;
            setContents(productDetailResult);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            productDetailResult = false;
        }
    });
}

function basketUpdate(DeviceId, Accesstoken, productId, count){
    // 장바구니 업데이트하기
    $.ajax({
        type: "POST",
        url: "./basket/update",
        cache:false,
        data: JSON.stringify({ "product_id": productId, "count": count}),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
            xhr.setRequestHeader("Content-Type" , "application/json");

        },
        dataType:"json",
        contentType: "application/json",
        success: function (data) {
            if (data.result) {
                // result가 true일 때만 장바구니 화면으로 이동
                location.replace("basket.html");
            } else {
                alert("장바구니를 담는 중 에러가 발생했습니다.");
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            alert("장바구니를 담는 중 에러가 발생했습니다.");
        }
    });
}

$(document).ready(function(){
    if (location.search.substring(1).length > 0) {
        var urlParams = new Array;
        for (i = 0; i < location.search.substring(1).split("&").length; i++) {
            urlParams = location.search.substring(1).split("&")[i].split("=");
            if(urlParams[0] == "index") {
                // parseInt 하지 않으면 String으로 취급되어 오류가 발생할 수 있음
                product_id = parseInt(urlParams[1]);
            }
        }
    }
    if (product_id == 0) {
        alert("상품 정보가 존재하지 않습니다.");
        history.back();
    } else {
        productDetail(DeviceId, product_id);
    }
});
