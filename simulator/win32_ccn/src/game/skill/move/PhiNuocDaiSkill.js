/**
 * Created by user on 24/11/2016.
 */

//skill Phi Nuoc Dai
var PhiNuocDaiSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.PHI_NUOC_DAI;
    },

    beginAttack : function(){
        if(gv.matchMng.isMineTurn()){  // co phai turn cua toi hay khong?
            if (this.chooseAbleList.length>=2){
                var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                gameGui.preparingHighLightScreen(HighLightType.OPACITY_HIGHLIGHT);
                //gameGui.letPlayerChoosePiece(InteractType.SELECT, this.chooseAbleList, true, this.onPlayerSelectedPieceToMove.bind(this));

                for (var i=0; i<this.chooseAbleList.length; i++){
                    var piece = this.chooseAbleList[i];
                    var targetTile =  this.targetTileList[i];
                    targetTile.setEnableHintStone(true, this.onPlayerSelectedPieceToMove.bind(this, piece));
                }
                var myStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(this.target.playerIndex);
                gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(myStandPos, GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION), this.onPlayerSelectedPieceToMove.bind(this));
            }
        }
        else{// khong phai turn cua toi thi cho waiting action
            cc.log("show bubble wait piece Action");
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.WAIT_PIECE_ACTION);
        }
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    // sau khi chon piece de di chuyen thi gui goi tin len sever
    onPlayerSelectedPieceToMove : function(piece){
        if (piece == undefined){
            //lua chon piece gan chuong nhat de di chuyen
            var pieceList = gv.matchMng.mainBoard.boardData.getPieceListSortedByNearestHome(this.target.playerIndex);
            for (var i=pieceList.length-1; i>=0; i--){
                if (this.chooseAbleList.indexOf(pieceList[i])){
                    piece = pieceList[i];
                    DebugUtil.log("Phi nuoc dai: No piece was chosen, random piece: " + piece.getString());
                    break;
                }
            }
        }

        // cai nay phai goi mapper chu? mapper
        var targetSlot = gv.matchMng.mapper.convertLocalToGlobalSlotIndex(GameUtil.addSlot(piece.currSlot, this.expectedRange, piece.playerIndex));
        //var targetSlot = gv.matchMng.mainBoard.boardData.convertLocalToGlobalSlotIndex(GameUtil.addSlot(piece.currSlot, this.expectedRange, piece.playerIndex));

        gv.gameClient.sendActivePiece(piece.pieceIndex, targetSlot);

        //disable hint stone
        for (var i=0; i<this.targetTileList.length; i++){
            this.targetTileList[i].setEnableHintStone(false);
        }
    },

    onResponseSkillResult: function(pieceIndex, option){
        cc.log("Phi nuoc dai: onResponseSkillResult");
        var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.target.playerIndex, pieceIndex);
        gv.matchMng.skillManager.skillDataInTurn[piece.playerIndex].activePiece = piece;

        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainBoardGui.clearHighLightScreen();

        //disable hint stone
        for (var i=0; i<this.targetTileList.length; i++){
            this.targetTileList[i].setEnableHintStone(false);
        }

        //hien thi effect o piece active skill
        this.castSkill(piece);

        //hien thi effect diem den
        var desSlot = GameUtil.addSlot(piece.currSlot, this.expectedRange, piece.playerIndex);
        var destinationTile = gv.matchMng.mapper.getTileForSlot(desSlot);
        destinationTile.setEnableDestinationPoint(true);

        //Di chuyen phi nuoc dai
        GameUtil.callFunctionWithDelay(1.2, function(){
            this.startPhiNuocDai(piece, this.expectedRange);
        }.bind(this));
    },

    castSkill : function(piece){
        var castSkill = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_di_chuyen, this);
        castSkill.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkill.setPosition(piece.pieceDisplay.getPosition());
        castSkill.setCompleteListener(function(){
            castSkill.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkill, MainBoardZOrder.EFFECT);

        fr.Sound.playSoundEffect(resSound.skill_superspeed);
    },

    startPhiNuocDai: function(piece, expectedRange){
        var actionArr = [];
        var curSlot = piece.currSlot;
        for (var i=0; i<expectedRange; i++){
            var nextSlot = GameUtil.addSlot(curSlot, 1, piece.playerIndex);
            var nextTile = gv.matchMng.mapper.getTileForSlot(nextSlot);
            actionArr.push(cc.moveTo(0.05, nextTile.getStandingPositionOnTile()));
            actionArr.push(cc.callFunc(function(direction){
                piece.pieceDisplay.updateDirection(direction);
            }.bind(this, nextTile.direction)));
            curSlot = nextSlot;
        }
        var destinationTile = gv.matchMng.mapper.getTileForSlot(curSlot);
        actionArr.push(cc.callFunc(function(){
            gv.matchMng.mainBoard.boardData.putPieceToSlot(piece, curSlot);
            piece.pieceDisplay.pieceShadow.setEnable(false);
            this.onSkillFinished();
            destinationTile.setEnableDestinationPoint(false);
        }.bind(this)));
        piece.pieceDisplay.pieceShadow.setEnable(true);
        piece.pieceDisplay.runAction(cc.sequence(actionArr));

        fr.Sound.playSoundEffect(resSound.skill_phinuocdai_loop);

    },

    checkActiveAbility: function(player){
        this.chooseAbleList = [];
        this.targetTileList = [];

        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        this.expectedRange = (diceResult.score1 + diceResult.score2)*2;
        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(player.playerIndex, pieceIndex);
            if (piece.isCanMovingOnBoard() && !piece.isStandingOnHisDesinationGate()){
                this.calculateMoveSolutionForPiece(piece);
            }
        }
        return (this.chooseAbleList.length>0);
    },

    calculateMoveSolutionForPiece : function(piece) {
        var desSlot = GameUtil.addSlot(piece.currSlot, this.expectedRange, piece.playerIndex);
        var desTile = gv.matchMng.mapper.getTileForSlot(desSlot);
        var desPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(desSlot);

        if(desTile!=null && desPiece==null){
            if(!desTile.tileUp){
                this.chooseAbleList.push(piece);
                this.targetTileList.push(desTile);
            }
        }
    },

});