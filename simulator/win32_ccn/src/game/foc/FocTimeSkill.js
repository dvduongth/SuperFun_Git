/**
 * Created by GSN on 11/24/2015.
 */

var FocTimeSkill = FocSkill.extend({
    pieceChoosedId : -1,

    ctor: function(){

    },

    active : function(){
        if(gv.matchMng.isMineTurn()){
            var revertAbleList = [];
            var mainboard = gv.matchMng.mainBoard;
            var enermyPlayerIndex = (gv.matchMng.currTurnPlayerIndex + 1) % gv.matchMng.getNumberPlayer();
            for(var i=0; i< NUMBER_PIECE_PER_PLAYER; i++){
                var piece = mainboard.boardData.getPieceOfPlayer(enermyPlayerIndex, i);
                if(piece.getState() != PieceState.ON_HOME && piece.getState() != PieceState.FINISHED){
                    var oldSlot = piece.popBackupState(false).tileStand;
                    if(oldSlot.getPieceHolding()== null || oldSlot.getPieceHolding()== piece)
                        revertAbleList.push(piece);
                }
            }

            if(revertAbleList.length == 0){
                this.callCompletedCallback();
                return;
            }

            else if(revertAbleList.length > 1){
                this.showGuiChoosePieceToRevertAction(revertAbleList);
            }
        }

        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    penalty : function(){
        var _this = this;
        this.showLoseNextTurnEffect(function(){
            gv.matchMng.cooldownPlayerTurn(gv.matchMng.currTurnPlayerIndex, 1);
            _this.callCompletedCallback();
        });
    },

    matchPenalty : function(){
        var mainboard = gv.matchMng.mainBoard;
        mainboard.revertMainboardToPrevState(1, this.callCompletedCallback.bind(this));
    },

    getSkillId : function(){
        return FocTimeSkill.TIME_SKILL;
    },

    realActive : function(){
        cc.assert(this.pieceChoosedId >=0, "FocTimeSkill.realActive() Invalid pieceID");
        var enermyPlayerId = (gv.matchMng.numberTurnPlayed+1)%gv.matchMng.getNumberPlayer();
        var mainboard = gv.matchMng.mainBoard;
        var revertPiece = mainboard.boardData.getPieceOfPlayer(enermyPlayerId, this.pieceChoosedId);
        mainboard.undoPieceAction(revertPiece, this.callCompletedCallback.bind(this));
    },

    showLoseNextTurnEffect : function(callback){
        GameUtil.callFunctionWithDelay(1.0, callback);
    },

    showGuiChoosePieceToRevertAction : function(pieceList){
        var mainboard = gv.matchMng.mainBoard;
        mainboard.calculateReverseHintPathForPieces(pieceList);
        var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainboardGui.showHintPathOfPieces(pieceList);
        mainboardGui.letPlayerChoosePiece(InteractType.DRAG_N_DROP, pieceList, this.onPieceDragged.bind(this));
    },

    onPieceDragged : function(piece){
        var destinationTile = piece.hintPath.tileList[piece.hintPath.tileList.length-1];
        var destinationPos = destinationTile.getPosition();
        var piecePos = piece.getPosition();
        if(cc.pDistance(piecePos, destinationPos) < 50){
            var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            mainboardGui.disableHintPathOfPieces();
            mainboardGui.disablePlayerChoosePiece();
            gv.gameClient.sendUseFocSkill(piece.pieceIndex);
            return true;
        }

        return false;
    },

    setSelectedPieceId : function(pieceId){
        this.pieceChoosedId = pieceId;
    },

    useSkill : function(param){
        this.setSelectedPieceId(param);
        this.realActive();
    }
});