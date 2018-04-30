/**
 * Created by CPU11674-local on 2/18/2016.
 */


var YELLOW_FRAME_NAME       =   "username_yellowbg";
var GREEN_FRAME_NAME        =   "username_greenbg";
var BLUE_FRAME_NAME         =   "username_bluebg";
var RED_FRAME_NAME          =   "username_redbg";
var RIGHT_SIDE              =   "right_side";
var LEFT_SIDE               =   "left_side";
var LEFT_CURTAIN            =   "rem_2";
var RIGHT_CURTAIN           =   "rem_1";
var WATCH                   =   "watch";
var EFFECT_MINI_GAME_TAG    =   111;
var INTRODUCTION            =   "introduction";
var WIN_LOSE_INFO           =   "winLoseInfo";
var WIN_MONEY_LABEL         =   "winMoneyLabel";
var LOSE_MONEY_LABEL        =   "loseMoneyLabel";
var WAIT_OPPONENT           =   "waitOpponent";
var WIN_LOSE_INFO_HOST      =   "winLoseInfoHost";
var WIN_COLOR_TEXT          = cc.color(238, 183, 105, 255);
var LOSE_COLOR_TEXT         = cc.color(255, 90, 65, 255);
var HINT_BG                 =   "hintBg";
var ZODER_EFF               = 1000;

var Side = {
    RIGHT_SIDE: 1,
    LEFT_SIDE: 2,
};


