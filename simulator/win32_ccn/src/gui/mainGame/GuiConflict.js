/**
 * Created by user on 8/8/2016.
 */

var GuiConflict = BaseGui.extend({

    ctor: function(conflictText){

        this._super(res.ZCSD_GUI_DISCONNECT);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);
        this.setOpacity(150);

        var bg = this._rootNode.getChildByName("bg");

        var description = bg.getChildByName("description");
        description.setString(conflictText);

        var okBtn = bg.getChildByName("btn_ok");
        okBtn.addClickEventListener(this.onOkBtnClick.bind(this));
    },

    onOkBtnClick: function(){
        gv.matchMng.cleanUpMatch();
        gv.guiMgr.removeAllGui();

        var guiLogin = new GuiLogin();
        gv.guiMgr.addGui(guiLogin, GuiId.LOGIN, LayerId.LAYER_GUI);
        gv.socialMgr.autoLogin();
    },
});