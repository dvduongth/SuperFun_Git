/**
 * Created by Cantaloupe on 5/21/2015.
 */

var MainBoard = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.mapper = null;
        this.boardData = new MainBoardData();
        this.teleportMgr = new TeleportMgr(this);
        this.mainBoardGui = null;
        //this.backupStack = [];
        //this.multiKickSolutions = [];

        //listPiece
        this.tileIndexFinishActive = -2;
        this.listPieceRemoveFreeze = [];
        return true;
    },

    //tao cac piece cho tung player va dat vao vi tri duoc cho truoc
    //player_pieceList : vi tri cac piece cua player
    //needEffect : can effect xuat hien hay khong

    init : function(player_pieceList, needEffect){
        this.boardData.init(player_pieceList.length);
        this.mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        var touchEventListener = cc.EventListener.create(new TouchEventListener());

        //this.mainBoardGui.createMoney();
        gv.matchMng.checkPlayerBankRupt();
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).updateInfoOfAllPlayers();

        for(var playerIndexKey in player_pieceList){
            var playerIndex = Number(playerIndexKey);
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
            var pieceListPos = player_pieceList[playerIndex];
            for(var pieceIndexKey in pieceListPos){
                var pieceIndex = Number(pieceIndexKey);
                var piece = new Piece();
                piece.init(playerIndex, pieceIndex, playerInfo.playerStatus.mainCharacter.id, playerInfo.playerColor);
                var pieceGlobalSlot = pieceListPos[pieceIndex];

                cc.log("playerIndex: " + playerIndex + " PieceIndex: " + pieceIndex + " RawGlobalPos: " + pieceGlobalSlot);

                var pieceLocalSlot = gv.matchMng.mapper.convertGlobalToLocalSlotIndex(pieceGlobalSlot, playerInfo.standPos, pieceIndex);

                piece.attachToScreen(this.mainBoardGui);
                this.boardData.putPieceToSlot(piece, pieceLocalSlot);
                if(needEffect){
                    piece.pieceDisplay.addEffect(PieceEffectId.APPEAR,playerIndex);
                }
                cc.eventManager.addListener(touchEventListener.clone(), piece.pieceDisplay);
            }

            //cuong fix bug flag
            for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++) {
                var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, i);
                this.boardData.updatePieceState(piece);
                piece.pieceDisplay.updateNewPosition();
            }
        }
    },

    //cho con piece dau tien ra
    doBeginMatchSummon : function(){
        for(var playerIndex =0; playerIndex < gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
            var needSummon = true;
            for (var pieceIndex = 0; pieceIndex<NUMBER_PIECE_PER_PLAYER; pieceIndex++){
                var piece =  gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, pieceIndex);
                if (piece.state != PieceState.ON_HOME){
                    needSummon = false;
                    break;
                }
            }
            if (needSummon){
                var summonPiece = gv.matchMng.mainBoard.boardData.getPieaceInHomeWithSmallestId(playerIndex);
                if(summonPiece!=null){
                    summonPiece.summonToHomeGate(null);
                }
            }
        }
    },

    initSpecialTile : function(){
        for (var i=0; i<CCNConst.MAX_MOVE_TILE; i++){
            var cellStatus = gv.matchMng.gameStatusObject.cellStatus[i];
            var mapper = gv.matchMng.mapper;
            var localPos = mapper.convertGlobalToLocalSlotIndex(i);
            var localTile = mapper.getTileForSlot(localPos);
            if(cellStatus.hasIceTrap){// neu o nay la bay bang
                localTile.display.setFreezeTile();
            }
            switch (cellStatus.cellType){
                case 1: //LIGHT
                    if(cellStatus.cellParam.lightOwnerIndex>=0){
                        localTile.lightOwnerIndex = gv.matchMng.mapper.convertGlobalStandPosToLocalIndex(cellStatus.cellParam.lightOwnerIndex);
                        gv.matchMng.turnLightMgr.changeLightIndex(localTile.lightOwnerIndex,((localPos+1)%40)/10);
                        localTile.reloadTile();

                    }

                    var contentIndex = (Math.floor(localTile.index/10)+1) % MAX_NUMBER_PLAYER;
                    var flag = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD)._centerNode.getChildByName("flag_tile_light_"+contentIndex);
                    flag.setLocalZOrder(localTile.getZOrderForPiece());
                    localTile.display.lightFlag = flag;
                    localTile.display.addOutsideElement(flag);
                    //localTile.display.changeTileLightColor(localTile.tileColor);

                    break;
                case 2: //COMMON
                    //do nothing
                    break;
                case 3: //GATE/TAX
                    localTile.multiplyRate = cellStatus.cellParam.multiplyRate;
                    var standPos = localPos/10;
                    //if(standPos>3){
                    //    standPos-=4;
                    //}
                    //cc.log("CUONG   DOC MAP   " + standPos + "   localPos   " + localPos);
                    var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(standPos);
                    if(playerInfo!=null){                         // lay vi tri stand pos cua o thu thue
                        //localTile.display.addIconTileTax(playerInfo.playerColor);
                        gv.matchMng.taxMgr.changeMultiTaxWithIndex(playerInfo.playerIndex,localTile.multiplyRate);
                        localTile.reloadTile();
                    }
                    break;
                case 4:{ //SPECIAL
                    switch (cellStatus.cellParam.specialTypeOrdinal){
                        case 0://minigame
                            localTile.type = TileType.TILE_MINI_GAME;
                            break;
                        case 1: //jail
                            //todo con thieu gui ve so turn ngua da dung trong so thu, va no da duoc tha khoi so thu hay chua?
                            localTile.type = TileType.TILE_JAIL;
                            break;
                        case 2: //teleport
                            localTile.type = TileType.TILE_TELEPORT;
                            break;
                        case 3: // control
                            localTile.type = TileType.TILE_CONTROL;
                            //localTile.isRaised = true;
                            //
                            break;
                    }
                    localTile.reloadTile();
                    localTile.display.addSpecialEffect(localTile.type);
                    break;
                }
                case 5: {//BOM
                    localTile.type = TileType.TILE_BOM;
                    localTile.display.addSpecialEffect(localTile.type);

                    if (cellStatus.cellParam.bomOwnerIndex == -1)
                        localTile.bomOwnerIndex = cellStatus.cellParam.bomOwnerIndex;
                    else
                        localTile.bomOwnerIndex = gv.matchMng.mapper.convertGlobalStandPosToLocalIndex(cellStatus.cellParam.bomOwnerIndex);
                    localTile.bomRemainTurn = cellStatus.cellParam.bomRemainTurn;
                    localTile.reloadTile();
                    gv.matchMng.bomMgr.initBoomTile();
                    break;
                }
            }
            if(cellStatus.isRaised){// neu o nay bi nang len
                localTile.display.setTileUp();
            }
        }
    },

    checkHavePieceOnDestination: function(playerIndex){
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var pieceList = playerInfo.matchData.pieceList;
        for (var i=0; i<pieceList.length; i++){
            if (pieceList[i].state == PieceState.ON_DES)
                return true;
        }
        return false;
    },

    setVisibleDestinationNumber: function(playerIndex, visible){
        for(var desIndex = 0; desIndex < NUMBER_DES_SLOT; desIndex++){
            var desTile = gv.matchMng.mapper.getTileForSlot(GameUtil.getDestinationSlotForPlayer(playerIndex, desIndex));
            if (visible)
                desTile.display.showDestinationNumber((desIndex+1)*0.2);
            else
                desTile.display.hideDestinationNumber();
        }
    },


    Get_Position_By_StandPos:function(standPos){
        return cc.p(gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos).x,gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos).y +50);
    },

    performPieceAction : function(pieceIndex, option){
        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        mainBoardGui.setVisibleAllSolutionOfPieces(false);

        var playerIndex = gv.matchMng.currTurnPlayerIndex;
        var piece = this.boardData.getPieceOfPlayer(playerIndex, pieceIndex);

        //cuong
        //cc.log("Action kamezoko :))");
        //cuong ve duong di cua tia dan :)

        for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++){
            var piece1 = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, i);
            piece1.pieceDisplay.lineControl.setVisible(false);
        }

        piece.pieceDisplay.lineControl.setVisible(true);
        var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).standPos;
        var guiPlayerPosition =  gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        guiPlayerPosition.runActionSpecialIdle(standPos);
        var fixPosition = this.Get_Position_By_StandPos(standPos);
        var color = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerColor;
        var kamejoko;
        switch(color){
            case 0:{// BLUE
                kamejoko  = new cc.ParticleSystem("res/particle/Particle/particle_texture_blue.plist");
                break;}
            case 1:{//GREEN
                kamejoko  = new cc.ParticleSystem("res/particle/Particle/particle_texture_green.plist");
                break;}
            case 2:{//RED
                kamejoko  = new cc.ParticleSystem("res/particle/Particle/particle_texture_red.plist");
                break;}
            case 3:{//YELLOW
                kamejoko  = new cc.ParticleSystem("res/particle/Particle/particle_texture_yellow.plist");
                break;
            }
        }

        kamejoko.setScale(1/2,1/2);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(kamejoko,10000);
        kamejoko.setPosition(fixPosition);

        var d = Math.sqrt((fixPosition.x - piece.pieceDisplay.getPosition().x)*(fixPosition.x - piece.pieceDisplay.getPosition().x) +
            (fixPosition.y - piece.pieceDisplay.getPosition().y)*(fixPosition.y - piece.pieceDisplay.getPosition().y));

        //move 0.5s with 600 range
        kamejoko.runAction(cc.sequence(
            cc.moveTo(0.5*d/600,piece.pieceDisplay.getPosition()),
            //1 action lam sang con ngua len :)
            cc.delayTime(0.4),
            cc.callFunc(function(){
                for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++){
                    var piece1 = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, i);
                    piece1.pieceDisplay.lineControl.setVisible(false);
                }
                piece.pieceDisplay.pieceActionAnim.setVisible(true);
                piece.pieceDisplay.grow.setVisible(true);
                kamejoko.removeFromParent();
                // can active skill vao day

                if (piece.isCanActiveMove()){
                    var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_ACTIVE_TO_MOVE, piece.playerIndex, piece.pieceIndex);
                    if (skillEnable){
                        piece.selectedSolution = option;
                        return;
                    }
                }
                piece.performSolution(option);
           })
        ));
    },

    movePiece : function(piece, range){
        cc.assert(piece.getState() == PieceState.MOVING_TO_DES, "movePiece(). Invalid piece state. Piece: "+piece.getString());
        piece.moveUp(range, 1, this.onPieceFinishedMove.bind(this, piece, range));
    },

    loadPiece : function(piece, range){
        cc.assert(piece.getState() == PieceState.ON_DES, "loadPiece(). Invalid piece state, piece: "+piece.getString()+" currState: "+piece.getState());
        piece.moveUp(range, 1, this.onPieceFinishedMove.bind(this, piece));
    },

    forceSummon : function(piece, callback){
        cc.assert(piece!=null, "Summon piece is null");
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece.playerIndex);
        var summonSlot = gv.matchMng.mapper.getSummonSlotForStandPos(playerInfo.standPos);
        var tile = gv.matchMng.mapper.getTileForSlot(summonSlot);
        if(tile.tileUp){
            piece.pieceDisplay.pieceActionAnim.setVisible(false);
            //tile.display.resetTileUp();
            //gv.matchMng.onPieceFinishAllActions(piece);
            //return;
            piece.pieceDisplay.summonWithTileUp(tile);
            return;
        }

        if (callback===undefined){
            callback = this.onPieceFinishedSummon.bind(this, piece);
        }
        piece.summonToHomeGate(callback);
    },

    checkForBlockerOnPath : function(startPos, range, playerIndex){
        var currStep = startPos;
        for(var i=0; i< range; i++){
            currStep = GameUtil.addSlot(currStep, 1, playerIndex);
            var blocker =this.boardData.getPieceAtSlot(currStep);
            if(blocker != null){
                return blocker;
            }
        }
        return null;
    },

    calculateFreeBackMoveStepFrom: function(startSlot){
        var freeMoveStep = 0;
        var currSlot = ((startSlot-1)+NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD;
        while(gv.matchMng.mainBoard.boardData.getPieceAtSlot(currSlot)==null && freeMoveStep < NUMBER_SLOT_IN_BOARD-1){
            freeMoveStep++;
            currSlot = ((currSlot-1)+NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD;
        }
        return freeMoveStep;
    },

    //tinh toan xem truoc mat piece con bao nhieu o trong
    calculateFreeMoveStepForPiece : function(piece){
        var logText = "CAL FREE MOVE : "+piece.getString()+" \n";
        cc.log(logText);
        logText = "";

        var freeMoveStep = 0;
        var currStep = piece.currSlot;
        var finalSlot = GameUtil.getFinalSlotForPlayer(piece.playerIndex);
        logText +=(" final Slot: "+finalSlot+" \n");
        logText +=" currStep: ";

        //tang dan tu vi tri piece dang dung len 1 don vi toi khi co vat can hoac kich duong
        currStep = GameUtil.addSlot(currStep, 1, piece.playerIndex);
        while(this.boardData.getPieceAtSlot(currStep)==null && currStep <= finalSlot && currStep!=-1){
            logText +=(currStep+" ");
            freeMoveStep++;
            currStep = GameUtil.addSlot(currStep, 1, piece.playerIndex);
            if(freeMoveStep > NUMBER_SLOT_IN_BOARD + NUMBER_DES_SLOT){
                cc.log("xxxxxxxxxxxxxxxxx");
            }
        }
        //cc.log(logText);
        return freeMoveStep;
    },

    pushListResetFreeze:function(piece){
        this.listPieceRemoveFreeze.push(piece);
    },

    //tinh toan xem piece co the normal move hay kick khong
    calculateMoveSolutionForPiece : function(piece, diceResult){
        var logText = "";

        var expectedMoveRange = [];
        var retSulotions = [];
        if(piece.isFreeze){
            return retSulotions;
        }

        if(piece.isLockMoveByZoo()){
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece.playerIndex);
            if( playerInfo.playerStatus.gold <= gv.matchMng.zooMgr.gold){// no dang trong so thu va khong du tien tra thi next
                return retSulotions;
            }
        }

        //neu do doi co the di chuyen theo 2 cach - tam thoi ko dung
        //if(diceResult.score1 == diceResult.score2)
        //    expectedMoveRange.push(diceResult.score1);
        expectedMoveRange.push(diceResult.score1 + diceResult.score2);

        for(var i=0; i< expectedMoveRange.length; i++){
            //check move phase
            var expectRange = expectedMoveRange[i];
            //logText +="ExpectedRange: "+expectedMoveRange[i]+" realRange :" +realRange + (realRange >= expectRange? " OK" : " SKIP")+"\n";
            var realRange = GameUtil.calculateDestinationMoveFromPiece(piece,expectRange);
            if(expectRange > realRange){
                piece.isMoveByTileUp = true;
                cc.log("CUONG REAL RANGE     " +realRange + "     " + piece.playerIndex);
            }
            var desSlot = GameUtil.addSlot(piece.currSlot, expectRange, piece.playerIndex);
            var desTile = gv.matchMng.mapper.getTileForSlot(desSlot);
            var desPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(desSlot);

            var realDes = GameUtil.addSlot(piece.currSlot, realRange, piece.playerIndex);
            var realDesPiece = gv.matchMng.mainBoard.boardData.getPieceAtSlot(realDes);

            cc.log("desSlot = " + desSlot + "      realDes = " + realDes);

            if(desTile==null) continue;// truong hop nay khong di chuyen duoc, continue luon hihi
            if(desPiece!=null){
                if((desPiece.playerIndex == piece.playerIndex)) continue;// vi tri den la con cua minh, continue luon
            }

            if(realRange == 0&&expectRange>0 ){// truong hop nay la truong hop dac biet, o dat chan ngay truoc mat
                var moveSolution = new MoveSolution(piece, expectRange);
                retSulotions.push(moveSolution);
                return retSulotions;
            }

            if(realDesPiece==null){
                var canMove = true;
                //kiem tra trong truong hop load len chuong thi khong duoc di xuyen
                if (desTile.type == TileType.TILE_DESTINATION){
                    for (var i=0; i<NUMBER_DES_SLOT; i++) {
                        var curDesSlot = GameUtil.getDestinationSlotForPlayer(piece.playerIndex, i);
                        var curDesTile = gv.matchMng.mapper.getTileForSlot(curDesSlot);
                        if ((curDesSlot<desSlot) && (curDesTile.getPieceHolding() != null)){
                            canMove = false;
                            break;
                        }
                    }
                }
                if (canMove){
                    var moveSolution = new MoveSolution(piece, expectRange);
                    retSulotions.push(moveSolution);
                }
            }
            else if(realDesPiece.playerIndex != piece.playerIndex){ // neu co chuong ngai vat ngay tai o cuoi cung
                //check kick phase
                logText+= "CAL KICK : " + piece.getString()+"\n";

                var trackPos = piece.currSlot;
                var kickTargetList = [];

                //do{

                //var expectDesSlot = GameUtil.addSlot(trackPos, expectRange, piece.playerIndex);
                //logText += "Expect destination slot: " + expectDesSlot+" --- SKIP!";
                //if(expectDesSlot == -1){
                //    break;
                //} //final path reached

                var blocker = realDesPiece;//this.checkForBlockerOnPath(trackPos, expectRange, piece.playerIndex);
                logText += "Blocker: "+(blocker!=null?blocker.getString():"null");
                kickTargetList.push(blocker);
                trackPos = blocker.currSlot;

                //}
                //while(true);

                if(kickTargetList.length!=0){
                    var solution = new KickSolution(piece, kickTargetList);
                    retSulotions.push(solution);
                }
            }
            else{
                logText+="Can not kick -> SKIP \n";
            }
        }
        if(retSulotions.length==0){
            piece.isMoveByTileUp = false;
        }
        cc.log(logText);
        return retSulotions;
    },

    calculateSolutionForAllPiece : function(diceResult, playerIndex){
        var totalSolution = 0;

        cc.log("\n\n+++++++++++++++++++++++CALCULATE PIECE ACTION++++++++++++++++++++++\n");
        var log="";
        //this.numberKicked=0;

        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){

            var piece = this.boardData.getPieceOfPlayer(playerIndex, pieceIndex);
            piece.resetAction();

            if ((piece.getState() == PieceState.MOVING_TO_DES) && (!piece.isStandingOnHisDesinationGate())){
                var moveSolutionList = this.calculateMoveSolutionForPiece(piece, diceResult);
                totalSolution += moveSolutionList.length;

                for(var i=0; i< moveSolutionList.length; i++)
                    piece.addActionSolution(moveSolutionList[i]);
            }

            else if ((piece.getState() == PieceState.ON_DES) || ((piece.getState() == PieceState.MOVING_TO_DES) && (piece.isStandingOnHisDesinationGate()))){

                if (piece.getState() == PieceState.ON_DES){
                    var nextSlot = GameUtil.addSlot(piece.currSlot, 1, playerIndex);
                    var nextTile = gv.matchMng.mapper.getTileForSlot(nextSlot);
                    var canLoad = false;
                    if(nextTile.type == TileType.TILE_DESTINATION && nextTile.getPieceHolding()==null){
                        if(diceResult.score1 == diceResult.score2){
                            canLoad = true;
                        }
                        else {
                            var tileNumber = nextTile.getTileNumber();
                            if (tileNumber == diceResult.score1 + diceResult.score2)
                                canLoad = true;
                            else
                                log+="piece: "+piece.getString()+"Can not load. diceVal="+(diceResult.score1 + diceResult.score2)+" needVal: "+tileNumber;
                        }
                    }
                    if(canLoad){
                        var solution = new LoadSolution(piece, nextSlot);
                        piece.addActionSolution(solution);
                        totalSolution+=1;
                    }
                }

                if ((piece.getState() == PieceState.MOVING_TO_DES) && (piece.isStandingOnHisDesinationGate())){

                    var canLoad = false;
                    //Len bang tong 2 xuc sac
                    for (var i=0; i<NUMBER_DES_SLOT; i++){
                        var curDesSlot = GameUtil.getDestinationSlotForPlayer(playerIndex, i);
                        var curDesTile = gv.matchMng.mapper.getTileForSlot(curDesSlot);
                        if (curDesTile.getPieceHolding() != null) break;
                        if (curDesTile.getTileNumber() == diceResult.score1 + diceResult.score2){
                            DebugUtil.log("add load solution at destination gate by sum of dice", true);
                            canLoad = true;
                            var solution = new LoadSolution(piece, curDesSlot);
                            piece.addActionSolution(solution);
                            totalSolution += 1;
                            break;
                        }
                    }

                    //truong hop do doi se co them lua chon di them 1 o
                    if ((!canLoad) && (diceResult.score1 == diceResult.score2)) {
                        var nextSlot = GameUtil.addSlot(piece.currSlot, 1, playerIndex);
                        var nextTile = gv.matchMng.mapper.getTileForSlot(nextSlot);
                        if (nextTile.type == TileType.TILE_DESTINATION && nextTile.getPieceHolding() == null) {
                            DebugUtil.log("add load solution at destination gate by double dice", true);
                            var solution = new LoadSolution(piece, nextSlot);
                            piece.addActionSolution(solution);
                            totalSolution += 1;
                        }
                    }
                }

            }

            /////////////////log part//////////////////////
            var solutionList = piece.getSolutionList();
            for(var i=0; i< solutionList.length; i++)
                log+=solutionList[i].getString()+"\n";
            ///////////////////////////////////////////////
            ///////////////////////////////////////////////
        }

        if(diceResult.score1 == diceResult.score2 || (diceResult.score1 == 1 && diceResult.score2 == 6) || (diceResult.score2 == 1 && diceResult.score1 == 6)){
            var summonPiece = this.boardData.getPieaceInHomeWithSmallestId(playerIndex);

            if(summonPiece != null){
                var standIndex = gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex);
                var summonSlot = gv.matchMng.mapper.getSummonSlotForStandPos(standIndex);
                var blocker = this.boardData.getPieceAtSlot(summonSlot);
                if(blocker == null || blocker.playerIndex != summonPiece.playerIndex){
                    var solution = new SummonSolution(summonPiece, summonSlot);
                    summonPiece.addActionSolution(solution);
                    totalSolution+=1;
                    log+= solution.getString()+"\n";
                }
            }
        }

        if(log.length==0){
            log+="[INFO] No piece can do action!! \n";
        }

        log+="++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n";

        cc.log(log);

        return totalSolution;
    },

    filterSolutionWithPriority: function(){
        var onlyKick = false;
        var onlySummon = false;
        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
            var piece = this.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex, pieceIndex);
            var pieceSolutionList = piece.getSolutionList();
            for (var i = 0; i < pieceSolutionList.length; i++) {
                if (pieceSolutionList[i].pieceAction == PieceAction.KICK_OTHER){
                    //var slot = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
                    if(!piece.isInZoo()){
                        onlyKick = true;
                        break;
                    }
                }
                else if (pieceSolutionList[i].pieceAction == PieceAction.SUMMON){
                    onlySummon = true;
                    break;
                }
            }
        }
        DebugUtil.log("filterSolutionWithPriority: onlyKick=" + onlyKick + ", onlySummon=" + onlySummon);

        var totalSolution = 0;

        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
            var piece = this.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex, pieceIndex);
            var pieceSolutionList = piece.getSolutionList();
            for (var i = pieceSolutionList.length-1; i >=0 ; i--) {
                if (onlyKick){
                    if (pieceSolutionList[i].pieceAction != PieceAction.KICK_OTHER)
                        pieceSolutionList.splice(i,1);
                }
                else if (onlySummon){
                    if (pieceSolutionList[i].pieceAction != PieceAction.SUMMON)
                        pieceSolutionList.splice(i,1);
                }
            }
            piece.solutionList = pieceSolutionList;
            totalSolution+=pieceSolutionList.length;
        }

        DebugUtil.log("TOTAL SOLUTION AFTER FILTER = " + totalSolution);
        return totalSolution;
    },

    mustKickInCurrentTurn: function(){
        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
            var piece = this.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex, pieceIndex);
            var pieceSolutionList = piece.getSolutionList();
            for (var i = pieceSolutionList.length-1; i >=0 ; i--) {
                if (pieceSolutionList[i].pieceAction == PieceAction.KICK_OTHER&&!piece.isInZoo())
                    return true;
            }
        }
        return false;
    },

    mustSummonInCurrentTurn: function(){
        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
            var piece = this.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex, pieceIndex);
            var pieceSolutionList = piece.getSolutionList();
            for (var i = pieceSolutionList.length-1; i >=0 ; i--) {
                if (pieceSolutionList[i].pieceAction == PieceAction.SUMMON)
                    return true;
            }
        }
        return false;
    },

