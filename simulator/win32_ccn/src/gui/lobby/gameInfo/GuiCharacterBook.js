/**
 * Created by user on 1/6/2016.
 */

var GuiCharacterBook = BaseGui.extend({

    MAX_ELEMENT_IN_CELL: 4,
    CHARACTER_TABLE_SIZE: cc.size(293*0.43*6, 374*0.43*2.3),
    CHARACTER_TABLE_CELL_SIZE: cc.size(293*0.43, 374*0.43),

    characterList: null,
    selectedCharacter: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_CHARACTER_BOOK);
        this.setFog(true);

        if ((!gv.guiMgr.getGuiById(GuiId.CARD_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.DICE_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.SKILL_BOOK)))
            this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");
        this.bg.getChildByName("btn_close").addClickEventListener(this.destroy.bind(this, DestroyEffects.ZOOM));

        var cardBtn = this.bg.getChildByName("btn_card");
        cardBtn.addClickEventListener(this.onCardBtnClick.bind(this));

        var diceBtn = this.bg.getChildByName("btn_dice");
        diceBtn.addClickEventListener(this.onDiceBtnClick.bind(this));

        var skillBtn = this.bg.getChildByName("btn_skill");
        skillBtn.addClickEventListener(this.onSkillBtnClick.bind(this));

        this.mainCharSlot = this.bg.getChildByName("main_char_slot");
        //this.mainCharSlot.addTouchEventListener(this.onCharacterSlotTouch,  this);
        this.charImageOriginScale = this.mainCharSlot.getChildByName("main_char_image").getScale();

        var btnSelfie = this.mainCharSlot.getChildByName("btn_selfie");
        btnSelfie.addClickEventListener(this.onSelfieBtnClick.bind(this));

        this.characterList = CharacterConfig.getInstance().getCharacterList();
        this.selectedCharacter = this.characterList[0];

        this.table = new cc.TableView(this, this.CHARACTER_TABLE_SIZE);
        this.table.setPosition(380,50);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.setDelegate(this);
        this.bg.addChild(this.table);

        //this.skillTable = new CharacterSkillTable(this.selectedCharacter, 0);
        //this.skillTable.setPosition(this.mainCharSlot.getContentSize().width/2, this.mainCharSlot.getContentSize().height/2-20);
        //this.skillTable.setScaleX(0);
        //this.mainCharSlot.addChild( this.skillTable);

        this.loadSelectedCharacter();
    },

    loadSelectedCharacter: function(){
        var nameSlot = this.mainCharSlot.getChildByName("main_char_name_slot");
        var starSlot = this.mainCharSlot.getChildByName("main_char_star_slot");
        var name = this.mainCharSlot.getChildByName("main_char_name");
        var image = this.mainCharSlot.getChildByName("main_char_image");

        fr.changeSprite(nameSlot, "star_slot_" + GameUtil.getClassNameById(this.selectedCharacter.clazz) + ".png");
        name.setString(fr.Localization.text("character_name_" + this.selectedCharacter.id));
        fr.changeSprite(image, this.selectedCharacter.id+"_model.png");

        if (!starSlot.getChildByTag(0)){
            for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++){
                var star = fr.createSprite("card_star_disable.png");
                star.setPosition(130 + (star.getContentSize().width+7) * j, starSlot.getContentSize().height/2);
                star.setTag(j);
                starSlot.addChild(star);
            }
        }
        var starNumber = this.selectedCharacter.getStarFromLevel(this.selectedCharacter.level);
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
            var star =  starSlot.getChildByTag(j);
            fr.changeSprite(star,j<starNumber?"card_star_enable.png":"card_star_disable.png");
        }

        //this.skillTable.reloadData(this.selectedCharacter);
    },

    tableCellAtIndex:function (table, idx) {
        var cell = new cc.TableViewCell();

        for (var i=0; i<this.MAX_ELEMENT_IN_CELL; i++){

            if (idx*this.MAX_ELEMENT_IN_CELL+i>=this.characterList.length) break;
            var characterData = this.characterList[idx*this.MAX_ELEMENT_IN_CELL+i];

            var cardImage = GraphicSupporter.drawCard(characterData);
            cardImage.setSwallowTouches(false);
            cardImage.setPosition((i+0.5)*this.CHARACTER_TABLE_CELL_SIZE.width,this.CHARACTER_TABLE_CELL_SIZE.height/2);
            cardImage.addClickEventListener(this.onCardClick.bind(this, idx*this.MAX_ELEMENT_IN_CELL+i));
            cardImage.setScale(0.4);
            cell.addChild(cardImage);
        }
        return cell;
    },

    onCardClick: function(index){
        this.selectedCardIndex = index;
    },

    tableCellTouched:function (table, cell) {
        if (this.selectedCardIndex!=-1){//selected and not main char
            this.selectedCharacter = this.characterList[this.selectedCardIndex];
            this.loadSelectedCharacter();
            this.selectedCardIndex = -1;
        }
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.CHARACTER_TABLE_CELL_SIZE;
    },

    numberOfCellsInTableView:function (table) {
        return Math.ceil(this.characterList.length/this.MAX_ELEMENT_IN_CELL);
    },

    onCharacterSlotTouch : function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.mainCharSlot.setTag(1);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                if (this.mainCharSlot.getTag() == 0) return;

                this.characterDisplayState = !this.characterDisplayState;

                var mainCharSlot = this.bg.getChildByName("main_char_slot");
                var characterImage = mainCharSlot.getChildByName("main_char_image");

                if (!this.characterDisplayState){
                    characterImage.runAction(cc.scaleTo(0.15,0,this.charImageOriginScale));
                    this.skillTable.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15,1,1)
                    ));
                }
                else{
                    this.skillTable.runAction(cc.scaleTo(0.15,0,1));
                    characterImage.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15, this.charImageOriginScale,this.charImageOriginScale)
                    ));
                }
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.mainCharSlot.setTag(0);
                break;
        }
    },

    onCardBtnClick: function(){
        gv.guiMgr.addGui(new GuiCardBook(), GuiId.CARD_BOOK, LayerId.LAYER_GUI);
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

    onSelfieBtnClick: function(){
        gv.guiMgr.addGui(new GuiSelfie(), GuiId.SELFIE, LayerId.LAYER_GUI);
    }

});