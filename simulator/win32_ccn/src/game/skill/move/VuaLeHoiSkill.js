/**
 * Created by user on 20/1/2017.
 */

var VuaLeHoiSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.VUA_LE_HOI;
    },

    skillCharge : function(){
        this._super();

        var castSkillEff = fr.AnimationMgr.createAnimationById(resAniId.cast_skill_vua_le_hoi, this);
        castSkillEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        castSkillEff.setPosition(this.target.pieceDisplay.getPosition());
        castSkillEff.setCompleteListener(function(){
            castSkillEff.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkillEff, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        //var randomIndex = GameGenerator.getInstance().random.randomInt(0, this.specialTileList.length);
        var targetTile = this.specialTileList[0];
        gv.matchMng.mainBoard.teleportMgr.tryTeleportPieceToSlot(this.target, targetTile.index, TeleType.TELE_BY_EARTH_QUAKE, function(){
            this.onSkillFinished();
        }.bind(this));
    },

    checkActiveAbility: function(piece){
        this.specialTileList = [];

        //var miniGame1Tile = gv.matchMng.mapper.getSpecialTile(TileType.TILE_MINI_GAME_1);
        var miniGame2Tile = gv.matchMng.mapper.getSpecialTile(TileType.TILE_MINI_GAME);

        //var pieceInMiniGame1 = gv.matchMng.mainBoard.boardData.getPieceAtSlot(miniGame1Tile.index);
        //if (pieceInMiniGame1== null || (pieceInMiniGame1!=null && gv.matchMng.isEnemy(piece.playerIndex, pieceInMiniGame1.playerIndex))) {
        //    this.specialTileList.push(miniGame1Tile);
        //}

        var pieceInMiniGame2 = gv.matchMng.mainBoard.boardData.getPieceAtSlot(miniGame2Tile.index);
        if(!miniGame2Tile.tileUp){
            if (pieceInMiniGame2== null || (pieceInMiniGame2!=null && gv.matchMng.isEnemy(piece.playerIndex, pieceInMiniGame2.playerIndex))){
                this.specialTileList.push(miniGame2Tile);
            }
        }
        return (this.specialTileList.length>0);
    },
});