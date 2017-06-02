var i;
var CREATE_IMAGE_AMOUNT = 15;
var imgArr = [];
var linkArr = [];


function startLoadFile(DeviceId){

    $.ajax({
        type: "POST",
        url: "https://api.eoljang.com/insta/tagcontent",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
        },
        dataType:"json",
        contentType: "application/json",
        success: function (data) {

            result_data = data.data;
            for(i = 0 ; i < result_data.articles.length ; i++){
                imgArr.push( result_data.articles[i]["img"] );
                linkArr.push( result_data.articles[i]["link"] );
            }
            createImages();
        },
        error: function (e) {
            console.log("error");
            console.log(e);
        }
    });
};

function createImages() {
    // 인스타그램 동적 생성
    var instagram_section = document.getElementById("instagram-section");
    for(i = 0; i < CREATE_IMAGE_AMOUNT; i++) {
        if (linkArr[i] != null) {
            instagram_section.innerHTML += "<a id='instagram-link" + (i + 1) + "' href='" + linkArr[i] + "' target='_blank'>" +
                "<img class='instagram-img' src='" + imgArr[i] + "'></a>";
        } else {
            // 이미지가 존재하지 않을 경우 얼장 로고와 인스타그램 메인 페이지를 링크
            instagram_section.innerHTML += "<a id='instagram-link" + (i + 1) + "' href='https://www.instagram.com/moida_eoljang/' target='_blank'>" +
                "<img class='instagram-img' src='img/base/ic_launcher.png'></a>";
        }
    }
}

window.onload = function () {
    startLoadFile(DeviceId);
};
