/**
 * Created by user on 9/3/2016.
 */

var GuiGacha = BaseGui.extend({

    timeRemainFreeChest: 0,

    guiTitle: null,
    chestSlot1: null,
    chestSlot2: null,

    silverChest: null,
    goldChest: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_GACHA);
        this.setFog(true);

        var closeBtn = this._rootNode.getChildByName("bg").getChildByName("btn_exit");
        closeBtn.addClickEventListener(function(){
            var guiSelectChar = gv.guiMgr.getGuiById(GuiId.SELECT_CHARACTER);
            if (guiSelectChar)
                guiSelectChar.loadTableView();

            var guiUpgradeChar = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
            if (guiUpgradeChar)
                guiUpgradeChar.updateStore();
            this.destroy();
        }.bind(this));

        this.chestSlot1 = this._centerNode.getChildByName("chest_slot_1");
        var destination = this.chestSlot1.getPosition();
        this.chestSlot1.setPositionX(- this.chestSlot1.getContentSize().width/2-cc.winSize.width/2);
        this.chestSlot1.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        this.chestSlot2 = this._centerNode.getChildByName("chest_slot_2");
        var destination = this.chestSlot2.getPosition();
        this.chestSlot2.setPositionX(cc.winSize.width/2+this.chestSlot2.getContentSize().width/2);
        this.chestSlot2.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        this.silverChest = fr.AnimationMgr.createAnimationById(resAniId.gacha);
        this.silverChest.getAnimation().gotoAndPlay("ruongbac_idle", 0, -1, 0);
        this.silverChest.setScale(0.8);
        this.silverChest.setPosition(this.chestSlot1.getChildByName("silver_chest").getPosition());
        this.chestSlot1.addChild(this.silverChest);

        this.goldChest = fr.AnimationMgr.createAnimationById(resAniId.gacha);
        this.goldChest.getAnimation().gotoAndPlay("ruongvang_idle", 0, -1, 0);
        this.goldChest.setScale(0.8);
        this.goldChest.setPosition(this.chestSlot2.getChildByName("gold_chest").getPosition());
        this.chestSlot2.addChild(this.goldChest);

        this.open1SilverChest = this.chestSlot1.getChildByName("btn_open_1_silver_chest");
        this.open1SilverChest.setLocalZOrder(1);
        this.open1SilverChest.addClickEventListener(this.onOpenChestClick.bind(this, 1));

        this.open10SilverChest = this.chestSlot1.getChildByName("btn_open_10_silver_chest");
        this.open10SilverChest.setLocalZOrder(1);
        this.open10SilverChest.addClickEventListener(this.onOpenChestClick.bind(this, 2));

        this.open1GoldenChest = this.chestSlot2.getChildByName("btn_open_1_golden_chest");
        this.open1GoldenChest.setLocalZOrder(1);
        this.open1GoldenChest.addClickEventListener(this.onOpenChestClick.bind(this, 3));

        this.open10GoldenChest = this.chestSlot2.getChildByName("btn_open_10_golden_chest");
        this.open10GoldenChest.setLocalZOrder(1);
        this.open10GoldenChest.addClickEventListener(this.onOpenChestClick.bind(this, 4));

        var gachaCf = GachaConfig.getInstance();

        var labelOpen1SilverChestCost = this.open1SilverChest.getChildByName("label_open_1_silver_chest_cost");
        labelOpen1SilverChestCost.setLocalZOrder(2);

        //this.progressTimer = new cc.ProgressTimer(fr.createSprite("gacha_time_progress_bar.png"));
        //this.progressTimer.setPosition(labelOpen1SilverChestCost.getPositionX(), labelOpen1SilverChestCost.getPositionY());
        //this.progressTimer.barChangeRate = cc.p(1, 0);
        //this.progressTimer.midPoint = cc.p(0, 0);
        //this.progressTimer.type = cc.ProgressTimer.TYPE_BAR;
        //this.progressTimer.setVisible(false);
        //this.chestSlot1.addChild(this.progressTimer, 1);

        this.reloadFreeGacha();

        var labelOpen10SilverChestCost = this.open10SilverChest.getChildByName("label_open_10_silver_chest_cost");
        //labelOpen10SilverChestCost.setColor(GameUtil.getRGBColorForGold());
        labelOpen10SilverChestCost.setString(StringUtil.toMoneyString(gachaCf.getCostByGachaType(GachaType.SILVER_CHEST_10).costValue));

        var labelOpen1GoldenChestCost = this.open1GoldenChest.getChildByName("label_open_1_golden_chest_cost");
        //labelOpen1GoldenChestCost.setColor(GameUtil.getRGBColorForG());
        labelOpen1GoldenChestCost.setString(StringUtil.toMoneyString(gachaCf.getCostByGachaType(GachaType.GOLD_CHEST_1).costValue));

        var labelOpen10Sil0verChestCost =  this.open10GoldenChest.getChildByName("label_open_10_golden_chest_cost");
        //labelOpen10Sil0verChestCost.setColor(GameUtil.getRGBColorForG());
        labelOpen10Sil0verChestCost.setString(StringUtil.toMoneyString(gachaCf.getCostByGachaType(GachaType.GOLD_CHEST_10).costValue));

        this.schedule(this.update, 1);
    },

    reloadFreeGacha: function(){
        this.timeRemainFreeChest = UserData.getInstance().timeToGachaFree - GameUtil.getCurrentTime();
        if (this.timeRemainFreeChest>0){
            var labelOpen1SilverChestCost = this.open1SilverChest.getChildByName("label_open_1_silver_chest_cost");

            this.open1SilverChest.setBright(false);
            this.open1SilverChest.setTouchEnabled(false);
            labelOpen1SilverChestCost.setString(StringUtil.toStringTime(this.timeRemainFreeChest));

            //this.progressTimer.setVisible(true);
            //this.progressTimer.stopAllActions();
            //this.progressTimer.runAction(cc.progressFromTo(this.timeRemainFreeChest, this.timeRemainFreeChest/GachaConfig.getInstance().getCostByGachaType(GachaType.SILVER_CHEST_FREE).costValue*100, 0));
        }
    },

    update: function(dt){
        this.timeRemainFreeChest--;
        var labelOpen1SilverChestCost = this.open1SilverChest.getChildByName("label_open_1_silver_chest_cost");
        if (this.timeRemainFreeChest>0){
            labelOpen1SilverChestCost.setString(StringUtil.toStringTime(this.timeRemainFreeChest));
        }
        else{
            labelOpen1SilverChestCost.setString(fr.Localization.text("free"));

            var open1SilverChest = this.chestSlot1.getChildByName("btn_open_1_silver_chest");
            open1SilverChest.setBright(true);
            open1SilverChest.setTouchEnabled(true);
        }
    },

    onOpenChestClick: function(type){

        var userData = UserData.getInstance();
        var gachaCf = GachaConfig.getInstance();

        if ((type == GachaType.SILVER_CHEST_10) && (userData.gold < gachaCf.getCostByGachaType(GachaType.SILVER_CHEST_10).costValue)){
            gv.guiMgr.addGui(new GuiNotEnoughGold(), GuiId.NOT_ENOUGH_GOLD, LayerId.LAYER_GUI);
            return;
        }

        if (((type == GachaType.GOLD_CHEST_1) || (type == GachaType.GOLD_CHEST_10)) && (userData.xu < gachaCf.getCostByGachaType(type).costValue)){
            gv.guiMgr.addGui(new GuiNotEnoughG(), GuiId.NOT_ENOUGH_G, LayerId.LAYER_GUI);
            return;
        }

        var gui = new GuiOpenCharacter();
        gui.openChestWithType(type);
        gv.guiMgr.addGui(gui, GuiId.OPEN_CHARACTER, LayerId.LAYER_GUI);
    }

});