var CoinDirection = {
    UP:1,
    BOTTOM:2,
};
var GuiMiniGame = BaseGui.extend({

    yellowFrame:null,//Sprite
    greenFrame:null,//Sprite
    blueFrame:null,//Sprite
    redFrame:null,//Sprite
    rightSide:null,//Sprite
    leftSide:null,//Sprite
    leftCurtain:null,//Sprite
    rightCurtain:null,//Sprite
    hasResult:null,//boolean
    effect_minigame: null,//animation
    mySelection:null,//Sprite
    hostSelection:null,//Sprite
    isShowLastEff:null,//Boolean
    watch:null,//Sprite
    timer:null,//Number
    timerLabel:null,//LabelBMFont
    introduction:null,//Sprite
    winLoseInfo:null,//Sprite
    winLoseInfoHost:null,//Sprite
    waitOpponent:null,//sprite
    hintLabel:null,//Label
    hintBg:null,//Sprite
    background:null,//Sprite

    ctor: function(){
        this._super(res.ZCSD_GUI_MINI_GAME);
        this.setScale(1.2);

        this.hasResult = false;
        this.isShowLastEff = false;

        this.background = this._rootNode.getChildByName("background");
        this.yellowFrame = this.background.getChildByName(YELLOW_FRAME_NAME);
        this.yellowFrame.setVisible(false);
        this.greenFrame = this.background.getChildByName(GREEN_FRAME_NAME);
        this.greenFrame.setVisible(false);

        this.blueFrame = this.background.getChildByName(BLUE_FRAME_NAME);
        this.blueFrame.setVisible(false);

        this.redFrame = this.background.getChildByName(RED_FRAME_NAME);
        this.redFrame.setVisible(false);

        this.rightSide = this.background.getChildByName(RIGHT_SIDE);
        this.rightSide.setVisible(false);

        this.leftSide = this.background.getChildByName(LEFT_SIDE);
        this.leftSide.setVisible(false);

        this.watch = this.background.getChildByName(WATCH);
        this.watch.setVisible(false);

        this.effect_minigame = fr.AnimationMgr.createAnimationById(resAniId.eff_minigame);
        this.effect_minigame.setPosition(410, 270);
        this.effect_minigame.setTag(EFFECT_MINI_GAME_TAG);
        this.effect_minigame.setVisible(false);
        this.background.addChild(this.effect_minigame, ZODER_EFF);


        this.timer = GameUtil.getTimeAuto(TimeoutConfig.MINIGAME_TIMEOUT + 1);


        this.hintBg = this.background.getChildByName(HINT_BG);
        this.hintBg.setVisible(false);

        this.introduction = this.background.getChildByName(INTRODUCTION);
        this.winLoseInfo = this.background.getChildByName(WIN_LOSE_INFO);
        this.winLoseInfoHost = this.background.getChildByName(WIN_LOSE_INFO_HOST);

        if(MY_INDEX == gv.matchMng.minigameMgr.miniGameHostIndex)
        {
            this.introduction.getChildByName(WIN_MONEY_LABEL).setString(StringUtil.toMoneyString(gv.matchMng.minigameMgr.moneyPay));
            this.introduction.getChildByName(LOSE_MONEY_LABEL).setString(StringUtil.toMoneyString(-gv.matchMng.minigameMgr.moneyPay));
            this.winLoseInfo.setVisible(false);
            this.initWinLoseInfoForHost();
        }
        else{
            this.introduction.getChildByName(WIN_MONEY_LABEL).setString(StringUtil.toMoneyString(gv.matchMng.minigameMgr.moneyPay));
            this.introduction.getChildByName(LOSE_MONEY_LABEL).setString(StringUtil.toMoneyString(-gv.matchMng.minigameMgr.moneyPay));
            if(this.winLoseInfoHost == null){
                cc.log("null");
            }
            this.winLoseInfoHost.setVisible(false);
            this.winLoseInfo.getChildByName(WIN_MONEY_LABEL).setString(StringUtil.toMoneyString(gv.matchMng.minigameMgr.moneyPay));
            this.winLoseInfo.getChildByName(LOSE_MONEY_LABEL).setString(StringUtil.toMoneyString(-gv.matchMng.minigameMgr.moneyPay));
        }

        this.waitOpponent = this.background.getChildByName(WAIT_OPPONENT);
        this.waitOpponent.setVisible(false);

        //Tao hieu ung Gui bung ra
        //var rootNodeMoveTo = cc.moveBy(0, cc.p(this.background.getContentSize().width/2, this.background.getContentSize().height/2));
        var rootNodeScaleToSmall = cc.scaleTo(0, 0);
        var rootNodeScaleToBig = cc.scaleTo(0.5, 1).easing(cc.easeBackOut());
        var showGuiCallBack = cc.callFunc(this.openCurtain.bind(this));
        this.background.runAction(cc.sequence(rootNodeScaleToSmall, rootNodeScaleToBig, showGuiCallBack));
    },

    //Thong tin ve so tien duoc thua neu thang thua
    initWinLoseInfoForHost:function(){
        if(this.winLoseInfoHost == null)
           return;
        var posStart = cc.p(60, 15);

         var arr = gv.matchMng.minigameMgr.calculateMoneyCaseForHost();
        for(var i = 0; i < arr.length; i++){
            var money = 0;
            var arrTemp = arr[i];
            for(var j = 0; j < arrTemp.length; j++){
                var sp;
                if(arrTemp[j] > 0){
                    sp = fr.createSprite(res.RIGHT);
                }
                else{
                    sp = fr.createSprite(res.WRONG);
                }
                sp.setPosition(posStart.x + j * 20, posStart.y + i * 29);
                this.winLoseInfoHost.addChild(sp);
                money += arrTemp[j];
            }

            var labelMoney = new ccui.Text(StringUtil.toMoneyString(money), res.FONT_GAME_BOLD, 16);
            if(money < 0){
                labelMoney.setColor(LOSE_COLOR_TEXT);
            }
            else{
                labelMoney.setColor(WIN_COLOR_TEXT);
            }
            labelMoney.setPosition(150, posStart.y + i * 30);
            this.winLoseInfoHost.addChild(labelMoney);
        }
    },

    //Tao hieu ung mo rem
    openCurtain: function(){
        cc.log("gui minigame->openCurtain");
        var curtainAct = cc.scaleTo(1, 0, 1).easing(cc.easeInOut(2));
        var curtainCallBack = cc.callFunc(this.onFinishOpenCurtain.bind(this));
        this.leftCurtain = this.background.getChildByName(LEFT_CURTAIN);
        this.leftCurtain.runAction(curtainAct);
        this.rightCurtain = this.background.getChildByName(RIGHT_CURTAIN);
        this.rightCurtain.runAction(cc.sequence(curtainAct.clone(), cc.delayTime(0.5), curtainCallBack));
    },


    //Ket thuc hieu ung mo rem
    onFinishOpenCurtain:function(){
        cc.log("gui minigame->onFinishOpenCurtain");
        this.background.removeChild(this.leftCurtain);
        this.background.removeChild(this.rightCurtain);
        this.background.removeChild(this.introduction);

        var host = gv.matchMng.minigameMgr.miniGameHostIndex;
        this.initAllPlayerFrame();

        //init nguoi choi chinh
        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(MY_INDEX);
        if(player.playerStatus.gold > 0){
            this.initPlayer(MY_INDEX, cc.p(410, 70), this.playEffectShowMoney.bind(this));
            this.getFrameByIndexPlayer(MY_INDEX).setLocalZOrder(ZODER_EFF + 1);
        }
        else{//Truong hop minh het tien
            gv.matchMng.minigameMgr.isFinishMyOption = true;
            this.showHostSelection();
        }

        //init nhung nguoi choi con lai
        if(host == MY_INDEX) {
            this.masterInit(host);
        }
        else {
            this.slaveInit(host);
        }
    },


    //Get khung avatar cua nguoi choi
    getFrameByColor: function (colorConstant) {
        switch(colorConstant){
            case PlayerColor.GREEN:
                return this.greenFrame;
            case PlayerColor.BLUE:
                return this.blueFrame;
            case PlayerColor.RED:
                return this.redFrame;
            case PlayerColor.YELLOW:
                return this.yellowFrame;
        }
    },

    //Get khung avatar cua nguoi choi
    getFrameByIndexPlayer: function (playerIndex) {
        var color = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerColor;
        return this.getFrameByColor(color);
    },


    //Di chuyen khung avatar cua nguoi choi co playerIndex toi vi tri position
    initPlayer :function(playerIndex, position, callback){
        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        if(player.playerStatus.gold <= 0) return;
        var frame = this.getFrameByColor(player.playerColor);
        frame.setVisible(true);
        cc.log("initPlayer: playerIndex = " + playerIndex + ", pos = " + position.x + ", " + position.y);
        var frameMoveAct = cc.moveTo(0.7, position).easing(cc.easeBackOut());
        if(callback != undefined){
            var callbackFunc = cc.callFunc(callback);
            frame.runAction(cc.sequence(frameMoveAct,callbackFunc));
        }
        else{
            frame.runAction(frameMoveAct);
        }
    },

    //Khoi tao tat ca cac khung avatar o 4 vi tri goc man hinh
    initAllPlayerFrame : function () {
        var initPosArr = [cc.p(900, 43), cc.p(900, 560), cc.p(-97, 460),cc.p(-97, 43)];
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        for(var i = 0; i < playerList.length; i++){
            var player = playerList[i];
            var frame = this.initPlayerFrame(player.playerIndex);
            frame.setPosition(initPosArr[player.standPos]);
            frame.setVisible(true);
        }
    },

    //Add avatar, name, profile vao khung avatar
    initPlayerFrame: function(playerIndex){
        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var frame = this.getFrameByColor(player.playerColor);

        //avatar
        var av = new fr.Avatar(player.playerStatus.avatarUrl, AvatarShape.SQUARE);
        av.setScale(0.85);
        av.setPosition(frame.getChildByName("avatar").getPosition());
        frame.addChild(av);

        //display name
        var displayName = frame.getChildByName("name");
        displayName.setString(StringUtil.limitWordNumber(player.playerStatus.name, 12));
        return frame;
    },


    //Khoi tao player trong truong hop minh la chu phong
    masterInit: function(host){
        cc.log("gui minigame-->masterInit");
        var playerList = gv.matchMng.minigameMgr.joinList;
        var posArr = [];
        posArr[0] = [cc.p(410, 360)];
        posArr[1] = [cc.p(260, 360), cc.p(560, 360)];
        posArr[2] = [cc.p(190, 350), cc.p(410, 360), cc.p(630, 350)];
        var numberPlayer = playerList.length;
        var index = numberPlayer - 2;//Tru 1 thang nguoi choi index = 0, tru them 1 vi length va index chenh lech nhau 1
        var j = 0;
        for(var i in playerList)
        {
            var playerIndex = playerList[i];
            cc.log("masterInit: player index = " + playerIndex);
            if(playerIndex != MY_INDEX){
                cc.log("masterInit: init= " + playerIndex);
                this.initPlayer(playerIndex, posArr[index][j++]);
            }
        }
    },

    //Khoi tao player trong truong hop minh khong phai la chu phong
    slaveInit: function(host){
        cc.log("gui minigame-->slaveInit");
        this.initPlayer(host, cc.p(410, 360));
        var posArr = [cc.p(190, 80), cc.p(630, 80)];
        var playerList =  gv.matchMng.minigameMgr.joinList;

        //Khoi tao 2 nguoi choi con lai(tru nguoi choi index = 0, va nguoi choi index = playerIndex)
        var j = 0;
        for(var i in playerList)
        {
            var index = playerList[i];
            cc.log("slaveInit: player index = " + index);
            if(index != host && index != MY_INDEX){
                cc.log("slaveInit: init " + index);
                this.initPlayer(index, posArr[j++]);
            }
        }
    },


    //Effect 2 dong tien tu tu xuat hien de nguoi choi bat dau chon
    playEffectShowMoney:function(){
        cc.log("gui minigame->playEffectShowMoney");
        this.effect_minigame.getAnimation().gotoAndPlay("main_start", 0, -1, 1);
        this.effect_minigame.setCompleteListener(this.addListenerToSides.bind(this));
        this.effect_minigame.setVisible(true);

        this.hintBg.setVisible(true);
        this.hintBg.setLocalZOrder(ZODER_EFF);
        if(MY_INDEX == gv.matchMng.minigameMgr.miniGameHostIndex){
            var strHost = "Chọn đồng xu Vàng hoặc Bạc, Bạn sẽ thắng nếu đối thủ đoán sai";
            this.hintLabel = new ccui.Text(strHost, res.FONT_GAME_BOLD, 18);
        }
        else{
            var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(gv.matchMng.minigameMgr.miniGameHostIndex);
            var strPlayer = "Để thắng hãy đoán đúng đồng xu đã chọn của " + player.playerStatus.name;
            this.hintLabel = new ccui.Text(strPlayer, res.FONT_GAME_BOLD, 18);
        }
        this.hintLabel.setColor(WIN_COLOR_TEXT);
        this.hintLabel.enableOutline(cc.BLACK);
        this.hintLabel.setPosition(this.hintBg.getPosition());
        this.background.addChild(this.hintLabel, ZODER_EFF);

    },

    countDownTime:function(){
        cc.log("gui minigame->playEffectShowMoney");
        this.watch.setVisible(true);
        this.timer--;
        cc.log("gui minigame->playEffectShowMoney->timer: " + this.timer);
        if(this.timerLabel == null){
            this.timerLabel = cc.LabelBMFont(this.timer.toString(), "res/fonts/30.fnt");
            this.timerLabel.setPosition(this.watch.getPosition());
            this.background.addChild(this.timerLabel);
        }
        else{
            this.timerLabel.setString(this.timer.toString());
        }
        if(this.timer <= 0)
        {
            //Auto select
            cc.log("gui minigame->playEffectShowMoney->auto select");
            this.chooseSideClick(Math.floor(Math.random()*2 + 1));
        }
    },

    //Khoi tao cac  mat dong tien
    addListenerToSides: function(){
        cc.log("gui minigame-->addListenerToSides");

        this.rightSide.setVisible(true);
        this.leftSide.setVisible(true);


        //Reconnect
        if( gv.matchMng.minigameMgr.reconnectData != null)
        {
            var myOpt = gv.matchMng.minigameMgr.reconnectData[MY_INDEX];
            if(myOpt != undefined && myOpt != 0)
            {
                this.chooseSideClick(myOpt);
            }
            else{
                this.chooseSideClick(Math.floor(Math.random()*2 + 1));
            }
            return;
        }

        this.schedule(this.countDownTime, 1, TimeoutConfig.MINIGAME_TIMEOUT);

        //Add su kien touch vao cac mat
        var listener =cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height);
                if(cc.rectContainsPoint(rect, locationInNode))
                {
                    if(target == this.rightSide)
                    {
                        this.chooseSideClick(Side.RIGHT_SIDE);
                    }
                    else{
                        this.chooseSideClick(Side.LEFT_SIDE);
                    }
                    return true;
                }
                return false;
            }.bind(this)
        });

        cc.eventManager.addListener(listener, this.rightSide);
        cc.eventManager.addListener(listener.clone(), this.leftSide);
    },


    //chon 1 mat dong xu
    chooseSideClick : function (side) {
        var selection = gv.matchMng.minigameMgr.selectionList[MY_INDEX];
        if(selection == side || selection != -1) return;
        cc.log("guiminigame->chooseSideClick: " + side);
        //xoa timer
        this.unschedule(this.countDownTime);
        if(this.watch != null){
            this.watch.setVisible(false);
        }
        if(this.timerLabel != null){
            this.timerLabel.setVisible(false);
        }

        if(this.hintBg != null)
        {
            this.hintBg.setVisible(false);
        }

        if(this.hintLabel != null){
            this.hintLabel.setVisible(false);
        }

        this.leftSide.setVisible(false);
        this.rightSide.setVisible(false);

        var hostIndex = gv.matchMng.minigameMgr.miniGameHostIndex;
        if(side == Side.RIGHT_SIDE){
            if(MY_INDEX == hostIndex){
                this.effect_minigame.getAnimation().gotoAndPlay("self_host_choose_gold", 0, -1, 1);
                cc.log("guiminigame->play effect : self_host_choose_gold");
            }
            else{
                this.effect_minigame.getAnimation().gotoAndPlay("self_choose_gold", 0, -1, 1);
                cc.log("guiminigame->play effect : self_choose_gold");

            }
            this.mySelection = this.rightSide;
        }
        else{
            if(MY_INDEX == hostIndex){
                this.effect_minigame.getAnimation().gotoAndPlay("self_host_choose_silver", 0, -1, 1);
                cc.log("guiminigame->play effect : self_host_choose_silver");

            }
            else{
                this.effect_minigame.getAnimation().gotoAndPlay("self_choose_silver", 0, -1, 1);
                cc.log("guiminigame->play effect : self_choose_silver");

            }
            this.mySelection = this.leftSide;
        }
        this.effect_minigame.setCompleteListener(this.finishChooseSideEff.bind(this));

        gv.matchMng.minigameMgr.selectionList[MY_INDEX] = side;

        if( gv.matchMng.minigameMgr.reconnectData == null)//Tuc la ko phai dang reconnect
        {
            cc.log("In case not reconect - send to server: myself choose: " + side);
            gv.gameClient.sendMiniGameSelection(side);
        }
        else{//Reconnect nhung minh chua chon mat nao
            var myOpt = gv.matchMng.minigameMgr.reconnectData[MY_INDEX];
            if(myOpt === undefined || myOpt == null ||  myOpt == 0){
                cc.log("Reconecting - send to server: myself choose: " + side);
                gv.gameClient.sendMiniGameSelection(side);
            }
            else{
                cc.log("server choose for me: " +  myOpt);
            }
        }
    },

    //Finish playing effect chon
    finishChooseSideEff: function(){
        cc.log("gui minigame-->finishChooseSideEff");

        gv.matchMng.minigameMgr.isFinishMyOption = true;
        var hostIndex = gv.matchMng.minigameMgr.miniGameHostIndex;
        this.effect_minigame.setVisible(false);
        this.waitOpponent.setVisible(true);
        this.mySelection.setVisible(true);
        if(MY_INDEX == hostIndex) {
            this.mySelection.setPosition(410, 320);
            this.moveMyOptionBackAvatar();
        }
        else{
            this.showHostSelection();
        }
    },


    moveMyOptionBackAvatar:function(){
        if(gv.matchMng.minigameMgr.isAlreadyUpdate() == false)
            return;

        cc.log("gui minigame-->moveMyOptionBackAvatar");

        //Move option cua chinh minh ve vi tri avatar
        var myAvatarFrame = this.getFrameByIndexPlayer(MY_INDEX);
        var myPos = myAvatarFrame.getPosition();
        myPos.y += 30;
        var sideMoveAct = cc.moveTo(0.2, myPos);
        var sideMoveCallBack = cc.callFunc(this.showOtherSelection.bind(this));
        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(MY_INDEX);
        if(player.playerStatus.gold > 0){//check het tien
            this.mySelection.runAction(cc.sequence(sideMoveAct, sideMoveCallBack));
        }
        else{
            this.showOtherSelection();
        }

    },


    showHostSelection:function(){
        if(gv.matchMng.minigameMgr.isAlreadyUpdate() == false)
            return;
        cc.log("gui minigame-->showHostSelection");
        this.waitOpponent.setVisible(false);

        var selection =  gv.matchMng.minigameMgr.selectionList[gv.matchMng.minigameMgr.miniGameHostIndex];

        this.effect_minigame.setVisible(true);
        if(selection == Side.RIGHT_SIDE){
            this.effect_minigame.getAnimation().gotoAndPlay("host_choose_gold", 0, -1, 1);
            this.hostSelection = fr.createSprite(res.COIN_RIGHT_SIDE);
        }
        else{
            this.effect_minigame.getAnimation().gotoAndPlay("host_choose_silver", 0, -1, 1);
            this.hostSelection = fr.createSprite(res.COIN_LEFT_SIDE);
        }
        this.hostSelection.setPosition(407, 305);
        this.hostSelection.setVisible(false);
        this.background.addChild(this.hostSelection);
        this.effect_minigame.setCompleteListener(this.finishShowHostSelection.bind(this));
    },


    finishShowHostSelection : function () {
        cc.log("gui minigame-->finishShowHostSelection");

        //this._rootNode.removeChild(this.effect_minigame);
        this.effect_minigame.setVisible(false);
        this.hostSelection.setVisible(true);

       //Move option cua host ve vi tri avatar
        var hostIndex = gv.matchMng.minigameMgr.miniGameHostIndex;
        var pos = this.getFrameByIndexPlayer(hostIndex).getPosition();
        var selection =  gv.matchMng.minigameMgr.selectionList[hostIndex];
        if(selection == Side.RIGHT_SIDE)
        {
            pos.x -= 140;
        }
        else{
            pos.x += 140;
        }
        pos.y -= 55;
        var sideMoveAct = cc.moveTo(0.2, pos);
        this.hostSelection.runAction(sideMoveAct);

        this.moveMyOptionBackAvatar();
    },


    //Khi tat ca nguoi choi da chon xong thi hien thi su lua chon len
    showOtherSelection: function(){
        if(gv.matchMng.minigameMgr.isAlreadyUpdate() == false)
            return;

        cc.log("gui minigame-->showOtherSelection");

        this.waitOpponent.setVisible(false);

        var playerSelectionList = gv.matchMng.minigameMgr.selectionList;
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        var hasOtherSelection = false;
        for(var i = 0; i < playerList.length; i++){
            var player = playerList[i];
            if(player.playerIndex != MY_INDEX && player.playerIndex != gv.matchMng.minigameMgr.miniGameHostIndex)
            {
                if (playerSelectionList[i] == -1) continue;
                hasOtherSelection = true;
                if(gv.matchMng.minigameMgr.miniGameHostIndex != MY_INDEX){
                    this.addSelectionToAvatarFrame(player, playerSelectionList[i], CoinDirection.UP);
                }
                else{
                    this.addSelectionToAvatarFrame(player, playerSelectionList[i], CoinDirection.BOTTOM);
                }
            }
        }

        //Neu khong co nguoi choi nao khac, chi co host va mih thi hien luon ket qua
        if(hasOtherSelection == false){
            this.showResult();
        }
    },

    //Add ket qua len khung avatar
    //direction = 1 thi add o tren avatar
    //direction = 2 thi add o duoi avatar
    addSelectionToAvatarFrame: function(player, selection, direction){
        var avatarFrame = this.getFrameByColor(player.playerColor);
        var coin;
        if(selection == Side.RIGHT_SIDE) {
            coin = fr.createSprite(res.COIN_RIGHT_SIDE);
        }
        else{
            coin = fr.createSprite(res.COIN_LEFT_SIDE);
        }
        coin.setScale(0.25);
        if(direction == CoinDirection.UP){
            coin.setPosition(avatarFrame.getContentSize().width/2, 60);
        }
        else{
            coin.setPosition(avatarFrame.getContentSize().width/2, -110);
        }

        var scaleCoinToSmall = cc.scaleTo(0, 0);
        var scaleCoinToBig = cc.scaleTo(0.5, 0.25).easing(cc.easeBackOut());
        var coinCallBack = cc.callFunc(this.showResult.bind(this));
        avatarFrame.addChild(coin);
        coin.runAction(cc.sequence(scaleCoinToSmall, scaleCoinToBig, coinCallBack));
    },


    //Hien thi ket qua minigame
    showResult: function(){
        var selectionList = gv.matchMng.minigameMgr.selectionList;
        var host = gv.matchMng.minigameMgr.miniGameHostIndex;
        var playerList = gv.matchMng.playerManager.playerIndex_PlayerInfo;
        var hostPos = this.getFrameByColor(playerList[host].playerColor).getPosition();
        if(this.hasResult == false)
        {
            for(var i = 0; i < selectionList.length; i++){
                if(i != host && selectionList[i] != -1){
                    var pos = this.getFrameByColor(playerList[i].playerColor).getPosition();

                    if(host == MY_INDEX)
                    {
                        //tu tren chi xuong thi dat o vi tri thap hon khung avatar nen phai tru di do cao cua cua khung avatar
                        var newHostPos= cc.p(hostPos.x, hostPos.y - 55);
                        pos.y -= 55;
                        //Chon giong chu phong
                        if(selectionList[i] == selectionList[host]){
                            this.showArrow(res.RED_ARROW, newHostPos, pos);
                            this.showMoney(-gv.matchMng.minigameMgr.moneyPay, newHostPos, pos);
                        }
                        else{//Chon khac chu phong
                            this.showArrow(res.GREEN_ARROW, pos, newHostPos);
                            this.showMoney(gv.matchMng.minigameMgr.moneyPay, pos, newHostPos);
                        }

                    }
                    else{
                        //tu tren chi xuong thi dat o vi tri thap hon khung avatar nen phai tru di do cao cua cua khung avatar
                        var newHostPos= cc.p(hostPos.x, hostPos.y - 55);
                        pos.y -= 55;
                        //Chon giong chu phong
                        if(selectionList[i] == selectionList[host]){
                            this.showArrow(res.GREEN_ARROW, newHostPos, pos);
                            this.showMoney(gv.matchMng.minigameMgr.moneyPay, newHostPos, pos);
                        }
                        else{//Chon khac chu phong
                            this.showArrow(res.RED_ARROW, pos, newHostPos);
                            this.showMoney(-gv.matchMng.minigameMgr.moneyPay, pos, newHostPos);
                        }
                    }

                }
            }
            this.hasResult = true;
        }
    } ,

    showArrow :function(path, fromPos, toPos){
        var arrow = fr.createSprite(path);
        //arrow.setAnchorPoint(0.5, 1);
        var mid = cc.p(fromPos.x + (toPos.x - fromPos.x)/2, fromPos.y + (toPos.y - fromPos.y)/2);
        arrow.setPosition(mid);
        arrow.setRotation(this.calculateAngleForArrow(fromPos, toPos));
        var arrowScaleToSmall = cc.scaleTo(0, 0);
        var arrowScaleToBig = cc.scaleTo(0.5, 1).easing(cc.easeBackOut());
        var arrowScaleCallback = cc.callFunc(this.showLastEff.bind(this));
        arrow.runAction(cc.sequence(arrowScaleToSmall, arrowScaleToBig, cc.delayTime(2), arrowScaleCallback));
        this.background.addChild(arrow);
    },

    showMoney: function(money, fromPos, toPos)
    {
        var moneyPile = fr.createSprite(res.MONEY_PILE);

        var label = new ccui.Text(StringUtil.toMoneyString(money), res.FONT_GAME_BOLD, 32);
        label.enableOutline(cc.BLACK);
        if(money < 0)
        {
            label.setColor(LOSE_COLOR_TEXT);
        }
        else{
            label.setColor(WIN_COLOR_TEXT);
        }
        var mid = cc.p(fromPos.x + (toPos.x - fromPos.x)/2, fromPos.y + (toPos.y - fromPos.y)/2);
        moneyPile.setPosition(mid);
        label.setPosition(mid);
        this.background.addChild(moneyPile);
        this.background.addChild(label);
    },


    //Hien thi effect tong ket truoc khi dong gui
    showLastEff:function(){
        if(this.isShowLastEff == true)
            return;

        this.isShowLastEff = true;

        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(MY_INDEX);
        if(player.playerStatus.gold > 0) {//check het tien
            this.effect_minigame.setVisible(true);
        }
        else{
            this.effect_minigame.setVisible(false);
            this.scheduleOnce(this.close, 1);
        }

        var selectionList = gv.matchMng.minigameMgr.selectionList;
        var money = 0;
        if(MY_INDEX != gv.matchMng.minigameMgr.miniGameHostIndex){
            if(selectionList[MY_INDEX] == selectionList[gv.matchMng.minigameMgr.miniGameHostIndex]){
                this.effect_minigame.getAnimation().gotoAndPlay("main_win", 0, -1, 1);
                money = gv.matchMng.minigameMgr.moneyPay;
            }
            else{
                this.effect_minigame.getAnimation().gotoAndPlay("main_lose", 0, -1, 1);
                money = -gv.matchMng.minigameMgr.moneyPay;
            }
        }
        else{
            money = gv.matchMng.minigameMgr.calculateHostMoney();
            if(money < 0){
                this.effect_minigame.getAnimation().gotoAndPlay("main_lose", 0, -1, 1);
            }
            else{
                this.effect_minigame.getAnimation().gotoAndPlay("main_win", 0, -1, 1);
            }
        }

        //Add so tien
        //var st = StringUtil.normalizeNumber(money)
        var label = new ccui.Text(StringUtil.toMoneyString(money), res.FONT_GAME_BOLD, 60);
        label.enableOutline(cc.BLACK);
        if(money < 0)
        {
            label.setColor(LOSE_COLOR_TEXT);
        }
        else{
            label.setColor(WIN_COLOR_TEXT);
        }
        label.setPosition(408, 220);
        this.background.addChild(label, ZODER_EFF);


        this.effect_minigame.setCompleteListener(function(){
            this.scheduleOnce(this.close, 1);
        }.bind(this));
    },

    degrees : function(rad){
        return rad*(180/Math.PI);
    },

    calculateAngleForArrow: function(fromPos, toPos){
        var angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        angle = -this.degrees(angle);//Do goc rotation nguoi voi goc tinh cua arctan
        angle -= 90;//Do hinh anh cua arrow dung quay xuong khong phai nam
        return angle;
    },

    close:function(){
        this.destroy(DestroyEffects.ZOOM);
        gv.matchMng.minigameMgr.onExitMiniGame();
    },

});