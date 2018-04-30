/**
 * Created by user on 18/5/2016.
 */

var GuiNotEnoughGold = BasePopup.extend({

    ctor: function () {
        this._super(res.ZCSD_GUI_NOT_ENOUGH_GOLD);

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(this.onCloseBtnClick.bind(this));

        var cancelBtn = this.bg.getChildByName("btn_cancel");
        cancelBtn.addClickEventListener(this.onCloseBtnClick.bind(this));

        var okBtn = this.bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));
    },

    onCloseBtnClick: function(){
        this.destroy();
    },

    onOkBtnClick: function () {
        this.destroy();
        gv.guiMgr.addGui(new GuiBuyGold(), GuiId.BUY_GOLD, LayerId.LAYER_GUI);
    },

});