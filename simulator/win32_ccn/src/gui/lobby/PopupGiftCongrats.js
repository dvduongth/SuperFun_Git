/**
 * Created by user on 28/4/2016.
 */

var PopupGiftCongrats = BasePopup.extend({

    ctor: function(descriptionText, giftDataList){
        this._super();
        this.loadData(descriptionText, giftDataList);
        fr.Sound.playSoundEffect(resSound.m_addcoin);
    },

    loadData: function(descriptionText, giftDataList){
        var bg = fr.createSprite("res/lobby/popup_bg.png");
        bg.setScale(giftDataList.length==1?0.8:1);
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);

        var congratSlot = fr.createSprite("res/lobby/gift_congrats_slot.png");
        congratSlot.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
        congratSlot.setScale(1/bg.getScale());
        bg.addChild(congratSlot);

        var notiText = fr.createSprite("res/lobby/notification_text.png");
        notiText.setPosition(bg.getContentSize().width/2, 483);
        notiText.setScale(1/bg.getScale());
        bg.addChild(notiText);

        var descriptionLb = new ccui.Text(descriptionText, res.FONT_GAME_BOLD, 32);
        descriptionLb.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        descriptionLb.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        descriptionLb.setColor(BaseGui.TEXT_COLOR_BROWN);
        descriptionLb.setPosition(bg.getContentSize().width/2, bg.getContentSize().height*2/3+50);
        bg.addChild(descriptionLb);

        for(var i=0; i< giftDataList.length; i++) {
            var giftImage = GraphicSupporter.drawGift(giftDataList[i], "res/lobby/common_gift_slot.png");
            giftImage.setPosition(bg.getContentSize().width * (i + 1) / (giftDataList.length + 1), bg.getContentSize().height/2-5);
            giftImage.setScale(1/bg.getScale());
            bg.addChild(giftImage);
        }

        var okBtn = fr.createSimpleButton("res/lobby/btn_ok.png", ccui.Widget.LOCAL_TEXTURE);
        okBtn.setPosition(bg.getContentSize().width/2,80);
        okBtn.setScale(1.2/bg.getScale());
        okBtn.addClickEventListener(this.destroy.bind(this));
        bg.addChild(okBtn);
    },

    destroy: function(){
        this._super();
        var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
        guiPlayerInfo.reloadInfo();
    },
});