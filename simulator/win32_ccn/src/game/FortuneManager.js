/**
 * Created by GSN on 10/21/2015.
 */

var FortuneType = {
    JUMP_TO_NEXT_DESTINATION_GATE: 1,
    BACK_8_STEP: 2,
    SWAP_POSITION: 3,
    JUMP_TO_OPPONENT_HOME_GATE: 4,
    ALL_PIECE_JUMP_3_STEP: 5,
    ROLL_FORTUNE_AGAIN: 6,
};

var FortuneManager = cc.Class.extend({
    fortunePiece : null,
    mainBoard : null,
    numberPieceTeled : 0,
    teleportMng : null,
    chooseAbleList : [],
    callback : null,

    ctor : function(mainboard){
        this.mainBoard = mainboard;
        this.teleportMng = mainboard.teleportMgr;
        this.chooseAbleList = [];
        this.callback = null;
    },

    activeFortune : function(fortunePiece, callback){
        this.fortunePiece = fortunePiece;
        this.callback = callback;

        cc.log("------------>> ACTIVE FORTUNE <<---------------");

        var fortuneGui = new GuiActiveFortune(gv.matchMng.isMineTurn());
        gv.guiMgr.addGui(fortuneGui, GuiId.ACTIVE_FORTUNE, LayerId.LAYER_GUI);

        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    onFortuneDiceResult : function(number){
        switch (number){
            case FortuneType.JUMP_TO_NEXT_DESTINATION_GATE:
                cc.log("teleportPieceToNextDestinationGate. piece : " + this.fortunePiece.getString());
                //cuong luu vao history
                //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
                //var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.fortunePiece.playerIndex);
                //history.Add_Log_JumpToDestinationGate(playername) ;

                //
                this.teleportPieceToNextDestinationGate(this.fortunePiece);
                break;

            case FortuneType.BACK_8_STEP:
                cc.log("teleportPieceBackEightStep. piece: " + this.fortunePiece.getString());
                cc.log("teleportPieceToNextDestinationGate. piece : " + this.fortunePiece.getString());
                //cuong luu vao history
                //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
                //var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.fortunePiece.playerIndex);
                //history.Add_Log_Back8Step(playername) ;

                //
                this.teleportPieceBackEightStep(this.fortunePiece);
                break;

            case FortuneType.SWAP_POSITION:
                if(gv.matchMng.isMineTurn()){
                    cc.log("preSwapPieceWithOther. piece :" + this.fortunePiece.getString());
                    if(this.preSwapPieceWithOther(this.fortunePiece)){
                        gv.gameClient._clientListener.dispatchPacketInQueue();
                    }
                    else{
                        cc.log("No have enermy piece to swap");
                        EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){
                            gv.gameClient._clientListener.dispatchPacketInQueue();
                        });
                    }
                }
                else{
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.WAIT_PIECE_ACTION);
                    gv.gameClient._clientListener.dispatchPacketInQueue();
                }

                break;

            case FortuneType.JUMP_TO_OPPONENT_HOME_GATE:
                cc.log("teleportPieceToEnermyHomeGate. piece :" + this.fortunePiece.getString());
                this.teleportPieceToEnermyHomeGate(this.fortunePiece);
                break;

            case FortuneType.ALL_PIECE_JUMP_3_STEP:
                cc.log("teleportAllPieceUpThreeStep. playerIndex :" + this.fortunePiece.playerIndex);
                //cuong luu vao history
                //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
                //var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.fortunePiece.playerIndex);
                //history.Add_Log_All3Step(playername) ;

                //
                this.teleportAllPieceUpThreeStep(this.fortunePiece.playerIndex);
                break;

            case FortuneType.ROLL_FORTUNE_AGAIN:
                cc.log("letPlayerRollDiceAgain");
                gv.gameClient._clientListener.dispatchPacketInQueue();
                break;
        }
    },

    dispatchCallback : function(){
        if(this.callback!=undefined && this.callback!=null)
            this.callback();
    },

    teleportPieceToNextDestinationGate : function(piece){
        var desGateDistance = 10;
        var nextDesSlot = Math.floor(((piece.currSlot + desGateDistance) % NUMBER_SLOT_IN_BOARD)/desGateDistance)*desGateDistance -1;
        nextDesSlot = (nextDesSlot < 0? NUMBER_SLOT_IN_BOARD + nextDesSlot : nextDesSlot);
        var _this = this;

        this.teleportMng.tryTeleportPieceToSlot(piece, nextDesSlot, TeleType.TELE_INSTANT, function(success){
            if(!success){
                EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){
                    _this.dispatchCallback();
                });
            }
            else{
                _this.dispatchCallback();
            }
        })
    },

    teleportPieceBackEightStep : function(piece){
        var desSlot = piece.currSlot - 8;
        var _this = this;

        desSlot = desSlot < 0 ? (NUMBER_SLOT_IN_BOARD + desSlot) : desSlot;
        this.teleportMng.tryTeleportPieceToSlot(piece, desSlot, TeleType.TELE_INSTANT, function(success){
            if(!success){
                EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){
                    _this.dispatchCallback();
                });
            }
            else{
                _this.dispatchCallback();
            }
        });
    },

    preSwapPieceWithOther : function(piece){
        var canSwap = false;
        this.chooseAbleList = [];

        for(var enermyIndex=1; enermyIndex< gv.matchMng.playerManager.getNumberPlayer(); enermyIndex++){
            for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
                var currPiece = this.mainBoard.boardData.getPieceOfPlayer(enermyIndex, pieceIndex);
                if(currPiece.getState() == PieceState.MOVING_TO_DES){
                    canSwap = true;
                    this.chooseAbleList.push(currPiece);
                }
            }

        }

        if(this.chooseAbleList.length!=0){
            var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            gameGui.preparingHighLightScreen(HighLightType.BLACK_LAYER_HIGHLIGHT);
            gameGui.letPlayerChoosePiece(InteractType.SELECT, this.chooseAbleList, true, this.onPlayerSelectedPieceToSwap.bind(this));
            return true;
        }

        return false;

    },

    swapFortunePieceWithEnemyPiece : function(globalPos){
        cc.log("RECEIVE SWAP PIECE: "+globalPos);

        var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        gameGui.disablePlayerChoosePiece(this.chooseAbleList, HighLightType.BLACK_LAYER_HIGHLIGHT);
        gameGui.clearHighLightScreen();

        this.chooseAbleList = [];

        var _this = this;
        if(globalPos == -1){
            EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){
                _this.dispatchCallback();
            });
            return;
        }

        var swapPosition = gv.matchMng.mapper.convertGlobalToLocalSlotIndex(globalPos);

        var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);

        var _this = this;
        var piece1 = this.fortunePiece;
        var localSwapPos = swapPosition;
        var piece2 = this.mainBoard.boardData.getPieceAtSlot(localSwapPos);

        //cuong luu vao history
        //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
        //var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece1.playerIndex);
        //var playerTargetname = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece2.playerIndex);
        //history.Add_Log_SwapPlayer(playername,playerTargetname) ;

        //

        var display1 = piece1.pieceDisplay;
        var display2 = piece2.pieceDisplay;
        display1.setLocalZOrder(MainBoardZOrder.EFFECT);
        display2.setLocalZOrder(MainBoardZOrder.EFFECT);
        var moveAction1 = cc.moveTo(1.0, display2.getPosition());
        var moveAction2 = cc.moveTo(1.0, display1.getPosition());
        var finalCallback = cc.callFunc(function(){
            _this.mainBoard.boardData.swapPiece(piece1, piece2);
            _this.dispatchCallback();
        });

        gameGui.runAction(cc.sequence(
            cc.spawn(
                cc.targetedAction(display1, moveAction1),
                cc.targetedAction(display2, moveAction2)),
            finalCallback
        ));
    },

    onPlayerSelectedPieceToSwap : function(piece){
        gv.gameClient.sendFortuneSwapPiece(gv.matchMng.mapper.convertLocalToGlobalSlotIndex(piece.currSlot));
    },

    teleportPieceToEnermyHomeGate : function(piece){

        var enerMyStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex);
        var enermyHomeGate = gv.matchMng.mapper.getSummonSlotForStandPos(enerMyStandPos);
        var _this = this;

        this.teleportMng.tryTeleportPieceToSlot(piece, enermyHomeGate, TeleType.TELE_INSTANT, function(success){
            if(!success){
                EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){
                    _this.dispatchCallback();
                });
            }
            else{
                _this.dispatchCallback();
            }
        });
    },

    teleportAllPieceUpThreeStep : function(playerIndex){
        var playerData = this.mainBoard.boardData.getPlayerDataAtIndex(playerIndex);
        var pieceMoveableList = [];
        for(var i=0; i< playerData.pieceList.length; i++){
            if(playerData.pieceList[i].getState() == PieceState.MOVING_TO_DES)
                pieceMoveableList.push(playerData.pieceList[i]);
        }

        pieceMoveableList.sort(function(a, b){return a.currSlot < b.currSlot});
        var needBreak = this.teleportMng.canTeleport(pieceMoveableList[0], (pieceMoveableList[0].currSlot + 3) % NUMBER_SLOT_IN_BOARD);
        while(!needBreak){
            var temp = pieceMoveableList.shift();
            pieceMoveableList.push(temp);
            needBreak = this.teleportMng.canTeleport(pieceMoveableList[0], (pieceMoveableList[0].currSlot + 3) % NUMBER_SLOT_IN_BOARD);
        }


        var _this = this;
        _this.numberPieceTeled=0;
        for(var i=0; i< pieceMoveableList.length; i++){
            var currPiece = pieceMoveableList[i];
            var desSlot = (currPiece.currSlot + 3)%NUMBER_SLOT_IN_BOARD;
            _this.teleportMng.tryTeleportPieceToSlot(currPiece, desSlot, TeleType.TELE_INSTANT, function(success) {
                if (success) {
                    _this.numberPieceTeled++;
                }
            });
        }

        GameUtil.callFunctionWithDelay(6.0, function(){
            if(_this.numberPieceTeled ==0){
                EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){
                    _this.dispatchCallback();
                });
            }
            else{
                _this.dispatchCallback();
            }
        });

    }
});