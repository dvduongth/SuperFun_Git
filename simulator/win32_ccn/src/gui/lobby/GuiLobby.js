/**
 * Created by tuanda on 16/7/2015.
 */

var GuiLobby = BaseGui.extend({

    BUTTON_EFFECT_TAG: 1,

    btnPlayNow: null,
    btnChannel: null,
    btnArena: null,

    friendTable: null,
    skillTable: null,

    characterDisplayState: true,

    ctor:function() {
        this._super(res.ZCSD_GUI_LOBBY);

        gv.useInitCheat = false;
        gv.InitCheatData = undefined;

        this.bg = this._rootNode.getChildByName("bg");
        this.nodeBtn = this._rootNode.getChildByName("node_btn");

        this.mainCharSlot = this.bg.getChildByName("main_char_slot");
        this.mainCharSlot.addTouchEventListener(this.onCharacterSlotTouch,  this);

        this.mainCharSlot.setLocalZOrder(1);

        var backgroundEffect  = fr.AnimationMgr.createAnimationById(resAniId.lobby_bg, this);
        backgroundEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
        backgroundEffect.setPosition(0,cc.winSize.height);
        this.bg.addChild(backgroundEffect);

        this.friendTable = new FriendTable();
        this.friendTable.setPosition(cc.winSize.width+20, 352);
        this.friendTable.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, cc.winSize.width*0.765,352)).easing(cc.easeBackOut()));
        this._rootNode.addChild(this.friendTable);

        this.skillTable = new CharacterSkillTable(UserDataUtil.getMainCharData(), 0);
        this.skillTable.setPosition(this.mainCharSlot.getContentSize().width/2, this.mainCharSlot.getContentSize().height/2-25);
        this.skillTable.setScaleX(0);
        this.mainCharSlot.addChild( this.skillTable);

        this.characterImage = this.mainCharSlot.getChildByName("main_char_image");

        this.characterDisplayState = true;
        this.charImageOriginScale = this.characterImage.getScale();
        this.diceImageOriginScale = this.mainCharSlot.getChildByName("btn_dice_shop").getScale();
        //var characterBtn = this.mainCharSlot.getChildByName("main_char_image");
        //characterBtn.addTouchEventListener(this.onCharacterSlotTouch,  this);

        //this.slash = this.characterImage.getChildByName("slash");
        //this.cNode = new cc.ClippingNode(null);
        //this.cNode.alphaThreshold = 0.1;
        //this.characterImage.addChild(this.cNode);
        //this.characterImage.removeChild(this.slash);
        //this.cNode.addChild(this.slash);
        //
        //this.mask = this.mainCharSlot.getChildByName("main_char_mask");
        //this.mask.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        //this.cNode.setStencil(this.mask);
        //
        //this.slash.runAction(cc.sequence(
        //    cc.moveBy(1.5, 600, 0),
        //    cc.delayTime(3),
        //    cc.callFunc(function(){
        //        this.slash.setPosition(this.slash.getPosition().x - 600, this.slash.getPosition().y);
        //    }.bind(this))
        //).repeatForever());

        this.characterImage.setVisible(false);

        var charAni = fr.AnimationMgr.createAnimationById(resAniId.CH_C_1_model, this);
        //var charAni = fr.AnimationMgr.createAnimationById(resAniId.minigame_horse, this);
        charAni.gotoAndPlay("run", 0, -1, 0);
        charAni.setPosition(60, 520);
        this.mainCharSlot.addChild(charAni);

        this.loadMainCharacter();

        //var btnSelfie = this.mainCharSlot.getChildByName("btn_selfie");
        //btnSelfie.addClickEventListener(this.onSelfieBtnClick.bind(this));
        //btnSelfie.runAction(cc.sequence(
        //    cc.scaleTo(0.4, 1.2),
        //    cc.scaleTo(0.4, 1.0),
        //    cc.delayTime(3.0)
        //).repeatForever());

        var diceShopBtn = this.mainCharSlot.getChildByName("btn_dice_shop");
        diceShopBtn.runAction(cc.sequence(
            cc.moveBy(2, 0, 15).easing(cc.easeInOut(2)),
            cc.moveBy(2, 0, -15).easing(cc.easeInOut(2))
        ).repeatForever());
        diceShopBtn.addClickEventListener(this.onGameInfoBtnClick.bind(this, GameInfoType.DICE));
        diceShopBtn.getChildByName("dice").setLocalZOrder(-1);
        this.loadMainDice();

        //Play now
        this.btnPlayNow = this.nodeBtn.getChildByName('btn_play_now');
        this.btnPlayNow.setCascadeOpacityEnabled(false);
        this.btnPlayNow.setOpacity(0);
        this.btnPlayNow.addTouchEventListener(this.onTouchEventListener, this);

        //var playNowDes = this.btnPlayNow.getPosition();
        //this.btnPlayNow.setPositionX(cc.winSize.width + this.btnPlayNow.getContentSize().width/2);
        //this.btnPlayNow.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, playNowDes).easing(cc.easeBackOut())));
        //
        var btnPlayNowEff = fr.AnimationMgr.createAnimationById(resAniId.btn_play_now, this);
        btnPlayNowEff.getAnimation().gotoAndPlay("idle", 0,-1, 0);
        btnPlayNowEff.setPosition(this.btnPlayNow.getContentSize().width/2, this.btnPlayNow.getContentSize().height/2);
        btnPlayNowEff.setTag(this.BUTTON_EFFECT_TAG);
        this.btnPlayNow.addChild(btnPlayNowEff);

        // Channel
        this.btnChannel = this.nodeBtn.getChildByName('btn_channel');
        this.btnChannel.setCascadeOpacityEnabled(false);
        this.btnChannel.setOpacity(0);
        this.btnChannel.addTouchEventListener(this.onTouchEventListener, this);

        //var channelDes = this.btnChannel.getPosition();
        //this.btnChannel.setPositionX(cc.winSize.width + this.btnChannel.getContentSize().width/2);
        //this.btnChannel.runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(0.5, channelDes).easing(cc.easeBackOut())));

        var btnChannelEff = fr.AnimationMgr.createAnimationById(resAniId.btn_channel, this);
        btnChannelEff.getAnimation().gotoAndPlay("idle", 0,-1, 0);
        btnChannelEff.setPosition(this.btnChannel.getContentSize().width/2, this.btnChannel.getContentSize().height/2);
        btnChannelEff.setTag(this.BUTTON_EFFECT_TAG);
        this.btnChannel.addChild(btnChannelEff);

        //// Arena
        //this.btnArena = this._rootNode.getChildByName('btn_arena');
        //this.btnArena.setCascadeOpacityEnabled(false);
        //this.btnArena.setOpacity(0);
        //this.btnArena.addTouchEventListener(this.onTouchEventListener, this);
        //
        //var arenaDes = this.btnArena.getPosition();
        //this.btnArena.setPositionX(cc.winSize.width + this.btnArena.getContentSize().width/2);
        //this.btnArena.runAction(cc.sequence(cc.delayTime(0.5), cc.moveTo(0.5, arenaDes).easing(cc.easeBackOut())));

        //var btnArenaEff = fr.AnimationMgr.createAnimationById(resAniId.eff_btn_arena, this);
        //btnArenaEff.getAnimation().gotoAndPlay("normal", 0,-1, 0);
        //btnArenaEff.setPosition(this.btnArena.getContentSize().width/2, this.btnArena.getContentSize().height/2);
        //btnArenaEff.setTag(this.BUTTON_EFFECT_TAG);
        //this.btnArena.addChild(btnArenaEff);

        var dailyGiftBtn = this._rootNode.getChildByName("btn_daily_gift");
        dailyGiftBtn.addClickEventListener(this.onDailyGiftBtnClick.bind(this));

        var inviteFriendBtn = this._rootNode.getChildByName("btn_invite_friend");
        inviteFriendBtn.addClickEventListener(this.onInviteFriendBtnClick.bind(this));

        var mailBtn = this._rootNode.getChildByName("btn_mail");
        mailBtn.addClickEventListener(this.onMailBtnClick.bind(this));

        var gameInfoBtn = this._rootNode.getChildByName("btn_game_info");
        gameInfoBtn.addClickEventListener(this.onGameInfoBtnClick.bind(this, GameInfoType.CHARACTER));

        var gachaBtn = this._rootNode.getChildByName("btn_gacha");
        gachaBtn.addClickEventListener(this.onGachaBtnClick.bind(this));

        var accumulatePaymentBtn = this._rootNode.getChildByName("btn_accumulate_payment");
        accumulatePaymentBtn.addClickEventListener(this.onAccumulatePaymentBtnClick.bind(this));

        var sanKhoBauBtn = this._rootNode.getChildByName("btn_san_kho_bau");
        sanKhoBauBtn.addClickEventListener(this.onSanKhoBauBtnClick.bind(this));

        //cheat
        var guiCheatInfo = new GuiCheatInfo();
        gv.guiMgr.addGui(guiCheatInfo, GuiId.CHEAT_INFO, LayerId.LAYER_LOADING);
        guiCheatInfo.setVisible(false);
        this.btnCheatInfo = this._rootNode.getChildByName('btn_cheatInfo');
        this.btnCheatInfo.addClickEventListener(function(){
            guiCheatInfo.setVisible(true);
            guiCheatInfo.setFog(true);
        }.bind(this));

        fr.Sound.playMusic(resSound.music_lobby);

        var btnEvent = this._rootNode.getChildByName("btn_event");
        btnEvent.addClickEventListener(this.onClickEventButton.bind(this));
    },
    onClickEventButton: function () {
        gv.guiMgr.addGui(new GuiQuest(), GuiId.GUI_QUEST, LayerId.LAYER_GUI);
    },

    loadMainDice: function(){
        var diceShopBtn = this.bg.getChildByName("main_char_slot").getChildByName("btn_dice_shop");
        var dice = diceShopBtn.getChildByName("dice");
        fr.changeSprite(dice, "lobby/gift_dice_" + UserData.getInstance().mainDice + ".png");
    },

    loadMainCharacter: function(){
        var mainCharData = UserDataUtil.getMainCharData();

        var mainCharSlot = this.bg.getChildByName("main_char_slot");
        //var mainCharSlotDes = mainCharSlot.getPosition();
        //mainCharSlot.setPositionX(cc.winSize.width + mainCharSlot.getContentSize().width/2);
        //mainCharSlot.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, mainCharSlotDes).easing(cc.easeBackOut())));


        var nameSlot = mainCharSlot.getChildByName("main_char_name_slot");
        var classImage = nameSlot.getChildByName("class");
        var name = mainCharSlot.getChildByName("main_char_name");
        var image = mainCharSlot.getChildByName("main_char_image");
        var characterMask = mainCharSlot.getChildByName("main_char_mask");

        fr.changeSprite(nameSlot, "name_slot_1_" + GameUtil.getClassNameById(mainCharData.clazz) + ".png");
        fr.changeSprite(classImage, "word_" + GameUtil.getClassNameById(mainCharData.clazz) + ".png");

        name.setString(fr.Localization.text("character_name_" + mainCharData.id));

        fr.changeSprite(image, "res/lobby/characterModel/" + mainCharData.id + "_model.png");
        //fr.changeSprite(characterMask, "res/lobby/characterModel/" + mainCharData.id + "_mask.png");

        var starNumber = mainCharData.getStarFromLevel(mainCharData.level);
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
            var star =  mainCharSlot.getChildByName("char_star_"+j);
            star.setVisible(j<starNumber);
        }

        this.skillTable.reloadData(mainCharData);
    },

    onTouchEventListener: function(sender, type){
        var btnEff = sender.getChildByTag(this.BUTTON_EFFECT_TAG);
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                if (btnEff){
                    btnEff.getAnimation().gotoAndPlay("click", 0, -1, 1);
                    btnEff.setCompleteListener(function(){
                        btnEff.getAnimation().gotoAndPlay("idle", 0, -1, 0);
                    });
                }
                break;
            case ccui.Widget.TOUCH_ENDED:
                switch (sender){
                    case (this.btnPlayNow):
                        this.onPlayNowBtnClick();
                        break;
                    case (this.btnChannel):
                        this.onChannelBtnClick();
                        break;
                    //case (this.btnArena):
                    //    this.onArenaBtnClick();
                    //    break;
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                //btnEff.getAnimation().gotoAndPlay("idle", 0, -1, 1);
                break;
        }
    },

    onExit: function(){
        this._super();
        fr.Sound.stopMusic();
    },

    onChannelBtnClick: function(){
        //var isPlayWithAuto = CheatConfig.PLAY_WITH_BOT;
        this.setVisible(false);
        gv.guiMgr.addGui(new GuiChosenChanel(UserData.getInstance().gold), GuiId.CHANEL_BET, LayerId.LAYER_GAME);
        //cc.log("finish add gui");
    },

    //onArenaBtnClick: function(){
    //},

    onPlayNowBtnClick:function() {
        var isPlayWithAuto = CheatConfig.PLAY_WITH_BOT;
        gv.guiMgr.addGui(new GuiFindOpponent(isPlayWithAuto), GuiId.FIND_OPPONENT, LayerId.LAYER_GUI);
    },

    onDailyGiftBtnClick: function(){
        gv.guiMgr.addGui(new PopupEventDailyLogin(false), GuiId.POPUP_EVENT_DAILY_LOGIN, LayerId.LAYER_POPUP);
    },

    onInviteFriendBtnClick: function(){
        if (gv.socialMgr.currentLoginType == SOCIAL_TYPE.ZALO){
            gv.guiMgr.addGui(new PopupNotification(fr.Localization.text("coming_soon_notification")), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        }
        else{
            gv.guiMgr.addGui(new GuiInviteFriend(), GuiId.INVITE_FRIEND, LayerId.LAYER_GUI);
        }
    },

    onMailBtnClick: function(){
        gv.guiMgr.addGui(new GuiMail(), GuiId.MAIL, LayerId.LAYER_GUI);
    },


    onGameInfoBtnClick: function(gameInfoType){
        if (gv.guiMgr.getGuiById(GuiId.GAME_INFO)) return;

        var guiGameInfo = new GuiGameInfo(gameInfoType);
        gv.guiMgr.addGui(guiGameInfo, GuiId.GAME_INFO, LayerId.LAYER_GUI);
        guiGameInfo.reloadResource();

        var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
        guiPlayerInfo.removeFromParent();
        gv.guiMgr.addGui(new GuiPlayerInfo(), GuiId.PLAYER_INFO, LayerId.LAYER_GUI);
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).setVisibleSocialInfo(false);
    },

    onGachaBtnClick: function(){
        gv.guiMgr.addGui(new GuiGacha(), GuiId.GACHA, LayerId.LAYER_GUI);

        //var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
        //guiPlayerInfo.removeFromParent();
        //gv.guiMgr.addGui(new GuiPlayerInfo(), GuiId.PLAYER_INFO, LayerId.LAYER_GUI);
    },

    onAccumulatePaymentBtnClick: function(){
        gv.guiMgr.addGui(new GuiAccumulationPayment(), GuiId.ACCUMULATION_PAYMENT, LayerId.LAYER_GUI);
    },

    onSanKhoBauBtnClick: function(){
        //todo: san kho bau
        gv.gameClient.sendPacketGetSpecialEvenData();
    },

    onCharacterSlotTouch : function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (MathUtil.getDistance(sender.getTouchBeganPosition(), sender.getTouchEndPosition()) > 10) return;
                this.mainCharSlot.setTouchEnabled(false);
                this.mainCharSlot.runAction(cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        this.mainCharSlot.setTouchEnabled(true);
                    }.bind(this))
                ));

                this.characterDisplayState = !this.characterDisplayState;

                var mainCharSlot = this.bg.getChildByName("main_char_slot");
                var characterImage = mainCharSlot.getChildByName("main_char_image");
                var diceShopBtn = mainCharSlot.getChildByName("btn_dice_shop");

                if (!this.characterDisplayState){
                    characterImage.runAction(cc.scaleTo(0.15,0,this.charImageOriginScale));
                    diceShopBtn.runAction(cc.scaleTo(0.15,0,this.diceImageOriginScale));
                    this.skillTable.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15,1,1)
                    ));
                }
                else{
                    this.skillTable.runAction(cc.scaleTo(0.15,0,1));
                    characterImage.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15, this.charImageOriginScale,this.charImageOriginScale)
                    ));
                    diceShopBtn.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15,this.diceImageOriginScale,this.diceImageOriginScale)
                    ));
                }
                break;
        }
    },

    //onSelfieBtnClick: function(){
    //    gv.guiMgr.addGui(new GuiSelfie(), GuiId.SELFIE, LayerId.LAYER_GUI);
    //}
});