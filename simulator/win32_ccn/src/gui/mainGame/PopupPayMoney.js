/**
 * Created by zoro on 4/24/2019.
 */
/**
 * Created by zoro on 7/3/2018.
 */

var PopupPayMoney = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.curPayIdx = 0;
        this.MODE_TEST = true;
        this.onInit();

        return true;
    },

    onInit:function() {
        this.winSize = cc.director.getWinSize();
        // init Money for player

        this.ListPlayerMoney = {};
        this.ListPlayerGold = {};
        //this.listCardChance = [];


        this.listRateMoney = [-1,-1,-1,-1];
        this.listRateGold = [-1,-1,-1,-1];


        this.initPlayerMoney();

        //this.listPayMoney = [];
        //for(var i = 0; i < 4; ++i)
        //{
        //    var EffPayMoney = new EffectPayMoney();
        //    this.listPayMoney.push(EffPayMoney);
        //    this.addChild(EffPayMoney);
        //
        //}
        return true;

    },







    getClusterMoney:function(money)
    {
        var rate = money*100/20000;
        if(rate < 10) //
        {
            return 0;
        }
        if(rate < 50)
        {
            return 1;
        }
        if(rate < 80)
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
    getGoldRate: function (money) {
        var rate;
        if(this.MODE_TEST)
        {
            rate = money/200000;
        }else
        {
            rate = money*100/200000;
        }


        if(rate < 150) // no gold
        {
            return -1;
        }
        if(rate < 170)
        {
            return 0;
        }
        if(rate < 190)
        {
            return 1;
        }
        if(rate < 200)
        {
            return 2;
        }
        if(rate < 240)
        {
            return 3;
        }
        if(rate >= 240)
        {
            return 4;
        }
    },


    initPlayerMoney: function () {

        this.createMoney();

        this.moneyUpdate();

    },

    createMoney: function () {
        if(this.MODE_TEST)
        {
            this.numPlayer = 4;
        }else
        {
           // this.numPlayer = gv.boardData.getListPlayer().length;
        }
        //

        // create gold
        for(var num = 0; num < this.numPlayer; ++num)
        {
            var playerGold = {};
            var Z_oder = 100;
            for(var i = 0; i < 4; ++i)
            {
                var listColum = [];
                for(var j = 0; j < i + 1; ++j)
                {
                    var gold  =  new cc.Sprite("effMoney/gold.png");
                    this.addChild(gold, Z_oder + j);
                    gold.setVisible(false);
                    listColum.push(gold);
                }
                playerGold[i] = listColum;
            }

            this.ListPlayerGold[num] = playerGold;
        }
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

    },
    updateKindMoney: function (rate, playerId) {
        for(var i = 0; i < 6; i++)
        {

            for(var j = 0; j < 6; ++j)
            {

                if(rate == 4)
                {
                    this.ListPlayerMoney[playerId][i][j].setTexture("effMoney/gold_money.png");
                }else
                {
                    this.ListPlayerMoney[playerId][i][j].setTexture("effMoney/money.png");
                }
            }
        }

    },
    updateKindGold: function (goldRate, playerID) {


        for(var i = 0; i < 4; i++)
        {         for(var j = 0; j < i+1; ++j)
        {
            if(goldRate == 4) {
                this.ListPlayerGold[playerID][i][j].setTexture("effMoney/gold.png");
            }else {
                this.ListPlayerGold[playerID][i][j].setTexture("effMoney/silver.png");
            }
        }
        }
    },
    setVisibleGold: function (playerId) {

        for(var i = 0; i < 4; i++)
        {

            for(var j = 0; j < i+1; ++j)
            {

                this.ListPlayerGold[playerId][i][j].setVisible(false);


            }
        }

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
    moneyUpdate: function () {
        for(var playerID = 0; playerID < this.numPlayer; playerID++)
        {
            // set ti le tien o day
            var gold;
            var rate;
            var myPosition;
            if(this.MODE_TEST)
            {
                gold = 50000*(playerID);
                rate = 4;
                myPosition = 0;
            }
            //else
            //{
            //    gold = gv.boardData.getPlayer(playerID).getGold();
             //   rate = this.getClusterMoney(gold);
            //    myPosition = gv.boardData.getMyPosition();
            //
            //}

            var moneyPos  = listCardIdx[this.numPlayer][myPosition].listIdx[playerID];

            if(rate != this.listRateMoney[playerID])
            {

                this.setPlayerMoneyVisible(moneyPos);
                this.updateKindMoney(rate, moneyPos);
                this.rePositionMoney(rate, moneyPos);
            }



            this.setVisibleGold(moneyPos);
            var goldRate = this.getGoldRate(gold);
            if(goldRate != this.listRateGold[playerID])
            {

                if(goldRate >= 0 )
                {
                    this.updateKindGold(goldRate, moneyPos);
                    this.rePositionGold(goldRate, moneyPos);
                }
            }
        }
    },
    rePositionGold: function (rate, playerID) {
        for(var i = 0; i < goldConfig[rate].lists.length; ++i)
        {
            var pos = playerID;
            var deltaX = 26*i;
            var deltaY = 16*i;
            if(playerID == 1 && this.numPlayer == 2)
            {
                pos = playerID+1;

            }else if(playerID == 2 && this.numPlayer == 3)
            {
                pos = playerID + 1;
            }
            if(goldPosition[pos].flipX == -1)
            {
                deltaX = -26*i;
                deltaY = 16*i;
            }


            var posX = goldPosition[pos].x - deltaX;
            var posY = goldPosition[pos].y - deltaY;

            // lists:[1,2,3,4]
            for(var j = 0; j < goldConfig[rate].lists[i]; ++j)
            {
                if(goldPosition[pos].flipX == -1)
                {
                    this.ListPlayerGold[playerID][i][j].setPosition(posX - 10*j ,posY + 18*j);
                }else
                {
                    this.ListPlayerGold[playerID][i][j].setPosition(posX +10*j ,posY + 18*j);
                }

                this.ListPlayerGold[playerID][i][j].setVisible(true);
                this.ListPlayerGold[playerID][i][j].setFlippedX(goldPosition[pos].flipX);
            }

        }

    },
    rePositionMoney: function (rate, playerID) {
        for(var i = 0; i < moneyPlayerConfig[rate].lists.length; ++i)
        {
            var pos = playerID;
            var deltaX = 26*i;
            var deltaY = 16*i;
            if(playerID == 1 && this.numPlayer == 2)
            {
                pos = playerID+1;

            }else if(playerID == 2 && this.numPlayer == 3)
            {
                pos = playerID + 1;
            }

            if(moneyPosition[pos].flipX == -1)
            {
                deltaX = -26*i;
                deltaY = 16*i;
            }
            var posX = moneyPosition[pos].x - deltaX;
            var posY = moneyPosition[pos].y - deltaY;
            for(var j = 0; j < moneyPlayerConfig[rate].lists[i]; ++j)
            {

                this.ListPlayerMoney[playerID][i][j].setPosition(posX ,posY + 8*j);
                this.ListPlayerMoney[playerID][i][j].setVisible(true);
                this.ListPlayerMoney[playerID][i][j].setFlippedX(moneyPosition[pos].flipX);
            }
        }
    },
});