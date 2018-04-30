/**
 * Created by zoro on 4/24/2019.
 */

var playerMode =
{
    MODE_TWO:2,
    MODE_THREE:3,
    MODE_FOUR:4
}
var playerPosition =
{
    PLAYER_0:0,
    PLAYER_1:1,
    PLAYER_2:2,
    PLAYER_3:3,
    SYSTEM:4

};
var payTime = {
    listTimePeriodForPayMoney:[1.1,1.3,1.4,2,2]
};
listCardIdx =
{
    2:
    {
        0:
        {
            listIdx:[0,1]
        },
        1:
        {
            listIdx:[1,0]
        }
    },
    3:
    {
        0:
        {
            listIdx:[0,1,2]
        },
        1:
        {
            listIdx:[2,0,1]
        },
        2:
        {
            listIdx:[1,2,0]
        }

    },

    4:
    {
        0:
        {
            listIdx:[0,1,2,3] // index in listCard
        },
        1:
        {
            listIdx: [3,0,1,2]
        },
        2:
        {
            listIdx:[2,3,0,1]
        },
        3:
        {
            listIdx:[1,2,3,0]
        }

    }
};
listPlayerIndex = {
    2:
    {
        0:
        {
            listIdx:[0,2]
        },
        1:
        {
            listIdx:[2,0]
        }
    },
    3:
    {
        0:
        {
            listIdx:[0,1,3]
        },
        1:
        {
            listIdx:[3,0,1]
        },
        2:
        {
            listIdx:[1,3,0]
        }
    },
    4:
    {
        0:
        {
            listIdx:[0,1,2,3]
        },
        3:
        {
            listIdx:[1,2,3,0]
        },
        2:
        {
            listIdx:[2,3,0,1]
        },
        1:
        {
            listIdx:[3,0,1,2]
        }
    }
};

moneyPayConfig = {

    0: // < 10%
    {
        lists:[0,2,0,0,0,0]
    },
    1:{ // = 20% so tien bat dau man choi
        lists:[0,3,2,0,0,0]
    },

    2: // = 50% so tien
    {
        lists:[0,4,3,0,0,0]
    },
    3: // = 100%
    {
        lists:[0,6,6,4,0,0]
    },
    4: // = 200%
    {
        lists:[5,6,6,5,0,0]
    }

};
moneyPlayerConfig = {

    0: // < 10%
    {
        lists:[0,0,2,0,0,0]
    },
    1:{ // = 50% so tien bat dau man choi
        lists:[0,3,4,0,0,0]
    },

    2: // = 90% so tien
    {
        lists:[0,6,6,5,0,0]
    },
    3: // = 100%
    {
        lists:[0,6,6,6,3,0]
    },
    4: // = 200%
    {
        lists:[4,5,6,6,6,0]
    }

};

goldConfig =
{
    0:
    {
        lists:[0,0,0,1]
    },
    1:
    {
        lists:[0,0,1,2]
    },
    2:
    {
        lists:[0,1,2,3]
    },
    3:
    {
        lists:[1,2,3,4]
    },
    4:
    {
        lists:[1,2,3,4]
    }

};
var centerY = (781/2);
var centerX = (1136/2);

moneyPosition =
{

    0:{
        x:0,
        y: 0,
        flipX:0,

        payPosX: centerX +400,
        payPosY: centerY - 200,

        moveByX:-390 ,
        moveByY: 320
    },
    1:{
        x: 0,
        y: 0,
        flipX:-1,
        payPosX: centerX - 300,
        payPosY: centerY - 150,

        moveByX: 330,
        moveByY: 270
    },
    2:{
        x: 0,
        y: 0,
        flipX:0,

        payPosX: centerX -350,
        payPosY: centerY + 170,

        moveByX: 380,
        moveByY: -30
    },
    3:{
        x: 0,
        y: 0,
        flipX:-1,
        payPosX: centerX +340,
        payPosY: centerY +170,

        moveByX: -300,
        moveByY: -50
    },
    4:{
        x: centerX ,
        y: centerY +400,
        payPosX: centerX ,
        payPosY: centerY + 380,

        moveByX: 1,
        moveByY: -400
    }
};

