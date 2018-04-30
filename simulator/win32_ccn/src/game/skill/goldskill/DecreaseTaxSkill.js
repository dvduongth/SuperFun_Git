
var DecreaseTaxSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.DECREASE_TAX;
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
    },

    beginAttack : function(){
        var decreaseTax = GameUtil.getValueSkillInfo(PieceSkill.DECREASE_TAX,this.target.playerIndex); // load config o day nua la xong
        var summonIndex = this.target.playerIndex;
        for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++) {
            if (this.target.currSlot == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i))) {// xem no co dung o cong chuong doi thu hay khong
                summonIndex= i;
                break;
            }
        }
        gv.matchMng.taxMgr.activeTax(this.target.playerIndex,summonIndex,decreaseTax,function(){this.onSkillFinished();}.bind(this));

    },
    checkActiveAbility: function(){
        return true;
    }
});