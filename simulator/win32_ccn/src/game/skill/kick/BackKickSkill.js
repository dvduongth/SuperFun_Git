/**
 * Created by GSN on 5/16/2016.
 */

//skill Da Hau
var BackKickSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.BACK_KICK;
        this.targetList = [];
        this.activePiece = null;
    },

    //skillCharge : function(){
    //    this._super();
    //    var castSkill = fr.AnimationMgr.createAnimationById(resAniId.castskill, this);
    //    castSkill.getAnimation().gotoAndPlay("run", 0, -1, 1);
    //    castSkill.setPosition(this.piece.pieceDisplay.getPosition());
    //    castSkill.setCompleteListener(function(){
    //        castSkill.removeFromParent();
    //    });
    //    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkill, MainBoardZOrder.EFFECT);
    //},

    beginAttack : function(){
        var kickCallback = function(piece, recentTarget, finalKick) {
            if (finalKick) {
                cc.log("kickCallback: final kick, getNextPiece");
                this.onSkillFinished();
            }
        }.bind(this);

        var activePiece = this.activePiece;
        gv.matchMng.skillManager.skillDataInTurn[activePiece.playerIndex].activePiece = activePiece;
        var pieceTargetList = this.targetList[activePiece.pieceIndex];
        activePiece.kickOtherPiece(KickType.SCREEN_BREAK, true, pieceTargetList, 2, kickCallback);
    },


    checkActiveAbility: function(player){
        for (var i=0; i<NUMBER_PIECE_PER_PLAYER; i++){
            this.targetList[i] = [];
        }
        this.activePiece = this.getActivePiece(player);
        return !(this.activePiece==null);
        //if (this.activePiece==null) return false;
        //return true;
    },

    getActivePiece: function(player){
        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        var expectedMoveRange = [];
        //neu do doi co the di chuyen theo 2 cach
        if(diceResult.score1 == diceResult.score2)
            expectedMoveRange.push(diceResult.score1);
        expectedMoveRange.push(diceResult.score1 + diceResult.score2);


        var pieceList = gv.matchMng.mainBoard.boardData.getPieceListSortedByNearestHome(player.playerIndex);
        for (var pieceIndex=0; pieceIndex<pieceList.length; pieceIndex++){
            var piece = pieceList[pieceIndex];
            if (!piece.isCanMovingOnBoard()) continue;
            for (var i=0; i<expectedMoveRange.length; i++){
                var expectRange = expectedMoveRange[i];
                var curSlot = piece.currSlot;
                do{
                    var desSlot = GameUtil.minusSlot(curSlot, expectRange);
                    var desTile = gv.matchMng.mapper.getTileForSlot(desSlot);
                    var desPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(desSlot);

                    if ((desTile != null) && (desPiece != null) && (desPiece.playerIndex != piece.playerIndex)){
                        DebugUtil.log("BackKick: Detected target: " + desPiece.getString() + " at " + desSlot, true);
                        this.targetList[piece.pieceIndex].push(desPiece);
                        curSlot = desSlot;
                    }
                    else{
                        break;
                    }
                } while ((this.targetList[piece.pieceIndex].length<2) && (expectRange == diceResult.score1));//toi da da 2 con, va khi do phai la do doi
                if (this.targetList[piece.pieceIndex].length>0){
                    cc.log("getActivePiece: piece = " + piece.getString());
                    return piece;
                }
            }
        }
        return null;
    },
});