/**
 * Created by GSN on 1/8/2016.
 */

var MoveSolution = BaseSolution.extend({
    ctor : function(piece, params){
        this._super(piece, PieceAction.NORMAL_MOVE, params);
    },

    generateHintPath : function(){
        //var retHintPath = null;
        var mapper = gv.matchMng.mapper;
        var logText = "GEN HINT PATH:  ";

        var retHintPath = new HintPath();
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
        gv.matchMng.mainBoard.movePiece(this.target, this.actionParam);  //actionParam is range
    }
});