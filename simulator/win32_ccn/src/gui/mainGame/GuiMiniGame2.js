var constant_MiniGame_2 ={
    BUTTON_RED:"res/game/MiniGame2/btred00.png",
    MOVE_BUTTON_RED:"res/game/MiniGame2/btred01.png",
    LOCK_BUTTON_RED:"res/game/MiniGame2/btred03.png",

    BUTTON_BLACK:"res/game/MiniGame2/btblack00.png",
    MOVE_BUTTON_BLACK:"res/game/MiniGame2/btblack01.png",
    LOCK_BUTTON_BLACK:"res/game/MiniGame2/btblack03.png",

    BUTTON_STOP:"res/game/MiniGame2/btstop00.png",
    MOVE_BUTTON_STOP:"res/game/MiniGame2/btstop01.png",
    LOCK_BUTTON_STOP:"res/game/MiniGame2/btstop03.png",

    SPRITE_CHOSEN_GOLD:"res/game/MiniGame2/Layer 267 copy 2.png",
    WIN_SPRITE:"res/game/MiniGame2/FX_Thang.png",
    LOSE_SPRITE:"res/game/MiniGame2/FX_Thua.png",
    CLOCK:"res/game/MiniGame2/clock.png",
    BACKGROUND_DRAW_NAME:"res/game/MiniGame2/12345.png",
    MAX_TIME : 10
};

var constant_Information = {
    MID_GOLD_MULTI :2,
    MAX_GOLD_MULTI :3,

    SEND_MIN_GOLD:1,
    SEND_MID_GOLD:2,
    SEND_MAX_GOLD:3,

    BUTTON_STOP:0,
    BUTTON_RED:1,
    BUTTON_BLACK:2,

    MAX_ROUND:3,
    ICON_IN_ROUND:3
};

