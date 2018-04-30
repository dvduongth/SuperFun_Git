/**
 * Created by user on 20/2/2017.
 */

var RebornSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.REBORN;
    },

    skillCharge : function(){
        this._super();
    },

    beginAttack : function(){
        gv.matchMng.mainBoard.forceSummon(this.target, this.onSkillFinished.bind(this));
    },

    checkActiveAbility: function(piece){
        var homeGateSlot = GameUtil.getHomeGateForPlayer(piece.playerIndex);
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece.playerIndex);
        if (playerInfo.lose) return;
        var pieceAtHomeGate = gv.matchMng.mainBoard.boardData.getPieceAtSlot(homeGateSlot);
        return (piece.getState() == PieceState.ON_HOME) && (pieceAtHomeGate==null);
        //if ((piece.getState() == PieceState.ON_HOME) && (pieceAtHomeGate==null))
        //    return true;
        //return false;
    }
});