var order_product_count = new Array;
var order_farm = new Array;
var order_farmer_name = new Array;
var order_farmer_img = new Array;
var order_product_id = new Array;
var order_product_name = new Array;
var order_product_amount = new Array;
var order_product_price = new Array;
var order_product_allprice = new Array;
var grouping_farmer = new Array; // 배송비 계산 및 농부별 모음 정렬을 위한 농부별 그룹화
var grouping_farm = new Array; // 농장 이름 대응
var order_basket_list = new Array;
var grouping_basket_list = new Array;
var sum_allprice = 0; // 배송비 제외 총 상품 금액
var shipping = 0; // 배송비
var orderprice = 0; // 배송비 포함 총 결제 금액
var SHIPPING_UNIT = 3000; // 배송비 단위
var ordertype = 2; // 배송 방식 : pre-order가 1, 배송 주문이 2
var delete_count = -1; // 장바구니 물품 삭제 때 사용되는 변수, -1일 때는 변수 비사용 상태

//basket update 하는 함수
/*
 function basketUpdate(DeviceId, Accesstoken, contentType){

 $.ajax({
 type: "POST",
 url: "./basket/update",
 cache:false,
 data: JSON.stringify({ "product_id": product_id, "count": count }),
 beforeSend: function (xhr) {
 xhr.setRequestHeader("X-Device-Id" , DeviceId);
 xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
 xhr.setRequestHeader("Content-Type" , contentType);

 },
 dataType:"json",
 contentType: "application/json",
 success: function (data) {
 console.log(JSON.stringify(data));
 // 결과값



 //error처리
 if(result_data != succsss){
 var returnValue = alert("에러가 났습니다.");
 document.write(returnValue);
 location.href='./main.html';
 }

 },
 error: function (e) {


 //error처리
 var returnValue = alert("에러가 났습니다.");
 document.write(returnValue);
 location.href='./main.html';

 console.log("error");
 console.log(e);
 }
 });
 }
 */

function onClick(name, target) {
    // 버튼 클릭 이벤트 모음
    switch (name) {
        case "btn-checkdelete" :
            // 선택 항목 삭제
            var productCheckbox = document.getElementsByName("product");
            delete_count = 0;
            var checkedProduct = new Array;
            for(i = 0; i < productCheckbox.length; i++) {
                if (productCheckbox[i].checked) {
                    delete_count++;
                    checkedProduct.push(productCheckbox[i].value);
                }
            }
            for(i = 0; i < checkedProduct.length; i++) {
                var deleteTarget = order_product_id[checkedProduct[i]];
                basketUpdate(DeviceId, Accesstoken, deleteTarget, -1000);
            }
            loadBasket(DeviceId, Accesstoken);
            break;
        case "btn-back" :
            // 상품 목록으로 돌아가기
            location.replace("productlist.html");
            break;
        case "btn-confirm" :
            // 주문자 정보 입력 및 결제
            location.replace("order.html?basket=true&ordertype=" + ordertype);
            break;
        case "btn-minus" :
            if (order_product_count[target] > 1) {
                order_product_count[target]--;
                basketUpdate(DeviceId, Accesstoken, order_product_id[target], -1);
                //basketUpdate(DeviceId, Accesstoken, order_product_id[target], order_product_count[target]);
            } else {
                var deleteConfirm = confirm("해당 상품을 장바구니에서 삭제하시겠습니까?");
                if (deleteConfirm) {
                    basketUpdate(DeviceId, Accesstoken, order_product_id[target], -1000);
                }
            }
            break;
        case "btn-plus" :
            if (order_product_count[target] < 99) {
                order_product_count[target]++;
                basketUpdate(DeviceId, Accesstoken, order_product_id[target], 1);
                //basketUpdate(DeviceId, Accesstoken, order_product_id[target], order_product_count[target]);
            } else {
                alert("최대 99개까지 주문 가능합니다.")
            }
            break;
        default :
            break;
    }

}

function loadBasket(DeviceId, Accesstoken) {
    // 장바구니 목록 불러오기
    var basket_data = new Array;
    // 변수 초기화
    order_product_count = new Array;
    order_farm = new Array;
    order_farmer_name = new Array;
    order_farmer_img = new Array;
    order_product_id = new Array;
    order_product_name = new Array;
    order_product_amount = new Array;
    order_product_price = new Array;
    order_product_allprice = new Array;
    grouping_farmer = new Array;
    order_basket_list = new Array;
    grouping_basket_list = new Array;
    sum_allprice = 0;
    shipping = 0;
    orderprice = 0;
    $.ajax({
        type: "POST",
        url: "https://api.eoljang.com/basket/list",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token", Accesstoken);
        },
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.result) {
                basket_data.push(data.data);
                farmerGrouping(basket_data);
            } else {
                alert("장바구니 목록을 불러오는 중 에러가 발생했습니다.");
                //history.back();
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            alert("장바구니 목록을 불러오는 중 에러가 발생했습니다.");
            history.back();
        }
    });
}


