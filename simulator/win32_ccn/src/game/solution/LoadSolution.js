/**
 * Created by GSN on 1/8/2016.
 */

var LoadSolution = BaseSolution.extend({

    ctor : function(piece, params){
        this._super(piece, PieceAction.LOAD_TO_DES, params);
    },

    generateHintPath : function(){
        //var retHintPath = null;
        var mapper = gv.matchMng.mapper;
        //var logText = "GEN HINT PATH:  ";

        var retHintPath = new HintPath();
        retHintPath.pieceOwner = this.target;
        retHintPath.hintType = HintPathType.NONE;
        retHintPath.tileList=[];

        retHintPath.hintType = HintPathType.LOAD_DES;
        //logText+= "hintType: LOAD_DES  ";

        var tileSlot = this.actionParam;
        var desTile = mapper.getTileForSlot(tileSlot);
        retHintPath.tileList.push(desTile);

        //logText+= (tileSlot + " ");

        //cc.log(logText);
        cc.assert(retHintPath!=null, "Opps generateHintPath return null");
        return retHintPath;
    },

    performPieceAction : function(){
        this._super();
        var range = GameUtil.getSlotDistance(this.target.currSlot, this.actionParam, this.target.playerIndex);
        gv.matchMng.mainBoard.loadPiece(this.target, range);
    },

    show : function(){
        this.needHintStone = false;
        this._super();
    }
});