function onClick(name) {
    // 버튼 클릭 이벤트 모음
    switch (name) {
        case "btn-main" :
            location.href = "main.html";
            break;
        case "btn-mypage" :
            location.href = "mypage.html";
            break;
        default :
            break;
    }
}