/**
 * Created by CPU11674-local on 4/7/2016.
 */

var GuiAutoPick = BasePopup.extend({

    ctor: function(){
        this._super(res.ZCSD_GUI_AUTO_PICK);

        this.closeBtn = this._rootNode.getChildByName("closeBtn");
        this.closeBtn.addClickEventListener(this.closeBtnClick.bind(this));

        this.pickBBtn = this._rootNode.getChildByName("pickBBtn");
        this.pickBBtn.addClickEventListener(this.pickBBtnClick.bind(this));

        this.pickCBtn = this._rootNode.getChildByName("pickCBtn");
        this.pickCBtn.addClickEventListener(this.pickCBtnClick.bind(this));


        this.pickDBtn = this._rootNode.getChildByName("pickDBtn");
        this.pickDBtn.addClickEventListener(this.pickDBtnClick.bind(this));
    },


    closeBtnClick: function () {
        cc.log("close");
        this.destroy();
    },

    pickBBtnClick: function (){
        var gui = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
        gui.autoPick(PlayerClass.CLASS_B);
        this.destroy();
        cc.log("B");
    },

    pickCBtnClick: function (){
        var gui = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
        gui.autoPick(PlayerClass.CLASS_C);
        this.destroy();
        cc.log("C");
    },

    pickDBtnClick: function (){
        var gui = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
        gui.autoPick(PlayerClass.CLASS_D);
        this.destroy();
        cc.log("D");
    },
});
