/**
 * Created by user on 28/1/2016.
 */
//var MAX_DICE_IN_ROW = 3;

var DiceID = {
    DICE_1 : "1",
    DICE_2 : "2",
    DICE_3 : "3",
    DICE_4 : "4",
    DICE_5 : "5",
    DICE_6 : "6",
    DICE_7 : "7",
}

var SELECTED_FRAME_TAG =  100;

var GuiDiceShop = BaseGui.extend({

    TABLE_SIZE: cc.size(235*4, 500),
    TABLE_CELL_SIZE: cc.size(235, 500),
    availableDiceList: null,
    selectedId: 0,
    selectedIndex: 0,

    ctor: function(){
        this._super(res.ZCSD_GUI_DICE_SHOP);

        cc.log("init GUI DICE SHOP begin");

        this.selectedIndex = -1;
        //Danh sach xuc xac trong config, duoc phep ban trong shop
        this.availableDiceList = [];
        var diceListConfig = DiceConfig.getInstance().getListDice();
        for(var str in diceListConfig){
            var dice = diceListConfig[str];
            var id = str.split("_")[1];
            dice.id = id;
            if(dice.isAvailable != 0){
                this.availableDiceList.push(dice);
            }
        }

        //this.mainDiceName = this._centerNode.getChildByName("main_dice_name");
        //this.useBtn = this._centerNode.getChildByName("btn_use");
        //this.unlockBtn = this._centerNode.getChildByName("btn_unlock");
        //this.conditionTxt = this._centerNode.getChildByName("conditionText");
        //this.usingTxt = this._centerNode.getChildByName("usingTxt");
        //this.rateTxt = this._centerNode.getChildByName("rateTxt");
        //this.locked = this._centerNode.getChildByName("locked");
        //
        //this.unlockBtn.addClickEventListener(this.unlockBtnClick.bind(this));
        //this.useBtn.addClickEventListener(this.useBtnClick.bind(this));
        //
        //this.mainCharSlot = this._centerNode.getChildByName("main_char_slot");
        //this.mainCharSlot.addTouchEventListener(this.onCharacterSlotTouch,  this);
        //
        ////Main character region
        //this.mainCharInfoSlot = this.mainCharSlot.getChildByName("main_char_info_slot");
        //this.mainCharName = this.mainCharSlot.getChildByName("main_char_name");
        //this.mainCharImage = this.mainCharSlot.getChildByName("main_char_image");
        //this.bubble = this.mainCharSlot.getChildByName("bubble");
        //this.charImageOriginScale = this.mainCharImage.getScale();
        //
        //for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++){
        //    var star = fr.createSprite("card_star_disable.png");
        //    star.setPosition(110 + (star.getContentSize().width+7) * j, this.mainCharSlot.getContentSize().height-50);
        //    star.setTag(j);
        //    this.mainCharSlot.addChild(star);
        //}
        //
        //this.skillTable = new CharacterSkillTable(UserDataUtil.getMainCharData(), 0);
        //this.skillTable.setPosition(this.mainCharSlot.getContentSize().width/2, this.mainCharSlot.getContentSize().height/2-50);
        //this.skillTable.setScaleX(0);
        //this.mainCharSlot.addChild( this.skillTable);

        this.table = new cc.TableView(this, this.TABLE_SIZE);
        this.table.setPosition(-this.TABLE_SIZE.width/2, -this.TABLE_SIZE.height/2 - 40);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.table.setDelegate(this);
        this._centerNode.addChild(this.table);
        this.table.reloadData();

        //this.loadMainCharacter();
        //this.initMainDice(UserData.getInstance().mainDice);


        cc.log("init GUI DICE SHOP end");
    },

    //Get dice object theo ID
    getDice: function(diceId){
        cc.log("diceId = " + diceId);
        for (var i = 0 ; i < this.availableDiceList.length; i++){
            if(this.availableDiceList[i].id == diceId){
                return this.availableDiceList[i];
            }
        }
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        var index = idx;
        if(!cell)
        {
            cell = new cc.TableViewCell();
        }
        cell.removeAllChildren();
        var background = fr.createSprite("lobby/diceShop/bgItem.png");
        background.setPosition(this.TABLE_CELL_SIZE.width /2,this.TABLE_CELL_SIZE.height/2);
        cell.addChild(background);

        //Tên xúc xắc
        var diceName =  new ccui.Text(fr.Localization.text("dice_name_" + this.availableDiceList[index].id), res.FONT_GAME_BOLD, 20);
        diceName.setTextColor(cc.color(245, 255, 216));
        diceName.setPosition(background.getContentSize().width/2, background.getContentSize().height - 25);
        background.addChild(diceName);

        //Hình ảnh xúc xắc
        var diceImg = fr.createSprite("lobby/diceShop/dice" + this.availableDiceList[index].id +".png");
        diceImg.setPosition(background.getContentSize().width/2, 320);
        diceImg.setScale(0.7);
        background.addChild(diceImg);

        //Fx xúc xắc
        var diceEff = fr.AnimationMgr.createAnimationById(resAniId.eff_dice_background, this);
        diceEff.getAnimation().gotoAndPlay("run", 0, -1, 0);
        diceEff.setScale(1.5);
        diceEff.setPosition(diceImg.getContentSize().width/2, diceImg.getContentSize().height/2);
        diceImg.addChild(diceEff,-1);

        //Xúc xắc bay bay
        var dice_moveBy = cc.moveBy(2, 0, 15).easing(cc.easeInOut(2));
        var dice_act = cc.sequence(cc.delayTime(Math.random()*1), dice_moveBy, dice_moveBy.reverse()).repeatForever();
        diceImg.runAction(dice_act);

        //ti le skill
        var descriptionRate = new ccui.Text(fr.Localization.text("dice_description_" + this.availableDiceList[index].id), res.FONT_GAME_BOLD, 18);
        descriptionRate.setTextColor(cc.color(245, 255, 216));
        descriptionRate.setPosition(background.getContentSize().width/2, 170);
        var rateTxt = new ccui.Text( "+" + (this.getDice(this.availableDiceList[index].id).incDiceControl * 100) + "%", res.FONT_GAME_BOLD, 48);
        rateTxt.setPosition(background.getContentSize().width/2, 130);
        background.addChild(descriptionRate);
        background.addChild(rateTxt);

        //Trạng thái: đang dùng, khóa, bị khóa
        if(this.availableDiceList[index].id == UserData.getInstance().mainDice){//Đang sử dụng
            var status = fr.createSprite("lobby/diceShop/using.png");
            status.setPosition(background.getContentSize().width/2, 50);
            background.addChild(status);

            rateTxt.setTextColor(cc.color.GREEN);

            var statusTxt =  new ccui.Text(fr.Localization.text("gui_dice_shop_using_btn_lb"), res.FONT_GAME_BOLD, 18);
            statusTxt.setTextColor(cc.color(255, 247, 127));
            statusTxt.setPosition(status.getContentSize().width/2 - 20, status.getContentSize().height/2 + 5);
            status.addChild(statusTxt);

            var tickSign = fr.createSprite("lobby/diceShop/tick.png");
            tickSign.setPosition(background.getContentSize().width - 40, status.getContentSize().height/2);
            status.addChild(tickSign);

            if(this.selectedIndex == -1){
                this.selectedIndex = idx;
            }
        }
        else{
            rateTxt.setTextColor(cc.color(0, 255, 240));
            if(UserData.getInstance().diceList.indexOf(this.availableDiceList[index].id) < 0) {//Chưa mở khóa
                var unlockBtn = new ccui.Button();
                unlockBtn.loadTextureNormal("res/lobby/diceShop/bt_mo_khoa.png");
                unlockBtn.setPosition(background.getContentSize().width/2, 50);
                unlockBtn.addClickEventListener(this.unlockBtnClick.bind(this,  this.availableDiceList[index].id));
                background.addChild(unlockBtn);

                //Text tren button
                var unlockBtnLb = new ccui.Text(fr.Localization.text("gui_dice_shop_unlock_btn_lb"), res.FONT_GAME_BOLD, 18);
                //unlockBtnLb.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
                unlockBtnLb.setPosition(unlockBtn.getBoundingBox().width/2, unlockBtn.getBoundingBox().height/2 + 5);
                unlockBtn.addChild(unlockBtnLb);

                //Cai khoa
                var lock = fr.createSprite("lobby/diceShop/lock-dice.png");
                lock.setPosition(179, 28);
                unlockBtn.addChild(lock);

                var conditionBg = fr.createSprite("lobby/diceShop/conditionBg.jpg");
                conditionBg.setPosition(background.getContentSize().width/2, 227);
                background.addChild(conditionBg);

                //Điều kiện mở khóa
                var conditionTxt = new ccui.Text(fr.Localization.text("dice_condition_" + this.availableDiceList[index].id), res.FONT_GAME, 16);
                conditionTxt.setTextColor(cc.color.YELLOW);
                conditionTxt.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                conditionTxt.setPosition(conditionBg.getContentSize().width/2 + 20, 25);
                conditionBg.addChild(conditionTxt);
            }
            else{
                cc.log("Mo khoa: " + index);
                var useBtn = new ccui.Button();
                useBtn.loadTextureNormal("res/lobby/diceShop/bt_select.png");
                useBtn.setPosition(background.getContentSize().width/2, 50);
                useBtn.addClickEventListener(this.useBtnClick.bind(this, index));
                background.addChild(useBtn);

                var useBtnLb = new ccui.Text(fr.Localization.text("gui_dice_shop_select_btn_lb"), res.FONT_GAME_BOLD, 18);
                //useBtnLb.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
                useBtnLb.setPosition(useBtn.getBoundingBox().width/2, useBtn.getBoundingBox().height/2 + 5);
                useBtn.addChild(useBtnLb);
            }
        }

        if(idx == this.selectedIndex){
            //Khoi tao khung nhan biet xuc xac nao dang chon
            var selectedFrame = fr.createSprite("lobby/diceShop/selectedFrame.png");
            selectedFrame.setPosition(this.TABLE_CELL_SIZE.width/2, this.TABLE_CELL_SIZE.height/2);
            selectedFrame.setTag(SELECTED_FRAME_TAG);
            cell.addChild(selectedFrame);
        }

        return cell;
    },

    //xu ly su kien khi click vao cell de chon xuc xac
    tableCellTouched:function (table, cell) {

        var oldCell = table.cellAtIndex(this.selectedIndex);
        if(oldCell != null){
            oldCell.removeChildByTag(SELECTED_FRAME_TAG);
        }

        var selectedFrame = fr.createSprite("lobby/diceShop/selectedFrame.png");
        selectedFrame.setPosition(this.TABLE_CELL_SIZE.width/2, this.TABLE_CELL_SIZE.height/2);
        selectedFrame.setTag(SELECTED_FRAME_TAG);
        cell.addChild(selectedFrame);

        this.selectedIndex = cell.getIdx();
        var diceId = this.availableDiceList[this.selectedIndex].id;
        cc.log("cell clik: " + cell.getIdx() + ", diceID = " + diceId);
        //this.initMainDice(diceId);
        this.selectedId = diceId;
        //this.table.reloadData();
    },


    tableCellSizeForIndex:function (table, idx) {
        return this.TABLE_CELL_SIZE;
    },


    numberOfCellsInTableView:function (table) {
        return this.availableDiceList.length;
    },


    initMainDice:function(diceId){
        var container = this._centerNode.getChildByName("selected_dice_ctn");
        container.removeAllChildren();
        var diceImg = new cc.Sprite("lobby/diceShop/dice" + diceId +".png");
        diceImg.setPosition(container.getContentSize().width/4, container.getContentSize().height/2-40);
        diceImg.setScale(0.7);
        container.addChild(diceImg);

        var diceEff = fr.AnimationMgr.createAnimationById(resAniId.eff_dice_background, this);
        diceEff.getAnimation().gotoAndPlay("run", 0, -1, 0);
        diceEff.setScale(1.5);
        diceEff.setPosition(diceImg.getContentSize().width/2, diceImg.getContentSize().height/2);
        diceImg.addChild(diceEff,-1);

        var dice_moveBy = cc.moveBy(2, 0, 15).easing(cc.easeInOut(2));
        var dice_act = cc.sequence(dice_moveBy, dice_moveBy.reverse()).repeatForever();
        diceImg.runAction(dice_act);


        //Ten xuc xac
        this.mainDiceName.setString(fr.Localization.text("dice_name_" + diceId));

        //ti le skill
        this.rateTxt.setString((this.getDice(diceId).incDiceControl * 100) + "%");


        if(diceId == UserData.getInstance().mainDice){//Đang sử dụng
            this.usingTxt.setVisible(true);
            this.useBtn.setVisible(false);
            this.unlockBtn.setVisible(false);
            this.conditionTxt.setVisible(false);
            this.locked.setVisible(false);
        }
        else{
            if(UserData.getInstance().diceList.indexOf(diceId) < 0) {//Bị khóa
                this.usingTxt.setVisible(false);
                this.useBtn.setVisible(false);
                this.unlockBtn.setVisible(true);
                this.locked.setVisible(true);


                //var conditionText =  new ccui.Text(fr.Localization.text("dice_condition_" + diceId), "res/fonts/20.fnt");
                this.conditionTxt.setVisible(true);
                this.conditionTxt.setString(fr.Localization.text("dice_condition_" + diceId));
            }
            else{//Mở khóa nhưng chưa dùng
                this.usingTxt.setVisible(false);
                this.useBtn.setVisible(true);
                this.unlockBtn.setVisible(false);
                this.conditionTxt.setVisible(false);
                this.locked.setVisible(false);
            }
        }

        //dice canh nhan vat
        var dice = new cc.Sprite("lobby/diceShop/dice" + diceId +".png");
        dice.setScale(0.5);
        this.bubble.removeAllChildren();
        this.bubble.addChild(dice);
    },

    unlockBtnClick: function(diceId){
        switch (diceId){
            case DiceID.DICE_1:
                break;
            case DiceID.DICE_2:
                gv.guiMgr.addGui(new GuiBuyGold(), GuiId.BUY_GOLD, LayerId.LAYER_GUI);
                break;
            case DiceID.DICE_3:
                if (CheatConfig.PAYMENT){
                    gv.guiMgr.addGui(new GuiCheatPayment(CheatPaymentType.COIN_CARD), GuiId.CHEAT_PAYMENT, LayerId.LAYER_GUI);
                }
                else{
                    fr.zalo.purchaseTelcoForCCN();
                }
                break;
            case DiceID.DICE_4:
                gv.guiMgr.addGui(new GuiAccumulationPayment(), GuiId.ACCUMULATION_PAYMENT, LayerId.LAYER_GUI);
                break;
            case DiceID.DICE_5:
                gv.guiMgr.addGui(new GuiAccumulationPayment(), GuiId.ACCUMULATION_PAYMENT, LayerId.LAYER_GUI);
                break;
            case DiceID.DICE_6:
                break;
            case DiceID.DICE_7:
                break;
        }
    },

    useBtnClick: function(cellIdx){
        var oldCell = this.table.cellAtIndex(this.selectedIndex);
        if(oldCell != null){
            oldCell.removeChildByTag(100);
        }

        var selectedFrame = fr.createSprite("lobby/diceShop/selectedFrame.png");
        selectedFrame.setPosition(this.TABLE_CELL_SIZE.width/2, this.TABLE_CELL_SIZE.height/2);
        selectedFrame.setTag(100);
        var cell = this.table.cellAtIndex(cellIdx);
        cell.addChild(selectedFrame);

        this.selectedIndex = cell.getIdx();

        var diceId = this.availableDiceList[this.selectedIndex].id;
        UserData.getInstance().mainDice = diceId;
        var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
        if(guiLobby != null)
            guiLobby.loadMainDice();
        gv.gameClient.sendPickDice(GameUtil.getGlobalDiceId(diceId));
        //this.initMainDice(diceId);
        this.table.reloadData();
    },

    loadMainCharacter: function(){
        var mainCharData = UserDataUtil.getMainCharData();

        fr.changeSprite(this.mainCharImage, mainCharData.id+"_model.png");
        this.mainCharName.setString(fr.Localization.text("character_name_" + mainCharData.id));
        fr.changeSprite(this.mainCharInfoSlot, "star_slot_" + GameUtil.getClassNameById(mainCharData.clazz) + ".png");

        var starNumber = mainCharData.getStarFromLevel(mainCharData.level);
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
            var star =  this.mainCharSlot.getChildByTag(j);
            fr.changeSprite(star,j<starNumber?"card_star_enable.png":"card_star_disable.png");
        }
        this.skillTable.reloadData(mainCharData);

        var bubble_moveBy = cc.moveBy(2, 0, 15).easing(cc.easeInOut(2));
        var bubble_act = cc.sequence(bubble_moveBy, bubble_moveBy.reverse()).repeatForever();
        this.bubble.runAction(bubble_act);
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
        }
    },

});

