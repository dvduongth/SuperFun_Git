var TileUpMgr = cc.Node.extend({

    ctor : function(){
        this._super();
        this.listHintPath = [];
        this.callback = null;
        this.currentTime = 0;
    },

    actionTileUp:function(piece,callback){
        cc.log("actionTileUp   ");
        if(callback!=null){
            this.callback = callback;
        }else{
            this.callback = function(){gv.matchMng.onPieceActionMoveFinish(piece);}.bind(this);
        }

        var callbackInProgressBar = null;
        if(gv.matchMng.currTurnPlayerIndex == 0){// turn cua minh thi moi thuc hine chu ^^
            callbackInProgressBar = function(){
                gv.gameClient.sendPacketControlSell(-1);
            }.bind(this);
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).setHighLightAllTile(false);
            var tileIndex = piece.currSlot;
            var number = Math.floor(tileIndex/10);
            for(var i = number*10;i<number*10+10;i++) {
                var tile = gv.matchMng.mapper.getTileForSlot(i);

                //hintPath.tileList.push(currTile);
                if(!tile.getPieceHolding()&&!tile.tileUp){
                    tile.highLight();
                    this.listHintPath.push(tile);
                    tile.setEnableHintStone(true,function(){
                        this.display.sendPacket();
                    }.bind(tile));
                }
            }
        }
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece.playerIndex).standPos,
            gv.matchMng.currTurnPlayerIndex == 0?GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION):TimeoutConfig.TIMEOUT_ACTION,
            callbackInProgressBar
        );
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    disableHintStone:function(){
        for(var i =0;i<this.listHintPath.length;i++){
            this.listHintPath[i].setEnableHintStone(false, null);
        }
        if(gv.matchMng.currTurnPlayerIndex == 0){
            this.currentTime = 0;
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).setHighLightAllTile(true);

        }
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).stopAllProgressBar();
        this.listHintPath = [];
    },

    // 0-9 :0
    //10 - 19: 1
    //20-29 : 2
    //30 - 39: 3
    resetTileUp:function(number){
        for(var i = number*10;i<number*10+10;i++){
            var tile = gv.matchMng.mapper.getTileForSlot(i);
            if(tile.tileUp){
                tile.display.resetTileUp();
            }
        }
    }

    //updateChosen:function(){
    //    cc.log("CUONG SCHEDULE UPDATE" + this.currentTime);
    //    this.currentTime++;
    //    var timeOut = GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION);
    //    if(this.currentTime>timeOut){
    //        this.currentTime = 0;
    //        gv.gameClient.sendPacketControlSell(-1);
    //        gv.gameClient._clientListener.dispatchPacketInQueue();
    //        this.unschedule(this.updateChosen)
    //    }
    //}

});