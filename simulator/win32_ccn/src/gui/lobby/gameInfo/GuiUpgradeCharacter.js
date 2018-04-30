/**
 * Created by user on 16/3/2016.
 */
var CARD_SCALE =  0.37;
var BORDER_CELL = 10;
var CHARACTER_TABLE_SIZE = cc.size(495, 175);
var CHARACTER_TABLE_CELL_SIZE = cc.size(293 * CARD_SCALE + BORDER_CELL, 374 * CARD_SCALE + BORDER_CELL);
var MATERIAL_CARD_SCALE = 0.37;
var MATERIAL_TABLE_SIZE =  cc.size(595, 175);
var MATERIAL_TABLE_CELL_SIZE = cc.size(293 * MATERIAL_CARD_SCALE + BORDER_CELL, 374 * MATERIAL_CARD_SCALE + BORDER_CELL);

var GuiUpgradeCharacter = BaseGui.extend({
    characterList: [],
    levelListConfig: [],
    upgradedCharacter: null,
    upgradeCost: null,
    dataReady: false,
    finishedUpgradeEff: true,
    ascend: false,

    ctor: function(){
        this._super(res.ZCSD_GUI_UPGRADE_CHARACTER);


        this.mainCardCtn = this._centerNode.getChildByName("mainCard");
        this.mainCardInfo = this._centerNode.getChildByName("mainCardInfo");
        this.mainCardInfo.setVisible(false);
        this.hintInfo = this._centerNode.getChildByName("hintInfo");

        this.characterList = UserDataUtil.getCharListSortedByClazzWithMainCharPriority(true);
        this.levelListConfig = CharacterConfig.getInstance().getLevelList();
        this.dataReady = false;
        this.upgradeCost = 0;
        this.finishedUpgradeEff = true;

        this.table = new cc.TableView(this, CHARACTER_TABLE_SIZE);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.table.setDelegate(this);
        this.table.reloadData();
        this.table.setPosition(100, 20);

        this.materialBg = this._centerNode.getChildByName("materialBg");
        this.materialBg.addChild(this.table);

        var btnSelectChar = this.materialBg.getChildByName("btn_select_char");
        btnSelectChar.addClickEventListener(this.onSelectBtnClick.bind(this));
        btnSelectChar.getChildByName("text_select").setString(fr.Localization.text("Change_character"));
        btnSelectChar.setPressedActionEnabled(false);

        var btnUpgradeChar = this.materialBg.getChildByName("btn_upgrade_character");
        btnUpgradeChar.getChildByName("text_upgrade").setString(fr.Localization.text("Upgrade"));
        btnUpgradeChar.setPressedActionEnabled(false);

        var btnBuy = this.materialBg.getChildByName("btn_buy");
        btnBuy.addClickEventListener(this.onBuyBtnClick.bind(this));
        btnBuy.getChildByName("text_buy").setString(fr.Localization.text("Buy"));
        btnBuy.setPressedActionEnabled(false);

        var btnSellCharacter = this.materialBg.getChildByName("btn_sell_char");
        btnSellCharacter.addClickEventListener(this.onSellCharBtnClick.bind(this));
        btnSellCharacter.getChildByName("text_sell").setString(fr.Localization.text("Sell"));
        btnSellCharacter.setPressedActionEnabled(false);

        this.materialBg.getChildByName("numberCharacterTxt").setString(this.characterList.length);

        this.upgradeBtn = this.materialBg.getChildByName("upgradeBtn");
        this.upgradeBtn.addClickEventListener(this.upgradeClick.bind(this));
        this.upgradeBtn.setTouchEnabled(false);
        this.upgradeBtn.setBright(false);

        this.mainCardInfo.getChildByName("expTotalTxt").setVisible(false);

        this.autoPickBtn = this.materialBg.getChildByName("autoPickBtn");
        this.autoPickBtn.addClickEventListener(this.autoPickClick.bind(this));

        this.sortBtn = this.materialBg.getChildByName("sortBtn");
        this.sortBtn.addClickEventListener(this.sortClick.bind(this));

        this.cancelMainCardBtn = this.mainCardInfo.getChildByName("cancelMainCardBtn");
        this.cancelMainCardBtn.addClickEventListener(this.onUpgradeCardClick.bind(this))

        this.materialTable = new MaterialTable(this);
        this.materialBg.addChild(this.materialTable);

        //Hieu ung xuat hien gui, tu 2 ben canh man hinh bay vao
        if (!gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER)) {
            var destination = this.mainCardCtn.getPosition();
            this.mainCardCtn.setPositionX(-this.mainCardCtn.getContentSize().width / 2 - cc.winSize.width / 2);
            this.mainCardCtn.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

            destination = this.hintInfo.getPosition();
            this.hintInfo.setPositionX(this.mainCardCtn.getPositionX());
            this.hintInfo.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

            destination = this.mainCardInfo.getPosition();
            this.mainCardInfo.setPositionX(this.mainCardCtn.getPositionX());
            this.mainCardInfo.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

            destination = this.materialBg.getPosition();
            this.materialBg.setPositionX(cc.winSize.width / 2 + this.materialBg.getContentSize().width / 2);
            this.materialBg.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));
        }
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        if(!cell){
            cell = new cc.TableViewCell();
        }
        cell.setIdx(idx);
        cell.removeAllChildren();
        var characterData = this.characterList[idx];
        var card = GraphicSupporter.drawCard(characterData);
        card.setPosition(CHARACTER_TABLE_CELL_SIZE.width/2,CHARACTER_TABLE_CELL_SIZE.height/2);
        card.setSwallowTouches(false);
        //card.addClickEventListener(this.onCardClick.bind(this, idx));
        card.setScale(CARD_SCALE);
        cell.addChild(card);

        // if it's the main character
        if (characterData.uid == UserData.getInstance().mainCharUid){
            var tick = fr.createSprite("card_main_char_tick.png");
            tick.setScale(2.3);
            tick.setPosition(card.getContentSize().width-tick.getContentSize().width,tick.getContentSize().height);
            card.addChild(tick);
        }

        return cell;
    },

    upgradeClick: function () {
        if(!this.finishedUpgradeEff){
            cc.log("Dang dien effect");
            return;
        }

        if(this.checkMaxLevel() == true){
            var notiText =  fr.Localization.text("level_limited");
            gv.guiMgr.addGui(new PopupNotification(notiText), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
            return;
        }

        if(UserData.getInstance().gold < this.materialTable.cost){
            cc.log("Het tien roi nhe");
            var notiText =  fr.Localization.text("nomore_money");
            gv.guiMgr.addGui(new PopupNotification(notiText), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        }
        else{
            var listCharUID = [];
            for(var i = 0; i < this.materialTable.materialList.length; i++){
                var material = this.materialTable.materialList[i];
                UserData.getInstance().removeCharacterByUID(material.uid);
                listCharUID.push(material.uid);
            }
            gv.gameClient.sendUpgradeCharacter(this.upgradedCharacter.uid, listCharUID);
            cc.log("upgrade card");
            this.upgradeCost = this.materialTable.cost;
            this.showEffectUpagrade();
        }
    },

    sortClick: function(){
        UserDataUtil.sortCharListByClazz(this.characterList, this.ascend);

        var userData = UserData.getInstance();
        var mainChar = userData.getCharacterInfoByUID(userData.mainCharUid);
        cc.log("aaaaaaaaaaaaaa: " + this.characterList.indexOf(mainChar) );
        if(this.characterList.indexOf(mainChar) >= 0){
            this.characterList.splice(this.characterList.indexOf(mainChar),1);
            this.characterList.splice(0, 0, mainChar);
        }

        this.table.reloadData();
        this.ascend = !this.ascend;
    },

    showEffectUpagrade: function(){
        if(this.materialTable.materialList.length <= 0) return;
        this.finishedUpgradeEff = false;
        this.upgradeBtn.setTouchEnabled(false);
        this.upgradeBtn.setBright(false);
         var maxEff = this.materialTable.materialList.length > 4 ? 4 : this.materialTable.materialList.length;

        for(var i = 0; i < maxEff; i++){
            var effStep1 = fr.AnimationMgr.createAnimationById("upgradestep1", this);
            effStep1.gotoAndPlay("run", 0.1 * i, -1, 1);
            effStep1.setCompleteListener(function(anim, animIndex){
                anim.removeFromParent();
                var effStep2 = fr.AnimationMgr.createAnimationById("upgradestep2_" + (animIndex + 1), this);
                effStep2.gotoAndPlay("run", 0, -1, 1);
                effStep2.setPosition(this.materialTable.table.getPositionX() + MATERIAL_TABLE_CELL_SIZE.width * (animIndex + 0.5), this.materialTable.table.getPositionY() + MATERIAL_TABLE_CELL_SIZE.height/2);
                effStep2.setCompleteListener(this.completeEffStep2.bind(this, effStep2, animIndex + 1));
                this.materialBg.addChild(effStep2);
            }.bind(this, effStep1, i));
            effStep1.setPosition(this.materialTable.table.getPositionX() + MATERIAL_TABLE_CELL_SIZE.width * (i + 0.5), this.materialTable.table.getPositionY() + MATERIAL_TABLE_CELL_SIZE.height/2);
            this.materialBg.addChild(effStep1);
        }

        this.materialTable.reset();
    },

    completeEffStep2: function(eff, effIndex){
        eff.removeFromParent();
        var maxEff = this.materialTable.materialList.length > 5 ? 5 : this.materialTable.materialList.length;
        if(effIndex >= maxEff)
        {
            var effFinal = fr.AnimationMgr.createAnimationById("upgradestep2_star_final", this);
            effFinal.gotoAndPlay("run", 0, -1, 1);
            effFinal.setPosition(this.mainCardCtn.getPositionX() - 105, this.mainCardCtn.getPositionY());
            this._centerNode.addChild(effFinal);

            //this._centerNode.getChildByName("hintTxt").setVisible(true);
            this.mainCardInfo.getChildByName("expTotalTxt").setVisible(false);
            this.finishedUpgradeEff = true;

            if(this.dataReady){
                this.mainCardCtn.removeAllChildren();
                this.drawUpgradedCard();
                UserData.getInstance().gold -= this.upgradeCost;
                cc.log("cost click: " + this.upgradeCost);
                this.upgradeCost = 0;
                gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).reloadInfo();
                this.dataReady = false;
                this.finishedUpgradeEff = false;
                var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
                if(guiLobby != null)
                    guiLobby.loadMainCharacter();
            }
        }
    },
    //Xy ly khi nhan goi tin tra ve tu sever
    updateResult: function (dataPacket){
        this.upgradedCharacter.clazz = dataPacket.charClass;
        this.upgradedCharacter.level = dataPacket.newLevel;
        this.upgradedCharacter.currExp = dataPacket.newExp;
        this.dataReady = true;

        if(this.finishedUpgradeEff){
            this.mainCardCtn.removeAllChildren();
            this.drawUpgradedCard();
            UserData.getInstance().gold -= this.upgradeCost;
            cc.log("cost receive data: " + this.upgradeCost);
            this.upgradeCost = 0;
            gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).reloadInfo();
            this.dataReady = false;
            this.finishedUpgradeEff = false;
            var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
            if(guiLobby != null)
                guiLobby.loadMainCharacter();
        }
    },

    autoPickClick: function () {
        if(!this.finishedUpgradeEff){
            cc.log("Dang dien effect");
            return;
        }

        cc.log("auto pick");
        var gui = gv.guiMgr.getGuiById(GuiId.AUTO_PICK_CHARACTER);
        if(gui == null){
            gv.guiMgr.addGui(new GuiAutoPick(), GuiId.AUTO_PICK_CHARACTER, LayerId.LAYER_GUI);
            cc.log("show auto pick");
        }
    },

    //xu ly su kien khi click vao card de chon
    tableCellTouched:function (table, cell) {
        if(!this.finishedUpgradeEff){
            cc.log("Dang dien effect");
            return;
        }

        if(this.upgradedCharacter == null){//Chua chon nhan vat de nang cap
            this.upgradedCharacter = this.characterList.splice(cell.getIdx(), 1)[0];
            this.updateDisplay();
            this.drawUpgradedCard();
        }
        else{//Da chon nhan vat de nang cap, chuyen thanh chon nguyen lieu
            if(this.characterList[cell.getIdx()].uid == UserData.getInstance().mainCharUid)
            {
                var notiText =  fr.Localization.text("wrong_selection");
                gv.guiMgr.addGui(new PopupNotification(notiText), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
                return;
            }
            var material = this.characterList.splice(cell.getIdx(), 1)[0];
            this.table.reloadData();
            this.materialTable.materialList.push(material);
            this.materialTable.table.reloadData();
            this.materialTable.updateAddMaterial(material);

            this.updateDisplay();
        }
    },

    //Tu dong chon tat ca cac card loai clazz
    autoPick: function(clazz){
        if(this.upgradedCharacter == null){//Chua chon nhan vat de nang cap
            var notiText =  fr.Localization.text("not_select_yet");
            gv.guiMgr.addGui(new PopupNotification(notiText), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
            //return;
        }
        else{
            for(var i = 0; i < this.characterList.length; i++){
                var character = this.characterList[i];
                if(character.clazz == clazz && character.uid !=  UserData.getInstance().mainCharUid){
                    var material = this.characterList.splice(i, 1)[0];
                    i--;
                    this.materialTable.materialList.push(material);
                    this.materialTable.updateAddMaterial(material);
                }
            }
            if(this.materialTable.materialList.length > 0){
                this.materialTable.table.reloadData();
                this.table.reloadData();
                cc.log("Reload autopick");
                this.updateDisplay();
            }
        }
    },

    //Ve nhan vat duoc nang cap
    drawUpgradedCard: function(){

        this.mainCardInfo.setVisible(true);

        //Hinh nhan vat
        var characterImage = fr.createSprite(this.upgradedCharacter.id+ "_card.png");
        characterImage.setPosition(this.mainCardCtn.getBoundingBox().width/2, 200);
        characterImage.setAnchorPoint(0.5, 0);
        //characterImage.addClickEventListener(this.onUpgradeCardClick.bind(this));
        characterImage.setScale(0.7);
        this.mainCardCtn.addChild(characterImage, 1);

        //var card = GraphicSupporter.drawCard(this.upgradedCharacter);
        //card.setPosition(this.mainCardCtn.getBoundingBox().width/2, this.mainCardCtn.getBoundingBox().height*3/4);
        //card.addClickEventListener(this.onUpgradeCardClick.bind(this));
        //card.setScale(0.7);

        //Khung chua sao va class
        var starCtn = fr.createSprite("name_slot_" + GameUtil.getClassNameById(this.upgradedCharacter.clazz) + ".png");
        starCtn.setPosition(this.mainCardCtn.getContentSize().width/2, this.mainCardCtn.getContentSize().height-20);
        this.mainCardCtn.addChild(starCtn);

        var starNumber = this.upgradedCharacter.getStarFromLevel(this.upgradedCharacter.level);
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
            var star = fr.createSprite(j<starNumber?"card_star_enable.png":"card_star_disable.png");
            star.setScale(0.8);
            star.setPosition(100 + (star.getBoundingBox().width) * j, this.mainCardCtn.getBoundingBox().height-18);
            this.mainCardCtn.addChild(star);
        }

        var classType = fr.createSprite("word_" + GameUtil.getClassNameById(this.upgradedCharacter.clazz)+ ".png");
        classType.setPosition(52, this.mainCardCtn.getBoundingBox().height - 18);
        this.mainCardCtn.addChild(classType);

        this.table.reloadData();

        var title = this.mainCardInfo.getChildByName("starNumberTxt");
        title.setString(this.upgradedCharacter.getStarFromLevel(this.upgradedCharacter.level) + "/5");

        /*var skillTable = new SkillTable(this);
        skillTable.setPosition(175, 40);
        this.mainCardCtn.addChild(skillTable);*/

        this.skillTable = new CharacterSkillTable(this.upgradedCharacter, 1);
        this.skillTable.setScale(0.8);
        this.skillTable.setPosition(this.mainCardCtn.getBoundingBox().width/2, 82);
        this.mainCardCtn.addChild( this.skillTable);

        this.expBar = this.mainCardInfo.getChildByName("expBar");
        var levelInfo = CharacterConfig.getInstance().getLevelInfoByLevel(this.upgradedCharacter.level);
        var percent = (this.upgradedCharacter.currExp/levelInfo.requireExp) * 100;
        this.expBar.setPercent(percent);
    },

    //Xu ly su kien khi click vao card duoc nang cap
    onUpgradeCardClick: function (){
        this.mainCardCtn.removeAllChildren();
        this.mainCardInfo.setVisible(false);
        this.characterList.push(this.upgradedCharacter);
        this.table.reloadData();
        this.upgradedCharacter = null;
        this.updateDisplay();
    },

    //Size cua cell trong table
    tableCellSizeForIndex:function (table, idx) {
        return CHARACTER_TABLE_CELL_SIZE;
    },

    //So cell cua table
    numberOfCellsInTableView:function (table) {
        return this.characterList.length;
    },

    updateDisplay :function(){

        if(this.upgradedCharacter != null){
            this._centerNode.getChildByName("hintInfo").setVisible(false);
        }
        else{
            this._centerNode.getChildByName("hintInfo").setVisible(true);
        }

        if(this.materialTable.materialList.length > 0 && this.upgradedCharacter != null)
        {
            //this.mainCardCtn.getChildByName("title_select_character").setVisible(false);
            //this.mainCardCtn.getChildByName("hiddenCharacter").setVisible(false);
            this.upgradeBtn.setTouchEnabled(true);
            this.upgradeBtn.setBright(true);
            this.mainCardInfo.getChildByName("expTotalTxt").setVisible(true);
            //this._centerNode.getChildByName("futureLevelTxt").setVisible(true);
        }
        else{
            //this.mainCardCtn.getChildByName("title_select_character").setVisible(true);
            //this.mainCardCtn.getChildByName("hiddenCharacter").setVisible(true);
            this.upgradeBtn.setTouchEnabled(false);
            this.upgradeBtn.setBright(false);
            this.mainCardInfo.getChildByName("expTotalTxt").setVisible(false);
            //this._centerNode.getChildByName("futureLevelTxt").setVisible(false);
        }
        this.upgradeBtn.getChildByName("upgradeCostTxt").setString(StringUtil.toMoneyString(this.materialTable.cost));
        this.mainCardInfo.getChildByName("expTotalTxt").setString(StringUtil.normalizeNumber(this.materialTable.totalExp));

        this.materialBg.getChildByName("numberCharacterTxt").setString(this.characterList.length);
        this.showFutureCard();
    },

    showFutureCard:function(){
        if(this.upgradedCharacter == null) return;
        var levelInfo = CharacterConfig.getInstance().getLevelInfoByLevel(this.upgradedCharacter.level);
        var expAccumulate = levelInfo.accumulateExp - levelInfo.requireExp;
        var exp = expAccumulate + this.upgradedCharacter.currExp + this.materialTable.totalExp;
        var level = CharacterConfig.getInstance().getMaxLevel();
        for(var i = 0; i < this.levelListConfig.length; i++)
        {
            cc.log(exp + ", " + this.levelListConfig[i].accumulateExp);
            if(exp < this.levelListConfig[i].accumulateExp){
                level = i+1;
                levelInfo = this.levelListConfig[i];
                break;
            }
        }
       /* if(levelInfo == null) return;
        var str = levelInfo.charClass.split("_")[0];
        var star = level%CCNConst.MAX_STAR_NUMBER;
        if (star==0) star = CCNConst.MAX_STAR_NUMBER;
        this._centerNode.getChildByName("futureLevelTxt").getChildByName("levelAfter").setString(str + "-" +star);
        cc.log("next level: " + str + "-" +star);
        levelInfo = null;*/
    },

    totalUpgradeCost: function(){
        var cost = 0;
        for(var i = 0; i < this.materialTable.materialList.length; i++){

            var material = this.materialTable.materialList[i];
            var levelInfo = CharacterConfig.getInstance().getLevelInfoByLevel(material.level);
            cost += levelInfo.requireGold;
        }
        return cost;
    },

    checkMaxLevel: function(){
        var levelInfo = CharacterConfig.getInstance().getLevelInfoByLevel(this.upgradedCharacter.level);
        var maxLevel = CharacterConfig.getInstance().getMaxLevel();
        return this.upgradedCharacter.level == maxLevel && this.upgradedCharacter.currExp >= levelInfo.requireExp;
        //if(this.upgradedCharacter.level == maxLevel && this.upgradedCharacter.currExp >= levelInfo.requireExp){
        //    return true;
        //}
        //return false;
    },

    updateStore: function () {
        this.characterList =  UserDataUtil.getCharListSortedByClazzWithMainCharPriority(true);
        this.table.reloadData();

        this._centerNode.getChildByName("materialBg").getChildByName("numberCharacterTxt").setString(this.characterList.length);
    },

    onSelectBtnClick: function(){
        this.destroy();
        gv.guiMgr.addGui(new GuiSelectCharacter(), GuiId.SELECT_CHARACTER, LayerId.LAYER_GUI);
    },

    onBuyBtnClick: function(){
        //this.destroy();
        gv.guiMgr.addGui(new GuiGacha(), GuiId.GACHA, LayerId.LAYER_GUI);
    },

    onSellCharBtnClick: function(){
        gv.guiMgr.addGui(new GuiSellCharacter(), GuiId.SELL_CHARACTER, LayerId.LAYER_GUI);
    },
});


