/**
 * Created by user on 25/11/2016.
 */

//skill Than toc
var ThanTocSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.THAN_TOC;

        this.chooseAbleList = [];
        this.targetRangeList = [];
        this.totalSolution = 0;
        this.hintPathList = [];
    },

    generateHintPath : function(piece, range){
        var mapper = gv.matchMng.mapper;
        var logText = "GEN HINT PATH:  ";

        var retHintPath = new HintPath();
        retHintPath.pieceOwner = piece;
        retHintPath.hintType = HintPathType.NONE;
        retHintPath.tileList=[];

        retHintPath.hintType = HintPathType.NORMAL_MOVE;
        logText+= "hintType: NORMAL_MOVE  ";

        for(var i=1; i <= range; i++){
            var tileSlot = GameUtil.addSlot(piece.currSlot, i, piece.playerIndex);
            var currTile = mapper.getTileForSlot(tileSlot);
            retHintPath.tileList.push(currTile);

            logText+= (tileSlot + " ");
        }

        //cc.log(logText);
        cc.assert(retHintPath!=null, "Opps generateHintPath return null");
        return retHintPath;
    },

    beginAttack : function(){
        if(gv.matchMng.isMineTurn()){  // co phai turn cua toi hay khong?
            if (this.totalSolution>0) {
                var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                gameGui.preparingHighLightScreen(HighLightType.OPACITY_HIGHLIGHT);
                this.hintPathList = [];
                for (var index in this.chooseAbleList) {
                    var piece = this.chooseAbleList[index];
                    var rangeList = this.targetRangeList[piece.pieceIndex];
                    for (var i = 0; i < rangeList.length; i++) {
                        var hintPath = this.generateHintPath(piece, rangeList[i]);
                        if (hintPath != null) {
                            var desTileSlot = GameUtil.addSlot(piece.currSlot, rangeList[i], piece.playerIndex);
                            hintPath.show(this.onPlayerSelectedPieceToMove.bind(this, piece, desTileSlot));
                            this.hintPathList.push(hintPath);
                        }
                    }
                }
                var pieceList = gv.matchMng.mainBoard.boardData.getPieceListSortedByNearestHome(this.target.playerIndex);
                var autoPiece;
                for (var i = pieceList.length - 1; i >= 0; i--) {
                    if (this.chooseAbleList.indexOf(pieceList[i])) {
                        autoPiece = pieceList[i];
                        DebugUtil.log("Than toc: No piece was chosen, auto choose piece: " + autoPiece.getString());
                        break;
                    }
                }
                var autoDesTile = GameUtil.addSlot(autoPiece.currSlot, this.targetRangeList[autoPiece.pieceIndex][0], autoPiece.playerIndex);
                gameGui.letPlayerChoosePiece(InteractType.SELECT, [], true,
                    this.onPlayerSelectedPieceToMove.bind(this, autoPiece, autoDesTile));
            }
        }
        else{// khong phai turn cua toi thi cho waiting action
            cc.log("show bubble wait piece Action");
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.WAIT_PIECE_ACTION);
        }
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    // sau khi chon piece de di chuyen thi gui goi tin len sever
    onPlayerSelectedPieceToMove : function(piece, targetSlot){
        gv.gameClient.sendActivePiece(piece.pieceIndex, targetSlot);
    },

    onResponseSkillResult: function(pieceIndex, globalPos){
        cc.log("Than toc: onResponseSkillResult");
        var localPos = gv.matchMng.mapper.convertGlobalToLocalSlotIndex(globalPos, this.target.standPos, pieceIndex);


        var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.target.playerIndex, pieceIndex);
        gv.matchMng.skillManager.skillDataInTurn[piece.playerIndex].activePiece = piece;

        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainBoardGui.clearHighLightScreen();
        mainBoardGui.disablePlayerChoosePiece(this.chooseAbleList);
        for (var i=0; i<this.hintPathList.length; i++){
            var hintPath = this.hintPathList[i];
            hintPath.hide();
        }
        this.hintPathList = [];

        var range = GameUtil.getRangeBetweenTwoSlot(piece.currSlot, localPos, piece.playerIndex);
        cc.log("range = " + range);
        this.startMove(piece, range);
    },

    startMove: function(activePiece, range){

        this.addThanTocActiveAnimation(activePiece);

        activePiece.pieceDisplay.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(function(){
                var curSlot = activePiece.currSlot;
                for (var i=0; i<range; i++){
                    curSlot = GameUtil.addSlot(curSlot, 1, activePiece.playerIndex);
                    var barrier = gv.matchMng.mainBoard.boardData.getPieceAtSlot(curSlot);
                    if (barrier!=null){
                        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                        var barrierWind  = fr.AnimationMgr.createAnimationById(resAniId.skill_thantoc_passive, this);
                        var colorStr = GameUtil.getColorStringById(barrier.pieceDisplay.playerColor);
                        barrierWind.getAnimation().gotoAndPlay(colorStr, 0, -1, 1);
                        barrierWind.setPosition(barrier.getPosition());
                        guiMainBoard.addChild(barrierWind, 999);

                       barrier.setVisible(false);

                        barrierWind.runAction(cc.sequence(
                            cc.delayTime(1.0),
                            cc.callFunc(function(barrier){
                                this.removeFromParent();
                                barrier.setVisible(true);
                            }.bind(barrierWind, barrier)))
                        );
                    }
                }
                var desSlot = GameUtil.addSlot(activePiece.currSlot, range, activePiece.playerIndex);
                gv.matchMng.mainBoard.boardData.putPieceToSlot(activePiece, desSlot);

                //this.addThanTocActiveAnimation(activePiece);

            }.bind(this)),
            cc.delayTime(1.0),
            cc.fadeIn(0.3),
            cc.callFunc(this.onSkillFinished.bind(this))
        ));
    },

    addThanTocActiveAnimation: function(piece) {
        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        var myWind  = fr.AnimationMgr.createAnimationById(resAniId.skill_thantoc_active, this);
        myWind.getAnimation().gotoAndPlay("run", 0, -1, 1);
        myWind.setPosition(piece.getPosition().x, piece.getPosition().y+10);
        guiMainBoard.addChild(myWind, 999);

        myWind.setCompleteListener(function(){
            myWind.removeFromParent();
        });

        switch (piece.pieceDisplay.direction){
            case PieceDirect.TOP_LEFT:
                myWind.setRotation(-110);
                break;
            case PieceDirect.BOTTOM_RIGHT:
                myWind.setRotation(70);
                break;
            case PieceDirect.BOTTOM_LEFT:
                myWind.setRotation(180);
                break;
        }

    },

    checkActiveAbility: function(player){
        this.chooseAbleList = [];
        this.targetRangeList = [];
        for (var i=0; i<NUMBER_PIECE_PER_PLAYER; i++){
            this.targetRangeList[i] = [];
        }
        this.totalSolution = 0;

        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        var expectedMoveRange = [];
        //neu do doi co the di chuyen theo 2 cach
        if (diceResult.score1 == diceResult.score2)
            expectedMoveRange.push(diceResult.score1);
        expectedMoveRange.push(diceResult.score1 + diceResult.score2);

        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(player.playerIndex, pieceIndex);
            if (piece.isCanMovingOnBoard()){
                for (var i = 0; i < expectedMoveRange.length; i++) {
                    var expectRange = expectedMoveRange[i];
                    var desSlot = GameUtil.addSlot(piece.currSlot, expectRange, player.playerIndex);
                    if (desSlot!=-1 && !(gv.matchMng.mainBoard.boardData.getPieceAtSlot(desSlot)) && (this.haveBarrierInRange(piece, expectRange-1))){//ko co piece nao o o nhay den & co vat can tren duong
                        this.targetRangeList[piece.pieceIndex].push(expectRange);
                    }
                }
                if (this.targetRangeList[piece.pieceIndex].length>0){
                    this.totalSolution+=this.targetRangeList[piece.pieceIndex].length;
                    this.chooseAbleList.push(piece);
                }
            }
        }
        return (this.totalSolution>0);
    },

    haveBarrierInRange: function(piece, range){
        var curSlot = piece.currSlot;
        for (var i=0; i<range; i++){
            var curSlot = GameUtil.addSlot(curSlot, 1, piece.playerIndex);
            if (gv.matchMng.mainBoard.boardData.getPieceAtSlot(curSlot)){
                return true;
            }
        }
        return false;
    }
});