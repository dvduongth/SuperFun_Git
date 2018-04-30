var constant_minigame_tuxi = {
    DAM : 1,
    KEO: 2,
    LA: 3,
    CLOCK:"res/game/MiniGame2/clock.png",
    MAX_TIME : 10,
    MY_INDEX : 0
};
var MinigameTuXiMgr = cc.Class.extend({

    ctor : function(){
        this.resetMiniGame();
    },

    resetMiniGame : function(){
        this.callback = null; // call back
        this.miniGameHostIndex = -1; // host index
        this.selectionList = [];
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        for(var i = 0; i < playerList.length; i++){
            this.selectionList[i] = -1;
        }
        this.moneyPay = 0;
        this.numberChoosen = 0;
        this.reconnectData = null;
        this.joinList = [];//Danh sach cac indexplayer tham gia vao minigame
    },

    canPlayMinigame:function(playerIndex){
        var betId = gv.matchMng.gameStatusObject.betLevelID;
        var money =  GameModeConfig.getInstance().getMiniGameTuXiMoneyBetLevel(betId);

        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        var lengthPlayerList = playerList.length;
        for(var i=0;i<playerList.length;i++){
            if(i!= this.miniGameHostIndex){
                //if (playerList[i].lose){
                //    lengthPlayerList--;
                //}
            }else{
                lengthPlayerList--;
            }
        }

        var list = [];

        for (var i =0;i<playerList.length;i++){
            var player = playerList[i];
            //cc.log("player.playerStatus.gold " + player.playerStatus.gold);
            if (i!= this.miniGameHostIndex){
                if(player.playerStatus.gold >= money*lengthPlayerList){
                    list.push(i);
                }
            }
        }

        if(list.length == 0) return false;
        var host = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);

        return !(host.playerStatus.gold < (money* list.length));
        //if(host.playerStatus.gold < (money* list.length)){
        //    return false;
        //}
        //return true;
    },

    onEnterMiniGame :function(playerIndex, callBack){
        cc.log("GO ON MINIGAME tuxi");
        this.resetMiniGame();
        this.callback = callBack;
        this.miniGameHostIndex = playerIndex;

        //Khoi tao muc tien thang thua
        var betId = gv.matchMng.gameStatusObject.betLevelID;
        //todo load config money o day
        this.moneyPay =  GameModeConfig.getInstance().getMiniGameTuXiMoneyBetLevel(betId);

        //check money condition
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        var lengthPlayerList = playerList.length;
        for(var i=0;i<playerList.length;i++){
            if(i!= this.miniGameHostIndex){
                //if (playerList[i].lose){
                //    lengthPlayerList--;
                //}
            }else{
                lengthPlayerList--;
            }
        }
        //cc.log("lengthPlayerList " + lengthPlayerList  + "   moneyPay  " + this.moneyPay);
        // bug
        for (var i =0;i<playerList.length;i++){
            var player = playerList[i];
            //cc.log("player.playerStatus.gold " + player.playerStatus.gold);
            if (i!= this.miniGameHostIndex){
                if(player.playerStatus.gold >= this.moneyPay*lengthPlayerList){
                    this.joinList.push(i);
                }
            }
        }

        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        if(this.joinList.length == 0){
            //Thong bao khong du nguoi choi
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_NOT_ENOUGH_PLAYER);
            cc.log("ko du nguoi tham gia minigame tuxi");
            this.callback();
            return;
        }

        var host = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.miniGameHostIndex);
        if(host.playerStatus.gold < (this.moneyPay * this.joinList.length)){
            //Bubble ko du tien
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_NOT_ENOUGH_MONEY);
            cc.log("show bubble host khong du tien");
            this.callback();
            return;
        }else{//nguoi choi chinh du tien
            cc.log("joinlist host: " + this.miniGameHostIndex + ", gold = " + host.playerStatus.gold + ", require gold = " + (this.moneyPay * this.joinList.length));
            this.joinList.push(this.miniGameHostIndex);
        }

        // nguoi choi khong du tien thi khong thuc hien hanh dong gi nua
        if(this.joinList.indexOf(constant_minigame_tuxi.MY_INDEX) < 0) {
            //Nguoi tham gia minigame ko du tien
            //Thong bao "ko du tien", bubble nguoi choi khac dang choi minigame
            cc.log("ban than minh khong du tien");
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_WAIT_PLAY_MINIGAME);

            var notiPopup = new PopupNotification(fr.Localization.text("minigame_not_enough_money"));
            gv.guiMgr.addGui(notiPopup, GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
            notiPopup.runAction(cc.sequence(
                cc.delayTime(3.0),
                cc.callFunc(function () {
                    notiPopup.destroy();
                }.bind(this))));

            // sua cho nay!!
            this.callback();
            return;
        }

        //Open gui
        //todo Open gui o day, can code lai
        var guiMiniGame = new GuiMiniGameTuXi();
        gv.guiMgr.addGui(guiMiniGame, GuiId.MINI_GAME_TUXI, LayerId.LAYER_GUI);
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    //update lua chon cua cac nguoi choi trong ban
    updateSelectionList : function(standPosGlobal, selection){
        cc.log("minigame Tuxi-->updateSelectionList");
        cc.log("player global " + standPosGlobal + " select: " + selection);
        //if(this.joinList.indexOf(constant_minigame_tuxi.MY_INDEX) < 0){
        //    gv.gameClient._clientListener.dispatchPacketInQueue();
        //    return;
        //}
        this.numberChoosen++;
        var mapper = gv.matchMng.mapper;
        var standPos = mapper.convertGlobalToLocalStandPos(standPosGlobal);
        var playerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(standPos);
        if(playerIndex == constant_minigame_tuxi.MY_INDEX){// neu minh khong co lua chon thi khong nhay vao day
            var guiMiniGameTuXi = gv.guiMgr.getGuiById(GuiId.MINI_GAME_TUXI);
            guiMiniGameTuXi.finishChosenPlayer();
        }
        this.selectionList[playerIndex] = selection;
        cc.log("player local: " + standPos + ", select: " + selection);

        if(this.isAlreadyUpdate()&&this.joinList.indexOf(constant_minigame_tuxi.MY_INDEX) >= 0){// minh phai co lua chon thi moi show
            //todo show ket qua
            var guiMiniGameTuXi = gv.guiMgr.getGuiById(GuiId.MINI_GAME_TUXI);
            guiMiniGameTuXi.finishAllChosen();
        }

        cc.log("updateSelectionList-->number playing: " + this.joinList.length);
        if(this.numberChoosen <  this.joinList.length){
            cc.log("updateSelectionList-->numberChoosen: " + this.numberChoosen);
            gv.gameClient._clientListener.dispatchPacketInQueue();
        }
        else if(this.numberChoosen == this.joinList.length){ // nguoi choi khong du tien thi callback lai game
            if(this.joinList.indexOf(constant_minigame_tuxi.MY_INDEX) < 0){
                //Nguoi tham gia minigame ko du tien phai dung cho nguoi choi khac play minigame
                //Goi exit de callback tro lai game
                this.onExitMiniGame();
            }
        }
    },

    calculateGoldUpdateForAllPlayer:function(listSelection){
        var listWinlose = this.calculateWinLoseForAllPlayer(listSelection);
        for(var i=0;i<listWinlose.length;i++){
            if(i!=this.miniGameHostIndex){
                if(listWinlose[i] > 0){// thang nay thang tien, can phai bom 1 it cho host, dang mac dinh la 20%
                    ChangeGoldMgr.getInstance().addChangeGoldElement(i, this.moneyPay*listWinlose[i]*(0.9));
                    ChangeGoldMgr.getInstance().addChangeGoldElement(this.miniGameHostIndex, this.moneyPay*listWinlose[i]*(0.1));
                }

                if(listWinlose[i]<0){// thua thi tru tien
                    ChangeGoldMgr.getInstance().addChangeGoldElement(i, this.moneyPay*listWinlose[i]);
                }
            }else{
                if(listWinlose[i]!=0){
                    ChangeGoldMgr.getInstance().addChangeGoldElement(i, this.moneyPay*listWinlose[i]);
                }
            }
        }
    },

    calculateWinLose:function(result1,result2){
        //dam = 1
        //keo = 2
        // la = 3
        if(result1 <1 || result2 <1){
            return 0;
        }
        if(result1 == result2){
            return 0;
        }
        if(result1 +1 == result2){
            return 1;
        }
        if(result1 -2 == result2){
            return 1;
        }
        return -1;
    },

    calculateWinLoseForAllPlayer:function(listSelection){
        var calculateWinLose = [];
        for(var i=0;i<listSelection.length;i++){
            calculateWinLose[i] = 0;
        }
        for (var i =0;i<listSelection.length;i++){
            var playerSelection = listSelection[i];
            if(playerSelection == -1) continue;
            for (var j =i+1;j<listSelection.length;j++ ){
                var competitorPlayer = listSelection[j];
                if(competitorPlayer == -1) continue;
                var winlose = this.calculateWinLose(playerSelection,competitorPlayer);
                calculateWinLose[i] += winlose;
                calculateWinLose[j] -= winlose;
            }
        }
        return calculateWinLose;
    },

    //= true neu tat ca nguoi choi da chon xong
    isAlreadyUpdate : function() {
        for(var i = 0;i<this.joinList.length;i++){
            var index = this.joinList[i];
            if(this.selectionList[index] == -1){
                return false;
            }
        }
        return true;
    },

    //reconnect data
    reconnect: function (data) {
        // vao minigame
        this.onEnterMiniGame(gv.matchMng.currTurnPlayerIndex,  function() {
            var pieceOnMiniGame = gv.matchMng.mapper.getSpecialTile(TileType.TILE_MINI_GAME).getPieceHolding();
            gv.matchMng.onPieceActionMoveFinish(pieceOnMiniGame);
        });
        //read reconnect
        this.reconnectData = [];
        var mapper = gv.matchMng.mapper;
        cc.log("Reconnect data :)");
        for(var i =0;i<data.length;i++){
            cc.log("Data update");
            if(data[i] !=0)            {
                var standPos = mapper.convertGlobalToLocalStandPos(i);
                var playerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(standPos);
                this.reconnectData[playerIndex] = data[i];
                if(playerIndex != constant_minigame_tuxi.MY_INDEX) {
                    this.updateSelectionList(i, data[i]);
                    cc.log("Data update " + i);
                }
                else{
                    this.numberChoosen++;
                }
            }
        }
    },

    onExitMiniGame :function(){
        cc.log("onExit minigame tuxi");
        this.calculateGoldUpdateForAllPlayer(this.selectionList);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.NONE);
        this.callback();
        this.resetMiniGame();
    }
});