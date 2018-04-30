/**
 * Created by user on 5/4/2017.
 */

var PopupPayForSummon = BasePopup.extend({
    ctor: function(time){
        this.moneyNumber = 0;
        this.timeRemain = time;

        this._super(res.ZCSD_POPUP_PAY_FOR_SUMMON);
        this.initGui();
    },

    initGui: function(){
        var bg = this._rootNode.getChildByName("bg");

        var textSummon = bg.getChildByName("title_slot").getChildByName("text_summon");
        textSummon.setString(fr.Localization.text("Summon"));

        var textPayForSummon = bg.getChildByName("text_pay_for_summon");
        textPayForSummon.setString(fr.Localization.text("Pay_for_summon_description"));

        var btnOk = bg.getChildByName("btn_ok");
        btnOk.addClickEventListener(this.onBtnOkClicked.bind(this, true));
        var textOk = btnOk.getChildByName("text_ok");
        textOk.setString(fr.Localization.text("Ok"));

        var btnCancel = bg.getChildByName("btn_cancel");
        btnCancel.addClickEventListener(this.onBtnOkClicked.bind(this, false));
        var textCancel = btnCancel.getChildByName("text_cancel");
        textCancel.setString(fr.Localization.text("Cancel"));

        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        this.moneyNumber = GameModeConfig.getInstance().getSummonFee(betLevel);
        var textMoney = bg.getChildByName("money_text");
        textMoney.setString(StringUtil.toMoneyString(this.moneyNumber));

        //sau Xs thi tu dong close
        this.schedule(this.update, 1);
    },

    update: function(dt){
        this.timeRemain--;
        if (this.timeRemain<=0){
            this.onBtnOkClicked(false);
        }
    },

    onBtnOkClicked: function(isActive){
        gv.gameClient.sendPlayerPayToSummon(isActive);
        this.destroy();
    }
});