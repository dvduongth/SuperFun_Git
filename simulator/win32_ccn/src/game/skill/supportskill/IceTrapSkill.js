/**
 * Created by GSN on 9/26/2016.
 */
// skill bay bang
var IceTrapSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.ICE_TRAP_SKILL;
    },

    skillCharge : function(){
        // todo can 1 skill charge de the hien viec dat bay bang?
        this._super();
        var kamejoko  = new cc.ParticleSystem("res/particle/Particle/particle_baybang.plist");
        kamejoko.setScale(1/2,1/2);
        kamejoko.setPosition(this.target.pieceDisplay.getPosition());
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(kamejoko, MainBoardZOrder.EFFECT);
        kamejoko.runAction(cc.sequence(
            cc.fadeOut(2),
            cc.callFunc(function(){
                kamejoko.removeFromParent();
            })
        ));
        kamejoko.runAction(cc.moveTo(1.5,kamejoko.getPosition().x,kamejoko.getPosition().y-50));

        fr.Sound.playSoundEffect(resSound.skill_freeze_bomb);
    },

    beginAttack : function(){
        var tileObj = gv.matchMng.mapper.getTileForSlot(this.target.currSlot);
        tileObj.display.setFreezeTile();
        this.skillCallback();
    },

    checkActiveAbility: function(piece) {
        var slot = piece.currSlot;
        var tile = gv.matchMng.mapper.getTileForSlot(slot);
        if(tile.type != TileType.TILE_NORMAL) return false;
        return gv.matchMng.diceManager.lastDiceResult.score1 == gv.matchMng.diceManager.lastDiceResult.score2;
    }
});
