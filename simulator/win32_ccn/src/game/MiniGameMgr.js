/**
 * Created by CPU11674-local on 2/25/2016.
 */


var MY_INDEX = 0;

var MiniGameMgr = cc.Class.extend({
    callback:null,//Fucntion
    selectionList: [],//Array
    //Chu phong, co khi minh ko phai la chu phong nhe
    miniGameHostIndex:null,//Number
    isFinishMyOption: null,//Boolean
    hostWinMoney: null,//Number
    hostLoseMoney: null,//Number
    numberChoosen: null,//Number
    reconnectData: null,//Object
    joinList: [],//Array - Danh sach cac indexplayer tham gia vao minigame


    ctor : function(){
        this.resetMiniGame();
    },

    resetMiniGame : function()
    {
        this.callback = null;
        this.miniGameHostIndex = -1;
        this.isFinishMyOption = false;
        this.numberChoosen = 0;
        this.reconnectData = null;
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        for(var i = 0; i < playerList.length; i++){
            this.selectionList[i] = -1;
        }
        this.joinList = [];
    },

    //Bat dau minigame
    onEnterMiniGame :function(playerIndex, callBack){


        cc.log("start minigame");
        this.resetMiniGame();
        this.callback = callBack;
        this.miniGameHostIndex = playerIndex;

        //Khoi tao muc tien thang thua
        var betId = gv.matchMng.gameStatusObject.betLevelID;
        this.moneyPay = GameModeConfig.getInstance().getMiniGameWinMoneyByBetLevel(betId);
        this.moneyPay = GameModeConfig.getInstance().getMiniGameLoseMoneyByBetLevel(betId);

        //check money condition
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        for(var i = 0; i < playerList.length; i++){
            var player = playerList[i];
            if(i != this.miniGameHostIndex){
                if(player.playerStatus.gold >= this.moneyPay){
                    this.joinList.push(i);
                    cc.log("joinlist: " + i + ", gold = " + player.playerStatus.gold + ", require gold = " + this.moneyPay);
                }
            }
        }

        if(this.joinList.length == 0){
            //Thong bao khong du nguoi choi
            var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_NOT_ENOUGH_PLAYER);
            cc.log("ko du nguoi tham gia minigame");
            this.callback();

            return;
        }

        var host = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.miniGameHostIndex);
        if(host.playerStatus.gold < (this.moneyPay * this.joinList.length)){
            //Buble ko du tien
            var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_NOT_ENOUGH_MONEY);
            cc.log("show bubble host khong du tien");
            this.callback();
            return;
        }
        else{//nguoi choi chinh du tien
            cc.log("joinlist host: " + this.miniGameHostIndex + ", gold = " + host.playerStatus.gold + ", require gold = " + (this.moneyPay * this.joinList.length));
            this.joinList.push(this.miniGameHostIndex);
        }

        if(this.joinList.indexOf(MY_INDEX) < 0){
            //Nguoi tham gia minigame ko du tien
            //Thong bao "ko du tien", bubble nguoi choi khac dang choi minigame
            cc.log("ban than minh khong du tien");
            var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_WAIT_PLAY_MINIGAME);

            var notiPopup = new PopupNotification(fr.Localization.text("minigame_not_enough_money"));
            gv.guiMgr.addGui(notiPopup, GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
            notiPopup.runAction(cc.sequence(
                cc.delayTime(3.0),
                cc.callFunc(function(){
                    notiPopup.destroy();
                }.bind(this))));

            // sua cho nay!!
            this.callback();
            return;
        }

        //Open gui
        var guiMiniGame = new GuiMiniGame();
        gv.guiMgr.addGui(guiMiniGame, GuiId.MINI_GAME, LayerId.LAYER_GUI);

        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    //update lua chon cua cac nguoi choi trong ban
    updateSelectionList : function(standPosGlobal, selection){
        cc.log("minigameMgr-->updateSelectionList");
        cc.log("player global " + standPosGlobal + " select: " + selection);
        this.numberChoosen++;
        var mapper = gv.matchMng.mapper;
        var standPos = mapper.convertGlobalToLocalStandPos(standPosGlobal);
        var playerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(standPos);
        this.selectionList[playerIndex] = selection;
        cc.log("player local: " + standPos + ", select: " + selection);
        if(this.isFinishMyOption === true){
            var guiMiniGame = gv.guiMgr.getGuiById(GuiId.MINI_GAME);
            if(MY_INDEX != this.miniGameHostIndex)
            {
                guiMiniGame.showHostSelection();
            }
            else{
                guiMiniGame.moveMyOptionBackAvatar();
            }
        }
        cc.log("updateSelectionList-->number playing: " + this.joinList.length);
        if(this.numberChoosen <  this.joinList.length){
            cc.log("updateSelectionList-->numberChoosen: " + this.numberChoosen);
            gv.gameClient._clientListener.dispatchPacketInQueue();
        }
        else if(this.numberChoosen == this.joinList.length){
            if(this.joinList.indexOf(MY_INDEX) < 0){
                //Nguoi tham gia minigame ko du tien phai dung cho nguoi choi khac play minigame
                //Goi exit de callback tro lai game
                this.onExitMiniGame();
            }
        }
    },

    //Ket noi lai trong truong hop bi out giua chung
    reconnect: function (data) {
        this.onEnterMiniGame(gv.matchMng.currTurnPlayerIndex,  function() {
            var pieceOnMiniGame = gv.matchMng.mapper.getSpecialTile(TileType.TILE_MINI_GAME).getPieceHolding();
            gv.matchMng.onPieceActionMoveFinish(pieceOnMiniGame);
        });

        this.reconnectData = [];
        var mapper = gv.matchMng.mapper;
        for(var i in data){
            if(data[i] != 0)
            {
                var standPos = mapper.convertGlobalToLocalStandPos(i);
                var playerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(standPos);
                this.reconnectData[playerIndex] = data[i];
                if(playerIndex != MY_INDEX) {
                    this.updateSelectionList(i, data[i]);
                }
                else{
                    this.numberChoosen++;
                }
            }
        }
    },

    //= true neu tat ca nguoi choi da chon xong
    isAlreadyUpdate : function() {
        for(var i in this.joinList){
            var index = this.joinList[i];
            if(this.selectionList[index] == -1){
                return false;
            }
        }
        return true;
    },

    //Tinh xem tong tien host phai tra hoac nhan la bao nhieu
    calculateHostMoney: function(){
        var t = 0;
        //for(var i = 0; i < this.selectionList.length; i++){
        for(var i = 0; i < this.joinList.length; i++){
            var index = this.joinList[i];
            if(index == this.miniGameHostIndex || this.selectionList[index] == -1) continue;

            if(this.selectionList[index] == this.selectionList[this.miniGameHostIndex])
            {
                t -= this.moneyPay;
            }
            else{
                t += this.moneyPay;
            }
        }
        return t;
    },

    //Tinh tien cac truong hop thang thua cho host
    //Return 1 array 2 chieu [i][j], chieu i la so truong hop, chieu j the hien so nguoi doan dung sai, value > 0 la host thang, value < 0 la host thua
    calculateMoneyCaseForHost: function(){
        var arr = [];
        //var numberPlayer = gv.matchMng.playerManager.playerIndex_PlayerInfo.length;
        var numberPlayer = this.joinList.length;
        for(var i = 0; i < numberPlayer; i++){
            var arrTemp = [];
            for(var j = 0; j < numberPlayer - 1; j++){
                if(j < numberPlayer - 1 - i){
                    arrTemp[j] = this.moneyPay;
                }
                else{
                    arrTemp[j] = -this.moneyPay;
                }
            }
            arr[i] = arrTemp;
        }
        return arr;
    },


    //Thoat khoi minigame
    onExitMiniGame :function(){
        cc.log("onExitMiniGame");

        //Update tien
        for(var i = 0; i < this.joinList.length; i++){
            var index = this.joinList[i];
            if(index == this.miniGameHostIndex) continue;
            if(this.selectionList[index] == this.selectionList[this.miniGameHostIndex])
            {
                ChangeGoldMgr.getInstance().addChangeGoldElement(this.miniGameHostIndex, -this.moneyPay);
                ChangeGoldMgr.getInstance().addChangeGoldElement(index, this.moneyPay);
            }
            else{
                ChangeGoldMgr.getInstance().addChangeGoldElement(this.miniGameHostIndex, this.moneyPay);
                ChangeGoldMgr.getInstance().addChangeGoldElement(index, -this.moneyPay);
            }

        }
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.NONE);
        this.callback();

        this.resetMiniGame();
    }
})