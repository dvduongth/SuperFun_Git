/**
 * Created by GSN on 9/30/2015.
 */

fr.google = {
    pluginUser:null,
    init:function(googleClientID)
    {
        if(!cc.sys.isNative) {
            return false;
        }
        if(plugin.PluginManager == null)
            return false;
        if(fr.google.pluginUser == null) {
            if(cc.sys.isNative) {
                var pluginManager = plugin.PluginManager.getInstance();
                fr.google.pluginUser = pluginManager.loadPlugin("UserGoogle");
            }else
            {
                fr.google.pluginUser = plugin.GoogleAgent.getInstance();
            }
            var data = {
                googleClientID:googleClientID
            };
            if(fr.google.pluginUser != null) {
                fr.google.pluginUser.configDeveloperInfo(data);
            }
        }
        return true;
    },
    login:function(callback)
    {
        if(this.pluginUser == null)
        {
            //false
            callback(-1,"");
            return;
        }

        fr.google.pluginUser.login(function (type, msg) {
            var token = msg;
            if  (cc.sys.platform == cc.sys.WP8 || cc.sys.platform == cc.sys.WINRT) {
                var tmp = JSON.parse(msg);
                token = tmp.accessToken;
            }
            cc.log("finish login google: " + type + ", " + msg);
            if(type != SOCIAL_ACTION.LOGOUT_SUCCEED) {
                fr.google.userId = fr.google.pluginUser.callStringFuncWithParam("getUserID");
                fr.LocalStorage.setStringFromKey("GoogleUserId",fr.google.userId);
                //callback(type, token);
                setTimeout(function() {callback(type, token);}, 500);
                fr.google.pluginUser.logout();
            }
        });
    },
    getCurrentUsername:function()
    {
        return fr.LocalStorage.getStringFromKey("GoogleUserId","");
    }
};
