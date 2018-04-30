/**
 * Created by CPU02384_LOCAL on 4/25/2017.
 */
var GuiLoginZingMe = BaseGui.extend({

    ctor:function(){
        this._super(res.ZCSD_GUI_LOGIN_ZINGME);

        this.bglogin = this._rootNode.getChildByName("bg_login");
        var button_dangky = this.bglogin.getChildByName("button_dangky");
        button_dangky.addClickEventListener(this.onClickButtonDangKy.bind(this));

        this.bglogin.getChildByName("text_box_login").getChildByName("textField_login").setString(fr.LocalStorage.getStringFromKey("zing_me_username", ""));
        this.bglogin.getChildByName("text_box_pass").getChildByName("textField_pass").setString(fr.LocalStorage.getStringFromKey("zing_me_password", ""));

        var buttonDangNhap = this.bglogin.getChildByName("button_dangnhap");
        buttonDangNhap.addClickEventListener(this.onClickButtonLogin.bind(this));

        var buttonZalo = this.bglogin.getChildByName("btn_zalo");
        buttonZalo.addClickEventListener(this.onClickSocialButton.bind(this, SOCIAL_TYPE.ZALO));

        var buttonfacebook = this.bglogin.getChildByName("btn_facebook");
        buttonfacebook.addClickEventListener(this.onClickSocialButton.bind(this, SOCIAL_TYPE.FACEBOOK));

        var buttongoogle = this.bglogin.getChildByName("btn_google");
        buttongoogle.addClickEventListener(this.onClickSocialButton.bind(this, SOCIAL_TYPE.GOOGLE));

        this.bgDangky = this._rootNode.getChildByName("bg_dangky");

        var buttonback = this.bgDangky.getChildByName("button_back");
        buttonback.addClickEventListener(this.onClickButtonBack.bind(this));

        var buttondangky  = this.bgDangky.getChildByName("button_dangky")
        buttondangky.addClickEventListener(this.onClickButtonSignIn.bind(this));

    },

    onClickButtonDangKy:function(){
        this.bglogin.setVisible(false);
        this.bgDangky.setVisible(true);
    },

    onClickButtonBack:function(){
        this.bglogin.setVisible(true);
        this.bgDangky.setVisible(false);
    },

    onClickButtonLogin:function(){
        var username = this.bglogin.getChildByName("text_box_login").getChildByName("textField_login").getString();
        fr.LocalStorage.setStringFromKey("zing_me_username", username);
        var passWord = this.bglogin.getChildByName("text_box_pass").getChildByName("textField_pass").getString();
        fr.LocalStorage.setStringFromKey("zing_me_username", username);
        gv.socialMgr.loginSocial(SOCIAL_TYPE.ZINGME,username,passWord);
    },

    onClickButtonSignIn:function(){
        var userName = this.bgDangky.getChildByName("text_box_tendangnhap").getChildByName("textField_tendangnhap").getString();

        var passWord = this.bgDangky.getChildByName("text_box_pass").getChildByName("textField_pass").getString();

        var xacnhan = this.bgDangky.getChildByName("text_box_xacnhan").getChildByName("textField_xacnhan").getString();

        if(passWord != xacnhan){
            this.bgDangky.getChildByName("Text_9").setVisible(true);
            GameUtil.callFunctionWithDelay(2,function(){this.bgDangky.getChildByName("Text_9").setVisible(false);}.bind(this));
        }else{
            fr.zingme.register(userName,passWord,function(dataerror){
                if(dataerror == ZING_PORTAL_ERROR.SUCCESS){
                    fr.LocalStorage.setStringFromKey("zing_me_username", userName);
                    fr.LocalStorage.setStringFromKey("zing_me_username", passWord);
                    gv.socialMgr.loginSocial(SOCIAL_TYPE.ZINGME,userName,passWord);
                }else{

                }

            }.bind(this));
        }

    },

    onClickSocialButton:function(socialType){
        gv.socialMgr.loginSocial(socialType,"test");
        //fr.LocalStorage.setStringFromKey("session_cache_key", this.accountLb.getString());
    },
});