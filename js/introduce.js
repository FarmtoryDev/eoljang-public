function initMap() {
    var uluru = {lat: 37.5647015, lng: 126.9662207};
    var map = new google.maps.Map(document.getElementById('googlemaps'), {
        zoom: 17,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

$(window).load(function(){
    $("#nav-introduce>a").css("color", "#4fb9ab");
});