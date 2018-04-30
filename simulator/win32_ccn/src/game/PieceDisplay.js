 /**
 * Created by user on 20/8/2015.
 */

var PieceAnimationId = {
    IDLE : 0,
    IDLE_PREPARE: 1,
    IDLE_TIRED: 2,
    JUMP : 3,
    ATTACK : 4,
    BE_ATTACKED : 5,
    FINISH: 6,
};

var EmoticonType = {
    EMO_SMILE : 0,
    EMO_SAD : 1,
    EMO_DEFENSE : 2
};

var BubbleType = {
    NONE : 0,
    WAIT_DICE_ROLL : 1,
    WAIT_PIECE_ACTION : 2,
    BUBBLE_WAIT_PLAY_MINIGAME: 3,
    BUBBLE_NOT_ENOUGH_MONEY : 4,
    BUBBLE_NOT_ENOUGH_PLAYER : 5,
    WAIT_PLAYER_PAY_TO_SUMMON: 6
};

var PieceEffectId = {
    APPEAR: 0,
    ON_DES_GATE: 2,
};

var PieceScale = {
    IN_HOME: 0.7,
    NORMAL: 1.0
};

var PIECE_BONE_COLOR = {
    BLUE: "",
    GREEN: "color_2_",
    RED: "color_1_",
    YELLOW: "color_0_"
};

var ACTION_JUMP_TAG = 1;
var BLINK_TAG = 2;

