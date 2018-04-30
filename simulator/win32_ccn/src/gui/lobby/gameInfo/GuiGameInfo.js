/**
 * Created by user on 9/3/2016.
 */

var GameInfoType = {
    CHARACTER: 0,
    DICE: 1
} ;

var GuiGameInfo = BaseGui.extend({

    ctor: function(type){
        this._super(res.ZCSD_GUI_GAME_INFO);
        this.setFog(true);

        this.gameInfoType = type;
        //
        ////this.mainSlot = this._rootNode.getChildByName("main_slot");
        //
        this.charBtn = this._rootNode.getChildByName("btn_character");
        this.charBtn.addClickEventListener(this.onCharacterClick.bind(this));
        this.charBtn.setPressedActionEnabled(false);
        //
        //this.upgradeCharBtn = this._rootNode.getChildByName("btn_upgrade_character");
        //this.upgradeCharBtn.addClickEventListener(this.onUpgradeCharacterClick.bind(this));
        //
        this.diceBtn = this._rootNode.getChildByName("btn_dice");
        this.diceBtn.addClickEventListener(this.onDiceClick.bind(this));
        this.diceBtn.setPressedActionEnabled(false);
        //
        //
        //var btnBook = this._rootNode.getChildByName("btn_book");
        //btnBook.addClickEventListener(this.onBookClick.bind(this));
        //
        //var btnGacha = this._rootNode.getChildByName("btn_gacha");
        //btnGacha.addClickEventListener(this.onGachaBtnClick.bind(this));
        //
        //var btnSellCharacter = this._rootNode.getChildByName("btn_sell_char");
        //btnSellCharacter.addClickEventListener(this.onSellCharacterBtnClick.bind(this));

        var closeBtn = this._rootNode.getChildByName("btn_close");
        closeBtn.addClickEventListener(this.onCloseBtnClick.bind(this));

        this.reloadResource();
    },

    reloadResource: function(){
        this.charBtn.loadTextureNormal("res/lobby/game_info/btn_main_tab_" + ((this.gameInfoType==GameInfoType.CHARACTER)? "1":"2") + ".png", ccui.Widget.LOCAL_TEXTURE);

        //this.upgradeCharBtn.loadTextureNormal("res/lobby/version2/game_info/btn_upgrade_" + (this.gameInfoType==GameInfoType.UPGRADE_CHARACTER? "enable":"disable") + ".png", ccui.Widget.LOCAL_TEXTURE);
        //this.upgradeCharBtn.loadTexturePressed("res/lobby/version2/game_info/btn_upgrade_" + (this.gameInfoType==GameInfoType.UPGRADE_CHARACTER? "enable":"disable") + ".png", ccui.Widget.LOCAL_TEXTURE);

        this.diceBtn.loadTextureNormal("res/lobby/game_info/btn_main_tab_" + (this.gameInfoType==GameInfoType.DICE? "1":"2") + ".png", ccui.Widget.LOCAL_TEXTURE);

        var gui = gv.guiMgr.getGuiById(GuiId.SELECT_CHARACTER);
        if (gui) gui.destroy();

        gui = gv.guiMgr.getGuiById(GuiId.SELL_CHARACTER);
        if (gui) gui.destroy();

        gui = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
        if (gui) gui.destroy();

        gui = gv.guiMgr.getGuiById(GuiId.DICE_SHOP);
        if (gui) gui.destroy();

        switch(this.gameInfoType){
            case GameInfoType.CHARACTER:
                gv.guiMgr.addGui(new GuiSelectCharacter(), GuiId.SELECT_CHARACTER, LayerId.LAYER_GUI);
                break;
            case GameInfoType.SELL_CHARACTER:
                gv.guiMgr.addGui(new GuiSellCharacter(), GuiId.SELL_CHARACTER, LayerId.LAYER_GUI);
                break;
            case GameInfoType.UPGRADE_CHARACTER:
                gv.guiMgr.addGui(new GuiUpgradeCharacter(), GuiId.UPGRADE_CHARACTER, LayerId.LAYER_GUI);
                break;
            case GameInfoType.DICE:
                gv.guiMgr.addGui(new GuiDiceShop(), GuiId.DICE_SHOP, LayerId.LAYER_GUI);
                break;
        }
    },
    //
    onCharacterClick: function(){
        if ((this.gameInfoType!=GameInfoType.CHARACTER) && (this.gameInfoType!=GameInfoType.SELL_CHARACTER)){
            this.gameInfoType = GameInfoType.CHARACTER;
            this.reloadResource();
        }
    },
    //
    //onUpgradeCharacterClick: function(){
    //    if (this.gameInfoType!=GameInfoType.UPGRADE_CHARACTER){
    //        this.gameInfoType = GameInfoType.UPGRADE_CHARACTER;
    //        this.reloadResource();
    //    }
    //},
    //
    onDiceClick: function(){
        if (this.gameInfoType!=GameInfoType.DICE) {
            this.gameInfoType = GameInfoType.DICE;
            this.reloadResource();
        }
    },

    onCloseBtnClick: function(){
        var gui = gv.guiMgr.getGuiById(GuiId.SELECT_CHARACTER);
        if (gui) gui.destroy();

        var gui = gv.guiMgr.getGuiById(GuiId.SELL_CHARACTER);
        if (gui) gui.destroy();

        gui = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
        if (gui) gui.destroy();

        var gui = gv.guiMgr.getGuiById(GuiId.DICE_SHOP);
        if (gui) gui.destroy();

        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).setVisibleSocialInfo(true);

        this.destroy();
    },
    //
    //onBookClick: function(){
    //    gv.guiMgr.addGui(new GuiCharacterBook(), GuiId.CHARACTER_BOOK, LayerId.LAYER_GUI);
    //},
    //
    //onGachaBtnClick: function(){
    //    gv.guiMgr.addGui(new GuiGacha(), GuiId.GACHA, LayerId.LAYER_GUI);
    //},
    //
    //onSellCharacterBtnClick: function(){
    //    gv.guiMgr.addGui(new GuiSellCharacter(), GuiId.SELL_CHARACTER, LayerId.LAYER_GUI);
    //},

});