var productListResult = new Array;
var farmerListResult = new Array;
var farmerDetailResult = new Array;
var farmer_id;

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
/*
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
*/
function farmerList(DeviceId) {
    // 농부 목록 불러오기
    $.ajax({
        type: "GET",
        url: apiHost + "farmer/list",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
        },
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            farmerListResult.push(data.data);
            addProduct(farmer_id);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            farmerListResult = false;
        }
    });
}

function farmerDetail(DeviceId, farmer_id) {
    // 농부 목록 불러오기
    $.ajax({
        type: "GET",
        url: apiHost + "farmer/detail/" + farmer_id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
        },
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            if (data.result) {
                farmerDetailResult.push(data.data);
                setFarmerDetail(farmerDetailResult);
            } else {
                console.log("error");
                console.log(data);
                alert("농장 정보가 존재하지 않습니다.");
                history.back();
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            alert("농장 정보가 존재하지 않습니다.");
            history.back();
        }
    });
}

function setFarmerDetail(farmerDetailResult) {
    document.getElementById("banner1").src = farmerDetailResult[0].info.pbgimg;
    document.getElementById("farmer_thumbnail").src = farmerDetailResult[0].info.profileimg;
    document.getElementById("profile-text-container1").innerHTML = farmerDetailResult[0].info.paddress;
    document.getElementById("profile-adress-container1").innerHTML = farmerDetailResult[0].info.pname;
    document.getElementById("profile-name-container1").innerHTML = farmerDetailResult[0].info.name + " 농부님";
    document.getElementById("profile-context-container1").innerHTML = farmerDetailResult[0].info.pinfo;

}
/*
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
*/
function addProduct(farmer) {
    var product_section = document.getElementById("product-section");
    product_section.innerHTML = "";
    var farmer_data = farmerListResult[0].farmers;
    var farmer_info = farmer_data[farmer].info;
    var farmer_info_pname = farmer_info.pname;
    var farmer_info_name = farmer_info.name;
    var product_info = farmer_data[farmer].products;
    if (Object.keys(product_info).length != 0) {
        for (key in product_info) {
            var product_div = document.createElement("div");
            var product_info_thumbnail = product_info[key].thumbnail;
            var product_detail_url = "productdetail.html?index=" + key;
            var product_info_name = product_info[key].name;
            var product_amount = product_info[key].unit[0] + product_info[key].unit[1];
            var product_info_price = product_info[key].price;
            var product_basket = false;
            if (product_basket) {
                var product_basket_html = "<img class='product-basket product-basket-on' src='img/productlist/basket_on.png'>";
            } else {
                var product_basket_html = "<img class='product-basket product-basket-off' src='img/productlist/basket_off.png'>";
            }
            product_div.id = "product" + key;
            product_div.className = "product-container";
            product_div.innerHTML += "<a href='" + product_detail_url + "'><img class='product-img' id='product-img" + key + "' src='" + product_info_thumbnail + "'></a>" +
                "<div class='product-farmer-container'>" +
                "<span class='product-farmer'>" + farmer_info_pname + " " + farmer_info_name + "</span>" +
                "<span class='product-farmer-end'>" + "님의" + "</span></div>" +
                "<div class='product-name'>" + product_info_name + "</div>" +
                "<div class='product-amount'>" + product_amount + "</div>" +
                "<div class='product-price'>" + numberWithCommas(product_info_price) + "원" + "</div>" + product_basket_html +
                "</div>";
            product_section.appendChild(product_div);
            productResize();
        }
    } else {
        // 상품이 하나도 없을 경우
        product_section.innerHTML += "<div class='notice-text'>얼장에서 만나요!</div>";
    }
}

function shortAddress(org_addr) {
    for (i = 0; i < org_addr.split(" ").length; i++) {
        var province = org_addr.split(" ")[0];
        var city = org_addr.split(" ")[1];
        var extracter;
        switch (province) { // 도 check
            case "경기도":
                province = "경기";
                break;
            case "강원도":
                province = "강원";
                break;
            case "충청북도":
                province = "충북";
                break;
            case "충청남도":
                province = "충남";
                break;
            case "경상북도":
                province = "경북";
                break;
            case "경상남도":
                province = "경남";
                break;
            case "전라북도":
                province = "전북";
                break;
            case "전라남도":
                province = "전남";
                break;
            case "서울특별시":
                province = "서울";
            default:
                /*extracter = /(.+)[광][역][시]/;
                if (extracter.match(province)) {
                    province = extracter.search(province);
                }*/
                break;
        }
    }

}

function productResize () {
    var productWidth = $("#product-img1").width();
    $(".product-img").css("height", productWidth);
    $(".product-basket").css("top", productWidth);
}

$(document).ready(function(){
    if (location.search.substring(1).length > 0) {
        var urlParams = new Array;
        for (i = 0; i < location.search.substring(1).split("&").length; i++) {
            urlParams = location.search.substring(1).split("&")[i].split("=");
            if(urlParams[0] == "index") {
                // parseInt 하지 않으면 String으로 취급되어 오류가 발생할 수 있음
                farmer_id = parseInt(urlParams[1]);
            }
        }
    }
    if (farmer_id == 0) {
        alert("농장 정보가 존재하지 않습니다.");
        history.back();
    } else {
        farmerDetail(DeviceId, farmer_id);
    }
    farmerList(DeviceId);
    $(window).resize(productResize());
});