var PieceDisplay = cc.Sprite.extend({
    ctor:function(pieceId, color, pieceLogic){
        this.pieceAni = null;
        this.horseAni = null;
        this.winFlag = null;
            //cuong
        this.pieceInHome = null;
            //
        this.pieceShadow = null;
        this.crystal = null;
        this.sleepAni = null;
        this.touchEnable = false;
        this.isBack = false;
        this.isFlip = false;
        this.animationId = -1,
        this.direction = PieceDirect.BOTTOM_LEFT;
        this.moveMileList = [];
        this.playerColor = PlayerColor.NONE;
        this.pieceLogic = null;
        this.tileStanding = null;
        this.interactType = InteractType.NONE;
        this.interactCallback = null;
        this.cameraFocusing = false;
        this.needResetCamera = false;
        this.highLighted = true;
        this.highLightType = HighLightType.OPACITY_HIGHLIGHT;
        this.hintStone = null;
        //this.pedestal = null;
        //this.needPause = false;

        this.lineControl=null;
        this.pieceActionAnim=null;

        this.STANDARD_SCALE = 0.82;
        this.moveLength = 0;

        //this.idleTime= 0;
        //this.MAX_IDLE_TIME = 30;


        this._super("res/game/mainBoard/empty_piece.png");
        this.setCascadeOpacityEnabled(true);
        this.setAnchorPoint(0.5,0.05);
        this.pieceLogic = pieceLogic;
        this.playerColor = color;
        this.blink = false;

        //this.horseAni = fr.AnimationMgr.createAnimationById(GameUtil.getColorStringById(color)+"_horse",this);
        //this.horseAni.setPosition(this.getContentSize().width/2, 0);
        //this.addChild(this.horseAni, 999);
        this.horseAni = fr.createSprite("res/game/Horse/"+GameUtil.getColorStringById(color)+"_horse2.png");
        //this.horseAni.setBlendFunc(gl.ONE,gl.ONE);
        this.horseAni.setPosition(this.getContentSize().width/2, this.getContentSize().height/2-20);
        this.addChild(this.horseAni, 999);
        this.setScale(this.STANDARD_SCALE);

        this.pieceId = pieceId;
        this.pieceAni = fr.AnimationMgr.createAnimationById(this.pieceId,this);
        this.pieceAni.setPosition(this.getContentSize().width/2, 0);
		this.pieceAni.setCompleteListener(this.onFinishAnimations.bind(this));
        this.addChild(this.pieceAni, 999);

        this.winFlag = null;
        //cuong
        this.pieceInHome = fr.createSprite("res/game/Horse/"+GameUtil.getColorStringById(color)+"_horse2.png");
        this.pieceInHome.setAnchorPoint(0.5, 0);
        this.pieceInHome.setScale(0.6);
        this.pieceInHome.setPosition(this.convertToNodeSpace(this.getPosition()));
        this.addChild(this.pieceInHome);

        //

        var shadowImg = "res/game/Horse/"+GameUtil.getColorStringById(this.playerColor) + "_horse2.png";
        var shadowTarget = this;
        this.pieceShadow = new CharacterShadow(shadowImg, shadowTarget);
        this.addChild(this.pieceShadow,0);

        this.hintStone = new HintDestination();
        this.hintStone.setLocalZOrder(this.getLocalZOrder()+1);
        this.hintStone.addClickEventListener(this.onHintStoneClick.bind(this));
        this.hintStone.setVisible(false);
        this.addChild(this.hintStone, this.pieceAni.getLocalZOrder()+1);

        this.pieceStatue = null;

        var _this = this;
        //if (this.pieceLogic.playerIndex == 0) {
            // add event touch to show indicators
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var rect = cc.rect(-50, -50, 100, 100);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        gv.matchMng.mainBoard.setEnableIndicatorOnTileForHorse(true, _this.pieceLogic);
                        fr.Sound.playSoundEffect(resSound.g_touch);
                        return true;
                    }
                    return false;
                },
                onTouchEnded: function (touch, event) {
                    gv.matchMng.mainBoard.setEnableIndicatorOnTileForHorse(false, _this.pieceLogic);
                }
            });
            cc.eventManager.addListener(listener, this.horseAni);

        //}

        //cuong action sang o nhan vat
        var color1 = GameUtil.getRGBColorById(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.pieceLogic.playerIndex).playerColor);
        this.pieceActionAnim = fr.createSprite("res/particle/ElectricPoint1.png");
        this.pieceActionAnim.runAction(cc.tintTo(0.01,color1));
        this.pieceActionAnim.setBlendFunc(gl.ONE,gl.ONE);
        //this.pieceActionAnim.setOpacity(128);
        this.addChild(this.pieceActionAnim);
        this.pieceActionAnim.setPosition(this.getContentSize().width/2-3,this.getContentSize().height/2-20);
        //this.pieceActionAnim.setOpacity(150);
        this.pieceActionAnim.setScale(3,6);
        if(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.pieceLogic.playerIndex).playerColor==0){
            this.pieceActionAnim.setScale(1.5,3);
        }
        this.pieceActionAnim.runAction(cc.sequence(
            cc.scaleBy(0.9,3/4),
            cc.scaleBy(0.9,3/4).reverse()
        ).repeatForever());
        this.pieceActionAnim.setVisible(false);

        this.grow = fr.createSprite("res/particle/test.png");
        this.addChild(this.grow,10000);
        this.grow.runAction(cc.tintTo(0.01,color1));
        this.grow.setPosition(this.getContentSize().width/2-3,this.getContentSize().height/2-20);
        this.grow.setBlendFunc(gl.ONE,gl.ONE);
        this.grow.setScale(3,6);
        this.grow.setOpacity(180);
        this.grow.setVisible(false);
        this.grow.setOpacity(0);

        //freeze
        this.imageFreeze = null;
        this.animFreeze = null;
        this.zOrder = 0;
    },

    setPieceAnimationColor: function(color){
        if (this.pieceAni.getArmature().getBone(PIECE_BONE_COLOR.GREEN) != null)
            this.pieceAni.getArmature().getBone(PIECE_BONE_COLOR.GREEN).setVisible(false);
        if (this.pieceAni.getArmature().getBone(PIECE_BONE_COLOR.RED) != null)
            this.pieceAni.getArmature().getBone(PIECE_BONE_COLOR.RED).setVisible(false);
        if (this.pieceAni.getArmature().getBone(PIECE_BONE_COLOR.YELLOW) != null)
            this.pieceAni.getArmature().getBone(PIECE_BONE_COLOR.YELLOW).setVisible(false);

        var pieceBoneColor = "";
        switch (color){
            case PlayerColor.BLUE:
                pieceBoneColor = PIECE_BONE_COLOR.BLUE;
                break;
            case PlayerColor.GREEN:
                pieceBoneColor = PIECE_BONE_COLOR.GREEN;
                break;
            case PlayerColor.RED:
                pieceBoneColor = PIECE_BONE_COLOR.RED;
                break;
            case PlayerColor.YELLOW:
                pieceBoneColor = PIECE_BONE_COLOR.YELLOW;
                break;
        }
        if (this.pieceAni.getArmature().getBone(pieceBoneColor) != null)
            this.pieceAni.getArmature().getBone(pieceBoneColor).setVisible(true);
    },

    getAnimationById:function(animationId, isBack){
        switch (animationId){
            case PieceAnimationId.IDLE:
                return "idle";
            case PieceAnimationId.IDLE_PREPARE:
                return "idle";//"idle_hi";
            case PieceAnimationId.IDLE_TIRED:
                return "idle";//"idle";
            case PieceAnimationId.JUMP:
                if (isBack) return"idle";//"jump";
                else return "idle";//"jump";
                break;
            case PieceAnimationId.ATTACK:
                if (isBack) return "idle";// "attack";
                else return "idle";// "attack";
                break;
            case PieceAnimationId.BE_ATTACKED:
                return "idle";// "attack";
                break;
            case PieceAnimationId.FINISH:
                return "idle";//"hungkhoi";
                break;
        }
    },

    playAnimation : function(animationId, direction, isLoop){
        this.direction = typeof  direction !== 'undefined' ? direction : this.direction;
        isLoop =  typeof  isLoop !== 'undefined' ? isLoop: true;
        var loops = isLoop?0:1;
        this.animationId = animationId;
        this.updateDirection(this.direction);
        this.pieceAni.getAnimation().gotoAndPlay(this.getAnimationById(animationId, this.isBack), 0, -1, loops);
		//this.idleTime = 0;
    },

    stopAnimation: function(){
        this.pieceAni.getAnimation().gotoAndStop(this.getAnimationById(this.animationId, this.isBack), 0, -1, 0);
    },

    onFinishAnimations: function(){
        if (this.animationId == PieceAnimationId.IDLE_PREPARE){
            this.playAnimation(PieceAnimationId.IDLE);
        }
    },

    updateDirection : function(direction){

        var isBack = false;
        var needFlip = false;

        switch (direction){
            case PieceDirect.TOP_LEFT:
                isBack = true;
                needFlip = true;
                break;
            case PieceDirect.TOP_RIGHT:
                isBack=true;
                needFlip = false;
                break;
            case PieceDirect.BOTTOM_LEFT:
                isBack = false;
                needFlip = true;
                break;
            case PieceDirect.BOTTOM_RIGHT:
                isBack=false;
                needFlip=false;
                break;

            default:
                cc.assert(false, "PieceDisplay::updateDirection: Invalid direction :"+direction);
        }

        if(this.isBack!=isBack){
            this.isBack=isBack;
            this.pieceAni.getAnimation().gotoAndPlay(this.getAnimationById(this.animationId, isBack));
            //this.horseAni.getAnimation().gotoAndPlay(this.getAnimationById(this.animationId, isBack));
        }

        this.isFlip = needFlip;
        this.pieceAni.setScaleX(needFlip?-1:1);
        this.horseAni.setScaleX(needFlip?-1:1);
        this.grow.setScaleX(needFlip?-1:1);

        this.pieceShadow.setFlip(needFlip);
    },

    showTailParticle: function(duration){
        return;
        if (!this.particleSystem) {
            this.particleSystem = new cc.ParticleSystem("res/particle/jump_particle.plist");
            this.particleSystem.setPosition(this.pieceAni.getPositionX() + 5, this.pieceAni.getPositionY() + 10);
            this.particleSystem.setEmissionRate(this.particleSystem.getEmissionRate()/2);
            this.particleSystem.setScale(0.3);
            this.addChild(this.particleSystem);
        }
        this.particleSystem.resetSystem();
        this.particleSystem.setDuration(duration);
    },

    setMoveMileList : function(moveMileList, moveCallback){
        this.moveMileList =this.refineMileList(moveMileList);
        //this.moveMileList = moveMileList;
        this.moveCallback = moveCallback;
        this.moveLength = this.moveMileList.length;
    },

    /**
     * longpt
     * refine list step follows this rule:
     * always have maximum 4 step to jump
     * @param list
     */
    refineMileList:function(list) {
        // add them so buoc de lam effect
        for (var i = 0; i < list.length; ++i) {
            list[i].stepCount = i + 1;
        }

        if (list.length <= 4) {
            return list;
        }
        var retVal = [];
        if (list.length <= 8) {
            var tmpLength = Math.ceil(list.length / 2);
            for (var i = 0; i < tmpLength; ++i) {
                retVal.push(list[Math.min(i * 2 + 1, list.length - 1)]);
            }
            return retVal;
        }
        var tmpLength = Math.ceil(list.length / 3);
        for (var i = 0;i < tmpLength; ++i) {
            retVal.push(list[Math.min(i * 3 + 2, list.length - 1)]);
        }
        return retVal;
    },

    startJumpChain: function(needParticleTail, needShadow, needFocus, needResetCam){

        if(needFocus && this.moveMileList.length >2 && !this.cameraFocusing){
            this.needResetCamera = needResetCam;
            var _this = this;
            this.setEnableCameraFocus(true, function(){
                _this.jumpToNextStep();
                _this.pieceShadow.setEnable(false /*needShadow*/);
                if(needParticleTail)
                    _this.showTailParticle(_this.moveMileList.length*JUMP_STEP_SPEED);
            }, this.moveMileList);
        }
        else {
            this.jumpToNextStep();
            this.pieceShadow.setEnable(false/*needShadow*/);
            if (needParticleTail)
                this.showTailParticle(this.moveMileList.length * JUMP_STEP_SPEED);
        }
    },

    onFinishJumpChain : function(){
        this.pieceShadow.setEnable(false);
        this.playAnimation(PieceAnimationId.IDLE, this.direction, false);
        if(this.cameraFocusing && this.needResetCamera){
            this.setEnableCameraFocus(false, this.moveCallback);
        }
        else{
            this.moveCallback();
        }
    },

    jumpToNextStep : function(){
        cc.assert(this.moveMileList.length!=0, "Move list is empty");
        this.releaseTileStanding();
        var nextTile=this.moveMileList[0];

        var jumpSpeed = JUMP_STEP_SPEED;
        var jumpHeight = 50;
        if(nextTile.type == TileType.TILE_DESTINATION){
            jumpSpeed = JUMP_STEP_SPEED/**3*/;
            jumpHeight = 120;
        }

        //var start = this.getPosition();
        var end = cc.p(0,0);
        if(this.moveMileList.length == 1 && this.moveLength > 1 && this.pieceLogic.kickTarget.length == 0){//Neu la buoc nhay cuoi cung
            end = nextTile.getStandingPositionOnTile();
            jumpHeight = 100;
            jumpSpeed = 0.2;
            this.schedule(this.controlSpeed, jumpSpeed/2);
        }
        else{//Cac buoc nhay khac
            end = nextTile.getStandingPositionOnTile();
        }
        var jumpTo = cc.jumpTo(jumpSpeed, end, jumpHeight, 1);
        var callback = cc.callFunc(this.onJumpStepFinished, this);
        var seq = cc.sequence(jumpTo, callback).speed(1);
        this.runAction(seq);
        seq.setTag(ACTION_JUMP_TAG);
        seq.setSpeed(1);//Goi them 1 lan setspeed nua thi moi co tac dung
        this.jumpTimeElapssed=0;

        this.playAnimation(PieceAnimationId.JUMP, this.direction, false);

        if(this.cameraFocusing){
            gv.matchMng.cameraManager.addPositionToCameraTrackPath(end);
        }
    },

    //Thay doi speed cua buoc nhay cuoi cung
    controlSpeed:function(dt){
        var seq = this.getActionByTag(ACTION_JUMP_TAG);
        this.jumpTimeElapssed+=dt;
        //cc.log("controlSpeed: dta = " + dt);
        if(seq!=null) {
            var speed = this.jumpTimeElapssed < 0.5 ? 0.1 : 0.7;
            //cc.log("speeddddddddddddddddddddd = " + speed);
            seq.setSpeed(speed);
        }
    },

    onJumpStepFinished : function(){
        this.unschedule(this.controlSpeed);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).makeJumpSmoke(this.getPosition());

        var jumpedTile = this.moveMileList.shift();
        this.enterNewTile(jumpedTile, this.moveMileList.length==0);

        if(this.moveMileList.length!=0){
            this.jumpToNextStep();
            var sc = new StepCount();
            this.getParent().addChild(sc);
            sc.run(jumpedTile.stepCount, cc.p(jumpedTile.getStandingPositionOnTile()));
        }
        else{
            this.onFinishJumpChain();
        }
    },

    summonWithTileUp:function(summonTile){

        this.horseAni.setVisible(true);
        this.pieceInHome.setVisible(false);
        var destination = summonTile.getStandingPositionOnTile();
        //var callback = gv.matchMng.onPieceFinishAllActions(this.pieceLogic);
        var jumpTo = cc.jumpTo(0.6, destination, 200, 1);
        var seq = cc.sequence(cc.delayTime(0.2), cc.rotateBy(0.4,1080));
        var _this = this;
        this.runAction(cc.sequence(
            cc.spawn(jumpTo, seq),
            cc.callFunc(function(){
                summonTile.display.actionShakeTile();
            }),
            cc.moveTo(0.3,destination.x,cc.winSize.height),
            cc.callFunc(function(){
                _this.setVisible(false);
            }),
            cc.delayTime(0.7),
            cc.callFunc(function(){
                _this.horseAni.setVisible(false);
                _this.pieceInHome.setVisible(true);
                var homeSlot = GameUtil.getHomeSlotForPlayer(_this.pieceLogic.playerIndex, _this.pieceLogic.pieceIndex);
                var homeTile = gv.matchMng.mapper.getTileForSlot(homeSlot);
                _this.playSummonEffect(homeTile, function(){
                    summonTile.display.resetTileUp();
                    //var boardData = gv.matchMng.mainBoard.boardData;
                    gv.matchMng.mainBoard.boardData.putPieceToSlot(_this.pieceLogic, homeSlot);
                    _this.enterNewTile(homeTile, true);
                    fr.Sound.playSoundEffect(resSound.g_revive);
                    _this.setVisible(true);
                    GameUtil.callFunctionWithDelay(1,function(){
                        gv.matchMng.onPieceFinishAllActions(_this.pieceLogic);
                    });

                }.bind(_this));
                //this.pieceDisplay.playDestroyEffect(destroyEff, function(){
                //    _this.returnToHome(callback);
                //});
            })
        ))
    },

    summon: function(summonTile, callback){
        var destination = summonTile.getStandingPositionOnTile();
        var jumpTo = cc.jumpTo(0.6, destination, 200, 1);
        var seq = cc.sequence(cc.delayTime(0.2), cc.rotateBy(0.4,1080));
        this.runAction(
            cc.sequence(
                cc.spawn(jumpTo, seq),
                cc.callFunc(function(){
                    var summonEffect  = fr.AnimationMgr.createAnimationById(resAniId.summon, this);
                    summonEffect.getAnimation().gotoAndPlay("run", 0, -1, 1);
                    summonEffect.setPosition(destination);
                    summonEffect.setCompleteListener(function(){summonEffect.removeFromParent()});
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(summonEffect,this.getLocalZOrder()-1);

                    var boardData = gv.matchMng.mainBoard.boardData;
                    boardData.putPieceToSlot(this.pieceLogic, summonTile.index);
                    if (callback)
                        callback();
                }.bind(this))
            ));
    },

    updateNewPosition : function(){
        var mapper = gv.matchMng.mapper;
        var currState = this.pieceLogic.getState();
        var currSlot = this.pieceLogic.currSlot;

        var standingTile = mapper.getTileForSlot(currSlot);

        if (currState == PieceState.MOVING_TO_DES){
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.pieceLogic.playerIndex);
            var playerDesGateIndex = mapper.getLoadSlotForStandPos(playerInfo.standPos);
            if (standingTile.index == playerDesGateIndex){
                this.addEffect(PieceEffectId.ON_DES_GATE);
            }
        }

        if(standingTile!=null){
            this.enterNewTile(standingTile, true);
            this.setPosition(standingTile.getStandingPositionOnTile());

            if (this.pieceLogic.getState() == PieceState.ON_HOME){
                this.playAnimation(PieceAnimationId.IDLE, standingTile.direction, false);
                this.horseAni.setVisible(false);
                this.pieceAni.setVisible(false);
                //cuong
                if(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.pieceLogic.playerIndex).lose){
                    this.setVisible(false);
                }else{
                    this.pieceInHome.setVisible(true);
                    this.setLocalZOrder(standingTile.getZOrderForPiece());
                    //
                    if (this.winFlag){
                        this.winFlag.removeFromParent();
                    }
                }
            }
            else if (this.pieceLogic.getState() == PieceState.FINISHED){

                // cuong log da ve chuong
                //var history = gv.guiMgr.getGuiById(GuiId.HISTORY_LOG);
                //var playername = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.pieceLogic.playerIndex);
                //history.Add_Log_GoToDestination(playername) ;
                this.grow.setVisible(false);
                //cuong
                this.pieceInHome.setVisible(false);
                //

                this.changeToWinFlag();
                standingTile.reloadTile();
            }
            else{
                //this.pieceAni.setScale(PieceScale.NORMAL);
                this.pieceAni.setVisible(false);
                this.horseAni.setVisible(true);
                //cuong
                this.pieceInHome.setVisible(false);
                //
                //this.pedestal.setVisible(true);
                if (this.pieceLogic.isSummoned()){
                    this.playAnimation(PieceAnimationId.IDLE_PREPARE, standingTile.direction, false);
                }
                else{
                    this.playAnimation(PieceAnimationId.IDLE, standingTile.direction);
                }
            }
        }
    },

    releaseTileStanding: function(){
        //cc.log("PieceDisplay: releaseTileStanding");
        if (this.tileStanding){
            this.tileStanding.onPieceRelease();
            this.tileStanding = null;
        }
    },

    setLocalZOrder: function(zorder){
        this._super(zorder);
        cc.log("setLocalZOrder: tile = " + this.tileStanding.index + ", piece = " + this.pieceLogic.getString() + "zorder = " + this.getLocalZOrder());
    },

    enterNewTile: function(newTile, isOccupy, needEffect) {
       // if(newTile == this.tileStanding) return;
        needEffect = (needEffect===undefined?true:needEffect);

        this.tileStanding = newTile;
        newTile.onPieceHold(isOccupy, this.pieceLogic);
        this.direction = newTile.direction;
        this.tileStanding.onPieceEnter(this.pieceLogic, isOccupy, needEffect);
        this.setLocalZOrder(newTile.getZOrderForPiece());
        cc.log("enterNewTile: tile = " + newTile.index + ", piece = " + this.pieceLogic.getString() + "zorder = " + newTile.getZOrderForPiece());
    },

    playSummonEffect : function(homeTile, callback){
        var _this = this;
        var an3 = fr.AnimationMgr.createAnimationById(resAniId.eff_back_home);
        an3.setPosition(cc.pAdd(homeTile.getStandingPositionOnTile(), cc.p(0, 50)));
        an3.getAnimation().gotoAndPlay("run", 0, -1, 1);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(an3, MainBoardZOrder.PIECE_NORMAL);
        an3.setCompleteListener(function(){
            an3.removeFromParent();
        });
        _this.setPosition(homeTile.getStandingPositionOnTile());
        if(callback!=null){
            callback();
        }

        /*
        _this.setScale(0);
        _this.setOpacity(0);
        var actions = [];
        actions.push(cc.spawn(cc.scaleTo(0.5, 1.0).easing(cc.EaseIn), cc.fadeTo(0.25,155)));
        actions.push(cc.callFunc(callback()));
        _this.runAction(cc.sequence(actions));
        */
    },

    shakeOnce:function() {
        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        ShakeEffect.addShakeEffectToNode(0.5, guiMainBoard, 20,guiMainBoard.guiMainBoardPosition);
    },

    showBrokenScreen:function() {
        var x1 = fr.AnimationMgr.createAnimationById(resAniId.screen_break, this.getParent());
        x1.getAnimation().gotoAndPlay("run");
        x1.setCompleteListener(function() {
            x1.removeFromParent();
        });
        x1.setPosition(0, 0);
        this.getParent().addChild(x1);
        x1.setLocalZOrder(32000);
    },

    throwToEdge:function(sender) {
        sender.runAction(
            cc.moveTo(0.2, sender.getRandomEdgePosition())
        )
    },

    getTimeToEdgePos:function(startPos, edgePos) {
        // toc do di het 1 man hinh ngang
        var SPEED = 0.35;
        var distance = Math.sqrt(Math.pow(startPos.x - edgePos.x, 2) + Math.pow(startPos.y - edgePos.y, 2));
        return SPEED * (distance / cc.winSize.width);
    },

    getRandomEdgePosition:function(edge) {
        if (this.edgeList == null || this.edgeList.length <= 1) {
            this.edgeList = [0, 1, 2/*, 3*/];
        }
        var retVal = edge;
        if (retVal == null) {
            var rd = Math.floor(Math.random() * this.edgeList.length);
            retVal = this.edgeList[rd];
            this.edgeList.splice(rd, 1);
        }


        var valx = cc.winSize.width / 2 - this.getContentSize().width / 2;
        var valy = cc.winSize.height / 2 - this.getContentSize().height / 2;
        switch (retVal) {
            case 0:
                return cc.p(-valx, Math.random() * cc.winSize.height * 0.2);
            case 1:
                return cc.p(valx, Math.random() * cc.winSize.height * 0.2);
            case 2:
                return cc.p(Math.random() * cc.winSize.width * 0.2, -valy);
            case 3:
                return cc.p(Math.random() * cc.winSize.width * 0.2, valy);
        }
        return cc.p(0, 0);
    },

    //nhun truoc khi da
    startPhase1:function() {
        var pieceBeKickedDP = this.pieceLogic.kickTarget[0].pieceDisplay;
        this.addPieceTargeted(pieceBeKickedDP);

        this.runAction(cc.spawn(
            cc.sequence(
                cc.moveBy(0.2, 0, -20),
                cc.moveBy(2.0, 0, 20).easing(cc.easeElasticOut(0.1))
            )
        ));
        this.tileStanding.display.image.runAction(cc.sequence(
            cc.moveBy(0.2, 0, -20),
            cc.moveBy(2.0, 0, 20).easing(cc.easeElasticOut(0.1))
        ));
    },

    //xoay ngua bat dau da
    startPhase2:function() {
        var end = this.pieceLogic.kickTarget[0].pieceDisplay.getPosition();
        var isKickFromLeft = this.getPosition().x - end.x;
        var isKickFromBot = this.getPosition().y - end.y;
        var midP = cc.p(
            isKickFromLeft < 0 ? cc.p(Math.min(-100 + this.getPosition().x, end.x - 150), Math.abs(isKickFromBot) < 200 ? Math.max(this.getPosition().y + 50, end.y / 2 - this.getPosition().y / 2) : isKickFromBot < 0 ? -50 : 50):
                                cc.p(Math.max(100 + this.getPosition().x, end.x + 150), Math.abs(isKickFromBot) < 200 ? Math.max(this.getPosition().y + 50, end.y / 2 - this.getPosition().y / 2) : isKickFromBot < 0 ? -50 : 50));
        var bezier = [midP, cc.p(this.getPosition().x / 2 + end.x / 2 + 100, this.getPosition().y / 2 + end.y / 2), end];
        var bezierAnim = cc.bezierTo(0.3, bezier);
        var _this = this;
        this.runAction(
            cc.sequence(
                cc.spawn(
                    cc.rotateTo(0.3, isKickFromLeft < 0?30:-30),
                    cc.moveTo(0.3, midP),
                    cc.callFunc(function() {
                        _this.addPieceSmoke(_this.getPosition());
                    })
                ),
                cc.delayTime(0.3),
                cc.spawn(
                    bezierAnim,
                    cc.rotateTo(0.3, 0),
                    cc.sequence(
                        cc.delayTime(0.1),
                        cc.callFunc(function() {
                            _this.addPieceLightFlow(midP, end);
                        })
                    )
                ),
                cc.callFunc(this.shakeOnce, this)
            )
        );
        return isKickFromLeft < 0;
    },

    //Bi phan don khi da
    showFightBackAction: function(callback){
        this.startPhase1();
        var _callback = callback;
        GameUtil.callFunctionWithDelay(1.0, function(){
            var isLeftKick = this.startPhase2();
            GameUtil.callFunctionWithDelay(1.0, function(){
                this.pieceLogic.destroyWithBreakScreen(isLeftKick);
            }.bind(this));
            GameUtil.callFunctionWithDelay(5.0, _callback);
            this.releaseTileStanding();
            fr.Sound.playSoundEffect(resSound.g_jump_atk);
        }.bind(this));
    },
    
    startingSuperKick:function(callback) {
        this.startPhase1();
        var _this = this;
        var _callback = callback;
        this.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function() {
                    _this.startingSuperKick2(_callback);
                    fr.Sound.playSoundEffect(resSound.g_jump_atk);
                })
            )
        )
    },

    startingSuperKick2: function(callback) {
        var isLeftKick = this.startPhase2();

        this.setLocalZOrder(this.pieceLogic.kickTarget[0].pieceDisplay.getLocalZOrder());

        GameUtil.callFunctionWithDelay(1.0, function(){
            var pieceBeKicked = this.pieceLogic.kickTarget[0];
            pieceBeKicked.destroyWithBreakScreen(isLeftKick);
        }.bind(this));


        var finalKick = (this.pieceLogic.kickTarget.length == 1);

        //GameUtil.callFunctionWithDelay(8.0, commitKick);
        GameUtil.callFunctionWithDelay(finalKick ? 5.0 : 5.0, callback);

        this.releaseTileStanding();
    },

    showBreakScreenKicked: function(isLeftKick){
        // target effect
        var rotateVal = Math.random() * 50;
        var edgePos = isLeftKick ? this.getRandomEdgePosition(1): this.getRandomEdgePosition(0);
        var timeToEdge = this.getTimeToEdgePos(this.getPosition(), edgePos);
        this.runAction(
            cc.sequence(
                cc.callFunc(function() {
                    this.addPieceCollision(this.getPosition());
                }.bind(this)),
                cc.callFunc(function() {
                    // thang nguoi bay cmn ra khoi ngua luon ;_____;
                    this.pieceAni.setVisible(false);
                }.bind(this)),
                cc.moveTo(timeToEdge, edgePos),
                cc.callFunc(function() {
                    this.shakeOnce();
                    this.addPieceCollision(this.getPosition());
                }.bind(this)),
                cc.spawn(
                    cc.moveTo(0.2, cc.p(0, -100)),
                    cc.scaleTo(0.2, 5),
                    cc.rotateTo(0.2, this.isFlip?rotateVal:-rotateVal),
                    cc.sequence(
                        cc.delayTime(0.2),
                        cc.callFunc(function() {
                            this.shakeOnce();
                            this.showBrokenScreen();
                            fr.Sound.playSoundEffect(resSound.g_hit_glass);
                        }.bind(this))
                    )
                ),
                cc.spawn(
                    cc.rotateBy(0.1, (Math.random() - 0.5) * 10),
                    cc.scaleTo(0.1, 4.9)
                ),
                cc.sequence(
                    cc.delayTime(0.3),
                    cc.moveBy(1, 0, -cc.winSize.height).easing(cc.easeIn(3)),
                    cc.callFunc(function() {
                        this.setScale(this.STANDARD_SCALE);
                        this.setRotation(0);
                    }.bind(this))
                )
            )
        );
    },

    startingKick : function(needFonus, callback){
        cc.log("show the animation kick other piece. need Focus: "+needFonus);
        var _this = this;
        var end = this.pieceLogic.kickTarget[0].pieceDisplay.getPosition();

        var spawn = cc.spawn(cc.jumpTo(0.5, cc.p(end.x, end.y), 200, 1), cc.callFunc(function(){
            fr.Sound.playPieceSoundEffect(_this.playerColor, PieceSoundAction.JUMP_ATTACK);
        }));

        var seq = cc.sequence(cc.delayTime(0.3), spawn);
        this.runAction(seq);


        //-----------------show effect attack-----------------
        var pieceBeKickedDP =  this.pieceLogic.kickTarget[0].pieceDisplay;
        //var effAttack = fr.AnimationMgr.createAnimationById(resAniId.eff_attack_zoom, this);
        //effAttack.setCompleteListener(function(){
        //    effAttack.removeFromParent();
        //});
        //effAttack.setScale(0.5);
        //effAttack.setPosition(pieceBeKickedDP.getPosition());
        //effAttack.getAnimation().gotoAndPlay("run", 0, -1, 1);
        //this.getParent().addChild(effAttack, MainBoardZOrder.EFFECT);

        //------------------zoom camera and black layer--------------
        if(needFonus){
            if(!this.isCameraFocus())
                this.setEnableCameraFocus(true);
            //var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            //guiMainBoard.preparingHighLightScreen(HighLightType.BLACK_LAYER_HIGHLIGHT);
            //this.highLight(HighLightType.BLACK_LAYER_HIGHLIGHT);
            //pieceBeKickedDP.highLight(HighLightType.BLACK_LAYER_HIGHLIGHT);
        }

        //-----------------final step -----------------------
        var finalKick = (this.pieceLogic.kickTarget.length == 1);
        var newTileStand = pieceBeKickedDP.tileStanding;
        var newTileDirection = newTileStand.direction;

        var commitKick = function(){
            if(finalKick){
                if(_this.isCameraFocus()){
                    _this.setEnableCameraFocus(false);
                }
            }
            _this.enterNewTile(newTileStand, true);
            _this.playAnimation(PieceAnimationId.IDLE, newTileDirection);
            _this.setLocalZOrder(newTileStand.getZOrderForPiece());
        };

        //for (var i =0;i<this.pieceLogic.kickTarget.length;i++){
        //    _this.pieceLogic.kickTarget[i].destroy();
        //}

        //thong so thoi gian phai dam bao destroy < commit < back to home
        GameUtil.callFunctionWithDelay(1.0, function(){
         _this.pieceLogic.kickTarget[0].destroy();
            }.bind(this));

        GameUtil.callFunctionWithDelay(4.0, commitKick);
        GameUtil.callFunctionWithDelay(finalKick ? 4.1 : 4.1, callback);

        this.releaseTileStanding();
    },

    playDestroyEffect : function(destroyEff, callback){
        this.setVisible(false);
        if(destroyEff == undefined || destroyEff == null){
            var ani1 = fr.AnimationMgr.createAnimationById(resAniId.no_top);
            ani1.setPosition(this.getPosition());
            ani1.getAnimation().gotoAndPlay("run", 0, -1, 1);
            ani1.setCompleteListener(function(){
                cc.log("playDestroyEffect: eff == null");
                ani1.removeFromParent();
                GameUtil.callFunctionWithDelay(1.0, callback);
            });

            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(ani1, MainBoardZOrder.EFFECT);

            var ani2 = fr.AnimationMgr.createAnimationById(resAniId.no_back);
            ani2.setPosition(this.getPosition());
            ani2.getAnimation().gotoAndPlay("run", 0, -1, 1);
            ani2.setCompleteListener(function(){
                ani2.removeFromParent();
            });
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(ani2, MainBoardZOrder.PIECE_NORMAL);
        }
        else{
            var ani1 = fr.AnimationMgr.createAnimationById(destroyEff);
            ani1.setPosition(this.getPosition());
            ani1.getAnimation().gotoAndPlay("run", 0, -1, 1);
            ani1.setCompleteListener(function(){
                ani1.removeFromParent();
                GameUtil.callFunctionWithDelay(1.0, callback);
            });

            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(ani1, MainBoardZOrder.EFFECT);
        }
        ShakeEffect.addShakeEffectToNode(0.5, this.getParent(), 10,this.getParent().getPosition());

        if(gv.matchMng.isMineTurn() && this.cameraFocusing){
            this.cameraFocusing = false;
            gv.matchMng.cameraManager.disableCameraTracking(this.moveCallback);
        }
    },

    setEnableInteract : function(interactType, callback){
        this.interactType = interactType;
        if(interactType == InteractType.NONE){
            this.interactCallback = null;
        }
        else{
            this.interactCallback = callback;
        }
    },

    setVisibleHintStone : function(visible){
        this.hintStone.setVisible(visible);
        if (visible){
            this.hintStone.setPosition(cc.p(30+(this.pieceAni.getScaleY()-1)*20, 85+(this.pieceAni.getScaleY()-1)*50));
        }
    },

    onHintStoneClick : function(){
        if(this.interactCallback!=null)
            this.interactCallback(this);
    },

    addEffect: function(effectId, waitingTime){

        waitingTime = typeof  waitingTime !== 'undefined' ? waitingTime : 0;

        switch (effectId){
            case PieceEffectId.APPEAR:
            {
                this.pieceAni.setVisible(false);
                var _this = this;
                this.runAction(cc.sequence(
                    cc.delayTime(waitingTime),
                    cc.callFunc(function(){
                        var appearEff = fr.AnimationMgr.createAnimationById(resAniId.eff_piece_appear, this);
                        appearEff.getAnimation().gotoAndPlay("run",0,-1,1);
                        appearEff.setPosition(_this.pieceAni.getPosition());
                        appearEff.setCompleteListener(function(){ appearEff.removeFromParent()});
                        _this.addChild(appearEff, _this.pieceAni.getLocalZOrder());
                    }),
                    cc.delayTime(0.5),
                    cc.callFunc(function(){
                        _this.pieceAni.setVisible(true);
                    })
                ));
                break;
            }
            case PieceEffectId.ON_DES_GATE:
            {
                var onDeGateAni = fr.AnimationMgr.createAnimationById(resAniId.eff_on_des_gate, this);
                onDeGateAni.getAnimation().gotoAndPlay("run",0,-1,1);
                onDeGateAni.setPosition(40,80);
                onDeGateAni.setCompleteListener(function(){onDeGateAni.removeFromParent()});
                this.addChild(onDeGateAni, this.pieceAni.getLocalZOrder());
                break;
            }
        }
    },

    setEnableCameraFocus : function(enable, callback, listMoves){
        this.cameraFocusing = enable;
        if(enable){
            var tmpPos = this.getPosition();
            if (listMoves != undefined) {
                // find the middle position of first and last tiles
                tmpPos = cc.pAdd(listMoves[0].getStandingPositionOnTile(), listMoves[listMoves.length - 1].getStandingPositionOnTile());
                tmpPos.x = tmpPos.x / 2;
                tmpPos.y = tmpPos.y / 2;
            }
            gv.matchMng.cameraManager.makeCameraTracking(tmpPos, callback);
        }
        else{
            gv.matchMng.cameraManager.disableCameraTracking(callback);
        }
        gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).setVisibleAllPlayingPanel(!enable);
    },

    isCameraFocus : function(){
        return this.cameraFocusing;
    },

    highLight : function(highLightType){
        if(this.highLighted) return false;
        this.highLighted = true;
        this.highLightType = highLightType;

        if(highLightType == HighLightType.BLACK_LAYER_HIGHLIGHT)
            this.setLocalZOrder(MainBoardZOrder.PIECE_BRIGHT + this.getLocalZOrder());
        else if(highLightType == HighLightType.OPACITY_HIGHLIGHT)
            this.horseAni.setOpacity(255);
        //this.oldScale = this.getScale();
        this.setScale(this.STANDARD_SCALE);

        return true;
    },

    unHighLight : function(){
        if(!this.highLighted) return false;
        this.highLighted = false;

        if(this.highLightType == HighLightType.BLACK_LAYER_HIGHLIGHT)
            this.setLocalZOrder(this.getLocalZOrder() - MainBoardZOrder.PIECE_BRIGHT);
        else if(this.highLightType == HighLightType.OPACITY_HIGHLIGHT)
            this.horseAni.setOpacity(150);
        else{
            cc.assert(false, "Error: Unknown highlight type: "+this.highLightType);
        }

        //this.setScale(this.oldScale);
        this.setScale(this.STANDARD_SCALE);
        this.highLightType = null;
        return true;
    },
    /*
    setLocalZOrder : function(localZOrder){
        if(this.highLighted)
            this._super(MainBoardZOrder.PIECE_BRIGHT + localZOrder);
        else
            this._super(localZOrder);
    },
    */
    teleportOut : function(){
        var teleOutEff = fr.AnimationMgr.createAnimationById(resAniId.teleport);
        teleOutEff.setPosition(cc.pAdd(this.getPosition(), cc.p(0, 0)));
        teleOutEff.getAnimation().gotoAndPlay("hut", 0, -1, 1);
        this.getParent().addChild(teleOutEff, MainBoardZOrder.EFFECT);

        teleOutEff.setCompleteListener(function(){
            teleOutEff.removeFromParent();
        });
    },

    teleportIn : function(callback, position){
        var teleInEff = fr.AnimationMgr.createAnimationById(resAniId.teleport);
        teleInEff.setPosition(cc.pAdd(position, cc.p(0, 0)));
        teleInEff.getAnimation().gotoAndPlay("tha", 0, -1, 1);
        this.getParent().addChild(teleInEff, MainBoardZOrder.EFFECT);

        teleInEff.setCompleteListener((function(){
                teleInEff.removeFromParent();
                callback();
            }.bind(this))
        );
    },

    setBlink : function(enable){
        if(enable && !this.blink){
            this.highLight(HighLightType.OPACITY_HIGHLIGHT);
            //var blinkAction = cc.sequence(cc.tintTo(0.1,150,150,150), cc.tintTo(0.1,255,255,255)).repeatForever();
            var blinkAction = cc.blink(1, 4).repeatForever();
            blinkAction.setTag(BLINK_TAG);
            //this.pieceAni.runAction(blinkAction);
            this.blink = true;
        }
        else if(!enable && this.blink){
            //this.pieceAni.stopActionByTag(BLINK_TAG);
            this.blink = false;
        }
    },

    //hoa thanh tuong
    changeToWinFlag: function(){
        //cc.log("CUONG  changeToWinFlag")
        this.pieceAni.setVisible(false);
        this.horseAni.setVisible(false);
        if(!this.winFlag){
            //this.winFlag = fr.createSprite("res/game/mainBoard/crosshair.png");
            this.winFlag = fr.AnimationMgr.createAnimationById(resAniId.star_destination, this);
            this.winFlag.gotoAndPlay(GameUtil.getColorStringById(this.playerColor), 0, -1, 0);
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.pieceLogic.playerIndex);
        switch (playerInfo.standPos){
            case 1:
                this.winFlag.setPosition(this.pieceAni.getPositionX()+7, this.pieceAni.getPositionY()+3);
                break;
            case 2:
                this.winFlag.setPosition(this.pieceAni.getPositionX()+4, this.pieceAni.getPositionY()+2);
                break;
            case 3:
                this.winFlag.setPosition(this.pieceAni.getPositionX()-3, this.pieceAni.getPositionY()+2);
                break;
            case 0:
                this.winFlag.setPosition(this.pieceAni.getPositionX()-3, this.pieceAni.getPositionY()+5);
                break;
            }
            this.addChild(this.winFlag);
            //effect change to statue
            this.effStatue = fr.AnimationMgr.createAnimationById(resAniId.eff_statue, this);
            this.effStatue.setPosition(this.winFlag.getPositionX(), this.winFlag.getPositionY()-20);
            this.effStatue.getAnimation().gotoAndPlay("run",0 , -1, 1);
            this.addChild(this.effStatue);
        }
    },

    //hien thi bieu tuong cam xuc khi kich hoat skill
    showEmoticon : function(emoType){
        var emoticonRes = "";
        switch (emoType){
            case EmoticonType.EMO_DEFENSE:
                emoticonRes = "res/game/skill/emo_defense.png";
                break;
            case EmoticonType.EMO_SAD:
                emoticonRes = "res/game/skill/emo_be_attack.png";
                break;
            case EmoticonType.EMO_SMILE:
                emoticonRes = "res/game/skill/emo_attack.png";
                break;
        }

        var emoSprite = fr.createSprite(emoticonRes);
        emoSprite.setPosition(cc.pAdd(this.getPosition(), cc.p(0, 160)));
        this.getParent().addChild(emoSprite, MainBoardZOrder.EFFECT);
        emoSprite.setScale(0);
        var actions = [];
        actions.push(cc.scaleTo(0.75, 1.0).easing(cc.easeElasticInOut()));
        actions.push(cc.sequence(cc.moveBy(0.25, 0, 25), cc.moveBy(0.25, 0, -25)).repeatForever());
        emoSprite.runAction(cc.sequence(actions));

        GameUtil.callFunctionWithDelay(1.5, function(){
            emoSprite.removeFromParent();
        });
    },

    //hien thi thong bao tren dau nhan vat khi dang cho tung xuc sac, cho input cua nguoi choi...
    //bubbleType: loai thong bao can hien thi, kieu enum
    //truyen vao kieu NONE de an thong bao

    addFireWork: function(){
        var firework = fr.AnimationMgr.createAnimationById(resAniId.fire_work, this);
        firework.getAnimation().gotoAndPlay("run", 0, -1, 0);

        if (this.pieceAni.isVisible() || (this.pieceStatue!=null))
            firework.setPosition(this.pieceAni.getPositionX(), this.pieceAni.getPositionY()+150);
        else
            firework.setPosition(this.horseAni.getPositionX(), this.horseAni.getPositionY()+100);

        this.addChild(firework);
    },

    addPieceCollision:function(pos) {
        var eff_collision = fr.AnimationMgr.createAnimationById(resAniId.kick_collision, this);
        eff_collision.getAnimation().gotoAndPlay("run");
        eff_collision.setCompleteListener(function(yeah) {
            yeah.removeFromParent();
        });
        eff_collision.setPosition(pos);
        eff_collision.setLocalZOrder(10000);
        this.getParent().addChild(eff_collision);
    },

    addPieceSmoke:function(pos) {
        var eff_smoke = fr.AnimationMgr.createAnimationById(resAniId.kick_smoke, this);
        eff_smoke.getAnimation().gotoAndPlay("run");
        eff_smoke.setCompleteListener(function(yeah) {
            yeah.removeFromParent();
        });
        eff_smoke.setPosition(pos);
        eff_smoke.setLocalZOrder(10000);
        this.getParent().addChild(eff_smoke);
    },

    addPieceLightFlow:function(pos, endPos) {
        var x3 = fr.AnimationMgr.createAnimationById(resAniId.kick_light, this);
        x3.getAnimation().gotoAndPlay("run");
        x3.setCompleteListener(function(yeah) {
            yeah.removeFromParent();
        });
        var rotation = cc.pToAngle(cc.pSub(endPos, pos));
        x3.setRotation(-rotation * 57.2958 + 90);
        x3.setPosition(pos);
        x3.setLocalZOrder(10000);
        this.getParent().addChild(x3);
    },

    addPieceTargeted:function(piece) {
        var crosshair = fr.AnimationMgr.createAnimationById(resAniId.cross_hair, this);
        crosshair.setOpacity(200);
        crosshair.getAnimation().gotoAndPlay("run", 0, -1, 1);
        crosshair.setCompleteListener(function(crosshair) {
            crosshair.removeFromParent();
        });
        crosshair.setPosition(piece.getPosition());
        crosshair.setLocalZOrder(piece.getLocalZOrder() - 1);
        piece.getParent().addChild(crosshair);

        return crosshair;
    },

    //cuong jum with tileUp
    jumpInPlace:function(){
        var nextTile = gv.matchMng.mapper.getTileForSlot(this.pieceLogic.currSlot);
        var end = nextTile.getStandingPositionOnTile();
        var callback = cc.callFunc(function(){
            this.pieceLogic.onMoveAnimationFinished();
        }.bind(this));
        var tileNext = gv.matchMng.mapper.getTileForSlot((nextTile.index + 1%40));
        GameUtil.callFunctionWithDelay(0.3,function(){tileNext.display.actionJumpTileUp();}.bind(this));
        var destinationJump1 = cc.p(tileNext.getStandingPositionOnTile().x,tileNext.getStandingPositionOnTile().y+50);
        var jump1 = cc.jumpTo(0.3,destinationJump1,60,1); // nhay den o nay xong bi bat nguoc tro lai.
        var jump2 = cc.jumpTo(0.5,end,200,1);                 // lan nay thi nhay den o dang sau no ^^
        var seq = cc.sequence(jump1,jump2,cc.delayTime(0.2),callback);
        seq.setTag(ACTION_JUMP_TAG);
        this.runAction(seq);
    },

    starJumWithTileUp:function(){
        this.jumpToNextWithTileUp();
        this.pieceShadow.setEnable(false/*needShadow*/);
    },

    jumpToNextWithTileUp:function(){
        cc.assert(this.moveMileList.length!=0, "Move list is empty");
        this.releaseTileStanding();
        var nextTile=this.moveMileList[0];
        var jumpSpeed = JUMP_STEP_SPEED;
        var jumpHeight = 50;

        if(nextTile.type == TileType.TILE_DESTINATION){
            jumpSpeed = JUMP_STEP_SPEED/**3*/;
            jumpHeight = 120;
        }
        var end = cc.p(0,0);
        var callback = cc.callFunc(this.onJumpStepFinishedTileUpTrap, this);

        if(this.moveMileList.length == 1) {//Neu la buoc nhay cuoi cung
            this.jumpTimeElapssed=0;
            end = nextTile.getStandingPositionOnTile();
            var tileNext = gv.matchMng.mapper.getTileForSlot((nextTile.index + 1)%40);
            GameUtil.callFunctionWithDelay(0.3,function(){tileNext.display.actionJumpTileUp();}.bind(this));

            var destinationJump1 = cc.p(tileNext.display.image.getPosition());
            var jump1 = cc.jumpTo(0.3,destinationJump1,60,1); // nhay den o nay xong bi bat nguoc tro lai.
            var jump2 = cc.jumpTo(0.3,end,200,1);                 // lan nay thi nhay den o dang sau no ^^

            var seq = cc.sequence(jump1,jump2,cc.delayTime(0.2),callback).speed(1);
            this.runAction(seq);
            seq.setTag(ACTION_JUMP_TAG);
            seq.setSpeed(1);
            this.schedule(this.controlSpeedTileUp, 0.1);
            //todo neu cho nay co ngua o duoi thi se tieu diet ngua
            //GameUtil.callFunctionWithDelay(1.0, function(){
            //    _this.pieceLogic.kickTarget[0].destroy();
            //}.bind(this));
            return;
        }
        //cac buoc nhay binh thuogn khac
        end = nextTile.getStandingPositionOnTile();
        var jumpTo = cc.jumpTo(jumpSpeed, end, jumpHeight, 1);
        var seq = cc.sequence(jumpTo, callback).speed(1);
        this.runAction(seq);
        seq.setTag(ACTION_JUMP_TAG);
        seq.setSpeed(1);//Goi them 1 lan setspeed nua thi moi co tac dung

        this.jumpTimeElapssed=0;
        this.playAnimation(PieceAnimationId.JUMP, this.direction, false);
        if(this.cameraFocusing){
            gv.matchMng.cameraManager.addPositionToCameraTrackPath(end);
        }
    },

    controlSpeedTileUp:function(dt){
        var seq = this.getActionByTag(ACTION_JUMP_TAG);
        this.jumpTimeElapssed+=dt;

        if(seq!=null) {
            var speed = 0;
            if(this.jumpTimeElapssed < 0.3){
                speed = 1;
            }else{
                if(this.jumpTimeElapssed<0.4){
                    speed = 2;
                }else{
                    speed = 0.3;
                }
            }
            seq.setSpeed(speed);
        }
    },

    onJumpStepFinishedTileUpTrap : function(){
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).makeJumpSmoke(this.getPosition());
        var jumpedTile = this.moveMileList.shift();
        this.enterNewTile(jumpedTile, this.moveMileList.length==0);
        if(this.moveMileList.length!=0){
            this.jumpToNextWithTileUp();
            var sc = new StepCount();
            this.getParent().addChild(sc);
            sc.run(jumpedTile.stepCount, cc.p(jumpedTile.getStandingPositionOnTile()));
        }
        else{
            this.unschedule(this.controlSpeedTileUp);
            this.onFinishJumpChain();
        }
    },

    startJumpWithIceTrap:function(){
        this.jumpToNextWithIceTrap();
        this.pieceShadow.setEnable(false/*needShadow*/);
    },

    jumpToNextWithIceTrap:function(){
        cc.assert(this.moveMileList.length!=0, "Move list is empty");
        this.releaseTileStanding();
        var nextTile=this.moveMileList[0];

        var jumpSpeed = JUMP_STEP_SPEED;
        var jumpHeight = 50;
        if(nextTile.type == TileType.TILE_DESTINATION){
            jumpSpeed = JUMP_STEP_SPEED/**3*/;
            jumpHeight = 120;
        }

        var end = cc.p(0,0);
        var callback = cc.callFunc(this.onJumpStepFinishedIceTrap, this);
        if(this.moveMileList.length == 1){//Neu la buoc nhay cuoi cung
            end = nextTile.getStandingPositionOnTile();
            var jump = cc.jumpTo(0.5,cc.p(end.x,end.y + 140),140,1);
            var move = cc.moveTo(0.5,end);
            var seq = cc.sequence(jump,cc.delayTime(0.5) ,move ,callback);
            this.runAction(seq);

            var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
            var x1  = fr.AnimationMgr.createAnimationById(resAniId.skill_ice_trap_step_1, this);
            x1.getAnimation().gotoAndPlay("nonloop", 0, 2, 1);
            x1.setPosition(end.x,end.y);
            guiMainBoard.addChild(x1,2000);
            x1.setCompleteListener(function(){
                x1.removeFromParent();
            });
            return;
        }
        //Cac buoc nhay khac
        end = nextTile.getStandingPositionOnTile();
        var jumpTo = cc.jumpTo(jumpSpeed, end, jumpHeight, 1);
        var seq = cc.sequence(jumpTo, callback).speed(1);
        this.runAction(seq);
        seq.setTag(ACTION_JUMP_TAG);
        seq.setSpeed(1);//Goi them 1 lan setspeed nua thi moi co tac dung

        this.jumpTimeElapssed=0;
        this.playAnimation(PieceAnimationId.JUMP, this.direction, false);
        if(this.cameraFocusing){
            gv.matchMng.cameraManager.addPositionToCameraTrackPath(end);
        }
    },

    onJumpStepFinishedIceTrap : function(){
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).makeJumpSmoke(this.getPosition());
        var jumpedTile = this.moveMileList.shift();
        this.enterNewTile(jumpedTile, this.moveMileList.length==0);
        if(this.moveMileList.length!=0){
            this.jumpToNextWithIceTrap();
            var sc = new StepCount();
            this.getParent().addChild(sc);
            sc.run(jumpedTile.stepCount, cc.p(jumpedTile.getStandingPositionOnTile()));
        }
        else{
            this.onFinishJumpChain();
        }
    },

    addProtectedShield: function(){
        var shield  = fr.AnimationMgr.createAnimationById(resAniId.skill_phan_don, this);
        shield.getAnimation().gotoAndPlay("run", 0, -1, 1);
        shield.setPosition(40,0);
        this.addChild(shield);
    },
});