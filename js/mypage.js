var orderType = 1; // 프리오더 tab일 때 1, 택배배송 tab일 때 2
var orderData = new Array; // grouping 이전의 주문 데이터
var grouping_farmer = new Array; // 배송비 계산 및 농부별 모음 정렬을 위한 농부별 그룹화(2차 배열)
var grouping_order_list = new Array; // 2차 배열 {{grouping_order_content[0]}, {grouping_order_content[1]}}...
var SHIPPING_UNIT = 3000; // 배송비 단위

function onClick(name, target) {
    // 버튼 클릭 이벤트 모음
    switch (name) {
        case "preorder-tab" :
            if (orderType != 1) {
                var tab_container = document.getElementById("tab-container");
                tab_container.innerHTML = "<div id='preorder-tab' class='selected-tab'>" +
                    "<div id='preorder-text'>프리오더 구매내역</div></div>" +
                    "<div id='delivery-tab' class='clickable unselected-tab' onclick='onClick(this.id, null)'>" +
                    "<div id='delivery-text'>택배배송 구매내역</div></div>";
                orderType = 1;
                loadOrder(DeviceId, Accesstoken, orderType);
            }
            break;
        case "delivery-tab" :
            if (orderType != 2) {
                var tab_container = document.getElementById("tab-container");
                tab_container.innerHTML = "<div id='preorder-tab' class='clickable unselected-tab' onclick='onClick(this.id, null)'>" +
                    "<div id='preorder-text'>프리오더 구매내역</div></div>" +
                    "<div id='delivery-tab' class='selected-tab'>" +
                    "<div id='delivery-text'>택배배송 구매내역</div></div>";
                orderType = 2;
                loadOrder(DeviceId, Accesstoken, orderType);
            }
            break;
        case "btn-cancel" :
            var doConfirm = confirm("해당 상품을 주문취소 하시겠습니까?");
            if (doConfirm) {
                $.ajax({
                    type: "POST",
                    url: "https://api.eoljang.com/order/cancel",
                    cache:false,
                    data: "order_id=" + target,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-Device-Id" , DeviceId);
                        xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
                        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");

                    },
                    dataType:"json",
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                        if(data.result) {
                            alert("주문취소 처리되었습니다.");
                        } else {
                            console.log("error");
                            console.log(data);
                            alert("주문취소 처리 중 에러가 발생했습니다. \n담당자에게 연락해주시길 바랍니다.");
                        }
                    },
                    error: function (e) {
                        console.log("error");
                        console.log(e);
                        alert("주문취소 처리 중 에러가 발생했습니다. \n담당자에게 연락해주시길 바랍니다.");
                    }
                });
            }
            break;
        default :
            break;
    }
}

function onClickConfirm(orderId, productId) {
    // 수령 완료 버튼 클릭 이벤트
    var doConfirm = confirm("해당 상품을 수령완료 하시겠습니까?");
    if (doConfirm) {
        $.ajax({
            type: "POST",
            url: "https://api.eoljang.com/order/confirm",
            cache:false,
            data: "order_id=" + orderId + "&product_id=" + productId,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Device-Id" , DeviceId);
                xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
                xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");

            },
            dataType:"json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                if(data.result) {
                    alert("수령완료 처리되었습니다.");
                } else {
                    console.log("error");
                    console.log(e);
                    alert("수령완료 처리 중 에러가 발생했습니다.");
                }
            },
            error: function (e) {
                console.log("error");
                console.log(e);
                alert("수령완료 처리 중 에러가 발생했습니다.");
            }
        });
    }
}

