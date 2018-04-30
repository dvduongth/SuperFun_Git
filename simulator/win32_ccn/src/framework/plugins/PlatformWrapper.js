/**
 * Created by KienVN on 10/23/2015.
 */

var ConnectionStatus = {
    NO_NETWORK : 0,
    MOBILE_NETWORK : 1,
    WIFI_NETWORK : 2
}

fr.platformWrapper = {
    init:function()
    {
        if(plugin.PluginManager == null) return false;

        if(fr.platformWrapper.pluginPlatform == null) {
            var pluginManager = plugin.PluginManager.getInstance();
            fr.platformWrapper.pluginPlatform = pluginManager.loadPlugin("PlatformWrapper");
        }
        return true;
    },

    getPhoneNumber:function()
    {
        if(this.pluginPlatform != null)
        {
           return this.pluginPlatform.callStringFuncWithParam("getPhoneNumber");
        }

        return "";
    },

    getMailAccount:function()
    {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getMailAccount");
        }
        return "";
    },

    getDeviceModel:function()
    {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getDeviceModel");
        }
        return "";
    },

    getAvailableRAM:function()
    {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getAvailableRAM");
        }
        return -1;
    },

    getVersionCode:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getVersionCode");
        }
        return -1;
    },

    getOSVersion:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getOSVersion");
        }
        return "";
    },
    //connection type 0: ko co mang, 1: 3g, 2: wifi
    getConnectionStatus:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getConnectionStatus");
        }
        return -1;
    },

    getConnectionStatusName:function() {
        var connectionType =  this.getConnectionStatus();
        switch (connectionType) {
            case 0:
                return "unknown";
            case 1:
                return "3g";
            case 2:
                return "wifi";
        }
        return "";
    },

    getOsName:function() {
        if(sys.platform == sys.WIN32) {
            return "Win32";
        }
        if(sys.platform == sys.ANDROID) {
            return "Android";
        }
        if(sys.platform == sys.IPAD || sys.platform == sys.IPHONE) {
            return "IOS";
        }
        if(sys.platform == sys.WP8) {
            return "WindowPhone8";
        }
        return "";
    },

    getClientVersion:function() {
        return 1;
    },

    getDownloadSource:function() {
        if(this.pluginPlatform != null) {
            //TODO: kienvn
        }
        return "";
    },

    getThirdPartySource:function() {
        if(this.pluginPlatform != null) {
            //TODO: kienvn
        }
        return "";
    },

    hideNavigation:function() {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("hideNavigation", null);
        }
    },

    getExternalDataPath:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callStringFuncWithParam("getExternalDataPath");
        }
        return jsb.fileUtils.getWritablePath();
    },

    addNotify:function(notify) {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("addNotify",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(notify)));
        }
    },

    showNotify:function() {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("showNotify" ,null);
        }
    },

    cancelAllNotification:function() {
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("cancelAllNotification",null);
        }
    },

    getStoreType:function() {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("getStoreType");
        }
    },

    getDeviceID:function() {
        if(this.pluginPlatform != null) {
            var deviceID =  this.pluginPlatform.callStringFuncWithParam("getDeviceID");
            cc.log("DEVICE IDDDD:", deviceID);
            if(deviceID == "")
            {
                return this.getMailAccount();
            }
            return deviceID;
        }
        return "";
    },

    /*
    initializeGSNTracker: function(){
        if(this.pluginPlatform != null) {
            var data = {
                gsnAppName: "poker",
                gsnAppVersion: "1.0.1",
                gsnPartnerId: "GSN",
                locate: servicesMgr.getNational()
            };

            cc.log("initializeGSNTracker: " + JSON.stringify(data));

            this.pluginPlatform.callFuncWithParam("initializeGSNTracker",
                new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));
        }
    },
    */

    //accountType: google , zingme , facebook , zalo
    //openAccount: socialID, voi zingme la username
    trackLoginGSN:function(_accountId, _accountType, _openAccount, _zingName) {

        fr.zalo.sendLoginTracking(_accountId, _accountType);

        cc.log("Platform ", this.pluginPlatform);
        if(this.pluginPlatform != null) {
            cc.log("TRACK:", _accountId, _accountType, _openAccount, _zingName);
            var data = {
                accountId: _accountId,
                accountType: _accountType,
                openAccount: _openAccount,
                zingName: _zingName
            };

            this.pluginPlatform.callFuncWithParam("trackLoginGSN",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, JSON.stringify(data)));
        }
    },

    openCSApplication:function(userId) {
        var data =  "UserId: " + userId + "\n";
        if(this.pluginPlatform != null) {
            this.pluginPlatform.callFuncWithParam("openCSApplication",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, data));
        }
    },

    //zalo uri = "com.zing.zalo";
    isInstalledApp:function(uri) {
        if(this.pluginPlatform != null) {
            return this.pluginPlatform.callIntFuncWithParam("isInstalledApp",
               new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, uri));
        }
        return 0;
    }

};