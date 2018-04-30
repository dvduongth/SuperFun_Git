/**
 * Created by user on 30/7/2016.
 */

var ChangeGoldType = {
    FIRST_LOAD_1: 1,
    FIRST_LOAD_4: 2
};
var Object_Kick_Horse = cc.Class.extend({
    playerKickIndex:-1,
    playerTargetKick:-1,
    changeMoney:-1,
    ctor:function(playerKickIndex,playerTargetKick,changeMoney){
        this.playerKickIndex =playerKickIndex;
        this.playerTargetKick = playerTargetKick;
        this.changeMoney = changeMoney;
    },
});

var Object_Kick_In_Turn = cc.Class.extend({
    ctor:function(pieceKick,pieceTarget){
        this.pieceKick =pieceKick;
        this.pieceTarget = pieceTarget;
    },
});

var ChangeGoldMgr = cc.Class.extend({

    ctor: function(){
        this.changeGoldList = [];

        this.isFirstLoad4 = false;
        //this.playerFirstLoad4 = -1;
        this.listGoldKickHorseHoe = [];
        this.listKickInTurn = [];
        this.testGold = null;
    },

    cleanActiveSkillLoad:function(){
        this.isFirstLoad4 = false;
        //this.playerFirstLoad4 = -1;
        this.listGoldKickHorseHoe = [];
        this.listKickInTurn = [];
    },

    addListKickInList:function(pieceKick,pieceTarget){
        this.listKickInTurn.push(new Object_Kick_In_Turn(pieceKick,pieceTarget))
    },

    activeFreeFirstKick:function(){
        var isActive = false;
        while(this.listKickInTurn.length>0){
            var objectKickInTurn = this.listKickInTurn[0];
            this.listKickInTurn.splice(0,1);

            var playerTarget = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(objectKickInTurn.pieceTarget.playerIndex);
            playerTarget.playerStatus.totalBeKicked++;
            //cc.log("CUONG   " + playerTarget.playerStatus.totalBeKicked);

            var skillEnable = false;
            if (playerTarget.playerStatus.totalBeKicked == 1){
                skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_FIRST_BE_KICKED, objectKickInTurn.pieceTarget.playerIndex, -1);
            }
            if (!skillEnable){
                ChangeGoldMgr.getInstance().addChangeGoldByKick(objectKickInTurn.pieceKick, objectKickInTurn.pieceTarget);
            }else{
                isActive = true;
            }
        }
        return isActive;
    },

    // active skill mua tien
    addChangeGoldByRainGold:function(playerIndex){
        var value = GameUtil.getValueSkillInfo(PieceSkill.RAIN_GOLD,playerIndex);
        var gold =gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerStatus.gold ;
        for(var i =0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
            if(i!=playerIndex){
                var valueChange = Math.floor(gold*value);
                ChangeGoldMgr.getInstance().addChangeGoldElement(playerIndex,valueChange);
                ChangeGoldMgr.getInstance().addChangeGoldElement(i,-valueChange);
            }
        }

    },

    //active skill mong ngua vang
    addChangeGoldByHorseHoeGold:function(playerIndex){
        //for(var i =0;i<this.listGoldKick.length;i++){
        //var valueChange = value-1;
        var value = GameUtil.getValueSkillInfo(PieceSkill.HORSE_HOE_GOLD,playerIndex)-1;
        var listPlayer = [];
        for(var playerIndex1=0; playerIndex1 < gv.matchMng.playerManager.getNumberPlayer(); playerIndex1++){
            listPlayer[playerIndex1] = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex1).playerStatus.gold;
        }
        while(this.listGoldKickHorseHoe.length>0){
            var changeGold = this.listGoldKickHorseHoe[0].changeMoney*value;
            //var playerTargetGold = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.listGoldKick[0].playerTargetKick).playerStatus.gold;
            changeGold = Math.min(changeGold,listPlayer[this.listGoldKickHorseHoe[0].playerTargetKick]);
            listPlayer[this.listGoldKickHorseHoe[0].playerTargetKick] -= changeGold;
            this.addChangeGoldElement(this.listGoldKickHorseHoe[0].playerKickIndex,changeGold);
            this.addChangeGoldElement(this.listGoldKickHorseHoe[0].playerTargetKick,-changeGold);
            this.listGoldKickHorseHoe.splice(0,1);
        }
    },

    // active skill mo vang
    addChangeGoldByGoldMine:function(playerIndex,value){
        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        var numberPlayer = gv.matchMng.playerManager.getNumberPlayer();
        var receiveMoney = 0;
        for (var i=0; i<numberPlayer; i++){
            if (i!=playerIndex){
                var curEnemy = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                if ((this.getAvailableMoneyOfPlayer(curEnemy) > 0) && (!curEnemy.lose)){
                    var curEnemy = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                    var payMoney = Math.min(GameModeConfig.getInstance().getFirstLoad4MoneyByBetLevel(betLevel), Math.floor(this.getAvailableMoneyOfPlayer(curEnemy)))*value;
                    this.addChangeGoldElement(i, -payMoney);
                    receiveMoney+=payMoney;
                }
            }
        }
        this.addChangeGoldElement(playerIndex, receiveMoney) ;
    },
    //chi add tung pieceTarget bi kick, ko add ca targetList vi nhu the trong truong targetList chua 2,3 piece cung loai thi so lan da (totalBeKicked)
    // cua nhung con piece nay se giong nhau, nhung thuc te la phai tang dan theo tung con piece
    addChangeGoldByKick: function(pieceKick, pieceTarget){
        var playerKick = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(pieceKick.playerIndex);
        var playerTarget = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(pieceTarget.playerIndex);
        var changeMoney = Math.min(GameModeConfig.getInstance().getKickFeeByBetLevel(gv.matchMng.gameStatusObject.betLevelID, playerTarget.playerStatus.totalBeKicked), this.getAvailableMoneyOfPlayer(playerTarget));
        this.addChangeGoldElement(playerTarget.playerIndex, -changeMoney);
        this.addChangeGoldElement(playerKick.playerIndex, changeMoney);
        if(playerKick.playerIndex == gv.matchMng.currTurnPlayerIndex){ // thang da phai trong turn cua no
            this.listGoldKickHorseHoe.push(new Object_Kick_Horse(playerKick.playerIndex,playerTarget.playerIndex,changeMoney));
        }
    },


    addChangeGoldByFirstLoad: function(firstLoadType, playerIndex){
        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var numberPlayer = gv.matchMng.playerManager.getNumberPlayer();
        var numberPlayingNumber = gv.matchMng.playerManager.getNumberPlayingPlayer();

        switch (firstLoadType){
            case ChangeGoldType.FIRST_LOAD_1:
                var receiveMoney = Math.min(GameModeConfig.getInstance().getFirstLoad1MoneyByBetLevel(betLevel),Math.floor(this.getAvailableMoneyOfPlayer(player)/(numberPlayingNumber-1)));
                for (var i=0; i<numberPlayer; i++){
                    if (i!=playerIndex) {
                        var curEnemy = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                        if ((this.getAvailableMoneyOfPlayer(curEnemy) > 0) && (!curEnemy.lose)) {
                            this.addChangeGoldElement(i, receiveMoney);
                        }
                    }
                }
                var payMoney = Math.min(GameModeConfig.getInstance().getFirstLoad1MoneyByBetLevel(betLevel)*(numberPlayingNumber-1), Math.floor(this.getAvailableMoneyOfPlayer(player)));
                this.addChangeGoldElement(playerIndex, -payMoney) ;
                break;
            case ChangeGoldType.FIRST_LOAD_4:
                var receiveMoney = 0;
                for (var i=0; i<numberPlayer; i++){
                    if (i!=playerIndex){
                        var curEnemy = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                        if ((this.getAvailableMoneyOfPlayer(curEnemy) > 0) && (!curEnemy.lose)){
                            var curEnemy = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                            var payMoney = Math.min(GameModeConfig.getInstance().getFirstLoad4MoneyByBetLevel(betLevel), Math.floor(this.getAvailableMoneyOfPlayer(curEnemy)));
                            this.addChangeGoldElement(i, -payMoney);
                            receiveMoney+=payMoney;
                        }
                    }
                }
                this.isFirstLoad4 = true;
                this.addChangeGoldElement(playerIndex, receiveMoney) ;
                break;
        }
    },

    addChangeGoldElement: function(playerIndex, amountChange){
        cc.log("ChangeGoldMgr: addChangeGoldElement: playerIndex = " + playerIndex + ", amountChange = " + amountChange);

        for (var i=0; i<this.changeGoldList.length; i++){
            if (this.changeGoldList[i].playerIndex == playerIndex){
                this.changeGoldList[i].amountChange+=amountChange;
                return;
            }
        }
        this.changeGoldList.push({
            playerIndex: playerIndex,
            amountChange: amountChange,
        });
    },

    getAvailableMoneyOfPlayer: function(player){
        var changedMoney = 0;
        for (var i=0; i<this.changeGoldList.length; i++){
            if (this.changeGoldList[i].playerIndex == player.playerIndex){
                changedMoney = this.changeGoldList[i].amountChange;
            }
        }
        return (player.playerStatus.gold+changedMoney);
    },

    clearChangeGoldList: function(){
        this.changeGoldList = [];
    },

    activeChangeGoldInfo: function(callback){
        var isActive = this.activeFreeFirstKick();
        cc.log("activeChangeGoldInfo");
        if (this.changeGoldList.length == 0){
            if(isActive){
                GameUtil.callFunctionWithDelay(2,function(){
                    callback();
                }.bind(this));
            }else{
                callback();
            }
            return;
        }

        //cuong effect tien moi
                //

        for (var i=0; i<this.changeGoldList.length; i++){
            var changeGold = this.changeGoldList[i];
            var standPos = gv.matchMng.playerManager.getStandPosOfPlayer(changeGold.playerIndex);
            gv.matchMng.playerManager.updateGoldOfPlayer(standPos, changeGold.amountChange);
        }
        gv.matchMng.checkPlayerBankRupt();


        var callbackFunction = function(){
            this.clearChangeGoldList();
            this.testGold.setVisible(false);
            this.testGold.resetList();
            callback();
        }.bind(this);

        this.testGold.calculateListInAndOut(this.changeGoldList);
        this.testGold.actionStandPosPlayer(callbackFunction);
        this.testGold.setVisible(true);
        fr.Sound.playSoundEffect(resSound.g_take_money);

        GameUtil.callFunctionWithDelay(TimeoutConfig.GOLD_CHANGE_TIME_ACTION, callbackFunction);
    }
});

ChangeGoldMgr.getInstance = function(){
    if (!this._instance){
        this._instance = new ChangeGoldMgr();
    }
    return this._instance;
};