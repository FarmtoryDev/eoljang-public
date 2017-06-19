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
var order_basket_list = new Array;
var grouping_basket_list = new Array;
var sum_allprice = 0; // 배송비 제외 총 상품 금액
var shipping = 0; // 배송비
var orderprice = 0; // 배송비 포함 총 결제 금액
var SHIPPING_UNIT = 3000; // 배송비 단위
var ordertype = 2; // 배송 방식 : pre-order가 1, 배송 주문이 2
var orderBasket = true; // 장바구니를 거쳐 들어온 경우 true, 주문하기 버튼으로 직접 들어온 경우 false
var oneProductId; // 단일구매 상품 ID
var oneProductCount; // 단일구매 상품 개수
var contentType = 'application/json';
var orderArray = new Array;
var shippingText = "배송비 없음";

function onClick(name) {
    // 버튼 클릭 이벤트 모음
    switch (name) {
        case "btn-addnum" :
            // 우편번호 찾기
            execDaumPostcode();
            break;
        case "btn-terms1" :
            // 결제대행 서비스 약관보기
            $('.cd-popup').addClass('is-visible');
            $("#term-content").load("terms1.html");
            break;
        case "btn-terms2" :
            // 개인정보 제3자 제공 동의에 관한 약관보기
            $('.cd-popup').addClass('is-visible');
            $("#term-content").load("terms2.html");
            break;
        case "btn-confirm" :
            // 카카오페이로 결제하기
            var input_name = document.getElementById("input-name").value;
            var input_phone = document.getElementById("input-phone1").value + "-" +
                document.getElementById("input-phone2").value + "-" +
                document.getElementById("input-phone3").value;
            var input_address = "(" + document.getElementById("input-address1").value + ") " +
                    document.getElementById("input-address2").value + " " +
                    document.getElementById("input-address3").value;

            var inputList = document.getElementsByTagName("input");
            var isAllChecked = true;
            for (i = 0; i < inputList; i++) {
                if (i < 7) {
                    if(inputList[i].value == "") {
                        isAllChecked = false;
                    }
                } else {
                    if(!inputList[i].checked) {
                        isAllChecked = false;
                    }
                }
            }
            if (isAllChecked) {
                buy(input_name, input_phone, input_address);
                // 결제화면
            } else {
                // 입력 항목이 비어있을 경우(예외처리 항목별로 제대로 할 것)
                alert("입력하지 않은 항목이 있거나 약관에 동의하지 않으셨습니다.");
            }
            break;
        case "btn-back" :
            // 장바구니로 돌아가기
            var doBack = confirm("상품 목록으로 돌아가시겠습니까? 결제가 진행되지 않습니다.");
            if (doBack) {
                location.replace("productlist.html");
            }
            break;
        default :
            break;
    }
}

// from https://blog.trackduck.com/2015/06/10/15-impressive-pop-animation-effects-codepen/
function popUp() {
    //close popup
    $('.cd-popup').on('click', function(event){
        if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
            event.preventDefault();
            $(this).removeClass('is-visible');
        }
    });
    //close popup when clicking the esc keyboard button
    $(document).keyup(function(event){
        if(event.which=='27'){
            $('.cd-popup').removeClass('is-visible');
        }
    });
}

function loadBasket(DeviceId, Accesstoken) {
    // 장바구니 목록 불러오기
    var basket_data = new Array;
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
            basket_data.push(data.data);
            farmerGrouping(basket_data);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            alert("장바구니 목록을 불러오는 중 에러가 발생했습니다.");
            history.back();
        }
    });
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
    makeOrder(orderBasket);
}

function productDetail(DeviceId, productId){
    // 상품 정보 가져오기
    $.ajax({
        type: "GET",
        url: "https://api.eoljang.com/product/detail/" + productId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            if (data.result) {
                result_data = data.data;
                order_basket_list.push(result_data);
                makeOrder(orderBasket);
            } else {
                console.log("error");
                console.log(e);
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
        }
    });
}

