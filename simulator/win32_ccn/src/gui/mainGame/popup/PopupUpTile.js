/**
 * Created by user on 5/4/2017.
 */

var PopupUpTile = BasePopup.extend({
    ctor: function(time,callback){
        this.moneyNumber = 0;
        this.timeRemain = GameUtil.getTimeAuto(time);

        this._super(res.ZCSD_POPUP_UP_TILE);
        this.initGui();
        this.callback = callback;
    },

    initGui: function(){
        var bg = this._rootNode.getChildByName("bg");

        var textUpTile = bg.getChildByName("title_slot").getChildByName("text_up_tile");
        textUpTile.setString(fr.Localization.text("Up_tile"));

        var textUpTileDescription = bg.getChildByName("text_up_tile");
        textUpTileDescription.setString(fr.Localization.text("Up_tile_description"));

        var btnOk = bg.getChildByName("btn_ok");
        btnOk.addClickEventListener(this.onBtnOkClicked.bind(this, true));
        var textOk = btnOk.getChildByName("text_ok");
        textOk.setString(fr.Localization.text("Ok"));

        var btnCancel = bg.getChildByName("btn_cancel");
        btnCancel.addClickEventListener(this.onBtnOkClicked.bind(this, false));
        var textCancel = btnCancel.getChildByName("text_cancel");
        textCancel.setString(fr.Localization.text("Cancel"));

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
        if(isActive){
            this.unschedule(this.onUpdate);
            this.removeFromParent();
            this.callback();
        }else{
            gv.gameClient.sendPacketControlSell(-1);
            this.callback();
            //gv.gameClient._clientListener.dispatchPacketInQueue();
            this.unschedule(this.onUpdate);
            this.removeFromParent();
        }
    }
});