var farmerListResult = new Array;
var MAX_FARMER_NUMBER = 30;
var swipeAnchor = 0;
var anchor_num = 0; // addShop 함수에서 anchor를 추가하면서 1씩 증가하고, 최종값이 swipePage에서 사용됨
var anchorArray = new Array; // anchor top px
var ANCHOR_TRIGGER = 10; // autoScrolling을 발동시키는 scroll px(이 px 이상을 scroll 해야 anchor 작동)
var isTriggerFlag = 0; // 2일 경우 autoScrolling, 1는 수동 scroll, 0은 scroll하지 않을 때

// touchEvent를 위한 코드 from http://jsfiddle.net/Q3d9H/1/

var supportTouch = $.support.touch,
    scrollEvent = "touchmove scroll",
    touchStartEvent = supportTouch ? "touchstart" : "mousedown",
    touchStopEvent = supportTouch ? "touchend" : "mouseup",
    touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
$.event.special.swipeupdown = {
    setup: function() {
        var thisObject = this;
        var $this = $(thisObject);
        $this.bind(touchStartEvent, function(event) {
            var data = event.originalEvent.touches ?
                    event.originalEvent.touches[ 0 ] :
                    event,
                start = {
                    time: (new Date).getTime(),
                    coords: [ data.pageX, data.pageY ],
                    origin: $(event.target)
                },
                stop;

            function moveHandler(event) {
                if (!start) {
                    return;
                }
                var data = event.originalEvent.touches ?
                    event.originalEvent.touches[ 0 ] :
                    event;
                stop = {
                    time: (new Date).getTime(),
                    coords: [ data.pageX, data.pageY ]
                };

                // prevent scrolling
                if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                    event.preventDefault();
                }
            }
            $this
                .bind(touchMoveEvent, moveHandler)
                .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                            Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                            Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                .trigger("swipeupdown")
                                .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
        });
    }
};
$.each({
    swipedown: "swipeupdown",
    swipeup: "swipeupdown"
}, function(event, sourceEvent){
    $.event.special[event] = {
        setup: function(){
            $(this).bind(sourceEvent, $.noop);
        }
    };
});

function swipePage() {
    // Page 스와이프를 위한 함수
    // addShop 함수가 종료된 후에 실행되도록 할 것

    if(isTriggerFlag == 0) {
        isTriggerFlag = 1;
        console.log("isTriggerFlag 1");
        timer = setTimeout(function () {
            $('#fullcontainer').on('swipeup', function () {
                if (swipeAnchor > 0) {
                    swipeAnchor--;
                }
            });
            $('#fullcontainer').on('swipedown', function () {
                if (swipeAnchor <= anchor_num) {
                    swipeAnchor++;
                }
            });
            console.log("Anchor : " + swipeAnchor);
            isTriggerFlag = 2;
            console.log("isTriggerFlag 2");
            $('html, body').animate({scrollTop: anchorArray[swipeAnchor]},'slow', function () {
                isTriggerFlag = 0;
                console.log("isTrigger 0");
            });
        }, 100);
    }
}

function scrollPage() {
    // Page 스크롤링을 위한 함수
    // addShop 함수가 종료된 후에 실행되도록 할 것
    // from http://www.jquerybyexample.net/2013/07/jquery-detect-scroll-position-up-down.html

    $(window).scroll(function () {
        if(isTriggerFlag == 0) {
            isTriggerFlag = 1;
            console.log("isTriggerFlag 1");
            var timer;
            var iCurScrollPos = $(this).scrollTop();
            timer = setTimeout(function () {
                var moveScrollPos = $(this).scrollTop();
                if (moveScrollPos > iCurScrollPos + ANCHOR_TRIGGER && swipeAnchor <= anchor_num) {
                    swipeAnchor++;
                } else if (moveScrollPos < iCurScrollPos - ANCHOR_TRIGGER && swipeAnchor > 0) {
                    swipeAnchor--;
                }
                console.log("Anchor : " + swipeAnchor);
                isTriggerFlag = 2;
                console.log("isTriggerFlag 2");
                if (moveScrollPos > iCurScrollPos + ANCHOR_TRIGGER || moveScrollPos < iCurScrollPos - ANCHOR_TRIGGER) {
                    $('html, body').animate({scrollTop: anchorArray[swipeAnchor]}, 'slow', function () {
                        isTriggerFlag = 0;
                        console.log("isTrigger 0");
                    });
                } else {
                    // animate 종료 후에 화면이 완전히 멈추지 않기 때문에 이 때 다시 트리거가 작동하지 않도록 처리
                    isTriggerFlag = 0;
                    console.log("isTrigger 0");
                }
            }, 100);
        }
    });

}

function onClick(name, target) {
    switch (name) {
        case "btn-shop":
            // open popup
            setPopup(target);
            $('.cd-popup').addClass('is-visible');
            break;
        case "btn-farmer":
            location.replace("farmer.html?index=" + target);
            break;
        default:
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
            if (data.result) {
                farmerListResult.push(data.data);
                addShop();
            } else {
                console.log("error");
                console.log(data);
                alert("농부 목록을 불러오는 중에 에러가 발생하였습니다.");
            }
        },
        error: function (e) {
            console.log("error");
            console.log(e);
            farmerListResult = false;
        }
    });
}

