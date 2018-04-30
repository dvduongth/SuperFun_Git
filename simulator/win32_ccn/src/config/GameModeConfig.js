/**
 * Created by user on 30/7/2016.
 */

var GameModeConfig = cc.Class.extend({

    jsonData: [],
    maxLevel: 0,

    ctor: function () {
        var _this = this;
        cc.loader.loadJson("json/GameMode.json", function (error, data) {
            _this.jsonData = data;
        });
    },

    getChanel: function (level) {
        var chanel = this.jsonData["Channel"][level];
        return chanel;
    },

    getBetLevelChanel:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.bet);
    },

    getMinLevelChanel:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.min);
    },

    getMaxLevelChanel:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.max);
    },

    getMinigame2Bet:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.miniGame2);
    },

    getTaxMoney:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.tax);
    },

    getZooFee:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.escapeFee);
    },

    getSummonFee:function(betLevel){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        return parseInt(betLevelObj.summonFee);
    },

    getKickFeeByBetLevel: function(betLevel, kickNumber){
        var betLevelObj = this.jsonData["BetLevel"][betLevel];
        switch (kickNumber){
            case 1:
                return parseInt(betLevelObj.kickFee);
                break;
            case 2:
                return parseInt(betLevelObj.kickFee1);
                break;
            case 3:
                return parseInt(betLevelObj.kickFee2);
                break;
            default:
                return parseInt(betLevelObj.kickFee3);
                break;
        }
    },

    getFirstLoad1MoneyByBetLevel: function(betLevel){
        return parseInt(this.jsonData["BetLevel"][betLevel].firstLoad1);
    },

    getFirstLoad4MoneyByBetLevel: function(betLevel){
        return parseInt(this.jsonData["BetLevel"][betLevel].firstLoad4);
    },

    getMiniGameTuXiMoneyBetLevel:function(betLevel){
        return parseInt(this.jsonData["BetLevel"][betLevel].tuxiMGBet);
    },

    getRaceMoneyByBetLevel: function(betLevel){
        return parseInt(this.jsonData["BetLevel"][betLevel].racingMGBet);
    },

});

GameModeConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new GameModeConfig();
    }
    return this._instance;
};