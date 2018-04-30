/**
 * Created by user on 1/6/2016.
 */

var GuiDiceBook = BaseGui.extend({

    DICE_TABLE_SIZE: cc.size(865, 122*3),
    DICE_TABLE_CELL_SIZE: cc.size(865,122),

    diceList: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_DICE_BOOK);
        this.setFog(true);

        if ((!gv.guiMgr.getGuiById(GuiId.CHARACTER_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.CARD_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.SKILL_BOOK)))
            this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");
        this.bg.getChildByName("btn_close").addClickEventListener(this.destroy.bind(this, DestroyEffects.ZOOM));

        var characterBtn = this.bg.getChildByName("btn_character");
        characterBtn.addClickEventListener(this.onCharacterBtnClick.bind(this));

        var cardBtn = this.bg.getChildByName("btn_card");
        cardBtn.addClickEventListener(this.onCardBtnClick.bind(this));

        var skillBtn = this.bg.getChildByName("btn_skill");
        skillBtn.addClickEventListener(this.onSkillBtnClick.bind(this));

        this.diceList = DiceConfig.getInstance().getListDiceId();

        this.table = new cc.TableView(this,this.DICE_TABLE_SIZE);
        this.table.setPosition(50,40);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.reloadData();
        this.table.setDelegate(this);
        this.bg.addChild(this.table);

    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();

        var background, diceIcon, diceName, diceCondition, diceDescription1, diceDescription2;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite("res/lobby/version2/game_info/game_book/book_cell.png");
            background.setPosition(cellSize.width/2, cellSize.height/2);
            cell.addChild(background);

            diceIcon = fr.createSprite();
            diceIcon.setPosition(70, cellSize.height/2-5);
            diceIcon.setScale(0.5);
            diceIcon.setTag(1);
            cell.addChild(diceIcon);

            diceName = new ccui.Text("", res.FONT_GAME_BOLD, 28);
            diceName.setAnchorPoint(0, 0.5);
            diceName.setColor(cc.color("#bc9476"));
            diceName.setPosition(diceIcon.getPositionX() + 100, diceIcon.getPositionY());
            diceName.setTag(2);
            cell.addChild(diceName);

            diceCondition = new ccui.Text("", res.FONT_GAME_BOLD, 17);
            diceCondition.setAnchorPoint(0, 0.5);
            diceCondition.setColor(cc.color("#857070"));
            diceCondition.setPosition(diceName.getPositionX()+280, diceIcon.getPositionY()+20);
            diceCondition.setTag(3);
            cell.addChild(diceCondition);

            diceDescription1 = new ccui.Text("", res.FONT_GAME_BOLD, 17);
            diceDescription1.setAnchorPoint(0, 1);
            diceDescription1.setColor(cc.color("#857070"));
            diceDescription1.setPosition(diceName.getPositionX()+280, diceIcon.getPositionY()-15);
            diceDescription1.setTag(4);
            cell.addChild(diceDescription1);

            diceDescription2 = new ccui.Text("", res.FONT_GAME_BOLD, 17);
            diceDescription2.setAnchorPoint(0, 1);
            diceDescription2.setColor(cc.color("#857070"));
            diceDescription2.setPosition(diceDescription1.getPositionX()+230, diceIcon.getPositionY()-15);
            diceDescription2.setTag(5);
            cell.addChild(diceDescription2);
        }
        var diceId = parseInt(this.diceList[idx][this.diceList[idx].length-1]);
        diceIcon = cell.getChildByTag(1);
        diceName = cell.getChildByTag(2);
        diceCondition = cell.getChildByTag(3);
        diceDescription1 = cell.getChildByTag(4);
        diceDescription2 = cell.getChildByTag(5);

        fr.changeSprite(diceIcon, "lobby/diceShop/dice" + diceId + ".png");
        diceName.setString(fr.Localization.text("dice_name_"+diceId));

        if (fr.Localization.text("dice_condition_"+diceId) != ""){
            diceCondition.setString("- " + fr.Localization.text("dice_condition_"+diceId));
            diceDescription1.setPositionY(diceIcon.getPositionY()-15);
        }
        else{
            diceCondition.setString("");
            diceDescription1.setPositionY(diceIcon.getPositionY());
        }
        diceDescription2.setPositionY(diceDescription1.getPositionY());
        diceDescription1.setString("- " + fr.Localization.text("dice_description_"+diceId));
        diceDescription2.setString(DiceConfig.getInstance().getListDice()["DICE_"+diceId].incDiceControl*100 + "%");

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.diceList.length;
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.DICE_TABLE_CELL_SIZE
    },


    onCharacterBtnClick: function(){
        gv.guiMgr.addGui(new GuiCharacterBook(), GuiId.CHARACTER_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

    onCardBtnClick: function(){
        gv.guiMgr.addGui(new GuiCardBook(), GuiId.CARD_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

    onSkillBtnClick: function(){
        gv.guiMgr.addGui(new GuiSkillBook(), GuiId.SKILL_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

});