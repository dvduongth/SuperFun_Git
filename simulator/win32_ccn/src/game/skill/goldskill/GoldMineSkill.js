/**
 * Created by GSN on 9/26/2016.
 */
// skill mo vang
var GoldMineSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.GOLD_MINE;
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

        GameUtil.callFunctionWithDelay(1,function(){
            fr.Sound.playSoundEffect(resSound.skill_movang);
        }.bind(this));
    },

    beginAttack : function(){
        ChangeGoldMgr.getInstance().addChangeGoldByGoldMine(this.target.playerIndex,GameUtil.getValueSkillInfo(this.skillId,this.target.playerIndex)-1);
        ChangeGoldMgr.getInstance().activeChangeGoldInfo(this.skillCallback);
    },

    checkActiveAbility: function(){
        return true;

    }
});