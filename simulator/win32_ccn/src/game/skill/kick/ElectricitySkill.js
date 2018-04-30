/**
 * Created by GSN on 5/16/2016.
 */

//skill giat set tu tren xuong
var ElectricitySkill = BaseActiveSkill.extend({

    ctor : function(){
        this._super();
        this.skillId = PieceSkill.ELECTRICITY;

        this.NUMBER_ATTACK_TILE = 3;
        this.NUMBER_LIMIT_TILE = 6;
    },

    skillCharge : function(){
        this._super();

        var castSkill = fr.AnimationMgr.createAnimationById(resAniId.skill_elect, this);
        castSkill.getAnimation().gotoAndPlay("step1", 0, -1, 1);
        castSkill.setPosition(this.target.pieceDisplay.getPosition());
        castSkill.setCompleteListener(function(){
            castSkill.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(castSkill, MainBoardZOrder.EFFECT);
    },

    beginAttack : function(){
        this.calculateTargetList(this.target);

        for(var i=0; i< this.targetTileList.length; i++){
            var currTile = this.targetTileList[i];
            var delay = 0.5*i;
            GameUtil.callFunctionWithDelay(delay, this.launchElectricity.bind(this, currTile));
        }
        GameUtil.callFunctionWithDelay(4.0, this.onSkillFinished.bind(this));
    },

    launchElectricity : function(targetTile){
        var electSkill = fr.AnimationMgr.createAnimationById(resAniId.skill_elect, this);
        electSkill.getAnimation().gotoAndPlay("step2", 0, -1, 1);
        electSkill.setPosition(targetTile.getStandingPositionOnTile());
        electSkill.setCompleteListener(function(){
            electSkill.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(electSkill, MainBoardZOrder.EFFECT);

        this.onSingleTileAttacked(targetTile);
    },

    //callback duoc goi khi co mot con ngua cua skill roi xuong
    //tile: tile co con ngua roi xuong
    onSingleTileAttacked : function(tile){
        var khoibuinguagiam = fr.AnimationMgr.createAnimationById(resAniId.khoibuinguagiam, this);
        khoibuinguagiam.getAnimation().gotoAndPlay("run", 0, -1, 1);
        khoibuinguagiam.setPosition(tile.getStandingPositionOnTile());
        khoibuinguagiam.setCompleteListener(function(){
            khoibuinguagiam.removeFromParent();
        });
        var guiMainboard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        guiMainboard.addChild(khoibuinguagiam, tile.getZOrderForPiece());

        ShakeEffect.addShakeEffectToNode(1, guiMainboard, 6,guiMainboard.guiMainBoardPosition);
        fr.Sound.playSoundEffect(resSound.skill_thunder);

        var targetPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(tile.index);
        if(targetPiece!=null && targetPiece.playerIndex!=gv.matchMng.getCurrTurnPlayerIndex()){
           // var playerTarget = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(targetPiece.playerIndex);
            //cc.log("Sky horseInfo skill: kick piece at tile: " + tile.index);
            this.target.kickedList.push(targetPiece);
            ChangeGoldMgr.getInstance().addListKickInList(this.target, targetPiece);
            targetPiece.destroyWithBink(0, null);
        }
    },

    checkActiveAbility: function(piece){
        return (piece.isCanMovingOnBoard() && this.checkEnemyInRange(piece));
    },

    checkEnemyInRange: function(piece){
        var curTileIndex = piece.pieceDisplay.tileStanding.index;
        var totalTile = this.NUMBER_LIMIT_TILE;//this.skillInfo.value[this.skillInfo.value.length-1];
        for (var i=0; i<totalTile; i++){
            curTileIndex = (curTileIndex+1) % NUMBER_SLOT_IN_BOARD;
            var curTile = gv.matchMng.mapper.getTileForSlot(curTileIndex);
            var targetPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(curTile.index);
            if(targetPiece!=null && targetPiece.playerIndex!=piece.playerIndex){//day la o co dich
                cc.log("[Skill] Detected Enemy at " + curTile.index);
                return true;
            }
        }
        return false;
    },

    calculateTargetList: function(piece){
        this.targetTileList = [];
        var pieceTileIndex = piece.pieceDisplay.tileStanding.index;

        var randomList = [];
        for (var i=1; i<=this.NUMBER_LIMIT_TILE; i++)
            randomList.push(i);

        for (var i=0; i<this.NUMBER_ATTACK_TILE; i++){
            var randomIndex = GameGenerator.getInstance().random.randomInt(0, randomList.length);
            cc.log("randomIndex=" + randomIndex);
            var randomTileSlot = (pieceTileIndex + randomList[randomIndex]) % NUMBER_SLOT_IN_BOARD;
            cc.log("randomTileSlot=" + randomTileSlot);
            this.targetTileList.push(gv.matchMng.mapper.getTileForSlot(randomTileSlot));
            randomList.splice(randomIndex,1);
        }

        //just for log
        var logText = "[Skill] Target = [";
        for (var i=0; i<this.targetTileList.length; i++){
            logText+=this.targetTileList[i].index+ (i==this.targetTileList.length-1?"]":",");
        }
        fr.GameLog.log(logText);
    }
});