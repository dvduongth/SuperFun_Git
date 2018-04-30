/**
 * Created by user on 26/1/2016.
 */

var NotificationHandlerId = {
    GET_FRIEND_LIST_DATA: 0,
    GET_CHARACTER_LIST : 1,
    DO_GACHA_RESULT : 2,
    PICK_MAIN_CHARACTER_RESULT: 3,
    CHEAT_ADD_CHARACTER_RESULT : 4,
    UPGRADE_CHARACTER_RESULT : 5,
    SELL_CHARACTER_RESULT : 6,
    RECEIVE_DAILY_LOGIN_GIFT: 7,
    UPDATE_MAIL_DATA: 8,
    RECEIVE_MAIL_ITEM: 9,
    PAYING_ACCUMULATE_CLAIM: 10,
    VIP_DAILY_GIFT_CLAIM: 11,
    USER_CHEAT_PAYMENT: 12,
    BUY_GOLD_PACK: 13,
    INVITE_FRIEND_CLAIM: 14,
    UPDATE_NUMBER_INVITED_FRIEND: 15,
    GIFT_CODE: 16,
    SELFIE_CHARACTER_CLAIM: 17,
};


var NotificationHandler = cc.Class.extend({

    notificationList : null,

    ctor: function(){
        this.notificationList = [];
    },

    addHandler: function(id, handler){
        this.notificationList[id] = handler;
    },

    postHandler: function(id, data){
        var handler = this.notificationList[id];
        handler(data);
    },

    removeHandler: function(id){
        delete this.notificationList[id];
    }
});

NotificationHandler.getInstance = function(){
    if (!this._instance){
        this._instance = new NotificationHandler();
    }
    return this._instance;
}