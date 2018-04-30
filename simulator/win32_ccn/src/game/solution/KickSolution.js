/**
 * Created by GSN on 1/8/2016.
 */

var KickSolution = BaseSolution.extend({

    ctor : function(piece, params){
        this._super(piece, PieceAction.KICK_OTHER, params);
    },

    //tao object thuoc class HintpPath, the hien hien thi cua mot phuong an di chuyen

    generateHintPath : function(){
        //var retHintPath = null;
        var mapper = gv.matchMng.mapper;
        var logText = "GEN HINT PATH:  ";

        var retHintPath = new HintPath();
        retHintPath.pieceOwner = this.target;
        retHintPath.hintType = HintPathType.NONE;
        retHintPath.tileList=[];

        retHintPath.hintType = HintPathType.KICK_OTHER;
        logText+= "hintType: KICK_OTHER  ";

        var lastKickTarget = this.actionParam[this.actionParam.length - 1];
        var desSlot = lastKickTarget.currSlot;
        var startSlot = this.target.currSlot;

        while(startSlot!=desSlot){
            startSlot = (startSlot+1)%NUMBER_SLOT_IN_BOARD;
            var currTile = mapper.getTileForSlot(startSlot);
            retHintPath.tileList.push(currTile);

            logText+= (startSlot + " ");
        }

        //cc.log(logText);
        cc.assert(retHintPath!=null, "Opps generateHintPath return null");
        return retHintPath;
    },

    show : function(){
        this.needHintStone = false;
        this._super();
        var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainboardGui.letPlayerChoosePiece(InteractType.SELECT, this.actionParam, true, this.onSolutionSelected.bind(this));
    },

    hide : function(){
        this._super();
        var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainboardGui.disablePlayerChoosePiece(this.actionParam);
    },

    //tinh khoang cach tu vi tri dang dung den doi thu
    getKickRange : function(){
        var firstTarget = this.actionParam[0];
        return GameUtil.getSlotDistance(firstTarget.currSlot, this.target.currSlot, this.target.playerIndex);
        //var kickDistance = GameUtil.getSlotDistance(firstTarget.currSlot, this.target.currSlot, this.target.playerIndex);
        //return kickDistance;
    },

    //lay tat ca cac solution kha nang tao multi kick
    getMultiKickSolution : function(){
        var multiKickSolutions = [];
        var myKickRange = this.getKickRange();
        var mainboard = gv.matchMng.mainBoard;

        var currPlayerIndex = gv.matchMng.currTurnPlayerIndex;
        for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
            if(this.target.pieceIndex == pieceIndex)
                continue;

            var piece = mainboard.boardData.getPieceOfPlayer(currPlayerIndex, pieceIndex);
            var solutionList = piece.getSolutionList();
            if(solutionList!= null && solutionList.length!=0){
                for(var i=0; i< solutionList.length; i++){
                    if(solutionList[i].pieceAction == PieceAction.KICK_OTHER && myKickRange == solutionList[i].getKickRange()){
                        multiKickSolutions.push(solutionList[i]);
                    }
                }
            }
        }

        return multiKickSolutions;
    },

    doPieceKick : function(kickType, needZoom){
        var mainboard = gv.matchMng.mainBoard;
        var callback = mainboard.onPieceFinishedKick.bind(mainboard);
        this.target.kickOtherPiece(kickType, needZoom, this.actionParam, 1, callback);//actionParam is kickTargetList

        //cuong hien thong tin ai da da ai :)
        //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
        //var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.piece.playerIndex);
        //history.Add_Log_Kick(playername,playerTarget);

        //
    },

    performPieceAction : function(){
        this._super();
        var kickNotification = null;

        //tinh song da, tam da
        //var multiKickList = this.getMultiKickSolution();
        //if(multiKickList.length != 0){
        //    if(multiKickList.length == 1)
        //        kickNotification = EffectType.DOUBLE_KICK;
        //    else
        //        kickNotification = EffectType.TRIPLE_KICK;
        //
        //    EffectMgr.getInstance().showEffect(kickNotification, function(){
        //        this.doPieceKick(KickType.SCREEN_BREAK, false);
        //        for(var i=0; i< multiKickList.length; i++){
        //            DebugUtil.log("MULTI KICK. "+multiKickList[i].getString(), true);
        //
        //            multiKickList[i].doPieceKick(KickType.PASSIVE_KICK, false);
        //        }
        //    }.bind(this));
        //}
        //else{

        var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_MOVE_TO_KICK, this.target.playerIndex, this.target.pieceIndex);
        if (skillEnable)
            return;

        if(this.actionParam.length==1){
            kickNotification = EffectType.SINGLE_KICK;
        }
        else{
            kickNotification = EffectType.COMBO_KICK;
        }
        EffectMgr.getInstance().showEffect(kickNotification, function(){
            this.doPieceKick(KickType.SCREEN_BREAK, true);
        }.bind(this));

        //}
    },

});