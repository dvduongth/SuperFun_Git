/**
 * Created by CPU11674-local on 10/28/2016.
 */

var MY_INDEX = 0;
var TAX_PERCENT = 0.1;


var HorseRaceGameMgr = cc.Class.extend({
    callback:null,//Fucntion
    selectionList: [],//Array
    //Chu phong, co khi minh ko phai la chu phong nhe
    miniGameHostIndex:null,//Number
    moneyPay: null,//Number
    numberChoosen: null,//Number
    reconnectData: null,//Object
    joinList: [],//Array - Danh sach cac indexplayer tham gia vao minigame
    winner: null,//Number


    ctor : function(){
        this.resetGame();

        //fake
        if(FAKE){
            this.callback = null;
            this.miniGameHostIndex = 0;
            this.isFinishMyOption = true;
            this.numberChoosen = 5;
            this.reconnectData = null;
            this.selectionList = [-1, 1, 2, 1];
            this.joinList = [0, 1 , 2, 3];
            this.winner = -1;
        }
    },

    resetGame : function()
    {
        this.callback = null;
        this.miniGameHostIndex = -1;
        this.isFinishMyOption = false;
        this.moneyPay = 100;
        this.numberChoosen = 0;
        this.reconnectData = null;
        if(gv.matchMng.playerManager){
            var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
            for(var i = 0; i < playerList.length; i++){
                this.selectionList[i] = -1;
            }
        }
        this.joinList = [];
    },

    onEnterGame :function(playerIndex, callBack) {
        cc.log("onEnter horseInfo race");
        this.resetGame();
        this.callback = callBack;
        this.miniGameHostIndex = playerIndex;


        //Khoi tao muc tien thang thua
        var betId = gv.matchMng.gameStatusObject.betLevelID;
        this.moneyPay = GameModeConfig.getInstance().getRaceMoneyByBetLevel(betId);


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
            cc.log("ko du nguoi tham gia horseInfo race");
            this.callback();

            return;
        }

        var host = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.miniGameHostIndex);
        if(host.playerStatus.gold < this.moneyPay){
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

        this.joinList.sort(function(a, b){return (a - b)});


        for(var i = 0;i<this.joinList.length;i++){
            cc.log("joinlist " + i + "  = " + this.joinList[i]);
        }
        //chon ngua chien thang
        var win = Math.floor(Math.random() * this.joinList.length);
        if(!FAKE) win = GameGenerator.getInstance().random.randomInt(0, this.joinList.length);
        cc.log("win in server = " + win);
        var mapper = gv.matchMng.mapper;
        var count = 0;
        for(var globalStanPos = 0; globalStanPos < MAX_NUMBER_PLAYER; globalStanPos++){
            var localIndex = mapper.convertGlobalStandPosToLocalIndex(globalStanPos);
            cc.log("localIndex = " + localIndex);
            if(this.joinList.indexOf(localIndex) >-1){
                cc.log("count join = " + count);
                if(count == win){
                    this.winner = localIndex;
                    break;
                }
                count++;
            }
        }

        cc.log("winner in onEnter game = " + this.winner);

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
        var guiMiniGame = new GuiHorseRaceGame();
        gv.guiMgr.addGui(guiMiniGame, GuiId.HORSE_RACE_GAME, LayerId.LAYER_GUI);

        gv.gameClient._clientListener.dispatchPacketInQueue();
    },


    //Ket noi lai trong truong hop bi out giua chung
    reconnect: function (data) {
        this.onEnterGame(gv.matchMng.currTurnPlayerIndex,  function() {
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

    //update lua chon cua cac nguoi choi trong ban
    updateSelectionList : function(standPosGlobal, selection){
        cc.log("horseRaceGameMgr-->updateSelectionList");
        cc.log("player global " + standPosGlobal + " select: " + selection);
        this.numberChoosen++;
        var mapper = gv.matchMng.mapper;
        var standPos = mapper.convertGlobalToLocalStandPos(standPosGlobal);
        var playerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(standPos);
        if(playerIndex == MY_INDEX){
            var guiHorseRace = gv.guiMgr.getGuiById(GuiId.HORSE_RACE_GAME);
            guiHorseRace.chooseBet = selection;
            guiHorseRace.onFinishChooseHorse(guiHorseRace.chooseBet);
        }
        this.selectionList[playerIndex] = selection;
        cc.log("player local: " + standPos + ", select: " + selection);

        if(this.isAlreadyUpdate()){
            var guiHorseRace = gv.guiMgr.getGuiById(GuiId.HORSE_RACE_GAME);
            if(guiHorseRace)
            {
                guiHorseRace.warmUpRun();
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
                this.onExitGame();
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


    //Tinh xem tien bonus cho Host
    calculateHostBonus: function(){
        var t = 0;
        for(var i = 0; i < this.joinList.length; i++){
            var index = this.joinList[i];
            var money = this.moneyPay * this.selectionList[index];
            if(index == this.winner) continue;
            t += money*TAX_PERCENT;
        }
        return t;
    },


    onExitGame :function(){
        cc.log("onExit horseInfo race");

        //Update tien
        var tax = 0;
        for(var i = 0; i < this.joinList.length; i++){
            var index = this.joinList[i];
            var money = this.moneyPay * this.selectionList[index];
            if(index == this.winner)
            {
                ChangeGoldMgr.getInstance().addChangeGoldElement(index, (1 - TAX_PERCENT)*money);
            }
            else{
                ChangeGoldMgr.getInstance().addChangeGoldElement(index, -money);
                tax += money*TAX_PERCENT;
            }
        }

        //Cong thue cho host
        cc.log("add tax for host: " + tax);
        ChangeGoldMgr.getInstance().addChangeGoldElement(this.miniGameHostIndex, tax);

        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.NONE);
        this.callback();

        this.resetGame();
    }
});