function setShopContainer() {
    if (matchMedia("screen and (max-device-width: 767px)").matches) {
        var HEIGHT_RATIO = 669.1;
        var bg_height = (document.getElementById("map-header").clientWidth) * HEIGHT_RATIO / 100;
        document.getElementById("eoljang-body").style.height = bg_height + "px";
    } else if (matchMedia("(max-width: 1440px)").matches) {
        var bg_height = document.getElementById("eoljang-map").clientHeight;
        document.getElementById("eoljang-body").style.height = bg_height + "px";
    } else {
        document.getElementById("eoljang-body").style.height = "5309px";
    }
}


function addShop() {
    var SHOP_FIRST_TOP = 2.5;
    var SHOP_DISTANCE = 6.09;
    var SHOP_FIRST_TOP_MOBILE = 1.28;
    var SHOP_DISTANCE_MOBILE = 6.02;
    var shop_top = SHOP_FIRST_TOP - SHOP_DISTANCE;
    var shop_top_mobile = SHOP_FIRST_TOP_MOBILE - SHOP_DISTANCE_MOBILE;
    var farmer_data = farmerListResult[0].farmers;
    var farmer_num = 1;
    for (i = 0; i < MAX_FARMER_NUMBER; i++) {
        var shop_div = document.createElement("div");
        shop_div.id = "shop" + (i + 1);
        shop_div.setAttribute('onclick', 'onClick("btn-shop", ' + farmer_num + ')');
        if (i % 2 == 0) {
            shop_div.className = "clickable eoljang-shop shop-left";
            shop_top += SHOP_DISTANCE;
            shop_top_mobile += SHOP_DISTANCE_MOBILE;
        } else {
            shop_div.className = "clickable eoljang-shop shop-right";
        }
        if ((i+1) % 6 == 1) {
            anchor_num++;
            shop_div.innerHTML += "<a name='anchor" + anchor_num + "'/>";
        }
        if (matchMedia("screen and (max-device-width: 767px)").matches) {
            shop_div.style.top = shop_top_mobile + "%";
        } else {
            shop_div.style.top = shop_top + "%";
        }
        shop_div.innerHTML += "<img class='shop-profile' src='" + farmer_data[farmer_num].info.profileimg + "'/>";
        //shop_div.innerHTML += "<img class='shop-icon' src='" + farmer_data[farmer_num].info.profileimg + "'/>";
        //shop_div.innerHTML += "<div class='shop-num'>" + (i + 1) + "</div>";
        shop_div.innerHTML += "<div class='shop-name'>" + farmer_data[farmer_num].info.pname + "</div>";
        document.getElementById("road-bg").appendChild(shop_div);
        if (farmer_num >= Object.keys(farmer_data).length) {
            farmer_num = 1;
        } else {
            farmer_num++;
        }
    }
    //swipePage();
    //scrollPage();
    swipeAnchor = 0;
    anchorArray.push(0); // 첫 anchor는 0
    for (i = 1; i <= anchor_num; i++) {
        anchorArray.push($("a[name='" + "anchor" + i + "']").offset().top - 100);
    }
    scrollToAnchor("anchor" + swipeAnchor, 0);
    // anchor 초기화
}

function setPopup(target) {
    var farmer_data = farmerListResult[0].farmers;
    var farmer_info = farmer_data[target].info;
    var farmer_info_profileimg = farmer_info.profileimg;
    var farmer_info_paddress = farmer_info.paddress;
    var farmer_info_pname = farmer_info.pname;
    var farmer_info_name = farmer_info.name;
    var product_info = farmer_data[target].products;
    var product_info_thumbnail = new Array;
    for (key in product_info) {
        product_info_thumbnail.push(product_info[key].thumbnail);
    }
    for (i = 0; i < 2; i++) {
        // 2개보다 상품이 적을 경우 썸네일에 더미 이미지 추가
        if (product_info_thumbnail.length <= i) {
            product_info_thumbnail.push("img/base/ic_launcher.png");
        }
    }
    document.getElementById("farmer-img").setAttribute('src', farmer_info_profileimg);
    document.getElementById("farm-country").innerHTML = farmer_info_paddress;
    document.getElementById("farm-name").innerHTML = farmer_info_pname;
    document.getElementById("farmer-name").innerHTML = farmer_info_name;
    document.getElementById("farmer-product-left").setAttribute('src', product_info_thumbnail[0]);
    document.getElementById("farmer-product-right").setAttribute('src', product_info_thumbnail[1]);
    document.getElementById("btn-farmer").setAttribute('onclick', "onClick(this.id, " + target + ")");

}

window.onload = function () {
    farmerList(DeviceId);
    setShopContainer();
    popUp();
}

$(document).ready(function(){
    $(window).resize(setShopContainer())
});
