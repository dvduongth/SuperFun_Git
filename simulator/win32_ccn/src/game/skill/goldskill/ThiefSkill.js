/**
 * Created by GSN on 9/26/2016.
 */
// skill an trom
var ThiefSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.THIEF_SKILL;
        this.indexTitle = -1;
    },

    skillCharge : function(){
        this._super();
        // khoi tao animation
        var defenseEffect = fr.AnimationMgr.createAnimationById(resAniId.eff_skill_defend, this);
        defenseEffect.gotoAndPlay("run", 0,1,1);
        defenseEffect.setPosition(this.target.pieceDisplay.getPosition().x -10, this.target.pieceDisplay.getPosition().y);
        defenseEffect.setCompleteListener(function(){
            defenseEffect.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(defenseEffect, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        var gold =gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.indexTitle).playerStatus.gold;
        var value = GameUtil.getValueSkillInfo(this.skillId,this.target.playerIndex);
        ChangeGoldMgr.getInstance().addChangeGoldElement(this.target.playerIndex,Math.floor(gold*value));
        ChangeGoldMgr.getInstance().addChangeGoldElement(this.indexTitle,-Math.floor(gold*value));
        ChangeGoldMgr.getInstance().activeChangeGoldInfo(this.skillCallback);

    },

    checkActiveAbility: function(piece){
        for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
            if((piece.currSlot+1)%40 == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i))){
                var playerinfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i));
                this.indexTitle = playerinfo.playerIndex;
                if(playerinfo.playerStatus.gold>0){
                    return true
                }
            }
        }
        return false;
    }
});