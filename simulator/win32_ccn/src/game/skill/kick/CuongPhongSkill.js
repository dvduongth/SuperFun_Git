/**
 * Created by user on 20/1/2017.
 */

var CuongPhongSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.CUONG_PHONG;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_cuong_phong, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        //hien thi effect diem den
        var desSlot = GameUtil.addSlot(this.target.currSlot, this.expectedRange, this.target.playerIndex);
        var destinationTile = gv.matchMng.mapper.getTileForSlot(desSlot);
        destinationTile.setEnableDestinationPoint(true);

        //Di chuyen phi nuoc dai
        GameUtil.callFunctionWithDelay(1.2, function(){
            this.startCuongPhong(this.target, this.expectedRange);
        }.bind(this));
    },


    startCuongPhong: function(piece, expectedRange){
        //add effect loc xoay quanh nguoi
        var effectStorm = fr.AnimationMgr.createAnimationById(resAniId.skill_cuong_phong_storm, this);
        effectStorm.getAnimation().gotoAndPlay("run", 0, -1, 0);
        effectStorm.setPosition(25,0);
        piece.pieceDisplay.addChild(effectStorm,999999);

        var actionArr = [];
        var curSlot = piece.currSlot;
        for (var i=0; i<expectedRange; i++){
            var nextSlot = GameUtil.addSlot(curSlot, 1, piece.playerIndex);
            var nextTile = gv.matchMng.mapper.getTileForSlot(nextSlot);
            actionArr.push(cc.moveTo(0.25, nextTile.getStandingPositionOnTile()));
            actionArr.push(cc.callFunc(function(nextTile){
                piece.pieceDisplay.updateDirection(nextTile.direction);

                var nextPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(nextTile.index);
                if (nextPiece!=null && gv.matchMng.isEnemy(piece.playerIndex, nextPiece.playerIndex)){
                    var randomSize = MathUtil.randomBetweenFloor(0,2);
                    nextPiece.destroyWithBreakScreen(randomSize==0);

                    DebugUtil.log("CuongPhongSkill: kill piece: " + nextPiece.getString());

                    this.target.kickedList.push(nextPiece);
                    ChangeGoldMgr.getInstance().addListKickInList(this.target, nextPiece);
                    //playerTarget.playerStatus.totalBeKicked++;
                }
            }.bind(this, nextTile)));
            curSlot = nextSlot;
        }
        var destinationTile = gv.matchMng.mapper.getTileForSlot(curSlot);
        actionArr.push(cc.callFunc(function(){
            gv.matchMng.mainBoard.boardData.putPieceToSlot(piece, curSlot);
            effectStorm.removeFromParent();
            this.onSkillFinished();
            destinationTile.setEnableDestinationPoint(false);
        }.bind(this)));
        piece.pieceDisplay.runAction(cc.sequence(actionArr));

        fr.Sound.playSoundEffect(resSound.skill_phinuocdai_loop);

    },

    checkActiveAbility: function(piece){
        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        if ((diceResult.score1+diceResult.score2)%2==1) {
            this.expectedRange = diceResult.score1+diceResult.score2;

            var haveEnemy = false;
            var curSlot = piece.currSlot;
            for (var i=0; i<this.expectedRange; i++){
                curSlot = GameUtil.addSlot(curSlot, 1, piece.playerIndex);
                var pieceOnTile = gv.matchMng.mainBoard.boardData.getPieceAtSlot(curSlot);
                if (pieceOnTile!=null && gv.matchMng.isEnemy(pieceOnTile.playerIndex, piece.playerIndex)){
                    haveEnemy = true;
                    break;
                }
            }
            var desSlot = GameUtil.addSlot(piece.currSlot, this.expectedRange, piece.playerIndex);
            var desTile = gv.matchMng.mapper.getTileForSlot(desSlot);

            if(desTile!=null && haveEnemy){
                return !desTile.tileUp;
                //if(desTile.tileUp){
                //    return false;
                //}
                //return true;
            }
        }
        return false;
    },
});