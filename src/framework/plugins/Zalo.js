/**
 * Created by GSN on 9/28/2015.
 */

var ZALO = {
    //method
    METHOD_ID_SMS:"0",
    METHOD_ID_ATM:"1",
    METHOD_ID_MERGE_CARD:"2",
    METHOD_ID_REDEEM_CODE:"3",
    METHOD_ID_ZING_CARD:"4",
    METHOD_ID_ZING_XU:"5",
    METHOD_ID_TELCO:"6",
    METHOD_ID_TELCO_MOBI:"7",
    METHOD_ID_TELCO_VIETTEL:"8",
    METHOD_ID_TELCO_VINAPHONE:"9",
    URL_OPEN_API: "http://openapi.zaloapp.com/",
    URL_AUTH: "http://oauth.zaloapp.com/v2/access_token",

    LIST_ALL_FRIENDS:0,
    LIST_PLAYED_GAME_FRIENDS:1,
    LIST_NOT_PLAY_GAME_FRIENDS:2,

    RESULT_CODE_NO_ERROR:                   0,
    RESULT_CODE_PERMISSION_DENIED:          -201,
    RESULT_CODE_USER_BACK:                  -1111,
    RESULT_CODE_USER_REJECT:                -1114,
    RESULT_CODE_ZALO_UNKNOWN_ERROR:         -1112,
    RESULT_CODE_UNEXPECTED_ERROR:           -1000,
    RESULT_CODE_INVALID_APP_ID:             -1001,
    RESULT_CODE_INVALID_PARAM:              -1002,
    RESULT_CODE_INVALID_SECRET_KEY:         -1003,
    RESULT_CODE_INVALID_OAUTH_CODE:         -1004,
    RESULT_CODE_ACCESS_DENIED:              -1005,
    RESULT_CODE_INVALID_SESSION:            -1006,
    RESULT_CODE_CREATE_OAUTH_FAILED:        -1007,
    RESULT_CODE_CREATE_ACCESS_TOKEN_FAILED: -1008,
    RESULT_CODE_USER_CONSENT_FAILED:        -1009,
    RESULT_CODE_APPLICATION_IS_NOT_APPROVED: -1014,
    RESULT_CODE_ZALO_OAUTH_INVALID:         -1019,
    RESULT_CODE_CANT_LOGIN_ZINGME:          -1023,
    RESULT_CODE_CANT_LOGIN_FACEBOOK:        -1105,
};

