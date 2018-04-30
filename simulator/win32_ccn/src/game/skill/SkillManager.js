/**
 * Created by GSN on 3/7/2016.
 */

var SkillContext = {
    ON_ROLL_DICE_TO_KICK: "ON_ROLL_DICE_TO_KICK",
    ON_ROLL_DICE_TO_MOVE: "ON_ROLL_DICE_TO_MOVE",
    ON_MOVE_TO_KICK: "ON_MOVE_TO_KICK",
    ON_FINISH_ACTION_KICK: "ON_FINISH_ACTION_KICK",
    ON_MOVE_ON_BOARD: "ON_MOVE_ON_BOARD",
    ON_SUMMON_ROLL_DICE: "ON_SUMMON_ROLL_DICE",
    ON_START_GAME: "ON_START_GAME",
    ON_CALCULATE_KICK_FEE:"ON_CALCULATE_KICK_FEE",
    ON_BONUS_FIRST_LOAD: "ON_BONUS_FIRST_LOAD",
    ON_START_CELL:"ON_START_CELL",
    ON_ADD_REWARD: "ON_ADD_REWARD",
    PASSIVE: "PASSIVE",
    ON_FIRST_BE_KICKED:"ON_FIRST_BE_KICKED",
    ON_ACTIVE_TO_MOVE:"ON_ACTIVE_TO_MOVE",
    ON_TAX_CELL:"ON_TAX_CELL",
    ON_LOAD_STABLE: "ON_LOAD_STABLE",
    ON_END_GAME: "ON_END_GAME",
    ON_BEFORE_BE_KICKED: "ON_BEFORE_BE_KICKED",
    ON_DIED: "ON_DIED"
};

var SkillObjectData = cc.Class.extend({
    ctor : function(){
        this.enabled = false;
        this.activePiece = null;
        this.activeSkill = null;
    },

    resetData: function(){
        this.enabled = false;
        this.activePiece = null;
        this.activeSkill = null;
    }
});

