
var GuiMiniGameTuXi = BaseGui.extend({

    ctor: function () {
        this._super(res.ZCSD_GUI_TUXI);

        var buttonDam = this._centerNode.getChildByName("button_dam");
        buttonDam.addClickEventListener(this.onClickButtonDam.bind(this));

        var buttonLa = this._centerNode.getChildByName("button_la");
        buttonLa.addClickEventListener(this.onClickButtonLa.bind(this));

        var buttonKeo = this._centerNode.getChildByName("button_keo");
        buttonKeo.addClickEventListener(this.onClickButtonKeo.bind(this));
        this.background = this._centerNode.getChildByName("background");
        this.isChosen = false;
        this.currentTime = GameUtil.getTimeAuto(constant_minigame_tuxi.MAX_TIME);
        this.minigameTuXiMgr = gv.matchMng.minigameTuXiMgr;
        this.drawTime();
        this.changeNameAndAvataAllPlayer();
        this.changeGoldLabel(this.minigameTuXiMgr.moneyPay);
        this.createAnimLight();
        this.runSpriteAvata();
        this.schedule(this.updateTime,1);
    },

    runSpriteAvata:function(){
        for(var i=0;i<3;i++){
            var spriteAvata = this._centerNode.getChildByName("spriteavata_" + (i+1));
            spriteAvata.setScale(0.9);
            spriteAvata.runAction(cc.sequence(
                cc.scaleTo(1,1.2),
                cc.scaleTo(1,0.9)
            ).repeatForever());
        }
    },

    hideAllSpriteAvata:function(){
        for(var i=0;i<3;i++){
            var spriteAvata = this._centerNode.getChildByName("spriteavata_" + (i+1));
            spriteAvata.setVisible(false);
        }
    },

    createAnimLight:function(){
        this.animLight = fr.AnimationMgr.createAnimationById(resAniId.minigame1_den, this);
        this.animLight.getAnimation().gotoAndPlay("run", 0, -1, 0);
        this.animLight.setPosition(this.background.getContentSize().width/2+6,this.background.getContentSize().height/2 + 32);
        this.background.addChild(this.animLight);
    },

    changeGoldLabel:function(money){
        var goldLabel = this._centerNode.getChildByName("gold_label");
        goldLabel.setString(StringUtil.toMoneyString(money));
    },

    onClickButtonDam:function(){
        this.isChosen = true;
        this.stopAllClickButton();
        gv.gameClient.sendPacketMiniGameTuXi(constant_minigame_tuxi.DAM);
        this.hideAllButtonClick();
        this._centerNode.getChildByName("button_dam").setVisible(true);
    },

    onClickButtonLa:function(){
        this.isChosen = true;
        this.stopAllClickButton();
        gv.gameClient.sendPacketMiniGameTuXi(constant_minigame_tuxi.LA);
        this.hideAllButtonClick();
        this._centerNode.getChildByName("button_la").setVisible(true);
    },

    onClickButtonKeo:function(){
        this.isChosen = true;
        this.stopAllClickButton();
        gv.gameClient.sendPacketMiniGameTuXi(constant_minigame_tuxi.KEO);
        this.hideAllButtonClick();
        this._centerNode.getChildByName("button_keo").setVisible(true);
    },

    getSpriteByReslut:function(result){
        switch (result){
            case constant_minigame_tuxi.DAM:{
                return fr.createSprite("res/game/minigametuxi/dam.png");
            }
            case constant_minigame_tuxi.LA:{
                return fr.createSprite("res/game/minigametuxi/la.png");
            }
            case constant_minigame_tuxi.KEO:{
                return fr.createSprite("res/game/minigametuxi/keo.png");
            }
        }
    },

    getPositionWithStandPos:function(standpos){
        switch (standpos){
            case 0:{
                return this._centerNode.getChildByName("node0");
            }
            case 1:{
                return this._centerNode.getChildByName("node1");
            }
            case 2:{
                return this._centerNode.getChildByName("node2");
            }
            case 3:{
                return this._centerNode.getChildByName("node3");
            }
        }
    },

    getRotationWithStandPos:function(standpos){
        switch (standpos){
            case 0 : return 270;
            case 1 : return 180;
            case 2 : return 90;
            case 3 : return 0;
        }
    },

    getSpriteByResult:function(result,standpos){
        var sprite = this.getSpriteByReslut(result);
        var node = this.getPositionWithStandPos(standpos);
        var rotation = this.getRotationWithStandPos(standpos);
        sprite.setPosition(node.getPosition());
        sprite.setRotation(rotation);
        sprite.setScale(1);
        this._centerNode.addChild(sprite);
        return sprite;
    },

    hideAllButtonClick:function(){
        var buttonDam = this._centerNode.getChildByName("button_dam");
        buttonDam.setVisible(false);

        var buttonLa = this._centerNode.getChildByName("button_la");
        buttonLa.setVisible(false);

        var buttonKeo = this._centerNode.getChildByName("button_keo");
        buttonKeo.setVisible(false);
    },

    stopAllClickButton:function(){
        var buttonDam = this._centerNode.getChildByName("button_dam");
        buttonDam.setTouchEnabled(false);

        var buttonLa = this._centerNode.getChildByName("button_la");
        buttonLa.setTouchEnabled(false);

        var buttonKeo = this._centerNode.getChildByName("button_keo");
        buttonKeo.setTouchEnabled(false);
    },

    finishChosenPlayer:function(){
        if(this._centerNode.getChildByName("text_wait")){
            this._centerNode.getChildByName("text_wait").setVisible(false);
        }
    },

    //changeAvataForAllPlayer:function(){
    //    var list = this.minigameTuXi.joinList;
    //},

    changeGoldAllPlayer:function(result){
        var money = this.minigameTuXiMgr.moneyPay;
        var playerList = this.minigameTuXiMgr.joinList;
        for (var i =0;i<playerList.length;i++){
            var goldPlayer = this._centerNode.getChildByName("goldPlayer" + playerList[i]);
            goldPlayer.setVisible(true);
            goldPlayer.setString(StringUtil.toMoneyString(result[i]*money));
        }
    },

    changeNameAndAvataAllPlayer:function(){
        //cc.log("changeNameAllPlayer");
        var playerList = this.minigameTuXiMgr.joinList;
        for (var i =0;i<playerList.length;i++){
            if(playerList[i]!= MY_INDEX){
                var playerName = this._centerNode.getChildByName("player" + playerList[i]);
                //cc.log(playerList[i]);
                if(playerName){
                    playerName.setVisible(true);
                    playerName.setString(this.PreProcessing_Name(gv.matchMng.playerManager.playerIndex_PlayerInfo[playerList[i]].playerStatus.name));
                }
                var playerAvata = this._centerNode.getChildByName("avata_" + playerList[i]);
                if(playerAvata){
                   // playerAvata.setVisible(true);
                    var av = new fr.Avatar(gv.matchMng.playerManager.playerIndex_PlayerInfo[playerList[i]].playerStatus.avatarUrl,AvatarShape.SQUARE);
                    av.setPosition(playerAvata.getPosition());
                    this._centerNode.addChild(av);
                }
           }
        }
    },

    PreProcessing_Name:function(name){
        var string = "";
        if(name.length>6){
            for(var i=0;i<6;i++){
                string += name[i];
            }
            return string;
        }
        return name;
    },

    finishAllChosen:function(){
        //todo finish all chosen show all reslut
        cc.log("finishAllChosen");
        this.hideAllSpriteAvata();
        this._centerNode.getChildByName("text_wait").setVisible(false);
        this.hideAllButtonClick();
        var listSelection = this.minigameTuXiMgr.selectionList;
        var standPos = 0;
        var result = this.minigameTuXiMgr.calculateWinLoseForAllPlayer(this.minigameTuXiMgr.selectionList);
        for(var i =0;i<listSelection.length;i++){
            if(listSelection[i] < 0) continue;
            var distance = 3 - standPos;
            var convertStandPos = (i + distance)%4;
            var selection = listSelection[i];
            this.getSpriteByResult(selection,convertStandPos);
            //todo can change name o day
            // can show thang hoa thua o day
            if(i == MY_INDEX){
                var textReslut = this._centerNode.getChildByName("text_result");
                //textReslut.setVisible(true);
                // goi ham calculateWinLose trong mgr, roi show reslut win lose

                if(result[i] == 0){
                    textReslut.setString("Hòa");
                    GameUtil.callFunctionWithDelay(0.5,function(){
                        var sprite = fr.createSprite("res/game/minigametuxi/hoa.png");
                        sprite.setPosition(0,0);
                        this._centerNode.addChild(sprite,1000);
                        sprite.runAction(cc.sequence(
                            cc.rotateTo(0.1,15),
                            cc.rotateTo(0.2,-15),
                            cc.rotateTo(0.2,0).easing(cc.easeBackOut()),
                            cc.rotateTo(0.1,15),
                            cc.rotateTo(0.2,-15),
                            cc.rotateTo(0.2,0).easing(cc.easeBackOut()),
                            cc.callFunc(function(){
                                sprite.removeFromParent();
                            })
                        ));
                    }.bind(this));
                }
                if(result[i] > 0){
                    textReslut.setString("Thắng");
                    GameUtil.callFunctionWithDelay(0.5,function(){
                        var sprite = fr.AnimationMgr.createAnimationById(resAniId.minigame2_win, this);
                        sprite.getAnimation().gotoAndPlay("run", 0, -1, 1);
                        this._centerNode.addChild(sprite,1000);
                        sprite.setCompleteListener(function(){sprite.removeFromParent()})
                    }.bind(this));
                }
                if(result[i] < 0){
                    textReslut.setString("Thua");
                    GameUtil.callFunctionWithDelay(0.5,function(){
                        var sprite = fr.createSprite("res/game/minigametuxi/thua.png");
                        sprite.setPosition(0,0);
                        this._centerNode.addChild(sprite,1000);
                        sprite.runAction(cc.sequence(
                            cc.rotateTo(0.1,15),
                            cc.rotateTo(0.2,-15),
                            cc.rotateTo(0.2,0).easing(cc.easeBackOut()),
                            cc.rotateTo(0.1,15),
                            cc.rotateTo(0.2,-15),
                            cc.rotateTo(0.2,0).easing(cc.easeBackOut()),
                            cc.callFunc(function(){
                                sprite.removeFromParent();
                            })
                        ));
                    }.bind(this));
                }
            }
        }
        //this.changeGoldAllPlayer(result);
        GameUtil.callFunctionWithDelay(2.5,function(){this.Go_Out_MiniGame()}.bind(this));
    },

    Go_Out_MiniGame:function(){
        cc.log("GOI VAO GO OUT MINIGAME");
        //todo goi onExitMiniGame o day
        gv.matchMng.minigameTuXiMgr.onExitMiniGame();
        this.destroy(DestroyEffects.ZOOM);
    },

    drawTime:function(){
        this.labeltime = this._centerNode.getChildByName("text_time");
    },

    randomSendServer:function(){
        return Math.floor(Math.random()*3);
    },

    updateTime:function(){
        if(!this.isChosen){
            this.currentTime--;
            this.labeltime.setString(this.currentTime);
            if(this.currentTime <=0){
                this.isChosen = true;
                //gv.gameClient.sendPacketMiniGameTuXi(constant_minigame_tuxi.DAM);
                this.onClickButtonDam();
                this.unschedule(this.updateTime);
            }
        }else{
            this.unschedule(this.updateTime);
        }
    }
});