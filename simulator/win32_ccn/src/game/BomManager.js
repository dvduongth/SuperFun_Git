/**
 * Created by user on 22/3/2017.
 */

/**
 * Created by GSN on 11/13/2015.
 */

var BomManager = cc.Class.extend({
    ctor : function(){
        this.BOM_REMAIN_TURN = 3;
    },

    getPlayerIndexOfBom: function(){
        var bomTileList = gv.matchMng.mapper.getBomTileList();
        return bomTileList[0].bomOwnerIndex;
    },

    initBoomTile: function(){
        var bomTileList = gv.matchMng.mapper.getBomTileList();
        for (var i=0; i<bomTileList.length; i++){
            var bomTile = bomTileList[i];
            if (bomTile.bomOwnerIndex!=-1){
                bomTile.display.addBoomChangeEffect();
                bomTile.reloadTile();
            }
        }
    },

    onActiveBom: function(tile, piece, callback){
        DebugUtil.log("onActiveBom");
        var bomTileList = gv.matchMng.mapper.getBomTileList();
        var startIndex = Math.floor(piece.currSlot/10);
        if (tile.bomOwnerIndex == -1){
            for (var i=0; i<bomTileList.length; i++){
                var bomTile = bomTileList[(i+startIndex)%bomTileList.length];
                bomTile.bomOwnerIndex = piece.playerIndex;
                bomTile.bomRemainTurn = this.BOM_REMAIN_TURN;

                GameUtil.callFunctionWithDelay(i*0.8, function(bomTile){
                    bomTile.display.addBoomChangeEffect(function(bomTile){
                        bomTile.reloadTile();
                        bomTile.display.setBomRemain(bomTile.bomRemainTurn);
                    }.bind(this, bomTile));

                }.bind(this, bomTile));
            }
            DebugUtil.log("onActiveBom: player " + piece.playerIndex + "active bom, time remain = " +  this.BOM_REMAIN_TURN);
            GameUtil.callFunctionWithDelay(3, callback);
        }
        else{
            if (tile.bomOwnerIndex != piece.playerIndex){
                piece.destroy(callback, resAniId.tile_bom_explode);

                var pieceReceiveMoney = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(tile.bomOwnerIndex, 0);
                ChangeGoldMgr.getInstance().addListKickInList(pieceReceiveMoney, piece);
                for (var i=0; i<bomTileList.length; i++){
                    var bomTile = bomTileList[i];
                    bomTile.bomOwnerIndex = -1;
                    bomTile.bomRemainTurn = 0;
                    bomTile.reloadTile();
                    bomTile.display.setBomRemain(bomTile.bomRemainTurn);
                }
                DebugUtil.log("onActiveBom: player " + piece.playerIndex + " died by bom, reset all bom");

            }
            else{
                for (var i=0; i<bomTileList.length; i++) {
                    var bomTile = bomTileList[(i+startIndex)%bomTileList.length];
                    bomTile.bomRemainTurn = this.BOM_REMAIN_TURN;
                    bomTile.reloadTile();
                    bomTile.display.setBomRemain(bomTile.bomRemainTurn);
                }
                DebugUtil.log("onActiveBom: player " + piece.playerIndex + " re-occupy bom, time remain = " + this.BOM_REMAIN_TURN);
                callback();
            }
        }
    },

    updateBomTurn: function(){
        var bomTileList = gv.matchMng.mapper.getBomTileList();
        for (var i=0; i<bomTileList.length; i++) {
            var bomTile = bomTileList[i];
            if (bomTile.bomRemainTurn>0){
                bomTile.bomRemainTurn--;

                if (bomTile.bomRemainTurn==0){
                    bomTile.bomOwnerIndex = -1;
                    bomTile.reloadTile();
                }
                bomTile.display.setBomRemain( bomTile.bomRemainTurn);

                //Log
                if (i==0){
                    DebugUtil.log("Update Bom Turn: playerIndex = " + bomTile.bomOwnerIndex + ", remainTurn = " + bomTile.bomRemainTurn);
                }
            }
        }
    },

    clearAllBom: function(playerIndex) {
        var bomTileList = gv.matchMng.mapper.getBomTileList();
        for (var i = 0; i < bomTileList.length; i++) {
            var bomTile = bomTileList[i];
            if (bomTile.bomOwnerIndex == playerIndex){
                bomTile.bomRemainTurn = 0;
                bomTile.bomOwnerIndex = -1;
                bomTile.reloadTile();
                bomTile.display.setBomRemain( bomTile.bomRemainTurn);
            }
        }
    },

    toString: function(){
        var result = "";
        var bomTileList = gv.matchMng.mapper.getBomTileList();
        var bomTile = bomTileList[0];
        if (bomTile.bomOwnerIndex==-1){
            result = "Bom Tile Clear";
        }
        else{
            result = "Bom Tile belong to Player: " + bomTile.bomOwnerIndex + ", time remain = " + bomTile.bomRemainTurn;
        }
        return result;
    },

});