/**
 * Created by user on 30/3/2016.
 */

var GuiBuyGoldPromotion = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_BUY_GOLD_PROMOTION);
        this.setAppearEffect(AppearEffects.ZOOM);
        this.setFog(true);

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function(){
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(function(){
            this.destroy();
            gv.guiMgr.addGui(new GuiBuyGold(), GuiId.BUY_GOLD, LayerId.LAYER_GUI);
        }.bind(this));

        this.showGifts();
    },

    showGifts: function(){

        var giftList = EventConfig.getInstance().getSMSBonusGiftDataList();
        for (var i=0; i<giftList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(this.bg.getContentSize().width * (i + 1) / (giftList.length + 1), this.bg.getContentSize().height/2-50);
            this.bg.addChild(giftImage);
        }
    },
});