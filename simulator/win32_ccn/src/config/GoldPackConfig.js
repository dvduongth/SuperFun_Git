/**
 * Created by user on 10/3/2016.
 */

var GoldPackData = cc.Class.extend({
    cost: 0,
    gold: 0,

    ctor: function(cost, gold){
        this.cost = cost;
        this.gold = gold;
    }

});


var GoldPackConfig = cc.Class.extend({

    jsonData : [],

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/GoldPack.json", function(error, data){
            _this.jsonData = data;
        });
    },

    getGoldPackCount: function(){
        var goldPackObj = this.jsonData["GoldPack"];
        return Object.keys(goldPackObj).length;
    },

    getGoldPackDataByIndex: function(index){
        var cost = this.jsonData["GoldPack"]["GP_"+index].cost;
        var gold = this.jsonData["GoldPack"]["GP_"+index].gold;
        return new GoldPackData(cost, gold);
    },

    getSMSPackCount: function(){
        var smsPackObj = this.jsonData["ZaloSMSPack"];
        return Object.keys(smsPackObj).length;
    },


    getZaloSMSGoldPackDataByIndex: function(index){
        var cost = this.jsonData["ZaloSMSPack"]["ZSMS_"+index].cost;
        var gold = this.jsonData["ZaloSMSPack"]["ZSMS_"+index].gold;
        return new GoldPackData(cost, gold);
    },

});

GoldPackConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new GoldPackConfig();
    }
    return this._instance;
};