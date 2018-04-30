/**
 * Created by user on 25/11/2016.
 */

//skill Di lui
var DiLuiSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.DI_LUI;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_di_chuyen, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        this.target.moveUp(-this.expectedRange, 1, this.onSkillFinished.bind(this));
    },

    checkActiveAbility: function(piece) {
        var diceResult = gv.matchMng.diceManager.lastDiceResult;

        this.expectedRange = diceResult.score1 + diceResult.score2;

        var desSlot = GameUtil.minusSlot(piece.currSlot, this.expectedRange);
        var desTile = gv.matchMng.mapper.getTileForSlot(desSlot);
        var desPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(desSlot);
        if(desTile!=null){
            if(desTile.tileUp){
                return false;
            }
        }
        return (desTile != null && desPiece == null && piece.isStandingOnHisHomeGate());
    },

});