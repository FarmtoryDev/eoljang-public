function farmerList(){
    var DeviceId = '10259273-4a1a-e95b-b29b-4ba0ba47a352';
    var Accesstoken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJleHAiOiIxNDkxODE5MDk3IiwiYXVkIjoiMTAyNTkyNzMtNGExYS1lOTViLWIyOWItNGJhMGJhNDdhMzUyIiwidXNlcmluZm8iOnsic2F2ZWRpbmZvIjp7fSwibmlja25hbWUiOiJcdWQxNGNcdWMyYTRcdWQyYjgiLCJpZCI6OTk5LCJzb2NpYWwiOjF9LCJpYXQiOiIxNDkwNjA5NDk3IiwiaXNzIjoiZW9samFuZ19zZXJ2ZXIiLCJzdWIiOiJsb2dpbnNlc3Npb24ifQ.QjVT950Yg0Q7Cyo-QpLsOLciXQUYMuAqDyGSWABMrmcFNpUFjTHm4TicX-a9pdA4';

    $.ajax({
        type: "POST",
        url: "./order/query",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Device-Id" , DeviceId);
            xhr.setRequestHeader("X-Eoljang-Token" , Accesstoken);
            xhr.setRequestHeader("content-type" , "application/x-www-form-urlencoded");
        },
        "data": {
          "type": "0"
        },

        success: function (data) {
            console.log(JSON.stringify(data));
            var result_data = data.data;
            var message = data.message;
            console.log("message",message);

            // result_data.orders
            // result.data.orders.length


        },
        error: function (e) {
            console.log("error");
            console.log(e);
        },

        complete: function () {

            console.log("hi");

        }

    });
}
