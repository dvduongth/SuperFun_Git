/**
 * Created by user on 18/3/2016.
 */

var GuiPlayerInfo = BaseGui.extend({

    curGold: 0,
    curCoin: 0,
    goldUnit: 0,
    coinUnit: 0,

    needUpdate: false,

    ctor: function(){
        this._super(res.ZCSD_GUI_PLAYER_INFO);

        this.background = this._rootNode.getChildByName("background");

        var btnTip = this._rootNode.getChildByName("btn_tip");
        btnTip.addClickEventListener(this.onTipBtnClick.bind(this));

        var btnSetting = this._rootNode.getChildByName("btn_setting");
        btnSetting.addClickEventListener(this.onSettingBtnClick.bind(this));

        //var btnSelfie = this._rootNode.getChildByName("btn_selfie");
        //btnSelfie.addClickEventListener(this.onSelfieBtnClick.bind(this));
        //btnSelfie.runAction(cc.sequence(
        //    cc.scaleTo(0.4, 1.2),
        //    cc.scaleTo(0.4, 1.0),
        //    cc.delayTime(3.0)
        //).repeatForever());

        var userSocialSlot = this._rootNode.getChildByName("user_social_slot");

        var userSocial = userSocialSlot.getChildByName("user_social");
        fr.changeSprite(userSocial, "res/lobby/icon_" + gv.socialMgr.getCurrentSocialName() + ".png");

        var userName = userSocialSlot.getChildByName("user_name");
        userName.setString(StringUtil.limitWordNumber(UserData.getInstance().displayName, 40));

        var goldSlot = this._rootNode.getChildByName("gold_slot");
        var xuSlot = this._rootNode.getChildByName("g_slot");

        this.userGold = goldSlot.getChildByName("user_gold");
        //this.userGold.setColor(GameUtil.getRGBColorForGold());
        this.userGold.setString(StringUtil.toMoneyString(UserData.getInstance().gold));

        this.userXu = xuSlot.getChildByName("user_xu");
        //this.userXu.setColor(GameUtil.getRGBColorForG());
        this.userXu.setString(StringUtil.toMoneyString(UserData.getInstance().xu));

        var btnAddGold = goldSlot.getChildByName("btn_add_gold");
        btnAddGold.addClickEventListener(this.onAddGoldBtnClick.bind(this));

        var btnAddXu = xuSlot.getChildByName("btn_add_xu");
        btnAddXu.addClickEventListener(this.onAddXuBtnClick.bind(this));

        var btnVip = this._rootNode.getChildByName("btn_vip");
        btnVip.addClickEventListener(this.onVipBtnClick.bind(this));

        this.reloadInfo();

        this.curGold = UserData.getInstance().gold;
        this.curCoin = UserData.getInstance().xu;

        this.schedule(this.update, 0.01);
        this.needUpdate = false;
    },

    update: function(dt){

        if (!this.needUpdate) return;

        var userData = UserData.getInstance();
        //update gold
        if (this.curGold < userData.gold){
            this.curGold+=this.goldUnit;
            if (this.curGold > userData.gold)
                this.curGold = userData.gold;
            this.userGold.setString(StringUtil.toMoneyString(this.curGold));
        }
        else if (this.curGold > userData.gold){
            this.curGold-=this.goldUnit;
            if (this.curGold<userData.gold)
                this.curGold = userData.gold;
            this.userGold.setString(StringUtil.toMoneyString(this.curGold));
        }

        //update coin
        if (this.curCoin < userData.xu){
            this.curCoin+=this.coinUnit;
            if (this.curCoin > userData.xu)
                this.curCoin = userData.xu;
            this.userXu.setString(StringUtil.toMoneyString(this.curCoin));
        }
        else if (this.curCoin > userData.xu){
            this.curCoin-=this.coinUnit;
            if (this.curCoin<userData.xu)
                this.curCoin = userData.xu;
            this.userXu.setString(StringUtil.toMoneyString(this.curCoin));
        }

        if ((this.curGold == userData.gold) && (this.curCoin == userData.xu))
            this.needUpdate = false;
    },

    onAddGoldBtnClick: function(){

        if (gv.guiMgr.getGuiById(GuiId.BUY_GOLD)) return;

        if (!EventData.getInstance().getEventData(EventType.FIRST_PAYING).isFirstPayingSMSClaimed){
            gv.guiMgr.addGui(new GuiBuyGoldPromotion(), GuiId.BUY_GOLD_PROMOTION, LayerId.LAYER_GUI);
        }
        else{
            gv.guiMgr.addGui(new GuiBuyGold(), GuiId.BUY_GOLD, LayerId.LAYER_GUI);

            var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
            guiPlayerInfo.removeFromParent();
            gv.guiMgr.addGui(new GuiPlayerInfo(), GuiId.PLAYER_INFO, LayerId.LAYER_GUI);
        }
    },

    onAddXuBtnClick: function(){
        if (!EventData.getInstance().getEventData(EventType.FIRST_PAYING).isFirstPayingCardClaimed){
            gv.guiMgr.addGui(new GuiBuyGPromotion(), GuiId.BUY_G_PROMOTION, LayerId.LAYER_GUI);
        }
        else{
            if (CheatConfig.PAYMENT){
                gv.guiMgr.addGui(new GuiCheatPayment(CheatPaymentType.COIN_CARD), GuiId.CHEAT_PAYMENT, LayerId.LAYER_GUI);
            }
            else{
                fr.zalo.purchaseTelcoForCCN();
            }
        }
    },

    reloadInfo: function(){
        this.goldUnit = Math.ceil(Math.abs(UserData.getInstance().gold-this.curGold)/200);
        this.coinUnit = Math.ceil(Math.abs(UserData.getInstance().xu-this.curCoin)/200);
        this.needUpdate = true;
    },

    onTipBtnClick: function(){
    },

    onSettingBtnClick: function(){
        gv.guiMgr.addGui(new GuiSettingLobby(), GuiId.SETTING_LOBBY, LayerId.LAYER_GUI);
    },

    onVipBtnClick: function(){
        var vipExpiredTime = UserData.getInstance().vipExpiredTime;
        var curTime = GameUtil.getCurrentTime();
        if (vipExpiredTime-curTime>0){
            gv.guiMgr.addGui(new GuiVipInfo(), GuiId.VIP_INFO, LayerId.LAYER_GUI);
        }
        else{
            if (vipExpiredTime==-1){//chua dang ki lan nao
                gv.guiMgr.addGui(new GuiVipRegister(), GuiId.VIP_REGISTER, LayerId.LAYER_GUI);
                //gv.guiMgr.addGui(new GuiVipSuccess(), GuiId.END_GAME, LayerId.LAYER_LOADING);
            }
            else{
                gv.guiMgr.addGui(new GuiVipExpired(), GuiId.VIP_EXPIRED, LayerId.LAYER_GUI);
            }
        }
    },

    //onSelfieBtnClick: function(){
    //    gv.guiMgr.addGui(new GuiSelfie(), GuiId.SELFIE, LayerId.LAYER_GUI);
    //},

    setVisibleSocialInfo: function(visible){
        var userSocialSlot = this._rootNode.getChildByName("user_social_slot");
        userSocialSlot.setVisible(visible);
    }

});