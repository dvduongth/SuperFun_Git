/**
 * Created by tuanda on 16/7/2015.
 */

var UPDATED_STRING = "=21/4/17=";

var GuiLogin = BaseGui.extend({
    ctor:function() {
        this._super(res.ZCSD_GUI_LOGIN);

        this.bg = this._rootNode.getChildByName("bg");

        this.accountSlot = this.bg.getChildByName("account_slot");
        this.accountSlot.setVisible(cc.sys.os == cc.sys.OS_WINDOWS);

        this.textFiledAccount = this.accountSlot.getChildByName('textField_account_name');
        this.textFiledAccount.addEventListener(this.onTextFiledChanged.bind(this));

        this.accountLb = this.accountSlot.getChildByName('text_account_name');
        this.accountLb.setString(fr.LocalStorage.getStringFromKey("session_cache_key", ""));
        //this.accountLb.setString(MathUtil.randomBetween(1,10000));

        this.facebookBtn = this.bg.getChildByName('btn_facebook');
        this.facebookBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.FACEBOOK));

        this.zaloBtn = this.bg.getChildByName('btn_zalo');
        this.zaloBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.ZALO));

        this.googleBtn = this.bg.getChildByName('btn_google');
        this.googleBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.GOOGLE));

        this.zingmeBtn = this.bg.getChildByName('btn_zingme');
        this.zingmeBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.ZACCOUNT));

        this.setEnableSocialButton(false);


        var backgroundEffect  = fr.AnimationMgr.createAnimationById(resAniId.loading_effect, this);
        backgroundEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
        backgroundEffect.setPosition(0,cc.winSize.height);
        this.addChild(backgroundEffect);

        var labelText = this._rootNode.getChildByName("lb_update");
        labelText.setString(UPDATED_STRING);

        //this.horseAni = fr.createSprite("res/game/Horse/blue_horse2.png");
        //this.horseAni.setPosition(100,100);
        ////this.addChild(this.horseAni, 999);
        //
        //var end = cc.p(100,150);
        //var jumpTo = cc.jumpTo(0.2, end, 100, 1);
        //this.horseAni.runAction(jumpTo);


        //this.diceControl = new NodeDiceControl();
        //this.diceControl.setPosition(cc.winSize.width-156,cc.winSize.height/2);
        //this._rootNode.addChild(this.diceControl, MainBoardZOrder.DICE_CONTROL);

        //var sp = fr.createSprite("res/game/mainBoard/tile_mini_game_1.png");
        //sp.setPosition(500,500);
        ////this.addChild(sp);
        //
        ////sp.runAction(cc.fadeTo(5.0, 100));
        //s

        var x1  = fr.AnimationMgr.createAnimationById(resAniId.CH_C_1_model, this);
        x1.getAnimation().gotoAndPlay("run", 0, -1, 0);
        x1.setPosition(400,400);
        //this.addChild(x1);

        var x1  = fr.AnimationMgr.createAnimationById(resAniId.docChiemTraiNgua_notification, this);
        x1.getAnimation().gotoAndPlay("run", 0, -1, 0);
        x1.setPosition(800,400);
        //this.addChild(x1);
        //var minigameTuXi = new GuiMiniGameTuXi();
        //this.addChild(minigameTuXi);
        ////
        //var x2 = fr.AnimationMgr.createAnimationById(resAniId.tile_light, this);
        //x2.getAnimation().gotoAndPlay("green", 0, -1, 0);
        //x2.setPosition(300, 400);
        //this.addChild(x2);

        //var x3 = fr.AnimationMgr.createAnimationById(resAniId.chuongthutren, this);
        //x3.getAnimation().gotoAndPlay("run", 0, -1, 0);
        //x3.setPosition(500, 400);
        //this.addChild(x3);

        //
        //var nguaxanh = false;
        //for (var i=0; i<14; i++)
        //    x1.getArmature().getBone("layer_"+i).setVisible(nguaxanh);

        //var size = cc.winSize;
        //var x2  = fr.AnimationMgr.createAnimationById(resAniId.skill_rainbow_step_2, this);
        //x2.getAnimation().gotoAndPlay("run", 0, -1, 0);
        //x2.setPosition(size.width/2,size.height/2);
        //this.addChild(x2);
        ////
        //var xxx  = fr.AnimationMgr.createAnimationById(resAniId.current_turn_bottom, this);
        //xxx.getAnimation().gotoAndPlay("run", 0, -1, 0);//start, end
        //xxx.setPosition(size.width/2,size.height/2);
        //this.addChild(xxx);

        //var x2  = fr.AnimationMgr.createAnimationById(resAniId.skill_am_sat_no, this);
        //x2.getAnimation().gotoAndPlay("run", 0, -1, 1);//start, end
        //x2.setPosition(size.width/2,size.height/2);
        //this.addChild(x2);

        //this.diceControl = new NodeDiceControl();
        //this.diceControl.setPosition(cc.winSize.width-156,cc.winSize.height/2);
        //this._rootNode.addChild(this.diceControl, MainBoardZOrder.DICE_CONTROL);


        //this.cardList = [];
        //for (var i=0; i<10; i++){
        //    var cardsprite = fr.createSprite("res/test/labai_" + i +".png");
        //    cardsprite.setPosition(300+ i*60,400);
        //    this.addChild(cardsprite);
        //    cardsprite.setColor(cc.color(100,100,100,0));
        //    cardsprite.setLocalZOrder(i);
        //    this.cardList.push(cardsprite);
        //}
        //
        //this.firstCard = -1;
        //this.firstCardOriginalPos = cc.p(0,0);
        //this.secondCard = -1;
        //
        //this.cardBorder = fr.createSprite("res/test/selectCard.png");
        //this.cardBorder.setVisible(false);
        //this.addChild(this.cardBorder);

        //var x=  fr.createSprite("res/game/mainBoard/crosshair.png");
        //x.setPosition(cc.winSize.width- x.getContentSize().width/2, cc.winSize.height/2);
        //this.addChild(x);
        //
        //cc.log("size = " + cc.winSize.width + "," + cc.winSize.height);
        //cc.log("x pos = " + x.getPosition().x + "," + x.getPosition().y);
        //return;

        //this.testHorse(PlayerColor.YELLOW);

        //test new button
        var x = new fr.Button("button/btn_blue_0.png");
        //x.setPressedActionEnabled(false);
        x.setPosition(500,500);
        this.addChild(x);
    },

    testHorse: function(horseColor){
        var horseAni  = fr.AnimationMgr.createAnimationById(resAniId.minigame_horse, this);
        horseAni.getAnimation().gotoAndPlay("cham", 0, -1, 0);//start, end
        horseAni.setPosition(300,300);
        this.addChild(horseAni);

        for (var color=0; color<4; color++){
            var colorStr = GameUtil.getColorStringById(color);
            for (var layerIndex=0; layerIndex<5; layerIndex++){
                cc.log(colorStr+"_"+ layerIndex);
                horseAni.getArmature().getBone(colorStr+"_"+ layerIndex).setVisible(color==horseColor);
            }
        }
    },

    onTextFiledChanged: function(sender){
        if (this.accountLb.getString().length>=18) return;
        this.accountLb.setString(sender.getString());
    },

    onSocialBtnClick: function(socialType){
        this.setEnableSocialButton(false);
        gv.socialMgr.loginSocial(socialType, this.accountLb.getString());
        fr.LocalStorage.setStringFromKey("session_cache_key", this.accountLb.getString());
    },

    showLoginFailed: function(){
        var loginNoti = this.bg.getChildByName("login_notification");
        loginNoti.setVisible(true);
        loginNoti.runAction(cc.sequence(
            cc.delayTime(3.0),
            cc.callFunc(function(){
                loginNoti.setVisible(false);
            })
        ));
        this.setEnableSocialButton(true);
    },

    setEnableSocialButton : function(enable){
        this.facebookBtn.setTouchEnabled(enable);
        this.facebookBtn.setVisible(enable);

        this.zaloBtn.setTouchEnabled(enable);
        this.zaloBtn.setVisible(enable);

        this.googleBtn.setTouchEnabled(enable);
        this.googleBtn.setVisible(enable);

        this.zingmeBtn.setTouchEnabled(enable);
        this.zingmeBtn.setVisible(enable);

    },

    onLoginSocialSuccess : function(sessionKey){
        gv.gameClient.setUserLogin(sessionKey);
        gv.gameClient.connect();
    },

    //onTouchBegan : function(touch, event){
    //    var touchPos = touch.getLocation();
    //    var currentGui = gv.guiMgr.getGuiById(GuiId.LOGIN);
    //   currentGui.gun.setTargetPosition(touchPos);
    //   currentGui.gun.fireBullet();
    //
    //    return true;
    //}
});