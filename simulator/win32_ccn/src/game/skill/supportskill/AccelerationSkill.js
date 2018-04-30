/**
 * Created by GSN on 9/26/2016.
 */
//skill tang toc
var AccelerationSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.ACCELERATION_SKILL;
    },

    skillCharge : function(){
        this._super();
        var defenseEffect = fr.AnimationMgr.createAnimationById(resAniId.eff_skill_defend, this);
        defenseEffect.gotoAndPlay("run", 0,1,1);
        defenseEffect.setPosition(this.target.pieceDisplay.getPosition().x -10, this.target.pieceDisplay.getPosition().y);
        defenseEffect.setCompleteListener(function(){
            defenseEffect.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(defenseEffect, MainBoardZOrder.EFFECT);
        fr.Sound.playSoundEffect(resSound.skill_speedup);
    },

    beginAttack : function(){
        gv.matchMng.diceManager.skillAcceleration = true;
        if(gv.matchMng.diceManager.lastDiceResult.score1 == gv.matchMng.diceManager.lastDiceResult.score2){

        }else{
            gv.matchMng.diceManager.numberContRoll++;
        }
        this.skillCallback();
    },

    checkActiveAbility: function(piece){
        if(gv.matchMng.diceManager.lastDiceResult.score1 == gv.matchMng.diceManager.lastDiceResult.score2){
            return false;
        }
        if(gv.matchMng.diceManager.numberContRoll<2){
            for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
                if((piece.currSlot+1)%40 == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i))){
                    return true;
                }
            }
            return false;
        }
        return false;
    }
});