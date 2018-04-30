/**
 * Created by user on 20/1/2017.
 */

//skill Am sat doi thu
var AmSatSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.AM_SAT;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_am_sat, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        var targetIndex = GameGenerator.getInstance().random.randomInt(0,this.enemyList.length);
        var time = this.showEffectFindTarget(targetIndex);
        GameUtil.callFunctionWithDelay(time+1.0, this.attackTarget.bind(this, targetIndex));
        GameUtil.callFunctionWithDelay(time+2.0, this.onSkillFinished.bind(this));
    },

    showEffectFindTarget: function(targetIndex){
        for (var i=0; i<this.enemyList.length; i++) {
            GameUtil.callFunctionWithDelay(i*0.25, function(curIndex){
                cc.log("showEffectFindTarget_" + curIndex);
                var piece = this.enemyList[curIndex];

                var crosshair = fr.AnimationMgr.createAnimationById(resAniId.cross_hair, this);
                crosshair.setOpacity(200);
                crosshair.getAnimation().gotoAndPlay("run", 0, -1, 1);
                crosshair.setPosition(piece.pieceDisplay.getPosition());
                crosshair.setLocalZOrder(piece.pieceDisplay.getLocalZOrder() - 1);
                piece.pieceDisplay.getParent().addChild(crosshair);

                var arrayAction = [];
                if (curIndex==targetIndex){
                    arrayAction.push(cc.delayTime((this.enemyList.length-curIndex)*0.25+1));
                    arrayAction.push(cc.blink(2.0, 8));
                    arrayAction.push(cc.removeSelf());
                }
                else{
                    crosshair.setCompleteListener(function(crosshair) {
                        crosshair.removeFromParent();
                    });
                }
                if (arrayAction.length>0)
                    crosshair.runAction(cc.sequence(arrayAction));
            }.bind(this, i));

        }
        //return time effect
        return (this.enemyList.length*0.25+2);
    },

    attackTarget: function(targetIndex){
        var enemy = this.enemyList[targetIndex];

        var amsatEffect  = fr.AnimationMgr.createAnimationById(resAniId.skill_am_sat_no, this);
        amsatEffect.getAnimation().gotoAndPlay("run", 0, -1, 1);
        amsatEffect.setPosition(enemy.pieceDisplay.getPosition());
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(amsatEffect, MainBoardZOrder.EFFECT);

        GameUtil.callFunctionWithDelay(1.0, function(){
            enemy.destroy(null, null);
        });

        ChangeGoldMgr.getInstance().addListKickInList(this.target, enemy);
    },

    checkActiveAbility: function(piece){
        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        if ((diceResult.score1==1) || (diceResult.score2==1)) {
            if (piece.isCanMovingOnBoard() || (piece.state == PieceState.ON_DES)) {
                this.enemyList = [];
                for (var globalPlayerIndex = 0; globalPlayerIndex<MAX_NUMBER_PLAYER; globalPlayerIndex++) {
                    var localPlayerIndex = gv.matchMng.mapper.convertGlobalStandPosToLocalIndex(globalPlayerIndex);
                    cc.log("global = " + globalPlayerIndex + ", local = " + localPlayerIndex);
                    if(!(localPlayerIndex == undefined || localPlayerIndex == null)){
                        if (gv.matchMng.isEnemy(localPlayerIndex,piece.playerIndex)){
                            for (var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
                                var enemy = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(localPlayerIndex, pieceIndex);
                                if ((enemy.state == PieceState.MOVING_TO_DES) || (enemy.state == PieceState.ON_DES)) {
                                    this.enemyList.push(enemy);
                                }
                            }
                        }
                    }
                }
                if (this.enemyList.length>0){
                    var logStr = "AmSatSkill: list enemy = ";
                    for (var i=0; i<this.enemyList.length;i++){
                        logStr = logStr + this.enemyList[i].getString() + ",";
                    }
                    DebugUtil.log(logStr);
                    return true;
                }
            }
        }
        return false;
    },
});