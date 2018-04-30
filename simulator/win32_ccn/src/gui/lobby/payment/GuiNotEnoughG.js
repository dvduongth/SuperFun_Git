/**
 * Created by user on 18/5/2016.
 */

var GuiNotEnoughG = BasePopup.extend({

    ctor: function () {
        this._super(res.ZCSD_GUI_NOT_ENOUGH_G);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(this.onCloseBtnClick.bind(this));

        var cancelBtn = this.bg.getChildByName("btn_cancel");
        cancelBtn.addClickEventListener(this.onCloseBtnClick.bind(this));

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));
    },

    onCloseBtnClick: function(){
        this.destroy();
    },

    onOkBtnClick: function () {
        this.destroy(DestroyEffects.ZOOM);
        if (CheatConfig.PAYMENT){
            gv.guiMgr.addGui(new GuiCheatPayment(CheatPaymentType.COIN_CARD), GuiId.CHEAT_PAYMENT, LayerId.LAYER_GUI);
        }
        else{
            fr.zalo.purchaseTelcoForCCN();
        }
    },

});