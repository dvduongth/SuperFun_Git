/**
 * Created by GSN on 9/29/2015.
 */

ZING_PORTAL_ERROR = {
    SUCCESS:0,
    FATAL_ERROR:                -1,
    REQUEST_BODY_INVALID:       -2,
    USERNAME_INVALID:           10,
    PASSWORD_INVALID:           11,
    USERNAME_ALREADY_EXISTED:   12,
    USERNAME_DOES_NOT_EXISTED:  13,
    SESSION_VALID:              14,
    SESSION_INVALID:            15,
    ZPID_DOES_NOT_EXIST:        16,
    DEVICE_ID_INVALID:          17,
    PARTNER_ID_INVALID:         18,
    USERNAME_PASSWORD_NOT_MATCH: 30,
    WRONG_PASSWORD: 6,

    PARSE_JSON_FAIL:1001,
    FAIL:1002
};

zingmeLoginData = {
    //gameId: zingmeGameId,
    service_name:"zacc_login",
    username:"",
    password:""
};

zingmeRegisterData = {
    //gameId: zingmeGameId,
    service_name:"zacc_register",
    username:"",
    password:""
};

fr.zingme = {
    KEY_USER:"key_zm_user",
    KEY_PASS:"key_zm_pass",

    login:function(username, password, callback){

        var url = "http://myplay.apps.zing.vn/sso3/login.php?username=" + username + "&password=" + password;
        var xhr = cc.loader.getXMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                var data = JSON.parse(response);
                if(data != null) {
                    if (data.error == 0) {
                        //luu thong tin lai
                        self.saveUserInfo(username,password);

                        callback(ZING_PORTAL_ERROR.SUCCESS, data.sessionKey);
                    } else {
                        self.saveUserInfo(username,"");

                        callback(data.error, "");
                    }
                }else{
                    callback(ZING_PORTAL_ERROR.PARSE_JSON_FAIL,"");
                }
            }
            else{
                if(!cc.sys.isNative && (xhr.status == 200 || xhr.status == 0))
                {
                    return;
                }
                callback(ZING_PORTAL_ERROR.FAIL,"");
            }
        };
        xhr.onerror = function(){
            cc.log("onerror");
            callback(PORTAL_ERROR.CANNOT_CONNECT_TO_SERVER,"");
        };
        xhr.ontimeout = function(){
            cc.log("ontimeout");
            callback(PORTAL_ERROR.CONNECTION_TIMEOUT,"");
        };
        xhr.onabort = function () {
            cc.log("onabort");
            callback(PORTAL_ERROR.CONNECTION_ABORTED,"");
        };
        xhr.timeout = 5000;
        xhr.open("GET",url, true);
        xhr.send();
    },

    //onLoginComplete:function(response,callback){
    //    if(response.status  ==  ZING_PORTAL_ERROR.SUCCESS){//zingmeCodeSuccess
    //        //fr.portal.setCurrentSocial(fr.portal.ZING_ME);
    //        fr.LocalStorage.setNumberFromKey(fr.portal.ZING_ME + "_uid", response.data.zpid);
    //        fr.LocalStorage.setStringFromKey(fr.portal.ZING_ME + "_username", zingmeLoginData.username);
    //
    //        //fr.portal.getSessionKeyFromPortal(response.data.sid, SocialName.ZingPortal);
    //        callback(response.status,response.data.sessionKey);
    //        //fr.portal.requestSessionKeyFromPortal(callback,response.data.sid, fr.portal.ZING_ME);
    //    }else{
    //        // un-schedule show login fail
    //        //asyncTaskMgr.removeATaskByKey("login_fail");
    //
    //        this.showError(response.status);
    //        fr.LocalStorage.setStringWithCrypt(fr.portal.ZING_ME + "_password", "");
    //    }
    //},

    register:function(username, password,callback){
        var xhr = cc.loader.getXMLHttpRequest();
        var url = "http://myplay.apps.zing.vn/sso3/register.php?username=" + username + "&password=" + password;
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var response = xhr.responseText;
                cc.log("response: " + response);
                var data = JSON.parse(response);
                if(data != null)
                {
                    //dk tai khoan thanh cong, luu thong tin user lai de tu dong dang nhap
                    if(data.error == ZING_PORTAL_ERROR.SUCCESS)
                    {
                        self.saveUserInfo(username,password);
                    }

                    callback(data.error,"");
                }
                else
                {
                    callback(ZING_PORTAL_ERROR.PARSE_JSON_FAIL,"");
                }

            }
            else{
                if(!cc.sys.isNative && (xhr.status == 200 || xhr.status == 0))
                {
                    return;
                }
                callback(ZING_PORTAL_ERROR.FAIL,"");
            }
        };


        xhr.timeout = 5000;
        xhr.open("GET", url, true);
        xhr.send();
    },

    //onRegisterComplete: function(response){
    //    //LogUtils.log("zing me register complete:" + JSON.stringify(response));
    //
    //    if(response.status === ZING_PORTAL_ERROR.SUCCESS){
    //        //PlatformUtils.makeToast("zp register access token\n" + response.data.sid);
    //
    //        //fr.portal.setCurrentSocial(fr.portal.ZING_ME);
    //        fr.LocalStorage.setNumberFromKey(fr.portal.ZING_ME + "_uid", response.data.zpid);
    //        fr.LocalStorage.setStringFromKey(fr.portal.ZING_ME + "_username", zingmeRegisterData.username);
    //
    //        // get session key from zing play portal
    //        fr.portal.getSessionKeyFromPortal(response.data.sid, fr.portal.ZING_ME, response.data.zpid + "");
    //    }
    //    else{
    //        this.showError(response.status);
    //        fr.LocalStorage.setStringWithCrypt(fr.portal.ZING_ME + "_password", "");
    //    }
    //},

    showError: function(errorCode){
        switch (errorCode){
            case ZING_PORTAL_ERROR.SUCCESS:
                return;
            case ZING_PORTAL_ERROR.USERNAME_PASSWORD_NOT_MATCH:
                Popups.showMessage("ERROR_INCORRECT_INPUT");
                break;
            case ZING_PORTAL_ERROR.USERNAME_ALREADY_EXISTED:
                Popups.showMessage("ERROR_EXISTENCE_ACCOUNT");
                break;
            case ZING_PORTAL_ERROR.USERNAME_DOES_NOT_EXISTED:
            case ZING_PORTAL_ERROR.USERNAME_INVALID:
                Popups.showMessage("ERROR_INVALID_ACCOUNT");
                break;
            case ZING_PORTAL_ERROR.WRONG_PASSWORD:
            case ZING_PORTAL_ERROR.PASSWORD_INVALID:
                Popups.showMessage("ERROR_INCORRECT_PASSWORD");
                break;
            case ZING_PORTAL_ERROR.SESSION_INVALID:
            case ZING_PORTAL_ERROR.ZPID_DOES_NOT_EXIST:
            case ZING_PORTAL_ERROR.DEVICE_ID_INVALID:
            case ZING_PORTAL_ERROR.PARTNER_ID_INVALID:
            default:
                Popups.showMessage(languageMgr.getString("ERROR_WHEN_LOGIN_FROM_SOCIAL").replace("@socialName", fr.portal.ZING_ME) + "\ncode: " + errorCode);
                break;
        }
    },

    getCurrentUsername:function()
    {
        var user = fr.LocalStorage.getStringFromKey(this.KEY_USER,"");
        if( user != null)
            return user;
        return "";
    },
    //getCurrentPassword:function()
    //{
    //    return fr.UserData.getStringWithCrypt(this.KEY_PASS,"");
    //},
    saveUserInfo:function(user, pass)
    {
        fr.LocalStorage.setStringFromKey(this.KEY_USER,user);
        fr.LocalStorage.setStringWithCrypt(this.KEY_PASS,pass);
    }
};