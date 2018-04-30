/**
 * Created by GSN on 3/8/2016.
 */

var PieceSkill = {
    NONE : 0,

    BACK_KICK: 101,
    AM_SAT: 102,
    EARTHQUAKE: 103,
    ELECTRICITY: 104,
    CUONG_PHONG: 105,
    HAU_DA: 106,

    PHI_NUOC_DAI: 201,
    DI_LUI: 202,
    VUA_LE_HOI: 203,
    HOAN_DOI: 204,
    CHAY_NUOC_RUT: 205,

    RAIN_GOLD:301,
    HORSE_HOE_GOLD:302,
    GOLD_MINE:303,
    THIEF_SKILL:304,
    FREE_TAX:305,
    DECREASE_TAX:306,


    ACCELERATION_SKILL:401,
    ICE_TRAP_SKILL:402,
    MATURE_SKILL:403,
    CONTROL_SKILL:404,
    SHIELD_ANGEL:405,
    PHAN_DON: 406,
    REBORN: 407
};

var PieceSkillGroup = {
    KICK_GROUP: 1,
    MOVE_GROUP: 2,
    MONEY_GROUP: 3,
    SUPPORT_GROUP: 4,
};

var BaseActiveSkill = cc.Class.extend({

    ctor : function(){
        this.skillId = PieceSkill.NONE;
        this.targetTileList = [];
        this.skillCallback = null;
        this.skillInfo = null;
        this.target = null
    },

    init : function(skillInfo){
        this.skillInfo = skillInfo;
    },

    checkActiveAbility: function(piece){
    },

    onResponseSkillResult: function(pieceIndex, option){
    },


    showEmoticonPhase : function(){
        var standPos_skillId_Map = [];
        var playerMng = gv.matchMng.playerManager;

        standPos_skillId_Map[playerMng.getStandPosOfPlayer(this.target.playerIndex)] = this.skillId;

        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);

        guiMainBoard.showSkillPopUp(standPos_skillId_Map, this.skillCharge.bind(this));
    },

    activeSkill : function(target, callback){
        DebugUtil.log("[Skill] Active skill " + this.getString()+ " of target: " + target.playerIndex, true);
        this.skillCallback = callback;
        this.target = target;
        this.showEmoticonPhase();
    },

    skillCharge : function(){
        GameUtil.callFunctionWithDelay(0.5, this.beginAttack.bind(this));
    },

    beginAttack : function(){

    },

    onSkillFinished : function(){
        cc.log("BaseActiveSkill:: onSkillFinished");
        if(this.skillCallback!= undefined && this.skillCallback!= null) {
            GameUtil.callFunctionWithDelay(2.0, this.skillCallback);
        }
    },

    reconnect: function(piece, callback){
        //overwrite me!
        this.target = piece;
        this.skillCallback = callback;
    },

    getStringHistory : function(){
        return this.getString();
    },

    getString : function(){
        switch (this.skillId){
            //1x
            case PieceSkill.BACK_KICK:
                return "BACK_KICK";
            case PieceSkill.AM_SAT:
                return "AM_SAT";
            case PieceSkill.EARTHQUAKE:
                return "EARTHQUAKE";
            case PieceSkill.ELECTRICITY:
                return "ELECTRICITY";
            case PieceSkill.CUONG_PHONG:
                return "CUONG_PHONG";
            case PieceSkill.HAU_DA:
                return "HAU_DA";

            //2x
            case PieceSkill.PHI_NUOC_DAI:
                return "PHI_NUOC_DAI";
            case PieceSkill.DI_LUI:
                return "DI_LUI";
            case PieceSkill.VUA_LE_HOI:
                return "VUA_LE_HOI";
            case PieceSkill.HOAN_DOI:
                return "HOAN_DOI";
            case PieceSkill.CHAY_NUOC_RUT:
                return "CHAY_NUOC_RUT";

            //3x
            case PieceSkill.RAIN_GOLD:
                return "RAIN_GOLD_SKILL";
            case PieceSkill.HORSE_HOE_GOLD:
                return "HORSE_HOE_GOLD_SKILL";
            case PieceSkill.GOLD_MINE:
                return "GOLD_MINE_SKILL";
            case PieceSkill.THIEF_SKILL:
                return "THIEF_SKILL";
            case PieceSkill.DECREASE_TAX:
                return "DECREASE_TAX";
            case PieceSkill.FREE_TAX:
                return "FREE_TAX";

            //4x
            case PieceSkill.ACCELERATION_SKILL:
                return "ACCELERATION_SKILL";
            case PieceSkill.ICE_TRAP_SKILL:
                return "ICE_TRAP_SKILL";
            case PieceSkill.CONTROL_SKILL:
                return "CONTROL_SKILL";
            case PieceSkill.MATURE_SKILL:
                return "MATURE_SKILL";
            case PieceSkill.SHIELD_ANGEL:
                return "FREE_FIRST_KICK_SKILL";
            case PieceSkill.PHAN_DON:
                return "PHAN_DON";
            case PieceSkill.REBORN:
                return "REBORN";
            default :
                return "Unknown";
        }
    },

    getSkillGroup: function() {
        if (this.skillId>=400)  return PieceSkillGroup.SUPPORT_GROUP;
        else if (this.skillId>=300) return PieceSkillGroup.MONEY_GROUP;
        else if (this.skillId>=200) return PieceSkillGroup.MOVE_GROUP;
        else if (this.skillId>=100) return PieceSkillGroup.KICK_GROUP;
    },

});