//******************************************************************/



//Table nguyen lieu de nang cap
var MaterialTable = cc.Node.extend({
    guiParent: null,
    materialList: [],
    cost: null,
    totalExp: null,


    ctor: function(guiParent){
        this._super();
        this.guiParent = guiParent;
        this.cost = 0;
        this.totalExp = 0;
        this.materialList = [];
        //this.showingEffIndex = 0;

        this.table = new cc.TableView(this, MATERIAL_TABLE_SIZE);
        this.table.setPosition(15,245);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.table.setDelegate(this);
        this.addChild(this.table);
        this.table.reloadData();
    },

    reset:function(){
        this.materialList = [];
        this.cost = 0;
        this.totalExp = 0;
        this.table.reloadData();
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        if(!cell){
            cell = new cc.TableViewCell();
        }
        cell.setIdx(idx);
        var materialData = this.materialList[idx];

        //Khung cua card tuong ung voi cac class A, B, C, D
        var card = GraphicSupporter.drawCard(materialData);
        card.setPosition(MATERIAL_TABLE_CELL_SIZE.width/2, MATERIAL_TABLE_CELL_SIZE.height/2);
        card.setSwallowTouches(false);
        //card.addClickEventListener(this.onCardClick.bind(this, idx));
        card.setScale(MATERIAL_CARD_SCALE);
        cell.addChild(card);
        return cell;
    },

    //xu ly su kien khi click vao cell
    tableCellTouched:function (table, cell) {
        var material = this.materialList.splice(cell.getIdx(), 1)[0];
        this.table.reloadData();
        var levelInfo = CharacterConfig.getInstance().getLevelInfoByLevel(material.level);
        this.cost -= levelInfo.requireGold;
        this.totalExp -= levelInfo.evolveExp;
        cc.log("sub cost: " + this.cost);

        this.guiParent.characterList.push(material);
        this.guiParent.table.reloadData();
        this.guiParent.updateDisplay();
    },

    tableCellSizeForIndex:function (table, idx) {
        return MATERIAL_TABLE_CELL_SIZE;
    },


    numberOfCellsInTableView:function (table) {
        return this.materialList.length;
    },

    updateAddMaterial: function (materialObj){
        var levelInfo = CharacterConfig.getInstance().getLevelInfoByLevel(materialObj.level);
        this.cost += levelInfo.requireGold;
        this.totalExp += levelInfo.evolveExp
        cc.log("add cost: " + this.cost);
    },

});