fr.zalo = {
    pluginIAP:null,
    paymentKey:"VGXP6ZFeFOT7c6bNIY7T",
    appID:"886069767341830156",
    secretKey:"YuLBB6xG3UWG6IB6XnRx",

    purchaseSMS:function(mount, userId, userName)
    {
        cc.log("purchaseSMS: " + mount + ", " + userId + ", " + userName);
        var paramMap = {};
        paramMap["securityMode"] = "1";
        paramMap["paymentKey"] = fr.zalo.paymentKey;
        paramMap["methodType"] = ZALO.METHOD_ID_SMS;
        var paymentInfo = {
            appTranxID:"TX_" + Date.now(),
            description:"Purchase SMS",
            displayInfo:"Purchase SMS in Co Ca Ngua",
            displayName:"Purchase SMS",
            embedData:userName+":"+userId+":2",
            appUser:userName+":"+userId,
            payType:"inapp",
            items:[
                {
                    itemID: "ID_" + mount,
                    itemName:"SMS_" + mount,
                    itemPrice:mount,
                    itemQuantity:1
                }
            ]
        };
        paramMap["paymentInfo"] =  JSON.stringify(paymentInfo);
        this.pluginIAP.payForProduct(paramMap);
        this.pluginIAP.setListener(this);
    },

    purchaseWithZaloGui:function(userId, userName, displayName, displayInfo, description)
    {
        cc.log("purchaseWithZaloGui" + ", " + userId + ", " + userName);

        var paramMap = {};
        paramMap["securityMode"] = "1";
        paramMap["paymentKey"] = fr.zalo.paymentKey;
        //danh sach nap tien khong dung
        paramMap["paymentOption"] = '{"excludePaymentMethodTypes":["ATM","ZING_CARD","ZING_XU","GOOGLE_WALLET","REDEEM_CODE","MERGE_CARD","SMS"]}';
        var paymentInfo = {
            appTranxID:"TX_" + Date.now(),
            description:description,
            displayInfo:displayInfo,
            displayName:displayName,
            embedData:userName+":"+userId+":1",
            appUser:userName+":"+userId,
            payType:"inapp"
        };
        paramMap["paymentInfo"] =  JSON.stringify(paymentInfo);
        this.pluginIAP.payForProduct(paramMap);
    },

    purchaseTelcoForCCN:function() {
        //if (gv.isTestingGame) {
        //    EffectText.show(gv.guiMgr.getCurrentScreen(), fr.Localization.text("ALERT_8"),cc.p(cc.winSize.width/2, 100));
        //    return;
        //}
        var userId = UserData.getInstance().uid;
        var userName = UserData.getInstance().userName;

        var displayName = fr.Localization.text("zalo_payment_display_name");
        var displayInfo = fr.Localization.text("zalo_payment_display_info");
        var description = fr.Localization.text("zalo_payment_description");

        this.purchaseWithZaloGui(userId, userName, displayName, displayInfo, description);
    },

    purchaseVipCCN:function() {
        //if (gv.isTestingGame) {
        //    EffectText.show(gv.guiMgr.getCurrentScreen(), fr.Localization.text("ALERT_8"),cc.p(cc.winSize.width/2, 100));
        //    return;
        //}
        var userId = UserData.getInstance().uid;
        var userName = UserData.getInstance().userName;

        var displayName = fr.Localization.text("zalo_payment_display_name_vip");
        var displayInfo = fr.Localization.text("zalo_payment_display_info_vip");
        var description = fr.Localization.text("zalo_payment_description_vip");

        var paramMap = {};
        paramMap["securityMode"] = "1";
        paramMap["paymentKey"] = fr.zalo.paymentKey;
        //danh sach nap tien khong dung
        paramMap["paymentOption"] = '{"excludePaymentMethodTypes":["ATM","ZING_CARD","ZING_XU","GOOGLE_WALLET","REDEEM_CODE","MERGE_CARD","SMS"]}';
        var paymentInfo = {
            appTranxID:"TX_" + Date.now(),
            description:description,
            displayInfo:displayInfo,
            displayName:displayName,
            embedData:userName+":"+userId+":3", //3 la invest
            appUser:userName+":"+userId,
            payType:"inapp"
        };
        paramMap["paymentInfo"] =  JSON.stringify(paymentInfo);
        this.pluginIAP.payForProduct(paramMap);
    },

    init:function()
    {
        fr.zalo.isProcessingGetFriend = false;
        fr.zalo.listFriends = [];
        for(var i = 0; i < 3; i ++)
        {
            fr.zalo.listFriends.push(null);
        }
        if(plugin.PluginManager == null)
            return;
        if(fr.zalo.pluginIAP == null) {
            this.oauthCode = fr.StorageUtil.getStringFromKey("ZaloOauthCode",null);
            var pluginManager = plugin.PluginManager.getInstance();
            fr.zalo.pluginIAP = pluginManager.loadPlugin("IAPZalo");
            if(fr.zalo.pluginIAP == null)
                return;
            fr.zalo.pluginIAP.setListener(this);
            fr.zalo.pluginUser = pluginManager.loadPlugin("UserZalo");
        }
    },

    onPayResult: function (ret, msg, productInfo) {
        cc.log("onPayResult ret is " + ret);
        /*
        //complete
        if (ret == 4) {
            if(productInfo.result != null)
            {
                fr.platformWrapper.logAppFlyerPurchase(productInfo.mount, "", "","VND");
            }
        }
        */
    },

    login:function(callback)
    {
        if(this.pluginUser == null)
        {
            //false
            callback(-1,"");
            return;
        }
        this.accessToken = null;
        fr.zalo.pluginUser.logout();
        fr.zalo.pluginUser.login(function (type, msg) {
            var data = JSON.parse(msg);

            var token = data.oauthCode;
            cc.log("finish login zalo: " + type + ", " + msg);
            if(type != SOCIAL_ACTION.LOGOUT_SUCCEED) {
                if(type == SOCIAL_ACTION.SUCCEED)
                {
                    fr.zalo.oauthCode = token;
                    fr.StorageUtil.setStringFromKey("ZaloOauthCode", token);
                    fr.StorageUtil.setStringFromKey("ZaloUserId", data.userId);
                }
                callback(type, token);
            }
        });
    },

    getCurrentUsername:function()
    {
        return fr.StorageUtil.getStringFromKey("ZaloUserId","");
    },

    requestAccessToken: function(callback)
    {
        if(this.accessToken != null)
        {
            callback(true, this.accessToken);
        }else {
            var url = "http://oauth.zaloapp.com/v2/access_token?";
            url += "app_id=" + fr.zalo.appID + "&app_secret=" + fr.zalo.secretKey + "&code=" + fr.zalo.oauthCode;
            fr.Network.requestJson(url, function(result, data)
            {
                if(result && data.access_token != undefined)
                {
                    fr.zalo.accessToken = data.access_token;
                    callback(true, data.access_token);
                }else
                {
                    callback(false);
                }
            })
        }
    },

    /**
     *
     * @param message
     * @param imagePath
     * @param callbackFunc
     */
    sharePhoto: function(message, imagePath, callbackFunc)
    {
        this.requestAccessToken(function(result, accessToken){
            if(result)
            {
                var multi = fr.HttpMultipart.create("http://openapi.zaloapp.com/upload",function(data){
                    try{
                        var obj = JSON.parse(data);
                        if(obj["result"] && (obj["result"] != ""))
                        {
                            var userId = fr.LocalStorage.getStringFromKey("ZaloUserId");
                            var url = "http://openapi.zaloapp.com/social?act=pushfeed&appid=" +
                                fr.zalo.appID +"&accessTok="+accessToken+"&fromuid=" + userId +"&touid=" +userId +
                                "&message="+ message +"&image="+obj["result"]+"&version=2";
                            var link = encodeURI(url);
                            fr.Network.requestJson(link,function(result, data)
                            {
                                cc.log("share image result: " + JSON.stringify(data));
                                if(!result)
                                {
                                    callbackFunc(false);
                                }else
                                {
                                    callbackFunc(true);
                                }
                            });
                        }
                        else
                        {
                            callbackFunc(false, "");
                        }
                    }
                    catch(e){
                        callbackFunc(false, "");
                    }
                }.bind(this));
                multi.addFormPart("act","image");
                multi.addFormPart("appid",fr.zalo.appID);
                multi.addFormPart("accessTok",accessToken);
                multi.addImage("upload","ic_launcher.png",imagePath);
                multi.executeAsyncTask();
            }else
            {
                callbackFunc(false, "can't get AccessToken!");
            }
        }.bind(this));
    },

    sendLoginTracking:function(userId, socialType) {
        if(this.pluginIAP != null)
        {
            var data= {};
            data["socialType"] = socialType.toString();
            data["userId"] = userId.toString();
            cc.log("sendLoginTracking: ",data);
            fr.zalo.pluginIAP.callFuncWithParam("sendLoginTracking",
                new plugin.PluginParam(plugin.PluginParam.ParamType.TypeStringMap, data));
        }
    },

    getFriend: function (type, callbackFunc) {
        //Moi lan vao app chi request 1 lan neu thanh cong
        var self = this;
        if(self.isProcessingGetFriend) {
            callbackFunc(false);
            return;
        }
        this.isProcessingGetFriend = true;
        if(this.listFriends[type] != null)
        {
            callbackFunc(true,this.listFriends[type]);
            this.isProcessingGetFriend = false;
            return;
        }

        var pos = 0;
        var count = 50;
        var listAllFriends = [];
        var requestFriendCallback = function(result, listFriends)
        {
            if(result)
            {
                listAllFriends = listAllFriends.concat(listFriends);
                if(listFriends.length == 0 || listFriends.length < count)
                {
                    self.isProcessingGetFriend = false;
                    self.listFriends[type] =  listFriends;
                    callbackFunc(true, listAllFriends);
                    return;
                }

                pos += count;
                self.requestFriendList(pos, count, type, requestFriendCallback);
            }else
            {
                self.isProcessingGetFriend = false;
                callbackFunc(false);
            }
        };
        this.requestFriendList(pos, count, type, requestFriendCallback);
    },

    //requestFriendList
    requestFriendList:function(pos, count, type, callbackFunc)
    {
        this.requestAccessToken(function(result, accessToken) {

            if (result) {
                var url = "http://openapi.zaloapp.com/query?act=lstfri";
                url += "&appid=" + fr.zalo.appID + "&accessTok=" + accessToken + "&pos=" + pos + "&count=" + count + "&type=" + type + "&version=2";

                NetworkUtil.request(url, function(result, response)
                {
                    //userId in zalo is long type
                    //Numbers in ECMAScript are internally represented double-precision floating-point
                    if(response.indexOf('userId":"') < 0) {
                        response = response.replace(/userId":/g, 'userId":"');
                        response = response.replace(/,"usingApp"/g, '","usingApp"');
                    }
                    var data = JSON.parse(response);
                    if(result && data.error == 0)
                    {
                        callbackFunc(true, data.result);
                    }else
                    {
                        callbackFunc(false);
                    }
                })
            }
            else
            {
                callbackFunc(false);
            }
        });
    },

    //Request invite friend
    requestInviteMessage:function(toIdList, message, callbackFunc, idImage)
    {
        if(toIdList.length == 0)
        {
            if(callbackFunc != undefined)
            {
                callbackFunc(SOCIAL_ACTION.FAILED, "List friend empty!")
            }
            return;
        }
        this.requestAccessToken(function(result, accessToken)
        {
            if(result)
            {
                var txtListId = "";
                for(var i = 0; i < toIdList.length; i++)
                {
                    if(i > 0)
                        txtListId += ";";
                    txtListId += toIdList[i];
                }
                var link = "http://openapi.zaloapp.com/";
                link += "message?act=";
                link += "invite&appid=";
                link += fr.zalo.appID;
                link += "&accessTok=";
                link += accessToken;
                link += "&fromuid=";
                link += fr.StorageUtil.getStringFromKey("ZaloUserId");
                link += "&touid=";
                link += txtListId + ";";
                link += "&message=";
                link += message;
                if(idImage != undefined) {
                    link += "&image=";
                    link += idImage;
                }
                link += "&isnotify=true&subdata=utmInviteFr&version=2";

                NetworkUtil.requestJson(encodeURI(link),function(result, data)
                {
                    if(!result || data.error != undefined)
                    {
                        callbackFunc(SOCIAL_ACTION.FAILED);
                    }else
                    {
                        callbackFunc(SOCIAL_ACTION.SUCCEED);
                    }
                });
            }else
            {
                callbackFunc(false, "Can't get access token!");
            }
        });
    }
};