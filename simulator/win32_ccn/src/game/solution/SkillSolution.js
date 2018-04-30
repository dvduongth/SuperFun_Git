/**
 * Created by user on 6/11/2016.
 */

var SkillSolution = BaseSolution.extend({
    ctor : function(piece, params){
        this._super(piece, PieceAction.ACTIVE_SKILL, params);
    },

    generateHintPath : function(){
        var retHintPath = null;
        var mapper = gv.matchMng.mapper;
        var logText = "GEN HINT PATH:  ";

        retHintPath = new HintPath();
        retHintPath.pieceOwner = this.target;
        retHintPath.hintType = HintPathType.NONE;
        retHintPath.tileList=[];

        retHintPath.hintType = HintPathType.NORMAL_MOVE;
        logText+= "hintType: NORMAL_MOVE  ";

        for(var i=1; i <= this.actionParam; i++){
            var tileSlot = GameUtil.addSlot(this.target.currSlot, i, this.target.playerIndex);
            var currTile = mapper.getTileForSlot(tileSlot);
            retHintPath.tileList.push(currTile);

            logText+= (tileSlot + " ");
        }

        //cc.log(logText);
        cc.assert(retHintPath!=null, "Opps generateHintPath return null");
        return retHintPath;
    },

    show : function(){
        this.needHintStone = false;
        this._super();
    },

    performPieceAction : function(){
        this._super();
        this.actionParam.activeSkill(this.target, gv.matchMng.skillManager.onPieceSkillFinishActive(this.target, this.actionParam));
    }
});