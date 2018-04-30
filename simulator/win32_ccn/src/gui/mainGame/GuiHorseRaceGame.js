/**
 * Created by CPU11674-local on 10/28/2016.
 */

//speed: pixel per frame
var SPEED_RACE = 360;
var SPEED_AUDIENCE = 60;
var RACE_OBJ_TYPE = {
    CONTINUOUS: 1,
    RAMDOM: 2,
};


var RACE_STATUS = {
    INIT: 1,
    READY: 2,
    RUNNING:3,
    END: 4,
    EXIT: 5,
};

var RACE_TIME = 10;
var PHASE_NUM = 5;
var PHASE_NUM = 5;
var DISTANCE_NUM = 5;

var BET1 = 1;
var BET2 = 2;
var BET3 = 3;

var FAKE = false;

//Kick ban: man hinh gui duoc chia ra DISTANCE_NUM doan
//Moi phase ngua co the o cac vi tri tu 0 den DISTANCE_NUM
//Moi 1 phan tu mang la 1 kick ban gom 2 mang con, moi mang con ung voi 1 con ngua, moi phan tu cua mang con la vi tri cua ngua o moi phase
var scene = [
    [0, 1, 3, 2, 5],
    [0, 1, 3, 3, 5],
    [0, 1, 2, 3, 5],
    [0, 1, 3, 4, 5],
    [0, 3, 3, 4, 5],
    [0, 1, 2, 4, 5],
    [0, 3, 2, 4, 5],
];

var loserScene = [
    [0, 1, 3, 2, 4],
    [0, 1, 2, 4, 3],
    [0, 1, 2, 4, 2],
    [0, 1, 3, 3, 4],
    [0, 3, 4, 3, 4],
    [0, 1, 2, 3, 3],
    [0, 2, 1, 2, 2],
    [0, 2, 3, 4, 3],
];


