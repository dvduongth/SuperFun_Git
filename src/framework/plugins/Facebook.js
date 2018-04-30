/**
 * Created by GSN on 9/30/2015.
 */

TIME_GET_FB_USER_DELAY = 1000;

fr.facebook = {

    pluginUser: null,


    init: function () {

        if(!cc.sys.isNative) {
            return false;
        }

        if (plugin.PluginManager == null)
            return false;

        if (fr.facebook.pluginUser == null || fr.facebook.pluginShare == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.facebook.pluginUser = pluginManager.loadPlugin("UserFacebook");
            fr.facebook.agent = plugin.FacebookAgent.getInstance();
        }

        return true;
    },
    sharePhoto:function(img, callback)
    {
        var info = {
            "dialog": "sharePhoto",
            "photo": img

        };

        plugin.FacebookAgent.getInstance().dialog(info, function(ret, msg){

            cc.log("msg = " + JSON.stringify(msg));
            if(ret == plugin.FacebookAgent.CODE_SUCCEED)
            {
                callback(true);
            }else
            {
                callback(false);
            }
        })
    },


    login: function (callback) {
        if (this.pluginUser == null) {
            //false
            callback(-1, "");
            return;
        }
        if(this.pluginUser.isLoggedIn())
        {
            this.pluginUser.logout();
            setTimeout(function(){
                fr.facebook.requestLogin(callback);
            }, 0.5);
        }
        else
        {
            fr.facebook.requestLogin(callback);
        }

    },
    requestLogin:function(callback)
    {
        var permissions = ["user_friends", "user_about_me"];
        fr.facebook.agent.login(permissions,function (type, data) {
            //=2 la logout
            if (type != SOCIAL_ACTION.LOGOUT_SUCCEED) {
                if(data!= undefined)
                    fr.StorageUtil.setStringFromKey("FacebookAccessToken", data.accessToken);
                //cuong set time out for callback
                setTimeout(function() {callback(type, data.accessToken);}, 500);
                //callback(type, data.accessToken);

                var userId = fr.facebook.pluginUser.callStringFuncWithParam("getUserID");
                if(userId == "")
                {
                    setTimeout(function(){
                        var userId = fr.facebook.pluginUser.callStringFuncWithParam("getUserID");
                        fr.StorageUtil.setStringFromKey("FacebookUserId", userId);
                    }, TIME_GET_FB_USER_DELAY);
                }else{
                    fr.StorageUtil.setStringFromKey("FacebookUserId", userId);
                }
            }
        });
    },

    getCurrentUsername: function () {
        return fr.StorageUtil.getStringFromKey("FacebookUserId", "");
    },
    getFriendsPlayedGame:function(callbackFunc)
    {
        var accessToken =  fr.StorageUtil.getStringFromKey("FacebookAccessToken", "");
        var url = "https://graph.facebook.com/v2.5/me/friends?fields=id,name,picture&access_token=" + accessToken;
        cc.log("getFriend played game ");
        NetworkUtil.requestJson(url, function(result, data)
        {
            cc.log("result played game = " + result);
            if(result)
            {
                callbackFunc(true, data.data);
            }else
            {
                callbackFunc(false)
            }
        });
    },
    getFriendsNotPlayGame:function(callbackFunc)
    {
        var accessToken =  fr.StorageUtil.getStringFromKey("FacebookAccessToken", "");
        var url = "https://graph.facebook.com/v2.5/me/invitable_friends?fields=id,name,picture&limit=1000&access_token=" + accessToken;
        cc.log("getFriend not play game");
        fr.Network.requestJson(url, function(result, data)
            {
                cc.log("result not played game = " + result);
                if(result)
                {
                    callbackFunc(true, data.data);

                }else
                {
                    callbackFunc(false)
                }
            }
        );
    },
    inviteRequest: function (listFriend, message, callbackFunc, title) {
        if (listFriend.length == 0) {
            if (callbackFunc != undefined) {
                callbackFunc(SOCIAL_ACTION.FAILED, "List friend empty!")
            }
            return;
        }
        var toFriend = "";
        for (var i = 0; i < listFriend.length; i++) {
            var id = "'";
            id += listFriend[i];
            id += "'";

            if (i == listFriend.length - 1) {
                toFriend += id;
            }
            else {
                toFriend += id;
                toFriend += ",";
            }
        }
        if (title == undefined) {
            title = "Invite play game";
        }
        var map = {
            "message": message,
            "title": title,
            "to": toFriend
        };
        plugin.FacebookAgent.getInstance().appRequest(map, function (resultcode, msg) {
            cc.log("appRequest", resultcode, msg);
            if (resultcode == plugin.FacebookAgent.CODE_SUCCEED) {
                callbackFunc(SOCIAL_ACTION.SUCCEED, "Success!");
            }
            else {
                callbackFunc(SOCIAL_ACTION.FAILED, "Failed!");
            }
        });
    }
};