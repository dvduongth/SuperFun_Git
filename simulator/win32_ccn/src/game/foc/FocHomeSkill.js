/**
 * Created by GSN on 11/24/2015.
 */

var FocHomeSkill = FocSkill.extend({
    selectedPieceId : null,

    ctor: function(){

    },

    active : function(){
        if(gv.matchMng.isMineTurn()){
            var pieceOnBoard = [];
            var mainboard = gv.matchMng.mainBoard;

            var currPlayerIndex = gv.matchMng.currTurnPlayerIndex;
            for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++ ){
                var piece = mainboard.boardData.getPieceOfPlayer(currPlayerIndex, pieceIndex);
                if(piece.getState() != PieceState.ON_HOME && piece.getState() != PieceState.FINISHED)
                    pieceOnBoard.push(piece);
            }

            if(pieceOnBoard.length == 0){
                this.callCompletedCallback();
                return;
            }

            if(pieceOnBoard.length > 1){
                var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                mainboardGui.letPlayerChoosePiece(InteractType.SELECT, pieceOnBoard, this.onPlayerChoosedPieceToGo.bind(this));
            }
        }

        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    realActive : function(){
        cc.assert(this.selectedPieceId >=0, "FocHomeSkill.realActive() Invalid pieceID");
        MainBoardUtil.moveSinglePieceToDestination(this.selectedPieceId, this.callCompletedCallback.bind(this));
    },

    penalty : function(){
        MainBoardUtil.moveSinglePieceToHome(this.selectedPieceId, this.callCompletedCallback.bind(this));
    },

    matchPenalty : function(){
        MainBoardUtil.moveAllPieceToHome(this.callCompletedCallback.bind(this));
    },

    getSkillId : function(){
        return FocSkill.HOME_SKILL;
    },

    setSelectedPieceId : function(piece){
        this.selectedPieceId = piece;
    },

    onPlayerChoosedPieceToGo : function(piece){
        gv.gameClient.sendUseFocSkill(piece.pieceIndex);
    },

    useSkill : function(param){
        this.setSelectedPieceId(param);
        this.realActive();
    }

});