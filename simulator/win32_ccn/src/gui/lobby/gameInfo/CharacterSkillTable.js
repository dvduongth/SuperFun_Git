/**
 * Created by user on 3/6/2016.
 */

var CharacterSkillTableInfo = [
    {
        backgroundRes: "",
        cellRes: "res/lobby/version2/game_info/skill_list_cell_slot_0.png",
        tableSize: cc.size(331,71*4),
        cellSize: cc.size(331,71)
    },
    {
        backgroundRes: "",
        cellRes: "res/lobby/version2/game_info/skill_list_cell_slot_1.png",
        tableSize: cc.size(320,71*3.02),
        cellSize: cc.size(320,71)
    },

    {
        backgroundRes: "",
        cellRes: "res/lobby/version2/game_info/skill_list_cell_slot_1.png",
        tableSize: cc.size(267,71*3.4),
        cellSize: cc.size(267,71)
    }
];

var CharacterSkillTable = cc.Node.extend({

    ctor: function(characterData, tableType){
        this._super();
        this.characterData = characterData;
        this.tableType = tableType;

        var background = fr.createSprite(CharacterSkillTableInfo[tableType].backgroundRes);
        this.addChild(background);

        var tableSize = CharacterSkillTableInfo[tableType].tableSize;
        this.table = new cc.TableView(this,tableSize);
        this.table.setPosition(-tableSize.width/2, -tableSize.height/2);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.setDelegate(this);
        this.addChild(this.table);

        this.noSkillText = new ccui.Text(fr.Localization.text("not_skill"), res.FONT_GAME_BOLD, 20);
        this.noSkillText.setColor(BaseGui.TEXT_COLOR_BROWN);
        this.noSkillText.setPosition(0,0);
        this.addChild(this.noSkillText);

        this.reloadData(characterData);
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();

        var background, skillIcon, skillName, skillDescription;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite(CharacterSkillTableInfo[this.tableType].cellRes);
            if (this.tableType == 0 || this.tableType == 1)
                background.setPosition(cellSize.width/2, cellSize.height/2);
            else if (this.tableType == 2)
                background.setPosition(cellSize.width/2,0);
            cell.addChild(background);

            skillIcon = fr.createSprite();

            if (this.tableType==1){
                background.setOpacity(0);
                skillIcon.setPosition(40, cellSize.height/2);
                skillIcon.setScale(0.52);
            }
            else{
                skillIcon.setPosition(40, cellSize.height/2);
                skillIcon.setScale(0.45);
            }
            skillIcon.setTag(1);
            cell.addChild(skillIcon);

            skillName = new ccui.Text("", res.FONT_GAME_BOLD, 19);
            skillName.setAnchorPoint(0, 0.5);
            skillName.setColor(cc.color("#00ffa4"));
            skillName.enableOutline(BaseGui.TEXT_COLOR_BROWN, 2);
            skillName.setPosition(skillIcon.getPositionX() + 40, skillIcon.getPositionY()+15);
            skillName.setTag(2);
            cell.addChild(skillName);

            skillDescription = new ccui.Text("", res.FONT_GAME_BOLD, 13);
            skillDescription.setAnchorPoint(0, 1);
            skillDescription.setPosition(skillName.getPositionX(), skillName.getPositionY()-12);
            skillDescription.setTag(3);
            cell.addChild(skillDescription);

        }
        var skillId = this.characterData.skillList[idx];
        skillIcon = cell.getChildByTag(1);
        skillName = cell.getChildByTag(2);
        skillDescription = cell.getChildByTag(3);

        fr.changeSprite(skillIcon, "game/skill/skill_icon_" + skillId + ".png");
        skillName.setString(fr.Localization.text("skill_name_"+skillId));
        skillDescription.setString(GameUtil.getSkillDescription(skillId, this.characterData.clazz));

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.characterData.skillList.length;
    },

    tableCellSizeForIndex:function (table, idx) {
        return CharacterSkillTableInfo[this.tableType].cellSize;
    },

    reloadData: function(characterData){
        this.characterData = characterData;
        this.table.reloadData();
        this.noSkillText.setVisible(this.characterData.skillList.length==0);
    },
});
