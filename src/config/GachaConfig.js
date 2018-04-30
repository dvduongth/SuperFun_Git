/**
 * Created by user on 10/3/2016.
 */

var  GachaType = {
    SILVER_CHEST_FREE : 1,
    SILVER_CHEST_10 : 2,
    GOLD_CHEST_1 : 3,
    GOLD_CHEST_10 : 4
};

var GachaConfig = cc.Class.extend({

    jsonData : [],

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/Gacha.json", function(error, data){
            _this.jsonData = data;
        });
    },

    getCostByGachaType: function(gachaType){
        var typeObj = this.jsonData["GachaOption"][gachaType];
        var cost = new Cost(typeObj["cost"].item, parseInt(typeObj["cost"].q));
        return cost;
    }

});

GachaConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new GachaConfig();
    }
    return this._instance;
};