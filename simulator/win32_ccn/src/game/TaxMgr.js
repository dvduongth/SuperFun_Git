var constant_TaxMgr= {
    MAX_MULTI:8,
    MULTI_TAX:2,
    TURN_RESET:20,
    SCALE:0.7
};

var TaxMgr = cc.Class.extend({

    ctor : function(){
        this.listMultiTax = [];     // luu thong so nhan thue cua moi nguoi
        this.listSpriteMultiTax = [];   // luu icon nhan thue cua moi nguoi

    },

    init:function(){
        for(var i=0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
            this.listMultiTax[i] = 1;   // khai bao ti le ban dau la 1
            this.listSpriteMultiTax[i] = null;// sprite tuong ung voi ti le, x2 x4 x8
        }
        //this.turn = 0;                  // luu lai so turn do xuc sac, neu turn do >20 se x 2 lan
        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        this.gold = GameModeConfig.getInstance().getTaxMoney(betLevel);     // load config tien
    },

    addTurn:function(){  // da bo

    },

    getPositionWithStandPos:function(playerIndex){ // lay vi tri de x2 x4 x8 dat o dau trong cac o dat
        var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).standPos;
        //return cc.p(80,63);
        switch (standPos){
            case 1: return cc.p(50,95);
            case 2: return cc.p(50,95);
            case 3: return cc.p(50,95);
            case 0: return cc.p(50,95);
        }
        return cc.p(0,0);
    },

    multiTastWithPlayerIndex:function(playerIndex){     // nhan doi thue
        this.listMultiTax[playerIndex] = this.getMultiTax(this.listMultiTax[playerIndex]);// nhan thue
        if(this.listMultiTax[playerIndex] > 1){
            var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).standPos;
            var value = 0;
            if(standPos==0 || standPos == 2 ) value = 1;

            var homeTile = gv.matchMng.mapper.getTileForSlot(standPos*10);
            var taxSlot = homeTile.display.image.getChildByName("tax");
            taxSlot.setTexture("res/game/mainBoard/home_tile/tax_x" + this.listMultiTax[playerIndex] + "_" +value+".png");
        }

        //if(this.listMultiTax[playerIndex] > 1){// nhan >1 se hien content
        //    if(this.listSpriteMultiTax[playerIndex]){
        //        this.listSpriteMultiTax[playerIndex].removeFromParent();
        //    }
        //    this.listSpriteMultiTax[playerIndex] = this.getSpriteWithMultiTax(this.listMultiTax[playerIndex]);
        //    this.listSpriteMultiTax[playerIndex].setScale(constant_TaxMgr.SCALE,constant_TaxMgr.SCALE);
        //    this.listSpriteMultiTax[playerIndex].setPosition(this.getPositionWithStandPos(playerIndex));
        //    var tile =  gv.matchMng.mapper.getTileForSlot(GameUtil.getHomeGateForPlayer(playerIndex));
        //    tile.display.image.addChild(this.listSpriteMultiTax[playerIndex]);
        //}

        cc.log("multiTastWithPlayerIndex = " + playerIndex + "  value multi  = " + this.listMultiTax[playerIndex]);
    },

    getMultiTax:function(multi){// lay gia tri multi tax
        multi*=constant_TaxMgr.MULTI_TAX;
        if(multi>constant_TaxMgr.MAX_MULTI)
            return constant_TaxMgr.MAX_MULTI;
        return multi
    },

    animationTax:function(summonIndex){// chay animation khi dam vao o tax
        var x2 = fr.AnimationMgr.createAnimationById(resAniId.tile_tax, this);
        x2.getAnimation().gotoAndPlay("run", 0, 1, 2);
        var tile = gv.matchMng.mapper.getTileForSlot(GameUtil.getHomeGateForPlayer(summonIndex));
        x2.setPosition(tile.getStandingPositionOnTile());
        x2.setCompleteListener(function(){
            x2.removeFromParent();
        });
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(x2, MainBoardZOrder.EFFECT);
    },

    activeTax:function(playerIndex,summonIndex,decrease,callback){ // khi nhay vao o thue se goi ham nay.
        this.animationTax(summonIndex);
        var goldChange = this.gold*(1-decrease);
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var goldPlayer = ChangeGoldMgr.getInstance().getAvailableMoneyOfPlayer(playerInfo);
        var goldChangeLast = Math.min(goldPlayer,this.listMultiTax[summonIndex]*goldChange );
        ChangeGoldMgr.getInstance().addChangeGoldElement(playerIndex,-goldChangeLast);
        ChangeGoldMgr.getInstance().addChangeGoldElement(summonIndex,goldChangeLast);

        GameUtil.callFunctionWithDelay(2,function(){
            this.multiTastWithPlayerIndex(summonIndex);
            ChangeGoldMgr.getInstance().activeChangeGoldInfo(callback);

        }.bind(this));
    },

    reconnect:function(listTax){
        this.listMultiTax = listTax;
    },

    getSpriteWithMultiTax:function(value){
        switch (value){
            case 1: return null;
            case 2: return fr.createSprite("res/game/mainBoard/tax/tax_x2.png");
            case 4: return fr.createSprite("res/game/mainBoard/tax/tax_x4.png");
            case 8: return fr.createSprite("res/game/mainBoard/tax/tax_x8.png");
        }
        return null;
    },

    changeMultiTaxWithIndex:function(playerIndex,value){// ham nay goi khi reconect duoc gui ve.
        this.listMultiTax[playerIndex] = value;
        if(this.listMultiTax[playerIndex] > 1){
            var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).standPos;
            var value1 = 0;
            if(standPos==0 || standPos == 2 ) value = 1;
            var homeTile = gv.matchMng.mapper.getTileForSlot(standPos*10);
            var taxSlot = homeTile.display.image.getChildByName("tax");
            taxSlot.setTexture("res/game/mainBoard/home_tile/tax_x" + this.listMultiTax[playerIndex] + "_" +value1+".png");
        }
    }
});