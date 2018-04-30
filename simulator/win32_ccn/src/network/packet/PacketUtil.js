/**
 * Created by GSN on 3/9/2016.
 */
var PacketUtil = PacketUtil || {};

PacketUtil.getCharacter = function(inpacket){
    var retCharacter = new CharacterData();
    retCharacter.uid = Number(inpacket.getLong());
    retCharacter.id = inpacket.getString();
    retCharacter.clazz = inpacket.getInt();
    retCharacter.level = inpacket.getInt();
    retCharacter.currExp = Number(inpacket.getLong());
    var numSkill = inpacket.getInt();
    for(var i=0; i< numSkill; i++){
        retCharacter.skillList.push(inpacket.getInt());
    }

    return retCharacter;
};

PacketUtil.getPlayerStatusObject = function(inpacket){
    var playerStatusObj = new PlayerStatus();
    playerStatusObj.uID = inpacket.getInt();
    playerStatusObj.name = inpacket.getString();
    playerStatusObj.avatarUrl = inpacket.getString();
    playerStatusObj.index = inpacket.getInt();
    playerStatusObj.playerState = inpacket.getInt();
    playerStatusObj.gold = Number(inpacket.getLong());

    //var numberPos = inpacket.getInt();
    //for(var i=0; i< numberPos; i++){
    //    playerStatusObj.piecePosList.push(inpacket.getInt());
    //}
    playerStatusObj.mainCharacter = this.getCharacter(inpacket);
    playerStatusObj.mainDice = inpacket.getString();
    playerStatusObj.totalBeKicked = inpacket.getInt();

    //playerStatusObj.lengtListPieceFreeze = inpacket.getInt();

    //for (var i =0;i<playerStatusObj.lengtListPieceFreeze;i++){
    //    var pieceIndex = inpacket.getInt();
    //    playerStatusObj.pieceFreeze.push(pieceIndex);
    //}
    playerStatusObj.nTurnNotMoving = inpacket.getInt();
    playerStatusObj.pieceFreeze = [];
    playerStatusObj.piecePosList = [];
    //playerStatusObj.pieceStatus = [];
    playerStatusObj.remainTurnInJail = 0;
    var lengthPieceStatus = inpacket.getInt();
    for(var i=0;i<lengthPieceStatus;i++){
        //todo code vao day
        var pos = inpacket.getInt();
        var isFreeze =  inpacket.getByte()!=0;
        var remainTurnInJail = inpacket.getInt();

        playerStatusObj.piecePosList.push(pos);
        if(isFreeze){
            playerStatusObj.pieceFreeze.push(i);
        }
        if(remainTurnInJail>0){
            playerStatusObj.remainTurnInJail = remainTurnInJail;
        }
    }

    return playerStatusObj;
};

PacketUtil.getGameStatusObject = function(inpacket){
    var gameStatusObj = {};
    gameStatusObj.roomID = inpacket.getInt();
    gameStatusObj.name = inpacket.getString();
    gameStatusObj.isStart = inpacket.getByte();
    gameStatusObj.skillRandomSeed = inpacket.getInt();
    gameStatusObj.skillRandomNCalled = inpacket.getInt();
    gameStatusObj.listPlayerStatus = [];
    var numberPlayer = inpacket.getInt();
    for(var i=0; i< numberPlayer; i++){
        gameStatusObj.listPlayerStatus.push(this.getPlayerStatusObject(inpacket));
    }
    gameStatusObj.firstPlayerIndex = inpacket.getInt();
    gameStatusObj.curPlayerIndex = inpacket.getInt();
    gameStatusObj.curPlayerTimeOut = inpacket.getInt();
    gameStatusObj.lastDiceResult = new DiceResult();
    gameStatusObj.lastDiceResult.score1 = inpacket.getByte();
    gameStatusObj.lastDiceResult.score2 = inpacket.getByte();
    gameStatusObj.nDoubleValue = inpacket.getInt();
    gameStatusObj.modeID = inpacket.getInt();
    gameStatusObj.isBotMode = inpacket.getByte()!=0;
    gameStatusObj.betLevelID = inpacket.getString();

    gameStatusObj.cellStatus = [];
    var tileNumber = inpacket.getInt();
    for (var i=0; i<tileNumber; i++){
        gameStatusObj.cellStatus[i] = new TileStatus();
        gameStatusObj.cellStatus[i].hasIceTrap = inpacket.getByte()!=0;
        gameStatusObj.cellStatus[i].isRaised = inpacket.getByte()!=0;
        gameStatusObj.cellStatus[i].cellType = inpacket.getInt();
        gameStatusObj.cellStatus[i].cellParam = {};
        switch (gameStatusObj.cellStatus[i].cellType){
            case 1: //START
                gameStatusObj.cellStatus[i].cellParam.lightOwnerIndex = inpacket.getInt();
                break;
            case 2: //COMMON
                break;
            case 3: //GATE/TAX
                gameStatusObj.cellStatus[i].cellParam.multiplyRate = inpacket.getInt();
                break;
            case 4: //SPECIAL
                gameStatusObj.cellStatus[i].cellParam.specialTypeOrdinal = inpacket.getInt();
                break;
            case 5: //BOM
                gameStatusObj.cellStatus[i].cellParam.bomRemainTurn = inpacket.getInt();
                gameStatusObj.cellStatus[i].cellParam.bomOwnerIndex = inpacket.getInt();
                break;
        }
    }

    gameStatusObj.gameState = inpacket.getInt();

    switch (gameStatusObj.gameState){
        case GameState.TUXI_MINI_GAME:
            //cc.log("Read data");
            gameStatusObj.params = [];
            var numElement = inpacket.getInt();
            for(var i=0; i< numElement; i++){
                var globalStanPos = inpacket.getInt();
                var selection = inpacket.getInt();
                gameStatusObj.params[globalStanPos] = selection;
            }
            //cc.log("gameStatusObj.params " + gameStatusObj.params.length);
            break;
        case GameState.RACE_MINI_GAME:
            gameStatusObj.selectionMap = [];
            var numElement = inpacket.getInt();
            for(var i=0; i< numElement; i++){
                var globalStanPos = inpacket.getInt();
                var selection = inpacket.getInt();
                gameStatusObj.selectionMap[globalStanPos] = selection;
            }
            break;
        case GameState.PLAYER_IN_SKILL:
            gameStatusObj.pieceInSkillIndex = inpacket.getInt();
            gameStatusObj.skillId = inpacket.getInt();
            break;
    }
    gameStatusObj.firstLoad1 = inpacket.getByte()!=0;
    gameStatusObj.firstLoad4 = inpacket.getByte()!=0;
    gameStatusObj.currentTurn = inpacket.getInt();
    gameStatusObj.currentTime = inpacket.getInt();
    return gameStatusObj;
};

PacketUtil.getMailData = function(inpacket){
    var mailData = new MailData();
    mailData.uid = Number(inpacket.getLong());
    mailData.itemID = inpacket.getString();
    mailData.quantity = Number(inpacket.getLong());
    mailData.subject = inpacket.getString();
    mailData.content = inpacket.getString();
    mailData.expired = Number(inpacket.getLong());

    return mailData;
};

PacketUtil.getRankElement = function(inpacket){
    var rankElement = new RankElement();
    rankElement.uid = inpacket.getInt();
    rankElement.displayName = inpacket.getString();
    rankElement.goldEarnInWeek = Number(inpacket.getLong());
    rankElement.level = inpacket.getInt();
    rankElement.avatarURL = inpacket.getString();

    return rankElement;
};
