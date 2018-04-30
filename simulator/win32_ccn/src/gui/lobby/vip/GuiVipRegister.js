/**
 * Created by user on 5/5/2016.
 */

var GuiVipRegister = BasePopup.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_VIP_REGISTER);

        this.bg = this._rootNode.getChildByName("bg");

        this.closeBtn = this.bg.getChildByName("btn_close");
        this.closeBtn.addClickEventListener(function(){
            this.destroy();
        }.bind(this));

        this.showGifts();

        var grossCostLabel = this.bg.getChildByName("grossCostLabel");
        grossCostLabel.setString(StringUtil.toMoneyString(VipConfig.getInstance().getGrossCost()));

        var grossCostLabel1 = this.bg.getChildByName("grossCostLabel1");
        grossCostLabel1.setString(StringUtil.toMoneyString(VipConfig.getInstance().getGrossCost()));

        var grossCostLabel2 = this.bg.getChildByName("grossCostLabel");
        grossCostLabel2.setString(StringUtil.toMoneyString(VipConfig.getInstance().getGrossCost()));

        var durationInSecLabel = this.bg.getChildByName("durationInSecLabel");
        durationInSecLabel.setString(VipConfig.getInstance().getDurationInSecond()/86400 + " " + fr.Localization.text("Day"));

        var btnRegister = this.bg.getChildByName("btn_register");
        btnRegister.addClickEventListener(this.onRegisterBtnClick.bind(this));
    },

    showGifts: function(){
        var giftList = VipConfig.getInstance().getGiftList();
        for (var i=0; i<giftList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(this.bg.getContentSize().width * (i + 1) / (giftList.length + 1), this.bg.getContentSize().height/2+70);
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
    }
});