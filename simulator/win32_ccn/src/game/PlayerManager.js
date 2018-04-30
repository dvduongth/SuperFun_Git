/**
 * Created by GSN on 1/29/2016.
 */

var PlayerManager = cc.Class.extend({
    playerIndex_PlayerInfo : [],
    mineGlobalStandPos : 0,
    inited : false,
    standPos_playerIndex : [],

    ctor : function(){
        this.playerIndex_PlayerInfo = [];
        this.standPos_playerIndex = [];
        this.mineGlobalStandPos = 0;
        this.inited = false;
    },

    //set gia tri vi tri ngoi cua minh tren server
    init : function(matchInfo){
        for(var i=0; i< matchInfo.listPlayerStatus.length; i++){
            if(matchInfo.listPlayerStatus[i].uID == UserData.getInstance().uid){
                this.mineGlobalStandPos = matchInfo.listPlayerStatus[i].index;
                break;
            }
        }
        this.inited = true;
    },

    //quay vong danh sach nguoi choi den khi nao minh dung o vi tri dau tien
    preProcessPlayerList : function(playerStatusList){
        playerStatusList.sort(function(a, b){return a.index - b.index});
        while(playerStatusList[0].index != this.mineGlobalStandPos){
            var temp = playerStatusList.shift();
            playerStatusList.push(temp);
        }

        return playerStatusList;
    },

    setPlayerForMatch : function(playerStatusList){

        playerStatusList = this.preProcessPlayerList(playerStatusList);

        for(var i=0; i< playerStatusList.length; i++){
            var playerInfo = new Player();
            playerInfo.playerStatus = playerStatusList[i];
            playerInfo.playerIndex = i;
            playerInfo.standPos = gv.matchMng.mapper.convertGlobalToLocalStandPos(playerStatusList[i].index);
            playerInfo.playerColor = playerInfo.playerStatus.index;

            this.playerIndex_PlayerInfo[i] = playerInfo;
            this.standPos_playerIndex[playerInfo.standPos] = i;
        }

        var guiPlayerPosition = new GuiPlayerPosition();
        gv.guiMgr.addGui(guiPlayerPosition, GuiId.PLAYER_POSITION, LayerId.LAYER_GUI);
    },

    getPlayerInfoByPlayerIndex : function(playerIndex){
        var xxx = this.playerIndex_PlayerInfo[playerIndex];
        if(xxx == undefined || xxx == null){
            //cc.log("getPlayerInfoByPlayerIndex: chet cmnr: playerIndex = " + playerIndex);
            return null;
        }
        return xxx;
    },

    getPlayerInfoByStandPos : function(standPos){
        var playerIndex = this.getPlayerIndexAtStandPos(standPos);
        return this.getPlayerInfoByPlayerIndex(playerIndex);
    },

    getStandPosOfPlayer : function(playerIndex){
        var playerInfo = this.getPlayerInfoByPlayerIndex(playerIndex);
        if(playerInfo == undefined){
            cc.log("chet cmnr, playerIndex = " + playerIndex);
        }
        return playerInfo.standPos;
    },

    getPlayerIndexAtStandPos : function(standPos){
        return this.standPos_playerIndex[standPos];
        //var xxx = this.standPos_playerIndex[standPos];
        ////cc.log("getPlayerIndexAtStandPos: "+standPos+"-----------"+xxx);
        //return xxx;
    },

    getGoldIndexOfPlayer: function(playerStandPos){
        var result = 1;
        var goldList = [];
        cc.log("getGoldIndexOfPlayer: playerStandpos = " + playerStandPos);
        var gold = this.getPlayerInfoByStandPos(playerStandPos).playerStatus.gold;
        for (var i=0; i<this.getNumberPlayer(); i++){
            var curPlayerGold = this.getPlayerInfoByPlayerIndex(i).playerStatus.gold;
            if ((goldList.indexOf(curPlayerGold)==-1) &&(gold<curPlayerGold)){
                goldList.push(curPlayerGold);
                result++;
            }
        }
        return result;
    },

    getMineGlobalStandPos : function(){
        return this.mineGlobalStandPos;
    },

    getNumberPlayer : function(){
        return this.playerIndex_PlayerInfo.length;
    },

    getNumberPlayingPlayer : function(){
        var number = this.playerIndex_PlayerInfo.length;
        for (var i = 0; i < this.playerIndex_PlayerInfo.length; i++){
            var player = this.playerIndex_PlayerInfo[i];
            if(player.lose == true){
                number--;
            }
        }
        //cc.log("NumberPlayingPlayer = " + number);
        return number;
    },

    //update luong gold cua player
    //amountChanged la luong thay doi
    //amountAfter la gia tri sau thay doi tren server, chi dung de debug
    updateGoldOfPlayer : function(localStandPos, amountChanged){
        var playerStatus = null;
        if(!gv.matchMng.playing){
            playerStatus = gv.matchMng.restRoom.getPlayerStatusAtStandPos(localStandPos);
        }
        else{
            var playerInfo = this.getPlayerInfoByStandPos(localStandPos);
            playerStatus = playerInfo.playerStatus;
        }
        playerStatus.gold += amountChanged;


        ////doan nay chi co tac dung kiem tra mat dong bo
        //DebugUtil.log("CHANGE GOLD. playerLocal: "+localStandPos+ " PlayerServer: "+globalStandPos+" Amount: "+amountChanged+" After Changed: "+playerInfo.playerStatus.gold, true);
        //if(playerStatus.gold != amountAfter){
        //    DebugUtil.log("GOLD CONFLICT. client: "+playerStatus.gold+" Server: "+amountAfter);
        //    var stringLog = DebugUtil.getTrackLog();
        //    gv.gameClient.sendTrackLog(stringLog);
        //
        //    return;
        //}
    },

    setPlayerLose : function(standPos){

        DebugUtil.log("BANKRUPT. player: "+ standPos, true);

        var playerInfo = this.getPlayerInfoByStandPos(standPos);
        cc.assert(playerInfo!=null, "setPlayerLose. playerInfo null. standPos: "+standPos);
        playerInfo.lose = true;

        var playerInfoPanel = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).getPlayerInfoPanelByStandPos(standPos);
        playerInfoPanel.setOpacity(155);

        gv.matchMng.mainBoard.returnAllPieceOfPlayerToHome(playerInfo.playerIndex);
        gv.matchMng.mainBoard.setVisibleDestinationNumber(playerInfo.playerIndex, false);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showBankruptAtHome(standPos);
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).addBankruptToPlayer(playerInfo);
    },

    checkPlayerWin: function() {
        //kiem tra tung thang player, neu tat ca cac player khac deu lose thi player nay win
        for (var i=0; i<this.getNumberPlayer(); i++){
            var curPlayer = this.getPlayerInfoByPlayerIndex(i);
            var result = true;
            for (var j=0; j<this.getNumberPlayer(); j++) {
                if ((j != i) && (!this.getPlayerInfoByPlayerIndex(j).lose)){
                    result = false;
                    break;
                }
            }
            curPlayer.win = result;
        }
    },

    //lay cac thong tin ve piece cua player duoi dang string, chi dung de debug
    dumpPieceInformationOfAllPlayers : function(){
        var resultString = "";
        for(var gStandIndex = 0; gStandIndex < MAX_NUMBER_PLAYER; gStandIndex++){
            var localStandPos = gv.matchMng.mapper.convertGlobalToLocalStandPos(gStandIndex);
            var playerInfo = this.getPlayerInfoByStandPos(localStandPos);
            if(playerInfo != undefined && playerInfo != null)
                resultString += (playerInfo.getServerSideString());
        }

        return resultString;
    }
});