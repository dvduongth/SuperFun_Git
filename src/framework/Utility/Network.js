/**
 * Created by KienVN on 1/21/2016.
 */

fr.Network = {
    request:function(url, callbackFunc)
    {
        cc.log("fr.Network.request: " + url);
        var timeout = setTimeout(function()
        {
            //request time out
            cc.log("request time out");
            if(callbackFunc != undefined)
            {
                callbackFunc(false);
            }
        }, 15000);
        var callBack = function(result, data)
        {
            cc.log("request success!");
            clearTimeout(timeout);
            if(callbackFunc != undefined)
            {
                callbackFunc(result, data);
            }
        };
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                callBack(true, xhr.responseText);
            }
            else{
                callBack(false);
            }
        };
        xhr.onerror = function(){
            cc.log("Request error!");
            callBack(false);
        };
        xhr.ontimeout = function(){
            cc.log("Request time out!");
            callBack(false);
        };
        xhr.onabort = function () {
            cc.log("Request aborted!");
            callBack(false);
        };
        xhr.timeout = 10000;
        xhr.open("GET", url, true);
        xhr.send();
    },
    requestJson:function(url, callbackFunc)
    {
        this.request(url, function(result, response)
        {
            if(result)
            {
                cc.log("requestJson: " + response);

                try{
                    var data = JSON.parse(response);
                    callbackFunc(true, data);
                }
                catch(e){
                    cc.log("callbackFunc is wrong!");
                }
            }
            else
            {
                callbackFunc(false);
            }
        });
    }
};