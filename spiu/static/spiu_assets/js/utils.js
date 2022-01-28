/**
 * Created by Shakir on 11/18/2018.
 */
// var formData = new FormData();
//
// formData.append("username", "Groucho");
// formData.append("accountnum", 123456);
// var params = {
//                url: url,
//                type: "POST",
//                data: formData,
//                dataType: "json",
//                processData: false,
//                contentType: false,
//                async: true,
//                headers: {'X-CSRFToken': token},
//            }
var callSJAX = function (params) {
    $.ajaxSetup({async: false});
    var remote = $.ajax(params).responseText;
    return remote;
}
var callAJAX = function (params, callback) {
    // params in the form of {url:url,post:post} ets

    if ($("#waiting-div").length) $("#waiting-div").css('visibility', 'visible');
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function () {
        $.ajax(params).done(function (data) {
            if ($("#waiting-div").length) $("#waiting-div").css('visibility', 'hidden');
            try {
                if (data.is_redirect) {
                    window.location.href = data.url
                }
            } catch (e) {
                console.log(e)
            }
            callback(data)
        }).fail(function (error, texStatus) {
            // console.log(error.responseText);
            if ($("#waiting-div").length) $("#waiting-div").css('visibility', 'hidden');
            console.log(texStatus)
            errorMsg = "Fail to perform your request.";
            alert(errorMsg);
        })
            , delayInMilliseconds
    })
}
