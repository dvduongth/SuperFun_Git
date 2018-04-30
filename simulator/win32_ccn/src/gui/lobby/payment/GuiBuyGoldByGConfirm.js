/**
 * Created by user on 26/5/2016.
 */

var GuiBuyGoldByGConfirm = BaseGui.extend({
    ctor: function(goldPackIdx){
        this._super(res.ZCSD_GUI_BUY_GOLD_BY_G_CONFIRM);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.goldPackIdx = goldPackIdx;

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function () {
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));

        var packData = GoldPackConfig.getInstance().getGoldPackDataByIndex(goldPackIdx);

        var goldNumber = this.bg.getChildByName("gold_number");
        goldNumber.setColor(GiftData.getGiftTextColorByType(GiftType.GOLD));
        goldNumber.setString(StringUtil.normalizeNumber(packData.gold));

        var gNumber = this.bg.getChildByName("g_number");
        gNumber.setColor(GiftData.getGiftTextColorByType(GiftType.COIN));
        gNumber.setString(StringUtil.normalizeNumber(packData.cost));
    },

    onOkBtnClick: function(){
        GuiUtil.showWaitingGui();
        gv.gameClient.sendBuyGoldPack("GP_"+ this.goldPackIdx);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.BUY_GOLD_PACK, this.onBuyGoldPackResult.bind(this));
    },

    onBuyGoldPackResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.BUY_GOLD_PACK);

        var packData = GoldPackConfig.getInstance().getGoldPackDataByIndex(this.goldPackIdx);
        UserData.getInstance().xu-=packData.cost;
        UserData.getInstance().gold+=packData.gold;
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).reloadInfo();

        gv.guiMgr.addGui(new PopupNotification(fr.Localization.text("trade_success")), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        fr.Sound.playSoundEffect(resSound.m_addcoin);
        this.destroy();

    },
});