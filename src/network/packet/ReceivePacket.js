/**
 * Created by GSN on 8/6/2015.
 */

//Handshake
CmdReceiveHandshake = fr.InPacket.extend({
    ctor:function()
    {
        this._super();
    },
    readData:function(){
        this.token = this.getString();
    }
});

CmdReceiveLogin = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
    }
});

CmdReceiveOnClientDisconnected = fr.InPacket.extend({
    ctor: function(){
        this._super();
    },

    readData: function(){
        this.reason = this.getByte();
    },
});

CmdReceiveGetPlayerData = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.uid = this.getInt();
        this.userName = this.getString();
        this.displayName = this.getString();
        this.gold = parseInt(this.getLong());
        this.xu = parseInt(this.getLong());
        this.level = this.getInt();
        this.exp = this.getInt();
        this.vipLevel = this.getInt();
        this.vipDailyGiftClaimed = this.getByte()!=0;
        this.vipExpiredTime = parseInt(this.getLong());
        this.avatarUrl = this.getString();
        this.hasGame = this.getByte()!=0;
        this.timeToGachaFree = parseInt(this.getLong());
        this.serverTime = parseInt(this.getLong());
    }
});

CmdReceiveGetFriendListData = fr.InPacket.extend({
    ctor : function(){
        this._super();
        this.friends = [];
    },

    readData: function(){
        var len = this.getInt();
        for (var i=0; i<len; i++){
            var friendData = new FriendData();
            friendData.uid = this.getInt();
            friendData.displayName = this.getString();
            //friendData.goldEarnInWeek = parseInt(this.getLong());
            friendData.avatarUrl = this.getString();
            friendData.score = this.getInt();
            this.friends.push(friendData);
        }
    }
});

//cuong read data global rank CmdReceiveGetGlo
CmdReceiveGetGlo = fr.InPacket.extend({
    ctor : function(){
        this._super();
        this.rank = 0;
        this.globalUser = [];
    },

    readData: function(){
        this.rank = this.getInt();
        var len = this.getInt();
        //cc.log("CUONG             " + len + "            " + this.rank);
        for (var i=0; i<len; i++){
            var globalUserData = new FriendData();
            globalUserData.uid = this.getInt();
           // cc.log("CUONG             " + globalUserData.uid);
            globalUserData.displayName = this.getString();
            //cc.log("CUONG             " + globalUserData.displayName);
            globalUserData.avatarUrl = this.getString();
            globalUserData.score = this.getInt();
            //cc.log("CUONG             " + globalUserData.score);
            this.globalUser.push(globalUserData);
        }
    }
});

CmdReceiveMatchInfo = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.gameStatusObject = PacketUtil.getGameStatusObject(this);
    }
});

CmdReceivePlayerJoinGame = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.playerStatusObject = PacketUtil.getPlayerStatusObject(this);
    }
});

CmdReceivePlayerLeaveGame = fr.InPacket.extend({
    ctor: function(){
        this._super();
    },

    readData : function(){
        this.playerIndex = this.getInt();
    }
});

CmdReceiveMatchStart = fr.InPacket.extend({
    ctor:function()
    {
        this._super();
    },

    readData:function(){
        this.firstPlayerIndex = this.getInt();
    }
});

CmdReceiveCommonRollDice = fr.InPacket.extend({
    ctor:function()
    {
        this._super();
    },

    readData:function() {
        this.diceResult = new DiceResult();
        this.diceResult.score1 = this.getByte();
        this.diceResult.score2 = this.getByte();
    }
});

CmdReceiveFortuneRollDice = fr.InPacket.extend({
    ctor:function()
    {
        this._super();
    },

    readData:function() {
        this.diceResult = new DiceResult();
        this.diceResult.score1 = this.getInt();
        this.diceResult.score2 = this.getInt();
    }
});

CmdReceivePlayerResponseSkill = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.option = this.getInt();
    }
});

CmdReceiveNextTurn = fr.InPacket.extend({
    ctor:function()
    {
        this._super();
        this.playerIndex_cash = [];
    },

    readData : function(){
        this.playerIndex=this.getInt();
        this.focSkill = this.getInt();
        this.piecesState = this.getString();

        var numberPlayer = this.getInt();
        for (var i=0; i<numberPlayer; i++){
            var playerIndex = this.getInt();
            var cash = parseInt(this.getLong());
            this.playerIndex_cash[playerIndex] = cash;
        }
        this.skillRandomNCalled = this.getInt();
        this.canPayToSummon = this.getBool();
    }
});

CmdReceiveActivePiece = fr.InPacket.extend({
    ctor:function()
    {
        this._super();
    },

    readData:function(){
        this.pieceIndex = this.getInt();
        this.option = this.getInt();
        this.escapeFromJail = this.getByte()!=0;
    }
});

