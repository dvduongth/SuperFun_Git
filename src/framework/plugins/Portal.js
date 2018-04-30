/**
 * Created by GSN on 9/29/2015.
 */
PORTAL_ERROR = {
    PARSE_JSON_FAIL:1001,
    FAIL:1002,
    CANNOT_CONNECT_TO_SERVER:1010,
    CONNECTION_TIMEOUT:1010,
    CONNECTION_ABORTED:1010
};
fr.portal = {
    SUCCESS:0,
    ZING_ME:"zingme",
    FACEBOOK:"facebook",
    GOOGLE:"google",
    ZALO:"zalo",
    GAME_ID:"cocangua",//dev
    DISTRIBUTION:"vng",
    CLIENT_INFO:"cocangua",

    loginCallBack:null,

    loginZalo:function(callback)
    {
        this.loginCallBack = callback;
        fr.zalo.login(this.loginZaloResult.bind(this));
    },

    loginZaloResult:function(result,token)
    {
        if(result == 0)
        {
            this.requestSessionKeyFromPortal(this.loginCallBack,this.ZALO,token);
        }else{
            this.loginCallBack(result,"");
        }
    },

    //zing
    loginZingMe:function(username, pwd,callback)
    {
        this.loginCallBack = callback;
        //fr.zingme.login(username,pwd,this.loginZingMeResult.bind(this));
        fr.zingme.login(username,pwd,this.loginZingMeResult.bind(this));
    },

    loginZingMeResult:function(result,token)
    {
        if(result  ==  ZING_PORTAL_ERROR.SUCCESS)
        {
            this.requestSessionKeyFromPortal(this.loginCallBack,this.ZING_ME,token);

        }else{
            this.loginCallBack(result,"");
        }
    },

    //facebook
    loginFacebook:function(callback)
    {
        this.loginCallBack = callback;
        fr.facebook.login(this.loginFacebookResult.bind(this));
    },

    loginFacebookResult:function(result,token)
    {
        if(result == 0)
        {
            this.requestSessionKeyFromPortal(this.loginCallBack,this.FACEBOOK,token);
        }else{
            this.loginCallBack(result,"");
        }
    },

    //google
    loginGoogle:function(callback)
    {
        this.loginCallBack = callback;
        fr.google.login(this.loginGoogleResult.bind(this));
    },

    loginGoogleResult:function(result,token)
    {
        if(result == 0)
        {
            this.requestSessionKeyFromPortal(this.loginCallBack,this.GOOGLE,token);
        }else{
            this.loginCallBack(result,"");
        }
    },

    requestSessionKeyFromPortal:function(callback,social,accessToken)
    {

        var url = "http://zplogin.g6.zing.vn/?service_name=getSessionKey&gameId=" + this.GAME_ID + "&distribution="
            + this.DISTRIBUTION + "&clientInfo="+this.CLIENT_INFO + "&social=" + social + "&accessToken="+
            accessToken;

        cc.log("url:" + url);
        var self = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            cc.log("requestSessionKeyFromPortal: xhr.onreadystatechange: " + xhr.readyState + ", " + xhr.status );
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;

                cc.log("requestSessionKeyFromPortal: " + response);
                try{
                    var data = JSON.parse(response);
                    if(data.error == self.SUCCESS)
                    {
                        cc.log("getSessionKeySuccess:" + data.sessionKey);
                        callback(data.error,data.sessionKey);
                    }else{
                        cc.log("getSessionKeyError");
                        callback(data.error);
                    }

                }catch(e){
                    //   cc.log("Parse json from session key error!");
                    //  throw e;
                    //  callback(PORTAL_ERROR.PARSE_JSON_FAIL,"");
                }
            }
            else{
                callback(PORTAL_ERROR.FAIL,"");
            }
        };
        xhr.onerror = function(){
            callback(PORTAL_ERROR.CANNOT_CONNECT_TO_SERVER,"");
        };
        xhr.ontimeout = function(){
            callback(PORTAL_ERROR.CONNECTION_TIMEOUT,"");
        }
        xhr.onabort = function () {
            callback(PORTAL_ERROR.CONNECTION_ABORTED,"");
        };
        xhr.timeout = 5000;
        xhr.open("GET", url, true);
        xhr.send();
    }
};