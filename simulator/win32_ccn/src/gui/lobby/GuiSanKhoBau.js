var GiftState = {
    CHEST_1:"CHEST_1",
    NEXT_ROUND_BONUS:"NEXT_ROUND_BONUS",
    GOLD:"GOLD"
};

var TreasureHunting = cc.Class.extend({
    numberAttempToday:-1,
    currentRound:-1,
    roundBonusRate:-1,
    ctor:function(numberAttempToday,currentRound,roundBonusRate){
        this.numberAttempToday = numberAttempToday;
        this.currentRound = currentRound;
        this.roundBonusRate = roundBonusRate;
    }
});
var SanKhoBauStatus = cc.Class.extend({
    // nhan thong tin tu sever tra ve :P
    caseSever:-1,
    treasureHunting:null,

    ctor:function(caseSever,treasureHunting){
        this.caseSever = caseSever;
        this.treasureHunting = treasureHunting;
    }
});


var GuiSanKhoBau = BaseGui.extend({

    ctor: function (sankhobauStatus) {
        this._super(res.ZCSD_GUI_SANKHOBAU);
        this.sankhobauStatus = sankhobauStatus;

        this.currentSlot = this.getCurrentGate(sankhobauStatus.treasureHunting.currentRound);
        this.setPositionCurrentPiece(this.currentSlot);

        //init dice manager
        this.diceManager = new DiceManager();
        this.diceManager.initOneDiceForSpecialEven(0);
        this.diceManager.init3DLayer();
        this.addChild(this.diceManager);

        //init in gui
        this.buttonRollDice = null;
        this.positionAllItem = [];
        this.listMultiGift = [];

        this.savePositionAllItem();
        this.createButtonRollDice();
        this.button_back = this._centerNode.getChildByName("button_back");
        this.button_back.addClickEventListener(function(){
            fr.Sound.playSoundEffect(resSound.m_button_click);
            var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
            guiLobby.setVisible(true);
            this.button_back.setTouchEnabled(false);
            this.guiCheat.destroy();
            this.destroy();
        }.bind(this));

        this.guiCheat = new GuiCheat();
        gv.guiMgr.addGui(this.guiCheat, GuiId.CHEAT, LayerId.LAYER_POPUP);
        this.guiCheat.removeSomeThing();

        //set local zOrder Layer
        var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
        guiPlayerInfo.setLocalZOrder(this.getLocalZOrder()+1);
        var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
        guiLobby.setVisible(false);
    },

    ifFreePlay:function(){
        return this.sankhobauStatus.treasureHunting.numberAttempToday==0;
    },

    resetMultiGift:function(){
        for(var i =0;i<this.listMultiGift.length;i++){
            this.listMultiGift[i].removeFromParent();
        }
        this.listMultiGift = [];
    },

    savePositionAllItem:function(){
        for(var i =0;i<28;i++){
            if(i%7==0){
                this.positionAllItem[i] = cc.p(0,0);
            }else{
                var item = this._centerNode.getChildByName("item_" + i);
                this.positionAllItem[i] = item.getPosition();
            }
        }
    },

    setActionGift:function(){
        for(var i =0;i<28;i++){
            if(i%7!=0){
                var item = this._centerNode.getChildByName("item_" + i);
                item.stopAllActions();
                item.setPosition(this.positionAllItem[i]);
            }
        }
        var distance = 10;
        var time= 0.5;
        for(var i = this.currentSlot+1;i<this.currentSlot+7;i++){
            if(i%7==0) continue;
            //cc.log(i)
            var item = this._centerNode.getChildByName("item_" + i);
            if(i%2==0){
                item.runAction(cc.sequence(
                    cc.moveBy(time,0,distance),
                    cc.moveBy(time,0,distance).reverse()
                ).repeatForever());
            }else{
                item.setPosition(item.getPosition().x,item.getPosition().y+15);
                item.runAction(cc.sequence(
                    cc.moveBy(time,0,distance).reverse(),
                    cc.moveBy(time,0,distance)
                ).repeatForever());
            }

            // can add item x2 x3 vao day :P
            if(this.sankhobauStatus.treasureHunting.roundBonusRate>1){
                var sprite = fr.createSprite("res/game/sankhobau/2.png");
                sprite.setPosition(item.getContentSize().width/2,item.getContentSize().height/2);
                item.addChild(sprite);
                this.listMultiGift.push(sprite);
            }
        }
    },

    createButtonRollDice:function(){
        var size = cc.winSize;
        this.buttonRollDice = new ccui.Button();
        this.buttonRollDice.loadTextureNormal("res/game/sankhobau/BT_do.png",ccui.Widget.LOCAL_TEXTURE);
        this.buttonRollDice.addClickEventListener(this.onButtonRollDiceClick.bind(this));
        this.buttonRollDice.setPosition(size.width*3/4 + 100,size.height/2+20);
        this.addChild(this.buttonRollDice);
        this.setActionGift();

    },

    onButtonRollDiceClick: function(){
        fr.Sound.playSoundEffect(resSound.m_button_click);
        if(this.ifFreePlay()){
            if(this.guiCheat.diceCheat){
                gv.gameClient.sendPacketRollDiceEven(this.guiCheat.getDiceCheatNumber(1));
            }else{
                gv.gameClient.sendPacketRollDiceEven(0);
            }
            this.buttonRollDice.removeFromParent();
            cc.log("CUONG first");
            this.sankhobauStatus.treasureHunting.numberAttempToday++;
            this.addCurrentRound();
        }else{
            // show popup
            // click mat gold :)
            var cost = SpecialEvenConfig.getInstance().getCostFormRound(this.sankhobauStatus.treasureHunting.currentRound+1);
            if(UserData.getInstance().xu>cost){
                UserData.getInstance().xu -=cost;
                gv.guiMgr.getGuiById(GuiId.PLAYER_INFO).reloadInfo();
                if(this.guiCheat.diceCheat){
                    gv.gameClient.sendPacketRollDiceEven(this.guiCheat.getDiceCheatNumber(1));
                }else{
                    gv.gameClient.sendPacketRollDiceEven(0);
                }
                this.buttonRollDice.removeFromParent();
                this.sankhobauStatus.treasureHunting.numberAttempToday++;
                this.addCurrentRound();
            }else{
                this.addChild(new PopupNotEnoughMoney());
            }

        }
    },

    addCurrentRound:function(){
        this.sankhobauStatus.treasureHunting.currentRound++;
        if(this.sankhobauStatus.treasureHunting.currentRound>3){
            this.sankhobauStatus.treasureHunting.currentRound-=3;
        }
    },

    getCurrentGate:function(currentTurn){
        return (currentTurn)*7
    },

    setPositionCurrentPiece:function(slot){
        // slot di tu 1 den 27
        this.currentSlot = slot;
        var slot1 = this._centerNode.getChildByName("slot_" + this.currentSlot);
        this.piece = fr.createSprite("res/game/Horse/blue_horse2.png");
        this._centerNode.addChild(this.piece,1000);
        this.piece.setPosition(slot1.getPosition().x ,slot1.getPosition().y + this.piece.getContentSize().height/2);
        this.flipPiece();
    },

    startAnimationRollDice:function(diceResult){
        this.diceManager.throwDiceForPlayer(0, diceResult,this.onAnimationRollDiceFinish.bind(this));
        //GameUtil.callFunctionWithDelay(2, EffectMgr.getInstance().showDiceNumber.bind(EffectMgr.getInstance(), diceResult, 0));
    },

    onAnimationRollDiceFinish:function(){
        this.jumpToNextSlot(this.diceManager.lastDiceResult.score1,function(){this.receiveGift()}.bind(this));
    },

    enterInTile:function(tileIndex,isOccupy){
        var slot1 = this._centerNode.getChildByName("slot_" + this.currentSlot);
        if (isOccupy){//o cuoi cung
            slot1.runAction(cc.sequence(
                cc.moveBy(0.2, 0, -10),
                cc.moveBy(2.0, 0, 10).easing(cc.easeElasticOut(0.15))
            ));
        }
        else{
            slot1.runAction(cc.sequence(
                cc.moveBy(0.2, 0, -10),
                cc.moveBy(0.2, 0, 10).easing(cc.easeBackOut())
            ));
        }
    },

    flipPiece:function(){
        if(this.isFlip()){
            this.piece.setScale(1,1);
        }else{
            this.piece.setScale(-1,1);
        }
    },

    isFlip:function(){
        return (this.currentSlot<8) || (this.currentSlot<14&&this.currentSlot>10)
            || (this.currentSlot<25&&this.currentSlot>21);
    },

    jumToNextDestination:function(){
        var currentDes = Math.floor(this.currentSlot/7) +1;
        this.jumpToNextSlot(currentDes*7 - this.currentSlot,function(){this.createButtonRollDice()}.bind(this));
    },

    jumpToNextSlot:function(numberDice,callback){
       // cc.log("CUONG: jump to next slot")

        if(numberDice<1){
            // cho nay se goi callback nhan qua :P
            GameUtil.callFunctionWithDelay(0.4,function(){callback();}.bind(this));
            return;
        }
        var _this = this;
        this.currentSlot = (this.currentSlot+1)%28;

        var point = this.getPositionSlot(this.currentSlot);
        var jumpheight = numberDice>1?70:120;
        this.piece.runAction(cc.sequence(
            cc.jumpTo(0.4, point, jumpheight, 1),
            cc.delayTime(0.05),
            cc.callFunc(function(){
                _this.flipPiece();
                _this.enterInTile(_this.currentSlot,numberDice==1);
                _this.jumpToNextSlot(numberDice-1,callback);
            })
        ));
    },

    getPositionSlot:function(slot){
        var slot1 = this._centerNode.getChildByName("slot_" + slot);
        if(slot1%7==0){
            return cc.p(slot1.getPosition().x ,slot1.getPosition().y + this.piece.getContentSize().height/2);
        }
        return cc.p(slot1.getPosition().x,slot1.getPosition().y + this.piece.getContentSize().height/2);
    },

    receiveGift:function(){
        if(this.currentSlot%7==0){
            return;
        }
        var gift = SpecialEvenConfig.getInstance().getEvenOfCurrentSlot(this.currentSlot);
        //var multi = this.sankhobauStatus.treasureHunting.roundBonusRate
        this.addChild(new PopupEven(gift[0],gift[1],this.sankhobauStatus.treasureHunting.roundBonusRate));

        switch (gift[0]){
            case GiftState.CHEST_1:{
                this.sankhobauStatus.treasureHunting.roundBonusRate = 1;
                break;
            }
            case GiftState.NEXT_ROUND_BONUS:{
                this.sankhobauStatus.treasureHunting.roundBonusRate*= gift[1];
                break;
            }
            case GiftState.GOLD:{
                this.sankhobauStatus.treasureHunting.roundBonusRate = 1;
                break;
            }
        }
        this.resetMultiGift();
    },

    destroy:function(){
        this.diceManager.cleanUp();
        this.diceManager = null;
        this._super();
    }
});