function basketUpdate(DeviceId, Accesstoken, productId, count){
    // 장바구니 업데이트하기(count만큼 장바구니 개수에 추가되는 것으로 변경됨)
    $.ajax({
        type: "POST",
        url: "https://api.eoljang.com/basket/update",
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
            if (count != -1000) {
                // 상품 개수 수정 시에는 수량만 다시 불러오기
                makeOrder(false);
            } else {
                // 상품 삭제 시 상품 개수만큼 삭제가 완료되면 장바구니 목록 전체 다시 불러오기
                delete_count--;
                if (delete_count == 0) {
                    delete_count = -1;
                }
                loadBasket(DeviceId, Accesstoken);
            }
            console.log("basketUpdate");
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            alert("장바구니를 수정하는 중 에러가 발생했습니다.");
        }
    });
}

function allSelect() {
    // 체크박스 전체 선택 jQuery 함수
    $("#allcheck").click(function () {
        if($("#allcheck").prop("checked")) {
            $("input[name = product]").prop("checked", true);

        } else {
            $("input[name = product]").prop("checked", false);
        }
    });
    $("#allcheck-mobile").click(function () {
        if($("#allcheck-mobile").prop("checked")) {
            $("input[name = product]").prop("checked", true);
        } else {
            $("input[name = product]").prop("checked", false);
        }
    });
    $("input[name = product]").each(function () {
        $(this).click(function () {
            // 체크할 때 체크 개수를 체크하여 전체 체크인지 확인
            var productCheckbox = document.getElementsByName("product");
            var checkedProduct = new Array;
            for(i = 0; i < productCheckbox.length; i++) {
                if (productCheckbox[i].checked) {
                    checkedProduct.push(productCheckbox[i]);
                }
            }
            if (productCheckbox.length == checkedProduct.length) {
                $("#allcheck").prop("checked", true);
                $("#allcheck-mobile").prop("checked", true);
            } else {
                $("#allcheck").prop("checked", false);
                $("#allcheck-mobile").prop("checked", false);
            }
        })
    });
}

function radioCheck() {
    $("input[name = ordertype]").click(function () {
        if($("#radiobtn-delivery").prop("checked")) {
            ordertype = 2;
            document.getElementById("delivery-shipping-contents").style.color = "#4fb9ab";
            document.getElementById("preorder-shipping-contents").style.color = "#ffffff";
            orderprice = sum_allprice + shipping;
            document.getElementById("allprice-contents").innerHTML = numberWithCommas(orderprice) + "원";
        } else if($("#radiobtn-preorder").prop("checked")) {
            ordertype = 1;
            document.getElementById("delivery-shipping-contents").style.color = "#ffffff";
            document.getElementById("preorder-shipping-contents").style.color = "#4fb9ab";
            orderprice = sum_allprice;
            document.getElementById("allprice-contents").innerHTML = numberWithCommas(orderprice) + "원";
        }
    })
}

function farmerGrouping(basket_data) {
    // 배송비 계산을 위한 농부별 그룹화
    order_basket_list = basket_data[0].basket_list;
    var arrCount = 0;
    for (i = 0; i < order_basket_list.length; i++) {
        // grouping_farmer에 농부 목록 정리
        var isGrouped = false;
        for (j = 0; j < grouping_farmer.length; j++) {
            if (order_basket_list[i].product_info.farmer_name == grouping_farmer[j]) {
                isGrouped = true;
            }
        }
        if (!isGrouped) {
            // grouping_farmer에 등록되어있지 않은 농부 추가
            grouping_farmer.push(order_basket_list[i].product_info.farmer_name);
            grouping_farm.push(order_basket_list[i].product_info.farmer_pname);
        }
    }
    while (grouping_basket_list.length < order_basket_list.length) {
        for (i = 0; i < grouping_farmer.length; i++) {
            for (j = 0; j < order_basket_list.length; j++) {
                if (order_basket_list[j].product_info.farmer_name == grouping_farmer[i]) {
                    grouping_basket_list.push(order_basket_list[j]);
                }
            }
        }
    }
    makeOrder(true);
}