var GuiHorseRaceGame = BaseGui.extend({

    betBtn1: null, //Button
    betBtn2: null, //Button
    betBtn3: null, //Button

    horseAni:null,//Animation

    background:null,//Sprite
    watch:null,//Sprite
    start: null,//Sprite
    destination: null,//Sprite
    selectHorseCtn:null,//Node
    fogLayer: null, //Sprite
    resultBg: null,//Sprite
    showWinner: null,//Node
    showLooser: null,//Node
    timer:null,//Number
    timerLabel:null,//LabelBMFont
    startTimerSp:null,//Sprite

    raceStatus: null,
    phase: null,

    behindRaceLayer: null, //node
    raceLayer: null, //node
    poolObj: null, //Object

    iscene : null,
    chooseBet: null, // chon ngua do thi = 1, chon ngua xanh thi = 0


    ctor: function(){
        this._super(res.ZCSD_GUI_HORSE_RACE_GAME);
        this.poolObj = [];
        this.horseAni = [];
        this.setFog(true);
        this.phase = 0;
        this.iscene = [];
        this.chooseBet = 0;
        this.raceStatus = RACE_STATUS.INIT;

        this.background = this._rootNode.getChildByName("background");
        this.watch = this.background.getChildByName("watch");
        this.watch.setVisible(false);
        this.behindRaceLayer = this.background.getChildByName("behindRace");
        this.raceLayer = this.background.getChildByName("raceLayer");
        this.showWinner = this._rootNode.getChildByName("winGui");
        this.showWinner.setVisible(false);
        this.showLooser = this._rootNode.getChildByName("looseGui");
        this.showLooser.setVisible(false);

        this.selectHorseCtn = this.background.getChildByName("selectHorseCtn");
        this.fogLayer = this.selectHorseCtn.getChildByName("fogContainer");
        //var layer = cc.LayerColor.create(cc.color(0, 0, 0, 150));
        //layer.setPosition(-layer.getBoundingBox().width/2, -layer.getBoundingBox().height/2);
        //this.fogLayer.addChild(layer);

        var moneyBet = 100;
        var myGold = 300;

        if(!FAKE){
            moneyBet = gv.matchMng.horseRaceGameMgr.moneyPay;
            myGold = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(MY_INDEX).playerStatus.gold;
        }
        this.betBtn1 = this.selectHorseCtn.getChildByName("betBtn1");
        this.betBtn1.addClickEventListener(this.onFinishChooseHorse.bind(this, BET1));
        var moneyLb1 = ccui.Text.create(StringUtil.toMoneyString(moneyBet * BET1), res.FONT_GAME_BOLD, 55);
        moneyLb1.setPosition(175, 55);
        this.betBtn1.addChild(moneyLb1);

        this.betBtn2 = this.selectHorseCtn.getChildByName("betBtn2");
        this.betBtn2.addClickEventListener(this.onFinishChooseHorse.bind(this, BET2));
        var moneyLb2 = ccui.Text.create(StringUtil.toMoneyString(moneyBet * BET2), res.FONT_GAME_BOLD, 55);
        moneyLb2.setPosition(175, 55);
        this.betBtn2.addChild(moneyLb2);
        if(myGold < moneyBet * BET2){
            this.betBtn2.setVisible(false);
        }

        this.betBtn3 = this.selectHorseCtn.getChildByName("betBtn3");
        this.betBtn3.addClickEventListener(this.onFinishChooseHorse.bind(this, BET3));
        var moneyLb3 = ccui.Text.create(StringUtil.toMoneyString(moneyBet * BET3), res.FONT_GAME_BOLD, 55);
        moneyLb3.setPosition(175, 55);
        this.betBtn3.addChild(moneyLb3);
        if(myGold < moneyBet * BET3){
            this.betBtn3.setVisible(false);
        }

         var rootNodeScaleToSmall = cc.scaleTo(0, 0);
        var rootNodeScaleToBig = cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut());
        var showGuiCallBack = cc.callFunc(this.finishZoom.bind(this));
        this.background.runAction(cc.sequence(rootNodeScaleToSmall, rootNodeScaleToBig, showGuiCallBack));

        this.timer = GameUtil.getTimeAuto(TimeoutConfig.MINIGAME_TIMEOUT + 1);

        this.createRace();


        var color = PlayerColor.RED;
        if(!FAKE) color = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(MY_INDEX).playerColor;
        var horse = ccui.ImageView.create(this.getPathByColor(color));
        horse.setPosition(this.background.getBoundingBox().width/2, 270);
        this.selectHorseCtn.addChild(horse);

        var hint = ccui.Text.create("Đặt cược đi nào!", res.FONT_GAME_BOLD, 30);
        hint.setPosition(this.background.getBoundingBox().width/2, 460);
        this.selectHorseCtn.addChild(hint);


        var horseColor = this.getLabelByColor(color);
        horseColor.setPosition(130 + horseColor.getBoundingBox().width/2, 135);
        this.selectHorseCtn.getChildByName("notice").addChild(horseColor);


        //var light  = fr.AnimationMgr.createAnimationById(resAniId.minigame2_den, this);
        //light.getAnimation().gotoAndPlay("run", 0, -1, 0);
        //light.setPosition(283, 602);
        //this.background.addChild(light);
    },


    //Callback khi finish rooom in
    finishZoom: function() {
        cc.log("finish room");
        //Reconnect
        if( gv.matchMng.horseRaceGameMgr.reconnectData != null)
        {
            var myOpt = gv.matchMng.horseRaceGameMgr.reconnectData[MY_INDEX];
            if(myOpt != undefined && myOpt != 0)
            {
                this.onFinishChooseHorse(myOpt);
            }
            return;
        }

        this.schedule(this.countDownTime, 1, TimeoutConfig.MINIGAME_TIMEOUT);
    },




    //Time out de lua chon ngua
    countDownTime:function(){
        cc.log("gui horseRace");
        this.watch.setVisible(true);
        this.timer--;
        cc.log("gui horseRace->timer: " + this.timer);
        if(this.timerLabel == null){
            this.timerLabel = ccui.Text.create(this.timer.toString(), res.FONT_GAME_BOLD, 80);
            this.timerLabel.setPosition(70, 100);
            this.watch.addChild(this.timerLabel);
        }
        else{
            this.timerLabel.setString(this.timer.toString());
        }
        if(this.timer <= 0)
        {
            //Auto select
            cc.log("gui horseRace-->auto select");
            this.watch.setVisible(false);
            var autoSelect = Math.floor(Math.random()*3 + 1);
            this.onFinishChooseHorse(autoSelect);
        }
    },


    //Get khung avatar cua nguoi choi
    getPathByColor: function (colorConstant) {
        switch(colorConstant){
            case PlayerColor.GREEN:
                return "res/game/horseRaceMinigame/greenhorse.png";
            case PlayerColor.BLUE:
                return "res/game/horseRaceMinigame/bluehorse.png";
            case PlayerColor.RED:
                return "res/game/horseRaceMinigame/redhorse.png";
            case PlayerColor.YELLOW:
                return "res/game/horseRaceMinigame/yellowhorse.png";
        }
    },

    //Get khung avatar cua nguoi choi
    getNameByColor: function (colorConstant) {
        switch(colorConstant){
            case PlayerColor.GREEN:
                return "Xanh Lá";
            case PlayerColor.BLUE:
                return "Xanh Dương";
            case PlayerColor.RED:
                return "Đỏ";
            case PlayerColor.YELLOW:
                return "Vàng";
        }
    },

    getLabelByColor: function (colorConstant) {
        var name = this.getNameByColor(colorConstant);
        var label = ccui.Text.create(name, res.FONT_GAME_BOLD, 24);
            switch(colorConstant){
                case PlayerColor.GREEN:
                    label.setColor(cc.GREEN);
                    break;
                case PlayerColor.BLUE:
                    label.setColor(cc.BLUE);
                    break;
                case PlayerColor.RED:
                    label.setColor(cc.RED);
                    break;
                case PlayerColor.YELLOW:
                    label.setColor(cc.YELLOW);
                    break;
            }

        return label;
    },

   /* onLeftHorseBtnClick: function(){
        cc.log("User click choose red horseInfo");
        this.chooseBet = RED_HORSE;

        this.leftHorseBtn.stopAllActions();
        this.leftHorseBtn.setScale(0.8);
        this.rightHorseBtn.stopAllActions();
        this.rightHorseBtn.setScale(0.8);

        var scaleAct = cc.scaleTo(0.5, 1).easing(cc.easeBackInOut());
        var delay = cc.delayTime(2);
        var selectCallback = cc.callFunc(this.onFinishChooseHorse.bind(this), this);
        var seq = cc.sequence(scaleAct, selectCallback, delay);//, cc.callFunc(this.startRun.bind(this)));
        this.leftHorseBtn.runAction(seq);
    },*/

   /* onRightHorseBtnClick: function(){
        cc.log("User click choose blue horseInfo");
        this.chooseBet = BLUE_HORSE;

        this.leftHorseBtn.stopAllActions();
        this.leftHorseBtn.setScale(0.8);
        this.rightHorseBtn.stopAllActions();
        this.rightHorseBtn.setScale(0.8);

        var scaleAct = cc.scaleTo(0.5, 1).easing(cc.easeBackInOut());
        var delay = cc.delayTime(2);
        var selectCallback = cc.callFunc(this.onFinishChooseHorse.bind(this), this);
        var seq = cc.sequence(scaleAct, selectCallback, delay, cc.callFunc(this.warmUpRun.bind(this)));
        this.rightHorseBtn.runAction(seq);
    },*/


    onFinishChooseHorse: function(betId){

        cc.log("choose: " + betId);

        this.betBtn1.setTouchEnabled(false);
        this.betBtn2.setTouchEnabled(false);
        this.betBtn3.setTouchEnabled(false);
        this.watch.setVisible(false);
        this.unschedule(this.countDownTime);


        if(gv.matchMng.horseRaceGameMgr.selectionList[MY_INDEX] != -1){
            return;
        }

        this.chooseBet = betId;
        gv.matchMng.horseRaceGameMgr.selectionList[MY_INDEX] = betId;

        switch (betId){
            case 1:
                this.betBtn2.setVisible(false);
                this.betBtn3.setVisible(false);
                break;
            case 2:
                this.betBtn1.setVisible(false);
                this.betBtn3.setVisible(false);
                break;
            case 3:
                this.betBtn1.setVisible(false);
                this.betBtn2.setVisible(false);
                break;
        }

        var waitingOther = ccui.ImageView.create("res/game/horseRaceMinigame/waitingOtherBg.png");
        waitingOther.setPosition(this.background.getBoundingBox().width/2, 50);
        var waitingLabel = ccui.Text.create("Vui lòng chờ người chơi khác...", res.FONT_GAME_BOLD, 18);
        waitingLabel.setPosition(waitingOther.getBoundingBox().width/2, waitingOther.getBoundingBox().height/2);
        waitingOther.addChild(waitingLabel);
        this.selectHorseCtn.addChild(waitingOther);

        if( gv.matchMng.horseRaceGameMgr.reconnectData == null)//Tuc la ko phai dang reconnect
        {
            cc.log("In case not reconect - send to server: myself choose: " + this.chooseBet);
            gv.gameClient.sendMiniGameSelection(this.chooseBet);
        }
        else{//Reconnect nhung minh chua chon mat nao
            var myOpt = gv.matchMng.horseRaceGameMgr.reconnectData[MY_INDEX];
            if(myOpt === undefined || myOpt == null ||  myOpt == 0){
                cc.log("Reconecting - send to server: myself choose: " + this.chooseBet);
                gv.gameClient.sendMiniGameSelection(this.chooseBet);
            }
            else{
                cc.log("server choose for me: " +  myOpt);
            }
        }

        var delay = cc.delayTime(2);
        var seq = cc.sequence(delay, cc.callFunc(this.warmUpRun.bind(this)));
        if(!FAKE) seq = cc.sequence(delay);
        this.selectHorseCtn.runAction(seq);
    },

    warmUpRun: function(){
        if(this.raceStatus == RACE_STATUS.READY){
            return;
        }
        this.raceStatus = RACE_STATUS.READY;

        this.selectHorseCtn.setVisible(false);
        this.start.setVisible(true);
        this.timer = 3;


        var joinList = gv.matchMng.horseRaceGameMgr.joinList;
        //var hostIndex = gv.matchMng.horseRaceGameMgr.miniGameHostIndex;
        var selectionList = gv.matchMng.horseRaceGameMgr.selectionList;
        var ran = new fr.Random(Date.now(), 0);
        if(!FAKE) ran = new fr.Random(GameGenerator.getInstance().getCountOfRandom(), 0);

        cc.log("Scene: " + this.iscene);

         //Khoi tao cac con ngua
        var raceIndex = joinList.length - 1;
        for(var i = joinList.length - 1; i >= 0 ; i--) {
            if(this.horseAni[i] == null){
                var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(joinList[i]);

                this.horseAni[i] = this.createHorse(player.playerColor);// fr.AnimationMgr.createAnimationById(resAniId.minigame_horse, this);
                this.horseAni[i].getAnimation().gotoAndStop("cham", 0, -1, 0);
                this.background.addChild(this.horseAni[i]);
                if(joinList[i] == MY_INDEX){
                    this.horseAni[i].setPosition(230, 50);
                }
                else{
                    this.horseAni[i].setPosition(230, 50 + raceIndex * 80);
                    raceIndex--;
                }

                //avatar
                var av = new fr.Avatar(player.playerStatus.avatarUrl, AvatarShape.CIRCLE);
                av.setScale(0.9);
                av.setPosition(100, this.horseAni[i].getPositionY() + 30);
                this.background.addChild(av);


                var money = 100;
                if(!FAKE) money = gv.matchMng.horseRaceGameMgr.moneyPay * selectionList[joinList[i]];
                var moneyLb = ccui.Text.create(StringUtil.toMoneyString(money), res.FONT_GAME_BOLD, 24);
                moneyLb.setPosition(0 , 0);
                av.addChild(moneyLb);

                this.horseAni[i].playerIndex = joinList[i];
                if(FAKE) this.horseAni[i].iscene = ran.randomIntInclusive(0, 6);
            }
        }

        //random kick ban chay
        if(!FAKE){
            var mapper = gv.matchMng.mapper;
            for(var globalStanPos = 0; globalStanPos < MAX_NUMBER_PLAYER; globalStanPos++){
                var localIndex = mapper.convertGlobalStandPosToLocalIndex(globalStanPos);
                cc.log("local: " + localIndex);
                var i = joinList.indexOf(localIndex);
                cc.log("index of joinList: " + i);
                if(i >-1){
                    this.horseAni[i].iscene = ran.randomIntInclusive(0, 6);
                    cc.log("random scene: " + this.horseAni[i].iscene);
                }
            }
        }

        this.schedule(this.countDownToStart, 1, this.timer);
    },

    countDownToStart: function(){
        cc.log("time to start: " + this.timer);
        if(this.timer <= 0)
        {
            this.startRun();
            return;
        }

        if(this.startTimerSp == null){
            this.startTimerSp = ccui.ImageView.create("res/game/horseRaceMinigame/" +  this.timer.toString() + ".png");
        }
        else{
            this.background.removeChild(this.startTimerSp);
            this.startTimerSp = ccui.ImageView.create("res/game/horseRaceMinigame/" +  this.timer.toString() + ".png");
        }

        this.startTimerSp.setPosition(this.background.getBoundingBox().width/2 + 20, 400);
        this.background.addChild(this.startTimerSp);

        this.timer--;
    },



    startRun: function(){
        cc.log("start run");
        if(this.raceStatus == RACE_STATUS.RUNNING){
            return;
        }

        this.raceStatus = RACE_STATUS.RUNNING;

        this.startTimerSp.setVisible(false);

        for(var i = 0; i < this.horseAni.length; i++){
            this.horseAni[i].getAnimation().gotoAndPlay("xuatphat", 0, -1, 1);
            this.horseAni[i].setCompleteListener(function(horse){horse.getAnimation().gotoAndPlay("nhanh", 0, -1, 0);}.bind(this));
        }

        this.schedule(this.createRandomObj, 1);
        this.schedule(this.updateScene, RACE_TIME/PHASE_NUM, PHASE_NUM - 2, 0);
        this.scheduleUpdate();
    },


    createRaceObject: function(objectInfo){
        if(objectInfo.resName == null || objectInfo.resName.length == 0)
            return;
        var hedgeLength = 10;

        var list = [];
        var index = 0;
        do{

            var i = (index++)%objectInfo.resName.length;
            //cc.log("raceObj: " + i + ", " + index + ", " + objectInfo.resName[i]);
            var raceObj = ccui.ImageView.create(objectInfo.resName[i]);
            raceObj.setPosition(hedgeLength + raceObj.getBoundingBox().width/2 , objectInfo.posY);
            raceObj.available = false;
            if(raceObj.getPositionX() >= this.background.getBoundingBox().width + raceObj.getBoundingBox().width/2){
                raceObj.setVisible(false);
            }
            raceObj.hideCallback = objectInfo.hideCallback;
            raceObj.showCallback = objectInfo.showCallback;
            raceObj.speed = objectInfo.speed;
            raceObj.type = RACE_OBJ_TYPE.CONTINUOUS;
            list.push(raceObj);
            hedgeLength += raceObj.getBoundingBox().width;
            objectInfo.parent.addChild(raceObj);
        } while (hedgeLength < (this.background.getBoundingBox().width +  raceObj.getBoundingBox().width)|| (index >0 && index%objectInfo.resName.length != 0))
        this.poolObj[objectInfo.poolName] = list;
    },


    //Update cac object tren duong dua theo thoi gian
    moveObj: function(dt){
        if(this.raceStatus == RACE_STATUS.RUNNING){
            for (var key in this.poolObj){
                var list = this.poolObj[key];
                for( var i = 0 ; i < list.length; i++){
                    var obj = list[i];
                    if(obj.available == false){//Dang hien thi, nam trong stock
                        var newX = obj.getPositionX() - obj.speed * dt;
                        obj.setPositionX(newX);
                        var rightBound = this.background.getBoundingBox().width + obj.getBoundingBox().width/2;
                        if(newX < rightBound && newX + obj.speed >= rightBound){
                            obj.setVisible(true);
                            if(obj.showCallback){
                                obj.showCallback(obj);
                            }
                        }
                        var leftBound = -obj.getBoundingBox().width/2;
                        if(newX <= leftBound){
                            obj.available = true;
                            obj.setVisible(false);
                            if(obj.type == RACE_OBJ_TYPE.CONTINUOUS){
                                var lastObj = list[list.length -1];
                                obj.setPositionX(lastObj.getPositionX() + lastObj.getBoundingBox().width/2 + obj.getBoundingBox().width/2);
                                obj.available = false;
                                list.shift();
                                list.push(obj);
                                i--;
                            }

                            if(obj.hideCallback){
                                obj.hideCallback(obj);
                            }
                        }
                    }
                }
            }
        }
    },



    createRace: function (raceObject) {
        //vach xuat phat
        this.start = ccui.ImageView.create("res/game/horseRaceMinigame/start.png");
        this.start.setPosition(170, 167);
        this.raceLayer.addChild(this.start);
        this.start.speed = SPEED_RACE;
        this.start.available = false;
        this.start.setVisible(false);
        if(this.poolObj["milestone"] == null){
            this.poolObj["milestone"] = [];
        }
        this.poolObj["milestone"].push(this.start);

        for(var i = 0; i < 4; i++){
            var startPoint = ccui.ImageView.create("res/game/horseRaceMinigame/startPoint.png");
            startPoint.setPosition(this.start.getBoundingBox().width + 18, 50 + i * 75);
            this.start.addChild(startPoint);
        }


        //sao
        for(var i = 0; i < 10; i++) {
            var objectInfo = [];
            objectInfo.resName = "res/game/horseRaceMinigame/star.png";
            objectInfo.speed = SPEED_RACE;
            objectInfo.posX = this.background.getBoundingBox().width * Math.random();
            objectInfo.posY = 50 + Math.random() * 250;
            objectInfo.poolName = "star";
            objectInfo.parent = this.raceLayer;
            this.createHole(objectInfo).setVisible(true);
        }


        //co ven duong dua
        for(var i = 0; i < 3; i++) {
            var objectInfo = [];
            objectInfo.resName = "res/game/horseRaceMinigame/grass.png";
            objectInfo.speed = SPEED_RACE;
            objectInfo.posX = (i + 1) * 400 + Math.random()* 100;
            objectInfo.posY = 360 + Math.random()*30;
            objectInfo.poolName = "grass";
            objectInfo.parent =  this.raceLayer;
            this.createHole(objectInfo).setVisible(true);
        }


        //hang rao go
        for(var i = 0; i < 4; i++) {
            var objectInfo = [];
            objectInfo.resName = "res/game/horseRaceMinigame/hedge.png";
            objectInfo.speed = SPEED_RACE;
            objectInfo.posX = (i + 1) * 200 + Math.random()* 150;
            objectInfo.posY = 325 + Math.random()*30;
            objectInfo.poolName = "hedge";
            objectInfo.parent =  this.raceLayer;
            this.createHole(objectInfo).setVisible(true);
        }


        //dai phan cach 1
        var objectInfo = [];
        objectInfo.resName = ["res/game/horseRaceMinigame/line.png"];
        objectInfo.speed = SPEED_RACE;
        objectInfo.posY = 95;
        objectInfo.poolName = "line1";
        objectInfo.parent =  this.raceLayer;
        this.createRaceObject(objectInfo);


        //dai phan cach 2
        var objectInfo = [];
        objectInfo.resName = ["res/game/horseRaceMinigame/line.png"];
        objectInfo.speed = SPEED_RACE;
        objectInfo.posY = 175;
        objectInfo.poolName = "line2";
        objectInfo.parent =  this.raceLayer;
        this.createRaceObject(objectInfo);


        //dai phan cach 3
        var objectInfo = [];
        objectInfo.resName = ["res/game/horseRaceMinigame/line.png"];
        objectInfo.speed = SPEED_RACE;
        objectInfo.posY = 255;
        objectInfo.poolName = "line3";
        objectInfo.parent =  this.raceLayer;
        this.createRaceObject(objectInfo);


        //Khan gia
        objectInfo.resName = ["res/game/horseRaceMinigame/khangia.png"];
        objectInfo.speed = SPEED_AUDIENCE;
        objectInfo.posY = 430;
        objectInfo.poolName = "audience";
        objectInfo.parent =  this.behindRaceLayer;
        this.createRaceObject(objectInfo);


        //Hang rao tren
        objectInfo.resName = [
            "res/game/horseRaceMinigame/p1.png"
        ];
        objectInfo.speed = SPEED_RACE;
        objectInfo.posY = 345;
        objectInfo.poolName = "upHedge";
        objectInfo.parent =  this.behindRaceLayer;
        this.createRaceObject(objectInfo);


        //Hang rao duoi
        objectInfo.resName = [
            "res/game/horseRaceMinigame/q1.png"
        ];
        objectInfo.speed = SPEED_RACE;
        objectInfo.posY = 5;
        objectInfo.poolName = "botHedge";
        objectInfo.parent =  this.raceLayer;
        this.createRaceObject(objectInfo);

    },

    hideRaceObjCallback: function(obj){
        obj.available = false;
    },


    createRandomObj: function (dt) {
        if(Math.random() < 1){
            var objectInfo = [];
            objectInfo.resName = "res/game/horseRaceMinigame/star.png";
            objectInfo.speed = SPEED_RACE;
            objectInfo.posX = this.background.getBoundingBox().width + Math.random()* 400;
            //objectInfo.posY = Math.random()*70 + 100 + (130 * Math.floor((Math.random()*2)));//random vi tri Y trong khoang [100 - 180 ] hoac trong khoang [240 - 320]
            objectInfo.posY = 50 + Math.random()*250;
            objectInfo.poolName = "star";
            objectInfo.parent =  this.raceLayer;
            this.createHole(objectInfo);

            //Them 1 lan nua de tang so lan xuat hien
            objectInfo.posX = this.background.getBoundingBox().width + Math.random()* 400;
            objectInfo.posY = 50 + Math.random()*250;
            this.createHole(objectInfo);

            //Them 1 lan nua de tang so lan xuat hien
            objectInfo.posX = this.background.getBoundingBox().width + Math.random()* 400;
            objectInfo.posY = 50 + Math.random()*250;
            this.createHole(objectInfo);
        }


        if(Math.random() < 0.5){
            var objectInfo = [];
            objectInfo.resName = "res/game/horseRaceMinigame/grass.png";
            objectInfo.speed = SPEED_RACE;
            objectInfo.posX = this.background.getBoundingBox().width + Math.random()* 150;
            objectInfo.posY = 360 + Math.random()*30;
            objectInfo.poolName = "grass";
            objectInfo.parent =  this.raceLayer;
            this.createHole(objectInfo);
        }


        if(Math.random() < 1.0){
            var objectInfo = [];
            objectInfo.resName = "res/game/horseRaceMinigame/hedge.png";
            objectInfo.speed = SPEED_RACE;
            objectInfo.posX = this.background.getBoundingBox().width + Math.random()* 150;
            objectInfo.posY = 325 + Math.random()*30;
            objectInfo.poolName = "hedge";
            objectInfo.parent =  this.raceLayer;
            this.createHole(objectInfo);
        }



        //if(Math.random() < 1){
        //    var objectInfo = [];
        //    objectInfo.resName = "res/game/horseRaceMinigame/grass.png";
        //    objectInfo.speed = SPEED_RACE;
        //    objectInfo.posX = this.background.getBoundingBox().width + Math.random()* 150;
        //    objectInfo.posY =  Math.random()*70 + 100 + (130 * Math.floor((Math.random()*2)));
        //    objectInfo.poolName = "grass";
        //    objectInfo.parent =  this.raceLayer;
        //    this.createHole(objectInfo);
        //}
    },

    createHole :function(objectInfo){
        var pothole = null;
        var list = this.poolObj[objectInfo.poolName];
        if(list == null) list = [];
        for(var i = 0; i < list.length; i++){
            var hole = list[i];
            if(hole.available == true)
            {
                pothole = hole;
                break;
            }
        }

        if(pothole == null){
            pothole = ccui.ImageView.create(objectInfo.resName);
            pothole.speed = objectInfo.speed;
            pothole.type = RACE_OBJ_TYPE.RAMDOM;
            pothole.setVisible(false);
            objectInfo.parent.addChild(pothole);
            list.push(pothole);
            this.poolObj[objectInfo.poolName] = list;
        }

        pothole.available = false;
        if(objectInfo.posX != null){
            pothole.setPositionX(objectInfo.posX);
        }
        if(objectInfo.posY != null){
            pothole.setPositionY(objectInfo.posY);
        }
        return pothole;
    },


    update: function (dt) {
        this.moveObj(dt);
    },

    updateScene: function(dt) {
        this.phase++;
        cc.log("phase: " + this.phase);
        if (this.phase >= PHASE_NUM - 1) {
            this.destination = ccui.ImageView.create("res/game/horseRaceMinigame/destination.png");
            this.destination.setPosition(this.background.getBoundingBox().width + 200, 170);
            this.behindRaceLayer.addChild(this.destination);
            this.destination.speed = SPEED_RACE;
            this.destination.available = false;
            this.destination.setVisible(false);
            if(this.poolObj["milestone"] == null){
                this.poolObj["milestone"] = [];
            }
            this.poolObj["milestone"].push(this.destination);


            var flag = ccui.ImageView.create("res/game/horseRaceMinigame/flag.png");
            flag.setPosition(this.destination.getBoundingBox().width/2, this.destination.getBoundingBox().height/2);
            this.destination.addChild(flag);
        }
        var distance = (this.background.getBoundingBox().width - 400) / DISTANCE_NUM;

        var hostIndex = gv.matchMng.horseRaceGameMgr.miniGameHostIndex;
        var joinList = gv.matchMng.horseRaceGameMgr.joinList;
        var winner = gv.matchMng.horseRaceGameMgr.winner;


        cc.log("winner in update scene: " + winner);
        for(var i = 0; i < this.horseAni.length; i++){
            var sc;
            cc.log("update scene: " + this.horseAni[i].iscene);
            if(joinList[i] == winner){
                sc = scene[this.horseAni[i].iscene];
                cc.log("winnnnnnnnnnnnnnnnnnnnn");
            }
            else {
                sc = loserScene[this.horseAni[i].iscene];
                cc.log("looseeeeeeeeeeeeeeeeeeee");
            }

            cc.log(sc[0] + ", " + sc[1] + ", " +  sc[2] + ", " + sc[3]);
            var posX = (sc[this.phase] - sc[this.phase - 1]) * distance;
            var pos = cc.p(posX, 0);
            var seq = cc.sequence(cc.moveBy(dt*3/4, pos), cc.callFunc(this.horseMoveDone.bind(this), this, this.phase));
            seq.setTag(this.phase);
            this.horseAni[i].runAction(seq);
            if(posX > 0){
                if(this.horseAni[i].getAnimation().getCurrentAnimationName() != "nhanh") {
                    this.horseAni[i].getAnimation().gotoAndPlay("nhanh", 0, -1, 0);
                }
            }
            else if(posX < 0){
                if(this.horseAni[i].getAnimation().getCurrentAnimationName() != "nga") {
                    this.horseAni[i].getAnimation().gotoAndPlay("nga", 0, -1, 1);
                    this.horseAni[i].setCompleteListener(function(horse){horse.getAnimation().gotoAndPlay("dung", 0, -1, 0);}.bind(this));
                }
            }
        }
    },


    horseMoveDone :function(target, phase){
        target.stopActionByTag(phase);
        if(target.getAnimation().getCurrentAnimationName() != "cham"){
           target.getAnimation().gotoAndPlay("cham", 0, -1, 0);
        }
        if(phase >= PHASE_NUM - 1) {
            target.getAnimation().stop();
            this.endRun();
        }
    },



    endRun: function(){
        if(this.raceStatus == RACE_STATUS.END)
            return;

        this.raceStatus = RACE_STATUS.END;
        this.unschedule(this.createRandomObj);
        this.unscheduleUpdate();

        this.background.setVisible(false);

        for(var i = 0; i < this.horseAni.length; i++){
            this.horseAni[i].setVisible(false);
        }

        var baseBet = gv.matchMng.horseRaceGameMgr.moneyPay;
        var host = gv.matchMng.horseRaceGameMgr.miniGameHostIndex;

        var money;
        var gui = null;
        if(MY_INDEX != gv.matchMng.horseRaceGameMgr.winner)
        {
            //thua
            fr.Sound.playSoundEffect(resSound.g_minigame_lose);
            money = -baseBet*this.chooseBet;
            gui = this.showLooser;
        }
        else{
            //thang
            fr.Sound.playSoundEffect(resSound.g_minigame_win);
            money = baseBet*this.chooseBet;
            gui = this.showWinner;
            var taxLb = gui.getChildByName("taxTxt");
            var moneyLb = new ccui.Text(StringUtil.toMoneyString(-baseBet*this.chooseBet*TAX_PERCENT), res.FONT_GAME_BOLD, 24);
            moneyLb.setColor(cc.RED);
            moneyLb.setPosition(taxLb.getPositionX() + taxLb.getBoundingBox().width/2 +  moneyLb.getBoundingBox().width/2 + 10, taxLb.getPositionY());
            gui.addChild(moneyLb);

        }
        var hostLb =  gui.getChildByName("hostTxt");
        hostLb.setVisible(false);

        if(host == MY_INDEX){
            var bonus = new ccui.Text("+ " + StringUtil.toMoneyString(gv.matchMng.horseRaceGameMgr.calculateHostBonus()), res.FONT_GAME_BOLD, 24);
            bonus.setColor(cc.GREEN);
            bonus.setPosition(hostLb.getPositionX() + hostLb.getBoundingBox().width/2 + bonus.getBoundingBox().width/2 + 10, hostLb.getPositionY());
            gui.addChild(bonus);
            hostLb.setVisible(true);
        }

        gui.setVisible(true);

        var moneylabel = new ccui.Text(StringUtil.toMoneyString(money), res.FONT_GAME_BOLD, 100);
        moneylabel.setPosition(390, 120);
        gui.addChild(moneylabel);

       /* var layerFog = cc.LayerColor.create(cc.color(0, 0, 0, 150));
        layerFog.setPosition(-layerFog.getBoundingBox().width/2, -layerFog.getBoundingBox().height/2);
        this.showWinner.getChildByName("fog").addChild(layerFog);*/

        /*var effwin  = fr.AnimationMgr.createAnimationById(resAniId.minigame2_chienthang, this);
        effwin.getAnimation().gotoAndPlay("run", 0, -1, 0);//start, end
        this.showWinner.addChild(effwin);*/

        var btnOk = gui.getChildByName("btn_ok");
        btnOk.addClickEventListener(this.close.bind(this));

        var btnClose = gui.getChildByName("btn_close");
        btnClose.addClickEventListener(this.close.bind(this));

        var color = PlayerColor.GREEN;
        if(!FAKE) color = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(MY_INDEX).playerColor;
        var horse = ccui.ImageView.create(this.getPathByColor(color));
        horse.setScaleX(-1);
        horse.setPosition(0, 160);
        gui.addChild(horse);

        var delay = cc.delayTime(0);
        var callback = cc.callFunc(this.showResult.bind(this), this,  this.showWinner);
        gui.runAction(cc.sequence(delay, callback));
    },


    showResult: function(target, data){

        //this.resultBg.setVisible(true);
        var delay = cc.delayTime(5);
        var callback = cc.callFunc(this.close.bind(this), this);
        this.background.runAction(cc.sequence(delay, callback));
    },

    close:function(){
        if(this.raceStatus == RACE_STATUS.EXIT)
            return;
        this.raceStatus = RACE_STATUS.EXIT;
        this.destroy(DestroyEffects.ZOOM);
        gv.matchMng.horseRaceGameMgr.onExitGame();
    },

    createHorse: function(horseColor){
        var horseAni  = fr.AnimationMgr.createAnimationById(resAniId.minigame_horse, this);
        horseAni.getAnimation().gotoAndPlay("cham", 0, -1, 0);//start, end

        for (var color=0; color<4; color++){
            var colorStr = GameUtil.getColorStringById(color);
            for (var layerIndex=0; layerIndex<5; layerIndex++){
                cc.log(colorStr+"_"+ layerIndex);
                horseAni.getArmature().getBone(colorStr+"_"+ layerIndex).setVisible(color==horseColor);
            }
        }

        return horseAni;
    },
});

