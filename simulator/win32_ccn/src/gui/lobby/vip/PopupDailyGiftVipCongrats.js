/**
 * Created by user on 7/5/2016.
 */

var PopupDailyGiftVipCongrats = BasePopup.extend({

    ctor: function(){
        this._super(res.ZCSD_POPUP_DAILY_GIFT_VIP_CONGRATS);
        this.bg = this._rootNode.getChildByName("bg");
        var receiveBtn = this.bg.getChildByName("btn_receive");
        receiveBtn.addClickEventListener(this.onReceiveBtnClick.bind(this));
        this.showGifts();
    },

    onReceiveBtnClick: function(){
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