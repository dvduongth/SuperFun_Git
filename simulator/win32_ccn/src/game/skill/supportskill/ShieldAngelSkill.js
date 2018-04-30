/**
 * Created by GSN on 9/26/2016.
 */
// skill khien ho menh
var ShieldAngelSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.SHIELD_ANGEL;
    },

    skillCharge : function(){
        this._super();
        fr.Sound.playSoundEffect(resSound.skill_shield);
    },

    beginAttack : function(){

    },

    checkActiveAbility: function(){
        return true;
    }
});