var SkillManager = cc.Class.extend({

    ctor : function(){
        this.playerIndex_Skills = [];
        this.playerIndex_cheatActiveSkill = [];

        this.skillId_player_enable = [];
        var allSkills = CharacterConfig.getInstance().getAllSkills();
        for (var i=0; i<allSkills.length; i++){
            var skillId = allSkills[i];
            this.skillId_player_enable[skillId] = [];
            for (var playerIndex=0; playerIndex<gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
                this.skillId_player_enable[skillId][playerIndex] = true;
            }
        }
        //this.curActiveSkill = null;

        //Data cua skill trong moi turn choi
        this.skillDataInTurn = [];
        for(var i=0;i<MAX_NUMBER_PLAYER;i++){
            this.skillDataInTurn[i] = new SkillObjectData();
        }
    },

    initSkillForPlayer : function(playerIndex){
        // thong tin nay server tra ve tu dau van choi
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var skillMap = [];
        var usedPieceInfo = playerInfo.playerStatus.mainCharacter;
        for(var i=0; i< usedPieceInfo.skillList.length; i++){
            var skillObj = null;
            switch (usedPieceInfo.skillList[i]){
                case PieceSkill.BACK_KICK:
                    skillObj = new BackKickSkill();
                    break;
                case PieceSkill.AM_SAT:
                    skillObj = new AmSatSkill();
                    break;
                case PieceSkill.EARTHQUAKE:
                    skillObj = new EarthquakeSkill();
                    break;
                case PieceSkill.ELECTRICITY:
                    skillObj = new ElectricitySkill();
                    break;
                case PieceSkill.CUONG_PHONG:
                    skillObj = new CuongPhongSkill();
                    break;
                case PieceSkill.HAU_DA:
                    skillObj = new HauDaSkill();
                    break;
                //2x
                case PieceSkill.PHI_NUOC_DAI:
                    skillObj = new PhiNuocDaiSkill();
                    break;
                case PieceSkill.DI_LUI:
                    skillObj = new DiLuiSkill();
                    break;
                case PieceSkill.VUA_LE_HOI:
                    skillObj = new VuaLeHoiSkill();
                    break;
                case PieceSkill.HOAN_DOI:
                    skillObj = new HoanDoiSkill();
                    break;
                case PieceSkill.CHAY_NUOC_RUT:
                    skillObj = new ChayNuocRutSkill();
                    break;
                //3x
                case PieceSkill.HORSE_HOE_GOLD:{
                    skillObj = new HorsehoeGoldSkill(playerIndex);
                    break;
                }
                case PieceSkill.RAIN_GOLD:{
                    skillObj = new RainGoldSkill();
                    break;
                }
                case PieceSkill.GOLD_MINE:{
                    skillObj = new GoldMineSkill();
                    break;
                }
                case PieceSkill.THIEF_SKILL:{
                    skillObj = new ThiefSkill();
                    break;
                }
                //4x
                case PieceSkill.ACCELERATION_SKILL:{
                    skillObj = new AccelerationSkill();
                    break;
                }
                case PieceSkill.CONTROL_SKILL:{
                    skillObj = new ControlSkill();// cai nay co the khong dung
                    break;
                }
                case PieceSkill.ICE_TRAP_SKILL:{
                    skillObj = new IceTrapSkill();
                    break;
                }
                case PieceSkill.MATURE_SKILL:{
                    skillObj = new MatureSkill();// cai nai cung co the khong dung
                    break;
                }
                case PieceSkill.SHIELD_ANGEL:{
                    skillObj = new ShieldAngelSkill();
                    break;
                }
                case PieceSkill.PHAN_DON:
                    skillObj = new PhanDonSkill();
                    break;
                case PieceSkill.REBORN:{
                    skillObj = new RebornSkill();
                    break;
                }
                case PieceSkill.FREE_TAX:{
                    skillObj = new FreeTaxSkill();
                    break;
                }
                case PieceSkill.DECREASE_TAX:{
                    skillObj = new DecreaseTaxSkill();
                    break;
                }

                default :
                    cc.assert(false, "Invalid skill Id: "+usedPieceInfo.skillList[i]);
            }
            if(skillObj!=null){
                skillObj.init(CharacterConfig.getInstance().getSkillInfoById(usedPieceInfo.skillList[i], usedPieceInfo.clazz));
                skillMap[skillObj.skillId] = skillObj;
            }
        }
        this.playerIndex_Skills[playerIndex] = skillMap;

        this.playerIndex_cheatActiveSkill[playerIndex] = false;
    },

    tryActiveSkill: function(skillContext, playerIndex, pieceIndex,callback){
        DebugUtil.log("TryActiveSkill " + skillContext, true);

        var charCf = CharacterConfig.getInstance();

        var skillMap = this.playerIndex_Skills[playerIndex];
        var consistentSkillList = [];
        for (var skillId in skillMap){
            if ((charCf.getSkillContextById(skillId) == skillContext) && (this.skillId_player_enable[skillId][playerIndex])){
                this.skillId_player_enable[skillId][playerIndex] = false;
                consistentSkillList.push(skillId);
            }
        }

        if (consistentSkillList.length>0){
            //sort theo do uu tien
            // bubble sort :)
            for (var i=0; i<consistentSkillList.length-1; i++){
                for (var j=i+1; j<consistentSkillList.length; j++){
                    if (charCf.getSkillPrioritytById(consistentSkillList[i]) < charCf.getSkillPrioritytById(consistentSkillList[j])){
                        var temp = consistentSkillList[i];
                        consistentSkillList[i] = consistentSkillList[j];
                        consistentSkillList[j] = temp;
                    }
                }
            }

            return this.tryActiveConsistentSkill(skillContext, playerIndex, pieceIndex, consistentSkillList,callback);
            //var isActive = this.tryActiveConsistentSkill(skillContext, playerIndex, pieceIndex, consistentSkillList);
            //return isActive;
        }
        cc.log("SkillMgr: No Skill consistent");
        return false;
    },

    tryActiveConsistentSkill: function(skillContext, playerIndex, pieceIndex, consistentSkillList,callback){
        var charCf = CharacterConfig.getInstance();
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, pieceIndex);
        var skillMap = this.playerIndex_Skills[playerIndex];
        if(consistentSkillList.length>0){// nghia la active 1 skill khac roi ,neu khong thi se khong vao day?
            if(piece!=null && piece.isInZoo()&&(skillContext!=SkillContext.ON_CALCULATE_KICK_FEE)&&(skillContext!= SkillContext.ON_ACTIVE_TO_MOVE)){
                cc.log("piece is in zoo, can't active skill")
                return false;
            }
        }
        while(consistentSkillList.length>0){


            var skillId = consistentSkillList[0];
            var skillObj = skillMap[skillId];
            var mainChar = playerInfo.playerStatus.mainCharacter;
            var skillInfo = charCf.getSkillInfoById(skillId, mainChar.clazz);
            var chance = charCf.getTotalChanceOfSkill(skillInfo, mainChar.level);

            var chanceSuccess;
            if (this.playerIndex_cheatActiveSkill[playerIndex])
                chanceSuccess = true;
            else
                chanceSuccess = GameGenerator.getInstance().randomSkillResult(skillId, chance);

            consistentSkillList.splice(0,1);
            var target = null;
            switch (skillContext){
                case SkillContext.ON_START_GAME:// vua bat dau game
                case SkillContext.ON_ROLL_DICE_TO_KICK: //
                case SkillContext.ON_ROLL_DICE_TO_MOVE:
                case SkillContext.ON_END_GAME:
                case SkillContext.PASSIVE:
                case SkillContext.ON_FIRST_BE_KICKED:{
                    target = playerInfo;
                    break;
                }
                case SkillContext.ON_CALCULATE_KICK_FEE:
                case SkillContext.ON_SUMMON_ROLL_DICE:
                case SkillContext.ON_MOVE_TO_KICK:
                case SkillContext.ON_START_CELL:
                case SkillContext.ON_MOVE_ON_BOARD:
                case SkillContext.ON_FINISH_ACTION_KICK:
                case SkillContext.ON_BONUS_FIRST_LOAD:
                case SkillContext.ON_ACTIVE_TO_MOVE:
                case SkillContext.ON_BEFORE_BE_KICKED:
                case SkillContext.ON_DIED:
                case SkillContext.ON_TAX_CELL:
                    this.skillDataInTurn[playerIndex].activePiece = piece;
                    target = piece;
                    break;
            }
            DebugUtil.log("[Skill] RandomSkill [" + playerIndex + "," + pieceIndex + "," + skillObj.getString()+ ",nCalled = "+ GameGenerator.getInstance().getCountOfRandom()+"]", true);

            if ((chanceSuccess) && skillObj.checkActiveAbility(target)) {
                skillObj.activeSkill(target, this.tryActiveConsistentSkill.bind(this, skillContext, playerIndex, pieceIndex, [],callback));
                this.skillDataInTurn[playerIndex].enabled = true;
                this.skillDataInTurn[playerIndex].activeSkill = skillObj;
                return true;
            }
        }

        if (this.skillDataInTurn[playerIndex].enabled){
            var skillDataInTurn = this.skillDataInTurn[playerIndex];
            skillDataInTurn.enabled = false;
            this.onPieceSkillFinishActive(skillDataInTurn.activePiece, skillDataInTurn.activeSkill, skillContext,callback);
        }
        return false;
    },

    onPieceSkillFinishActive : function(piece, skillObj,skillContext,callback){
        if(piece!=null){
            cc.log("MainBoard: onPieceSkillFinishActive: piece = " + piece.getString());// + ", skill = " + skillObj.getString());
        }else{
            cc.log("MainBoard: onPieceSkillFinishActive");
        }

        if(callback!=null){ //trong ham activeTileBefore can phai truyen callback, vi active xong khong tinh lai pieceAction
            callback();
            return;
        }

        switch (skillContext){
            case SkillContext.ON_START_GAME:
            case SkillContext.ON_FIRST_BE_KICKED:
            case SkillContext.ON_BEFORE_BE_KICKED:
                return false;
            case SkillContext.ON_BONUS_FIRST_LOAD:{
                gv.matchMng.onPieceActionMoveFinish(piece);
                return false;
            }
            case SkillContext.ON_ACTIVE_TO_MOVE:{
                if ((piece!=null) && (this.skillDataInTurn[piece.playerIndex].activeSkill.skillId == PieceSkill.ICE_TRAP_SKILL)){
                    piece.performSolution(piece.selectedSolution);
                    //return false;
                }else{
                    gv.matchMng.mainBoard.onPieceFinishedActiveMove(piece, PieceAction.ACTIVE_SKILL);
                }
                return;
            }
            case SkillContext.ON_DIED:{
                gv.matchMng.mainBoard.onActiveTileFeature(piece);
                return false;
            }
            case SkillContext.ON_FINISH_ACTION_KICK:{
                //truong hop piece di chuyen duoc
                if (piece.solutionList.length>0){
                    gv.matchMng.mainBoard.onPieceActiveSkill(piece, PieceAction.ACTIVE_SKILL);
                }//
                else{//truong hop piece ko di chuyen duoc
                    gv.matchMng.onPieceActionMoveFinish(null);
                }
                return;
            }
            case SkillContext.ON_TAX_CELL:
            case SkillContext.ON_START_CELL:{
                gv.matchMng.onPieceActionMoveFinish(piece);
                return;
            }
            case SkillContext.ON_ROLL_DICE_TO_KICK:
            case SkillContext.ON_ROLL_DICE_TO_MOVE:
            case SkillContext.ON_SUMMON_ROLL_DICE:{
                gv.matchMng.mainBoard.onPieceFinishedActiveMove(piece, PieceAction.ACTIVE_SKILL);
                return;
            }
        }
        gv.matchMng.mainBoard.onPieceActiveSkill(piece, PieceAction.ACTIVE_SKILL);
    },

    resetSkillContextEnableOnTurn: function(){
        DebugUtil.log("resetSkillContextEnableOnTurn",true);
        var allSkills = CharacterConfig.getInstance().getAllSkills();
        for (var i=0; i<allSkills.length; i++){
            var skillId = allSkills[i];
            for (var playerIndex=0; playerIndex<gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
                this.skillId_player_enable[skillId][playerIndex] = true;
            }
        }

        for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
            this.skillDataInTurn[i].resetData();
        }
    },

    reconnect: function(pieceSkillIndex, skillId){
        if(gv.matchMng.isMineTurn()){
            var skillObj = this.playerIndex_Skills[gv.matchMng.currTurnPlayerIndex][skillId];
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex, pieceSkillIndex);
            skillObj.reconnect(piece, this.onPieceSkillFinishActive.bind(this, piece, skillObj));
            this.skillDataInTurn[gv.matchMng.currTurnPlayerIndex].activeSkill = skillObj;
        }
        else{
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.WAIT_PIECE_ACTION);
        }
    },
});