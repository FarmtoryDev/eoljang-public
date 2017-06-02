var DeviceId;
var Accesstoken;
var user_id;
var user_nickname;
var user_social;
var user_name;
var user_email;
var baseBasketList = new Array;

$(document).ready(function(){
    // header와 footer 불러오기
    $("#load-header").load("header.html");
    $("#load-footer").load("footer.html");
    if (sessionStorage.getItem('device_id') == undefined) {
        createDeviceId();
    }
    DeviceId = sessionStorage.getItem('device_id');
    Accesstoken = sessionStorage.getItem('accesstoken');
    // 1200px 이하의 화면에서 navigation bar 수평 스크롤 가능하게 하는 jquery
    $(".navbar").scrollLeft(300);
});

$(window).load(function () {
    getUserName();
    setTimeout(getUserName(), 500); // navigation bar load를 기다리기 위한 타이머
});
/*
function extractToken(DeviceId, Accesstoken) {
    // 유저 토큰 확인
    // 로그인 및 결제 시 외에 사용하지 말 것
    var result_data = new Array;

    $.ajax({
        type: "POST",
        url: "./member/extracttoken",
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token", Accesstoken);
        },
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.result) {
                // 로그인이 유효할 때
                user_data.push(data.data);
                getUserName();
            } else {
                // 로그인이 유효하지 않을 때
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
        }
    });

}
*/
function createDeviceId() {
    function tokengenerate(x) {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4() ;
    }
    var device_id = tokengenerate(1);
    sessionStorage.setItem('device_id', device_id);

}

function getUserName() {
    if (document.getElementById("nav-login") != null) {
        if (sessionStorage.getItem('accesstoken') == null) {
            document.getElementById("nav-login").innerHTML = "<a href='login.html'>로그인</a>";
        } else {
            user_id = sessionStorage.getItem('user_id');
            user_nickname = sessionStorage.getItem('user_nickname');
            user_social = sessionStorage.getItem('user_social');
            user_name = sessionStorage.getItem('user_name');
            user_email = sessionStorage.getItem('user_email');
            document.getElementById("nav-login").innerHTML = "<a href='#'>" + user_nickname + "님</a>";
            setBasketBadge();
        }
    }
}

function setBasketBadge() {
    // 장바구니 개수 확인하기
    var basket_count = 0;
    var basket_badge = document.getElementById("basket-badge");
    if (DeviceId != null && Accesstoken != null) {
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
                    baseBasketList = data.data.basket_list;
                    basket_count = data.data.basket_list.length;
                    if (basket_count > 0) {
                        basket_badge.style.display = "block";
                        basket_badge.innerHTML = basket_count;
                    } else if (basket_count > 100) {
                        basket_badge.style.display = "block";
                        basket_badge.innerHTML = "99+";
                    } else {
                        basket_badge.style.display = "none";
                    }
                } else {
                    //alert("장바구니 목록을 불러오는 중 에러가 발생했습니다.");
                }
            },
            error: function (e) {
                console.log("error");
                console.log(e);
                //alert("장바구니 목록을 불러오는 중 에러가 발생했습니다.");
            }
        });
    }
}
/*
function farmerList(DeviceId) {
    // 농부 목록 불러오기
    var result_data = new Array;
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
            result_data.push(data.data);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            result_data = false;
        }
    });

    return result_data;
}

function farmerDetail(DeviceId, farmerId) {
    // 농부 정보 불러오기
    var result_data = new Array;
    $.ajax({
        type: "GET",
        url: "./farmer/detail/" + farmerId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id", DeviceId);
        },
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (data) {
            result_data.push(data.data);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            result_data = false;
        }
    });

    return result_data;
}

function productList(DeviceId){
    // 상품 목록 불러오기
    var result_data = new Array;
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
            result_data.push(data.data);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            result_data = false;
        }
    });

    return result_data;
}


function productDetail(DeviceId, productId){
    // 상품 정보 가져오기
    var result_data = new Array;
    $.ajax({
        type: "GET",
        url: "./product/detail/" + productId,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        cache:false,
        contentType: "application/json",
        success: function (data) {
            result_data.push(data.data);
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            result_data = false;
        }
    });

    return result_data;
}

*/
function setNavbarPosition() {
    // navigation bar 위치를 설정하는 함수
    var mq = window.matchMedia("screen and (max-device-width: 767px)");
    if (!mq.matches) {
        // 모바일 뷰가 아닐 때
        if (window.scrollY < 160) {
            // 스크롤이 160px보다 위에 있을 경우 navigation bar 정위치
            document.getElementById("content-nav").style.top = "160px";
            document.getElementById("content-nav").style.position = "absolute";
        } else {
            // 스크롤이 160px 아래에 있을 경우 navigation bar 상단 고정
            document.getElementById("content-nav").style.top = "0";
            document.getElementById("content-nav").style.position = "fixed";
        }
    } else {
        // 모바일 뷰일 때 navigation bar 상단 고정
        document.getElementById("content-nav").style.top = "0";
        document.getElementById("content-nav").style.position = "fixed";
    }
}

function numberWithCommas(num) {
    // 세 자리마다 콤마를 삽입하는 함수
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // /정규표현식/g : 문자열 내 정규표현식으로 표현된 모든 패턴을 찾음
    // \B : 문자와 공백 사이가 아닌 값을 찾음
    // \d{3} : 숫자를 3번 반복한 패턴을 찾음
}

function scrollToAnchor(aid, relativeTop){
    // a 태그의 id로 자연스럽게 스크롤하는 함(relativeTop은 추가 위치 조정, 30의 경우 aid보다 30 아래까지 스크롤)
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: (aTag.offset().top + relativeTop)},'slow');
}
/* 사용법(<a name="target"> 일 때)
 $("#link").click(function() {
    scrollToAnchor('target');
 });
 */

window.resize = function () {
    setNavbarPosition();
}

window.onscroll = function () {
    setNavbarPosition();
}
