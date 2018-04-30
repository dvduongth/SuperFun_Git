/**
 * Created by user on 16/3/2016.
 */

var GuiSelectCharacter = BaseGui.extend({

    CARD_SCALE: 0.38,

    MAX_ELEMENT_IN_CELL: 4,
    CHARACTER_TABLE_SIZE: cc.size(305*0.42*3.85, 395*0.46),
    CHARACTER_TABLE_CELL_SIZE: cc.size(305*0.42, 395*0.46),

    playerInfo: null,
    characterList: [],
    ascendSort: false,

    ctor: function(){
        this._super(res.ZCSD_GUI_SELECT_CHARACTER);

        this.currentSelectChar = -1;
        this.currentSelectCard = null;
        this.curSelectedCharSkillTable = null;

        this.ascendSort = true;

        this.characterList = UserDataUtil.getCharListSortedByClazzWithMainCharPriority(this.ascendSort);

        this.characterDisplayState = true;
        this.mainCharSlot = this._centerNode.getChildByName("main_char_slot");
        this.mainCharSlot.addTouchEventListener(this.onCharacterSlotTouch,  this);
        this.mainCharSlot.setPressedActionEnabled(false);

        this.skillTable = new CharacterSkillTable(UserDataUtil.getMainCharData(), 0);
        this.skillTable.setPosition(this.mainCharSlot.getContentSize().width/2, this.mainCharSlot.getContentSize().height/2+55);
        this.skillTable.setScale(0.9);
        this.skillTable.setScaleX(0);
        this.mainCharSlot.addChild( this.skillTable);

        this.myCharSlot = this._centerNode.getChildByName("my_char_slot");

        if (!gv.guiMgr.getGuiById(GuiId.SELL_CHARACTER)){
            var destination = this.mainCharSlot.getPosition();
            this.mainCharSlot.setPositionX(- this.mainCharSlot.getContentSize().width/2-cc.winSize.width/2);
            this.mainCharSlot.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

            destination = this.myCharSlot.getPosition();
            this.myCharSlot.setPositionX(cc.winSize.width/2+this.myCharSlot.getContentSize().width/2);
            this.myCharSlot.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));
        }

        //Main character region
        this.pickCharacterBtn = this.mainCharSlot.getChildByName("btn_pick_char");
        this.pickCharacterBtn.addClickEventListener(this.onPickCharacterBtnClick.bind(this));
        this.pickCharacterBtn.getChildByName("text_select").setString(fr.Localization.text("Select_character"));

        this.mainCharNameSlot = this.mainCharSlot.getChildByName("main_char_name_slot");
        this.mainCharName = this.mainCharSlot.getChildByName("main_char_name");
        this.mainCharImage = this.mainCharSlot.getChildByName("main_char_image");
        this.charImageOriginScale = this.mainCharImage.getScale();

        var starSlot = this.mainCharSlot.getChildByName("star_slot");
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++){
            var star = fr.createSprite("card_star_disable.png");
            star.setPosition(60 + (star.getContentSize().width+7) * j, starSlot.getContentSize().height/2);
            star.setTag(j);
            starSlot.addChild(star);
        }

        //my character region

        var btnSelectChar = this.myCharSlot.getChildByName("btn_select_char");
        btnSelectChar.getChildByName("text_select").setString(fr.Localization.text("Change_character"));
        btnSelectChar.setPressedActionEnabled(false);

        var btnUpgradeChar = this.myCharSlot.getChildByName("btn_upgrade_character");
        btnUpgradeChar.addClickEventListener(this.onUpgradeBtnClick.bind(this));
        btnUpgradeChar.getChildByName("text_upgrade").setString(fr.Localization.text("Upgrade"));
        btnUpgradeChar.setPressedActionEnabled(false);

        var btnBuy = this.myCharSlot.getChildByName("btn_buy");
        btnBuy.addClickEventListener(this.onBuyBtnClick.bind(this));
        btnBuy.getChildByName("text_buy").setString(fr.Localization.text("Buy"));
        btnBuy.setPressedActionEnabled(false);

        var btnSellCharacter = this.myCharSlot.getChildByName("btn_sell_char");
        btnSellCharacter.addClickEventListener(this.onSellCharBtnClick.bind(this));
        btnSellCharacter.getChildByName("text_sell").setString(fr.Localization.text("Sell"));
        btnSellCharacter.setPressedActionEnabled(false);

        this.charNumberOnSumLb = this.myCharSlot.getChildByName("char_number_on_sum");

        this.sortCharacterBtn = this.myCharSlot.getChildByName("sort_char_btn");
        this.sortCharacterBtn.setLocalZOrder(1);
        this.sortCharacterBtn.addClickEventListener(this.onSortCharacterBtnClick.bind(this));
        this.sortCharacterBtn.getChildByName("text_sort").setString(fr.Localization.text("Sort_2line"));

        this.characterList = UserDataUtil.getCharListSortedByClazzWithMainCharPriority(true);

        this.table = new cc.TableView(this, this.CHARACTER_TABLE_SIZE);
        this.table.setPosition(105,12);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.table.setDelegate(this);
        this.myCharSlot.addChild(this.table);

        this.selectedCardIndex = -1;

        this.loadMainCharacter();
        this.loadCurrentSelectCharacter(UserDataUtil.getMainCharData());
        this.loadTableView();
    },

    tableCellAtIndex:function (table, idx) {
        var cell = new cc.TableViewCell();

        var characterData = this.characterList[idx];

        var cardImage = GraphicSupporter.drawCard(characterData);
        //cardImage.setSwallowTouches(false);
        cardImage.setPosition(this.CHARACTER_TABLE_CELL_SIZE.width/2, this.CHARACTER_TABLE_CELL_SIZE.height/2);
        //cardImage.addClickEventListener(this.onCardClick.bind(this, idx*this.MAX_ELEMENT_IN_CELL+i));
        cardImage.setTouchEnabled(false);
        cardImage.setScale(this.CARD_SCALE);
        cell.addChild(cardImage);

        // if it's the main character
        if (characterData.uid == UserData.getInstance().mainCharUid){
            var tick = fr.createSprite("lobby/game_info/card_main_char_picked.png");
            tick.setScale(2.5);
            tick.setPosition(cardImage.getContentSize().width-tick.getContentSize().width-20,tick.getContentSize().height+20);
            cardImage.addChild(tick);
        }

        return cell;
    },

    //onCardClick: function(index){
    //    this.selectedCardIndex = index;
    //},

    tableCellTouched:function (table, cell) {
        var characterIndex = cell.getIdx();
        this.currentSelectChar = this.characterList[characterIndex];
        this.loadCurrentSelectCharacter(this.currentSelectChar);
    },

    loadCurrentSelectCharacter: function(characterData){
        if (!this.currentSelectCard){
            this.currentSelectCard = GraphicSupporter.drawCard(characterData);
            this.currentSelectCard.setPosition(110, 315);
            this.currentSelectCard.setScale(0.65);
            this.myCharSlot.addChild(this.currentSelectCard);

            this.curSelectedCharSkillTable = new CharacterSkillTable(characterData, 1);

            this.curSelectedCharSkillTable.setPosition(370, 320 );
            this.myCharSlot.addChild( this.curSelectedCharSkillTable);
        }
        else{
            GraphicSupporter.changeCard(this.currentSelectCard, characterData);
            this.curSelectedCharSkillTable.reloadData(characterData);
        }
        cc.log("x1 = " + this.currentSelectCard.uid + ", x2 = " + UserData.getInstance().mainCharUid);
        this.pickCharacterBtn.setTouchEnabled(characterData.uid!=UserData.getInstance().mainCharUid);
        this.pickCharacterBtn.setVisible(characterData.uid!=UserData.getInstance().mainCharUid);
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.CHARACTER_TABLE_CELL_SIZE;
    },

    numberOfCellsInTableView:function (table) {
        return Math.ceil(this.characterList.length);
    },

    onSortCharacterBtnClick: function(){
        this.ascendSort = !this.ascendSort;
        this.loadTableView();
    },

    onPickCharacterBtnClick: function(){
        GuiUtil.showWaitingGui();
        gv.gameClient.sendPickMainCharacter(this.currentSelectChar.uid);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.PICK_MAIN_CHARACTER_RESULT, this.onPickResult.bind(this));
    },

    onPickResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.PICK_MAIN_CHARACTER_RESULT);
        UserData.getInstance().mainCharUid = this.currentSelectChar.uid;

        this.loadTableView();
        this.loadMainCharacter();

        var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
        if (guiLobby){
            guiLobby.loadMainCharacter();
        }
    },

    loadMainCharacter: function(){
        var mainCharData = UserDataUtil.getMainCharData();

        //fr.changeSprite(this.mainCharImage, mainCharData.id+"_model.png");
        fr.changeSprite(this.mainCharImage, mainCharData.id+"_card.png");
        this.mainCharName.setString(fr.Localization.text("character_name_" + mainCharData.id));
        fr.changeSprite(this.mainCharNameSlot, "name_slot_" + GameUtil.getClassNameById(mainCharData.clazz) + ".png");

        fr.changeSprite(this.mainCharNameSlot.getChildByName("class"), "word_" + GameUtil.getClassNameById(mainCharData.clazz)+ ".png");

        var starSlot = this.mainCharSlot.getChildByName("star_slot");
        var starNumber = mainCharData.getStarFromLevel(mainCharData.level);
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
            var star =  starSlot.getChildByTag(j);
            fr.changeSprite(star,j<starNumber?"card_star_enable.png":"card_star_disable.png");
        }
        this.skillTable.reloadData(mainCharData);
    },

    loadTableView: function(){
        this.characterList = UserDataUtil.getCharListSortedByClazzWithMainCharPriority(this.ascendSort);
        this.charNumberOnSumLb.setString(this.characterList.length + "/200");
        this.table.reloadData();
    },

    onCharacterSlotTouch : function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (MathUtil.getDistance(sender.getTouchBeganPosition(), sender.getTouchEndPosition()) > 10) return;

                this.mainCharSlot.setTouchEnabled(false);
                this.mainCharSlot.runAction(cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        this.mainCharSlot.setTouchEnabled(true);
                    }.bind(this))
                ));

                this.characterDisplayState = !this.characterDisplayState;
                var characterImage = this.mainCharSlot.getChildByName("main_char_image");

                if (!this.characterDisplayState){
                    characterImage.runAction(cc.scaleTo(0.15,0,this.charImageOriginScale));
                    this.skillTable.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15,0.9,0.9)
                    ));
                }
                else{
                    this.skillTable.runAction(cc.scaleTo(0.15,0,0.9));
                    characterImage.runAction(cc.sequence(
                        cc.delayTime(0.15),
                        cc.scaleTo(0.15, this.charImageOriginScale,this.charImageOriginScale)
                    ));
                }
                break;
        }
    },

    onUpgradeBtnClick: function(){
        this.destroy();
        gv.guiMgr.addGui(new GuiUpgradeCharacter(), GuiId.UPGRADE_CHARACTER, LayerId.LAYER_GUI);
    },

    onBuyBtnClick: function(){
        //this.destroy();
        gv.guiMgr.addGui(new GuiGacha(), GuiId.GACHA, LayerId.LAYER_GUI);
    },

    onSellCharBtnClick: function(){
        gv.guiMgr.addGui(new GuiSellCharacter(), GuiId.SELL_CHARACTER, LayerId.LAYER_GUI);
    },
});