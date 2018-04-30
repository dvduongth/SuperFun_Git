/**
 * Created by user on 5/5/2016.
 */

var VipConfig = cc.Class.extend({
    jsonData : [],

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/VIP.json", function(error, data){
            _this.jsonData = data;
        });
    },

    getGrossCost: function(){
        return parseInt(this.jsonData["BasicVIP"]["grossCost"]);
    },

    getCoinCost: function(){
        return parseInt(this.jsonData["BasicVIP"]["coinCost"]);
    },

    getDurationInSecond: function(){
        return parseInt(this.jsonData["BasicVIP"]["durationInSec"]);
    },

    getGiftList: function(){
        var giftObj = this.jsonData["BasicVIP"]["registrationRewards"];
        var giftNumber = Object.keys(giftObj).length;
        var giftList = [];
        for (var i=1; i<=giftNumber; i++){
            var giftType = this.jsonData["BasicVIP"]["registrationRewards"][i].item;
            var giftQ = this.jsonData["BasicVIP"]["registrationRewards"][i].q;
            giftList.push(new GiftData(giftType, giftQ));

        }
        return giftList;
    },

    getDailyLoginGoldBonusRate: function(){
        return parseFloat(this.jsonData["BasicVIP"]["dailyLoginGoldBonusRate"]);
    },

    getWinningGameGoldBonusRate: function(){
        return parseFloat(this.jsonData["BasicVIP"]["winningGameGoldBonusRate"]);
    },

});

VipConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new VipConfig();
    }
    return this._instance;
};