function makeOrder(orderBasket) {
    // 주문내역 동적 생성
    var order_table_product = document.getElementById("order-table-product");
    order_table_product.innerHTML = null;
    var price_box = document.getElementById("price-box");
    if (orderBasket) {
        for (j = 0; j < grouping_farmer.length; j++) {
            var productFirst = true; // 같은 농부의 첫 상품일 때만 농부명 표시
            for (i = 0; i < grouping_basket_list.length; i++) {
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
                        productFirst = false;
                    }
                    order_farmer_img[i] = groupingBasketList.product_info.thumbnail[0];
                    order_product_id[i] = groupingBasketList.product_id;
                    order_product_name[i] = groupingBasketList.product_info.name;
                    order_product_amount[i] = groupingBasketList.product_info.unit[0] + groupingBasketList.product_info.unit[1];
                    order_product_price[i] = groupingBasketList.product_info.price;
                    order_product_count[i] = groupingBasketList.count;
                    order_product_allprice[i] = order_product_price[i] * order_product_count[i];
                    sum_allprice = sum_allprice + order_product_allprice[i];
                    order_table_product.innerHTML += "<div class='table-product'>" +
                        "<div class='product-cell-farmer'>" +
                        "<div class='product-farm'>" + farmName +
                        "</div><div class='product-farmer'><span class='product-farmer-name'>" + farmerName +
                        "</span><span class='product-farmer-end'>" + farmerNameEnd + "</span></div></div>" +
                        "<div class='product-cell-info'><img class='product-img' src='" + order_farmer_img[i] +
                        "'><div class='product-info'><div class='product-name'>" + order_product_name[i] +
                        "</div><div class='product-amount'>" + order_product_amount[i] +
                        "</div></div></div>" +
                        "<div class='product-cell-price'><div class='product-price'>" + numberWithCommas(order_product_price[i]) +
                        "</div></div>" +
                        "<div class='product-cell-count'><div class='product-count'>" + order_product_count[i] +
                        "</div></div>" +
                        "<div class='product-cell-allprice'><div class='product-allprice'>" + numberWithCommas(order_product_allprice[i]) +
                        "</div></div></div>";
                }
            }
        }
        shipping = SHIPPING_UNIT * grouping_farmer.length;
    } else {
        sum_allprice = order_basket_list[0].price * oneProductCount;
        order_table_product.innerHTML += "<div class='table-product'>" +
            "<div class='product-cell-farmer'>" +
            "<div class='product-farm'>" + order_basket_list[0].farmer_pname +
            "</div><div class='product-farmer'><span class='product-farmer-name'>" + order_basket_list[0].farmer_name +
            "</span><span class='product-farmer-end'>" + "님" + "</span></div></div>" +
            "<div class='product-cell-info'><img class='product-img' src='" + order_basket_list[0].thumbnail[0] +
            "'><div class='product-info'><div class='product-name'>" + order_basket_list[0].name +
            "</div><div class='product-amount'>" + oneProductCount +
            "</div></div></div>" +
            "<div class='product-cell-price'><div class='product-price'>" + numberWithCommas(order_basket_list[0].price) +
            "</div></div>" +
            "<div class='product-cell-count'><div class='product-count'>" + oneProductCount +
            "</div></div>" +
            "<div class='product-cell-allprice'><div class='product-allprice'>" + numberWithCommas(sum_allprice) +
            "</div></div></div>";
        shipping = SHIPPING_UNIT;
    }
    switch (ordertype) {
        case 1: // pre-order일 때 배송비 없음
            shippingText = "배송비 없음";
            orderprice = sum_allprice;
            break;
        case 2: // 주문 배송일 때 배송비 포함
            shippingText = numberWithCommas(shipping) + "원";
            orderprice = sum_allprice + shipping;
            break;
        default:
            shippingText = numberWithCommas(shipping) + "원";
            orderprice = sum_allprice + shipping;
            break;
    }
    price_box.innerHTML = "<div id='allprice-container'><div id='title-allprice'>총 상품금액 (" + order_basket_list.length +
        "개)</div>" +
        "<div id='text-allprice'>" + numberWithCommas(sum_allprice) + "원</div></div>" +
        "<div id='shipping-container'><img id='ic-add' src='img/order/ic_add_circle.png'>" +
        "<div id='title-shipping'>배송비</div><div id='text-shipping'>" + shippingText + "</div></div>" +
        "<div class='line' id='price-line'></div>" +
        "<div id='orderprice-container'><div id='title-orderprice'>결제 예정 금액</div>" +
        "<div id='text-orderprice'>" + numberWithCommas(orderprice) + "원</div></div>";
}

    /*
    var order_table_product = document.getElementById("order-table-product");
    var price_box = document.getElementById("price-box");
    var orderJSOj = JSON.parse(sampleJSON);
    var order_data = orderJSOj.data;
    var order_basket_list = order_data.basket_list;
    var sum_allprice = 0;
    var shipping = 0;
    var orderprice = 0;
    for(var i = 0; i < order_basket_list.length; i++) {
        var order_farm = "";
        var order_farmer_name = order_basket_list[i].product_info.farmer_name;
        var order_farmer_img = order_basket_list[i].product_info.thumbnail[0];
        var order_product_name = order_basket_list[i].product_info.name;
        var order_product_amount = order_basket_list[i].product_info.unit[0] + order_basket_list[i].product_info.unit[1];
        var order_product_price = order_basket_list[i].product_info.price;
        var order_product_count = order_basket_list[i].count;
        var order_product_allprice = order_product_price * order_product_count;
        var sum_allprice = sum_allprice + order_product_allprice;
        order_table_product.innerHTML += "<div class='table-product'>" +
            "<div class='product-cell-farmer'>" +
            "<div class='product-farm'>" + order_farm +
            "</div><div class='product-farmer'><span class='product-farmer-name'>" + order_farmer_name +
            "</span><span class='product-farmer-end'>님</span></div></div>" +
            "<div class='product-cell-info'><img class='product-img' src='" + order_farmer_img +
            "'><div class='product-info'><div class='product-name'>" + order_product_name +
            "</div><div class='product-amount'>" + order_product_amount +
            "</div></div></div>" +
            "<div class='product-cell-price'><div class='product-price'>" + numberWithCommas(order_product_price) +
            "</div></div>" +
            "<div class='product-cell-count'><div class='product-count'>" + order_product_count +
            "</div></div>" +
            "<div class='product-cell-allprice'><div class='product-allprice'>" + numberWithCommas(order_product_allprice) +
            "</div></div></div>";
    }
    orderprice = sum_allprice + shipping;
    price_box.innerHTML = "<div id='allprice-container'><div id='title-allprice'>총 상품금액 (" + order_basket_list.length +
        "개)</div>" +
        "<div id='text-allprice'>" + numberWithCommas(sum_allprice) + "원</div></div>" +
        "<div id='shipping-container'><img id='ic-add' src='img/order/ic_add_circle.png'>" +
        "<div id='title-shipping'>배송비</div><div id='text-shipping'>" + numberWithCommas(shipping) + "원</div></div>" +
        "<div class='line' id='price-line'></div>" +
        "<div id='orderprice-container'><div id='title-orderprice'>결제 예정 금액</div>" +
        "<div id='text-orderprice'>" + numberWithCommas(orderprice) + "원</div></div>";
        */


