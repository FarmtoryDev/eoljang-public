var productListResult = new Array;
var farmerListResult = new Array;

function onClick(name, product) {
    // 버튼 클릭 이벤트 모음
    switch (name) {
        case "product-basket" :
            // 장바구니에 담기(장바구니에 해당 물건 1개 추가)
            alert("상품을 장바구니에 담았습니다.");
            // 장바구니에 product 물건을 1개 추가하는 함수 들어갈 부분
            break;
        default :
            break;
    }
}

function productList(DeviceId){
    // 상품 목록 불러오기
    $.ajax({
        type: "GET",
        url: "./product/list",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            productListResult.push(data.data);
            addProduct(productListResult, farmerListResult);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            productListResult = false;
        }
    });
}

function farmerList(DeviceId) {
    // 농부 목록 불러오기
    $.ajax({
        type: "GET",
        url: "./farmer/list",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
        },
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            farmerListResult.push(data.data);
            productList(DeviceId);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            farmerListResult = false;
        }
    });
}

function addProduct(productListResult, farmerListResult) {
    var i = 0;
    var product_section = document.getElementById("product-section");
    var product_data = productListResult[0].products;
    var farmer_data = farmerListResult[0].farmers;
    for (key in product_data) {
        var product_info = product_data[key].info;
        var product_detail_url = "productdetail.html?index=" + key;
        var product_img_url = product_info.thumbnail[0];
        var farmer_name = farmer_data[product_info.farmer_id].info.pname + " " + farmer_data[product_info.farmer_id].info.name;
        var product_name = product_info.name;
        var product_amount = product_info.unit[0] + product_info.unit[1];
        var product_price = product_info.price;
        var product_basket = false;
        if (product_basket) {
            var product_basket_html = "<img class='product-basket product-basket-on' src='img/productlist/basket_on.png'>";
        } else {
            var product_basket_html = "<img class='product-basket product-basket-off' src='img/productlist/basket_off.png'>";
        }
        // 장바구니에 담겨있는 지 여부 확인(중간에 innerHTML을 분리하면 분리된 부분 태그를 자동으로 닫아버려서 한 번에 기입
        product_section.innerHTML += "<div class='product-container'>" +
            "<a href='" + product_detail_url + "'><img class='product-img' id='product-img" + (i + 1) + "' src='" + product_img_url + "'></a>" +
            "<div class='product-farmer-container'>" +
            "<span class='product-farmer'>" + farmer_name + "</span>" +
            "<span class='product-farmer-end'>" + "님의" + "</span></div>" +
            "<div class='product-name'>" + product_name + "</div>" +
            "<div class='product-amount'>" + product_amount + "</div>" +
            "<div class='product-price'>" + numberWithCommas(product_price) + "원" + "</div>" + product_basket_html + "</div>";
    }
    productResize();
}

function productResize () {
    var productWidth = $("#product-img1").width();
    $(".product-img").css("height", productWidth);
    $(".product-basket").css("top", productWidth);
}

window.onload = function () {
    farmerList(DeviceId);
}


$(document).ready(function(){
    $(window).resize(productResize());
});