function makeOrder(isFirst) {
    // 주문내역 동적 생성(isFirst : 초기화 시에 true, 수량 수정 등 refresh 시에 false)
    var order_table_product = document.getElementById("order-table-product");
    order_table_product.innerHTML = null;
    sum_allprice = 0;
    for(j = 0; j < grouping_farmer.length; j++) {
        order_table_product.innerHTML += "<div class='table-farm' id='table-farm-" + j + "'></div>";
        var table_farm = document.getElementById("table-farm-" + j);
        var productFirst = true; // 같은 농부의 첫 상품일 때만 농부명 표시
        table_farm.innerHTML += "<div class='product-farm-title'><div class='product-farmer-mobile'>" +
            "<span class='product-farmer-name-mobile'>" + grouping_farm[j] + " " + grouping_farmer[j] +
            "</span><span class='product-farmer-end-mobile'>님</span></div>" +
            "<div class='product-cell-shipping'><div class='product-shipping-title'>배송비</div>" +
            "<div class='product-shipping'>" + numberWithCommas(SHIPPING_UNIT) + "원</div></div></div>";
        for(i = 0; i < grouping_basket_list.length; i++) {
            groupingBasketList = grouping_basket_list[i];
            order_farm[i] = groupingBasketList.product_info.farmer_pname;
            order_farmer_name[i] = groupingBasketList.product_info.farmer_name;
            if (grouping_farmer[j] == order_farmer_name[i]) {
                var farmName = "";
                var farmerName = "";
                var farmerNameEnd = "";
                if (productFirst) {
                    // 같은 농부의 첫 상품일 때만 농부명 표시
                    farmName = order_farm[i];
                    farmerName = order_farmer_name[i];
                    farmerNameEnd = "님";
                }
                order_farmer_img[i] = groupingBasketList.product_info.thumbnail[0];
                order_product_id[i] = groupingBasketList.product_id;
                order_product_name[i] = groupingBasketList.product_info.name;
                order_product_amount[i] = groupingBasketList.product_info.unit[0] + groupingBasketList.product_info.unit[1];
                order_product_price[i] = groupingBasketList.product_info.price;
                if (isFirst) {
                    order_product_count[i] = groupingBasketList.count;
                }
                order_product_allprice[i] = order_product_price[i] * order_product_count[i];
                sum_allprice = sum_allprice + order_product_allprice[i];
                table_farm.innerHTML += "<div class='table-product'>" +
                    "<div class='product-cell-farmer'>" +
                    "<div class='product-farm'>" + farmName +
                    "</div><div class='product-farmer'><span class='product-farmer-name'>" + farmerName +
                    "</span><span class='product-farmer-end'>" + farmerNameEnd + "</span></div></div>" +
                    "<div class='product-cell-info'>" +
                    "<input class='product-checkbox' name='product' value='" + i + "' type='checkbox'>" +
                    "<img class='product-img' src='" + order_farmer_img[i] +
                    "'><div class='product-info'><div class='product-name'>" + order_product_name[i] +
                    "</div><div class='product-amount'>" + order_product_amount[i] +
                    "</div></div></div>" +
                    "<div class='product-cell-price'><div class='product-price'>" + numberWithCommas(order_product_price[i]) +
                    "</div></div>" +
                    "<div class='product-cell-count'><img class='btn-minus clickable' src='img/basket/ic-minus.png' onclick='onClick(\"btn-minus\", " + (i) +
                    ")'><div class='product-count' id='product-count-" + i + "'>" + order_product_count[i] +
                    "</div><img class='btn-plus clickable' src='img/basket/ic-plus.png' onclick='onClick(\"btn-plus\", " + i +
                    ")'></div>" +
                    "<div class='product-cell-allprice'><div class='product-allprice-title'>주문금액</div>" +
                    "<div class='product-allprice' id='product-allprice-" + i + "'>" + numberWithCommas(order_product_allprice[i]) +
                    "</div></div>";
                productFirst = false;
            }
        }
    }
    shipping = SHIPPING_UNIT * grouping_farmer.length;
    switch (ordertype) {
        case 1: // pre-order일 때 배송비 없음
            orderprice = sum_allprice;
            break;
        case 2: // 주문 배송일 때 배송비 포함
            orderprice = sum_allprice + shipping;
            break;
        default:
            orderprice = sum_allprice + shipping;
            break;
    }
    document.getElementById("price-title").innerHTML = "총 상품 금액 (" + order_basket_list.length + "개)";
    document.getElementById("price-contents").innerHTML = numberWithCommas(sum_allprice) + "원";
    document.getElementById("delivery-shipping-contents").innerHTML = "+ " + numberWithCommas(shipping) + "원";
    document.getElementById("allprice-contents").innerHTML = numberWithCommas(orderprice) + "원";
}

// order_basket_list 부분 html
// <div class="table-farm">
//     <div class="table-product">
//     <div class="product-cell-farmer">
//     <div class="product-farm">아침농장</div>
//     <div class="product-farmer"><span class="product-farmer-name">노환표농부</span>
//     <span class="product-farmer-end">님</span></div>
//     </div>
//     <div class="product-cell-info">
//     <input class="product-checkbox" name="product" value="1" type="checkbox">
//     <img class="product-img" src="img/main/product_ex1.jpg">
//     <div class="product-info">
//     <div class="product-name">친환경 도라지 배즙 1박스</div>
// <div class="product-amount">30개, 110ml</div>
// </div>
// </div>
// <div class="product-cell-price">
//     <div class="product-price">30,000원</div>
// </div>
// <div class="product-cell-count">
//     <img class="btn-minus" src="img/basket/ic-minus.png">
//     <div class="product-count">1</div>
//     <img class="btn-plus" src="img/basket/ic-plus.png">
//     </div>
//     <div class="product-cell-allprice">
//     <div class="product-allprice">30,000원</div>
// </div>
// </div>
// <div class="product-shipping">
//     3,000원
// </div>
// </div>

window.onload = function () {
    if (sessionStorage.getItem('accesstoken') != undefined) {
        loadBasket(DeviceId, Accesstoken);
        allSelect();
        radioCheck();
    } else {
        // 로그인 되지 않았을 경우 로그인으로
        location.replace("login.html");
    }
};
