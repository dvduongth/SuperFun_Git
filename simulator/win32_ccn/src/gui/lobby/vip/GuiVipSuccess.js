/**
 * Created by user on 5/5/2016.
 */

var GuiVipSuccess = BasePopup.extend({

    ctor: function(){
        this._super(res.ZCSD_GUI_VIP_SUCCESS);

        this.bg = this._rootNode.getChildByName("bg");

        this.receiveBtn = this.bg.getChildByName("btn_receive");
        this.receiveBtn.addClickEventListener(this.onOkBtnClick.bind(this));

        this.showGifts();
    },

    onOkBtnClick: function(){
        GuiUtil.showWaitingGui();
        gv.gameClient.sendVipDailyGiftClaim();
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.VIP_DAILY_GIFT_CLAIM, this.onReceiveGiftResult.bind(this));
    },

    onReceiveGiftResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.VIP_DAILY_GIFT_CLAIM);
        this.destroy();
    },

    showGifts: function(){
        var giftList = VipConfig.getInstance().getGiftList();
        for (var i=0; i<giftList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(this.bg.getContentSize().width * (i + 1) / (giftList.length + 1), this.bg.getContentSize().height/2);
            this.bg.addChild(giftImage);
        }
    },
});