/**
 * Created by GSN on 9/26/2016.
 */

var RainGoldSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.RAIN_GOLD;
    },

    skillCharge : function(){
        this._super();
        // khai bao animation o day.
        var rainGoldEffect = fr.AnimationMgr.createAnimationById(resAniId.skill_money_rain, this);
        rainGoldEffect.getAnimation().gotoAndPlay("run", 0, -1, 1);

        // lay toa do cua player duoc nhan tien
        var playerPosition = gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION).Get_Position_By_StandPos(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.target.playerIndex).standPos);
        rainGoldEffect.setPosition(playerPosition);
        rainGoldEffect.setCompleteListener(function(){
            rainGoldEffect.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(rainGoldEffect, MainBoardZOrder.EFFECT);
        fr.Sound.playSoundEffect(resSound.skill_moneyrain);
    },

    beginAttack : function(){
        //todo Skill nay chuyen sang hut sinh luc cua doi phuong :)
        ChangeGoldMgr.getInstance().addChangeGoldByRainGold(this.target.playerIndex);
        GameUtil.callFunctionWithDelay(0.5,function(){ ChangeGoldMgr.getInstance().activeChangeGoldInfo(this.skillCallback);}.bind(this));
    },

    checkActiveAbility: function(target){
        return gv.matchMng.currTurnPlayerIndex == target.playerIndex;
    }

});