/**
 * Created by GSN on 11/24/2015.
 */

var FocHandSkill = FocSkill.extend({
    playerBeStealId : -1,
    stealGui : null,

    ctor: function(){

    },

    active : function(){
        this.playerBeStealId = (gv.matchMng.currTurnPlayerIndex + 1) % gv.matchMng.getNumberPlayer();
        var interactAble = gv.matchMng.isMineTurn();
        this.showStealGui(interactAble, 3, this.onStealGuiTimeOut.bind(this));
    },

    penalty : function(){
        gv.matchMng.focManager.cooldownPlayerFocTurn(gv.matchMng.currTurnPlayerIndex, 3);
        this.showPenaltyEffect(this.callCompletedCallback.bind(this));
    },

    matchPenalty : function(){
        for(var playerIndex = 0; playerIndex < gv.matchMng.getNumberPlayer(); playerIndex++){
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
            playerInfo.totalGold -= 1000;
            playerInfo.totalGold = playerInfo.totalGold >=0 ? playerInfo.totalGold : 0;
        }

        this.showMatchPenaltyEffect(this.callCompletedCallback.bind(this));
    },

    getSkillId : function(){
        return FocSkill.HAND_SKILL;
    },

    showPenaltyEffect : function(callback){
        var callFuncAction = cc.sequence(cc.delayTime(1.0), cc.callFunc(callback));
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).runAction(callFuncAction);
    },

    showMatchPenaltyEffect : function(callback){
        var callFuncAction = cc.sequence(cc.delayTime(1.0), cc.callFunc(callback));
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).runAction(callFuncAction);
    },

    showStealGui : function(interactAble, duration, callback){
        //tao gui cuop tien o day

        var callFuncAction = cc.sequence(cc.delayTime(duration), cc.callFunc(callback));
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).runAction(callFuncAction);
    },

    showStealEffect : function(callback){
        var callFuncAction = cc.sequence(cc.delayTime(1.0), cc.callFunc(callback));
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).runAction(callFuncAction);
    },

    onStealGuiTimeOut : function(){
        this.showStealEffect(this.callCompletedCallback.bind(this));
    },

    useSkill : function(param){
        if(!gv.matchMng.isMineTurn()){
            var numberSteal = param;
            this.stealGui.animateStealAction(numberSteal);
        }
    }
});