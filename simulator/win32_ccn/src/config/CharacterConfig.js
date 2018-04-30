/**
 * Created by user on 10/3/2016.
 */

var LevelInfo = cc.Class.extend({
    charClass: "",
    requireExp: 0,
    accumulateExp: 0,
    evolveExp: 500,
    requireGold: 0,
    sellGold: 50
});// Class nay chua thong tin cua level

var CharacterConfig = cc.Class.extend({

    jsonData : [],
    maxLevel: 0,

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/Character.json", function(error, data){
            _this.jsonData = data;
        });
    },

    getCharacterList: function(){
        var result = [];
        var charListKeys = Object.keys(this.jsonData["CharList"]);
        for (var i=0; i<charListKeys.length; i++){
            var characterData = new CharacterData();
            characterData.uid = -1;
            characterData.id = charListKeys[i];
            characterData.clazz = GameUtil.getClassIdByName(charListKeys[i][3]);
            characterData.level = 1;
            characterData.curExp = 0;
            characterData.skillList = this.getSkillListOfCharClazz(GameUtil.getClassIdByName(charListKeys[i][3]));
            result.push(characterData);
        }
        return result;
    },

    getLevelList: function(){
        var result = [];
        var charLevelList = Object.keys(this.jsonData["Level"]);
        for (var i=0; i<charLevelList.length; i++){
            result.push(this.jsonData["Level"][charLevelList[i]]);
        }
        return result;
    },

    getDelegateCharacterListByClass: function(){
        var result = [];
        var classListKeys = Object.keys(this.jsonData["CharClass"]);
        for (var i=0; i<classListKeys.length; i++){
            var curId = this.jsonData["CharClass"][classListKeys[i]]["characterDrop"]["1"].char;
            var characterData = new CharacterData();
            characterData.uid = -1;
            characterData.id = curId;
            characterData.clazz = GameUtil.getClassIdByName(curId[3]);
            characterData.level = 1;
            characterData.curExp = 0;
            characterData.skillList = this.getSkillListOfCharClazz(GameUtil.getClassIdByName(curId[3]));
            result.push(characterData);
        }
        return result;
    },

    getLevelInfoByLevel: function(level){
        var levelInfo = new LevelInfo();
        var levelObj = this.jsonData["Level"][level];
        levelInfo.charClass = levelObj.charClass;
        levelInfo.requireExp = parseInt(levelObj.requireExp);
        levelInfo.accumulateExp = parseInt(levelObj.accumulateExp);
        levelInfo.evolveExp = parseInt(levelObj.evolveExp);
        levelInfo.requireGold = parseInt(levelObj.requireGold);
        levelInfo.sellGold = parseInt(levelObj.sellGold);

        return levelInfo;
    },

    getMaxLevel: function(){
        //Lay level max
        var levelData = this.jsonData["Level"];
        return Object.keys(levelData).length;
    },

    getSkillInfoById : function(skillId, clazzId){
        cc.log("skillId = " + skillId + ", clazz = " + clazzId);
        var classObj = this.jsonData["Skill"][skillId]["attributes"][GameUtil.getClassNameById(clazzId)+"_CLASS"];
        var skillInfo = {};
        skillInfo.chance = classObj.chance;
        skillInfo.cBonus = classObj.cBonus;
        skillInfo.value = [];
        if (classObj.hasOwnProperty("value")){
            if (classObj.value.toString().indexOf(";") == -1){
                skillInfo.value[0] = Number(classObj.value);
            }
            else{
                skillInfo.value = classObj.value.toString().split(";");
                for (var i=0; i<skillInfo.value.length; i++){
                    skillInfo.value[i] = Number(skillInfo.value[i]);
                }
            }
        }
        skillInfo.maxChance = null;
        if (classObj.hasOwnProperty("max_chance")){
            skillInfo.maxChance = Number(classObj["max_chance"]);
        }

        return skillInfo;
    },

    getSkillContextById: function(skillId){
        return this.jsonData["Skill"][skillId].context.toString();
    },

    getSkillPrioritytById: function(skillId){
        return Number(this.jsonData["Skill"][skillId].priority);
    },

    getTotalChanceOfSkill: function(skillInfo, level){
        cc.log("skillInfo.chance = " + skillInfo.chance + ", level = " + level + ", GameUtil.getStarFromLevel(level) = " + GameUtil.getStarFromLevel(level) + ", skillInfo.cBonus = " + skillInfo.cBonus);
        var result = skillInfo.chance + GameUtil.getStarFromLevel(level) * skillInfo.cBonus;
        if (skillInfo.maxChance!=null)
            result = Math.min(result, skillInfo.maxChance);
        return result;
    },

    getAllSkills: function(){
        var result = [];
        var skillListKeys = Object.keys(this.jsonData["Skill"]);
        for (var i=0; i<skillListKeys.length; i++){
            result.push(parseInt(skillListKeys[i]));
        }
        return result;
    },

    getSkillListOfCharClazz: function(charClazz){
        var result = [];
        var clazzName = GameUtil.getClassNameById(charClazz)+"_CLASS";
        var skillListKeys = Object.keys(this.jsonData["Skill"]);
        for (var i=0; i<skillListKeys.length; i++){
            if (this.jsonData["Skill"][skillListKeys[i].toString()]["attributes"][clazzName] != null){
                result.push(parseInt(skillListKeys[i]));
            }
        }
        return result;
    },

    getSkillList: function(){
        var result = [];
        var skillListKeys = Object.keys(this.jsonData["Skill"]);
        for (var i=0; i<skillListKeys.length; i++){
            result.push(parseInt(skillListKeys[i]));
        }
        return result;
    },
});

CharacterConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new CharacterConfig();
    }
    return this._instance;
};