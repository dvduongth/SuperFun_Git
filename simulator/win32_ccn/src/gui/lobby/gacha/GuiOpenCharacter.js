/**
 * Created by user on 10/3/2016.
 */

var GuiOpenCharacter = BaseGui.extend({

    chestType: -1,

    chestAni: null,

    ctor: function(){
        this._super();
        this.setFog(true);
   },

    openChestWithCharacterDataList: function(giftType, characterDataList){
        this.chestAni = fr.AnimationMgr.createAnimationById(resAniId.gacha);
        this.chestAni.setScale(0.9);
        this.chestAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        switch (giftType) {
            case (GiftType.CHEST_1):
                this.chestAni.getAnimation().gotoAndPlay("ruongbac_idle", 0, -1, 0);
                break;
            case (GiftType.CHEST_2):
                this.chestAni.getAnimation().gotoAndPlay("ruongvang_idle", 0, -1, 0);
                break;
            case (GiftType.CHEST_3):
                this.chestAni.getAnimation().gotoAndPlay("ruongtim_idle", 0, -1, 0);
                break;
        }
        this.addChild(this.chestAni);
        this.chestAni.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.callFunc(function(){
                switch (giftType) {
                    case (GiftType.CHEST_1):
                        this.chestAni.gotoAndPlay("ruongbac_open", 0, -1, 1);
                        break;
                    case (GiftType.CHEST_2):
                        this.chestAni.gotoAndPlay("ruongvang_open", 0, -1, 1);
                        break;
                    case (GiftType.CHEST_3):
                        this.chestAni.gotoAndPlay("ruongtim_open", 0, -1, 1);
                        break;
                }
                this.chestAni.runAction(cc.sequence(
                    cc.delayTime(1.3),
                    cc.callFunc(function(){
                        this.destroy();
                        gv.guiMgr.addGui(new GuiCharacterCongrats(characterDataList), GuiId.CHARACTER_CONGRATS, LayerId.LAYER_GUI);
                    }.bind(this))
                ));
            }.bind(this))));
    },

    openChestWithType: function(type){
        this.chestType = type;
        this.chestAni = fr.AnimationMgr.createAnimationById(resAniId.gacha);
        this.chestAni.setScale(0.9);
        switch (type){
            case GachaType.SILVER_CHEST_FREE:
            case GachaType.SILVER_CHEST_10:
                this.chestAni.getAnimation().gotoAndPlay("ruongbac_idle", 0, -1, 0);
                this.chestAni.setPosition(345.25, 349.82);
                break;
            case GachaType.GOLD_CHEST_1:
            case GachaType.GOLD_CHEST_10:
                this.chestAni.getAnimation().gotoAndPlay("ruongvang_idle", 0, -1, 0);
                this.chestAni.setPosition(768.26, 348.22);
                break;
        }
        this.addChild(this.chestAni);

        var _this = this;
        this.chestAni.runAction(cc.sequence(
            cc.moveTo(0.3, cc.winSize.width/2, cc.winSize.height/2),
            cc.delayTime(1.0),
            cc.callFunc(function(){
                gv.gameClient.sendDoGaCha(type);
                NotificationHandler.getInstance().addHandler(NotificationHandlerId.DO_GACHA_RESULT, _this.onOpenCharacterFinish.bind(_this));
            })));
    },

    onOpenCharacterFinish: function(characterDataList) {
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.DO_GACHA_RESULT);

        var _this = this;
        this.chestAni.gotoAndPlay((this.chestType<=2?"ruongbac_open":"ruongvang_open"), 0, -1, 1);
        this.chestAni.runAction(cc.sequence(
            cc.delayTime(1.3),
            cc.callFunc(function(){
                _this.destroy();
                gv.guiMgr.addGui(new GuiCharacterCongrats(characterDataList), GuiId.CHARACTER_CONGRATS, LayerId.LAYER_GUI);

                var gachaCf = GachaConfig.getInstance();
                var userData = UserData.getInstance();
                switch (_this.chestType){
                    case GachaType.SILVER_CHEST_FREE:
                        UserData.getInstance().timeToGachaFree = GameUtil.getCurrentTime() + GachaConfig.getInstance().getCostByGachaType(GachaType.SILVER_CHEST_FREE).costValue;
                        gv.guiMgr.getGuiById(GuiId.GACHA).reloadFreeGacha();
                        break;
                    case GachaType.SILVER_CHEST_10:
                        userData.gold -= gachaCf.getCostByGachaType(GachaType.SILVER_CHEST_10).costValue;
                        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).reloadInfo();
                        break;
                    case GachaType.GOLD_CHEST_1:
                    case GachaType.GOLD_CHEST_10:
                        userData.xu -= gachaCf.getCostByGachaType(_this.chestType).costValue;
                        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).reloadInfo();
                        break;
                }
            })
        ));
    },
});