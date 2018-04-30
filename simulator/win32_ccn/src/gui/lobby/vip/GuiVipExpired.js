/**
 * Created by user on 27/9/2016.
 */

var GuiVipExpired = BasePopup.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_VIP_EXPIRED);

        this.bg = this._rootNode.getChildByName("bg");

        this.closeBtn = this.bg.getChildByName("btn_close");
        this.closeBtn.addClickEventListener(function(){
            this.destroy();
        }.bind(this));

        this.registerBtn = this.bg.getChildByName("btn_register");
        this.registerBtn.addClickEventListener(this.onRegisterBtnClick.bind(this));

        this.showGifts();
    },

    showGifts: function(){
        var giftList = VipConfig.getInstance().getGiftList();
        for (var i=0; i<giftList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(this.bg.getContentSize().width * (i + 1) / (giftList.length + 1), this.bg.getContentSize().height/2-20);
            this.bg.addChild(giftImage);
        }
    },

    onRegisterBtnClick: function(){
        this.destroy();
        if (CheatConfig.PAYMENT){
            gv.guiMgr.addGui(new GuiCheatPayment(CheatPaymentType.VIP_CARD), GuiId.CHEAT_PAYMENT, LayerId.LAYER_GUI);
        }
        else{
            fr.zalo.purchaseVipCCN();
        }
    },
});