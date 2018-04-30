/**
 * Created by user on 5/5/2016.
 */

var GuiVipFail = BasePopup.extend({

    ctor: function(coinAmount){
        this._super(res.ZCSD_GUI_VIP_FAIL);

        this.bg = this._rootNode.getChildByName("bg");

        this.receiveBtn = this.bg.getChildByName("btn_receive");
        this.receiveBtn.addClickEventListener(function(){
            var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
            guiPlayerInfo.reloadInfo();
            this.destroy();
        }.bind(this));

        this.showGift(coinAmount);
    },

    showGift: function(coinAmount){
        var giftImage = GraphicSupporter.drawGift(new GiftData(GiftType.COIN, coinAmount), "res/lobby/common_gift_slot.png");
        giftImage.setPosition(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2-35);
        this.bg.addChild(giftImage);
    },
});