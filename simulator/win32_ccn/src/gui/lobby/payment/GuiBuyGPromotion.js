/**
 * Created by user on 30/3/2016.
 */

var GuiBuyGPromotion = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_BUY_G_PROMOTION);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function(){
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(function(){
            this.destroy();
            if (CheatConfig.PAYMENT){
                gv.guiMgr.addGui(new GuiCheatPayment(CheatPaymentType.COIN_CARD), GuiId.CHEAT_PAYMENT, LayerId.LAYER_GUI);
            }
            else{
                fr.zalo.purchaseTelcoForCCN();
            }
        }.bind(this));
        this.showGifts();
    },

    showGifts: function(){

        var giftList = EventConfig.getInstance().getTelcoBonusGiftDataList();
        for (var i=0; i<giftList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(this.bg.getContentSize().width * (i + 1) / (giftList.length + 1), this.bg.getContentSize().height/2-50);
            this.bg.addChild(giftImage);
        }
    },
});