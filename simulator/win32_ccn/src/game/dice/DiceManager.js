/**
 * Created by GSN on 1/25/2016.
 */

var DICE_DISPLAYTIME = 2;

var DICE_BOUNCE_MAX = 3;

var DICE_BOUNCE_MIN = 2;

var DICE_HEIGHT_MAX = 1.42;

var DICE_HEIGHT_MIN = 0.76;

var DICE_ROTATION_SPEED = 1.3;

var DICE_SPEED = 0.63;

var MAX_NUMBER_DICE = 3;

var SCALE_3D_FACTOR = 250;

var DICE_DEBUG_MODE = true;

var PARTICLE_SNOW = true;
var DiceName = {
    DICE_1 : "DICE_1",
    DICE_2 : "DICE_2",
    DICE_3 : "DICE_3",
    DICE_4 : "DICE_4",
    DICE_5 : "DICE_5",
    DICE_6 : "DICE_6"

};
var DiceManager = cc.Node.extend({

    ctor : function(){
        this._super();
        this.playerIndex_diceGroup = []; //map player index voi dice group tuong ung
        this.diceLayer = null; // xac sac se duoc add vao layer nay
        this.lastDiceResult = null;//{score1, score2}
        //this.lastFortuneResult = null;
        this.numberContRoll = 0; //so lan quay doi lien tiep da thuc hien
        this._camera = null;
        this.layer3D = null;
        this.skillAcceleration = false;
    },

    //don dep bo nho khi ket thuc van
    cleanUp : function(){
        if (this._camera)
            this._camera.removeFromParent();
        if (this.layer3D)
            this.layer3D.removeFromParent();
        this.unscheduleUpdate();
        this.removeFromParent();
    },

    //thiet lap lai cac bien du lieu khi bat dau mot turn moi
    resetTurnData : function(){
        this.numberContRoll = 0;
        this.lastDiceResult = null;
        //this.lastFortuneResult = null;
    },

    getLastDiceResult : function(){
        return this.lastDiceResult;
    },

    //co the tien hanh tung dice lien tiep hay khong
    canDoContinousRoll : function(){
        //pay to summon
        if (this.lastDiceResult==null){
            return true;
        }

        if(this.numberContRoll < MAX_NUMBER_CONT_ROLL){
            return (this.lastDiceResult.score1 == this.lastDiceResult.score2 || this.skillAcceleration
            || (this.lastDiceResult.score1 == 1 && this.lastDiceResult.score2 == 6) || (this.lastDiceResult.score2 == 1 && this.lastDiceResult.score1 == 6));
        }
        return false;
    },

    init3DLayer : function(){

        //thiet lap nguon sang vo huong
        var ambient = jsb.AmbientLight.create(cc.color(80, 80, 80));
        ambient.setLightFlag(cc.LightFlag.LIGHT0);
        this.diceLayer.addChild(ambient);
        this.diceLayer.setGlobalZOrder(20);

        //thiet lap nguon sang diem
        var pointLight = jsb.PointLight.create(cc.math.vec3(cc.winSize.width/2 -100, cc.winSize.height/2-100, 400), cc.color(255, 255, 255, 0.5), 2000);
        this.addChild(pointLight);

        //var directionLight = jsb.DirectionLight.create(cc.math.vec3(cc.winSize.width/2 -100, cc.winSize.height/2-100, 400),cc.color(255, 255, 255,0.5));
        //this.addChild(directionLight);

        this.layer3D = new jsb.Sprite3D();
        this.layer3D.addChild(this.diceLayer);
        this.layer3D.setGlobalZOrder(200);

        // add camera
        var winSize = cc.director.getWinSize();
        this._camera = cc.Camera.createOrthographic(winSize.width, winSize.height, 1, 2000);
        this._camera.setCameraFlag(cc.CameraFlag.USER1);
        this._camera.setPosition3D(cc.math.vec3(0, -500, 300));
        this._camera.setRotation3D(cc.math.vec3(50, 0, 0));
        this._camera.setDepth(10);
        gv.mainScene.addChild(this._camera);
        gv.mainScene.addChild(this.layer3D);
        this.layer3D.setCameraMask(cc.CameraFlag.USER1);
        cc.Camera.getDefaultCamera().setDepth(1);

        this.scheduleUpdate();


    },

    //cuong su dung diceGroup cho even
    initOneDiceForSpecialEven:function(standPos){
        if(this.diceLayer == null)
            this.diceLayer = new cc.Layer();
        var diceModel = null;
        var diceTexture = null;
        var diceParticle= null;
        var selectedDice=DiceName.DICE_6;
        switch (selectedDice){
            case DiceName.DICE_1:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-base.jpg";
                diceParticle = "dice_01.pu";
                break;
            case DiceName.DICE_2:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-1.jpg";
                diceParticle = "dice_02.pu";
                break;
            case DiceName.DICE_3:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-2.jpg";
                diceParticle = "dice_03.pu";
                break;
            case DiceName.DICE_4:
                diceModel = "dice.obj";
                diceTexture = "dice-3.jpg";
                diceParticle = "dice_04.pu";
                break;
            case DiceName.DICE_5:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-4.jpg";
                diceParticle = "dice_05.pu";
                break;
            case DiceName.DICE_6:
                diceModel = "dice.obj";
                diceTexture = "dice-5.jpg";
                diceParticle = "dice_06.pu";
                break;
        }

        var diceGroup = new DiceGroup();
        diceGroup.swingSound = resSound.dice_roll_00;
        diceGroup.bounceSoundEff[0] = resSound.dice_roll_00;
        diceGroup.bounceSoundEff[1] = resSound.dice_roll_01;
        diceGroup.bounceSoundEff[2] = resSound.dice_roll_02;

        for(var i=0; i< MAX_NUMBER_DICE; i++){
            diceGroup.diceObjArray[i] = new DiceObject("res/dice/"+diceModel, "res/dice/"+diceTexture, "res/particle/particle3d/scripts/"+diceParticle,
                "", this.diceLayer);
            diceGroup.diceObjArray[i].setPosition3D({x: 0, y:0, z:1000});
            diceGroup.diceObjArray[i].initDiceInfo(standPos, i);
        }
        cc.log("initDiceGroupForPlayer. standPos: "+standPos);

        this.playerIndex_diceGroup[standPos] = diceGroup;


        // todo: co the them particle3d troi mua trong nay
        var size = cc.winSize;
        var rainyParticle = jsb.PUParticleSystem3D.create("res/particle/particle3d/scripts/bubbles.pu");
        rainyParticle.setPosition3D(cc.math.vec3(size.width/2,size.height/2+200,0));
        rainyParticle.setScale(20);
        rainyParticle.startParticleSystem();
        this.diceLayer.addChild(rainyParticle);
    },

    //thiet lap dicegroup cho nguoi choi
    //input: standpos cua nguoi choi
    initDiceGroupForPlayer : function(standPos){
        if(this.diceLayer == null){
            this.diceLayer = new cc.Layer();
        }

        var diceGroup = new DiceGroup();
        diceGroup.swingSound = resSound.dice_roll_00;
        diceGroup.bounceSoundEff[0] = resSound.dice_roll_00;
        diceGroup.bounceSoundEff[1] = resSound.dice_roll_01;
        diceGroup.bounceSoundEff[2] = resSound.dice_roll_02;

        var diceModel = null;
        var diceTexture = null;
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(standPos);
        var selectedDice = playerInfo.playerStatus.mainDice;
        var diceParticle= null;
        switch (selectedDice){
            case DiceName.DICE_1:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-base.jpg";
                diceParticle = "dice_01.pu";
                break;
            case DiceName.DICE_2:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-1.jpg";
                diceParticle = "dice_02.pu";
                break;
            case DiceName.DICE_3:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-2.jpg";
                diceParticle = "dice_03.pu";
                break;
            case DiceName.DICE_4:
                diceModel = "dice.obj";
                diceTexture = "dice-3.jpg";
                diceParticle = "dice_04.pu";
                break;
            case DiceName.DICE_5:
                diceModel = "dice-rounded.obj";
                diceTexture = "dice-4.jpg";
                diceParticle = "dice_05.pu";
                break;
            case DiceName.DICE_6:
                diceModel = "dice.obj";
                diceTexture = "dice-5.jpg";
                diceParticle = "dice_06.pu";
                break;
        }

        for(var i=0; i< MAX_NUMBER_DICE; i++){
            diceGroup.diceObjArray[i] = new DiceObject("res/dice/"+diceModel, "res/dice/"+diceTexture, "res/particle/particle3d/scripts/"+diceParticle,
                "", this.diceLayer);
            diceGroup.diceObjArray[i].setPosition3D({x: 0, y:0, z:1000});
            diceGroup.diceObjArray[i].initDiceInfo(standPos, i);
        }
        cc.log("initDiceGroupForPlayer. standPos: "+standPos);

        this.playerIndex_diceGroup[standPos] = diceGroup;

        //if(PARTICLE_SNOW){
        //    var size = cc.winSize;
        //    var rainyParticle = jsb.PUParticleSystem3D.create("res/particle/particle3d/scripts/snow.pu");
        //    rainyParticle.setPosition3D(cc.math.vec3(size.width/2,size.height/2+1000,0));
        //    rainyParticle.setScale(50);
        //    //rainyParticle.setBlendFunc(gl.ONE,gl.ONE_MINUS_CONSTANT_ALPHA);
        //    rainyParticle.startParticleSystem();
        //    this.diceLayer.addChild(rainyParticle);
        //}
    },

    throwDiceForPlayer : function(standPos, diceResult, callback){
        this.lastDiceResult = diceResult;

        var diceGroup = this.playerIndex_diceGroup[standPos];
        if(diceGroup == undefined || diceGroup == null){
            cc.assert(false, "Dice group null");
            return;
        }

        var throwInfo = diceGroup.throwInfo;
        throwInfo.throwing = true;
        throwInfo.displayTime = 0;
        throwInfo.resultNumber[0] = diceResult.score1;
        throwInfo.resultNumber[1] = diceResult.score2;
        throwInfo.resultNumber[2] = 0;

        if (diceResult.score1 == diceResult.score2)
            this.numberContRoll++;

        //throwInfo.startPos = this.calculateFromPositionForPlayer(standPos);
        throwInfo.startPos = cc.math.vec3(0, 4, 0);
        if(DICE_DEBUG_MODE){ //just debug///////////////////////////////////
            throwInfo.startPos = GameUtil.vec3Mul(throwInfo.startPos, SCALE_3D_FACTOR);
            throwInfo.startPos = cc.math.vec3Add(throwInfo.startPos, cc.math.vec3(cc.winSize.width/2, cc.winSize.height/2, 0));
        }

        throwInfo.bounceCount = MathUtil.randomBetweenFloor(DICE_BOUNCE_MIN, DICE_BOUNCE_MAX);
        throwInfo.throwCallback = function(){callback(diceResult)};

        for(var i=0; i< 3; i++){
            if(throwInfo.resultNumber[i] <= 0)
                continue;

            throwInfo.delayTime[i] = i * 0.1 + 0.001;
            throwInfo.startRotate[i] = this.randomStartRotationForDice(i);
            throwInfo.endRotate[i] = this.getRotationForDiceNum(throwInfo.resultNumber[i]);
            throwInfo.endPos[i] = this.calculateToPositionForDice(i);
            if(DICE_DEBUG_MODE){ //just debug///////////////////////////////////
                throwInfo.endPos[i] = GameUtil.vec3Mul(throwInfo.endPos[i], SCALE_3D_FACTOR);
                throwInfo.endPos[i] = cc.math.vec3Add(throwInfo.endPos[i], cc.math.vec3(cc.winSize.width/2, cc.winSize.height/2, 0));
            }

            throwInfo.heights[i] = MathUtil.randomBetween(DICE_HEIGHT_MIN, DICE_HEIGHT_MAX);
            throwInfo.heights[i] = throwInfo.heights[i]*SCALE_3D_FACTOR; //just debug//////////////////////////////////////
        }
    },

    throwingDice : function(standPos, diceIndex){
        var diceGroup = this.playerIndex_diceGroup[standPos];

        var throwInfo = diceGroup.throwInfo;
        if(throwInfo.resultNumber[diceIndex] <= 0){
            return;
        }

        var dice = diceGroup.diceObjArray[diceIndex];
        var startPos = throwInfo.startPos;
        var endPosition = throwInfo.endPos[diceIndex];
        var height = throwInfo.heights[diceIndex];
        var bounceCount = throwInfo.bounceCount;
        //cc.log("throwingDice. bounceCount: "+throwInfo.bounceCount+" standPos: "+standPos);

        var tweenJump = TweenJump.makeTweenJump(dice, DICE_SPEED, startPos, endPosition, height, 1, bounceCount);
        tweenJump.setBounceCallback(this.callbackBounce.bind(this));
        tweenJump.start();

        dice.setRotation3D(throwInfo.startRotate[diceIndex]);
        var tweenRotate = TweenRotate.makeRotate(dice, DICE_ROTATION_SPEED, throwInfo.endRotate[diceIndex]);
        tweenRotate.start();

        //reset lai shadowPosition o day
        //dice.setVisibleTailParticle(true);
        dice.countReset = 60;
    },

    hideDice : function(standPos){
        var diceGroup = this.playerIndex_diceGroup[standPos];
        for(var i=0; i< diceGroup.diceObjArray.length; i++){
            var currDiceObj = diceGroup.diceObjArray[i];
            currDiceObj.setPosition3D({x:0, y:0, z: 1000});
        }
        diceGroup.throwInfo.throwing = false;
    },

    //callback duoc goi moi khi xuc sac cham mat san
    //input:
    //diceObj : xuc sac object
    //bounceNumber : cham lan thu may

    callbackBounce : function(diceObj, bounceNumber){
        var diceGroup = this.playerIndex_diceGroup[diceObj.standPos];
        if(bounceNumber == 1 || bounceNumber == diceGroup.throwInfo.bounceCount)
            diceObj.makeBounceEffect();
    },

    //tinh toan vi tri start cho con xuc sac cua nguoi choi
    //input: standPos cua nguoi choi
    calculateFromPositionForPlayer : function(standPos){
        var fromPos;
        switch (standPos)
        {
            case 0:
                fromPos = cc.math.vec3(4, -4, 0);

                break;
            case 1:
                fromPos = cc.math.vec3(4, 4, 0);

                break;
            case 2:
                fromPos = cc.math.vec3(-4, 4, 0);

                break;
            case 3:
                fromPos = cc.math.vec3(-4, -4, 0);
                break;
        }
        return fromPos;
    },

    //tinh toan vi tri cuoi cung cho xuc sac
    //input: index cua con xuc sac
    calculateToPositionForDice : function(diceIndex){
        var returnPos = cc.math.vec3(0,0,0);
        switch (diceIndex)
        {
            case 0:
                returnPos = cc.math.vec3(MathUtil.randomBetween(0, 0.2) - 0.25, MathUtil.randomBetween(0, 0.2) + 0.2, MathUtil.randomBetween(0, 0.2) - 0.2);
                break;
            case 1:
                returnPos = cc.math.vec3(MathUtil.randomBetween(0, 0.2) + 0.25, MathUtil.randomBetween(0, 0.2) + 0.2, MathUtil.randomBetween(0, 0.2) - 0.2);
                break;
            case 2:
                returnPos = cc.math.vec3(MathUtil.randomBetween(-0.2, 0.4), MathUtil.randomBetween(0, 0.2) - 0.2, MathUtil.randomBetween(0, 0.1) - 0.45);
                break;
        }
        return returnPos;
    },

    //tinh toan goc quay cua model 3d tuong ung voi so diem cua xuc sac
    //input: so diem tren mat xuc sac
    getRotationForDiceNum : function(diceNum){
        var rotation;
        switch (diceNum)
        {
            case 1:
                rotation = cc.math.vec3(-90, 0, 0);
                break;
            case 2:
                rotation = cc.math.vec3(0, 90, 0);
                break;
            case 3:
                rotation = cc.math.vec3(180, 0, 0);
                break;
            case 4:
                rotation = cc.math.vec3(0, 0, 0);
                break;
            case 5:
                rotation = cc.math.vec3(0, -90, 0);
                break;
            case 6:
                rotation = cc.math.vec3(90, 0, 0);
                break;
        }
        //cc.log("CUONG " + diceNum)
        var z = MathUtil.randomBetween(1, 360);
        rotation.z = z;
        return rotation;
    },

    //random goc nghieng ban dau cho xuc sac
    randomStartRotationForDice : function(){
        var x = (180 + MathUtil.randomBetweenFloor(0, 270)) * ((MathUtil.randomBetweenFloor(0, 2) % 2 != 0) ? -1 : 1);
        var y = (90 + MathUtil.randomBetweenFloor(0, 180)) * ((MathUtil.randomBetweenFloor(0, 2) % 2 != 0) ? -1 : 1);
        var z = (180 + MathUtil.randomBetweenFloor(0, 270)) * ((MathUtil.randomBetweenFloor(0, 2) % 2 != 0) ? -1 : 1);
        //x = x % 360;
        //y = y % 360;
        //z = z % 360;
        //x = (x < 0? 360 + x : x);
        //y = (y < 0? 360 + y : y);
        //z = (z < 0? 360 + z : z);

        return cc.math.vec3(x, y, z);
    },

    update : function(dt){
        for(var key in this.playerIndex_diceGroup){
            var i = Number(key);

            var diceGroup = this.playerIndex_diceGroup[i];

            var throwInfo = diceGroup.throwInfo;
            if(throwInfo.throwing){
                for(var j=0; j< MAX_NUMBER_DICE; j++){
                    if(throwInfo.delayTime[j] > 0){
                        throwInfo.delayTime[j]-= dt;
                        if(throwInfo.delayTime[j] <= 0){
                            throwInfo.delayTime[j] = 0;
                            this.throwingDice(i,j); //tha xuc sac thu j cua player index i
                        }
                    }
                }
                throwInfo.displayTime+=dt;
                if(throwInfo.displayTime > DICE_DISPLAYTIME){ //het timeout -> hide xuc sac
                    this.hideDice(i);
                    if(throwInfo.throwCallback != null){
                        throwInfo.throwCallback();
                    }
                    else{
                        cc.log("ERROR: throw callback null");
                    }
                }
                for(var diceIndex =0; diceIndex< diceGroup.diceObjArray.length; diceIndex++){
                    var diceObj = diceGroup.diceObjArray[diceIndex];
                    for(var actionKey in diceObj.actionList){
                        var actionObj = diceObj.actionList[actionKey];
                        if(actionObj != undefined || actionObj!=null)
                            actionObj.update(dt);      //update chuyen dong cua xuc sac
                    }
                }
            }
        }
    }
});