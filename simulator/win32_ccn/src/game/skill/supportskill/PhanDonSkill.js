/**
 * Created by user on 24/3/2017.
 */

var PhanDonSkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.PHAN_DON;
    },

    skillCharge : function(){
        this._super();
        this.target.pieceDisplay.addProtectedShield();
    },

    beginAttack : function(){
        this.target.isProtected = true;
        var tileStanding = gv.matchMng.mapper.getTileForSlot(this.target.currSlot);
        tileStanding.display.setVisibleWall(true);
    },

    checkActiveAbility: function(piece){
        return true;
    },
});