function makeOrder(orderType) {
    // 구매내역 동적 생성
    var order_table_product = document.getElementById("order-table-product");
    order_table_product.innerHTML = null;
    var order_date = new Array;
    var order_shipping = new Array;
    var orderprice = new Array;
    var table_date_content = "";
    for (i = (orderData.length - 1); i >= 0; i--) {
        // 최신 주문이 가장 위로 오도록
        var productCount = 0;
        order_date.push(orderData[i].pdate);
        var order_product_data_content = new Array;
        var order_sum_allprice_content = 0;
        var order_shipping_content = "배송비 없음";
        var orderprice_content = 0;
        var table_farm_content = "";
        var farmName = "";
        var farmerName = "";
        var farmerNameEnd = "";
        var productStatus = "";
        for (k = 0; k < grouping_order_list[i].length; k++) {
            productCount++;
            order_product_data_content = grouping_order_list[i][k];
            order_sum_allprice_content = order_sum_allprice_content + (order_product_data_content.info.price * order_product_data_content.count.count);
            if (farmerName != order_product_data_content.info.farmer_name) {
                // 같은 농부의 첫 상품일 때만 농부명 표시(기존 농부 이름과 이전 상품 농부 이름이 같을 경우 농부명을 표시하지 않음)
                farmName = order_product_data_content.info.farmer_pname;
                farmerName = order_product_data_content.info.farmer_name;
                farmerNameEnd = "님";
            } else {
                farmName = "";
                farmerName = "";
                farmerNameEnd = "";
            }
            switch (order_product_data_content.count.state) {
                case 1:
                    productStatus = "<div class='product-cell-status'><div class='product-status'>주문접수</div>" +
                        "<div class='btn-receive clickable' onclick='onClick(\"btn-cancel\"," + orderData[i].id + ")'>" +
                        "<div class='text-receive'>주문취소</div></div></div>";
                    break;
                case 2:
                    productStatus = "<div class='product-cell-status'><div class='product-status'>미수령</div>" +
                        "<div class='btn-receive clickable' onclick='onClickConfirm(" + orderData[i].id + "," + k + ")'>" +
                        "<div class='text-receive'>수령완료</div></div></div>";
                    break;
                default:
                    break;
            }
            table_farm_content += "<div class='table-product'><div class='product-cell-farmer'><div class='product-farm'>" + farmName +
                "</div><div class='product-farmer'><span class='product-farmer-name'>" + farmerName +
                "</span><span class='product-farmer-end'>" + farmerNameEnd + "</span></div></div><div class='product-cell-info'>" +
                "<img class='product-img' src='" + order_product_data_content.info.thumbnail[0] + "'><div class='product-info'>" +
                "<div class='product-name'>" + order_product_data_content.info.name + "</div>" +
                "<div class='product-amount'>" + order_product_data_content.info.unit[0] + order_product_data_content.info.unit[1] +
                "</div></div></div><div class='product-cell-price'><div class='product-price'>" +
                numberWithCommas(order_product_data_content.info.price) + "원</div></div>" +
                "<div class='product-cell-count'><div class='product-count'>" + order_product_data_content.count.count +
                "</div></div><div class='product-cell-allprice'><div class='product-allprice'>" +
                numberWithCommas(order_product_data_content.info.price * order_product_data_content.count.count) +
                "원</div></div>" + productStatus + "</div><div></div>";
        }
        /*
        var status_content;
        switch (orderData[i].state) {
            case 1:
                // 결제완료, 주문대기 중(취소 버튼을 넣기 위해서는 카카오페이 환불 절차도 필요)
                status_content = "<div class='product-cell-status'><div class='product-status'>주문 대기 중</div></div>"
                break;
            case 2:
                // 주문접수, 수령 버튼 활성화
                status_content = "<div class='product-cell-status'><div class='product-status'>미수령</div>" +
                    "<div class='btn-receive clickable' onclick='onClick(\"btn-receive\", " + orderData[i].id + ")'>" +
                    "<div class='text-receive'>수령완료</div></div></div>";
                break;
            case 10:
                // 수령 완료
                break;
            default:
                break;

        }
        */
        var table_farm_result = "<div class='table-farm'>" +
            "<div class='product-date'>" + orderData[i].pdate + "</div>" +
            table_farm_content + "</div>";
        switch (orderType) {
            case 1:
                // 프리오더일 때 배송비 없음
                order_shipping_content = "배송비 없음";
                order_shipping.push(order_shipping_content);
                orderprice_content = order_sum_allprice_content;
                orderprice.push(orderprice_content);
                break;
            case 2:
                // 택배배송 배송비 계산
                order_shipping_content = numberWithCommas(grouping_farmer[i].length * SHIPPING_UNIT) + "원";
                order_shipping.push(order_shipping_content);
                orderprice_content = order_sum_allprice_content + (grouping_farmer[i].length * SHIPPING_UNIT);
                orderprice.push(orderprice_content);
                break;
            default:
                break;
        }
        table_date_content += table_farm_result +
            "<div class='price-container'><div class='price-title'>총 상품 금액 (" + productCount +"개)</div>" +
            "<div class='price-contents'>" + order_sum_allprice_content + "원<img class='ic-add-white' src='img/basket/ic-add-white.png'></div>" +
            "<div class='shipping-title'>배송비</div><div class='shipping-contents'>" + order_shipping_content +
            "<img class='ic-equal' src='img/basket/ic-equal.png'></div><div class='allprice-title'>결제 금액</div>" +
            "<div class='allprice-contents'>" + numberWithCommas(orderprice_content) + "원</div></div>";
    }
    innerHtmlContent = "<div class='table-date'>" + table_date_content + "</div>";
    order_table_product.innerHTML = innerHtmlContent;
    // UTC를 한국시간으로 변경
    //http://momentjs.com/timezone/
}

