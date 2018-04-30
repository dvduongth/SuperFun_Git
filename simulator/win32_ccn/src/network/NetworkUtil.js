/**
 * Created by GSN on 4/5/2016.
 */

var NetworkUtil = NetworkUtil||{};

xmlHttpRequest = function(urlRequest, callbackFunc){
    //cc.log("request url:" + urlRequest);

    var xhr = cc.loader.getXMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            //var httpStatus = xhr.statusText;
            var objResponse = JSON.parse(xhr.responseText);

            cc.log("has response: " + JSON.stringify(objResponse));
            callbackFunc(objResponse);
        }
        else{
            callbackFunc({error: PORTAL_ERROR.FAIL});
        }
    };

    xhr.onerror = function(){
        callbackFunc({error: PORTAL_ERROR.FAIL});
    };

    xhr.timeout = 5000;
    xhr.open("GET", urlRequest, true);
    xhr.send();
};

packDataForRequest = function(data){
    //LogUtils.log("data: " + JSON.stringify(data));
    try{
        var params = "";
        for (var key in data) {
            //LogUtils.log(key + "");
            if (data[key].length <= 0) {
                cc.log("miss param: " + key);
                return;
            }
            params += key + "=" + data[key];
            params += "&";
        }
        params = params.slice(0, params.length - 1);
        //LogUtils.log("end");
        return params;
    }
    catch(err){
        cc.log("error: " + err.message);
    }

    return "";
};

NetworkUtil.requestJson = function(url, callback){
    var link = encodeURI(url);
    xmlHttpRequest(link, function(response) {
        if(response.error == 0){
            callback(true, response);
        }
        else{
            callback(false, null);
        }
    });
};