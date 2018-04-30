/**
 * Created by user on 23/3/2016.
 */

var GuiSelectCharacterConfirm = BaseGui.extend({

    selectedCharacter: null,

    ctor: function(selectedCharData){
        this._super(res.ZCSD_GUI_SELECT_CHARACTER_CONFIRM);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");

        this.selectedCharacter = selectedCharData;
        this.pickBtn = this.bg.getChildByName("btn_pick");
        this.pickBtn.addClickEventListener(this.onPickBtnClick.bind(this));

        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function(){
            this.destroy();
        }.bind(this));

        this.loadCurrentCharacter();
        this.loadNextCharacter(selectedCharData);

    },

    loadCurrentCharacter: function(){
        var charData = UserData.getInstance().getCharacterInfoByUID(UserData.getInstance().mainCharUid);

        var cardTicked = this.bg.getChildByName("card_main_char_ticked");
        cardTicked.setLocalZOrder(1);

        var card = GraphicSupporter.drawCard(charData);
        card.setPosition(this.bg.getChildByName("cur_char_card").getPosition());
        card.setScale(0.44);
        this.bg.addChild(card);

        this.curCharSkillTable = new CharacterSkillTable(UserDataUtil.getMainCharData(), 1);
        this.curCharSkillTable.setPosition(this.bg.getContentSize().width/2-140, this.bg.getContentSize().height/2-82);
        this.bg.addChild( this.curCharSkillTable);
    },

    loadNextCharacter: function(selectedCharData){
        var card = GraphicSupporter.drawCard(selectedCharData);
        card.setPosition(this.bg.getChildByName("next_char_card").getPosition());
        card.setScale(0.44);
        this.bg.addChild(card);

        this.nextCharSkillTable = new CharacterSkillTable(selectedCharData, 1);
        this.nextCharSkillTable.setPosition(this.bg.getContentSize().width/2+140, this.bg.getContentSize().height/2-82);
        this.bg.addChild( this.nextCharSkillTable);
    },

    onPickBtnClick: function(){
        this.setTouchEnable(false);
        gv.gameClient.sendPickMainCharacter(this.selectedCharacter.uid);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.PICK_MAIN_CHARACTER_RESULT, this.onPickResult.bind(this));
    },

    onPickResult: function(){
        this.setTouchEnable(true);
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.PICK_MAIN_CHARACTER_RESULT);
        UserData.getInstance().mainCharUid = this.selectedCharacter.uid;

        this.destroy();

        var guiSelectChar = gv.guiMgr.getGuiById(GuiId.SELECT_CHARACTER);
        if (guiSelectChar){
            guiSelectChar.loadTableView();
            guiSelectChar.loadMainCharacter();
        }

        var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
        if (guiLobby){
            guiLobby.loadMainCharacter();
        }
    },

});