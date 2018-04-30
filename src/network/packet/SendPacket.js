/**
 * Created by KienVN on 5/22/2015.
 */

CmdSendPing = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
        this.setCmdId(gv.CMD.PING);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
);

CmdSendLogin = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_LOGIN);
    },

    putData : function(userName){
        this.packHeader();
        this.putString(userName);
        this.updateSize();
    }
});

CmdSendLogout = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_LOGOUT);
        this.setControllerId(0);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});


CmdSendGetPlayerData = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_PLAYER_DATA);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendGetFriendListData = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_FRIEND_RANK);
    },

    putData : function(friendListId){
        this.packHeader();
        this.putInt(friendListId.length);
        //cc.log("CUONG          " + friendListId[0])
        for (var i=0; i<friendListId.length; i++){
            this.putString(friendListId[i]);
        }
        this.updateSize();
    }
});

CmdQuickPlay =fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.QUICK_PLAY);

    },

    putData : function(gameMode, botMode, testcaseID){
        this.packHeader();
        this.putInt(gameMode);
        this.putByte(botMode? 1 : 0);
        this.putInt(testcaseID);
        this.updateSize();
    }
});

CmdSendPlayerLeaveGame = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_LEAVE_MATCH);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdCommonRollDice = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_ROLL_DICE_COMMON);
    },

    putData : function(rangeValue){
        this.packHeader();
        this.putInt(rangeValue);
        this.updateSize();
    }
});

CmdCommonRollDiceCheat = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_ROLL_DICE_COMMON_CHEAT);
    },

    putData : function(score1, score2){
        this.packHeader();
        this.putInt(score1);
        this.putInt(score2);
        this.updateSize();
    }
});

CmdSendCheatActiveSkill = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MATCH_CHEAT_ACTIVE_SKILL);
    },

    putData : function(isOn){
        this.packHeader();
        this.putByte(isOn? 1 : 0);
        this.updateSize();
    }
});


CmdPlayerResponseSkill = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_RESPONSE_SKILL);
    },

    putData : function(option){
        this.packHeader();
        this.putInt(option);
        this.updateSize();
    }
});

CmdActivePiece = fr.OutPacket.extend({
    ctor: function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_ACTIVE_PIECE);
    },

    putData : function(pieceID, solutionId,zoo){
        this.packHeader();
        this.putInt(pieceID);
        this.putInt(solutionId);
        //var test = zoo ==1;
        //cc.log("CUONG send zoo " + test);
        this.putByte(zoo==1);
        this.updateSize();
    }
});

CmdMatchPlayAsAI = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MATCH_PLAY_AS_AI);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdMatchFocActive = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MATCH_FOC_ACTIVE);
    },

    putData : function(isActive){
        this.packHeader();
        this.putByte(isActive?1:0);
        this.updateSize();
    }
});

CmdMatchFocUseSkill = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MATCH_FOC_USE_SKILL);
    },

    putData : function(param){
        this.packHeader();
        this.putInt(param);
        this.updateSize();
    }
});

CmdPlayerBankRuptExit = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_BANKRUPT_EXIT);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdReportConflict = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(2000);
        this.setCmdId(gv.CMD.MATCH_REPORT_CONFLICT);
    },

    putData : function(logText){
        this.packHeader();
        this.putString(logText);
        this.updateSize();
    }
});

CmdSendSelectMiniGame = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.HORSERACE_MINIGAME_PLAY);
    },

    putData : function(param){
        this.packHeader();
        this.putInt(param);
        this.updateSize();
    }
});

CmdSendGetAllCharacter = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_ALL_CHARACTER);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendPickMainCharacter = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PICK_MAIN_CHARACTER);
    },

    putData : function(charUid){
        this.packHeader();
        this.putLong(charUid);
        this.updateSize();
    }
});

CmdSendUpgradeCharacter = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPGRADE_CHARACTER);
    },

    putData : function(charUid, listCharMaterial){
        this.packHeader();
        this.putLong(charUid);
        this.putInt(listCharMaterial.length);
        for(var i=0; i< listCharMaterial.length; i++)
            this.putLong(listCharMaterial[i]);

        this.updateSize();
    }
});

CmdSendSellCharacter = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.SELL_CHARACTER);
    },

    putData : function(listCharUid){
        this.packHeader();
        this.putInt(listCharUid.length);
        for(var i=0; i< listCharUid.length; i++)
            this.putLong(listCharUid[i]);
        this.updateSize();
    }
});

CmdSendDoGaCha = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DO_GACHA);
    },

    putData : function(type){
        this.packHeader();
        this.putInt(type);
        this.updateSize();
    }
});

