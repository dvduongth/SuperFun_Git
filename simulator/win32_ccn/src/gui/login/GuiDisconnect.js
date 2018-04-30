/**
 * Created by user on 8/8/2016.
 */

var GuiDisconnect = BaseGui.extend({

    ctor: function(disconnectReason){

        this._super(res.ZCSD_GUI_DISCONNECT);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        disconnectReason = typeof disconnectReason !== "undefined" ? disconnectReason : gv.DISCONNECT_REASON.UNKNOWN;

        var bg = this._rootNode.getChildByName("bg");

        var description = bg.getChildByName("description");
        description.setString(fr.Localization.text("Disconnect_reason_"+disconnectReason));

        var okBtn = bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));
    },

    onOkBtnClick: function(){
        if(gv.matchMng){ // neu ma dang o lobby chua vao game thi khong co matchMng
            gv.matchMng.cleanUpMatch();
        }
        gv.guiMgr.removeAllGui();

        var guiLogin = new GuiLogin();
        gv.guiMgr.addGui(guiLogin, GuiId.LOGIN, LayerId.LAYER_GUI);
        gv.socialMgr.autoLogin();
    },
});