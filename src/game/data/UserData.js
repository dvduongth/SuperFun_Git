/**
 * Created by user on 20/1/2016.
 */

var UserData = cc.Class.extend({
    uid: -1,
    userName: "",
    displayName: "",
    gold: -1,
    xu: -1,
    level: -1,
    exp: -1,
    vipLevel: -1,
    vipDailyGiftClaimed: -1,
    vipExpiredTime: -1,
    avatarUrl: "",
    friends: [],
    socialPlayedFriendIds: [],
    characterList : [],
    mainCharUid : 0,
    mainDice: 0, //"1","2",...
    timeToGachaFree: 0,
    diceList: [],

    ctor: function() {
        this.mainCharUid  = 0,
        this.characterList = [];
        this.friends = [];
    },

    getCharacterInfoByUID : function(charUID) {
            for (var i = 0; i < this.characterList.length; i++) {
                if (this.characterList[i].uid == charUID)
                    return this.characterList[i];
            }

            return null;
    },

    removeCharacterByUID: function (pieceID) {
        for (var i = 0; i < this.characterList.length; i++) {
            if (this.characterList[i].uid == pieceID)
                this.characterList.splice(i, 1)[0];
        }
    },

    updateDiceList: function(updateList){
        this.diceList = this.diceList.concat(updateList);
    },

});

UserData.getInstance = function(){
    if (this._instance == null){
        this._instance = new UserData();
    }
    return this._instance;
};