//******************************************************************/




var SKILL_TABLE_CELL_SIZE = cc.size(195, 63);
//Table danh sach ky nang
var SkillTable = cc.Node.extend({
    guiParent: null,

    ctor: function(guiParent){
        this._super();
        this.guiParent = guiParent;

        this.table = new cc.TableView(this, cc.size(200, 190));
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.setDelegate(this);
        this.addChild(this.table);
        this.table.reloadData();
    },

    tableCellAtIndex:function (table, idx) {
        var cell = new cc.TableViewCell();

        var skillId = this.guiParent.upgradedCharacter.skillList[idx];
        cc.log("leng skill: " + this.guiParent.upgradedCharacter.skillList.length);

        //Dong ke ngan cach cac skill
        var line =  fr.createSprite("res/lobby/upgradeCharacter/line.png");
        line.setPosition(line.getContentSize().width/2, 0);
        cell.addChild(line);

        //skill Icon
        var skillImg = fr.createSprite("res/lobby/upgradeCharacter/skill" + skillId + ".png");
        skillImg.setPosition(skillImg.getContentSize().width/2, skillImg.getContentSize().height/2 + 3);
        cell.addChild(skillImg);

        //Ten skill
        var skillDescription = ccui.Text(fr.Localization.text("skill_name_" + skillId) + ": ", res.FONT_UNICODE_VREVUE_TFF, 16);
        skillDescription.setPosition(skillDescription.getContentSize().width/2 + skillImg.getContentSize().width + 2, 35);
        cell.addChild(skillDescription);

        //Thong so skill
       var skillInfo = CharacterConfig.getInstance().getSkillInfoById(skillId);
        var clazz = GameUtil.getClassNameById(this.guiParent.upgradedCharacter.clazz) + "_CLASS";
        /*var range = skillInfo["range"][clazz];
        var chance = skillInfo["chance"][this.guiParent.upgradedCharacter.clazz]
        var skillRange= ccui.Text(range + " ô, tỉ lệ " + chance + "%", res.FONT_UNICODE_VREVUE_TFF, 16);
        skillRange.setPosition(skillRange.getContentSize().width/2 + skillImg.getContentSize().width + 2, 15);
        cell.addChild(skillRange);*/
        return cell;
    },



    tableCellSizeForIndex:function (table, idx) {
        return SKILL_TABLE_CELL_SIZE;
    },


    numberOfCellsInTableView:function (table) {
        return this.guiParent.upgradedCharacter.skillList.length;
    },

});