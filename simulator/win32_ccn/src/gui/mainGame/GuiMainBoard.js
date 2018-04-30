/**
 * Created by user on 9/9/2015.
 */

/**
 * Created by Cantaloupe on 5/21/2015.
 */
//TIME_CHECK = 60;
var MainBoardZOrder = {
    BUBBLE_LAYER : 500,
    PIECE_NORMAL : 1000,
    BLACK_LAYER: 2000,
    TILE_BRIGHT: 3000,
    PIECE_BRIGHT: 4000,
    EFFECT: 8000,
    PLAYER_INFO: 9000,
    DICE_CONTROL: 9999,
};

var HighLightType = {
    OPACITY_HIGHLIGHT : 0,
    BLACK_LAYER_HIGHLIGHT : 1
};

var TradeData = cc.Class.extend({
    money: 0,
    payer: 0,
    receiver: 0,

    ctor: function(money, payer, receiver){
        this.money = money;
        this.payer = payer;
        this.receiver = receiver;
    },
});

var GuiMainBoard = BaseGui.extend({

    rollDiceBtn: null,
    blackLayer: null,
    isCrosshair: false,

    guiMainBoardPosition:null,

    ctor:function () {
        this._super(res.ZCSD_GUI_MAIN_BOARD);

        this.bg = this._centerNode.getChildByName("Ingame_background");

        this.mapper = new BoardMapper();
        this.mapper.loadData(this._centerNode);

        this.diceControl = new NodeDiceControl();
        this.diceControl.setPosition(cc.winSize.width-156,120);
        this.diceControl.setDisable();
        this._rootNode.addChild(this.diceControl, MainBoardZOrder.DICE_CONTROL);

        this.blackLayer = cc.LayerColor.create(cc.color(0, 0, 0, 120));
        this.blackLayer.setVisible(false);
        this.blackLayer.setPosition(-cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(this.blackLayer,MainBoardZOrder.BLACK_LAYER);

        this.ListPlayerMoney = {};

        this.guiMainBoardPosition = this.getPosition();
        this.lasttime = GameUtil.getCurrentTime();
        return true;
    },

    On_Update:function(dt){
        var currentTime = GameUtil.getCurrentTime();
        //cc.log("DELTA TIME    "+ (currentTime- this.lasttime ));
        if(currentTime- this.lasttime >TIME_CHECK){
            //reconnect o day
            gv.gameClient._clientListener.onDisconnected(gv.DISCONNECT_REASON.IDLE);
        }
    },

    onEnter: function(){
         this._super();
         this.listPayMoney = [];
         this.curPayIdx = 0;

    },

    //onExit: function(){
    //    this._super();
    //    if(gv.matchMng.diceManager){
    //        gv.matchMng.diceManager.cleanUp();
    //        gv.matchMng.diceManager = null;
    //    }
    //    fr.Sound.stopMusic();
    //},

    loadGameData: function(){
        var startColor = gv.matchMng.playerManager.getMineGlobalStandPos();
        this.initTileColor(startColor);
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).initPlayersInfo(startColor);
        this.initDestinationNumber();
    },

    initTileColor : function(startColor){
        for (var i=0; i<NUMBER_SLOT_IN_BOARD; i++){
            var color = (startColor + Math.floor(i/10))% MAX_NUMBER_PLAYER;
            var tile = this.mapper.getTileForSlot(i);
            if (tile.type == TileType.TILE_DESTINATION_GATE)
                tile.tileColor = (color+1)%MAX_NUMBER_PLAYER;
            else
                tile.tileColor = color;
            tile.reloadTile();
        }

        for(var i=0; i< MAX_NUMBER_PLAYER; i++){
            var color = (startColor+i) % MAX_NUMBER_PLAYER;
            for(var j=0; j < NUMBER_DES_SLOT; j++) {
                var desTile = this.mapper.getTileForSlot((i+1)*100 + j);
                desTile.tileColor = color;
                desTile.reloadTile();
            }
        }

        for (var i=0; i<MAX_NUMBER_PLAYER; i++){
            var color = (startColor+i) % MAX_NUMBER_PLAYER;
            var desSlot = this._centerNode.getChildByName("des_slot_" + i);
            fr.changeSprite(desSlot, "res/game/mainBoard/des_slot_" + GameUtil.getColorStringById(color) + ".png")
        }

        //xet mau va tao co cho o home
        for (var i=0; i<MAX_NUMBER_PLAYER; i++){
            var homeGateTile = gv.matchMng.mapper.getTileForSlot(i*10);
            //var arrow = homeGateTile.display.image.getChildByName("home_arrow");++
            //homeGateTile.display.image.setVisible(true);
            var taxSlot = homeGateTile.display.image.getChildByName("slot");
            var value = 0;
            if(i==0 || i == 2 ) value = 1;
            taxSlot.setTexture("res/game/mainBoard/home_tile/tax_slot_" + GameUtil.getColorStringById(homeGateTile.tileColor) + "_" +value+".png");
            homeGateTile.display.addSpecialEffect(TileType.TILE_HOME_GATE);
        }
    },

    initDestinationNumber : function(){
        for(var playerIndex = 0; playerIndex < gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
            for(var desIndex =0; desIndex < NUMBER_DES_SLOT; desIndex++){
                var desTile = gv.matchMng.mapper.getTileForSlot(GameUtil.getDestinationSlotForPlayer(playerIndex, desIndex));
                desTile.attachNumber(desIndex+6);
            }
        }
    },

    init3DLayer:function() {
        var layer3D = new jsb.Sprite3D();
        var testEff = jsb.PUParticleSystem3D.create("res/particle/particle3d/scripts/teleport2.pu");
        testEff.setPosition3D(cc.math.vec3(400,400,0));
        testEff.setScale(10);
        testEff.startParticleSystem();
        layer3D.addChild(testEff);
        layer3D.setGlobalZOrder(200);

        // add camera
        var winSize = cc.director.getWinSize();
        this._camera = cc.Camera.createOrthographic(winSize.width, winSize.height, 1, 2000);
        this._camera.setCameraFlag(cc.CameraFlag.USER1);
        this._camera.setPosition3D(cc.math.vec3(0, -500, 300));
        this._camera.setRotation3D(cc.math.vec3(50, 0, 0));
        this._camera.setDepth(10);
        gv.mainScene.addChild(this._camera);
        gv.mainScene.addChild(layer3D);
        layer3D.setCameraMask(cc.CameraFlag.USER1);
        cc.Camera.getDefaultCamera().setDepth(1);

    },

    makeJumpSmoke : function(position){
        var smoke = fr.AnimationMgr.createAnimationById(resAniId.eff_jump_smoke);
        smoke.getAnimation().gotoAndPlay("run", -1, -1, 1);
        smoke.setPosition(position);
        smoke.setScale(2.0);
        this.addChild(smoke);

        smoke.setCompleteListener(function(){
            smoke.removeFromParent();
        });
    },

    setVisibleOpponentTurnAnimation: function(visible){
        //this.opponentTurnAni.getAnimation().gotoAndPlay("run", 0,-1, 0);
        //this.opponentTurnAni.setVisible(visible);
    },

    highlightPlayerTurn: function(currTurnPlayerIndex){

        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).highlightPlayerTurn(currTurnPlayerIndex);

        for (var i=0; i<gv.matchMng.playerManager.getNumberPlayer(); i++){
            for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
                var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(i, pieceIndex);
                if(i == currTurnPlayerIndex)
                    piece.pieceDisplay.highLight(HighLightType.OPACITY_HIGHLIGHT);
                else{
                    if (piece.getState() != PieceState.FINISHED)
                        piece.pieceDisplay.unHighLight();
                }
            }
        }
    },


    // Player chon piece, sau khi chon thi callback len sever
    letPlayerChoosePiece : function(interactType, pieceList, needHintStone, callback){

        for(var i=0; i < pieceList.length; i++) {
            var piece = pieceList[i];
            piece.pieceDisplay.setEnableInteract(interactType ,
                function(pieceDisplay){
                    callback(pieceDisplay.pieceLogic)
                });
            piece.pieceDisplay.setVisibleHintStone(needHintStone);
            //piece.pieceDisplay.highLight(this.currHighLighType);
        }

        //EffectMgr.getInstance().setEnableTimerTurn(true, false, GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION),callback);

        var curTurnStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(gv.matchMng.currTurnPlayerIndex);
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(curTurnStandPos, GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION), callback);

    },

    disablePlayerChoosePiece : function(pieceList){

        // cuong
        if(pieceList.length>0){
            for(var i=0; i < pieceList.length; i++) {
                var piece = pieceList[i];
                if(piece!=null){
                    piece.pieceDisplay.setEnableInteract(InteractType.NONE , null);
                    piece.pieceDisplay.setVisibleHintStone(false);
                }else{
                    cc.log("piece is null");
                }
            }
        }

        //EffectMgr.getInstance().setEnableTimerTurn(false, false);
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).stopAllProgressBar();
    },

    preparingHighLightScreen : function(highlightType){
        this.currHighLighType = highlightType;

        if(highlightType == HighLightType.BLACK_LAYER_HIGHLIGHT)
            this.blackLayer.setVisible(true);
        else if(highlightType == HighLightType.OPACITY_HIGHLIGHT){
            this.setHighLightAllTile(false);
            /*
            for(var playerIndex =0; playerIndex < gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
                for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
                    var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, pieceIndex);
                    piece.pieceDisplay.unHighLight();
                }
            }
            */
        }
    },

    clearHighLightScreen : function(){
        if(this.currHighLighType == HighLightType.BLACK_LAYER_HIGHLIGHT){
            this.blackLayer.setVisible(false);
        }
        else if(this.currHighLighType == HighLightType.OPACITY_HIGHLIGHT){
            this.setHighLightAllTile(true);
        }
        /*
        for(var playerIndex =0; playerIndex < gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
            for(var pieceIndex = 0; pieceIndex < NUMBER_PIECE_PER_PLAYER; pieceIndex++){
                var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(playerIndex, pieceIndex);
                piece.pieceDisplay.unHighLight();
            }
        }
        */
    },

    setVisibleAllSolutionOfPieces : function(visible){
        if(visible)
            this.preparingHighLightScreen(HighLightType.OPACITY_HIGHLIGHT);

        var playData= gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(0).matchData;
        var pieceList=playData.pieceList;
        for(var i=0; i< pieceList.length; i++){
            var currPiece = pieceList[i];

            var solutionList = currPiece.getSolutionList();
            for(var j=0; j< solutionList.length; j++){
                if(visible)
                    solutionList[j].show();
                else
                    solutionList[j].hide();
            }
        }

        if(!visible){
            this.clearHighLightScreen();
        }
    },

    setDisableDiceControl: function(){
        gv.matchMng.mainBoard.setEnableIndicatorOnTile(false);
        this.diceControl.setDisable();
        //gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).getPlayerInfoPanelByStandPos(0).setVisible(true);
    },

    setEnableDiceControl : function(){
        var retList = gv.matchMng.mainBoard.setEnableIndicatorOnTile(true);
        this.diceControl.setEnable();
        //gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).getPlayerInfoPanelByStandPos(0).setVisible(false);

        // show fake suggest
        /*retList = [];
        var obj = {};
        obj.offset = 1;
        obj.type = 1;
        retList.push(obj);
        retList.push(obj);
        obj = {};
        obj.offset = 10;
        obj.type = 2;
        retList.push(obj);
        obj = {};
        obj.offset = 7;
        obj.type = 0;
        retList.push(obj);*/

        this.diceControl.setSuggest(retList);
    },

    zoomIn : function(trackPoint, scaleVal, zoomSpeed, callback){
        var moveDistance = cc.p(-trackPoint.x*scaleVal, -trackPoint.y*scaleVal);
        var preStep = cc.spawn(cc.scaleTo(zoomSpeed, scaleVal), cc.moveBy(zoomSpeed, moveDistance));
        this.runAction(cc.sequence(cc.EaseIn.create(preStep, 4.0), cc.callFunc(callback)));
    },

    zoomOut : function(zoomSpeed, callback){
        var moveTo = cc.moveTo(zoomSpeed, cc.p(0,0));
        var scaleTo = cc.scaleTo(zoomSpeed, 1.0);
        this.runAction(cc.sequence(cc.EaseIn.create(cc.spawn(moveTo, scaleTo),4.0), cc.callFunc(callback)));
    },

    // cuong lay vi tri cua nguoi choi :)
    getPlayerPropertyPos: function(standPos){
        return this._centerNode.getChildByName("player_property_"+standPos).getPosition();
    },

    getContentWithWiningType:function(winingType){
        switch (winingType){
            case WiningType.BANKRUPT: return fr.createSprite("res/game/guiwinlose/winingtype/bankrupt.png");
            case WiningType.COMPLETE_LIGHT: return fr.createSprite("res/game/guiwinlose/winingtype/completelight.png");
            case WiningType.COMPLETE_STABLE: return fr.createSprite("res/game/guiwinlose/winingtype/completestable.png");
        }
        return fr.createSprite("res/game/guiwinlose/winingtype/bankrupt.png")
    },

    showResult: function(winnerIndex,winingType){
        var size =cc.winSize;
        this.diceControl.setVisible(false);
        EffectMgr.getInstance().hideAllEffects();
        var isWin = (winnerIndex == 0);

        var spriteWiningType = this.getContentWithWiningType(winingType);
        spriteWiningType.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        spriteWiningType.setScale(0.9);

        //EffectMgr.getInstance().layerEffect.addChild(spriteWiningType,10000);
        gv.guiMgr.addGui(spriteWiningType,10000,LayerId.LAYER_POPUP);
        //this.addChild(spriteWiningType,10000);
        spriteWiningType.runAction(cc.sequence(
            cc.scaleTo(0.2,1.1),
            cc.scaleTo(0.2,0.9)
        ).repeatForever());

        this.runAction(cc.sequence(
            //cc.delayTime(0.5),
            cc.callFunc(function(){
                for (var i=0; i<gv.matchMng.playerManager.getNumberPlayer(); i++){
                    var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                    var position = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(player.standPos);
                    var ani = null;
                    if (i==winnerIndex){//winner
                        ani = fr.AnimationMgr.createAnimationById(resAniId.fire_work);
                    }
                    else{
                        ani = fr.AnimationMgr.createAnimationById(resAniId.lose_emotion);
                        ani.setScale(0.7);
                    }
                    ani.getAnimation().gotoAndPlay("run", 0, -1, 0);
                    ani.setPosition(position);
                    this.addChild(ani, 999999);

                    if (isWin)
                        fr.Sound.playSoundEffect(resSound.g_firework);

                }
            }.bind(this)),
            cc.delayTime(7.0),
            cc.callFunc(function(){
                spriteWiningType.removeFromParent();
                gv.guiMgr.removeGuiInList(10000);
                for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
                    for(var j=0;j<NUMBER_PIECE_PER_PLAYER;j++){
                        var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(i,j);
                        piece.pieceDisplay.setVisible(false);
                    }
                }
                gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION).Set_Visible_All_Character(false);
                var guiEndGame = new GuiEndGame(isWin,winingType);
                gv.guiMgr.addGui(guiEndGame, GuiId.END_GAME, LayerId.LAYER_POPUP);
            })
        ));
    },

    showRevertMainboardAnimation : function(backupState, callback){
        var actionList = [];
        var mainboard = gv.matchMng.mainBoard;
        for(var i=0; i< gv.matchMng.playerManager.getNumberPlayer(); i++){
            for(var j=0; j< NUMBER_PIECE_PER_PLAYER; j++){
                var piece = mainboard.boardData.getPieceOfPlayer(i,j);
                var statebak = backupState.piece_state[i][j];
                var moveAction = cc.moveTo(0.5, cc.p(statebak.tileStand.x, statebak.tileStand.y));
                actionList.push(cc.targetedAction(piece.pieceDisplay, moveAction));
            }
        }
        this.runAction(cc.sequence(cc.spawn(actionList), callback));
    },


    updatePieceAniNextTurn: function(){
        for (var i=0; i<gv.matchMng.playerManager.getNumberPlayer(); i++){
            var animationId;
            var loop;
            if (i==gv.matchMng.currTurnPlayerIndex){
                animationId = PieceAnimationId.IDLE_PREPARE;
                loop = false;
            }
            else {
                animationId = PieceAnimationId.IDLE_TIRED;
                loop = true;
            }
            for (var j=0; j<NUMBER_PIECE_PER_PLAYER; j++){
                var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(i, j);
                if (piece.getState() != PieceState.FINISHED){
                    piece.pieceDisplay.playAnimation(animationId, piece.pieceDisplay.direction, loop);
                }
                //piece.pieceDisplay.setOpacity((i==gv.matchMng.currTurnPlayerIndex)?255:100);
            }
        }
    },

    setHighLightAllTile : function(enable){
        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        var blendColor = enable ? cc.color(255,255,255,0) : cc.color(170,170,170, 100);
        mainBoardGui.bg.setColor(blendColor);

        for(var i=0; i< NUMBER_SLOT_IN_BOARD; i++){
            var currTile = gv.matchMng.mapper.getTileForSlot(i);
            if(enable)
                currTile.highLight();
            else
                currTile.unhighLight();
        }

        for(var standIndex = 0; standIndex < MAX_NUMBER_PLAYER; standIndex++){
            for(var desIndex =0; desIndex < NUMBER_DES_SLOT; desIndex++){
                var desTile = gv.matchMng.mapper.getTileForSlot((standIndex+1)*100 + desIndex);
                if(enable)
                    desTile.highLight();
                else
                    desTile.unhighLight();
            }
        }
    },
    showBankruptAtHome: function(standPos){
        var position = this.getPlayerPropertyPos(standPos);

        this.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.callFunc(function(){
                var bankruptAni = fr.AnimationMgr.createAnimationById(resAniId.bankrupt);
                bankruptAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                bankruptAni.setCompleteListener(function(){
                    bankruptAni.removeFromParent();
                });
                bankruptAni.setPosition(position);
                this.addChild(bankruptAni,9999999);
            }.bind(this))
        ));
    },

    showTeleportByBlackHole : function(pieceDisplay, desPosition, callback){

        var blackHole1 = fr.AnimationMgr.createAnimationById(resAniId.eff_black_hole);
        blackHole1.getAnimation().gotoAndPlay("run", -1, -1, 0);
        blackHole1.setScale(1.4);

        var blackHole2 = fr.AnimationMgr.createAnimationById(resAniId.eff_black_hole);
        blackHole2.getAnimation().gotoAndPlay("run", -1, -1, 0);
        blackHole2.setScale(1.4);

        var currPos = pieceDisplay.getPosition();
        blackHole1.setPosition(cc.p(currPos.x + 100, currPos.y));
        blackHole1.setScale(0);
        blackHole1.setLocalZOrder(MainBoardZOrder.EFFECT);

        blackHole2.setPosition(cc.p(desPosition.x+100, desPosition.y));
        blackHole2.setScale(0);
        blackHole1.setLocalZOrder(MainBoardZOrder.EFFECT);

        this.addChild(blackHole1);
        this.addChild(blackHole2);

        var blackHoleScaleOut = cc.scaleTo(0.25, 1.0).easing(cc.easeIn(3.0));
        var blackHoleScaleIn = cc.scaleTo(0.25, 0).easing(cc.easeIn(3.0));

        var moveInBlackHole = cc.moveTo(0.5, blackHole1.getPosition()).easing(cc.easeIn(3.0));
        var scaleInBlackHole = cc.scaleTo(0.5, 0.3).easing(cc.easeIn(3.0));
        var moveOutBlackHole = cc.moveTo(0.5, desPosition).easing(cc.easeIn(3.0));
        var scaleOutBlackHole = cc.scaleTo(0.5, 1.0).easing(cc.easeIn(3.0));

        var clearCallback = cc.callFunc(function(){
            blackHole1.removeFromParent();
            blackHole2.removeFromParent();
            callback();
        });

        var actionSeque = cc.sequence(
            cc.spawn(
                cc.targetedAction(blackHole1, blackHoleScaleOut),
                cc.targetedAction(blackHole2, blackHoleScaleOut.clone())
            ),
            cc.spawn(moveInBlackHole, scaleInBlackHole),
            cc.callFunc(function(){
               pieceDisplay.setPosition(blackHole2.getPosition());
            }),
            cc.spawn(moveOutBlackHole, scaleOutBlackHole),
            cc.spawn(
                cc.targetedAction(blackHole1, blackHoleScaleIn),
                cc.targetedAction(blackHole2, blackHoleScaleIn.clone())
            ),

            cc.delayTime(0.25),
            cc.callFunc(clearCallback));
        pieceDisplay.runAction(actionSeque);
    },

    effPayMoneyForRival:function(money,payerPos, receiverPos)
    {
        if(this.curPayIdx >= 2*MAX_NUMBER_PLAYER-1) this.curPayIdx = 0;
        this.listPayMoney[this.curPayIdx].payMoneyForRival(money,payerPos, receiverPos);
        this.curPayIdx++;
    },

    createMoney: function () {
        if(this.MODE_TEST)
        {
            this.numPlayer = 4;
        }else
        {
            this.numPlayer = gv.matchMng.playerManager.getNumberPlayer();
        }
        //

        // create gold
        //for(var num = 0; num < this.numPlayer; ++num)
        //{
        //    var playerGold = {};
        //    var Z_oder = 100;
        //    for(var i = 0; i < 4; ++i)
        //    {
        //        var listColum = [];
        //        for(var j = 0; j < i + 1; ++j)
        //        {
        //            var gold  =  new cc.Sprite("effMoney/gold.png");
        //            this.addChild(gold, Z_oder + j);
        //            gold.setVisible(false);
        //            listColum.push(gold);
        //        }
        //        playerGold[i] = listColum;
        //    }
        //
        //    this.ListPlayerGold[num] = playerGold;
        //}
        // create money
        for(var num = 0; num < this.numPlayer; ++num)
        {
            var playerMoney = {};
            var Z_oder = 200;


            for(var i = 0;i < 6; i ++)
            {
                var listColum = [];
                for(var j = 0; j < 6; ++j)
                {
                    var money =  new cc.Sprite("effMoney/money.png");

                    this.addChild(money, Z_oder + j);

                    money.setVisible(false);

                    listColum.push(money);
                }
                playerMoney[i] = listColum;
            }
            this.ListPlayerMoney[num] = playerMoney;
        }

        this.moneyUpdate();
    },

    setPlayerMoneyVisible: function (playerId) {
        for(var i = 0; i < 6; i++)
        {
            for(var j = 0; j < 6; ++j)
            {
                this.ListPlayerMoney[playerId][i][j].setVisible(false);
            }
        }
    },

    rePositionMoney: function (rate, playerId) {
        for(var i = 0; i < moneyPlayerConfig[rate].lists.length; ++i)
        {
            var pos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerId).standPos;
            var deltaX = 26*i;
            var deltaY = 16*i;
            //if(playerID == 1 && this.numPlayer == 2)
            //{
            //    pos = playerID+1;
            //
            //}else if(playerID == 2 && this.numPlayer == 3)
            //{
            //    pos = playerID + 1;
            //}

            if(moneyPosition[pos].flipX == -1)
            {
                deltaX = -26*i;
                deltaY = 16*i;
            }
            var posX = moneyPosition[pos].x - deltaX;
            var posY = moneyPosition[pos].y - deltaY;
            for(var j = 0; j < moneyPlayerConfig[rate].lists[i]; ++j)
            {

                this.ListPlayerMoney[playerId][i][j].setPosition(posX ,posY + 8*j);
                this.ListPlayerMoney[playerId][i][j].setVisible(true);
                this.ListPlayerMoney[playerId][i][j].setFlippedX(moneyPosition[pos].flipX);
            }
        }
    },
    moneyUpdate: function () {
        for(var playerId = 0; playerId < gv.matchMng.playerManager.getNumberPlayer(); playerId++)
        {
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerId);
            // set ti le tien o day
            var gold;
            var rate;
            var myPosition;
            gold = playerInfo.playerStatus.gold;
            myPosition = 0;
            rate = this.getClusterMoney(gold);
           //myPosition = gv.boardData.getMyPosition();

            //var moneyPos  = playerInfo.standPos;//listCardIdx[this.numPlayer][myPosition].listIdx[playerID];

            this.setPlayerMoneyVisible(playerId);
            this.updateKindMoney(rate, playerId);
            this.rePositionMoney(rate, playerId);
        }
    },

    updateKindMoney: function (rate, playerId) {
        for(var i = 0; i < 6; i++) {
            for(var j = 0; j < 6; ++j) {
                if(rate == 4) {
                    this.ListPlayerMoney[playerId][i][j].setTexture("effMoney/gold_money.png");
                }else {
                    this.ListPlayerMoney[playerId][i][j].setTexture("effMoney/money.png");
                }
            }
        }

    },

    getClusterMoney:function(money)
    {
        var rate = money*100/30000;
        if(rate < 10) //
        {
            return 0;
        }
        if(rate < 50)
        {
            return 1;
        }
        if(rate < 90)
        {
            return 2;
        }
        if(rate <= 150)
        {
            return 3;
        }
        if(rate > 150)
        {
            return 4;
        }
        return 0;

    },

    showSkillPopUp : function(standPos_Skill,callback){
        var numberPopup = 0;
        var close = false;
        var skill = "";
        for(var i=0; i< MAX_NUMBER_PLAYER; i++){
            var skillId = standPos_Skill[i];
            if(skillId==undefined || skillId == null) continue;
            var color = gv.matchMng.playerManager.getPlayerInfoByStandPos(i).playerColor;
            var skillId = standPos_Skill[i];
            skill = skillId;
            if(skillId>199){
                close = true;
            }else{
                EffectMgr.getInstance().Create_Action_Skill(skill,color);
                fr.Sound.playSoundEffect(resSound.skill_active_1);
                GameUtil.callFunctionWithDelay(2.5, callback);
                return;
            }
            var skillPopUp = new SkillPopup(skillId, i);
            var startPos, endPos;

            switch (i){
                case 0:
                    endPos=cc.p(cc.winSize.width/2 - skillPopUp.getSkillPopupSize().width/2, -cc.winSize.height/4);
                    startPos = cc.pAdd(endPos, cc.p(350,0));
                    break;
                case 1:
                    endPos=cc.p(cc.winSize.width/2 - skillPopUp.getSkillPopupSize().width/2, cc.winSize.height/4);
                    startPos = cc.pAdd(endPos, cc.p(350,0));
                    break;
                case 2:
                    endPos=cc.p(-cc.winSize.width/2+skillPopUp.getSkillPopupSize().width/2,  cc.winSize.height/4);
                    startPos = cc.pAdd(endPos, cc.p(-350,0));
                    break;
                case 3:
                    endPos=cc.p(-cc.winSize.width/2+skillPopUp.getSkillPopupSize().width/2, -cc.winSize.height/4);
                    startPos = cc.pAdd(endPos, cc.p(-350,0));
                    break;
            }

            skillPopUp.setPosition(startPos);

            var actions = [];
            actions.push(cc.delayTime(0.5*numberPopup+0.5));
            actions.push(cc.moveTo(1, endPos).easing(cc.easeElasticOut(0.2)));
            actions.push(cc.delayTime(0.5));
            actions.push(cc.spawn(
                cc.fadeOut(0.4),
                cc.scaleBy(0.4, 2)
            ).easing(cc.easeIn(4)));
            actions.push(cc.callFunc(skillPopUp.removeFromParent.bind(skillPopUp)));
            skillPopUp.runAction(cc.sequence(actions));
            this.addChild(skillPopUp, MainBoardZOrder.PLAYER_INFO);

            fr.Sound.playSoundEffect(resSound.skill_active_1);

            numberPopup++;

        }

        GameUtil.callFunctionWithDelay(1.5*numberPopup, callback);
        //if(close){
         //   GameUtil.callFunctionWithDelay(1.5*numberPopup, callback);
        //}
        //else{
        //
        //    GameUtil.callFunctionWithDelay(1.5*numberPopup, function(){
        //        EffectMgr.getInstance().Create_Action_Skill(skill,color);
        //        GameUtil.callFunctionWithDelay(1.0, function(){fr.Sound.playSoundEffect(resSound.skill_active_2);});
        //    }.bind(this));
        //    GameUtil.callFunctionWithDelay(1.5*numberPopup+2.5, callback);
        //}

    },

    showWaitingBubble : function(bubbleType){
        //var boardData = gv.matchMng.mainBoard.boardData;
        var currTurnPlayerIndex = gv.matchMng.currTurnPlayerIndex;
        var guiPlayerPosition = gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION);
        guiPlayerPosition.showBubble(bubbleType,gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(currTurnPlayerIndex).standPos);
        //for(var i=0; i< NUMBER_PIECE_PER_PLAYER; i++){
        //    var piece = boardData.getPieceOfPlayer(currTurnPlayerIndex, i);
        //    if(piece.getState()!=PieceState.FINISHED)
        //        piece.pieceDisplay.showBubble(bubbleType);
        //}
    }
    ,

    addChild: function(child, zOrder){
        zOrder = typeof zOrder!=='undefined' ? zOrder : child.getLocalZOrder();
        if (child!==this._rootNode)
            this._centerNode.addChild(child, zOrder);
        else
            this._super(child, zOrder);
    },

    updateDestinationMoneyVisible : function(currPlayerIndex){
        //invisible all
        for(var i=0; i< MAX_NUMBER_PLAYER; i++){
            var firstDes = (i+1)*100;
            var lastDes = firstDes + NUMBER_DES_SLOT -1;
            gv.matchMng.mapper.getTileForSlot(firstDes).setVisibleMoneyIcon(false);
            gv.matchMng.mapper.getTileForSlot(lastDes).setVisibleMoneyIcon(false);
        }

        //var mainboard = gv.matchMng.mainBoard;
        //var desGateSlot = GameUtil.getDestinationGateForPlayer(currPlayerIndex);

        var needShow = true;

        //for(var i=0; i< NUMBER_PIECE_PER_PLAYER; i++){
        //    var currPiece = mainboard.boardData.getPieceOfPlayer(currPlayerIndex, i);
        //    if(currPiece.getState() == PieceState.MOVING_TO_DES){
        //        var currPieceSlot = currPiece.currSlot;
        //        var distance = GameUtil.getSlotDistance(desGateSlot, currPieceSlot, currPlayerIndex);
        //        if(distance < 12){
        //            needShow = true;
        //            break;
        //        }
        //    }
        //
        //    if(currPiece.getState() == PieceState.ON_DES){
        //        needShow = true;
        //    }
        //}

        if(!gv.matchMng.gameStatusObject.firstLoad1){
            var firstDesSlot = GameUtil.getDestinationSlotForPlayer(currPlayerIndex, 0);
            gv.matchMng.mapper.getTileForSlot(firstDesSlot).setVisibleMoneyIcon(needShow);
            //cc.log("setVisibleMoneyIcon Submoney "+currPlayerIndex);
        }
        if(!gv.matchMng.gameStatusObject.firstLoad4){
            var lastDesSlot = GameUtil.getDestinationSlotForPlayer(currPlayerIndex, NUMBER_DES_SLOT-1);
            gv.matchMng.mapper.getTileForSlot(lastDesSlot).setVisibleMoneyIcon(needShow);
            //cc.log("setVisibleMoneyIcon Addmoney "+currPlayerIndex);
        }
    }
});
