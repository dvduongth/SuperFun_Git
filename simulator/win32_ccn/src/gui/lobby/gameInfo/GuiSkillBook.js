/**
 * Created by user on 1/6/2016.
 */

var GuiSkillBook = BaseGui.extend({

    SKILL_TABLE_SIZE: cc.size(865, 122*3),
    SKILL_TABLE_CELL_SIZE: cc.size(865,122),

    skillList: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_SKILL_BOOK);
        this.setFog(true);

        if ((!gv.guiMgr.getGuiById(GuiId.CHARACTER_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.CARD_BOOK)) && (!gv.guiMgr.getGuiById(GuiId.DICE_BOOK)))
            this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");
        this.bg.getChildByName("btn_close").addClickEventListener(this.destroy.bind(this, DestroyEffects.ZOOM));

        var characterBtn = this.bg.getChildByName("btn_character");
        characterBtn.addClickEventListener(this.onCharacterBtnClick.bind(this));

        var cardBtn = this.bg.getChildByName("btn_card");
        cardBtn.addClickEventListener(this.onCardBtnClick.bind(this));

        var diceBtn = this.bg.getChildByName("btn_dice");
        diceBtn.addClickEventListener(this.onDiceBtnClick.bind(this));

        this.skillList = CharacterConfig.getInstance().getSkillList();

        this.table = new cc.TableView(this,this.SKILL_TABLE_SIZE);
        this.table.setPosition(50,40);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.reloadData();
        this.table.setDelegate(this);
        this.bg.addChild(this.table);
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();

        var background, skillIcon, skillName, skillDescription;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite("res/lobby/version2/game_info/game_book/book_cell.png");
            background.setPosition(cellSize.width/2, cellSize.height/2);
            cell.addChild(background);

            skillIcon = fr.createSprite();
            skillIcon.setPosition(65, cellSize.height/2);
            skillIcon.setTag(1);
            cell.addChild(skillIcon);

            skillName = new ccui.Text("", res.FONT_GAME_BOLD, 25);
            skillName.setAnchorPoint(0, 0.5);
            skillName.setColor(cc.color("#857070"));
            skillName.setPosition(skillIcon.getPositionX() + 85, skillIcon.getPositionY());
            skillName.setTag(2);
            cell.addChild(skillName);

            skillDescription = new ccui.Text("", res.FONT_GAME_BOLD, 18);
            skillDescription.setAnchorPoint(0, 0.5);
            skillDescription.setColor(cc.color("#857070"));
            skillDescription.setPosition(skillName.getPositionX()+300, skillIcon.getPositionY());
            skillDescription.setTag(3);
            cell.addChild(skillDescription);

        }
        var skillId = this.skillList[idx];
        skillIcon = cell.getChildByTag(1);
        skillName = cell.getChildByTag(2);
        skillDescription = cell.getChildByTag(3);

        fr.changeSprite(skillIcon, "game/skill/skill_icon" + skillId + ".png");
        skillName.setString(StringUtil.limitWordNumber(fr.Localization.text("skill_name_"+skillId), 20));
        skillDescription.setString(fr.Localization.text("skill_common_description_"+skillId));

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.skillList.length;
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.SKILL_TABLE_CELL_SIZE
    },

    onCharacterBtnClick: function(){
        gv.guiMgr.addGui(new GuiCharacterBook(), GuiId.CHARACTER_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

    onCardBtnClick: function(){
        gv.guiMgr.addGui(new GuiCardBook(), GuiId.CARD_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

    onDiceBtnClick: function(){
        gv.guiMgr.addGui(new GuiDiceBook(), GuiId.DICE_BOOK, LayerId.LAYER_GUI);
        this.destroy();
    },

});