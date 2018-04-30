/**
 * Created by user on 1/6/2016.
 */

var GuiCardBook = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_CARD_BOOK);
        this.setFog(true);

        if ((!gv.guiMgr.getGuiById(GuiId.CHARACTER_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.DICE_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.SKILL_BOOK)))
            this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");
        this.bg.getChildByName("btn_close").addClickEventListener(this.destroy.bind(this, DestroyEffects.ZOOM));

        var characterBtn = this.bg.getChildByName("btn_character");
        characterBtn.addClickEventListener(this.onCharacterBtnClick.bind(this));

        var diceBtn = this.bg.getChildByName("btn_dice");
        diceBtn.addClickEventListener(this.onDiceBtnClick.bind(this));

        var skillBtn = this.bg.getChildByName("btn_skill");
        skillBtn.addClickEventListener(this.onSkillBtnClick.bind(this));

        this.characterList = CharacterConfig.getInstance().getDelegateCharacterListByClass();

        //for(var i=0; i< this.characterList.length; i++) {
        //    var characterData = this.characterList[i];
        //    var card = GraphicSupporter.drawCard(characterData);
        //    card.setScale(0.55);
        //    card.setPosition(110 + (card.getContentSize().width*card.getScale() + 8.5)*i, this.bg.getContentSize().height/2);
        //    this.bg.addChild(card);
        //}
    },

    onCharacterBtnClick: function(){
        gv.guiMgr.addGui(new GuiCharacterBook(), GuiId.CHARACTER_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

    onDiceBtnClick: function(){
        gv.guiMgr.addGui(new GuiDiceBook(), GuiId.DICE_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

    onSkillBtnClick: function(){
        gv.guiMgr.addGui(new GuiSkillBook(), GuiId.SKILL_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

});