// order-basket-list 부분 html
// <div class="table-product">
//     <div class="product-cell-farmer">
//     <div class="product-farm">아침농장</div>
//     <div class="product-farmer"><span class="product-farmer-name">노환표농부</span>
//     <span class="product-farmer-end">님</span></div>
//     </div>
//     <div class="product-cell-info">
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
//     <div class="product-count">1</div>
//     </div>
//     <div class="product-cell-allprice">
//     <div class="product-allprice">30,000원</div>
// </div>
// </div>

// price-box 부분 html
// <div id="allprice-container">
//     <div id="title-allprice">총 상품금액 (0개)</div>
// <div id="text-allprice">0원</div>
// </div>
// <div id="shipping-container">
//     <img id="ic-add" src="img/order/ic_add_circle.png">
//     <div id="title-shipping">배송비</div>
//     <div id="text-shipping">0원</div>
// </div>
// <div class="line" id="price-line"></div>
//     <div id="orderprice-container">
//     <div id="title-orderprice">결제 예정 금액</div>
// <div id="text-orderprice">0원</div>
// </div>


// 결제 i'mport js
function buy(name, phone, address){
    var orderName;
    if (orderBasket) {
        if (order_basket_list.length == 1) {
            orderName = order_basket_list[0].product_info.name;
        } else {
            orderName = order_basket_list[0].product_info.name + " 외 " + (order_basket_list.length - 1) + "건";
        }
        for (i = 0; i < order_basket_list.length; i++) {
            orderArray.push({"product_id": order_basket_list[i].product_id, "count": order_basket_list[i].count});
        }
    } else {
        orderName = order_basket_list[0].name;
        orderArray.push({"product_id": oneProductId, "count": oneProductCount});
    }
    // var params = [];
    // var listSize = 5;
    //    for (var nRow = 0; nRow < listSize; nRow++) {
    //       params.push(nRow);
    //    }
    //이따 값 넣을 때 하는 것
    IMP.request_pay({
        pg : 'kakao',
        pay_method : 'card',
        merchant_uid : 'merchant_' + new Date().getTime(),
        name: orderName, //상품이름
        amount: orderprice, //넣어야 한다. 결제금액
        buyer_email: sessionStorage.getItem('user_email'),//
        buyer_name: name,//넣는게 낫다.
        m_redirect_url: "./smartphone.html",		//   모바일일 때 달라야한다 redirect 페이지 파라미터로 넘겨야 한다.
        kakaoOpenApp : true
    }, function(rsp) {
        console.log("1");
        if ( rsp.success ) {
            console.log("rsp.imp_uid",rsp.imp_uid);
            //[1] 서버단에서 결제정보 조회를 위해 jQuery ajax로 imp_uid 전달하기
            $.ajax({
                url: "https://api.eoljang.com/order/create", //cross-domain error가 발생하지 않도록 주의해주세요
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-Device-Id" , DeviceId );
                    xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken );
                    xhr.setRequestHeader("Content-Type" , contentType );
                },
                dataType: 'json',
                data: JSON.stringify({
                    type: ordertype,
                    imp_uid : rsp.imp_uid,
                    //기타 필요한 데이터가 있으면 추가 전달
                    order : orderArray,
                    pinfo: {
                        name : name,
                        email: sessionStorage.getItem('user_email'),
                        phone: phone,
                        address: address
                    }
                }),
                success:function(data){
                    console.log("data는 ",data)
                },
                error: function (e) {
                    console.log("error");
                    console.log(e);
                }
            }).done(function(data) {
                console.log("data이다",data);
                if (data.result) {
                    alert("결제가 완료되었습니다.\n(개발 중이므로 실제 결제가 진행되지 않습니다.)");
                    location.replace("mypage.html");
                    // 나중엔 ordercompleted.html로 리다이렉트 시킬 것
                } else {
                    var msg = '결제에 실패하였습니다.';
                    msg += '에러내용 : ' + rsp.error_msg;
                    alert(msg);
                }
            });
        } else {
            var msg = '결제에 실패하였습니다.';
            msg += '에러내용 : ' + rsp.error_msg;
            alert(msg);
        }
    });
}
function execDaumPostcode() {
    daum.postcode.load(function() {
        new daum.Postcode({
            oncomplete: function (data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var fullAddr = ''; // 최종 주소 변수
                var extraAddr = ''; // 조합형 주소 변수
                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    fullAddr = data.roadAddress;
                    console.log("도로명 주소 선택 ", fullAddr);
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    fullAddr = data.jibunAddress;
                }
                // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
                if (data.userSelectedType === 'R') {
                    //법정동명이 있을 경우 추가한다.
                    if (data.bname !== '') {
                        extraAddr += data.bname;
                    }
                    // 건물명이 있을 경우 추가한다.
                    if (data.buildingName !== '') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                    fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
                }
                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById("input-address1").value = data.zonecode; //5자리 새우편번호 사용
                document.getElementById("input-address2").value = fullAddr;
                // 커서를 상세주소 필드로 이동한다.
                document.getElementById("input-address3").focus();
            }
        }).open();
    });
}

