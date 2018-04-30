/**
 * Created by user on 1/4/2016.
 */
/**
 * Created by user on 10/3/2016.
 */

var EventConfig = cc.Class.extend({

    jsonData : [],

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/Event.json", function(error, data){
            _this.jsonData = data;
        });
    },

    getDailyLoginGiftDataByDay: function(dayIndex){
        var type = this.jsonData["DailyLogin"][dayIndex].item;
        var quantity = parseInt(this.jsonData["DailyLogin"][dayIndex].q);
        return (new GiftData(type, quantity));
    },

    getDayNumberOfDailyLoginEvent: function(){
        var dailyLoginObj = this.jsonData["DailyLogin"];
        return Object.keys(dailyLoginObj).length;
    },

    getSMSBonusGiftDataList: function(){
        var rewardObj = this.jsonData["FirstPaying"]["SMSBonus"]["reward"];
        var rewardNumber = Object.keys(rewardObj).length;
        var giftDataList = [];
        for (var i=1; i<=rewardNumber; i++){
            giftDataList.push(new GiftData(rewardObj[i].item, rewardObj[i].q));
        }
        return giftDataList;
    },

    getTelcoBonusGiftDataList: function(){
        var rewardObj = this.jsonData["FirstPaying"]["TelcoBonus"]["reward"];
        var rewardNumber = Object.keys(rewardObj).length;
        var giftDataList = [];
        for (var i=1; i<=rewardNumber; i++){
            giftDataList.push(new GiftData(rewardObj[i].item, rewardObj[i].q));
        }
        return giftDataList;
    },

    getPayingAccumulateGiftNumber: function(){
        var giftObj = this.jsonData["PayingAccumulate"];
        var giftNumber = Object.keys(giftObj).length;
        return giftNumber;
    },

    getPayingAccumulateVNDRequireByIndex: function(giftIndex){
        return parseInt(this.jsonData["PayingAccumulate"][giftIndex]["vndRequire"]);
    },

    getPayingAccumulateRewardListByIndex: function(giftIndex){

        var rewardObj = this.jsonData["PayingAccumulate"][giftIndex]["reward"];
        var rewardNumber = Object.keys(rewardObj).length;
        var rewardList = [];
        for (var i=1; i<=rewardNumber; i++){
            var item = rewardObj[i].item;
            var q = parseInt(rewardObj[i].q);
            rewardList.push(new GiftData(item,q));
        }
        return rewardList;
    },

    //Invite Friend

    getInviteFriendGiftNumber: function(){
        var inviteFriendObj = this.jsonData["InviteFriend"];
        return Object.keys(inviteFriendObj).length;
    },

    getInviteFriendGiftDataByIndex: function(giftIndex){//from 1
        var giftObj =  this.jsonData["InviteFriend"][giftIndex]["reward"][1];
        return new GiftData(giftObj.item, giftObj.q);

    },

    getFriendNumberNeedForGift: function(giftIndex){
        return parseInt(this.jsonData["InviteFriend"][giftIndex].nInvited);
    },

    getMaxFriendInvitationPerDay: function(){
        return parseInt(this.jsonData["General"].maxFriendInvitationPerDay);
    },

    //Selfie Character

    getSelfieFirstReward: function(){
        var giftObj = this.jsonData["SelfieCharacter"]["firstReward"];
        var item = giftObj.item;
        var q = parseInt(giftObj.q);
        return new GiftData(item, q);
    },

    getSelfieStandardReward: function(){
        var giftObj = this.jsonData["SelfieCharacter"]["standardReward"];
        var item = giftObj.item;
        var q = parseInt(giftObj.q);
        return new GiftData(item, q);
    },

    getSelfieCoolDownTime: function(){
        return parseInt(this.jsonData["SelfieCharacter"].coolDownTime);
    },

});

EventConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new EventConfig();
    }
    return this._instance;
};