/**
 * Created by user on 20/1/2017.
 */

var ChayNuocRutSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.CHAY_NUOC_RUT;
        this.desTile = null;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_di_chuyen, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        gv.matchMng.mainBoard.teleportMgr.tryTeleportPieceToSlot(this.target, this.desTile.index, TeleType.TELE_BY_EARTH_QUAKE, function(){
            this.onSkillFinished();
        }.bind(this));
    },

    checkActiveAbility: function(piece){
        var diceResult =  gv.matchMng.diceManager.lastDiceResult;
        if(!piece.isCanMovingOnBoard()) return false;
        if ((diceResult.score1+diceResult.score2)%2==0) {
            var desTile = this.getNearestDestinationGate(piece);
            if(desTile==null){
                return false;
            }
            DebugUtil.log("ChayNuocRutSkill: NearestDestinationGate = " + desTile.index);
            var desPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(desTile.index);
            if (desPiece==null || ((desPiece!=null) && (gv.matchMng.isEnemy(desPiece.playerIndex, piece.playerIndex)))){
                this.desTile = desTile;
                return true;
            }
        }
        return false;
    },

    getNearestDestinationGate: function(piece){
        var curSlot = piece.currSlot;
        while (0<=curSlot && curSlot<100){
            curSlot = GameUtil.addSlot(curSlot,1,piece.playerIndex);
            var curTile = gv.matchMng.mapper.getTileForSlot(curSlot);
            if ((curTile!=null) && (curTile.type == TileType.TILE_DESTINATION_GATE)){
                if(curTile.tileUp){
                    return null
                }
                return curTile;
            }
        }
        return null;
    },
});