window.onload = function () {
    if (sessionStorage.getItem('accesstoken') != undefined) {
        /* 결제 부분 */
        var IMP = window.IMP; // 생략가능
        IMP.init('imp81371422'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
        /* 상품 확인 부분 */
        if (location.search.substring(1).length > 0) {
            var urlParams = new Array;
            for (i = 0; i < location.search.substring(1).split("&").length; i++) {
                urlParams = location.search.substring(1).split("&")[i].split("=");
                switch (urlParams[0]) {
                    case "basket":
                        switch (urlParams[1]) {
                            // boolean 값이 아니라 string 값으로 오므로 변환
                            case "true":
                                orderBasket = true;
                                break;
                            case "false":
                                orderBasket = false;
                                break;
                            default:
                                // 이 외의 방법으로 들어온 경우 오류처리
                                alert("정상적이지 않은 접근입니다.");
                                history.back();
                                break;
                        }
                        break;
                    case "id":
                        oneProductId = parseInt(urlParams[1]);
                        break;
                    case "count":
                        oneProductCount = parseInt(urlParams[1]);
                        break;
                    case "ordertype":
                        ordertype = parseInt(urlParams[1]);
                        break;
                    default:
                        break;
                }
            }
        }
        if (orderBasket) {
            // 장바구니를 통해 들어온 경우
            loadBasket(DeviceId, Accesstoken);
        } else {
            // 구매하기 버튼을 통해 들어온 경우(단일구매)
            productDetail(DeviceId, oneProductId);
        }
        document.getElementById("input-name").defaultValue = user_name;
        // 주문자 이름 기본값을 유저 이름으로 설정
        popUp();
    } else {
        // 로그인 되지 않았을 경우 로그인으로
        location.replace("login.html");
    }

};
