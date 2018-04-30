/**
 * Created by user on 3/12/2016.
 */

//skill Hoan Doi
var HoanDoiSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.HOAN_DOI;

        this.activePiece = null;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_di_chuyen, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.activePiece.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    // bat dau thuc hien skill, cung extend tu ham base active skill
    beginAttack : function(){
        gv.matchMng.skillManager.skillDataInTurn[this.activePiece.playerIndex].activePiece = this.activePiece;
        this.target.playerStatus.nTurnNotMoving = 0;

        if(gv.matchMng.isMineTurn()){  // co phai turn cua toi hay khong?
            var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            gameGui.preparingHighLightScreen(HighLightType.OPACITY_HIGHLIGHT);
            gameGui.letPlayerChoosePiece(InteractType.SELECT, this.chooseAbleList, true, this.onPlayerSelectedPieceToSwap.bind(this));
        }
        else{// khong phai turn cua toi thi cho waiting action
            cc.log("show bubble wait piece Action");
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.WAIT_PIECE_ACTION);
        }
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    checkActiveAbility: function(player){
        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        if (diceResult.score1 + diceResult.score2 >= 6) return false;

        this.activePiece = null;
        var pieceList = gv.matchMng.mainBoard.boardData.getPieceListSortedByNearestHome(player.playerIndex);
        for (var i=0; i<pieceList.length; i++){
            if (pieceList[i].isCanMovingOnBoard()){
                this.activePiece = pieceList[i];
                break;
            }
        }
        //ko tim duoc piece nao de hoan doi
        if (this.activePiece == null) return false;

        this.chooseAbleList = [];
        // chon cac piece co the swap vao trong list
        for(var enemyIndex=0; enemyIndex< gv.matchMng.playerManager.getNumberPlayer(); enemyIndex++){
            if (enemyIndex != this.activePiece.playerIndex){
                for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
                    var currPiece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(enemyIndex, pieceIndex);
                    if(currPiece.isCanMovingOnBoard()){
                        this.chooseAbleList.push(currPiece);
                    }
                }
            }
        }
        //ko tim duoc doi thu de hoan doi
        return !(this.chooseAbleList.length == 0);
        //if (this.chooseAbleList.length == 0) return false;
        //return true;
    },

    // sau khi sever tra ve thi thuc hien action nay :)
    onResponseSkillResult : function(pieceIndex, globalPos){
        var swapPosition = gv.matchMng.mapper.convertGlobalToLocalSlotIndex(globalPos);
        DebugUtil.log("swap " + this.activePiece.getString() + " <--> " + swapPosition);

        var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        gameGui.disablePlayerChoosePiece(this.chooseAbleList, HighLightType.BLACK_LAYER_HIGHLIGHT);
        gameGui.clearHighLightScreen();

        var piece1 = this.activePiece;
        //var localSwapPos = swapPosition;
        var piece2 = gv.matchMng.mainBoard.boardData.getPieceAtSlot(swapPosition);

        //cuong luu vao history
        //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
        //var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece1.playerIndex);
        //var playerTargetInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece2.playerIndex);
        //history.Add_Log_SwapPlayer(playerInfo,playerTargetInfo) ;
        //

        var display1 = piece1.pieceDisplay;
        var display2 = piece2.pieceDisplay;
        display1.setLocalZOrder(MainBoardZOrder.EFFECT);
        display2.setLocalZOrder(MainBoardZOrder.EFFECT);
        var moveAction1 = cc.moveTo(1.0, display2.getPosition());
        var moveAction2 = cc.moveTo(1.0, display1.getPosition());

        gameGui.runAction(cc.sequence(
            cc.spawn(
                cc.targetedAction(display1, moveAction1),
                cc.targetedAction(display2, moveAction2)
            ),
            cc.callFunc(function(){
                gv.matchMng.mainBoard.boardData.swapPiece(piece1, piece2);
                //var piece2TileStanding = gv.matchMng.mapper.getTileForSlot(piece2.currSlot);
                //if ((piece2TileStanding.type == TileType.TILE_BOM) && (piece2TileStanding.bomOwnerIndex!=piece2.playerIndex)) {
                //    gv.matchMng.bomMgr.onActiveBom(piece2TileStanding, piece2);
                //}
                this.onSkillFinished();
            }.bind(this))
        ));
        fr.Sound.playSoundEffect(resSound.skill_changeup);
    },

    // sau khi chon piece de swap thi gui goi tin len sever
    onPlayerSelectedPieceToSwap : function(piece){
        if (piece == undefined){
            piece = this.chooseAbleList[MathUtil.randomBetweenFloor(0, this.chooseAbleList.length)];
            DebugUtil.log("HoanDoiSkill: No piece was chosen, random piece: " + piece.getString());
        }
        var globalSlotIndex = gv.matchMng.mapper.convertLocalToGlobalSlotIndex(piece.currSlot);
        gv.gameClient.sendActivePiece(this.activePiece.pieceIndex, globalSlotIndex);
    },

    reconnect: function(piece, skillCallback){
        this._super(piece, skillCallback);
        if (this.checkActiveAbility(piece)){
            var randomPieceIndex = MathUtil.randomBetween(0, this.chooseAbleList.length-1);
            var randomPiece = this.chooseAbleList[randomPieceIndex];
            this.onPlayerSelectedPieceToSwap(randomPiece);
            gv.gameClient._clientListener.dispatchPacketInQueue();
        }
    },
});