var PopupNotEnoughMoney = BasePopup.extend({
    ctor: function(){
        this._super();
        this.loadData();
    },

    loadData:function(){
        var bg = fr.createSprite("res/lobby/popup_bg.png");
        bg.setScale(0.8);
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);

        var notiText = fr.createSprite("res/lobby/notification_text.png");
        notiText.setPosition(bg.getContentSize().width/2, bg.getContentSize().height-35);
        bg.addChild(notiText);

        var closeBtn = fr.createSimpleButton("res/button/x.png", ccui.Widget.LOCAL_TEXTURE);
        closeBtn.setPosition(bg.getContentSize().width - 25, bg.getContentSize().height - 30);
        closeBtn.addClickEventListener(function(){
            fr.Sound.playSoundEffect(resSound.m_button_click);
            this.setTouchEnable(false);
            this.destroy();
        }.bind(this));
        bg.addChild(closeBtn);

        var okBtn = fr.createSimpleButton("res/lobby/btn_ok.png", ccui.Widget.LOCAL_TEXTURE);
        okBtn.setPosition(bg.getContentSize().width/2,80);
        okBtn.addClickEventListener(function(){
            fr.Sound.playSoundEffect(resSound.m_button_click);
            this.setTouchEnable(false);
            this.destroy();
        }.bind(this));
        bg.addChild(okBtn);

        var notificationLabel = new ccui.Text("Không đủ tiền :)", res.FONT_GAME_BOLD, 28);
        notificationLabel.setColor(BaseGui.TEXT_COLOR_BROWN);
        //notificationLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        notificationLabel.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height / 2);
        bg.addChild(notificationLabel);
    }
});

