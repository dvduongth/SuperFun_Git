/**
 * Created by GSN on 9/26/2016.
 */
// skill mo vang
var FreeTaxSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.FREE_TAX;
    },

    skillCharge : function(){
        cc.log("skillCharge skill FREE_TAX  ");
        this._super();
        var defenseEffect = fr.AnimationMgr.createAnimationById(resAniId.eff_skill_defend, this);
        defenseEffect.gotoAndPlay("run", 0,1,1);
        defenseEffect.setPosition(this.target.pieceDisplay.getPosition().x -10, this.target.pieceDisplay.getPosition().y);
        defenseEffect.setCompleteListener(function(){
            defenseEffect.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(defenseEffect, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++) {
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
            if (this.target.currSlot == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i)) && !playerInfo.lose) {
                gv.matchMng.taxMgr.multiTastWithPlayerIndex(i);
                break;
            }
        }
        this.onSkillFinished();
    },

    checkActiveAbility: function(){
        return true;
    }
});