var GuiMiniGame2 = BaseGui.extend({

    ctor:function(minGold,playerIndex, playerCurrentGold) {
        this._super(res.ZCSD_GUI_MINIGAME2);
        this.isMyPlay= false;
        this.time = 10;
        if(playerIndex==0){
            this.isMyPlay = true;
        }
        if(this.isMyPlay){
            this.time = GameUtil.getTimeAuto(constant_MiniGame_2.MAX_TIME);
        }else{
            this.time = 10;
        }
        this.buttonStop = null;
        this.buttonBlack = null;
        this.buttonRed = null;
        this.labeText= null;
        this.labelMultilMoney = null;
        this.isPlayed = false;
        this.isCircle = false;
        this.count = 0;
        this.boolPlayerClick = false;
        this.boolSeverReturn = false;

        this.background = this._centerNode.getChildByName("BGmask_1");
        this.listIconHorse = [];
        this.animLight = null;

        this.playerCurrentGold = playerCurrentGold;
        this.minGold = minGold;
        this.maxGold = this.minGold*constant_Information.MAX_GOLD_MULTI;
        this.moveGold = this.minGold*constant_Information.MID_GOLD_MULTI;
        this.currentChosenGold = this.minGold;

        for(var i =0;i<constant_Information.MAX_ROUND;i++){
            this.listIconHorse[i] = [];
            for (var j=0;j<constant_Information.ICON_IN_ROUND;j++){
                this.listIconHorse[i][j] = null;
            }
        }

        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.createActionCompleteRoll(false,1);
        this.createActionCompleteRoll(false,2);
        this.createActionCompleteRoll(true,3);
        this.createNonClickButtonStop();
        this.Create_Button_Black();
        this.Create_Button_Red();
        this.drawTime();
        this.Create_List_Numbet_Count();
        this.Create_Min_Max_Gold();
        this.createLabelChosenGold();
        this.Create_New_Multi_Money();
        this.Action_ChosenGold(constant_Information.SEND_MIN_GOLD);
        if(!this.isMyPlay){
            this.Draw_Popup_NoPlay(playerIndex);
        }
        this.schedule(this.update,1);
    },

    createLabelChosenGold:function(){
        var node1 = this.background.getChildByName("node_bet_1").getPosition();
        this.spriteChosenGold = fr.createSprite(constant_MiniGame_2.SPRITE_CHOSEN_GOLD);
        this.spriteChosenGold.setPosition(node1);
        this.background.addChild(this.spriteChosenGold);

        this.labelChosenGold = new ccui.Text(this.Preprocessing_Money(this.moveGold),"res/fonts/unicode.revueb.ttf", 30);
        this.labelChosenGold.setPosition(this.spriteChosenGold.getContentSize().width/2,this.spriteChosenGold.getContentSize().height/2);
        this.labelChosenGold.setColor(cc.color(255, 255, 11));
        this.spriteChosenGold.addChild(this.labelChosenGold);
    },

    Create_List_Numbet_Count:function(){
        if(this.count<3){
            var sizeBackground = this.background.getChildByName("node_turn").getPosition();
            if(this.labeText!=null){
                this.labeText.removeFromParent();
            }
            this.labeText = new ccui.Text("Lần " + (this.count+1), "Arial", 30);
            this.labeText.setColor(cc.color(0,0,0));
            this.labeText.setAnchorPoint(0,0.5);
            this.labeText.setPosition(sizeBackground);
            this.background.addChild(this.labeText);
        }
    },

    createNonClickButtonStop:function(){
        var nodeButtonStop = this.background.getChildByName("node_button_stop");
        this.buttonStop = fr.createSprite(constant_MiniGame_2.LOCK_BUTTON_STOP);
        this.buttonStop.setPosition(nodeButtonStop.getPosition());
        this.background.addChild(this.buttonStop);
    },

    drawTime:function(){
        //Draw time
        var nodetime = this.background.getChildByName("node_time");
        var clock = fr.createSprite(constant_MiniGame_2.CLOCK);
        clock.setPosition(nodetime.getPosition());
        this.background.addChild(clock);
        this.labeltime = new ccui.Text(this.time,"Arial", 30);
        this.labeltime.setPosition(clock.getContentSize().width/2-1,clock.getContentSize().height/2+1);
        this.labeltime.setColor(cc.color(0,0,0));
        clock.addChild(this.labeltime);
        this.boolSeverReturn = false;
    },

    // cai nay bay gio chinh la actionRotation
    Action_Rotation:function(){
        this.buttonStop.removeFromParent();
        this.createNonClickButtonStop();
        this.createAnimLight();
        this.removeIconSprite(0);
        this.removeIconSprite(1);
        this.removeIconSprite(2);

        this.isPlayed = true;
        this.isCircle = true;
        this.count++;

        var node1 = this.background.getChildByName("node"+ 1 +"_2");
        var animRoll1  = fr.AnimationMgr.createAnimationById(resAniId.minigame1_fx, this);
        animRoll1.getAnimation().gotoAndPlay("run", 0, -1, 1);
        animRoll1.setPosition(node1.getPosition().x,node1.getPosition().y-50);
        animRoll1.setCompleteListener(function(){
            animRoll1.removeFromParent();
        }.bind(this));

        var node2 = this.background.getChildByName("node"+ 2 +"_2");
        var animRoll2  = fr.AnimationMgr.createAnimationById(resAniId.minigame1_fx, this);
        animRoll2.getAnimation().gotoAndPlay("run", 0, -1, 1);
        animRoll2.setPosition(node2.getPosition().x,node2.getPosition().y-50);
        animRoll2.setCompleteListener(function(){
            animRoll2.removeFromParent();
        }.bind(this));

        var node3 = this.background.getChildByName("node"+ 3 +"_2");
        var animRoll3  = fr.AnimationMgr.createAnimationById(resAniId.minigame1_fx, this);
        animRoll3.getAnimation().gotoAndPlay("run", 0, -1, 1);
        animRoll3.setPosition(node3.getPosition().x,node3.getPosition().y-50);
        animRoll3.setCompleteListener(function(){
            animRoll3.removeFromParent();
        }.bind(this));

        GameUtil.callFunctionWithDelay(1.1,function(){
            this.createActionCompleteRoll(this.boolSeverReturn,1);
            this.createActionCompleteRoll(this.boolSeverReturn,2);
            this.createActionCompleteRoll(this.boolSeverReturn,3);
            this.Scale_Button(this.boolSeverReturn);
            this.animLight.removeFromParent();
            this.Action_Win_Lose(this.boolPlayerClick == this.boolSeverReturn);
        }.bind(this));

        this.background.addChild(animRoll1,-1);
        this.background.addChild(animRoll2,-1);
        this.background.addChild(animRoll3,-1);
    },

    createAnimLight:function(){
        this.animLight = fr.AnimationMgr.createAnimationById(resAniId.minigame1_den, this);
        this.animLight.getAnimation().gotoAndPlay("run", 0, -1, 0);
        this.animLight.setPosition(this.background.getContentSize().width/2 - 18,this.background.getContentSize().height/2 + 18);
        this.background.addChild(this.animLight);
    },

    //do true den false
    createActionCompleteRoll:function(isTrue,round){
        this.createSpriteHorse(isTrue,round,2);
        this.createSpriteHorse(Math.random()>0.5,round,1);
        this.createSpriteHorse(Math.random()>0.5,round,3);
    },

    createSpriteHorse:function(isTrue,round,index){
        var node = this.background.getChildByName("node" + round + "_" + index);
        var sprite1= null;
        if(isTrue){
            sprite1 = new cc.Sprite("res/game/MiniGame2/minigame2_nguado.png");
        }else{
            sprite1 = new cc.Sprite("res/game/MiniGame2/minigame2_nguaxanh.png");
        }
        sprite1.setPosition(node.getPosition());
        this.background.addChild(sprite1,-1);
        this.listIconHorse[round-1][index-1] = sprite1;
    },

    removeIconSprite:function(round){
        for(var i =0;i<constant_Information.ICON_IN_ROUND;i++){
            if(this.listIconHorse[round][i]!=null){
                this.listIconHorse[round][i].removeFromParent();
                this.listIconHorse[round][i] = null;
            }
        }
    },

    Create_Button_Stop: function () {
        var nodeButtonStop = this.background.getChildByName("node_button_stop");
        if(this.buttonStop){
            this.buttonStop.removeFromParent();
        }
        this.buttonStop = new ccui.Button();
        if(this.isMyPlay){
            this.buttonStop.loadTextureNormal(constant_MiniGame_2.BUTTON_STOP,ccui.Widget.LOCAL_TEXTURE);
        }else{
            this.buttonStop.loadTextureNormal(constant_MiniGame_2.LOCK_BUTTON_STOP,ccui.Widget.LOCAL_TEXTURE);
        }

        this.buttonStop.addClickEventListener(this.onButtonStopClick.bind(this));
        this.buttonStop.setPosition(nodeButtonStop.getPosition());
        this.background.addChild(this.buttonStop);
        if(!this.isMyPlay){
            this.buttonStop.setTouchEnabled(false);
        }
    },

    onButtonStopClick:function(){
        cc.log("CLICK BUTTON STOP");
        this.buttonBlack.setTouchEnabled(false);
        this.buttonRed.setTouchEnabled(false);
        this.buttonStop.setTouchEnabled(false);
        gv.gameClient.sendPacketSingleMinigame(constant_Information.BUTTON_STOP);
        gv.gameClient._clientListener.dispatchPacketInQueue();
        fr.Sound.playSoundEffect(resSound.m_button_cancel);
    },

    Action_Click_Button_Black:function(){
        var buttonBlackPosition = this.background.getChildByName("node_button_black").getPosition();
        var buttonRedPosition = this.background.getChildByName("node_button_red").getPosition();
        this.boolPlayerClick = false;

        this.buttonBlack.removeFromParent();
        this.buttonBlack = fr.createSprite(constant_MiniGame_2.BUTTON_BLACK);
        this.buttonBlack.setPosition(buttonBlackPosition);
        this.background.addChild(this.buttonBlack);

        this.buttonRed.removeFromParent();
        this.buttonRed = fr.createSprite(constant_MiniGame_2.LOCK_BUTTON_RED);
        this.buttonRed.setPosition(buttonRedPosition);
        this.background.addChild(this.buttonRed);
        this.Action_Rotation(this.boolSeverReturn);
    },

    Create_Button_Black:function(){
        cc.log("Create_Button_Black");
        if(this.buttonBlack){
            this.buttonBlack.removeFromParent();
        }
        var buttonBlackPosition = this.background.getChildByName("node_button_black").getPosition();
        this.buttonBlack = new ccui.Button();

        if(this.isMyPlay){
            this.buttonBlack.loadTextureNormal(constant_MiniGame_2.BUTTON_BLACK,ccui.Widget.LOCAL_TEXTURE);
        }else{
            this.buttonBlack.loadTextureNormal(constant_MiniGame_2.LOCK_BUTTON_BLACK,ccui.Widget.LOCAL_TEXTURE);
        }

        this.buttonBlack.addClickEventListener(this.onClickButtonBack.bind(this));
        this.buttonBlack.setPosition(buttonBlackPosition);
        this.background.addChild(this.buttonBlack);
        if(!this.isMyPlay){
            this.buttonBlack.setTouchEnabled(false);
        }
    },

    onClickButtonBack:function(){
        this.buttonBlack.setTouchEnabled(false);
        this.buttonRed.setTouchEnabled(false);
        gv.gameClient.sendPacketSingleMinigame(constant_Information.BUTTON_BLACK);
        gv.gameClient._clientListener.dispatchPacketInQueue();
        fr.Sound.playSoundEffect(resSound.m_button_click);
    },

    Action_Click_Button_Red:function(){
        var buttonBlackPosition = this.background.getChildByName("node_button_black").getPosition();
        var buttonRedPosition = this.background.getChildByName("node_button_red").getPosition();
        this.boolPlayerClick = true;

        this.buttonRed.removeFromParent();
        this.buttonRed = fr.createSprite(constant_MiniGame_2.BUTTON_RED);
        this.buttonRed.setPosition(buttonRedPosition);
        this.background.addChild(this.buttonRed);

        this.buttonBlack.removeFromParent();
        this.buttonBlack = fr.createSprite(constant_MiniGame_2.LOCK_BUTTON_BLACK);
        this.buttonBlack.setPosition(buttonBlackPosition);
        this.background.addChild(this.buttonBlack);

        this.Action_Rotation(this.boolSeverReturn);
    },

    Create_Button_Red:function(){
        if(this.buttonRed){
            this.buttonRed.removeFromParent();
        }
        var buttonRedPosition = this.background.getChildByName("node_button_red").getPosition();
        this.buttonRed = new ccui.Button();
        if(this.isMyPlay){
            this.buttonRed.loadTextureNormal(constant_MiniGame_2.BUTTON_RED,ccui.Widget.LOCAL_TEXTURE);
        }else{
            this.buttonRed.loadTextureNormal(constant_MiniGame_2.LOCK_BUTTON_RED,ccui.Widget.LOCAL_TEXTURE);
        }
        this.buttonRed.addClickEventListener(this.onClickButtonRed.bind(this));
        this.buttonRed.setPosition(buttonRedPosition);
        this.background.addChild(this.buttonRed);
        if(!this.isMyPlay){
            this.buttonRed.setTouchEnabled(false);
        }
    },

    onClickButtonRed:function(){
        this.buttonRed.setTouchEnabled(false);
        this.buttonBlack.setTouchEnabled(false);
        gv.gameClient.sendPacketSingleMinigame(constant_Information.BUTTON_RED);
        gv.gameClient._clientListener.dispatchPacketInQueue();
        fr.Sound.playSoundEffect(resSound.m_button_click);
    },

    Reset_All_Button:function(){
        this.buttonBlack.removeFromParent();
        this.buttonBlack = null;
        this.buttonRed.removeFromParent();
        this.buttonRed = null;
        this.Create_Button_Black();
        this.Create_Button_Red();
    },

    Action_Win_Lose:function(win){
        var size = cc.winSize;
        var sprite = null;
        var _this = this;
        if(win){
            sprite = fr.AnimationMgr.createAnimationById(resAniId.minigame2_win, this);
            sprite.getAnimation().gotoAndPlay("run", 0, -1, 1);
            sprite.setCompleteListener(function(){
                sprite.removeFromParent();
                _this.Create_List_Numbet_Count();
                _this.Create_New_Multi_Money();
                _this.Create_Button_Stop();
                if (_this.count < 3) {
                    _this.Reset_All_Button();
                    gv.gameClient._clientListener.dispatchPacketInQueue();
                    //_this.Create_New_Label_Money(_this.Preprocessing_Money_Draw(_this.currentChosenGold * _this.Return_Multi()));
                    _this.time = GameUtil.getTimeAuto(constant_MiniGame_2.MAX_TIME);
                    _this.labeltime.setString(_this.time);
                    _this.isCircle = false;
                } else {
                    _this.Go_Out_MiniGame();
                }
            });
            sprite.setPosition(size.width/2,size.height/2);
            this.addChild(sprite);
            fr.Sound.playSoundEffect(resSound.g_minigame_win);
        }else{
            sprite = fr.createSprite(constant_MiniGame_2.LOSE_SPRITE);
            sprite.setPosition(size.width/2,size.height/2);
            this.addChild(sprite);
            sprite.runAction(cc.sequence(
                cc.rotateTo(0.1,15),
                cc.rotateTo(0.2,-15),
                cc.rotateTo(0.2,0).easing(cc.easeBackOut()),
                cc.callFunc(function(){
                    sprite.removeFromParent();
                    _this.Go_Out_MiniGame();
                })
            ));

            fr.Sound.playSoundEffect(resSound.g_minigame_lose);
        }
    },

    Scale_Button:function(red){
        if(red){
            this.buttonRed.runAction(cc.sequence(
                cc.scaleBy(0.25,1.2,1.2),
                cc.scaleBy(0.25,1.2,1.2).reverse().easing(cc.easeBackOut())
            ));
        }else{
            this.buttonBlack.runAction(cc.sequence(
                cc.scaleBy(0.25,1.2,1.2),
                cc.scaleBy(0.25,1.2,1.2).reverse().easing(cc.easeBackOut())
            ));
        }
    },

    Reconnect_Data:function(currentlevel,goldbet){
        this.count = currentlevel;
        this.time = 0;
        if(this.count>0) {
            this.isPlayed = true;
            this.Create_List_Numbet_Count();
            this.Action_ChosenGold(goldbet);
            this.Create_New_Multi_Money();
            this.Create_Button_Stop();
        }
        this.update(0);
    },

    Preprocessing_Money:function(money){
        return StringUtil.toMoneyString(money);
    },

    Action_ChosenGold:function(count){
        var pos1 = this.background.getChildByName("node_bet_1").getPosition();
        var pos2 = this.background.getChildByName("node_bet_2").getPosition();
        var pos3 = this.background.getChildByName("node_bet_3").getPosition();

        switch (count){
            case constant_Information.SEND_MIN_GOLD:{
                this.labelChosenGold.setString(this.Preprocessing_Money(this.minGold));
                //this.Create_New_Label_Money(this.Preprocessing_Money(this.minGold*this.Return_Multi()));
                this.currentChosenGold = this.minGold;
                this.spriteChosenGold.runAction(cc.moveTo(0.2,pos1).easing(cc.easeBackOut()));
                break;
            }
            case constant_Information.SEND_MID_GOLD:{
                if(this.playerCurrentGold>this.moveGold){
                    this.labelChosenGold.setString(this.Preprocessing_Money(this.moveGold));
                    //this.Create_New_Label_Money(this.Preprocessing_Money(this.moveGold*this.Return_Multi()));
                    this.currentChosenGold = this.moveGold;
                    this.spriteChosenGold.runAction(cc.moveTo(0.2,pos2).easing(cc.easeBackOut()));
                    break;
                }
                break;
            }
            case constant_Information.SEND_MAX_GOLD: {
                if(this.playerCurrentGold>this.maxGold){
                    this.labelChosenGold.setString(this.Preprocessing_Money(this.maxGold));
                    //this.Create_New_Label_Money(this.Preprocessing_Money(this.maxGold*this.Return_Multi()));
                    this.currentChosenGold = this.maxGold;
                    this.spriteChosenGold.runAction(cc.moveTo(0.2,pos3).easing(cc.easeBackOut()));
                    break;
                }
                break;
            }
        }
    },

    Create_Min_Max_Gold:function(){
        //min gold
        var _this = this;
        var pos1 = this.background.getChildByName("node_bet_1").getPosition();
        var color = cc.color(35, 0, 0);
        var mingold = new ccui.Text(this.Preprocessing_Money(this.minGold), "res/fonts/unicode.revueb.ttf", 25);
        mingold.setColor(color);
        mingold.setPosition(pos1);
        this.background.addChild(mingold);
        var listener_click_mingold = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(!_this.isPlayed&&_this.isMyPlay){
                        //_this.Action_ChosenGold(0);
                        cc.log("gui tien nho nhat");
                        gv.gameClient.sendPacketSingleMinigameBet(constant_Information.SEND_MIN_GOLD);
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_mingold ,mingold);

        //mid click
        var pos2 = this.background.getChildByName("node_bet_2").getPosition();
        var midClick = new ccui.Text(this.Preprocessing_Money(this.moveGold), "res/fonts/unicode.revueb.ttf", 25);
        midClick.setColor(color);
        midClick.setPosition(pos2);
        this.background.addChild(midClick);
        var listener_click_midClick = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(!_this.isPlayed&&_this.isMyPlay) {
                        //cc.log("Gui so tien trung binh")
                        gv.gameClient.sendPacketSingleMinigameBet(constant_Information.SEND_MID_GOLD);
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_midClick ,midClick);

        //max gold
        var pos3 = this.background.getChildByName("node_bet_3").getPosition();
        var maxgold = new ccui.Text(this.Preprocessing_Money(this.maxGold), "res/fonts/unicode.revueb.ttf", 25);
        maxgold.setColor(color);
        maxgold.setPosition(pos3);
        this.background.addChild(maxgold);
        var listener_click_maxgold = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(!_this.isPlayed&&_this.isMyPlay) {
                        cc.log("Gui so tien toi da");
                        gv.gameClient.sendPacketSingleMinigameBet(constant_Information.SEND_MAX_GOLD);
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_maxgold ,maxgold);
    },

    Go_Out_MiniGame:function(){
        cc.log("GOI VAO GO OUT MINIGAME");
        var money = -1;
        if(this.boolPlayerClick == this.boolSeverReturn){
            money = this.currentChosenGold*(this.Return_Multi()/2);
        }else{
            money = -this.currentChosenGold;
        }
        // gui update tien.
        gv.matchMng.minigame2Mgr.onExitMiniGame(money);
        // thoat ra khoi minigame.
        this.destroy(DestroyEffects.ZOOM);
    },

    Create_New_Multi_Money:function(){
        if(this.count<3){
            if(this.labelMultilMoney!=null){
                this.labelMultilMoney.removeFromParent();
            }
            var multi = this.Return_Multi();
            this.labelMultilMoney = new ccui.Text("x"+ multi, "Arial", 30);
            var nodeMulti = this.background.getChildByName("node_multi");
            this.labelMultilMoney.setPosition(nodeMulti.getPosition());
            this.labelMultilMoney.setColor(cc.color(255, 160, 0));
            this.background.addChild(this.labelMultilMoney);
        }
    },

    Return_Multi:function(){
        var multi = 2;
        for (var i = 0;i<this.count;i++){
            multi*=2;
        }
        return multi;
    },

    Draw_Popup_NoPlay:function(playerIndex){
        var size = this.background.getContentSize();
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var playername = playerInfo.playerStatus.name;
        var background = fr.createSprite(constant_MiniGame_2.BACKGROUND_DRAW_NAME);
        background.setPosition(size.width/2,size.height/2-100);
        this.background.addChild(background);
        var string = new ccui.Text(playername + " đang chơi ...", "Arial", 30);
        string.setPosition(background.getContentSize().width/2,background.getContentSize().height/2);
        background.addChild(string);
    },

    // update bien thoi gian o trong day
    update:function(dt){
        if(!this.isCircle){
            this.time--;
            this.labeltime.setString(this.time);
        }else{
                this.time = GameUtil.getTimeAuto(constant_MiniGame_2.MAX_TIME);
            //}else{
                //this.time = constant_MiniGame_2.MAX_TIME;
            //}
        }

        if(this.time<=0){
            this.time=0;
            if(this.isMyPlay) {
                // neu mat mang thi co the bug?
                if (this.count > 0) {
                    cc.log("GUI BUTTON STOP");
                    this.onButtonStopClick();
                } else {
                    cc.log("GUI BUTTON RED");
                    this.onClickButtonRed();
                }
            }
        }
    }

});