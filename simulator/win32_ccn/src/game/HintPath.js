/**
 * Created by GSN on 9/14/2015.
 */

var HintPathType = {
    NONE : 0,
    NORMAL_MOVE : 1,
    KICK_OTHER : 2,
    LOAD_DES : 3,
    REVERSE_PATH : 4
};

var DOT_JUMP_STEP_TIME = 1.5;
var DOT_CREATE_RATE = 2.0;

var HintPath = cc.Class.extend({
    ctor : function(){
        this.dotList = [];
        this.dotNotUsedList = [];
        this.pieceOwner = null;
        this.tileList = [];
        this.hintType = HintPathType.NO_CHEAT;
        this.clickCallback = null;
        this.motionStreak = null;
        this.motionStreakArr = [];
    },

    show : function(clickCallback){
        if(clickCallback!= undefined && clickCallback!=null)
            this.clickCallback = clickCallback;

        //var logText = "SHOW HINT PATH: \n";

        this.motionStreak = true;
        this.showPath();

        //lam sang len cac tile tren duong di
        for (var j=0; j<this.tileList.length; j++){
            var currTile = this.tileList[j];
            currTile.highLight();
        }

        //hien thi vien da chi duong o tile cuoi cung
        if(this.hintType != HintPathType.KICK_OTHER){
            this.tileList[this.tileList.length - 1].setEnableHintStone(true, this.clickCallback);
        }
    },


    showPath: function () {
        if(this.motionStreak == false)
            return;
        var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        var actionArr = [];//Mang cac action

        for (var j=0; j<this.tileList.length; j++){
            var currTile = this.tileList[j].getStandingPositionOnTile();
                actionArr.push(cc.jumpTo(0.2, cc.p(currTile.x, currTile.y), 40, 1));
        }

        if(actionArr.length <= 0)
            return;

        var duration = 1;
        actionArr.push(cc.callFunc(function(){
            this.showPath();
        }.bind(this)));
        actionArr.push(cc.delayTime(duration));
        actionArr.push(cc.callFunc(this.motionStreakCallBack.bind(this)));

        //tim vi tri dung cua piece, this.tileList khong bao gom vi tri nay nen phai add them
        var startIndex = this.tileList[0].index - 1;
        if(startIndex < 0){
            startIndex = startIndex +  NUMBER_SLOT_IN_BOARD;
        }
        else{
            if(startIndex >= NUMBER_SLOT_IN_BOARD && startIndex < 100)
            {
                startIndex = startIndex - 60;
            }
        }
        var startPos = gv.matchMng.mapper.getTileForSlot(startIndex).getStandingPositionOnTile();

        //init motion streak
        var motionStreak = new cc.MotionStreak(duration, 1, 8, cc.color(50, 50, 50), "res/particle/test.png");
        motionStreak.setPosition(startPos);
        this.motionStreakArr.push(motionStreak);

        var seq = cc.sequence(actionArr);
        motionStreak.runAction(seq.repeatForever());
        motionStreak.setBlendFunc(gl.ONE, gl.ONE);

        var colorAction = cc.sequence(
            cc.tintTo(0.2, 255, 0, 0),
            cc.tintTo(0.2, 0, 255, 0),
            cc.tintTo(0.2, 0, 0, 255),
            cc.tintTo(0.2, 0, 255, 255),
            cc.tintTo(0.2, 255, 255, 0),
            cc.tintTo(0.2, 255, 0, 255),
            cc.tintTo(0.2, 255, 255, 255)
        ).repeatForever();

        motionStreak.runAction(colorAction);
        mainboardGui.addChild(motionStreak, this.pieceOwner.pieceDisplay.getLocalZOrder()- 1);
    },

    //bug motion streak
    //Khi phan goi y chay den dich
    motionStreakCallBack: function (target) {
        var index = this.motionStreakArr.indexOf(target);
        this.motionStreakArr[index] = null;
        this.motionStreakArr.splice(index, 1);
        target.removeFromParent();
    },

    hide : function(){
        this.motionStreak = false;
        for(var i = 0; i < this.motionStreakArr.length; i++)
        {
            this.motionStreakArr[i].setVisible(false);
            //this.motionStreak = null;
        }
        //this.motionStreakArr.splice(0, this.motionStreakArr.length);

        for(var i=0; i< this.tileList.length; i++){
            var currTile = this.tileList[i];
            currTile.highLight();
        }

        this.tileList[this.tileList.length - 1].setEnableHintStone(false);
    },

    showJumpPath : function(){

        var totalTime = this.tileList.length * DOT_JUMP_STEP_TIME;
        var numberDot = totalTime/DOT_CREATE_RATE < 1 ? 1 : totalTime/DOT_CREATE_RATE;
        var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        var _this = this;

        this.dotList= [];

        for(var i=0; i<= numberDot; i++){
            var dotParticle = new cc.ParticleSystem("res/particle/test.plist");
            dotParticle.setLife(1.5);
            dotParticle.setSpeedVar(0);
            dotParticle.setEmissionRate(0);
            dotParticle.setScale(0.5);
            dotParticle.setLocalZOrder(MainBoardZOrder.EFFECT);
            dotParticle.setPosition(_this.pieceOwner.getPosition());
            mainboardGui.addChild(dotParticle);
            this.dotList.push(dotParticle);
            this.dotNotUsedList.push(dotParticle);

            GameUtil.callFunctionWithDelay(i*DOT_CREATE_RATE, this.makeSingleJumpDot.bind(this));
        }
    },

    hideJumpPath : function(){
        for(var i=0; i< this.dotList.length; i++){
            this.dotList[i].removeFromParent();
        }
        this.dotList=[];
    },

    makeSingleJumpDot : function(){
        if(this.dotNotUsedList.length!=0){
            var particleDot = this.dotNotUsedList.pop();
            particleDot.setEmissionRate(400);
            var jumpSteps = [];
            var _this = this;

            for(var i=0; i< this.tileList.length-1; i++){

                var start = i==0? this.pieceOwner.getPosition() : cc.p(this.tileList[i].x, this.tileList[i].y);
                var end = cc.p(this.tileList[i+1].x, this.tileList[i+1].y);
                var mid = cc.p((start.x + end.x)/2, (start.y + end.y)/2 + 120);
                var bezier = [start, mid, end];
                var  bezierTo = cc.bezierTo(DOT_JUMP_STEP_TIME, bezier);

                jumpSteps.push(bezierTo);
            }

            particleDot.runAction(cc.sequence(
                cc.sequence(jumpSteps),
                cc.callFunc(function(){
                    particleDot.setEmissionRate(0);
                    particleDot.setPosition(_this.pieceOwner.getPosition());
                    _this.dotNotUsedList.push(particleDot);
                }),
                cc.delayTime(0.0),
                cc.callFunc(function(){
                    _this.makeSingleJumpDot();
                })
            ))

        }
    }

});