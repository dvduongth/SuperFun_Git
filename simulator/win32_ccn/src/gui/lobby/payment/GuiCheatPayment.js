/**
 * Created by user on 7/5/2016.
 */

var CheatPaymentType = {
    GOLD_SMS: 0,
    COIN_CARD: 1,
    VIP_CARD: 2
};

var GuiCheatPayment = BaseGui.extend({

    cheatPaymentType: -1,

    ctor: function(cheatPaymentType){
        this._super(res.ZCSD_GUI_CHEAT_PAYMENT);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.cheatPaymentType = cheatPaymentType;

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function(){
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        this.textFiledMoney = this.bg.getChildByName('textField_money');
        this.textFiledMoney.addEventListener(this.onTextFiledChanged.bind(this));

        this.textMoney = this.bg.getChildByName('text_money');

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));
    },

    onOkBtnClick: function(){
        var money = isNaN(parseInt(this.textMoney.getString()))? null: parseInt(this.textMoney.getString());
        if (money!=null){
            GuiUtil.showWaitingGui();
            gv.gameClient.sendUserCheatPayment(this.cheatPaymentType, money);
            NotificationHandler.getInstance().addHandler(NotificationHandlerId.USER_CHEAT_PAYMENT, this.onCheatResult.bind(this));
        }
        else{
            var failedLabel = new ccui.Text(fr.Localization.text("cheat_payment_enter_number_failed"), res.FONT_UNICODE_VREVUE_TFF, 20);
            failedLabel.setPosition(this.getContentSize().width/2, this.getContentSize().height/2+25);
            failedLabel.setColor(cc.color.RED);
            failedLabel.runAction(cc.sequence(
                cc.delayTime(1.0),
                cc.fadeOut(0.5),
                cc.callFunc(function(){
                    failedLabel.removeFromParent();
                })
            ));
            this.addChild(failedLabel);
        }
    },

    onCheatResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.USER_CHEAT_PAYMENT);
        this.destroy();
    },

    onTextFiledChanged: function(sender){
        if (this.textMoney.getString().length>=18) return;
        this.textMoney.setString(sender.getString());
    },

});