var PopupEven = BasePopup.extend({

    ctor: function(text1,text2,multi){
        this._super();
        this.loadData(text1,text2,multi);
    },

    loadData:function(text1,text2,multi){
        var bg = fr.createSprite("res/lobby/popup_bg.png");
        bg.setScale(0.8);
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);

        var notiText = fr.createSprite("res/lobby/notification_text.png");
        notiText.setPosition(bg.getContentSize().width/2, bg.getContentSize().height-35);
        bg.addChild(notiText);

        var closeBtn = fr.createSimpleButton("res/lobby/X2.png", ccui.Widget.LOCAL_TEXTURE);
        closeBtn.setPosition(bg.getContentSize().width - 25, bg.getContentSize().height - 30);
        closeBtn.addClickEventListener(function(){fr.Sound.playSoundEffect(resSound.m_button_click); this.destroy()}.bind(this));
        bg.addChild(closeBtn);

        var okBtn = fr.createSimpleButton("res/lobby/btn_ok.png", ccui.Widget.LOCAL_TEXTURE);
        okBtn.setPosition(bg.getContentSize().width/2,80);
        okBtn.addClickEventListener(function(){fr.Sound.playSoundEffect(resSound.m_button_click); this.destroy()}.bind(this));
        bg.addChild(okBtn);

        var notificationLabel = new ccui.Text(this.getText(text1,text2,multi), res.FONT_GAME_BOLD, 28);
        notificationLabel.setColor(BaseGui.TEXT_COLOR_BROWN);
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        notificationLabel.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height / 2);
        bg.addChild(notificationLabel);
    },

    getText:function(text1,text2,multi){
        if(multi>1){
            return text1 + "     " + text2 +" x " + multi;
        }
        return text1 + "     " + text2;
    },

    destroy: function(){
        this._super();
        gv.guiMgr.getGuiById(GuiId.GUI_SANKHOBAU).jumToNextDestination();
    }
});