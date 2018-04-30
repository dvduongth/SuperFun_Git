/**
 * Created by user on 12/5/2016.
 */

var GuiSettingLobby = BasePopup.extend({

    ctor: function(){
        this._super(res.ZCSD_GUI_SETTING_LOBBY);

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(this.destroy.bind(this));

        this.btnSound = this.bg.getChildByName("btn_sound");
        this.btnSound.addClickEventListener(this.onSoundBtnClick.bind(this));
        this.btnSound.setPressedActionEnabled(false);
        this.setSoundState(fr.Sound.effectOn);

        this.btnMusic = this.bg.getChildByName("btn_music");
        this.btnMusic.addClickEventListener(this.onMusicBtnClick.bind(this));
        this.btnMusic.setPressedActionEnabled(false);
        this.setMusicState(fr.Sound.musicOn);


        var btnGiftCode = this.bg.getChildByName("btn_giftcode");
        btnGiftCode.addClickEventListener(this.onGiftCodeBtnClick.bind(this));

        var btnSupport = this.bg.getChildByName("btn_support");
        btnSupport.addClickEventListener(this.onSupportBtnClick.bind(this));

        var btnZingme = this.bg.getChildByName("btn_zingme");
        btnZingme.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.ZINGME));

        var btnFacebook = this.bg.getChildByName("btn_fb");
        btnFacebook.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.FACEBOOK));

        var btnGoogle = this.bg.getChildByName("btn_google");
        btnGoogle.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.GOOGLE));

        var btnZalo = this.bg.getChildByName("btn_zalo");
        btnZalo.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.ZALO));

        var uIdText = this.bg.getChildByName("uid_text");
        uIdText.setString(UserData.getInstance().uid);

        var currentSocial = this.bg.getChildByName("current_social");
        switch (gv.socialMgr.selectLoginType){
            case SOCIAL_TYPE.ZINGME:
                currentSocial.setPositionX(btnZingme.getPositionX());
                btnZingme.setTouchEnabled(false);
                break;
            case SOCIAL_TYPE.FACEBOOK:
                currentSocial.setPositionX(btnFacebook.getPositionX());
                btnFacebook.setTouchEnabled(false);
                break;
            case SOCIAL_TYPE.GOOGLE:
                currentSocial.setPositionX(btnGoogle.getPositionX());
                btnGoogle.setTouchEnabled(false);
                break;
            case SOCIAL_TYPE.ZALO:
                currentSocial.setPositionX(btnZalo.getPositionX());
                btnZalo.setTouchEnabled(false);
                break;
        }
    },

    setSoundState: function(enable){
        cc.log("setSoundState: " + enable);
        this.btnSound.loadTextureNormal("res/lobby/setting_lobby/" + (enable?"setting_btn_on.png":"setting_btn_off.png"), ccui.Widget.LOCAL_TEXTURE);
        var element = this.btnSound.getChildByName("element");
        element.setPositionX(enable?76.55:25.55);
    },

    setMusicState: function(enable){
        cc.log("setMusicState: " + enable);
        this.btnMusic.loadTextureNormal("res/lobby/setting_lobby/" + (enable?"setting_btn_on.png":"setting_btn_off.png"), ccui.Widget.LOCAL_TEXTURE);
        var element = this.btnMusic.getChildByName("element");
        element.setPositionX(enable?76.55:25.55);
    },

    onSoundBtnClick: function(btnSound){
        this.setSoundState(!fr.Sound.effectOn);
        fr.Sound.setSound(!fr.Sound.effectOn);
    },

    onMusicBtnClick: function(btnMusic){
        this.setMusicState(!fr.Sound.musicOn);
        fr.Sound.setMusic(!fr.Sound.musicOn);
    },

    onGiftCodeBtnClick: function(){
        gv.guiMgr.addGui(new GuiGiftCode(), GuiId.GIFT_CODE, LayerId.LAYER_GUI);
    },

    onSupportBtnClick: function(){

    },

    onSocialBtnClick: function(socialType){
        gv.gameClient.sendLogoutRequest();
        gv.guiMgr.removeAllGui();
        gv.socialMgr.logout();

        var guiLogin = new GuiLogin();
        gv.guiMgr.addGui(guiLogin, GuiId.LOGIN, LayerId.LAYER_GUI);
        guiLogin.onSocialBtnClick(socialType);
    }

});