CmdReceiveEndGame = fr.InPacket.extend({
    ctor:function(){
        this._super();
        this.playerResultObject = [];
    },

    readData:function(){
        this.winnerID = this.getInt();
        var length = this.getInt();
        for (var i=0; i< length; i++){
            var index = this.getInt();
            var scoreChange = this.getInt();
            var bonusItemLength = this.getInt();
            if(bonusItemLength>0){
                for(var j =0;j<bonusItemLength;j++){
                    var itemId = this.getString();
                    var quantity = this.getLong();
                }
            }
        }
        this.winingType = this.getInt();
    }
});

CmdReceiveFocActive = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.isActive = this.getByte()? true : false;
        this.success = this.getByte()? true : false;
    }
});

CmdReceiveFocUseSkill = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.param = this.getInt();
    }
});

CmdReceiveGoldChange = fr.InPacket.extend({
    ctor : function(){
        this._super();
        this.changeGoldList = [];
    },

    readData : function(){
        var length = this.getInt();
        for (var i=0; i<length; i++){
            this.changeGoldList.push({
                playerIndex : this.getInt(),
                amountChange : Number(this.getLong()),
                amountAfter : Number(this.getLong())
            });
        }
    }
});

CmdReceiveSelectionMiniGame = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.playerStandPos = this.getInt();
        this.selection = this.getInt();
    },
});

CmdReceivePieceSkillActive = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.pieceId = this.getInt();
        this.skillID = this.getInt();
        this.targetDefenseMap = [];
        var numberElement = this.getInt();
        for(var i=0; i< numberElement; i++) {
            var position = this.getInt();
            var defended = this.getByte() != 0;
            this.targetDefenseMap.push({
                position: position,
                defended: defended
            });
        }
    }
});

CmdReceiveGetAllCharacter = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.mainCharUid = Number(this.getLong());
        this.listCharacter = [];
        var numberElement = this.getInt();
        for(var i=0; i< numberElement; i++)
            this.listCharacter.push(PacketUtil.getCharacter(this));
    }
});

CmdReceiveDoGaCha = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.characterList = [];
        var numCharacter = this.getInt();
        for(var i=0; i< numCharacter; i++){
            this.characterList.push(PacketUtil.getCharacter(this));
        }

    }
});

CmdReceiveCheatCharacter = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.character = PacketUtil.getCharacter(this);
    },
});

CmdReceiveUpgradeCharacter = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.charUID = Number(this.getLong());
        this.id = this.getString();
        this.charClass = this.getInt();
        this.newLevel = this.getInt();
        this.newExp = Number(this.getLong());

    }
});

CmdReceiveSellCharacter = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.goldReceived = Number(this.getLong());
    }
});

CmdReceiveEventData = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.eventDataMap=[];

        var numberRecord = this.getInt();
        for(var i=0; i< numberRecord; i++){
            var eventID = this.getInt();
            var eventData = {};
            switch(eventID){
                case EventType.FIRST_PAYING:
                    eventData.isFirstPayingSMSClaimed = this.getByte()!=0;
                    eventData.isFirstPayingCardClaimed = this.getByte()!=0;
                    break;
                case EventType.CONTINUOUS_LOGIN:
                    eventData.dayCanCheck = this.getInt();
                    eventData.isChecked = this.getByte()!=0;
                    break;
                case EventType.INVITE_FRIEND:
                    eventData.numberInvitedFriend = this.getInt();
                    eventData.numberInvitedFriendToday = this.getInt();
                    eventData.invitedFriendClaimedMap = [];
                    var numberInviteMileStone = this.getInt();
                    for(var numberInvite = 0; numberInvite< numberInviteMileStone; numberInvite++){
                        var giftId = this.getInt();
                        var received = this.getByte()!=0;
                        eventData.invitedFriendClaimedMap[giftId] = received;
                    }

                    break;
                case EventType.PAYING_ACCUMULATE:
                    eventData.totalGross = Number(this.getLong());
                    eventData.payingMileStoneMap = [];
                    var numberPayingMileStone = this.getInt();
                    for(var numberPaying=0; numberPaying < numberPayingMileStone; numberPaying++){
                        var mileStone = this.getInt();
                        var received = this.getByte()!=0;
                        eventData.payingMileStoneMap[mileStone] = received;
                    }
                    break;
                case EventType.SELFIE_CHARACTER:
                    eventData.numberClaimed = this.getInt();
                    eventData.lastTimeSelfie = parseInt(this.getLong());
                    break;
            }

            this.eventDataMap[eventID] = eventData;
        }
    }
});

