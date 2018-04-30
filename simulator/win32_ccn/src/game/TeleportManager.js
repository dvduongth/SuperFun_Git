/**
 * Created by GSN on 11/13/2015.
 */

var TeleType = {
    NONE : 0,
    TELE_BY_EARTH_QUAKE: 1,
    TELE_INSTANT : 2
};

var TeleportManager = cc.Class.extend({
    mainBoard : null,

    ctor : function(mainboard){
        this.mainBoard = mainboard;
    },

    canTeleport : function(piece, slot){
        var blocker = this.mainBoard.boardData.getPieceAtSlot(slot);
        if(blocker!=null){
            if(blocker.playerIndex == piece.playerIndex){
                return false;
            }
        }

        return true;
    },

    //thu teleport piece, neu thanh cong goi callback voi tham so true, nguoc lai false
    //failed voi cac truong hop : vi tri tele co quan minh dung.
    //teleType: cho biet teleport su dung animation nao.
    //co 2 loai teleType:
    // TELE_BY_BLACKHOLE - piece bi hut vao lo den ben nay, xuat hien o lo den ben kia (hien tai khong su dung loai nay)
    // TELE_INSTANT - piece play animation loc xuay bien mat o ben nay va ngay lap tuc xuat hien o ben kia

    tryTeleportPieceToSlot : function(piece, slot, teleType, callback){
        var canTele = this.canTeleport(piece, slot);
        var blocker = this.mainBoard.boardData.getPieceAtSlot(slot);
        if(!canTele){
            callback(false);
        }
        else{
            piece.kickTarget.push(blocker);
            this.teleportSinglePieceToSlot(teleType, piece, slot, callback);
        }
    },

    teleportSinglePieceToSlot : function(teleType, piece, slot, callback){
        DebugUtil.log("TELEPORT PIECE: "+piece.getString()+" Slot: "+slot, true);
        //if(piece.getState() == PieceState.FINISHED){
        //    piece.pieceDisplay.winFlag.removeFromParent();
        //    piece.pieceDisplay.winFlag = null;
        //}

        this.mainBoard.boardData.removePiece(piece);

        var blockerPiece = this.mainBoard.boardData.getPieceAtSlot(slot);
        if(blockerPiece!=null) {
            this.mainBoard.boardData.removePiece(blockerPiece);
        }

        if (teleType == TeleType.TELE_BY_EARTH_QUAKE){
            var targetTile = gv.matchMng.mapper.getTileForSlot(slot);

            piece.pieceDisplay.runAction(cc.sequence(
                cc.callFunc(function(){
                    var upEffect = fr.AnimationMgr.createAnimationById(resAniId.skill_earthquake, this);
                    upEffect.getAnimation().gotoAndPlay("len", 0, -1, 1);
                    upEffect.setPosition(piece.pieceDisplay.getPosition());
                    upEffect.setCompleteListener(function(){
                        upEffect.removeFromParent();
                    });
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(upEffect, MainBoardZOrder.EFFECT);
                }),
                cc.delayTime(1.4),
                cc.moveBy(0.8, 0, 1000),
                cc.moveBy(0.2, targetTile.getStandingPositionOnTile().x-piece.pieceDisplay.getPosition().x, 0),
                cc.callFunc(function(){
                    this.mainBoard.boardData.putPieceToSlot(piece, slot);

                    var downEffect = fr.AnimationMgr.createAnimationById(resAniId.skill_earthquake, this);
                    downEffect.getAnimation().gotoAndPlay("xuong", 0, -1, 1);
                    downEffect.setPosition(piece.pieceDisplay.getPosition());
                    downEffect.setCompleteListener(function(){
                        downEffect.removeFromParent();
                    });
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(downEffect, piece.pieceDisplay.getLocalZOrder()-1);

                    this.finishTeleportCallback(piece, blockerPiece, callback);
                }.bind(this)),
                cc.moveTo(0.2, targetTile.getStandingPositionOnTile())
            ));
        }
        else if(teleType == TeleType.TELE_INSTANT) {
            var targetTile = gv.matchMng.mapper.getTileForSlot(slot);
            piece.pieceDisplay.teleportOut();
            piece.pieceDisplay.teleportIn(this.finishTeleportCallback.bind(this, piece, blockerPiece, callback), targetTile.getStandingPositionOnTile());
            piece.pieceDisplay.pieceShadow.setEnable(true);

            piece.pieceDisplay.runAction(cc.sequence(
                cc.moveBy(0.4, 0, 2000),
                cc.moveBy(0.1, targetTile.getStandingPositionOnTile().x-piece.pieceDisplay.getPosition().x, 0),
                cc.moveTo(0.4, targetTile.getStandingPositionOnTile()),
                cc.callFunc(function(){
                    this.mainBoard.boardData.putPieceToSlot(piece, slot);
                    piece.pieceDisplay.pieceShadow.setEnable(false);
                }.bind(this))
            ));

            fr.Sound.playSoundEffect(resSound.g_teleport);
        }
    },

    finishTeleportCallback: function(piece, blockerPiece, callback){
        if(blockerPiece!=null){
            blockerPiece.destroy();
            ChangeGoldMgr.getInstance().addListKickInList(piece, blockerPiece);

            if(callback != undefined && callback != null)
                GameUtil.callFunctionWithDelay(3.0, function(){
                    ChangeGoldMgr.getInstance().activeChangeGoldInfo(
                        function(){callback(true);}.bind(this))

                });
        }
        else{
            if(callback != undefined && callback != null)
                callback(true);
        }
    },
});