goldPosition =
{
    0:{
        x: centerX + 260 ,
        y:  centerY - 240,
        flipX:0

    },
    1:{
        x: centerX - 260,
        y: centerY - 260,
        flipX:-1


    },
    2:{
        x: centerX - 190,
        y: centerY + 260,
        flipX:0

    },
    3:{
        x:centerX + 180,
        y:centerY + 270,
        flipX:-1

    }
};
cardPosition =
{
    0:{
        x:centerX + 440,
        y:centerY -120 ,
        flipX:0
    },

    1:{
        x:centerX - 300,
        y:centerY - 235,
        flipX: -1
    }
    ,

    2:{
        x:centerX - 310,
        y:centerY + 190,
        flipX: 0
    },

    3:{
        x:centerX + 300,
        y:centerY  + 200,
        flipX: -1
    }
};
moneyReceivePosition =
{

    0:{

        moveByX:centerX*0.7,
        moveByY: -centerY*0.7
    },
    1:{

        moveByX:-centerX*0.7,
        moveByY: -centerY*0.7
    },
    2:{

        moveByX:-centerX*0.7,
        moveByY: centerY*0.7
    },
    3:{

        moveByX:centerX*0.7,
        moveByY: centerY*0.7
    }
};
var EffectPayMoney = cc.Layer.extend({

    ctor:function(numPlayer)
    {
        cc.log("EffectPayMoney: ctor");
        this.MONEY_HEIGHT = 8;
        this._super();
        this.winSize = cc.director.getWinSize();
        this.MODE_TEST = false;
        this.ListPayMoney = {};
        if(this.MODE_TEST)
        {
            this.numPlayer = 4;
        }else
        {
           this.numPlayer = numPlayer;
        }
        this.initPayMoney();
        this.idx = 0;
        this.idxColum = 5;

        this.scheduleUpdate();

        return true;
    },
    initPayMoney: function () {

        cc.log("EffectPayMoney: initPayMoney");
        for(var i = 0;i < 6; i ++)
        {
            var listColumn = [];

            for(var j = 0; j < 6; ++j)
            {
                var money =   new cc.Sprite("effMoney/gold_money_pay.png");

                this.addChild(money, 100 + j + 100*i);
                listColumn.push(money);

                money.moneyShadow = new cc.Sprite("effMoney/shadow_money.png");
                this.addChild(money.moneyShadow);
                money.moneyShadow.setScale(1.5);

                money.moneyHeight = this.MONEY_HEIGHT*1.5*j;
            }
            this.ListPayMoney[i] = listColumn;
        }

        var posX = 100;
        var posY = 0;
        this.resetPayMoneyPosition(posX, posY);

    },
    update:function(dt)
    {
        for(var i = 0; i < 6; i++)
        {
            for(var j = 0; j < 6; j++)
            {
                var money = this.ListPayMoney[i][j];
                if(money.isVisible())
                {

                    this.ListPayMoney[i][j].moneyShadow.x = money.x;
                    //y
                    var posY = (money.x - money.startPos.x)*(this._moveY - this._dropY )/this._moveX + (money.startPos.y - money.moneyHeight);

                    this.ListPayMoney[i][j].moneyShadow.y = posY;
                }
            }
        }
    },
    move: function (delta) {

        var isMoveLastOne = false;
        var money = this.ListPayMoney[ this.idxColum][this.idx];
        this.idx++;
        if(this.idx > 5 || this.ListPayMoney[this.idxColum][this.idx].isVisible() == false)
        {

            if(this.idxColum <= 0)
            {
                isMoveLastOne = true;
            }else
            {
                this.idx = 0;
                this.idxColum--;
            }
        }

        var drop = cc.moveBy(0.2,cc.p(0, -this._dropY));
        var actionDrop  = drop.easing(cc.easeIn(2.0));
        var actionFace = cc.fadeIn(0.3);
        money.runAction(actionFace);
        var bezier = [
            cc.p(0,0),
            cc.p(this._moveX/2,Math.abs(this._moveY*1.2)),
            cc.p(this._moveX, this._moveY)
        ];
        var bezierTo = cc.bezierBy(0.3, bezier);


        if(money.isVisible())
        {
            money.moneyShadow.setVisible(true);
        }

        if(isMoveLastOne)
        {
            var sequence1 = null;
            if(this.actionFinishPay == null)
            {
                sequence1 = cc.sequence(bezierTo,actionDrop);
            }else
            {
                sequence1 = cc.sequence(bezierTo,actionDrop,this.actionFinishPay);
                this.actionFinishPay.release();
                this.actionFinishPay = null;
            }

            //this.unschedule(this.move);

            money.runAction(sequence1);
            return;

        }else{
            var sequence1 = cc.sequence(bezierTo,actionDrop);
            money.runAction(sequence1);
        }
        var sequence = cc.sequence(cc.delayTime(0.06), cc.callFunc(this.move,this));
        this.runAction(sequence);

    },
    resetPayMoneyPosition: function (_posX, _posY) {

        for(var i = 0; i < 6; i++)
        {
            var posX = _posX - 26*1.5*i;
            var posY = _posY - 16*1.5*i;

            for(var j = 0; j < 6; ++j)
            {
                var money = this.ListPayMoney[i][j];
                money.startPos = cc.p(posX, posY + money.moneyHeight);
                money.setPosition(money.startPos);
                money.setVisible(false);
                money.moneyShadow.setPosition(posX, posY);
                money.moneyShadow.visible = false;
            }
        }
    },

    effPayMoneyForSystem: function (money, playerPay) {

        var myPos;
        if(this.MODE_TEST)
        {
            myPos = 0;
        }else
        {
         //   myPos = gv.boardData.getMyPosition();
        }

        var playerPayPosition = listPlayerIndex[this.numPlayer][myPos].listIdx[playerPay];
        var rate = this.getRate(money);
        var payMoney = cc.callFunc(this.effPayMoney,this, {category:rate,playerPay:playerPayPosition});
        var receiveMoney = cc.callFunc(this.onFinishActionPayMoney, this);
        var ccSequence = cc.sequence(payMoney,cc.delayTime(2.5), receiveMoney);
        this.runAction(ccSequence);

    },
    onFinishActionPayMoney: function (sender) {

        sender.resetPayMoneyPosition(0,0);

    },
    payMoneyForRival: function (money, start, end) {
        cc.log("EffectPayMoney: payMoneyForRival");
        var myPos = 0;
        if(this.MODE_TEST)
        {
            myPos = 0;
        }else

        {
//            var myPos = gv.boardData.getMyPosition();
        }
        //
        //var playerPayPosition = listPlayerIndex[this.numPlayer][myPos].listIdx[playerPay];
        //var playerRevPosition = listPlayerIndex[this.numPlayer][myPos].listIdx[playerReceive];


        this.curMoneyCluster = this.getRate(money);
        //this.actionFinishPay = cc.callFunc(this.effReceiveMoney, this,{playerRev:playerRevPosition});
        this.actionFinishPay = cc.callFunc(this.effReceiveMoney.bind(this,end));
        this.actionFinishPay.retain();


        this.effPayMoney(this,{category:this.curMoneyCluster,playerPay:start});

    },

    sysPayMoney:function(money, playerRv)
    {
        var myPos = 0;
        if(this.MODE_TEST)
        {
            myPos = 0;
        }else
        {
            myPos = gv.boardData.getMyPosition();
        }

        var playerPayPosition =  playerPosition.SYSTEM;
        var playerRevPosition = listPlayerIndex[this.numPlayer][myPos].listIdx[playerRv];

        this.curMoneyCluster = this.getRate(money);
        this.actionFinishPay = cc.callFunc(this.effReceiveMoney, this,{playerRev:playerRevPosition});
        this.actionFinishPay.retain();

        this.effSysPayMoney(this,{category:this.curMoneyCluster,playerPay:playerPayPosition});
    },
    effSysPayMoney:function(sender, object)
    {
        cc.log("player pay = " + object.playerPay);
        var posX = moneyPosition[object.playerPay].payPosX;
        var posY = moneyPosition[object.playerPay].payPosY;

        this.resetPayMoneyPosition(posX, posY);

        this.setVisibleMoney(object.category,0);

        this._moveX = moneyPosition[object.playerPay].moveByX;
        this._moveY = moneyPosition[object.playerPay].moveByY;
        this._dropY = 380;

        //if(object.playerPay == 0 || object.playerPay == 3)
        //{
        //    this.idx = 0;
        //    this.idxColum = 5;
        //    this.isLeftToRight = true;
        //}else
        //{
        //    this.isLeftToRight = false;
        //    this.idx = 0;
        //    this.idxColum = 0;
        //}
        this.idx = 0;
        this.idxColum = 5;
        //this.isLeftToRight = true;

        this.move1();
    },
    move1: function (delta) {
        var isMoveLastOne = false;
        var money = this.ListPayMoney[ this.idxColum][this.idx];
        this.idx++;
        if(this.idx > 5 || this.ListPayMoney[this.idxColum][this.idx].isVisible() == false)
        {

            if(this.idxColum <= 0)
            {
                isMoveLastOne = true;
            }else
            {
                this.idx = 0;
                this.idxColum--;
            }
        }

        var drop = cc.moveBy(0.4,cc.p(0, -this._dropY));
        var actionDrop  = drop.easing(cc.easeIn(2.0));
        var actionFace = cc.fadeIn(0.3);
        money.runAction(actionFace);

        if(money.isVisible())
        {
            money.moneyShadow.setVisible(true);
        }

        if(isMoveLastOne)
        {
            var sequence1 = null;
            if(this.actionFinishPay == null)
            {
                sequence1 = cc.sequence(actionDrop);
            }else
            {
                sequence1 = cc.sequence(actionDrop,this.actionFinishPay);
                this.actionFinishPay.release();
                this.actionFinishPay = null;
            }

            money.runAction(sequence1);
            return;

        }else{
            var sequence1 = cc.sequence(actionDrop);
            money.runAction(sequence1);
        }
        var sequence = cc.sequence(cc.delayTime(0.06), cc.callFunc(this.move1,this));
        this.runAction(sequence);

    },

    effPayMoney: function (sender, object) {

        //cc.log("player pay position = " + object.playerPay.x + " " + object.playerPay.y);
        //var posX = moneyPosition[object.playerPay].payPosX;
        //var posY = moneyPosition[object.playerPay].payPosY;
        var posX = object.playerPay.x;
        var posY = object.playerPay.y;

        this.resetPayMoneyPosition(posX, posY);

        this.setVisibleMoney(object.category,0);

        //this._moveX = moneyPosition[object.playerPay].moveByX;
        //this._moveY = moneyPosition[object.playerPay].moveByY;


        this._dropY = 100;
        this._moveX = -posX;
        this._moveY = this._dropY-posY;


        this.idx = 0;
        this.idxColum = 5;
        //this.isLeftToRight = true;

        this.move();
    },

    effReceiveMoney: function (playerRev) {
        //cc.log("effReceiveMoney:: playerRev = (" + playerRev.x + ","+playerRev.y+")");
        var listColumVisible = [1,1,1,1,1,1];
        var listAction = [ cc.callFunc(this.moveColum0, this),
            cc.callFunc(this.moveColum1, this),
            cc.callFunc(this.moveColum2, this),
            cc.callFunc(this.moveColum3, this),
            cc.callFunc(this.moveColum4, this),
            cc.callFunc(this.moveColum5, this)];
        var arrayFunction = [];
        this.listIdxRev = [-1,-1,-1,-1,-1,-1];
        for(var i = 0; i < 6; i++)
        {
            var isColumnVisible = false;
            for(var j = 0; j < 6; j++)
            {
                var money = this.ListPayMoney[i][j];
                money.startPos = cc.p(money.x, money.y);
                if(money.isVisible())
                {
                    isColumnVisible = true;
                    this.listIdxRev[i] = j;
                }
            }
            listColumVisible[i] = isColumnVisible;
            if(isColumnVisible) {
                //if (object.playerRev != playerPosition.PLAYER_1) {
                //
                //    arrayFunction.push(cc.delayTime(0.2));
                //    arrayFunction.push(listAction[i]);
                //}
                //else {
                    arrayFunction.unshift(listAction[i]);
                    arrayFunction.unshift(cc.delayTime(0.2));
                //}
            }

        }
        //this._moveX = moneyReceivePosition[object.playerRev].moveByX;
        //this._moveY = moneyReceivePosition[object.playerRev].moveByY;
        this._moveX = playerRev.x;
        this._moveY = playerRev.y;
        this._dropY = 0;
        this.runAction(cc.sequence(arrayFunction));

    },
    moveColum0:function(sender)
    {
        var action = cc.sequence(cc.delayTime(0.08),cc.callFunc(this.moveMoneyColum0, this));
        this.runAction(action);

    },
    moveColum1:function(sender)
    {
        var action = cc.sequence(cc.delayTime(0.08),cc.callFunc(this.moveMoneyColum1, this));
        this.runAction(action);
    },
    moveColum2:function(sender)
    {
        var action = cc.sequence(cc.delayTime(0.08),cc.callFunc(this.moveMoneyColum2, this));
        this.runAction(action);
    },
    moveColum3:function(sender)
    {
        var action = cc.sequence(cc.delayTime(0.08),cc.callFunc(this.moveMoneyColum3, this));
        this.runAction(action);

    },
    moveColum4:function(sender)
    {
        var action = cc.sequence(cc.delayTime(0.08),cc.callFunc(this.moveMoneyColum4, this));
        this.runAction(action);
    },
    moveColum5:function(sender)
    {
        var action = cc.sequence(cc.delayTime(0.08),cc.callFunc(this.moveMoneyColum5, this));
        this.runAction(action);
    },
    isRevMoneyActionDone:function()
    {
        for(var i = 0 ; i < this.listIdxRev.length; ++i)
        {
            if(this.listIdxRev[i] != -1)
            {
                return false;
            }
        }
        return true;
    },
    moveMoneyColum0:function()
    {
        var move = cc.moveBy(1.0, cc.p(this._moveX, this._moveY));
        var actionMove = move.easing(cc.easeIn(10.0));
        var actionFadeOut = cc.fadeOut(0.1);
        if(this.listIdxRev[0] < 0)
        {
            //if(this.isRevMoneyActionDone())
            //{
            //    this.onFinishActionRevMoney();
            //}
            return;
        }

        var sequence = cc.sequence(cc.delayTime(0.9), actionFadeOut);
        var money = this.ListPayMoney[0][this.listIdxRev[0]];
        money.runAction(sequence);
        money.runAction(actionMove);
        money.moneyShadow.runAction(sequence.clone());

        this.listIdxRev[0]--;
        this.moveColum0();
    },
    moveMoneyColum1:function()
    {
        var move = cc.moveBy(1.0, cc.p(this._moveX, this._moveY));
        var actionMove = move.easing(cc.easeIn(10));
        var actionFadeOut = cc.fadeOut(0.1);

        if(this.listIdxRev[1] < 0)
        {
            //if(this.isRevMoneyActionDone())
            //{
            //    this.onFinishActionRevMoney();
            //}
            return;
        }
        var sequence = cc.sequence(cc.delayTime(0.9), actionFadeOut);


        var money = this.ListPayMoney[1][this.listIdxRev[1]];
        money.runAction(sequence);
        money.runAction(actionMove);
        money.moneyShadow.runAction(sequence.clone());

        this.listIdxRev[1]--;
        this.moveColum1();
    },
    moveMoneyColum2:function()
    {
        var move = cc.moveBy(1.0, cc.p(this._moveX, this._moveY));
        var actionMove = move.easing(cc.easeIn(10.0));
        var actionFadeOut = cc.fadeOut(0.1);

        if(this.listIdxRev[2] < 0)
        {
            //if(this.isRevMoneyActionDone())
            //{
            //    this.onFinishActionRevMoney();
            //}
            return;
        }
        var sequence = cc.sequence(cc.delayTime(0.9), actionFadeOut);

        var money = this.ListPayMoney[2][this.listIdxRev[2]];
        money.runAction(sequence);
        money.runAction(actionMove);
        money.moneyShadow.runAction(sequence.clone());

        this.listIdxRev[2]--;

        this.moveColum2();
    },
    moveMoneyColum3:function()
    {
        var move = cc.moveBy(1.0, cc.p(this._moveX, this._moveY));
        var actionMove = move.easing(cc.easeIn(10.0));
        var actionFadeOut = cc.fadeOut(0.1);

        if(this.listIdxRev[3] < 0)
        {
            //if(this.isRevMoneyActionDone())
            //{
            //    this.onFinishActionRevMoney();
            //}
            return;
        }
        var sequence = cc.sequence(cc.delayTime(0.9), actionFadeOut);
        var money = this.ListPayMoney[3][this.listIdxRev[3]];
        money.runAction(sequence);
        money.runAction(actionMove);
        money.moneyShadow.runAction(sequence.clone());

        this.listIdxRev[3]--;
        this.moveColum3();

    },
    moveMoneyColum4:function()
    {
        var move = cc.moveBy(1.0, cc.p(this._moveX, this._moveY));
        var actionMove = move.easing(cc.easeIn(10.0));
        var actionFadeOut = cc.fadeOut(0.1);

        if(this.listIdxRev[4] < 0)
        {

            //if(this.isRevMoneyActionDone())
            //{
            //    this.onFinishActionRevMoney();
            //}
            return;
        }
        var sequence = cc.sequence(cc.delayTime(0.9), actionFadeOut);
        var money = this.ListPayMoney[4][this.listIdxRev[4]];
        money.runAction(sequence);
        money.runAction(actionMove);
        money.moneyShadow.runAction(sequence.clone());

        this.listIdxRev[4]--;

        this.moveColum4();
    },
    moveMoneyColum5:function()
    {
        var move = cc.moveBy(1.0, cc.p(this._moveX, this._moveY));
        var actionMove = move.easing(cc.easeIn(10.0));
        var actionFadeOut = cc.fadeOut(0.1);

        if(this.listIdxRev[5] < 0)
        {

            //if(this.isRevMoneyActionDone())
            //{
            //    this.onFinishActionRevMoney();
            //}

            return;
        }
        var sequence = cc.sequence(cc.delayTime(0.9), actionFadeOut);
        var money = this.ListPayMoney[5][this.listIdxRev[5]];
        money.runAction(sequence);
        money.runAction(actionMove);
        money.moneyShadow.runAction(sequence.clone());

        this.listIdxRev[5]--;
        this.moveColum5();
    },
    onFinishActionRevMoney:function()
    {
        ////this.isPayingMoney = false;
        //// neu sau khi tra tien toll con du tien acquire thi bat bang acquire
        //cc.log("finish pay money");
        //if(this.isAcquire)
        //{
        //    this.isAcquire = false;
        //    gv.gameWorld._listener.listSlot[this.curSlotAcquire].doAcquire(this.playerAcquireID);
        //}
    },


    setVisibleMoney: function (kind, opacity) {
        cc.log("EffectPayMoney::setVisibleMoney");
        for(var i = 0; i < moneyPayConfig[kind].lists.length; ++i)
        {
            for(var j = 0; j < moneyPayConfig[kind].lists[i]; ++j) {

                var money = this.ListPayMoney[i][j];

                money.setVisible(true);
                money.setOpacity(opacity);


                money.moneyShadow.setOpacity(225);
            }
        }
    },
    getRate: function (money) {
        var rate;
        if(this.MODE_TEST)
        {
            rate = money*100/10000;
        }else
        {
            rate = money*100/10000;
        }

        if(rate < 5)
        {
            return 0;
        }
        if(rate < 10)
        {
            return 1;
        }
        if(rate <= 50)
        {
            return 2;
        }
        if(rate <= 100)
        {
            return 3;
        }
        if(rate > 100 )
        {
            return 4;
        }
    },

});