////////////////////// PIECE ACTION COMPLETE CALLBACK /////////////////////
    onPieceFinishedMove : function(piece){
        cc.log("MainBoard.js: onPieceFinishedMove");

        this.onPieceFinishedActiveMove(piece, PieceAction.NORMAL_MOVE);
    },

    onPieceFinishedKick : function(piece, kickTarget, finalKick){
        cc.log("[ACTION]------------->>> Piece :"+piece.getString()+" kicked piece : " + (kickTarget!=null? kickTarget.getString():"NO_PIECE"));

        if(!finalKick) //try combo kick
            return;

        this.onPieceFinishedActiveMove(piece, PieceAction.KICK_OTHER);
    },

    onPieceFinishedSummon : function(piece){
        cc.log("onPieceFinishedSummon");
        fr.Sound.playSoundEffect(resSound.g_go);
        this.onPieceFinishedActiveMove(piece, PieceAction.SUMMON);
    },

    onPieceCannotMove: function(){
        //for skill am sat
        var playerIndex = gv.matchMng.currTurnPlayerIndex;
        var pieceList = gv.matchMng.mainBoard.boardData.getPieceListSortedByNearestHome(playerIndex);
        var activePiece = null;
        for (var i=0; i<pieceList.length; i++){
            if (pieceList[i].isCanMovingOnBoard()){
                activePiece = pieceList[i];
                break;
            }
        }
        if (activePiece){
            var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_FINISH_ACTION_KICK, activePiece.playerIndex, activePiece.pieceIndex);
            if (skillEnable)
                return;
        }
        gv.matchMng.onPieceActionMoveFinish(null);
    },

    onPieceFinishedActiveMove : function(piece, pieceAction){
        cc.log("onPieceFinishedActiveMove, pieceAction = " + pieceAction);
        var newSlot = piece.currSlot;
        this.tileIndexFinishActive = newSlot;
        var tile = gv.matchMng.mapper.getTileForSlot(newSlot);
        GameUtil.resetForTurn(piece);
        if(tile!=null&&tile.isFreeze) {
            tile.display.resetFreezeTile();
            piece.setFreezePiece();
            ChangeGoldMgr.getInstance().activeChangeGoldInfo(function () {
                gv.matchMng.onPieceFinishAllActions(piece);
            }.bind(this));
            return;
        }
        ChangeGoldMgr.getInstance().activeChangeGoldInfo(function(){
            this.onActiveTileFeatureBeforeActiveSkill(piece,function(){this.onPieceActiveSkill(piece, pieceAction)}.bind(this));
        }.bind(this));
    },

    onPieceActiveSkill:function(piece, pieceAction){
        cc.log("onPieceActiveSkill");
        //xuat chuong
        var newSlot = piece.currSlot;
        if(newSlot>-1&& (!piece.isInZoo())){
            if (pieceAction == PieceAction.SUMMON) {
                if (gv.matchMng.diceManager.lastDiceResult!=null){//truong hop tra tien de xuat quan se ko kick hoat skill gi
                    var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_SUMMON_ROLL_DICE, piece.playerIndex, piece.pieceIndex);
                    if (skillEnable)
                        return;
                }
            }

            //di chuyen binh thuong
            if (pieceAction == PieceAction.NORMAL_MOVE) {
                //for skill am sat
                var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_FINISH_ACTION_KICK, piece.playerIndex, piece.pieceIndex);
                if (skillEnable)
                    return;

                skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_MOVE_ON_BOARD, piece.playerIndex, piece.pieceIndex);
                if (skillEnable)
                    return;
            }
        }
        // active cac skill o day truoc.
        ChangeGoldMgr.getInstance().activeChangeGoldInfo(function()
        {
            if(ChangeGoldMgr.getInstance().listGoldKickHorseHoe.length>0){
                var active = false;
                for (var i =0;i<ChangeGoldMgr.getInstance().listGoldKickHorseHoe.length;i++){// phai co thang player khac con tien thi moi active duoc?
                    var target = ChangeGoldMgr.getInstance().listGoldKickHorseHoe[i].playerTargetKick;
                    var playerinfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(target)
                    if(playerinfo.playerStatus.gold>0){
                        active = true;
                        break;
                    }
                }
                if(active){
                    var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_CALCULATE_KICK_FEE, piece.playerIndex, piece.pieceIndex);
                    if (skillEnable)
                        return;
                }
            }

            var haveRebornSkillActive = false;
            var rebornCurrentPlayer = false;
            if (gv.matchMng.destroyPiecesInTurn.length>0){// co piece bi chet trong turn
                for (var i=0; i<gv.matchMng.destroyPiecesInTurn.length; i++){
                    var deathPiece = gv.matchMng.destroyPiecesInTurn[i];
                    var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(deathPiece.playerIndex);
                    if (!playerInfo.lose){
                        var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_DIED, deathPiece.playerIndex, deathPiece.pieceIndex);
                        if (skillEnable ){
                            haveRebornSkillActive = true;
                            if (playerInfo.playerIndex == gv.matchMng.currTurnPlayerIndex)
                                rebornCurrentPlayer = true;
                        }
                    }
                }
            }
            if (!rebornCurrentPlayer){
                //cc.log("I died, not end now");
                GameUtil.callFunctionWithDelay(haveRebornSkillActive? 7: 0.1, this.onActiveTileFeature.bind(this, piece));
            }
        }.bind(this));
    },

    onActiveTileFeatureBeforeActiveSkill:function(piece,callback){
        cc.log("onActiveTileFeatureBeforeActiveSkill");
        var tile = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
        if(tile==null){
            callback();
            return;
        }
        switch (tile.type){
            case TileType.TILE_BOM:{
                //var callbackboom = gv.matchMng.bomMgr.onActiveBom(tile, piece, function(){
                //    callback();
                //}.bind(this));
                var popupBoom = new PopupChiemBoom(piece,function(){gv.matchMng.bomMgr.onActiveBom(tile, piece, function(){
                    callback();
                }.bind(this));}.bind(this));
                EffectMgr.getInstance().layerEffect.addChild(popupBoom);
                return;
            }
            case TileType.TILE_HOME_GATE:{ // bay gio day la o thu thue
                if(piece.currSlot != gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex))) {// piece nay khong dung o nha no hay khong
                    for (var i = 0; i < gv.matchMng.playerManager.getNumberPlayer(); i++) {
                        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                        if (piece.currSlot == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i)) && !playerInfo.lose) {// xem no co dung o cong nha doi thu hay khong va doi thu da bi pha san chua?
                            var guiNotification = new GuiNotificationSpecialTile(function(){
                                var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_TAX_CELL, piece.playerIndex, piece.pieceIndex,function(){ callback();}.bind(this));
                                if (skillEnable)
                                    return;
                                gv.matchMng.taxMgr.activeTax(piece.playerIndex, i, 0, function () {
                                    callback();
                                }.bind(this));
                                return;
                            }.bind(this),tile);
                            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
                            return;
                        }
                    }
                    callback();//truong hop nha nay da pha san roi
                    return;
                }
                callback();
                return;
            }

            case TileType.TILE_DESTINATION_GATE:{
                var callbackDestinationGate = function(){
                    for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
                        if((piece.currSlot+1)%40!= gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex))) {// no ko dung o cong chuong nha no
                            if((piece.currSlot+1)%40 == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i))){// xem no co dung o cong bat ky thu hay khong
                                //kick hoat skill
                                var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_START_CELL, piece.playerIndex, piece.pieceIndex,function(){ callback();}.bind(this));
                                if (skillEnable)
                                    return;
                            }
                        }
                    }
                    callback();
                }.bind(this);
                gv.matchMng.turnLightMgr.changeLightIndex(piece.playerIndex,(tile.index+1)%40/10,callbackDestinationGate,true);
                return;
            }
            case TileType.TILE_TELEPORT:{
                var targetSlot = GameUtil.getTeleportTargetSlotFrom(tile.index);
                var tileDestination = gv.matchMng.mapper.getTileForSlot(targetSlot);
                if(tileDestination.tileUp){// neu o teleprot ben kia bi nang len thi return;
                    callback();
                    return;
                }
                this.teleportMgr.tryTeleportPieceToSlot(piece, targetSlot, TeleType.TELE_INSTANT, function(){
                    callback();
                });
                return;
            }
            case TileType.TILE_JAIL :{
                var guiNotification = new GuiNotificationSpecialTile(function(){
                    gv.matchMng.zooMgr.horseGoZoo(piece);
                    GameUtil.callFunctionWithDelay(1,function(){callback();}.bind(this));
                }.bind(this),tile);
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
                return;
            }
        }
        callback();
    },

    onActiveTileFeature:function(piece){
        cc.log("onActiveTileFeature");
        var tile = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
        // can them vao khi hoi sinh o bay bang
        //todo cac o can dung den caActive: bat den, thu thue,boom
        // cac o con lai active skill xong se khong nhay ve ham piece active skill nua

        if(tile.isFreeze){
            tile.display.resetFreezeTile();
            piece.setFreezePiece();
            ChangeGoldMgr.getInstance().activeChangeGoldInfo(function()
            {
                gv.matchMng.onPieceFinishAllActions(piece);
            }.bind(this));
            return;
        }
        var canActive = (!(piece.currSlot == this.tileIndexFinishActive))&&tile.type != TileType.TILE_TELEPORT;// co nghia la no da teleport roi hoac teleport khong thanh cong
        var callbackTileFeature = function(){ gv.matchMng.onPieceActionMoveFinish(piece);}.bind(this);
        if(canActive){
            switch (tile.type){
                case TileType.TILE_BOM:{
                    //var callbackBoom = gv.matchMng.bomMgr.onActiveBom(tile, piece, function(piece){
                    //    gv.matchMng.onPieceActionMoveFinish(piece);
                    //}.bind(this, piece));
                    var popupBoom = new PopupChiemBoom(piece,function(){gv.matchMng.bomMgr.onActiveBom(tile, piece, function(piece){
                        gv.matchMng.onPieceActionMoveFinish(piece);
                    }.bind(this, piece));}.bind(this));
                    EffectMgr.getInstance().layerEffect.addChild(popupBoom);
                    return;
                }
                case TileType.TILE_HOME_GATE:{ // bay gio day la o thu thue
                    if(piece.currSlot != gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex))) {// piece nay khong dung o nha no hay khong
                        var guiNotification = new GuiNotificationSpecialTile(function(){
                            for (var i = 0; i < gv.matchMng.playerManager.getNumberPlayer(); i++) {
                                var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                                if (piece.currSlot == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i)) && !playerInfo.lose) {// xem no co dung o cong nha doi thu hay khong va doi thu da bi pha san chua?
                                    var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_TAX_CELL, piece.playerIndex, piece.pieceIndex);
                                    if (skillEnable)
                                        return;
                                    gv.matchMng.taxMgr.activeTax(piece.playerIndex, i, 0, function () {
                                        gv.matchMng.onPieceActionMoveFinish(piece)
                                    }.bind(this));
                                    return;
                                }
                            }
                            gv.matchMng.onPieceActionMoveFinish(piece);
                        }.bind(this),tile);
                        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
                        return;
                    }
                    gv.matchMng.onPieceActionMoveFinish(piece);
                    return;
                }
                case TileType.TILE_DESTINATION_GATE:{
                    var callbackDestinationGate = function(){
                        if((piece.currSlot+1)%40!= gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(piece.playerIndex))) {// no ko dung o cong chuong nha no
                            for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
                                if((piece.currSlot+1)%40 == gv.matchMng.mapper.getSummonSlotForStandPos(gv.matchMng.playerManager.getStandPosOfPlayer(i))){// xem no co dung o cong bat ky thu hay khong
                                    //kick hoat skill
                                    var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_START_CELL, piece.playerIndex, piece.pieceIndex);
                                    if (skillEnable)
                                        return;
                                }
                            }
                        }
                        gv.matchMng.onPieceActionMoveFinish(piece);
                    }.bind(this);
                    gv.matchMng.turnLightMgr.changeLightIndex(piece.playerIndex,(tile.index+1)%40/10,callbackDestinationGate,true);
                    //var guiNotification = new GuiNotificationSpecialTile(,tile);
                    //gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
                    return;
                }

                case TileType.TILE_TELEPORT:{
                    var targetSlot = GameUtil.getTeleportTargetSlotFrom(tile.index);
                    var tileDestination = gv.matchMng.mapper.getTileForSlot(targetSlot);
                    if(tileDestination.tileUp){// neu o teleprot ben kia bi nang len thi return;
                        gv.matchMng.onPieceActionMoveFinish(piece);
                        return;
                    }
                    this.teleportMgr.tryTeleportPieceToSlot(piece, targetSlot, TeleType.TELE_INSTANT, function(){
                        gv.matchMng.onPieceActionMoveFinish(piece);
                    });
                    return;
                }
                case TileType.TILE_JAIL :{
                    var guiNotification = new GuiNotificationSpecialTile(function(){
                        gv.matchMng.zooMgr.horseGoZoo(piece);
                        GameUtil.callFunctionWithDelay(1,function(){gv.matchMng.onPieceActionMoveFinish(piece);}.bind(this));// feeling :)
                    }.bind(this),tile);
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
                    return;
                }
            }
        }

        switch (tile.type){
            case TileType.TILE_MINI_GAME:
                //CUONG add minigame vao day
                var guiNotification = new GuiNotificationSpecialTile(function(){
                    gv.matchMng.minigameTuXiMgr.onEnterMiniGame(piece.playerIndex,  function() {
                        gv.matchMng.onPieceActionMoveFinish(piece);
                    });
                }.bind(this),tile);
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);

                break;
            //case TileType.TILE_MINI_GAME:{
            //    var guiNotification = new GuiNotificationSpecialTile(function(){
            //        gv.matchMng.horseRaceGameMgr.onEnterGame(piece.playerIndex,  function() {
            //            gv.matchMng.onPieceActionMoveFinish(piece);
            //        });
            //    }.bind(this),tile);
            //    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
            //    break;
            //}
            case TileType.TILE_CONTROL :            {
                var callbackFunction = function(){
                    if(gv.matchMng.currTurnPlayerIndex == 0){
                        var tileupPopup = new PopupUpTile(10,function(){
                            gv.matchMng.tileUpMgr.actionTileUp(piece,function(){ gv.matchMng.onPieceActionMoveFinish(piece);}.bind(this));
                        }.bind(this));
                        var size = cc.winSize;
                        tileupPopup.setPosition(-size.width/2,-size.height/2);
                        tileupPopup.setLocalZOrder(10000);
                        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(tileupPopup);
                    }else{
                        gv.matchMng.tileUpMgr.actionTileUp(piece,function(){ gv.matchMng.onPieceActionMoveFinish(piece);}.bind(this));
                    }
                }.bind(this);
                if(gv.matchMng.currTurnPlayerIndex == MY_INDEX){
                    callbackFunction();
                }else{
                    var guiNotification = new GuiNotificationSpecialTile(callbackFunction,tile);
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(guiNotification,10000);
                }
                break;
            }
            case TileType.TILE_DESTINATION:{
                if(tile.moneyIcon!= null && tile.moneyIcon.isVisible()){
                    tile.moneyIcon.setVisible(false);
                    if(tile.index % 100 == 0){
                        gv.matchMng.gameStatusObject.firstLoad1 = true;
                        ChangeGoldMgr.getInstance().addChangeGoldByFirstLoad(ChangeGoldType.FIRST_LOAD_1, piece.playerIndex);
                        tile.display.addSapHamEffect();
                        GameUtil.callFunctionWithDelay(2.0, function(){
                            EffectMgr.getInstance().showEffect(EffectType.SAP_HAM, function(){
                                gv.matchMng.onPieceActionMoveFinish(piece);
                            });
                            fr.Sound.playSoundEffect(resSound.g_sap_ham);
                        });
                    }
                    else{
                        gv.matchMng.gameStatusObject.firstLoad4 = true;
                        ChangeGoldMgr.getInstance().addChangeGoldByFirstLoad(ChangeGoldType.FIRST_LOAD_4, piece.playerIndex);
                        tile.display.addLenDinhEffect();
                        GameUtil.callFunctionWithDelay(2.0, function(){
                            EffectMgr.getInstance().showEffect(EffectType.LEN_DINH, function(){
                                gv.matchMng.onPieceActionMoveFinish(piece);
                            });
                            fr.Sound.playSoundEffect(resSound.g_first_to_6);
                        });
                    }
                }
                else{
                    gv.matchMng.onPieceActionMoveFinish(piece);
                }
                break;
            }
            default :
                gv.matchMng.onPieceActionMoveFinish(piece);
                break;
        }
    },

    ////not used
    //backupCurrentState : function(){
    //    if(this.backupStack.length == MAX_BACKUP_TURN)
    //        this.backupStack.shift();
    //    var currState = this.boardData.getBackupOfCurrentState();
    //    this.backupStack.push(currState);
    //
    //    cc.log("Backup current mainboard state finished!");
    //},
    //
    ////not used
    //revertMainboardToPrevState : function(numberTurn, callback){
    //
    //    cc.assert(numberTurn <= this.backupStack.length, "Underflow backup stack!" );
    //    var backupState = null;
    //    for(var i=0; i< numberTurn; i++)
    //       backupState = this.backupStack.pop();
    //
    //    var _this = this;
    //    this.mainBoardGui.showRevertMainboardAnimation(backupState, function(){
    //        _this.boardData.importBackupedState(backupState);
    //        callback();
    //    });
    //},

    returnAllPieceOfPlayerToHome : function(playerIndex){
        cc.log("returnAllPieceOfPlayerToHome: "+playerIndex);

        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var pieceList = playerInfo.matchData.pieceList;
        for(var i=0; i< pieceList.length; i++){
            var piece = pieceList[i];
            if(piece.getState() != PieceState.ON_HOME){
                var homeSlot = GameUtil.getHomeSlotForPlayer(playerIndex, piece.pieceIndex);
                this.teleportMgr.tryTeleportPieceToSlot(piece, homeSlot, TeleType.TELE_INSTANT, null);
            }
        }
    },

    setEnableIndicatorOnTileForHorse:function(enable, piece) {
        var mapper = gv.matchMng.mapper;
        if (enable == false) {
            var currTileIndex = 0;
            var currPlayerIndex = 0;
            for(var i=0; i< NUMBER_SLOT_IN_BOARD + NUMBER_DES_SLOT; i++){
                var currTileObj = mapper.getTileForSlot(currTileIndex);
                currTileObj.setEnableIndicator(false);
                currTileIndex = GameUtil.addSlot(currTileIndex, 1, currPlayerIndex);
            }
            return;
        }

        var currPlayerIndex = 0;
        if(piece.getState() == PieceState.MOVING_TO_DES){
            for(var tileOffset=1; tileOffset< 13; tileOffset++){
                var currTileIndex = GameUtil.addSlot(piece.currSlot, tileOffset, currPlayerIndex);
                if(currTileIndex < 0 || (currTileIndex>=100 && currTileIndex%100 +1 > NUMBER_DES_SLOT))
                    break;
                var currTileObj = mapper.getTileForSlot(currTileIndex);
                var pieceOnTile = this.boardData.getPieceAtSlot(currTileIndex);
                if(pieceOnTile!=null){
                    if(pieceOnTile.playerIndex!=piece.playerIndex) {
                        currTileObj.setEnableIndicator(true, tileOffset);
                    }
                    break;
                }
                currTileObj.setEnableIndicator(true, tileOffset);
            }
        }
    },

    setEnableIndicatorOnTile : function(enable){
        var mapper = gv.matchMng.mapper;
        var retList = [];
        if(enable){
            var currPlayerIndex = 0;
            for(var i=0; i < NUMBER_PIECE_PER_PLAYER; i++){
                var piece = this.boardData.getPieceOfPlayer(currPlayerIndex, i);
                if(piece.getState() == PieceState.MOVING_TO_DES){
                    for(var tileOffset=1; tileOffset< 13; tileOffset++){
                        var currTileIndex = GameUtil.addSlot(piece.currSlot, tileOffset, currPlayerIndex);
                        if(currTileIndex < 0 || (currTileIndex>=100 && currTileIndex%100 +1 > NUMBER_DES_SLOT))
                            break;
                        //var currTileObj = mapper.getTileForSlot(currTileIndex);
                        var pieceOnTile = this.boardData.getPieceAtSlot(currTileIndex);
                        if(pieceOnTile!=null){
                            if(pieceOnTile.playerIndex!=piece.playerIndex) {
                                //currTileObj.setEnableIndicator(true, tileOffset);
                                var obj = {};
                                obj.offset = tileOffset;
                                obj.type = pieceOnTile.playerIndex;
                                retList.push(obj);
                            }
                            break;
                        }
                        //currTileObj.setEnableIndicator(true, tileOffset);
                    }
                }
            }
        }

        /*else{
            var currTileIndex = 0;
            var currPlayerIndex = 0;
            for(var i=0; i< NUMBER_SLOT_IN_BOARD + NUMBER_DES_SLOT; i++){
                var currTileObj = mapper.getTileForSlot(currTileIndex);
                currTileObj.setEnableIndicator(false);
                currTileIndex = GameUtil.addSlot(currTileIndex, 1, currPlayerIndex);

            }
        }*/

        return retList;
    },

    //reset list piece
    resetListPiece:function(){
        while(this.listPieceRemoveFreeze.length>0){
            var piece = this.listPieceRemoveFreeze[0];
            this.listPieceRemoveFreeze.splice(0,1);
            piece.resetFreezePiece();
            piece.pieceDisplay.pieceActionAnim.setVisible(false);
            piece.isMoveByTileUp = false;
        }
    }
});
