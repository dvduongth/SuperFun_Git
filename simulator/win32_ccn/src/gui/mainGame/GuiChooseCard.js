/**
 * Created by GSN on 8/7/2015.
 */

var COUNT_DOWN_TIME = 3;

var Card = ccui.Button.extend({
    playerSelected : -1,
    isFlipped : false,
    numberImage: null,
    cardDescription: null,

    ctor : function(){
        this._super();
        this.setCascadeOpacityEnabled(true);
    },

    setSelectAble : function(enable){
        this.setTouchEnabled(enable);
    },

    flipCard : function(success){
        this.isFlipped = true;

        var _this = this;
        this.runAction(cc.sequence(
            cc.orbitCamera(0.25, 1, 0, 0, 90, 0, 0),
            cc.callFunc(function(){
                var backgroundRes = "chooseCard_open_" + (success?0:1) + ".png";
                _this.loadTextureNormal(backgroundRes, ccui.Widget.PLIST_TEXTURE);
            }),
            cc.orbitCamera(0.25,1,0,-90,90,0,0)
        ));
        fr.Sound.playSoundEffect(resSound.g_card_select);
    }
});

var GuiChooseCard = BaseGui.extend({
    countRemain : 0,
    isCountDowning : false,
    cardList : null,
    selectedCard: false,
    success : false,

   ctor: function(winnerIndex, mineIndex, numberPlayer){
       this._super(res.ZCSD_GUI_CHOOSE_CARD);
       this.success = (winnerIndex == mineIndex);
       cc.log("GuiChooseCard: " + this.success);
       this.initCardList(numberPlayer);
       this.setFog(true);

       fr.Sound.playMusic(resSound.g_prepare);

       this.selectedCard = false;
   },

    onExit: function(){
        this._super();
        fr.Sound.stopMusic();
    },

    initCardList : function(numberCard){
        this.cardList= [numberCard];
        for(var i=0; i< numberCard; i++) {
            this.cardList[i] = new Card();
            this.cardList[i].loadTextureNormal("chooseCard_close.png", ccui.Widget.PLIST_TEXTURE);
            this.cardList[i].addClickEventListener(this.onPlayerSelectCard.bind(this));
            this.cardList[i].setPosition(cc.winSize.width*(i+0.5)/(numberCard), cc.winSize.height / 2);
            this.addChild(this.cardList[i]);

            this.cardList[i].setScale(0);
            this.cardList[i].runAction(cc.spawn(
                cc.fadeIn(0.2),
                cc.sequence(
                    cc.scaleTo(0.1, 1.2, 1.2),
                    cc.scaleTo(0.1, 0.85, 0.85),
                    cc.scaleTo(0.1, 1.0, 1.0)
                )
            ));
        }
    },

    onPlayerSelectCard : function(card){
        this.setSelectAbleCards(false);
        this.selectedCard = true;
        card.flipCard(this.success);

    },

    moveCards: function(){
        var _this = this;
        this.setFog(false);
        this._rootNode.getChildByName("node_title").setVisible(false);
        for (var i=0; i<this.cardList.length; i++){
            var card = this.cardList[i];
            if (card.cardDescription)
                card.cardDescription.setVisible(false);
            var destination = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).getAvatarPosAtStandPos(i, true);
            card.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.5, 0.35,0.35),
                    cc.moveTo(0.5, destination.x, destination.y).easing(cc.easeExponentialIn())
                    //cc.rotateBy(0.5, Math.floor(MathUtil.getDistance(card.getPosition(), destination)/50)*360)
                ),
                cc.callFunc(function(card){
                    card.runAction(cc.sequence(cc.fadeOut(1.0), cc.callFunc(function(){ _this.destroy()})));
                }.bind(card))
            ));
        }
    },

    onEnter : function(){
        this._super();
        this.startCountDown(COUNT_DOWN_TIME);
    },

    startCountDown : function(timeCount){
        this.countRemain=timeCount;
        this.schedule(this.onCount, 1.0);
    },

    onCount : function(dt){
        this.countRemain--;

        if (this.countRemain<=0){
            this.unschedule(this.onCount);
            this.setSelectAbleCards(false);
            this.destroy();

            gv.matchMng.prepareForStartGame();
        }
        else if(this.countRemain<=1){
            if (!this.selectedCard) {
                var cardRandom =  this.cardList[MathUtil.randomBetweenFloor(0, this.cardList.length - 1)];
                this.onPlayerSelectCard(cardRandom);
            }
        }
    },

    setSelectAbleCards : function(enable){
        for(var i=0; i< this.cardList.length; i++){
            this.cardList[i].setSelectAble(enable);
        }
    },

    getPlayerSelectedCard : function(cardIndex){
        cc.assert(cardIndex>=0 && cardIndex <= this.cardList.length, "getPlayerSelectedCard : Invalid card index");
        return this.cardList[cardIndex].playerSelected;
    },
});