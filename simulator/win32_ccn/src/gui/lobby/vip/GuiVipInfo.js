/**
 * Created by user on 5/5/2016.
 */

var GuiVipInfo = BasePopup.extend({

    ctor: function(){
        this._super(res.ZCSD_GUI_VIP_INFO);

        this.bg = this._rootNode.getChildByName("bg");

        this.closeBtn = this.bg.getChildByName("btn_close");
        this.closeBtn.addClickEventListener(function(){
            this.destroy();
        }.bind(this));

        this.showGifts();

        var vipExpiredTime = UserData.getInstance().vipExpiredTime;
        var curTime = GameUtil.getCurrentTime();
        var day = Math.floor((vipExpiredTime-curTime)/86400) + ((vipExpiredTime-curTime)%86400==0? 0:1);

        var timeRemainLabel = this.bg.getChildByName("timeRemainLabel");
        timeRemainLabel.setString(day + " " + fr.Localization.text("Day"));

        var avatarSlot = this.bg.getChildByName("avatar_slot");

        var myAvatar = new fr.Avatar("", AvatarShape.ORIGINAL);
        myAvatar.setScale(1.1);
        myAvatar.setPosition(avatarSlot.getContentSize().width/2-3, avatarSlot.getContentSize().height/2+3);
        avatarSlot.addChild(myAvatar);

        var displayName = avatarSlot.getChildByName("display_name");
        displayName.setString(StringUtil.limitWordNumber(UserData.getInstance().displayName, 20));
    },

    showGifts: function(){
        var giftList = VipConfig.getInstance().getGiftList();
        for (var i=0; i<giftList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(this.bg.getContentSize().width * (i + 1) / (giftList.length + 1), this.bg.getContentSize().height/2-140);
            this.bg.addChild(giftImage);
        }
    },
});