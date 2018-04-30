/**
 * Created by GSN on 8/5/2015.
 */

var PlayMode = {
    MODE_NONE : 0,
    MODE_2_PLAYER : 1,
    MODE_4_PLAYER : 2
};

var GameState = {
    WAITING : 1,
    RACE_MINI_GAME : 2,
    PLAYER_IN_SKILL : 3,
    PLAYER_ROLL_DICE : 4,
    PLAYER_ACTIVE_PIECE : 5,
    TUXI_MINI_GAME:6,
    PLAYER_PAY_TO_SUMMON: 7
};

var MatchManager = cc.Class.extend({
    ctor : function(){
        this.gameStatusObject = null; //game status object server tra ve. read only!
        this.mainBoard = null;
        this.mapper = null;
        this.cameraManager = null;
        //this.fortuneManager = null;
        this.minigameMgr=null;
        this.horseRaceGameMgr=null;
        //this.minigame2Mgr=null;
        this.minigameTuXiMgr = null;
        this.focManager = null;
        this.diceManager = null;
        this.playerManager = null;
        this.skillManager = null;
        this.restRoom = null;
        this.currTurnPlayerIndex = -1;  //thu tu cua nguoi choi o turn hien tai
        this.isReconnect = false;
        this.timeRemain = 0;
        this.numberTurnPlayed = 0;  //so luong turn trong van choi
        this.playing = false;
        this.numberSolutionInTurn = 0;
        this.nextTurnTime = new Date().getTime()/1000;

        this.zooMgr = null;
        this.taxMgr = null;
        this.turnLightMgr = null;
        this.tileUpMgr = null;

        //this.delayTimeInTurn = 0; // thoi gian cho doi nhung action xuat hien trong turn
        this.destroyPiecesInTurn = [];
        this.currentTurnForAllPlayer = -1;
        this.firstPlayer = 0;
    },

    //khoi phuc lai trang thai van choi truoc do tu du lieu trong gameStatusObject
    restoreMatchState : function(){
        this.playing = true;
        this.currentTurnForAllPlayer = this.gameStatusObject.currentTurn;
        this.firstPlayer =  this.gameStatusObject.firstPlayerIndex;
        //this.currentTurnForAllPlayer = 9;
        //cc.log("restoreMatchState   " + this.currentTurnForAllPlayer);
        this.numberTurnPlayed = 1;
        this.currTurnPlayerIndex = this.playerManager.getPlayerIndexAtStandPos(this.mapper.convertGlobalToLocalStandPos(this.gameStatusObject.curPlayerIndex));
        cc.log("RECONNECT: Client turn:"+this.currTurnPlayerIndex);
        cc.log("RECONNECT : Server turn: "+this.gameStatusObject.curPlayerIndex);

        //tao danh sach piece theo tung playerIndex cuar nguoi choi
        var player_pieceList = [];
        for(var playerIndex=0; playerIndex < this.playerManager.getNumberPlayer(); playerIndex++){
            player_pieceList[playerIndex] = this.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerStatus.piecePosList;
        }

        var guiPlayerPosition = gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        guiPlayerPosition.Set_Visible_All_Character(true);

        var guiAutoplay = new AutoPlay();
        gv.guiMgr.addGui(guiAutoplay,GuiId.AUTO_PLAY,LayerId.LAYER_GUI);
        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        guiMainBoard.loadGameData();
        this.taxMgr.init();

        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).updatePlayerRank();

        //init cac o dac biet: minigame, khi van, teleport...
        this.mainBoard.initSpecialTile();
        this.mainBoard.init(player_pieceList, false);

        guiMainBoard.highlightPlayerTurn(this.currTurnPlayerIndex);
        guiMainBoard.updateDestinationMoneyVisible(this.currTurnPlayerIndex);

        var guiRestRoom = gv.guiMgr.getGuiById(GuiId.REST_ROOM);
        if (guiRestRoom!=null)
            guiRestRoom.destroy();

        for(var i=0; i< this.playerManager.getNumberPlayer(); i++){
            var standPos = this.playerManager.getStandPosOfPlayer(i);
            this.diceManager.initDiceGroupForPlayer(standPos);
            this.skillManager.initSkillForPlayer(i);
        }
        this.skillManager.resetSkillContextEnableOnTurn();
        //this.delayTimeInTurn = 0;
        this.destroyPiecesInTurn = [];

        this.diceManager.init3DLayer();

        this.diceManager.lastDiceResult = this.gameStatusObject.lastDiceResult;
        
        this.diceManager.numberContRoll = this.gameStatusObject.nDoubleValue;

        for(var i =0;i<this.gameStatusObject.listPlayerStatus.length;i++){
            for(var j = 0; j < this.gameStatusObject.listPlayerStatus[i].pieceFreeze; j++){
               var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(i, this.gameStatusObject.listPlayerStatus[i].pieceFreeze[j]);
                if(piece!=null){
                    piece.setFreezePiece();
                }
            }
        }
        var turnInZoo = 0;
        for(var i =0;i<this.gameStatusObject.listPlayerStatus.length;i++){
             if(this.gameStatusObject.listPlayerStatus[i].remainTurnInJail>0){
                 turnInZoo = this.gameStatusObject.listPlayerStatus[i].remainTurnInJail;
                 for(var j =0;j<NUMBER_PIECE_PER_PLAYER;j++){
                     var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(i,j);
                     var slot = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
                     if(slot.type == TileType.TILE_JAIL){
                         this.zooMgr.horseGoZoo(piece);
                     }
                 }
                 gv.matchMng.zooMgr.turn = 3-turnInZoo;
                 break;
             }
        }

        gv.guiMgr.getGuiById(GuiId.AUTO_PLAY).changeText();

        //khoi phuc lai trang thai game tuy theo trang thai
        switch (this.gameStatusObject.gameState){
            case GameState.WAITING:
                cc.log("GameState.WAITING");
                //this.mainBoard.calculateSolutionForAllPiece(this.diceManager.lastDiceResult, this.currTurnPlayerIndex);
                break;
            case GameState.RACE_MINI_GAME:
                cc.log("GameState.RACE_MINI_GAME");
                //gv.matchMng.minigameMgr.reconnect(this.gameStatusObject.selectionMap);
                gv.matchMng.horseRaceGameMgr.reconnect(this.gameStatusObject.selectionMap);
                //gv.matchMng.minigameTuXi.reconnect(this.gameStatusObject.selectionMap);
                break;
            case GameState.PLAYER_IN_SKILL:
                cc.log("GameState.PLAYER_IN_SKILL: pieceInSkillIndex = " + this.gameStatusObject.pieceInSkillIndex + ", skillId = " + this.gameStatusObject.skillId);
                this.skillManager.reconnect(this.gameStatusObject.pieceInSkillIndex, this.gameStatusObject.skillId);
                break;
            case GameState.TUXI_MINI_GAME:
                cc.log("GameState.TUXI_MINI_GAME :))))");
                //cc.log("this.gameStatusObject.params = " + this.gameStatusObject.params);
                gv.matchMng.minigameTuXiMgr.reconnect(this.gameStatusObject.params);
                break;
            case GameState.PLAYER_ROLL_DICE:
                cc.log("GameState.PLAYER_ROLL_DICE");
                guiMainBoard.setDisableDiceControl();
                //EffectMgr.getInstance().setEnableTimerTurn(false, false);
                gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).stopAllProgressBar();
                gv.gameClient.sendCommonRollDiceRequest(0);
                gv.gameClient._clientListener.dispatchPacketInQueue();
                break;
            case GameState.PLAYER_ACTIVE_PIECE:
                cc.log("GameState.PLAYER_ACTIVE_PIECE");
                this.mainBoard.calculateSolutionForAllPiece(this.diceManager.lastDiceResult, this.currTurnPlayerIndex);
                if(this.isMineTurn()){
                    for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++){
                        var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(0,i);
                        if(piece.solutionList.length>0&&!piece.isLockMoveByZoo()){
                            gv.gameClient.sendActivePiece(0,i,0);
                        }
                        //
                    }
                }
                gv.gameClient._clientListener.dispatchPacketInQueue();
                break;
            case GameState.PLAYER_PAY_TO_SUMMON:
                cc.log("GameState.PLAYER_PAY_TO_SUMMON");
                if (this.isMineTurn()){
                    gv.gameClient.sendPlayerPayToSummon(false);
                }
                gv.gameClient._clientListener.dispatchPacketInQueue();
                break;
        }
        fr.Sound.playMusic(resSound.music_main_game);
    },

    setupGameGui : function(){

        gv.guiMgr.removeAllGui();

        var mainBoardGui = new GuiMainBoard();
        gv.guiMgr.addGui(mainBoardGui, GuiId.MAIN_BOARD, LayerId.LAYER_GUI);

        gv.guiMgr.addGui(new GuiPlayerInfoPanel, GuiId.PLAYER_INFO_PANEL, LayerId.LAYER_GUI);

        var guiRestRoom = new GuiRestRoom();
        gv.guiMgr.addGui(guiRestRoom, GuiId.REST_ROOM, LayerId.LAYER_GUI);

        var guiSettingInGame = new GuiSettingInGame();
        gv.guiMgr.addGui(guiSettingInGame, GuiId.SETTING_IN_GAME, LayerId.LAYER_GUI);

        var guiCheat = new GuiCheat();
        gv.guiMgr.addGui(guiCheat, GuiId.CHEAT, LayerId.LAYER_GUI);

        var guiChatInGame= new GuiChatInGame();
        gv.guiMgr.addGui(guiChatInGame,GuiId.CHAT_IN_GAME,LayerId.LAYER_GUI);

        EffectMgr.getInstance().initEffect();

        this.mapper = mainBoardGui.mapper;

        // test thu xem the nao?
        var testGold = new TestGold();
        testGold.setPosition(-cc.winSize.width/2,-cc.winSize.height/2);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(testGold ,10000);
        testGold.setVisible(false);
        ChangeGoldMgr.getInstance().testGold = testGold;
    },

    initMatch : function(gameStatusObject){
        this.gameStatusObject = gameStatusObject;
        this.isReconnect = gameStatusObject.isStart;
        GameGenerator.getInstance().initRandom(gameStatusObject.skillRandomSeed, gameStatusObject.skillRandomNCalled);
        if(this.isReconnect){
            this.setupGameGui();
            this.initMatchComponent();
            this.playerManager.setPlayerForMatch(gameStatusObject.listPlayerStatus);
            this.restoreMatchState();
        }
        else{
            this.setupGameGui();
            this.initMatchComponent();
            this.restRoom = new RestRoom();
            this.restRoom.init();
            for(var i=0; i< gameStatusObject.listPlayerStatus.length; i++){
                this.restRoom.addPlayer(gameStatusObject.listPlayerStatus[i]);
            }
        }
    },

    //set nguoi choi nao duoc di dau tien
    setFirstPlayerIndex : function(gStartIndex){
        var localStandPos = this.mapper.convertGlobalToLocalStandPos(gStartIndex);
        this.currTurnPlayerIndex = this.playerManager.getPlayerIndexAtStandPos(localStandPos);
        cc.log("STARTER: ServerPlayerIndex: "+gStartIndex+" LocalStandPos: "+localStandPos+" LocalPlayerIndex: "+this.currTurnPlayerIndex)
    },

    //lay cac player trong restroom va add vao game match
    commitRestRoom : function(winnerStandPos){
        var playerList = this.restRoom.getListPlayerInRoom();
        cc.log("COMMIT REST ROOM: "+playerList.length+" players");
        this.playerManager.setPlayerForMatch(playerList);
        this.restRoom.showGuiChooseCard(winnerStandPos);
    },

    //init cac thanh phan quan ly logic cua van choi
    initMatchComponent : function(){
        cc.log("INIT MATCH COMPONENT");

        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        this.playerManager = new PlayerManager();
        this.playerManager.init(this.gameStatusObject);



        this.diceManager=new DiceManager();
        this.skillManager = new SkillManager();
        this.bomMgr = new BomMgr();
        guiMainBoard.addChild(this.diceManager);
        this.mainBoard = new MainBoard();
        this.cameraManager = new CameraManager(guiMainBoard);
        this.cameraManager.initUpdateRoutine();
        //this.fortuneManager = new FortuneManager(this.mainBoard);
        this.minigameMgr = new MiniGameMgr();
        this.horseRaceGameMgr = new HorseRaceGameMgr();
        this.minigame2Mgr = new MiniGame2Mgr();
        this.focManager = new FocManager();
        this.minigameTuXiMgr = new MinigameTuXiMgr();
        this.taxMgr = new TaxMgr();
        this.zooMgr = new ZooMgr();
        this.turnLightMgr = new TurnLightMgr();
        this.tileUpMgr = new TileUpMgr();
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(this.tileUpMgr);
    },

    prepareForStartGame: function(){
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).loadGameData();
        var guiAutoplay = new AutoPlay();
        gv.guiMgr.addGui(guiAutoplay,GuiId.AUTO_PLAY,LayerId.LAYER_GUI);
        //thiet lap cac o dac biet : minigame, teleport, khi van...
        this.mainBoard.initSpecialTile();

        fr.Sound.playMusic(resSound.music_main_game);

        var guiPlayerPosition = gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        guiPlayerPosition.Show_Player_When_Start_Game(function(){
            gv.matchMng.startGame();
        });
    },

    startGame : function(){

        DebugUtil.clearTrackLog();

        this.playing = true;
        //this.currTurnPlayerIndex = this.playerManager.getPlayerIndexAtStandPos(this.mapper.convertGlobalToLocalStandPos(this.gameStatusObject.curPlayerIndex));
        cc.log("startGame: firstPlayer = local:" + this.currTurnPlayerIndex);

        //thiet lap xuc sac va skill cho tung player
        for(var i=0; i< this.playerManager.getNumberPlayer(); i++){
            var standPos = this.playerManager.getStandPosOfPlayer(i);
            this.diceManager.initDiceGroupForPlayer(standPos);
            this.skillManager.initSkillForPlayer(i);
        }
        this.skillManager.resetSkillContextEnableOnTurn();
        //this.delayTimeInTurn = 0;
        this.destroyPiecesInTurn = [];
        this.diceManager.init3DLayer();

        //khoi tao vi tri ban dau cho cac piece dua vao thong tin server gui ve
        var player_pieceList = [];
        for(var playerIndex=0; playerIndex < this.playerManager.getNumberPlayer(); playerIndex++){
            player_pieceList[playerIndex] = this.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerStatus.piecePosList;
        }
        this.mainBoard.init(player_pieceList, false);

        //thu summon piece neu ca 3 piece deu o trong chuong
        this.mainBoard.doBeginMatchSummon();

        //test
        var skillEnable = false;
        for(var playerIndex=0; playerIndex < 4; playerIndex++){
            // duyet tat ca cac skill, neu co skill x2 tien thi active o day.
            for (var i =0;i<this.playerManager.getNumberPlayer();i++){
                var playerInfo = this.playerManager.getPlayerInfoByPlayerIndex(i);
                //cc.log("CUONG " + playerInfo.playerStatus.index );
                if(playerInfo.playerStatus.index ==playerIndex){
                    //cc.log("CUONG " + playerInfo.playerStatus.index );
                    var skillActive =this.skillManager.tryActiveSkill(SkillContext.ON_START_GAME,playerInfo.playerIndex,-1);
                    if(skillActive){
                        skillEnable = true;
                    }
                }
            }
        }

        //cho summon animation ket thuc -> bat dau turn moi
        var globalIndex = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.currTurnPlayerIndex).playerStatus.index;
        GameUtil.callFunctionWithDelay(skillEnable?8:2,this.startNewTurn.bind(this, globalIndex, false) );
        EffectMgr.getInstance().showEffect(EffectType.YOU_ARE_HERE);
        fr.Sound.playMusic(resSound.music_main_game);
        if(FAKE){//Dung de test gui luc vua bat dau van choi cho nhanh
            var guiMiniGame = new GuiHorseRaceGame();
            gv.guiMgr.addGui(guiMiniGame, GuiId.HORSE_RACE_GAME, LayerId.LAYER_LOADING);
        }

        this.turnLightMgr.initStartGame();
        this.taxMgr.init();
        this.taxMgr.addTurn();
    },

    //play tung xuc sac animation -> goi callback onAnimationRollDiceFinish
    startAnimationRollDice : function(diceResult){
        DebugUtil.log("ROLL_DICE ["+diceResult.score1+", "+diceResult.score2+"]", true);

        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        guiMainBoard.setDisableDiceControl();
        //EffectMgr.getInstance().setEnableTimerTurn(false, false);
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).stopAllProgressBar();
        var currTurnStandPos = this.playerManager.getStandPosOfPlayer(this.currTurnPlayerIndex);

        //cuong
        gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION).throwDiceToTheSky(currTurnStandPos,null);

        GameUtil.callFunctionWithDelay(0.5,function(){
            this.diceManager.throwDiceForPlayer(currTurnStandPos, diceResult, this.onAnimationRollDiceFinish.bind(this));
        }.bind(this));

        GameUtil.callFunctionWithDelay(2, EffectMgr.getInstance().showDiceNumber.bind(EffectMgr.getInstance(), diceResult.score1, diceResult.score2));

        fr.Sound.playSoundEffect(resSound.dice_thrown);

        GameUtil.callFunctionWithDelay(0.5 + 0.7, function(){
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(currTurnStandPos);
            var selectedDice = playerInfo.playerStatus.mainDice;
            fr.Sound.playRollDiceSoundEffect(selectedDice);
        });
    },

    onAnimationRollDiceFinish : function(){
        cc.log("onAnimationRollDiceFinish");
        //CUONG  push piece bi freeze
        for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++){
            var piece = this.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex, i);
            if(piece.isFreeze){
                gv.matchMng.mainBoard.pushListResetFreeze(piece);
            }
        }
        //tinh toan cac phuong an di chuyen (solution)
        this.numberSolutionInTurn = this.mainBoard.calculateSolutionForAllPiece(this.diceManager.getLastDiceResult(), this.currTurnPlayerIndex);
        this.numberSolutionInTurn = this.mainBoard.filterSolutionWithPriority();
        cc.log("TOTAL NUMBER SOLUTION: " + this.numberSolutionInTurn);

        var curPlayer = this.playerManager.getPlayerInfoByPlayerIndex(this.currTurnPlayerIndex);
        if (this.numberSolutionInTurn==0)
            curPlayer.playerStatus.nTurnNotMoving++;
        else
            curPlayer.playerStatus.nTurnNotMoving = 0;


        var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_ROLL_DICE_TO_KICK, gv.matchMng.currTurnPlayerIndex, -1);
        if (skillEnable){
            for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){// hide linecontroll
                var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex,i);
                if(piece!=null){
                    piece.pieceDisplay.lineControl.setVisible(false);
                }
            }
            return;
        }


        if (!this.mainBoard.mustKickInCurrentTurn() && !this.mainBoard.mustSummonInCurrentTurn()){
            var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_ROLL_DICE_TO_MOVE, gv.matchMng.currTurnPlayerIndex, -1);
            if (skillEnable){
                for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){// hide line controll
                    var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex,i);
                    if(piece!=null){
                        piece.pieceDisplay.lineControl.setVisible(false);
                    }
                }
                return;
            }
        }

        //cuong set visible LINE for piece can move
        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
            var piece = this.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex, pieceIndex);
            if(piece.getSolutionList().length>0){
                piece.pieceDisplay.lineControl.setVisible(true);
            }
        }

        if(this.isMineTurn()) {
            var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);

            //khong co phuong an di chuyen nao -> thong bao nomove
            if (this.numberSolutionInTurn == 0) {
                var isActivePiece = false;
                for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){
                    var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex,i);
                    if(piece.isMoveByTileUp){
                        var tile = gv.matchMng.mapper.getTileForSlot(piece.currSlot+1);
                        if(tile.tileUp){
                            isActivePiece = true;
                            break;
                        }
                    }
                }

                if(!isActivePiece){
                    EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, this.mainBoard.onPieceCannotMove.bind(this.mainBoard));
                    fr.Sound.playSoundEffect(resSound.g_cant_move);
                }else{
                    gv.gameClient._clientListener.dispatchPacketInQueue();
                }
                return;
            }
            else if(this.needLetPlayerChooseSolution()){ //co nhieu hon 2 phuong an di chuyen -> hien thi de nguoi lua chon
                guiMainBoard.setVisibleAllSolutionOfPieces(true);
            }
            if(this.numberSolutionInTurn == 1){
                for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++) {
                    var piece = this.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex, pieceIndex);
                    var pieceSolutionList = piece.getSolutionList();
                    //cc.log("pieceSolutionList.length  " + pieceSolutionList.length);
                    //cc.log("piece.isLockMoveByZoo  " + piece.isLockMoveByZoo());
                    if(pieceSolutionList.length>0&&piece.isLockMoveByZoo()){
                        var size = cc.winSize;
                        var zooPopup = new PopupPayForEscapeZoo(10,piece.playerIndex,piece.pieceIndex);
                        zooPopup.setPosition(-size.width/2,-size.height/2);
                        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(zooPopup,100000);
                        break;
                    }
                }
            }
        }
        else { //luot cua nguoi choi khac
            if (this.numberSolutionInTurn == 0) {
                this.mainBoard.onPieceCannotMove();
                return;
            }
            else if(this.needLetPlayerChooseSolution()){ //nhieu hon 2 phuong an di chuyen -> hien thong bao dang suy nghi tren tung piece doi thu
                var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                guiMainBoard.showWaitingBubble(BubbleType.WAIT_PIECE_ACTION);
            }
        }
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    needLetPlayerChooseSolution: function(){
        var kickSolutionNumber = 0;
        var summonSolutionNumber = 0;
        var totalSolution = 0;

        for(var pieceIndex=0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
            var piece = this.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex, pieceIndex);
            var pieceSolutionList = piece.getSolutionList();
            for (var i=0; i<pieceSolutionList.length; i++){
                var solution = pieceSolutionList[i];
                if(piece.isLockMoveByZoo()){

                }else{
                    if (solution.pieceAction == PieceAction.KICK_OTHER) kickSolutionNumber++;
                    else if (solution.pieceAction == PieceAction.SUMMON) summonSolutionNumber++;
                }
            }
            totalSolution+=pieceSolutionList.length;
        }
        DebugUtil.log("kickSolutionNumber: " + kickSolutionNumber + ", summonSolutionNumber:" + summonSolutionNumber);
        if (kickSolutionNumber == 1) return false;
        if (summonSolutionNumber == 1) return false;
        return (totalSolution>=2);
    },

    endGame : function(winnerIndex,winingType){
        cc.log("endGame. winnerid: "+ winnerIndex);
        gv.gameClient._clientListener.clearPacketQueue();
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).stopAllProgressBar();
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showResult(winnerIndex,winingType);
        fr.Sound.stopMusic();

        if(DebugConfig.AUTO_PLAY){
            var guiEndGame = gv.guiMgr.getGuiById(GuiId.END_GAME);
            guiEndGame.onPlayAgainBtnClick();
        }
    },

    leaveMatch : function(){
        this.cleanUpMatch();
        gv.guiMgr.addGui(new GuiLobby(), GuiId.LOBBY, LayerId.LAYER_GUI);
        gv.guiMgr.addGui(new GuiPlayerInfo(), GuiId.PLAYER_INFO, LayerId.LAYER_GUI);

        var userData = UserData.getInstance();
        if (!userData.completeTutorialMove || !userData.completeTutorialWin){
            userData.completeTutorialMove = true;
            userData.completeTutorialWin = true;
            gv.guiMgr.addGui(new GuiTutorialHelp(), GuiId.GUI_TUTORIAL_HELP, LayerId.LAYER_GUI);
        }
    },

    //debug method
    autoReplayGame : function(){
        this.cleanUpMatch();

        var logInGui = new GuiLogin();
        gv.guiMgr.addGui(logInGui, GuiId.LOGIN, LayerId.LAYER_GUI);
        logInGui.onZaloBtnClick();
    },

    cleanUpMatch : function(){
        gv.gameClient._clientListener.clearPacketQueue();
        if(this.diceManager){
            this.diceManager.cleanUp();
            this.diceManager = null;
        }
        EffectMgr.getInstance().clearEffect();
        gv.guiMgr.removeAllGui();
        fr.Sound.stopMusic();
        this.playing = false;
    },

    getCurrTurnPlayerIndex : function(){
        return this.currTurnPlayerIndex;
    },

    startNewTurn : function(globalIndex, canPayToSummon){
        for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex,i);
            if(piece!=null){
                piece.pieceDisplay.lineControl.setVisible(false);
            }
        }

        var lastPlayer = this.currTurnPlayerIndex;
        if(this.numberTurnPlayed != 0){//neu ko phai luot choi dau tien cua van choi
            //chuyen luot choi sang nguoi tiep theo, bo qua nhung nguoi da thua (bankrupt)
            do{
                this.currTurnPlayerIndex = (this.currTurnPlayerIndex+1) % this.playerManager.getNumberPlayer();
                var playerInfo = this.playerManager.getPlayerInfoByPlayerIndex(this.currTurnPlayerIndex);
            }
            while(playerInfo.lose);
        }

        this.numberTurnPlayed++;
        var playerInfo = this.playerManager.getPlayerInfoByPlayerIndex(this.currTurnPlayerIndex);

        //check conflict voi server, them dieu kien de chi ghi log thang dau tien
        if(globalIndex != undefined && playerInfo.playerStatus.index != globalIndex && gv.matchMng.playerManager.getMineGlobalStandPos() == 0){
            DebugUtil.log("CONFLICT. serverTurn: "+globalIndex+" Client turn: "+playerInfo.playerStatus.index, true);
            var stringLog = DebugUtil.getTrackLog();
            gv.gameClient.sendTrackLog(stringLog);

            //reconnect when conflict
            if (!gv.guiMgr.getGuiById(GuiId.CONFLICT))
                gv.guiMgr.addGui(new GuiConflict("CONFLICT TURN"), GuiId.CONFLICT, LayerId.LAYER_LOADING);

            return;
        }

        this.zooMgr.addTurn(this.currTurnPlayerIndex);

        if (this.currTurnPlayerIndex == this.bomMgr.getPlayerIndexOfBom()){
            this.bomMgr.updateBomTurn();
        }
        //Update UI
        //var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        //guiMainBoard.updatePieceAniNextTurn();

        this.diceManager.resetTurnData();
        this.skillManager.resetSkillContextEnableOnTurn();
        //this.delayTimeInTurn = 0;
        this.destroyPiecesInTurn = [];

        DebugUtil.log("START_NEW_TURN. ClientPlayerIndex: " + playerInfo.playerStatus.index + " ServerPlayerIndex: " + globalIndex, true);
        DebugUtil.log("MATCH_STATE. "+this.playerManager.dumpPieceInformationOfAllPlayers(), true);
        DebugUtil.log("Can pay to summon = " + canPayToSummon);

        var listTileUp = [];
        var listFreezeTrap = [];
        for(var i =0;i<NUMBER_SLOT_IN_BOARD;i++){
            var slot = gv.matchMng.mapper.getTileForSlot(i);
            if(slot.tileUp){
                listTileUp.push(i);
            }
            if(slot.isFreeze){
                listFreezeTrap.push(i);
            }
        }

        DebugUtil.log("LIST TILE UP "+listTileUp, true);
        DebugUtil.log("LIST ICE TRAP " + listFreezeTrap, true);
        DebugUtil.log("BOM TILE: " + this.bomMgr.toString());

        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).updatePlayerRank();

        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        guiMainBoard.highlightPlayerTurn(this.currTurnPlayerIndex);
        guiMainBoard.updateDestinationMoneyVisible(this.currTurnPlayerIndex);

        //hidePlayer;
        var guiPlayerPosition = gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        guiPlayerPosition.Set_Opacity_Player(playerInfo.standPos);
        guiPlayerPosition.addEffectCurrentTurn(playerInfo.standPos);

        var time = 0;
        if(this.numberTurnPlayed!=0&&this.isMineTurn()){
            time = GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION);
        }else{
            time = TimeoutConfig.TIMEOUT_ACTION;
        }

        for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){
            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex,i);
            if(piece!=null&&piece.state!=PieceState.NONE && piece.state!=PieceState.FINISHED && piece.state!= PieceState.ON_HOME){
                piece.pieceDisplay.lineControl.setVisible(true);
            }
        }

        var callbackEndTurn = function(){
            EffectMgr.getInstance().showNextTurnEffect(gv.matchMng.isMineTurn(), function(){
                var currStandPos = this.playerManager.getStandPosOfPlayer(this.currTurnPlayerIndex);
                gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).stopAllProgressBar();
                if(this.isMineTurn()){
                    //tao co hoi tra tien de xuat quan
                    if (canPayToSummon){
                        gv.guiMgr.addGui(new PopupPayForSummon(time), GuiId.POPUP_PAY_FOR_SUMMON, LayerId.LAYER_POPUP);
                    }
                    else{
                        guiMainBoard.setEnableDiceControl();
                        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(currStandPos, this.timeRemain!=0? this.timeRemain : time, function(){
                            gv.gameClient.sendCommonRollDiceRequest(0);
                        });

                        this.timeRemain = 0;
                    }
                }
                else{
                    guiMainBoard.setDisableDiceControl();
                    gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(currStandPos, this.timeRemain!=0? this.timeRemain : time, null);
                    guiMainBoard.showWaitingBubble(canPayToSummon? BubbleType.WAIT_PLAYER_PAY_TO_SUMMON: BubbleType.WAIT_DICE_ROLL);
                }
                gv.gameClient._clientListener.dispatchPacketInQueue();
            }.bind(this));
        }.bind(this);

        for(var i =0;i<4;i++){// toi da 4 ng choi duyet 4 lan :P
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.firstPlayer);
            if(!playerInfo.lose){
                break;
            }else{
                (this.firstPlayer++)%gv.matchMng.playerManager.getNumberPlayer();
            }
        }

        if(this.currTurnPlayerIndex == this.firstPlayer){// tinh toan so turn trong van choi
            this.currentTurnForAllPlayer++;
            gv.guiMgr.getGuiById(GuiId.AUTO_PLAY).changeText();
            if(this.currentTurnForAllPlayer == 9){
                // can xu ly popup con 5 luot nua
                var popup = new Popup5Turn(callbackEndTurn);
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(popup,10000);
                popup.setPosition(-cc.winSize.width/2,-cc.winSize.height/2);
                return;
            }else{
                if(this.currentTurnForAllPlayer == 15){
                    var popup = new Popup15Turn(callbackEndTurn);
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(popup,10000);
                    popup.setPosition(-cc.winSize.width/2,-cc.winSize.height/2);
                    return;
                }

            }
        }

        callbackEndTurn();
        //EffectMgr.getInstance().showNextTurnEffect(gv.matchMng.isMineTurn(), function(){
        //    var currStandPos = this.playerManager.getStandPosOfPlayer(this.currTurnPlayerIndex);
        //    if(this.isMineTurn()){
        //        //tao co hoi tra tien de xuat quan
        //        if (canPayToSummon){
        //            gv.guiMgr.addGui(new PopupPayForSummon(time), GuiId.POPUP_PAY_FOR_SUMMON, LayerId.LAYER_POPUP);
        //        }
        //        else{
        //            guiMainBoard.setEnableDiceControl();
        //            gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(currStandPos, this.timeRemain!=0? this.timeRemain : time, function(){
        //                gv.gameClient.sendCommonRollDiceRequest(0);
        //            });
        //
        //            this.timeRemain = 0;
        //        }
        //    }
        //    else{
        //        guiMainBoard.setDisableDiceControl();
        //        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(currStandPos, this.timeRemain!=0? this.timeRemain : time, null);
        //        guiMainBoard.showWaitingBubble(canPayToSummon? BubbleType.WAIT_PLAYER_PAY_TO_SUMMON: BubbleType.WAIT_DICE_ROLL);
        //    }
        //    gv.gameClient._clientListener.dispatchPacketInQueue();
        //}.bind(this));
    },

    onPieceActionMoveFinish : function(piece){
        fr.GameLog.log("onPieceActionMoveFinish");
        if(ChangeGoldMgr.getInstance().isFirstLoad4){
            var skillEnable = gv.matchMng.skillManager.tryActiveSkill(SkillContext.ON_BONUS_FIRST_LOAD, piece.playerIndex, piece.pieceIndex);
            if (skillEnable)
                return;
        }

        if(piece!=null){
            //GameUtil.resetForTurn(piece);
            for(var i=0;i<NUMBER_PIECE_PER_PLAYER;i++) {
                var piece1 = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(piece.playerIndex, i);
                if(piece1.state  == PieceState.ON_DES){
                    gv.matchMng.mainBoard.boardData.updatePieceState(piece1);
                    piece1.pieceDisplay.updateNewPosition();
                }
            }
            piece.pieceDisplay.pieceActionAnim.setVisible(false);
            piece.pieceDisplay.grow.setVisible(false);
            var tile = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
            if(tile!=null && tile.isFreeze){
                tile.display.resetFreezeTile();
                piece.setFreezePiece();
            }
        }

        ChangeGoldMgr.getInstance().activeChangeGoldInfo(function(){
            this.onPieceFinishAllActions(piece);
        }.bind(this));
    },

    onPieceFinishAllActions: function(piece){
        if(piece!=null) {
            if (piece.playerIndex != gv.matchMng.currTurnPlayerIndex) return;
                    }

        this.mainBoard.tileIndexFinishActive= -2;
        this.mainBoard.resetListPiece();
        this.taxMgr.addTurn();
        this.zooMgr.resetHorseGoZoo();
        DebugUtil.log("onPieceFinishAllActions");

        ChangeGoldMgr.getInstance().cleanActiveSkillLoad();
        if(piece!=null){
            for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){// resest calculate solution in end turn;
                var piece1 = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(piece.playerIndex,i);
                piece1.pieceDisplay.lineControl.setVisible(false);
                if(piece1.isMoveByTileUp){
                    piece1.isMoveByTileUp = false;
                }
            }
        }

        if (piece!=null){
            piece.kickedList = [];
            cc.log("onPieceFinishAllActions: piece.kickedList.length = " + piece.kickedList.length + " of player[" + piece.playerIndex+"," + piece.pieceIndex+"]");
        }
        var check = false;
        if(piece!=null){
            check = this.turnLightMgr.warningLight(piece.playerIndex);

        }
        var timeDelay = check?5:0;
        GameUtil.callFunctionWithDelay(timeDelay,function(){
            if(this.diceManager.canDoContinousRoll()){
                DebugUtil.log(">>>>>>>>>>>>>> CONTINUE ROLL <<<<<<<<<<<<<<<");
                DebugUtil.log("MATCH_STATE. "+ this.playerManager.dumpPieceInformationOfAllPlayers(), true);

                var listTileUp = [];
                var listFreezeTrap = [];
                for(var i =0;i<NUMBER_SLOT_IN_BOARD;i++){
                    var slot = gv.matchMng.mapper.getTileForSlot(i);
                    if(slot.tileUp){
                        listTileUp.push(i);
                    }
                    if(slot.isFreeze){
                        listFreezeTrap.push(i);
                    }
                }

                DebugUtil.log("LIST TILE UP "+listTileUp, true);
                DebugUtil.log("LIST FREE TRAP " + listFreezeTrap, true);
                DebugUtil.log("BOM TILE: " + this.bomMgr.toString());


                this.diceManager.skillAcceleration = false;
                gv.gameClient._clientListener.dispatchPacketInQueue();

                gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).updatePlayerRank();

                var guiMainBoard =  gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                var curPlayer = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.currTurnPlayerIndex);
                if ((!curPlayer.lose) && (!curPlayer.win)){

                    for(var i =0;i<NUMBER_PIECE_PER_PLAYER;i++){
                        var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(this.currTurnPlayerIndex,i);
                        if(piece!=null&&piece.state!=PieceState.NONE && piece.state!=PieceState.FINISHED && piece.state!= PieceState.ON_HOME){
                            piece.pieceDisplay.lineControl.setVisible(true);
                        }
                    }
                    if (this.isMineTurn()) {
                        guiMainBoard.setEnableDiceControl();
                        EffectMgr.getInstance().showEffect(EffectType.ROLL_DICE_MORE);
                    }
                    else{
                        guiMainBoard.showWaitingBubble(BubbleType.WAIT_DICE_ROLL);
                    }
                    var time = 0;
                    if(this.isMineTurn()){
                        time = GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION);
                    }else{
                        time = TimeoutConfig.TIMEOUT_ACTION
                    }
                    gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(curPlayer.standPos, time, function(){
                        gv.gameClient.sendCommonRollDiceRequest(0);
                    });
                    guiMainBoard.updateDestinationMoneyVisible(this.currTurnPlayerIndex);
                    //log thoi gian thuc hien 1 turn
                    cc.log("Time Action In Turn: " + (new Date().getTime()/1000 - gv.matchMng.nextTurnTime).toFixed(2) + " s");
                    gv.matchMng.nextTurnTime = new Date().getTime()/1000;
                }
                else{
                    this.endingTurn();
                }
                gv.matchMng.skillManager.resetSkillContextEnableOnTurn();
                gv.matchMng.destroyPiecesInTurn = [];
                //this.delayTimeInTurn = 0;
            }
            else
                this.endingTurn();
        }.bind(this));
    },

    endingTurn : function(){
        cc.log("---------------ENDING TURN-----------------");
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    isMineTurn : function(){
        return this.currTurnPlayerIndex == 0;
    },

    getCurrentTurnNumber : function(){
        return this.numberTurnPlayed;
    },

    cooldownPlayerTurn : function(playerIndex, numberCooldown){
        var playerData = this.mainBoard.getPlayerDataAtIndex(playerIndex);
        playerData.numberTurnCooldown+= numberCooldown;
    },

    checkPlayerBankRupt : function(){
        //var haveBankRupt = false;
        for(var i=0; i< this.playerManager.getNumberPlayer(); i++){
            var playerInfo = this.playerManager.getPlayerInfoByPlayerIndex(i);
            if(!playerInfo.lose && playerInfo.playerStatus.gold <=0 ){
                DebugUtil.log("BANKRUPT ClientPlayerIndex: " + playerInfo.playerIndex+" ServerPlayerIndex: "+playerInfo.playerStatus.index, true);
                this.playerManager.setPlayerLose(playerInfo.standPos);
                this.playerManager.checkPlayerWin();
                for(var pieceIndex=0;pieceIndex<NUMBER_PIECE_PER_PLAYER;pieceIndex++){
                    var piece1 = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerInfo.playerIndex, pieceIndex);
                    if(piece1!=null){
                        piece1.resetFreezePiece();
                        piece1.pieceDisplay.setVisible(false);
                    }
                }
                if(gv.matchMng.taxMgr.listSpriteMultiTax[i]!=null){
                    gv.matchMng.taxMgr.listSpriteMultiTax[i].setVisible(false);
                }
                gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION).setVisibleCharacter(playerInfo.standPos);
                this.bomMgr.clearAllBom(playerInfo.playerIndex);
                if (i == 0){
                    var notiPopup = new PopupNotification(fr.Localization.text("bankrupt_notification"));
                    gv.guiMgr.addGui(notiPopup, GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
                    notiPopup.runAction(cc.sequence(
                        cc.delayTime(2.0),
                        cc.callFunc(notiPopup.destroy.bind(notiPopup))
                    ));
                }
            }
        }
        //return haveBankRupt;
    },

    isEnemy: function(playerIndex1, playerIndex2){
        return playerIndex1!=playerIndex2;
        //if (playerIndex1!=playerIndex2)
        //    return true;
        //return false;
    }
});