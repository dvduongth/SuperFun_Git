/**
 * Created by user on 20/1/2017.
 */

var HauDaSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.HAU_DA;
        this.nearestEnemy = null;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.skill_phinuocdai, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        this.target.kickOtherPiece(KickType.SCREEN_BREAK, true, [this.nearestEnemy], 2, this.onSkillFinished.bind(this));
    },

    checkActiveAbility: function(piece){
        this.nearestEnemy = null;
        var curSlot = piece.currSlot;
        for (var i=1; i<NUMBER_SLOT_IN_BOARD; i++){
            curSlot = GameUtil.addSlot(curSlot, 1, piece.playerIndex);
            var pieceHolding = gv.matchMng.mainBoard.boardData.getPieceAtSlot(curSlot);
            if (pieceHolding!=null && gv.matchMng.isEnemy(piece.playerIndex, pieceHolding.playerIndex)){
                this.nearestEnemy = pieceHolding;
                DebugUtil.log("HauDaSkill: The nearest enemy = " + pieceHolding.getString());
                return true;
            }
        }
        return false;
    },
});