CmdReceiveGetGlobalRank = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.rankElements = [];
        var numberElement = this.getInt();
        for(var i=0; i< numberElement; i++){
            this.rankElements.push(PacketUtil.getRankElement(this));
        }
    }
});

CmdReceiveGetMailData = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.mailList = [];
        var numberElement = this.getInt();
        for(var i=0; i< numberElement; i++){
            this.mailList.push(PacketUtil.getMailData(this));
        }
    }
});

CmdReceiveMailItem = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.gameItem={};
        this.gameItem.itemID = this.getString();
        this.gameItem.quantity = Number(this.getLong());
        if(this.gameItem.itemID.substring(0, 5) == "CHEST"){
            this.characterList = [];
            var numberChar = this.getInt();
            for(var i=0; i< numberChar; i++){
                this.characterList.push(PacketUtil.getCharacter(this));
            }
        }
    }
});

CmdReceiveUpdateMailData = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
        this.mailList = [];
        var numberElement = this.getInt();
        for (var i = 0; i < numberElement; i++) {
            this.mailList.push(PacketUtil.getMailData(this));
        }
    }
});

CmdReceiveEmptyPacket = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
    }
});

CmdReceiveGetAllDice = fr.InPacket.extend({
    ctor : function(){
        this._super();
    },

    readData : function(){
        this.mainDice = this.getString().split("_")[1];
        this.numberDice = this.getInt();
        this.diceList = [];
        for(var i = 0; i < this.numberDice; i++)
        {
            this.diceList.push(this.getString().split("_")[1]);
        }
    },
});

CmdReceivePaymentUpdate = fr.InPacket.extend({

    ctor: function(){
        this._super();

        this.SMS = 0;
        this.MCARD = 1;
        this.ZCARD = 2;
        this.ATM = 3;
    },

    readData: function(){
        this.providerID = this.getInt();
        this.paymentChannel = this.getInt();
        this.paymentItem = this.getInt();
        this.amount = parseInt(this.getLong());
        this.grossAmount = parseInt(this.getLong());
        this.other = this.getString();
        this.vipSuccess = this.getByte()!=0;
    },
});

//cuong nhan goi tin
CmdReceiveChat = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.playerIndex = this.getInt();
        this.iconIndex = parseInt(this.getString());
        //this.providerID = this.getInt();
        //this.paymentChannel = this.getInt();
        //this.paymentItem = this.getInt();
        //this.amount = parseInt(this.getLong());
        //this.grossAmount = parseInt(this.getLong());
        //this.other = this.getString();
    },
});

// CUONG nhan goi tin minigame
CmdReceiveClickMinigame2 = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.CurrentClick = this.getInt();
        this.resultSever = this.getInt();
    },
});

CmdReceivePlayerControlCell = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.cellPos = this.getInt();
    }
});

CmdReceivePlayerPayToSummon = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.hasPaying = this.getBool();
        this.pieceIndex = this.getInt();
        this.payFee = Number(this.getLong());
    }
});


CmdReceiveAutoPlay = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.playerIndex = this.getInt();
        this.autoOn = this.getBool();
    },
});

CmdReceiveCheatActiveSkill = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.playerIndex = this.getInt();
        this.isOn = this.getBool();
    },
});

CmdReceiveRollDiceEven = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.score = this.getInt();
        //cc.log("CUONG " + this.score);
    },
});

CmdReceiveGetSpecialEvenData = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        var size = this.getInt();
        cc.log("size " +size);
        var caseSever = this.getInt();
        cc.log("caseSever  " +caseSever);
        var numberAttemptToday = this.getInt();
        cc.log("numberAttemptToday " + numberAttemptToday);
        var currentRound = this.getInt();
        var roundBonusRate = this.getInt();
        cc.log("CUONG " + caseSever + "    " + numberAttemptToday + "   " + currentRound + "    " + roundBonusRate);
        this.sankhobauStatus = new SanKhoBauStatus(caseSever,new TreasureHunting(numberAttemptToday,currentRound,roundBonusRate));

        //this.score = this.getInt();
        //cc.log("CUONG " + this.score);
    },
});


CmdReceiveMiniGameTuXi = fr.InPacket.extend({

    ctor: function(){
        this._super();
    },

    readData: function(){
        this.playerStandPos = this.getInt();
        this.selection = this.getInt();
    },
});
//
//CmdReceiveControlCell = fr.InPacket.extend({
//
//    ctor: function(){
//        this._super();
//    },
//
//    readData: function(){
//        this.globalIndex = this.getInt();
//        //var test = this.getInt();
//        cc.log("CUONG GET GLOBALINDEX   " + this.globalIndex);
//        //this.playerStandPos = this.getInt();
//        //this.selection = this.getInt();
//    },
//});