function farmerGrouping(order_data) {
    // 배송비 계산을 위한 농부별 그룹화
    grouping_order_list = new Array;
    grouping_farmer = new Array;
    for (i = 0; i < order_data.length; i++) {
        // grouping_farmer에 농부 목록 정리
        var arrCount = 0;
        var grouping_order_content = new Array;
        var grouping_farmer_content = new Array;
        for (j = 0; j < order_data[i].bought_items.length; j++) {
            var isGrouped = false;
            for (k = 0; k < grouping_farmer_content.length; k++) {
                if (order_data[i].bought_items[j].info.farmer_name == grouping_farmer_content[k]) {
                    isGrouped = true;
                }
            }
            if (!isGrouped) {
                // grouping_farmer에 등록되어있지 않은 농부 추가
                grouping_farmer_content.push(order_data[i].bought_items[j].info.farmer_name);
            }
        }
        while (grouping_order_content.length < order_data[i].bought_items.length) {
            for (l = 0; l < grouping_farmer_content.length; l++) {
                for (m = 0; m < order_data[i].bought_items.length; m++) {
                    if (order_data[i].bought_items[m].info.farmer_name == grouping_farmer_content[l]) {
                        grouping_order_content.push(order_data[i].bought_items[m]);
                    }
                }
            }
        }
        grouping_order_list.push(grouping_order_content);
        grouping_farmer.push(grouping_farmer_content);
    }
    console.log(grouping_order_list);
    console.log(grouping_farmer);
    makeOrder(orderType);
}

function loadOrder(DeviceId, Accesstoken, orderType){
    // 장바구니 업데이트하기
    $.ajax({
        type: "POST",
        url: "https://api.eoljang.com/order/query",
        cache:false,
        data: "type=" + orderType,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");

        },
        dataType:"json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            if(data.result) {
                orderData = data.data.orders;
                farmerGrouping(orderData);
            } else {
                console.log("error");
                console.log(e);
                alert("마이페이지를 불러오는 중 에러가 발생했습니다.");
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            alert("마이페이지를 불러오는 중 에러가 발생했습니다.");
        }
    });
}

$(document).ready(function() {
    if (sessionStorage.getItem('accesstoken') != undefined) {
        loadOrder(DeviceId, Accesstoken, orderType);
    } else {
        // 로그인 되지 않았을 경우 로그인으로
        location.replace("login.html");
    }
});
