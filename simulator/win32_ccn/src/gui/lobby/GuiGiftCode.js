/**
 * Created by user on 15/5/2016.
 */

var GuiGiftCode = BaseGui.extend({

    ctor: function () {
        this._super(res.ZCSD_GUI_GIFT_CODE);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");
        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function () {
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        this.textFiledGifCode = this.bg.getChildByName("textField_giftcode");
        this.textFiledGifCode.addEventListener(this.onTextFiledChanged.bind(this));
        this.textGiftcode = this.bg.getChildByName("text_giftcode");

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));
    },

    onTextFiledChanged: function(sender){
        if (this.textGiftcode.getString().length>=25) return;
        this.textGiftcode.setString(sender.getString());
    },

    onOkBtnClick: function(){
        GuiUtil.showWaitingGui();
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.GIFT_CODE, this.onGiftCodeResult.bind(this));
        cc.log(this.textGiftcode.getString());
    },

    onGiftCodeResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().remove(NotificationHandlerId.GIFT_CODE);
    },

});