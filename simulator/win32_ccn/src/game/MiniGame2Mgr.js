/**
 * Created by GSN on 7/19/2016.
 */
var MiniGame2Mgr = cc.Class.extend({
    callback:null,//Fucntion
    miniGameHostIndex:null,//Number index.
    minGold:0,// so tien toi thieu

    ctor : function(){
        this.resetMiniGame();
    },

    resetMiniGame : function()
    {
        this.callback = null;
        this.miniGameHostIndex = -1;
        this.minGold = 0;
    },
    onEnterMiniGame :function(playerIndex, callBack) {
        cc.log("GO ON MINIGAME 2");
        this.resetMiniGame();
        this.callback = callBack;
        this.miniGameHostIndex = playerIndex;
        // load config
        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        this.minGold = GameModeConfig.getInstance().getMinigame2Bet(betLevel);

        var host = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.miniGameHostIndex);
        if(host.playerStatus.gold <this.minGold){
            var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            guiMainBoard.showWaitingBubble(BubbleType.BUBBLE_NOT_ENOUGH_MONEY);
            cc.log("show bubble host khong du tien");
            this.callback();
            return;
        }
        cc.log("DU TIEN VAO MINIGAME2");
        var guiMiniGame2 = new GuiMiniGame2(this.minGold,playerIndex,host.playerStatus.gold);
        gv.guiMgr.addGui(guiMiniGame2, GuiId.MINI_GAME_2, LayerId.LAYER_GUI);
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    //reconnect data
    reconnect: function (data) {
        // vao minigame

        cc.log("Reconnect minigame 2");
        this.onEnterMiniGame(gv.matchMng.currTurnPlayerIndex,  function() {
            var pieceOnMiniGame = gv.matchMng.mapper.getSpecialTile(TileType.TILE_MINI_GAME_1).getPieceHolding();
            gv.matchMng.onPieceActionMoveFinish(pieceOnMiniGame);
        });

        // khoi tao cac doi tuong
        //count : so lan choi
        //so tien dat cuoc
        // Player nao choi
        var currentLevel = data.currentLevel;
        var currentBet = data.currentBet;
        gv.guiMgr.getGuiById(GuiId.MINI_GAME_2).Reconnect_Data(currentLevel,currentBet);
    },

    onExitMiniGame :function(money){
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.NONE);
        ChangeGoldMgr.getInstance().addChangeGoldElement(this.miniGameHostIndex,money);
        this.callback();
        cc.log("onExitMiniGame2");
        this.resetMiniGame();
        cc.log("exit minigame2");
    }

});

// minigame tuxi:)
