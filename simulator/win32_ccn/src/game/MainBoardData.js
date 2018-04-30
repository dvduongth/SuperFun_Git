/**
 * Created by GSN on 9/25/2015.
 */

var MainBoardData = cc.Class.extend({

    ctor : function(){
        this.pos_piece_map = [];
        this.id_playerData = [];
    },

    init : function(numberPlayer){
        //init all piece in board
        for(var playerIndex=0; playerIndex < numberPlayer; playerIndex++){
            this.id_playerData[playerIndex] = new PlayerData(playerIndex);
        }
    },

    getPieceAtSlot : function(slotIndex){
        if(slotIndex in this.pos_piece_map){
            return this.pos_piece_map[slotIndex];
        }
        else
            return null;
    },

    checkFinishedLoad : function(piece){
        if(piece.getState() != PieceState.ON_DES)
            return false;

        if(piece.currSlot %100 == NUMBER_DES_SLOT-1) {
            return true;
        }
        else {
            var beforePiece = this.getPieceAtSlot(GameUtil.addSlot(piece.currSlot, 1, piece.playerIndex));
            if(beforePiece!=null && beforePiece.getState() == PieceState.FINISHED)
                return true;
        }

        return false;
    },

    updatePieceState : function(piece){
        if(piece.currSlot >=100){
            if(piece.getState() != PieceState.ON_DES){
                piece.state = PieceState.ON_DES;
                cc.log("Change state piece : "+piece.getString()+" to on des!");
            }

            if(this.checkFinishedLoad(piece)) {
                piece.state = PieceState.FINISHED;
                cc.log("Finished load piece " + piece.getString() + " to destination slot: " + piece.currSlot);
            }
        }
        else if(piece.currSlot < 0){
            if(piece.getState() != PieceState.ON_HOME){
                piece.state = PieceState.ON_HOME;
                cc.log("Change state piece : "+piece.getString()+" to on home!");
            }
        }
        else{
            if(piece.getState() != PieceState.MOVING_TO_DES){
                piece.state = PieceState.MOVING_TO_DES;
                cc.log("Change state piece : "+piece.getString()+" to moving!");
            }
        }
    },

    putPieceToSlot : function(piece, slotIndex){
        cc.log("putPieceToSlot: "+piece.getString()+" --> "+slotIndex);

        if(piece.getState() == PieceState.NONE){
            this.updateMapPiecePosition(-1, slotIndex, piece);
            this.getPlayerDataAtIndex(piece.playerIndex).pieceList.push(piece);
        }
        else {
            this.updateMapPiecePosition(piece.currSlot, slotIndex, piece);
        }
        //piece.oldSlot = piece.currSlot;
        piece.currSlot = slotIndex;
        //cc.log( piece.oldSlot + "          " + piece.currSlot);
        this.updatePieceState(piece);
        piece.pieceDisplay.updateNewPosition();

        //hien thi number o ve dich
        //var stanPos = gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex);
        if ((piece.state == PieceState.ON_DES) || (piece.state == PieceState.FINISHED) || (piece.isStandingOnHisDesinationGate())) {
            gv.matchMng.mainBoard.setVisibleDestinationNumber(piece.playerIndex, true);
        }
    },

    swapPiece : function(piece1, piece2){
        cc.assert((piece1.getState() == PieceState.MOVING_TO_DES) && (piece2.getState() == PieceState.MOVING_TO_DES),
            "swapPiece : Invalid state! state1: "+ piece1.getState()+ " state2: "+ piece2.getState());

        DebugUtil.log("SWAP PIECE. "+ piece1.getString()+' <----> ' + piece2.getString(), true);

        var tempSlot = piece1.currSlot;
        this.putPieceToSlot(piece1, piece2.currSlot);
        this.putPieceToSlot(piece2, tempSlot);
    },

    removePiece : function(piece){
        cc.log("mainBoardData: removePiece");

        if(piece.currSlot == -1)
            return;
        this.updateMapPiecePosition(piece.currSlot, -1, piece);
        //var tileObj = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
        piece.pieceDisplay.releaseTileStanding();
        piece.currSlot = -1;
    },

    getPlayerDataAtIndex : function(playerIndex){
        var playerInfo =  gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        return playerInfo.matchData;
    },

    updateMapPiecePosition : function(oldPos, newPos, piece){
        if(oldPos >= 0 && this.pos_piece_map[oldPos] == piece)
            this.pos_piece_map[oldPos]=null;
        if(newPos >= 0)
            this.pos_piece_map[newPos]=piece;
    },

    getPieaceInHomeWithSmallestId : function(playerIndex){
        var pieceListOfPlayer = this.getPlayerDataAtIndex(playerIndex).pieceList;
        var choosedPiece = null;
        for(var i=0; i< pieceListOfPlayer.length; i++){
            if(pieceListOfPlayer[i].getState() == PieceState.ON_HOME){
                if(choosedPiece == null || pieceListOfPlayer[i].pieceIndex < choosedPiece.pieceIndex){
                    choosedPiece = pieceListOfPlayer[i];
                }
            }
        }

        return choosedPiece;
    },

    getPieceOfPlayer : function(playerIndex, pieceIndex){
        var pieceListOfPlayer = this.getPlayerDataAtIndex(playerIndex).pieceList;
        if (pieceIndex >= 0 && pieceIndex < pieceListOfPlayer.length){
            return pieceListOfPlayer[pieceIndex];
        }
        else{
            cc.log("Invalid pieceIndex. PlayerIndex: "+playerIndex+" PieceIndex: "+pieceIndex);
            return null;
        }
    },

    getPieceListSortedByNearestHome: function(playerIndex){
        var pieceList = this.getPlayerDataAtIndex(playerIndex).pieceList;
        var playerStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
        var homeSlot = gv.matchMng.mapper.getSummonSlotForStandPos(playerStandPos);
        var result = [];
        for (var i=0; i<pieceList.length; i++)
            result.push(pieceList[i]);

        var distance1, distance2;
        for (var i=0; i<result.length-1; i++){
            for (var j=i+1; j<result.length; j++){
                distance1 = result[i].currSlot < 0 ? result[i].currSlot : ((result[i].currSlot-homeSlot)+NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD;
                distance2 = result[j].currSlot < 0 ? result[j].currSlot : ((result[j].currSlot-homeSlot)+NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD;
                if (distance1>distance2){
                    var temp = result[i];
                    result[i] = result[j];
                    result[j] = temp;
                }
            }
        }

        var logText = "getPieceListSortedByNearestHome: ";
        for (var i=0; i<result.length; i++){
            logText = logText + " " + result[i].getString();
        }
        DebugUtil.log(logText, true);
        return result;
    },

    getNumberPieceFinished: function(playerIndex){
        var result = 0;
        var pieceList = this.getPlayerDataAtIndex(playerIndex).pieceList;
        for (var pieceIndex = 0; pieceIndex<pieceList.length; pieceIndex++){
            var piece = pieceList[pieceIndex];
            if (piece.state == PieceState.FINISHED){
                result++;
            }
        }
        return result;
    },

    dumpBoardPositionTable : function(){
        var log="";
        for(var key in this.pos_piece_map){
            if(this.pos_piece_map[key]!=undefined && this.pos_piece_map[key] != null)
                log += ("["+key+"] -> " + this.pos_piece_map[key].getString()+" \n ");
        }
        return log;
    }
});