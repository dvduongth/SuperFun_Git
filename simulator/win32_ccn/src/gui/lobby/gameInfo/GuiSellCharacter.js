/**
 * Created by user on 16/3/2016.
 */

var GuiSellCharacter = BaseGui.extend({

    CARD_SCALE: 0.46,

    MAX_ELEMENT_IN_CELL: 4,
    CHARACTER_TABLE_SIZE: cc.size(293*0.46*6.1, 374*0.46),
    CHARACTER_TABLE_CELL_SIZE: cc.size(293*0.46, 374*0.46),

    MAX_SELECTED_SLOT: 10,

    playerInfo: null,
    ascendSort: true,

    selectedSlot: [],

    characterList: [],
    selectedCharList: [],

    ctor: function(){
        this._super(res.ZCSD_GUI_SELL_CHARACTER);

        this.ascendSort = true;
        this.characterList = UserDataUtil.getCharListSortedByClazzWithMainCharPriority(this.ascendSort);
        //remove main char
        this.characterList.splice(0, 1);

        var backBtn = this._rootNode.getChildByName("btn_back");
        backBtn.addClickEventListener(function(){
            var guiSelectChar = gv.guiMgr.getGuiById(GuiId.SELECT_CHARACTER);
            if (guiSelectChar)
                guiSelectChar.loadTableView();

            var guiUpgradeChar = gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER);
            if (guiUpgradeChar)
                guiUpgradeChar.updateStore();
            this.destroy();
        }.bind(this));

        this.selectedCharMainSlot = this._centerNode.getChildByName("selected_char_slot");
        this.myCharSlot = this._centerNode.getChildByName("my_char_slot");

        if (!gv.guiMgr.getGuiById(GuiId.SELECT_CHARACTER)){
            var destination = this.selectedCharMainSlot.getPosition();
            this.selectedCharMainSlot.setPositionX(- this.selectedCharMainSlot.getContentSize().width/2);
            this.selectedCharMainSlot.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

            destination = this.myCharSlot.getPosition();
            this.myCharSlot.setPositionX(cc.winSize.width+this.myCharSlot.getContentSize().width/2);
            this.myCharSlot.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));
        }

        //selected character region
        this.selectedCharList = [];
        this.selectedSlot = [];
        for (var i=0; i<this.MAX_SELECTED_SLOT; i++){
            var curSelectedSlot = this.selectedCharMainSlot.getChildByName("selected_char_"+i);
            this.selectedSlot.push(curSelectedSlot);
            this.selectedSlot[this.selectedSlot.length-1].addClickEventListener(this.onSelectedCardBtnClick.bind(this, this.selectedSlot.length-1));
        }

        this.sellBtn = this._centerNode.getChildByName("btn_sell");
        this.sellBtn.addClickEventListener(this.onSellBtnClick.bind(this));
        this.sellBtn.setVisible(false);


        this.priceLabel = this.sellBtn.getChildByName("price");
        this.priceLabel.setString("0");

        //my character region
        this.charNumberOnSumLb = this.myCharSlot.getChildByName("char_number_on_sum");

        this.sortCharacterBtn = this.myCharSlot.getChildByName("sort_char_btn");
        this.sortCharacterBtn.setLocalZOrder(1);
        this.sortCharacterBtn.addClickEventListener(this.onSortCharacterBtnClick.bind(this));

        this.table = new cc.TableView(this, this.CHARACTER_TABLE_SIZE);
        this.table.setPosition(80, 12);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.table.setDelegate(this);
        this.myCharSlot.addChild(this.table);

        this.noCharacterText = new ccui.Text(fr.Localization.text("no_character_sell"), res.FONT_GAME_BOLD, 20);
        this.noCharacterText.setPosition(this.myCharSlot.getContentSize().width/2, this.myCharSlot.getContentSize().height/2);
        this.myCharSlot.addChild(this.noCharacterText);

        this.reloadTableView();
    },

    tableCellAtIndex:function (table, idx) {
        var cell = new cc.TableViewCell();

        var characterData = this.characterList[idx];

        var cardImage = GraphicSupporter.drawCard(characterData);
        cardImage.setSwallowTouches(false);
        cardImage.setPosition(this.CHARACTER_TABLE_CELL_SIZE.width/2, this.CHARACTER_TABLE_CELL_SIZE.height/2);
        //cardImage.addClickEventListener(this.onCardClick.bind(this, idx*this.MAX_ELEMENT_IN_CELL+i));
        cardImage.setTouchEnabled(false);
        cardImage.setScale(0.42);
        cell.addChild(cardImage);

        return cell;
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.CHARACTER_TABLE_CELL_SIZE;
    },

    numberOfCellsInTableView:function (table) {
        return this.characterList.length;
    },

    tableCellTouched:function (table, cell) {
        var characterData = this.characterList[cell.getIdx()];
        if (this.selectedCharList.length<this.MAX_SELECTED_SLOT){
            this.characterList.splice(cell.getIdx(),1);
            this.reloadTableView();

            this.selectedCharList.push(characterData);
            this.reloadSelectedCharacterSlot();
        }
        else{
            //thong bao da het slot
        }
    },

    onSelectedCardBtnClick: function(index){
        if (index<this.selectedCharList.length){

            var charData = this.selectedCharList[index];
            this.selectedCharList.splice(index,1);
            this.reloadSelectedCharacterSlot();

            this.characterList.push(charData);
            this.reloadTableView();
        }
    },

    reloadTableView: function(){

        //var tmp = this.table.getContentOffset();
        //tmp.y = -(this.numberOfCellsInTableView() - (this.numberOfCellsInTableView()-2)) * this.tableCellSizeForIndex().height + tmp.y;
        if (this.characterList.length==0){
            this.noCharacterText.setVisible(true);
            this.table.setVisible(false);
        }
        else{
            this.noCharacterText.setVisible(false);
            this.table.setVisible(true);
            this.table.reloadData();
        }
        //if ( this.characterList.length> this.MAX_ELEMENT_IN_CELL)
        //    this.table.setContentOffset(tmp);
        this.charNumberOnSumLb.setString(this.characterList.length + "/200");
    },

    reloadSelectedCharacterSlot: function(){
        for (var i=0; i<this.selectedCharList.length; i++){
            var charSlot = this.selectedSlot[i];
            var charData = this.selectedCharList[i];
            var card, characterImage, characterName;
            card = charSlot.getChildByTag(999);
            if (card == null){
                var card = GraphicSupporter.drawCard(charData);
                card.setPosition(charSlot.getContentSize().width/2, charSlot.getContentSize().height/2);
                card.setTouchEnabled(false);
                card.setTag(999);
                card.setScale(0.34);
                charSlot.addChild(card);
            }
            card.setVisible(true);
            card.loadTextureNormal("card_" + GameUtil.getClassNameById(charData.clazz) + ".png", ccui.Widget.PLIST_TEXTURE);

            characterImage = card.getChildByTag(111);
            fr.changeSprite(characterImage, charData.id+"_card.png");

            characterName = card.getChildByTag(222);
            characterName.setString(fr.Localization.text("character_name_" + charData.id));

            var starSlot = card.getChildByTag(333);
            var starNumber = charData.getStarFromLevel(charData.level);
            for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++){
                var star = starSlot.getChildByTag(j);
                star.setVisible(j+1<=starNumber);
            }
        }

        for (var i=this.selectedCharList.length; i<this.selectedSlot.length; i++){
            var charSlot = this.selectedSlot[i];
            var card;
            card = charSlot.getChildByTag(999);
            if (card != null){
                card.setVisible(false);
            }
        }

        if (this.selectedCharList.length > 0){
            this.sellBtn.setVisible(true);
            //calculate price
            var price = 0;
            for (var i=0; i<this.selectedCharList.length; i++){
                var charData = this.selectedCharList[i];
                price+=CharacterConfig.getInstance().getLevelInfoByLevel(charData.level).sellGold;
            }
            this.priceLabel.setString(StringUtil.normalizeNumber(price));
        }
        else{
            this.sellBtn.setVisible(false);

        }
    },

    onSortCharacterBtnClick: function(){
        this.ascendSort = !this.ascendSort;

        //sort with mainChar priority
        if (this.ascendSort)
            this.characterList.sort(function(a, b){return ((b.clazz > a.clazz))});
        else
            this.characterList.sort(function(a, b){return ((b.clazz < a.clazz))});
        this.table.reloadData();
    },

    onGuiSelectCharBtnClick: function(){
        gv.guiMgr.addGui(new GuiSelectCharacter(), GuiId.SELECT_CHARACTER, LayerId.LAYER_GUI);
        this.destroy();
    },

    onSellBtnClick: function(){

        if (this.selectedCharList.length==0) return;

        GuiUtil.showWaitingGui();
        var listCharUId = [];
        for (var i=0; i<this.selectedCharList.length; i++)
            listCharUId.push(this.selectedCharList[i].uid);
        gv.gameClient.sendSellCharacter(listCharUId);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.SELL_CHARACTER_RESULT, this.onSellResult.bind(this));
    },

    onSellResult: function(){

        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.SELL_CHARACTER_RESULT);

        for (var i=0; i<this.selectedCharList.length; i++){
            var uid = this.selectedCharList[i].uid;
            UserData.getInstance().removeCharacterByUID(uid);
        }

        this.selectedCharList = [];
        this.reloadSelectedCharacterSlot();

        gv.guiMgr.addGui(new PopupNotification(fr.Localization.text("sell_character_success")), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
    },

});