/**
 * Created by GSN on 11/24/2015.
 */

var FocSkill = {
    NONE : 0,
    BOOT_SKILL : 1,
    HAND_SKILL : 2,
    TIME_SKILL : 3,
    HOME_SKILL : 4
};

var ActiveResult = {
    SUCCESS : 0,
    PENALTY : 1,
    MATCH_PENALTY : 2
}

var FocManager = cc.Class.extend({

    focConfig : null,
    focPool : null,
    currFocSkill : FocSkill.NO_CHEAT,
    skillObj : null,
    currPointRate : 0,
    numTurnToNextSkill : 0,
    numTurnToIncRate : 0,
    endTurnCallback : null,

    ctor: function(){
        this.focConfig = new FocConfig();
        this.focPool = new FocPool(this);
        this.focPool.attachToScreen(gv.guiMgr.getGuiById(GuiId.MAIN_BOARD));
        this.currFocSkill = FocSkill.BOOT_SKILL;
        this.numTurnToNextSkill = this.focConfig.numberTurnNeedToChangeSkill;
        this.numTurnToIncRate = this.focConfig.pointRate.numTurnNeedToIncRate;
        this.currPointRate = this.focConfig.pointRate.pointRateInit;
    },

    onTurnFinished : function(playerIndex, callback){
        this.endTurnCallback = callback;
        this.endTurnCallback();
        return;

        this.numTurnToNextSkill--;
        if(this.numTurnToNextSkill == 0){
            this.numTurnToNextSkill = this.focConfig.numberTurnNeedToChangeSkill;
            this.currFocSkill = (this.currFocSkill+1)%FocSkill.length;
        }

        this.numTurnToIncRate--;
        if(this.numTurnToIncRate == 0){
            this.numTurnToIncRate = this.focConfig.pointRate.numTurnNeedToIncRate;
            if(this.currPointRate < this.focConfig.pointRate.pointRateMax)
                this.currPointRate += this.focConfig.pointRate.pointRateIncStep;
        }

        if(gv.matchMng.isMineTurn()){
            var numberCooldown = this.getNumberFocCooldown(playerIndex);
            if(numberCooldown!=0){
                this.cooldownPlayerFocTurn(playerIndex, numberCooldown-1);
                this.endTurnCallback();
                return;
            }
            var successRate = this.focConfig.minSuccessRate + (this.focConfig.maxSuccessRate - this.focConfig.minSuccessRate)*(this.focPool.getCurrentPointPercent()/100);
            this.showDecideActiveFocGUI(successRate, this.currFocSkill);
        }

        else if(this.focPool.isFull()){
            this.focPool.explosive();
            this.activeCurrentSkill(ActiveResult.MATCH_PENALTY);
        }
        else{
            this.endTurnCallback();
        }
    },

    showDecideActiveFocGUI : function(successRate, currSkill){
        var skillName = "";
        switch (currSkill){
            case FocSkill.BOOT_SKILL:
                skillName = "Boot Skill";
                break;
            case FocSkill.HAND_SKILL:
                skillName = "Hand Skill";
                break;
            case FocSkill.HOME_SKILL:
                skillName = "Home Skill";
                break;
            case FocSkill.TIME_SKILL:
                skillName = "Time Skill";
                break;
        }

        var focDecideGUI = new GuiActiveFoC();
        focDecideGUI.setSuccessRate(successRate);
        focDecideGUI.setCurrentSkillName(skillName);
        focDecideGUI.setCompletedCallback(this.onPlayerDecidedActiveFoc.bind(this));
        gv.guiMgr.addGui(focDecideGUI, GuiId.ACTIVE_FOC, LayerId.LAYER_GUI);
    },

    continueNextTurn : function(){
        this.endTurnCallback();
    },

    onPlayerDecidedActiveFoc : function(actived){
        gv.gameClient.sendActiveFoc(actived);
    },

    onRollDiceFinished : function(diceResult, playerIndex){
        var additionalPoint = this.calulateAdditionalPointForLastTurn(diceResult, playerIndex);
        this.focPool.addPoint(additionalPoint);
    },

    activeCurrentSkill : function(result){
        this.skillObj = null;
        switch (this.currFocSkill){
            case FocSkill.BOOT_SKILL:
                this.skillObj = new FocBootSkill();
                break;
            case FocSkill.HAND_SKILL:
                this.skillObj = new FocHandSkill();
                break;
            case FocSkill.HOME_SKILL:
                this.skillObj = new FocHomeSkill();
                break;
            case FocSkill.TIME_SKILL:
                this.skillObj = new FocTimeSkill();
                break;
        }

        cc.assert(this.skillObj!=null, "activeCurrentSkill something wrong! currSkillId: " + this.currFocSkill);
        this.skillObj.setCompletedCallback(this.continueNextTurn.bind(this))

        var _this = this;
        if(result == ActiveResult.SUCCESS){
            this.showActiveSuccessEffect(function(){
                this.skillObj.activeSkill();
                _this.focPool.setPoint(this.focConfig.pointResidue.pointResidueSuccess);
            });
        }
        else if(result == ActiveResult.PENALTY){
            this.showPenaltyEffect(function(){
                this.skillObj.penalty();
                _this.focPool.setPoint(this.focConfig.pointResidue.pointResidueFailure);
            });
        }
        else if(result == ActiveResult.MATCH_PENALTY){
            this.showMatchPenaltyEffect(function(){
                this.skillObj.matchPenalty();
                _this.focPool.setPoint(this.focConfig.pointResidue.pointResidueOverload);
            });
        }
    },

    useCurrentSkill : function(param){
        cc.assert(this.skillObj != null, "FocManager.useCurrentSkill() skillObj is null");
        this.skillObj.useSkill(param);
    },

    calulateAdditionalPointForLastTurn : function(diceResult, playerIndex){
        return (diceResult.score1 + diceResult.score2)*this.currPointRate*10;
    },

    cooldownPlayerFocTurn : function(playerIndex, numberTurn){
        var playerData = gv.matchMng.mainBoard.getPlayerDataAtIndex(playerIndex);
        playerData.numberFocTurnCooldown++;
    },

    getNumberFocCooldown : function(playerIndex){
        var playerData = gv.matchMng.mainBoard.getPlayerDataAtIndex(playerIndex);
        return playerData.numberFocTurnCooldown;
    },

    showActiveSuccessEffect : function(callback){
        //not implement yet
        GameUtil.callFunctionWithDelay(1.0, callback);
    },

    showPenaltyEffect : function(callback){
        //not implement yet
        GameUtil.callFunctionWithDelay(1.0, callback);
    },

    showMatchPenaltyEffect : function(callback){
        //not implement yet
        GameUtil.callFunctionWithDelay(1.0, callback);
    }
});