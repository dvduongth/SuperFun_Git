/**
 * Created by GSN on 9/30/2015.
 */

var SocialConfig = {
    google_client_id: "1079202670233-dn7l3rf2da68nnmb8l7judgj42lvqfq8.apps.googleusercontent.com",
    zalo_payment_key: "",//"H77LTEHr4Xoxhg7Eb1ot",
    zalo_app_id: "",//"333155469258012344",
    zalo_secret_key: "",//"Jvu5pU2sTLdG6M15qMk4",
    AppIDGSNTracker: "",//"cotyphu",
    GoogleAppIdWP: "",//"896325129318-73ru3js2j6bpci5f2m10c61ip518l05p.apps.googleusercontent.com",
    GoogleAppSecret: "",//"q3WHVJxGRSdRrNT-l2sydnWc",
    FBAppIDName: "",// "916414948415450",
    FBStoreAppIDName: ""//"a31c46c5f25647449bd2edefaef600ca"
};


gv.socialMgr = {
    KEY_SESSION:"session_key",
    KEY_CUSTOM_LOGIN:"custom_login_key",
    KEY_CURRENT_SOCIAL_TYPE:"social_key",
    currentLoginType:SOCIAL_TYPE.UNKNOWN,
    selectLoginType:SOCIAL_TYPE.UNKNOWN,

    init:function()
    {
        this.currentLoginType = fr.LocalStorage.getNumberFromKey(this.KEY_CURRENT_SOCIAL_TYPE,SOCIAL_TYPE.UNKNOWN);
        this.selectLoginType = this.currentLoginType;
        cc.log("currentLoginType: " + this.currentLoginType);

        if(cc.sys.os != cc.sys.OS_WINDOWS){
            fr.zalo.init();
            fr.facebook.init();
            fr.google.init(SocialConfig.google_client_id);
        }
    },

    loginSocial:function(type,username, pwd)
    {
        if (cc.sys.os == cc.sys.OS_WINDOWS){
            this.selectLoginType = type;
            this.onLoginSocialResult(fr.portal.SUCCESS, username);
            return;
        }
        this.selectLoginType = type;
        switch (type)
        {
            case SOCIAL_TYPE.FACEBOOK:
                this.loginFacebook();
                break;
            case SOCIAL_TYPE.GOOGLE:
                this.loginGoogle();
                break;
            case SOCIAL_TYPE.ZALO:
                this.loginZalo();
                break;
            case SOCIAL_TYPE.ZINGME:
                this.loginZingMe(username, pwd);
                break;
            default :
                cc.log("Not Supported! " + type);
                break;
        }
    },

    loginZalo:function()
    {
       // gv.addTaskTrying();
        fr.portal.loginZalo(this.onLoginSocialResult.bind(this));
    },

    loginZingMe:function(username, pwd)
    {
        //gv.addTaskTrying();
        fr.portal.loginZingMe(username,pwd,this.onLoginSocialResult.bind(this));
    },

    loginFacebook:function()
    {
       // gv.addTaskTrying();
        fr.portal.loginFacebook(this.onLoginSocialResult.bind(this));
    },

    loginGoogle:function()
    {
      //  gv.addTaskTrying();
        fr.portal.loginGoogle(this.onLoginSocialResult.bind(this));
    },

    onLoginSocialResult:function(result,session)
    {
        //gv.hideTrying();

        //this.signal.dispatch(result,session);
        if(result == fr.portal.SUCCESS)
        {
            this.currentLoginType = this.selectLoginType;
            //save data
            fr.LocalStorage.setStringFromKey(this.KEY_SESSION,session);
            fr.LocalStorage.setNumberFromKey(this.KEY_CURRENT_SOCIAL_TYPE,this.currentLoginType);

            gv.guiMgr.getGuiById(GuiId.LOGIN).onLoginSocialSuccess(session);
        }
        //login failed
        else{
            gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
        }
    },

    logout:function()
    {
        //clear session
        fr.LocalStorage.setStringFromKey(this.KEY_SESSION,"");
        //todo: logout each social
    },

    autoLogin:function()
    {
        if(cc.sys.os == cc.sys.OS_WINDOWS)
        {
            gv.guiMgr.getGuiById(GuiId.LOGIN).setEnableSocialButton(true);
            return false;
        }
        if(this.currentLoginType == SOCIAL_TYPE.UNKNOWN)
        {
            gv.guiMgr.getGuiById(GuiId.LOGIN).setEnableSocialButton(true);
            return false;
        }else {
            var session = fr.LocalStorage.getStringFromKey(this.KEY_SESSION, "");
            cc.log("autoLogin:" + session);
            if (session.length == 0) {
                gv.guiMgr.getGuiById(GuiId.LOGIN).setEnableSocialButton(true);
                return false;
            }
            else
            {
                this.onLoginSocialResult(fr.portal.SUCCESS, session);
                return true;
            }
        }
    },

    trackGSNLogin:function(userId, userName)
    {
        if(cc.sys.os == cc.sys.OS_WINDOWS)
        {
            return;
        }
        fr.zalo.sendLoginTracking(userName, this.currentLoginType);
        var delayTracking = 7000;
        var self = this;
        setTimeout(function()
        {
            var accountType = "";
            var openAccount = self.getCurrentSocialId();
            switch (self.currentLoginType)
            {
                case SOCIAL_TYPE.FACEBOOK:
                    accountType = fr.portal.FACEBOOK;
                    break;
                case SOCIAL_TYPE.GOOGLE:
                    accountType = fr.portal.GOOGLE;
                    break;
                case SOCIAL_TYPE.ZALO:
                    accountType = fr.portal.ZALO;
                    break;
                case SOCIAL_TYPE.ZINGME:
                    accountType = fr.portal.ZING_ME;
                    break;
            }
            cc.log("trackGSNLogin: userId  = " + userId + " accountType = " + accountType + " openAccount = " + openAccount + " userName = "+ userName);
            fr.platformWrapper.trackLoginGSN(userId, accountType, openAccount, userName);
        }, delayTracking);
    },

    getCurrentSocialId:function()
    {
        if(cc.sys.os == cc.sys.OS_WINDOWS)
        {
            return  UserData.getInstance().userName;
        }
        switch (this.currentLoginType)
        {
            case SOCIAL_TYPE.FACEBOOK:
                return fr.facebook.getCurrentUsername();
            case SOCIAL_TYPE.GOOGLE:
                return fr.google.getCurrentUsername();
            case SOCIAL_TYPE.ZALO:
                return fr.zalo.getCurrentUsername();
            case SOCIAL_TYPE.ZINGME:
                return fr.zingme.getCurrentUsername();
        }
        return "";
    },

    getCurrentSocialName: function(){
        switch (this.currentLoginType)
        {
            case SOCIAL_TYPE.FACEBOOK:
                return "facebook";
            case SOCIAL_TYPE.GOOGLE:
                return "google";
            case SOCIAL_TYPE.ZALO:
                return "zalo";
            case SOCIAL_TYPE.ZINGME:
                return "zingme";
        }
        return "unknown_social";
    }
};
