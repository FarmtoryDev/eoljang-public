var farmerListResult = new Array;
var NUMBER_OF_FARMER = 10;
var NUMBER_OF_PRODUCTS = 4;
var carousel;

function onClick(name, target) {
    switch (name) {
        case "btn-farmer":
            for (i = 1; i <= NUMBER_OF_FARMER; i++) {
                var farmerId = "farmer" + i;
                var farmerContainer = document.getElementById(farmerId);
                farmerContainer.style.filter = "grayscale(1)";
                farmerContainer.style.zIndex = "0";
            }
            var targetId = "farmer" + target;
            var targetContainter = document.getElementById(targetId);
            targetContainter.style.filter = "grayscale(0)";
            targetContainter.style.zIndex = "1";
            addProduct(target);
            carousel.gotoSlide((target - 1));
            break;
        case "btn-story":
            // location.replace()를 사용할 경우 히스토리에 남지 않으므로 구분해서 사용할 것(만료된 페이지 처리를 위해서는 replace 사용)
            location.href = "farmer.html?index=" + target;
            break;
        default:
            break;
    }
}

function farmerList(DeviceId) {
    // 농부 목록 불러오기
    $.ajax({
        type: "GET",
        url: "https://api.eoljang.com/farmer/list",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
        },
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            farmerListResult.push(data.data);
            addFarm();
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            farmerListResult = false;
        }
    });
}

function addFarm() {
    var scrolling_section = document.getElementById("scrolling-section");
    var farmer_data = farmerListResult[0].farmers;
    NUMBER_OF_FARMER = Object.keys(farmer_data).length;
    for (i = 1; i <= NUMBER_OF_FARMER; i++) {
        var farmer_info = farmer_data[i].info;
        var farmer_info_profileimg = farmer_info.profileimg;
        var farmer_info_paddress = farmer_info.paddress;
        var farmer_info_pname = farmer_info.pname;
        var farmer_info_name = farmer_info.name;
        scrolling_section.innerHTML += "<li class='farmer-container clickable' id='farmer" + i + "' onclick='onClick(\"btn-farmer\", " + i + ")'>" +
            "<div class='farmer-imgbox'><img class='farmer-img' src='" + farmer_info_profileimg + "'></div>" +
            "<div class='farmer-info'><div class='table-country'><div class='farm-country'>" + farmer_info_paddress +
            "</div></div>" +
            "<div class='farm-name'>" + farmer_info_pname + "</div>" +
            "<div class='farmer-name-container'><span class='farmer-name'>" + farmer_info_name + "</span>" +
            "<span class='farmer-name-end'>농부님</span></div></div></li>";
    }
    carousel = $("#scrolling-section");
    carousel.itemslide();
    if (NUMBER_OF_FARMER >= 5) {
        onClick("btn-farmer", 5);
    } else {
        onClick("btn-farmer", NUMBER_OF_FARMER);
    }
}

// <div class="farmer-container" id="farmer11">
//     <div class="farmer-imgbox">
//     <img class="farmer-img" src="img/main/farmer_ex10.jpg">
//     </div>
//     <div class="farmer-info">
//     <div class="table-country">
//     <div class="farm-country">
//     충북 음성
// </div>
// </div>
// <div class="farm-name">
//     산과들농장
//     </div>
//     <div class="farmer-name-container">
//     <span class="farmer-name">
//     이옥순 농부
// </span>
// <span class="farmer-name-end">
//     님
//     </span>
//     </div>
//     </div>
//     </div>

function addProduct(farmer) {
    var product_section = document.getElementById("product-section");
    product_section.innerHTML = "";
    var farmer_data = farmerListResult[0].farmers;
    var farmer_info = farmer_data[farmer].info;
    var farmer_info_pname = farmer_info.pname;
    var farmer_info_name = farmer_info.name;
    var product_info = farmer_data[farmer].products;
    NUMBER_OF_PRODUCTS = Object.keys(product_info).length;
    if (NUMBER_OF_PRODUCTS != 0) {
        for (key in product_info) {
            var product_div = document.createElement("div");
            var product_info_thumbnail = product_info[key].thumbnail;
            var product_detail_url = "productdetail.html?index=" + key;
            var product_info_name = product_info[key].name;
            var product_amount = product_info[key].unit[0] + product_info[key].unit[1];
            var product_info_price = product_info[key].price;
            product_div.id = "product" + key;
            product_div.className = "product-container";
            product_div.innerHTML += "<a href='" + product_detail_url + "'><img class='product-img' id='product-img" + key + "' src='" + product_info_thumbnail + "'></a>" +
                "<div class='product-farmer-container'>" +
                "<span class='product-farmer'>" + farmer_info_pname + " " + farmer_info_name + "</span>" +
                "<span class='product-farmer-end'>" + "농부님의" + "</span></div>" +
                "<div class='product-name'>" + product_info_name + "</div>" +
                "<div class='product-amount'>" + product_amount + "</div>" +
                "<div class='product-price'>" + numberWithCommas(product_info_price) + "원" + "</div>" +
                "</div>";
            product_section.appendChild(product_div);
            productResize();
        }
    } else {
        // 상품이 하나도 없을 경우
        product_section.innerHTML += "<div class='notice-text'>얼장에서 만나요!</div>";
    }
    //modifySize();
    product_section.innerHTML += "<img id='btn-story' src='img/main/btn_story.png' class='clickable' onclick='onClick(\"btn-story\", " + farmer + ")'>";
}
/*
function modifySize() {
    var containerHeight = document.getElementById("farmer2").clientHeight;
    var FOCUS_TOP_RATIO = 14;//7.31;
    document.getElementById("farmer-section-mobile").style.height = containerHeight + "px";
    document.getElementById("farmer-focus").style.top = "-" + (containerHeight * FOCUS_TOP_RATIO / 100) + "px";
}
*/

function productResize () {
    if (document.getElementById("product-img1") != null) {
        var productWidth = $("#product-img1").width();
        $(".product-img").css("height", productWidth);
    }
}

$(window).load(function () {
    $("#nav-main>a").css("color", "#4fb9ab");
    farmerList(DeviceId);
});

$(document).ready(function(){
    $(window).resize(productResize());
    //$(window).resize(modifySize())
});
