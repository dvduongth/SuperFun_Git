/**
 * Created by GSN on 11/24/2015.
 */

var FocBootSkill = FocSkill.extend({
    kickedPieceId : -1,

    ctor: function(){

    },

    active : function(){

        if(gv.matchMng.isMineTurn()){
            var mainboard = gv.matchMng.mainBoard;

            var chooseAbleList = [];
            var enermyPieces = mainboard.getPlayerDataAtIndex(gv.matchMng.currTurnPlayerIndex).pieceList;
            for(var i=0; i< enermyPieces.length; i++){
                if(enermyPieces[i].getState() != PieceState.ON_HOME && enermyPieces[i].getState() != PieceState.FINISHED){
                    chooseAbleList.push(enermyPieces[i]);
                }
            }
            if(chooseAbleList.length == 0){
                this.callCompletedCallback();
                return;
            }

            if(chooseAbleList.length > 1 ){
                var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                mainboardGui.letPlayerChoosePiece(InteractType.SLICE, chooseAbleList, this.onPlayerSlicedPiece.bind(this));
            }
        }

        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    realActive : function(){
        cc.assert(this.kickedPieceId >=0, "realActive. invalid kickedPieceId: "+this.kickedPieceId);

        var matchMng = gv.matchMng;
        var mainboard = matchMng.mainBoard;

        var currPlayerIndex = matchMng.currTurnPlayerIndex;
        var kickedPiece = mainboard.boardData.getPieceOfPlayer(currPlayerIndex, this.kickedPieceId);
        cc.assert(kickedPiece!=null, "realActive. kickedPiece is null");
        mainboard.boardData.putPieceToHome(kickedPiece, kickedPiece.pieceIndex);
        this.callCompletedCallback();
    },

    penalty : function(){
        gv.matchMng.focManager.cooldownPlayerFocTurn(gv.matchMng.currTurnPlayerIndex, 3);
        this.callCompletedCallback();
    },

    matchPenalty : function(){
        var _this = this;
        MainBoardUtil.moveAllPieceToHome(function(){
            _this.callCompletedCallback();
        });
    },

    onPlayerSlicedPiece : function(piece, sliceVector){
        var spinAction = cc.rotateBy(1.0, 360);
        var moveAction = cc.moveBy(1.0, cc.p(sliceVector.x*100, sliceVector.y*100));
        var sequeAction = cc.sequence(cc.spawn(spinAction, moveAction), cc.callFunc(function(){
            gv.gameClient.sendUseFocSkill(piece.pieceIndex);
        }));
        piece.pieceDisplay.runAction(sequeAction);

        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).disablePlayerChoosePiece();
    },

    getSkillId : function(){
        return FocSkill.BOOT_SKILL;
    },

    setPieceBeKicked : function(pieceId){
        this.kickedPieceId = pieceId;
    },

    useSkill : function(param){
        this.setPieceBeKicked(param);
        this.realActive();
    }

});