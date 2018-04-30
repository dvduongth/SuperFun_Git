/**
 * Created by CPU11674-local on 4/4/2016.
 */

var DiceUnlockContion = {
    NONE : "NONE",
    FIRST_SMS : "FIRST_SMS",
    FIRST_CARD : "FIRST_CARD",
    PAYING_ACCUMMULATE : "PAYING_ACCUMMULATE",
    COMING_SOON : "COMING_SOON",
}

var DiceConfig = cc.Class.extend({

    jsonData : [],

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/Dice.json", function(error, data){
            _this.jsonData = data;
        });
    },


    getListDice:function(){
        var list = this.jsonData["Dice"];
        return list;
    },

    getListDiceId: function(){
        var result = [];
        var diceObjKeys = Object.keys(this.jsonData["Dice"]);
        for (var i=0; i<diceObjKeys.length; i++){
            if (this.jsonData["Dice"][diceObjKeys[i]].conditionUnlock != "COMING_SOON")
                result.push(diceObjKeys[i])
        }
        return result;
    },

    getDiceByUnlockCondition: function (unlockCondition) {
        var list = this.jsonData["Dice"];
        var arr = [];
        for (var str in list){
            var dice = list[str];
            if(dice["conditionUnlock"] == unlockCondition){
                arr.push(str.split("_")[1]);
            }
        }
        return arr;
    },
});

DiceConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new DiceConfig();
    }
    return this._instance;
};