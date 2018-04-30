/**
 * Created by GSN on 8/5/2015.
 */
var MoveType = {
    FREEZE_TRAP:0,
    TILE_UP:1
};



var PieceState = {
    NONE : 0,
    ON_HOME : 1,
    MOVING_TO_DES : 2,
    ON_DES : 3,
    FINISHED : 4
};

var PieceAction = {
    NONE : 0,
    NORMAL_MOVE : 1,
    KICK_OTHER : 2,
    SUMMON : 3,
    LOAD_TO_DES : 4,
    ACTIVE_SKILL: 5
};
//
//var SummonType = {
//    AUTO_SUMMON : 0,
//    FORCE_SUMMON : 1
//};

KickType = {
    NONE : 0,
    SCREEN_BREAK : 1,
    EXPLOSION : 2
};

var Piece = cc.Class.extend({

    ctor: function(){
        this.pieceDisplay = null;
        this.playerIndex = -1;
        this.pieceIndex = -1;
        this.kickType = KickType.NONE;
        this.currSlot = -1;
        this.state  = PieceState.NONE;
        //this.moveTarget  = -1;
        this.numberCombo  = 0;
        this.hintPath = null;
        //this.summonNumbers  = [];
        //this.kickNumbers  = [];
        this.solutionList  = [];//phuong an di chuyen
        this.selectedSolution  = -1;
        this.protected = false;
        this.kickTarget = [];
        this.kickedList = [];

        this.isFreeze = false;
        //this.isProtected = false;

        this.isMoveByTileUp = false;
    },

    init : function(playerIndex, pieceIndex, pieceId, color){

        this.playerIndex = playerIndex;
        this.pieceIndex = pieceIndex;
        this.pieceDisplay = new PieceDisplay(pieceId, color, this);

        var lineControl = new LineControl(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).standPos,this.pieceDisplay);
        this.pieceDisplay.lineControl = lineControl;
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(lineControl,10000);
        lineControl.setVisible(false);
    },



    resetCombo : function(){
        this.numberCombo = 0;
    },

    increaseNumberCombo : function(){
        this.numberCombo++;
    },

    getNumberCombo : function(){
        return this.numberCombo;
    },

    isFinishLoad : function(){
        return this.getState() == PieceState.FINISHED;
    },

    getCurrentSlot : function(){
        return this.currSlot;
    },

    getPosition:function(){
        return this.pieceDisplay.getPosition();
    },

    setPosition: function(x, y){
        this.pieceDisplay.setPosition(x,y);
    },

    setVisible:function(visible){
      this.pieceDisplay.setVisible(visible);
    },

    attachToScreen : function(parentLayer){
        //parentLayer.addChild(this.pieceDisplay, this.pieceDisplay.getLocalZOrder());
        parentLayer.addChild(this.pieceDisplay, PLAYER_ZORDER-1);
        this.pieceDisplay.zOrder = this.pieceDisplay.getLocalZOrder();
    },

    removeFromScreen : function(){
        this.pieceDisplay.removeFromScreen();
    },

    isInZoo:function(){// con nay dang o so thu hay khong? lien quan den context ON_ROLL_DICE_TO_KICK vs ON_ROLL_DICE_TO_MOVE
        var slot = gv.matchMng.mapper.getTileForSlot(this.currSlot);
        return (slot.type == TileType.TILE_JAIL)&&(gv.matchMng.zooMgr.isActive);
    },

    isLockMoveByZoo:function(){ // co bi khoa di chuyen boi so thu khong?
        return this.isInZoo()&&!(gv.matchMng.diceManager.lastDiceResult.score1 == gv.matchMng.diceManager.lastDiceResult.score2);
    },

    //---------------------- ACTION METHOD-------------------------

    moveUp : function(range, stepLength, callback){
        cc.assert(this.state == PieceState.MOVING_TO_DES, "Invalid piece state");
        this.moveCallback=callback;
        this.moveDestination = (range>=0?GameUtil.addSlot(this.currSlot, range, this.playerIndex):GameUtil.minusSlot(this.currSlot, Math.abs(range)));
        this.stepLength = stepLength;

        //hien thi diem den
        this.currentDestination = this.moveDestination;
        var moveDestinationTile = gv.matchMng.mapper.getTileForSlot(this.currentDestination);
        moveDestinationTile.setEnableDestinationPoint(true);

        //calculate lai range neu bi bay bay o day :)
        //cuong
        var checkDiLui = range >=0;
        var realRange = range;
        var moveType = null;
        if(range>0&&checkDiLui){
            var list = GameUtil.calculateRealMoveFromPiece(this,range);
            realRange = list[0];
            moveType = list[1];
        }

        //neu cai real < range thi se phai nhay kieu khac :)
        this.moveDestination = (realRange>=0?GameUtil.addSlot(this.currSlot, realRange, this.playerIndex):GameUtil.minusSlot(this.currSlot, Math.abs(realRange)));
        var moveMileList = this.calculateMoveMileList(realRange, stepLength);
        this.pieceDisplay.setMoveMileList(moveMileList, this.onMoveAnimationFinished.bind(this));

        var desSlot = gv.matchMng.mapper.getTileForSlot(this.moveDestination);
        var check = desSlot.isFreeze;
        if(moveMileList.length == 0){
            this.pieceDisplay.jumpInPlace();
            return;
        }
        if(check&&checkDiLui){
            // test ok roi :P
            cc.log("move by freeze trap " + realRange);
            this.pieceDisplay.startJumpWithIceTrap();
            return;
        }
        if(this.isMoveByTileUp&&checkDiLui){
            this.pieceDisplay.starJumWithTileUp();
            return;
        }
        if(range>realRange && moveType == MoveType.TILE_UP&&checkDiLui){
            cc.log("Move by tile up" + realRange);

            this.moveDestination = (realRange>=0?GameUtil.addSlot(this.currSlot, realRange, this.playerIndex):GameUtil.minusSlot(this.currSlot, Math.abs(realRange)));
            var moveMileList = this.calculateMoveMileList(realRange, stepLength);
            this.pieceDisplay.setMoveMileList(moveMileList, this.onMoveAnimationFinished.bind(this));
            this.pieceDisplay.starJumWithTileUp();
            return;
        }
        // tinh toan buoc nhay
        //var moveMileList = this.calculateMoveMileList(range, stepLength);
        cc.log("Move Normal");
        var moveMileList = this.calculateMoveMileList(realRange, stepLength);
        this.pieceDisplay.setMoveMileList(moveMileList, this.onMoveAnimationFinished.bind(this));
        this.pieceDisplay.startJumpChain(true, true, gv.matchMng.isMineTurn(), true);
    },

    kickOtherPiece : function(kickType, needZoom, targetList, stepLength, callback){
        //Cuong
        for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++){
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.playerIndex, i);
            piece.pieceDisplay.lineControl.setVisible(false);
        }
        var guiPlayerPosition =  gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.playerIndex).standPos;
        guiPlayerPosition.runActionHappy(standPos);

        cc.log("----------------- KICK PIECE: kickType: "+kickType+" needZoom: "+needZoom);

        this.kickType = kickType;
        this.needZoom = needZoom;
        this.stepLength = stepLength;

        if(targetList!=null) {
            this.kickTarget = targetList;
            this.kickedList = [];
            //for (var i=0; i<this.kickTarget.length; i++){
            //    var playerTarget = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.kickTarget[i].playerIndex);
            //    //playerTarget.playerStatus.totalBeKicked++;
            //
            //    //cuong hien thong tin ai da da ai :)
            //    var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
            //    var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.playerIndex);
            //    history.Add_Log_Kick(player,playerTarget);
            //
            //}
        }
        if(callback!=null)
            this.kickCallback = callback;

        this.kickNextTarget();
    },

    kickNextTarget : function(){
        cc.log("Piece: "+this.getString()+" kick next target");
        //var guiPlayerPosition =  gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        //var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.playerIndex).standPos;
        //var animationPlayer = guiPlayerPosition.Get_Player_By_StandPos(standPos).character;
        //animationPlayer.getAnimation().gotoAndPlay("happy", 0, -1, 3);
        //animationPlayer.setCompleteListener(function(){
        //    animationPlayer.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        //});

        //var moveMileList = [];
        //if(this.getState() == PieceState.MOVING_TO_DES){
        //    var range = GameUtil.getSlotDistance(this.kickTarget[0].currSlot, this.currSlot, this.playerIndex);
        //    //cc.log("CUONG    " + range-this.stepLength);
        //    moveMileList = this.calculateMoveMileList(range-this.stepLength, this.stepLength);
        //}

        var targetSlot = this.kickTarget[0].currSlot;
        var tile = gv.matchMng.mapper.getTileForSlot(targetSlot);
        if(tile.type == TileType.TILE_JAIL){
            gv.matchMng.zooMgr.removeAnimZoo();
        }
        var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_BEFORE_BE_KICKED, this.kickTarget[0].playerIndex, this.kickTarget[0].pieceIndex);
        if (skillEnable){
            this.pieceDisplay.showFightBackAction(function(){
                this.kickCallback(this, null, true);
            }.bind(this));
            if(this.isMoveByTileUp){
                var tile1 = gv.matchMng.mapper.getTileForSlot((targetSlot+1)%40);
                tile1.display.resetTileUp();
            }
            ChangeGoldMgr.getInstance().addListKickInList(this.kickTarget[0], this);
            return;
        }

        ChangeGoldMgr.getInstance().addListKickInList(this, this.kickTarget[0]);

        if (this.kickType == KickType.SCREEN_BREAK){
            this.pieceDisplay.startingSuperKick(this.onKickAnimationFinished.bind(this, targetSlot));
        }
        else if (this.kickType == KickType.EXPLOSION){
            //if(moveMileList.length != 0){
            //   // var range1 = GameUtil.getSlotDistance(this.kickTarget[0].currSlot, this.currSlot, this.playerIndex);
            //    //var moveMileList1 = this.calculateMoveMileList(range1-range1, range1);
            //    this.pieceDisplay.setMoveMileList(moveMileList, function(){
            //        this.pieceDisplay.startingKick(this.needZoom,this.onKickAnimationFinished.bind(this, targetSlot));
            //    }.bind(this));
            //    this.pieceDisplay.startJumpChain(true, true, this.needZoom, false);
            //}
            //else{
                this.pieceDisplay.startingKick(this.needZoom,this.onKickAnimationFinished.bind(this, targetSlot));
            //}
        }
    },

    isStandingOnHisHomeGate: function(){
        var playerStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(this.playerIndex);
        return (this.currSlot == gv.matchMng.mapper.getSummonSlotForStandPos(playerStandPos));
    },

    isStandingOnHisDesinationGate: function(){
        var playerStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(this.playerIndex);
        return (this.currSlot == gv.matchMng.mapper.getLoadSlotForStandPos(playerStandPos));
    },

    summonToHomeGate : function(callback){
        cc.assert(this.state == PieceState.ON_HOME, "summonToHomeGate(). Invalid piece state");

        //cuong
        //this.pieceDisplay.getParent().reorderChild(this.pieceDisplay,this.zOrder);
        //this.pieceDisplay.setZOrder(this.pieceDisplay.zOrder);
        //this.pieceDisplay.getParent().reorderChild(this.pieceDisplay,this.pieceDisplay.zOrder);
        this.pieceDisplay.horseAni.setVisible(true);
        this.pieceDisplay.pieceInHome.setVisible(false);
        //this.pieceDisplay.setLocalZOrder(701);
        //
        var guiPlayerPosition =  gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.playerIndex).standPos;
        guiPlayerPosition.runActionTungXucXac(standPos);
        //var standPos = gv.matchMng.playerManager.getStandPosOfPlayer(this.playerIndex);
        var mainBoard = gv.matchMng.mainBoard;
        var summonSlot = gv.matchMng.mapper.getSummonSlotForStandPos(standPos);
        var blockPiece = mainBoard.boardData.getPieceAtSlot(summonSlot);    //piece dang dung o cong nha
        var summonTile = gv.matchMng.mapper.getTileForSlot(summonSlot);

        //cuong: xuat quan in vao trong history.
        //if(callback!=null){
        //    var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
        //    var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.playerIndex);
        //    history.Add_Log_Summon(playername) ;
        //}


        //neu co piece dang dung o cong nha thi da
        if(blockPiece!=null){
            this.kickOtherPiece(KickType.SCREEN_BREAK, true, [blockPiece], 1, callback);
        }
        //neu cong nha ko co piece nao
        else{
            //this.moveCallback=callback;
            //var moveMileList=[];
            //moveMileList.push(summonTile);
            //this.moveDestination = summonSlot;
            //this.pieceDisplay.setMoveMileList(moveMileList, this.onMoveAnimationFinished.bind(this));
            //this.pieceDisplay.startJumpChain(true, true, true, true);

            this.pieceDisplay.summon(summonTile, callback);
        }
    },

    destroyWithBink : function(blinkTime, callback){
        this.pieceDisplay.setBlink(true);
        var _this = this;
        GameUtil.callFunctionWithDelay(blinkTime, function(){
            _this.pieceDisplay.setBlink(false);
            _this.destroy(callback, resAniId.notimnhanvat);
        })
    },

    destroyWithBreakScreen: function(isLeftSide, callback){
        this.pieceDisplay.showBreakScreenKicked(isLeftSide);
        GameUtil.callFunctionWithDelay(3.0, function(){
            this.destroy(callback, null);
        }.bind(this));
    },

    //effect = undefined ~ default, null ~ no effect
    destroy : function(callback, destroyEff){
        cc.log("piece: destroy");
        var _this = this;
        var boardData = gv.matchMng.mainBoard.boardData;
        boardData.removePiece(this);
        this.pieceDisplay.pieceActionAnim.setVisible(false);
        this.resetFreezePiece();

        this.pieceDisplay.playDestroyEffect(destroyEff, function(){
            _this.returnToHome(callback);
        });
        gv.matchMng.destroyPiecesInTurn.push(this);
    },

    returnToHome : function(callback){
        var _this = this;
        var homeSlot = GameUtil.getHomeSlotForPlayer(this.playerIndex, this.pieceIndex);
        var homeTile = gv.matchMng.mapper.getTileForSlot(homeSlot);
        this.moveDestination = homeSlot;
        this.pieceDisplay.playSummonEffect(homeTile, function(){
            var boardData = gv.matchMng.mainBoard.boardData;
            boardData.putPieceToSlot(_this, homeSlot);
            fr.Sound.playSoundEffect(resSound.g_revive);
            _this.pieceDisplay.setVisible(true);

            if(callback != undefined && callback!=null)
                callback();

        });
    },
    //---------------------------------------------------------------------

    onMoveAnimationFinished : function(){
        var moveDestinationTile = gv.matchMng.mapper.getTileForSlot(this.currentDestination);
        moveDestinationTile.setEnableDestinationPoint(false);

        var boardData = gv.matchMng.mainBoard.boardData;
        boardData.putPieceToSlot(this, this.moveDestination);
        if(this.moveCallback!=null) {
            this.moveCallback();
        }
    },

    onKickAnimationFinished : function(desSlot){
        this.increaseNumberCombo();
        var recentTarget = this.kickTarget.shift();
        var boardData = gv.matchMng.mainBoard.boardData;
        this.kickedList.push(recentTarget);
        boardData.putPieceToSlot(this, desSlot);
        boardData.putPieceToSlot(recentTarget, -1);

        var finalKick = (this.kickTarget.length == 0);
        if(this.kickCallback!=null) {
            this.kickCallback(this, recentTarget, finalKick);
        }
        else{
            cc.log("[WARNING] kick callback null");
        }

        if(!finalKick){
            cc.log("[INFO] Combo kick next: "+this.kickTarget[0].getString());
            this.kickNextTarget();
        }
        else{
            this.kickCallback = null;
            cc.log("[INFO] Kick chain finished");
        }
    },

    isSummoned : function(){
        if(this.state == PieceState.MOVING_TO_DES){
            var standPos=gv.matchMng.playerManager.getStandPosOfPlayer(this.playerIndex);
            var summonSlot = gv.matchMng.mapper.getSummonSlotForStandPos(standPos);

            if(this.currSlot == summonSlot)
                return true;
        }
        
        return false;
    },

    setState : function(pieceState){
        this.state = pieceState;
    },

    getState : function(){
        return this.state;
    },

    getStateString : function(){
        switch(this.state){
            case PieceState.NONE:
                return "NONE";
            case PieceState.ON_HOME:
                return "ON_HOME";
            case PieceState.MOVING_TO_DES:
                return "MOVING_TO_DES";
            case PieceState.ON_DES:
                return "ON_DES";
            case PieceState.FINISHED:
                return "FINISHED";
            default:
                cc.assert(false, "getStateString(). Invalid piece state");
        }
    },

    getString : function(){
        return "["+this.playerIndex+", "+this.pieceIndex+","+this.getStateString()+"]";
        //var retText = "["+this.playerIndex+", "+this.pieceIndex+","+this.getStateString()+"]";
        //return retText;
    },

    calculateMoveMileList : function(range, stepLength){
        cc.assert(range%stepLength==0, "range = " + range + "stepLength = " + stepLength + "calculateMoveMileList: range and stepLength is not consistent");
        //cc.log("Ngua di duoc tung nay buoc  " + range );
        var moveMileList = [];
        var currSlot = this.currSlot;
        for(var i=0; i< Math.abs(range); i+=stepLength){
            currSlot = (range>=0?GameUtil.addSlot(currSlot, stepLength, this.playerIndex):GameUtil.minusSlot(currSlot, stepLength));
            var currTile = gv.matchMng.mapper.getTileForSlot(currSlot);
            moveMileList.push(currTile);
        }

        return moveMileList;
    },

    resetAction : function(){
        DebugUtil.log("resetAction: solutionList, kickTarget empty");
        this.solutionList = [];
        this.kickTarget=[];
        this.resetCombo();
    },

    addActionSolution : function(solution){
        solution.solutionId = this.solutionList.length;
        this.solutionList.push(solution);
    },

    getSolutionList : function(){
        return this.solutionList;
    },

    haveKickSolutionWithRange : function(range){
        for(var i=0; i< this.solutionList.length; i++){
            var solution = this.solutionList[i];
            if(solution.pieceAction == PieceAction.KICK_OTHER){
                var firstTarget = solution.actionParam[0];
                var distance = GameUtil.getSlotDistance(this.currSlot, firstTarget.currSlot, this.playerIndex);
                if(distance == range)
                    return true;
            }
        }
        return false;
    },

    getSelectedSolution : function(){
        if(this.selectedSolution < 0)
            return null;
        return this.solutionList[this.selectedSolution];
    },

    performSolution : function(option){
        var tile = gv.matchMng.mapper.getTileForSlot(this.currSlot);
        if(tile.type == TileType.TILE_JAIL){
            gv.matchMng.zooMgr.removeAnimZoo();
        }
        if(this.solutionList[option]== undefined && gv.matchMng.playerManager.getMineGlobalStandPos() == 0){
            DebugUtil.log("CONFLICT: NO SOLUTION FOUND! piece: "+this.getString()+" Option: "+option, true);
            var stringLog = DebugUtil.getTrackLog();
            gv.gameClient.sendTrackLog(stringLog);
            if(DebugConfig.AUTO_PLAY)
                gv.matchMng.autoReplayGame();
            //reconnect when conflict
            if (!gv.guiMgr.getGuiById(GuiId.CONFLICT))
                gv.guiMgr.addGui(new GuiConflict("CONFLICT SOLUTION"), GuiId.CONFLICT, LayerId.LAYER_LOADING);

            return;
        }

        this.selectedSolution = option;
        this.solutionList[option].performPieceAction();
    },

    isCanMovingOnBoard: function(){
        return ((this.getState() == PieceState.MOVING_TO_DES) && (!this.isFreeze) && (!this.isInZoo()));
    },

    isCanActiveMove: function(){
        return (this.getState() == PieceState.MOVING_TO_DES);
    },

    setFreezePiece:function(){
        this.isFreeze = true;
        cc.log("piece is freezed, can't active skill ");
        this.pieceDisplay.pieceActionAnim.setVisible(false);
        // add icon freeze o day
        fr.Sound.playSoundEffect(resSound.skill_freezen_active);
        this.pieceDisplay.imageFreeze = fr.AnimationMgr.createAnimationById(resAniId.skill_ice_trap_step_1, this);
        this.pieceDisplay.imageFreeze.getAnimation().gotoAndPlay("loop", 0, -1, 0);
        this.pieceDisplay.imageFreeze.setPosition(this.pieceDisplay.getContentSize().width/2,0);
        this.pieceDisplay.addChild(this.pieceDisplay.imageFreeze,1000);

        var tileObj = gv.matchMng.mapper.getTileForSlot(this.currSlot);
        this.pieceDisplay.animFreeze =  fr.AnimationMgr.createAnimationById(resAniId.tile_ice_trap, this);
        this.pieceDisplay.animFreeze.getAnimation().gotoAndPlay("run", 0, 0.1, 1);

        this.pieceDisplay.animFreeze.setPosition(tileObj.display.getPositionFreePiece(tileObj.type));
        tileObj.display.image.addChild(this.pieceDisplay.animFreeze);
    },

    resetFreezePiece:function(){
        if(this.isFreeze){
            this.isFreeze = false;
            //remove icon freeze o day.
            if(this.pieceDisplay.imageFreeze!=null){
                this.pieceDisplay.imageFreeze.removeFromParent();
            }
            this.pieceDisplay.imageFreeze = fr.AnimationMgr.createAnimationById(resAniId.skill_ice_trap_step_2, this);
            this.pieceDisplay.imageFreeze.getAnimation().gotoAndPlay("run", 0, -1, 1);
            this.pieceDisplay.imageFreeze.setPosition(this.pieceDisplay.getContentSize().width/2,0);
            this.pieceDisplay.addChild(this.pieceDisplay.imageFreeze,1000);
            var _this = this;
            this.pieceDisplay.imageFreeze.setCompleteListener(function(){
                _this.pieceDisplay.imageFreeze.removeFromParent();
                _this.pieceDisplay.imageFreeze = null;
                if(_this.pieceDisplay.animFreeze!=null){
                    _this.pieceDisplay.animFreeze.removeFromParent();
                    _this.pieceDisplay.animFreeze = null;
                }
            });
        }
    },
});