CmdSendCheatCharacter = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CHEAT_ADD_CHAR_WITH_SKILL_SET);
    },

    putData : function(charID, skillList){
        this.packHeader();
        this.putString(charID);
        this.putInt(skillList.length);
        for(var i=0; i< skillList.length; i++){
            this.putInt(skillList[i]);
        }

        this.updateSize();
    }
});

CmdSendGetEvent = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_EVENT_DATA);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

//cuong put thong tin global rank
CmdSendGetGlobalRank = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_GLOBAL_RANK);
    },

    putData : function(page){
        this.packHeader();
        this.putInt(page);
        this.updateSize();
    }
});

CmdSendGetMailData = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_MAIL_DATA);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendReceiveMailItem = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.RECEIVE_MAIL_ITEM);
    },

    putData : function(mailUID){
        this.packHeader();
        this.putLong(mailUID);
        this.updateSize();
    }
});

CmdSendDailyCheckin = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DAILY_CHECKIN);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendDailySupportClaim = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DAILY_SUPPORT_CLAIM);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendInviteFriendClaim = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.INVITE_FRIEND_CLAIM);
    },

    putData : function(benefitID){
        this.packHeader();
        this.putInt(benefitID);
        this.updateSize();
    }
});

CmdSendPayingAccumulateClaim = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PAYING_ACCUMULATE_CLAIM);
    },

    putData : function(benefitID){
        this.packHeader();
        this.putInt(benefitID);
        this.updateSize();
    }
});

CmdSendSelfieCharacterClaim = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.SELFIE_CHARACTER_CLAIM);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendVipDailyGiftClaim = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.VIP_DAILY_GIFT_CLAIM);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendUpdateNumberInvitedFriend = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPDATE_NUMBER_INVITED_FRIEND);
    },

    putData : function(totalInvited){
        this.packHeader();
        this.putInt(totalInvited);
        this.updateSize();
    }
});

CmdSendPaymentUpdate = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PAYMENT_UPDATE);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});


CmdSendGetAllDice = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_ALL_DICE);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});


CmdSendPickDice = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PICK_MAIN_DICE);
    },

    putData : function(mainDice){
        this.packHeader();
        this.putString(mainDice.toString());
        this.updateSize();
    }
});

CmdSendUserCheatPayment = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_CHEAT_PAYMENT);
    },

    putData: function (caseId, grossAmount) {
        this.packHeader();
        this.putInt(caseId);
        this.putInt(grossAmount);
        this.updateSize();
    }
});

CmdSendBuyGoldPack = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.BUY_GOLD_PACK);
    },

    putData : function(goldPackId){
        this.packHeader();
        this.putString(goldPackId);
        this.updateSize();
    }
});

CmdSendCheatWinner = fr.OutPacket.extend({
    ctor : function(){
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MATCH_CHEAT_WINNER);
    },

    putData : function(){
        this.packHeader();
        this.updateSize();
    }
});

//cuong CMD gui tin nhan chat.
CmdSendChatUser = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_CHAT);
    },

    putData: function (idIcon) {
        this.packHeader();
        this.putString(idIcon);
        this.updateSize();
    }
});

//cuong CMD gui thong tin cua mini game

CmdSendSingleMinigame = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_SINGLE_MINIGAME_PLAY);
    },

    putData: function (value) {
        this.packHeader();
        this.putInt(value);
        this.updateSize();
    }
});

CmdSendPlayerControlCell = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_CONTROL_CELL);
    },

    putData: function (cellPos) {
        this.packHeader();
        this.putInt(cellPos);
        this.updateSize();
    }
});

CmdSendPlayerPayToSummon = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_PAY_TO_SUMMON);
    },

    putData: function (isPaying) {
        this.packHeader();
        this.putByte(isPaying? 1 : 0);
        this.updateSize();
    }
});

CmdSendAutoMode = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLAYER_SWITCH_AUTO);
    },

    putData: function (value) {
        this.packHeader();
        this.putByte(value? 1 : 0);
        this.updateSize();
    }
});

CmdSendRollDiceEven = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.TREASURE_ATTEMPT);
    },

    putData: function (cheat) {
        this.packHeader();
        this.putInt(cheat);
        this.updateSize();
    }
});

CmdSendGetSpecialEvenData = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GET_SPECIAL_EVEN_DATA);
    },

    putData: function () {
        this.packHeader();
        this.updateSize();
    }
});

CmdSendMiniGameTuXi = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        //todo set lai CMD
        this.setCmdId(gv.CMD.PLAYER_TUXI_MINI_GAME);
    },

    putData: function (chosen) {
        this.packHeader();
        this.putInt(chosen);
        this.updateSize();
    }
});