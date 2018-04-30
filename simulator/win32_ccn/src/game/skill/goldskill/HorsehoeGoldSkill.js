/**
 * Created by GSN on 9/26/2016.
 */
// skill mong ngua vang
var HorsehoeGoldSkill = BaseActiveSkill.extend({

    ctor: function () {
        this._super();
        this.skillId = PieceSkill.HORSE_HOE_GOLD;
    },

    skillCharge : function(){
        this._super();
        var size = cc.winSize;
        var x1  = fr.AnimationMgr.createAnimationById(resAniId.skillmongngua_xuat, this);
        x1.getAnimation().gotoAndPlay("run", 0, 2, 1);
        var fixSize = 100;
        switch (this.target.playerIndex){
            case 0:{
                x1.setPosition( - fixSize,-size.height/2 + fixSize);
                x1.setRotation(45);
                break;
            }
            case 1:{
                x1.setPosition(size.width/2 - fixSize,- fixSize);
                x1.setRotation(-45);
                break;
            }
            case 2:{
                x1.setPosition(fixSize,size.height/2 - fixSize);
                x1.setRotation(-135);
                break;
            }
            case 3:{
                x1.setPosition(-size.width/2+ fixSize, fixSize);
                x1.setRotation(-225);
                break;
            }
        }
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(x1, MainBoardZOrder.EFFECT);
        x1.setCompleteListener(function(){
            this.removeFromParent();
        });
        fr.Sound.playSoundEffect(resSound.skill_mongvang);
    },

    beginAttack : function(){
        ChangeGoldMgr.getInstance().addChangeGoldByHorseHoeGold(this.target.playerIndex);
        ChangeGoldMgr.getInstance().activeChangeGoldInfo(this.skillCallback);
    },

    checkActiveAbility: function(){
        for (var i=0 ; i < ChangeGoldMgr.getInstance().listGoldKickHorseHoe.length;i++){
            if(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(ChangeGoldMgr.getInstance().listGoldKickHorseHoe[i].playerTargetKick).playerStatus.gold>0){
                return true;
            }
        }
        return false;
    }
});