/**
 * Created by user on 23/5/2016.
 */

PopupNotificationSize = {
    SMALL: 0,
    MEDIUM: 1,
    LARGE: 2
};

var PopupNotification = BasePopup.extend({

    ctor: function(notificationText, popupSize) {
        this._super();

        popupSize = typeof popupSize!=="undefined"?popupSize:PopupNotificationSize.SMALL;

        var bg = null;
        switch (popupSize){
            case PopupNotificationSize.SMALL:
                bg = fr.createSprite("res/lobby/popup_bg_small.png");
                break;
            case PopupNotificationSize.MEDIUM:
                bg = fr.createSprite("res/lobby/popup_bg.png");
                bg.setScale(0.8);
                break;
            case PopupNotificationSize.LARGE:
                bg = fr.createSprite("res/lobby/popup_bg.png");
                break;
        }
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(bg);

        var notiText = ccui.Text(fr.Localization.text("Notification"), res.FONT_GAME_BOLD, 30);
        notiText.enableShadow(cc.color(0,0,0), cc.size(0, -1));
        notiText.enableOutline(cc.color(0,0,0), 1);
        notiText.setPosition(bg.getContentSize().width/2, bg.getContentSize().height-28);
        bg.addChild(notiText);

        var closeBtn = fr.createSimpleButton("res/button/x.png", ccui.Widget.LOCAL_TEXTURE);
        closeBtn.setPosition(bg.getContentSize().width - 32, bg.getContentSize().height - 32);
        closeBtn.setScale(0.8);
        closeBtn.addClickEventListener(this.destroy.bind(this));
        bg.addChild(closeBtn);

        var notificationLabel = new ccui.Text(notificationText, res.FONT_GAME_BOLD, 28);
        notificationLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        notificationLabel.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height / 2);
        if (popupSize == PopupNotificationSize.SMALL){
            notificationLabel.setScale(0.8);
        }
        bg.addChild(notificationLabel);

    }
});