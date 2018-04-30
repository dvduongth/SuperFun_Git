/**
 * Created by user on 30/7/2016.
 */

var GuiPlayerInfoPanel = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_PLAYER_INFO_PANEL);
    },

    onEnter: function(){
        this._super();

        for(var i=0; i< MAX_NUMBER_PLAYER; i++){
            var playerInfoPanel = this.getPlayerInfoPanelByStandPos(i);
            playerInfoPanel.getChildByName("panel").addClickEventListener(this.onPanelClick.bind(this, i));
            playerInfoPanel.setCascadeOpacityEnabled(false);
            playerInfoPanel.setVisible(false);

            //avatar
            var av = new fr.Avatar("", AvatarShape.CIRCLE);
            av.setScale(0.5);
            av.setPosition(this.getAvatarPosAtStandPos(i, false));
            av.setRotation(playerInfoPanel.getRotation());
            av.setName("avatar");
            playerInfoPanel.addChild(av, -1);

            var progressBar = new cc.ProgressTimer(fr.createSprite("res/game/mainBoard/playerInfo/player_timer.png"));
            progressBar.type = cc.ProgressTimer.TYPE_RADIAL;
            progressBar.setPosition(this.getAvatarPosAtStandPos(i));
            progressBar.setReverseDirection(true);
            progressBar.setName("progress_bar");
            progressBar.setVisible(false);
            playerInfoPanel.addChild(progressBar);

            var rankImg = playerInfoPanel.getChildByName("rank");
            rankImg.setVisible(false);

            var textCountdown = this.getPlayerInfoPanelByStandPos(i).getChildByName("text_countdown");
            textCountdown.setVisible(false);
        }
    },

    getPlayerInfoPanelByStandPos : function(standPos){
        return this._rootNode.getChildByName("playerInfo_"+standPos);
        //var retValue = this._rootNode.getChildByName("playerInfo_"+standPos);
        //return retValue;
    },

    onPanelClick: function(playerStandPos){
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(playerStandPos);
        if (playerInfo){
            var charData = playerInfo.playerStatus.mainCharacter;
            var guiDetailInfo = new GuiDetailInfo(playerStandPos, charData);
            gv.guiMgr.addGui(guiDetailInfo, GuiId.DETAIL_INFO, LayerId.LAYER_POPUP);
        }
    },

    addPlayerInRestRoom : function(standPos, playerStatusObj){
        cc.log("Add player To Room. standPos: "+standPos+"Player Name: "+playerStatusObj.name);

        var playerInfo = this.getPlayerInfoPanelByStandPos(standPos);
        playerInfo.stopAllActions();
        playerInfo.setVisible(true);
        playerInfo.setScale(0);
        playerInfo.runAction(cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut()));

        var color = playerStatusObj.index;
        playerInfo.setTexture("game/mainBoard/playerInfo/avatar_" + GameUtil.getColorStringById(color) + ".png");

        //avatar
        var av = playerInfo.getChildByName("avatar");
        av.updateAvatar(playerStatusObj.avatarUrl);

        //display name
        var displayName = playerInfo.getChildByName("name");
        displayName.setString(StringUtil.limitWordNumber(playerStatusObj.name, 12));

        var goldLb = playerInfo.getChildByName("gold");
        goldLb.setString(StringUtil.toMoneyString(playerStatusObj.gold));
    },

    removePlayerInRestRoom : function(standPos){
        cc.log("Remove player from room. standPos: "+standPos);

        var playerInfo = this.getPlayerInfoPanelByStandPos(standPos);
        playerInfo.setVisible(false);
    },

    initPlayersInfo: function(startColor){

        //Init player info in 4 corners
        for (var i=0; i<MAX_NUMBER_PLAYER; i++){

            var playerInfo = this.getPlayerInfoPanelByStandPos(i);

            var curPlayer = gv.matchMng.playerManager.getPlayerInfoByStandPos(i);
            if (curPlayer){
                var playerStatusObj = curPlayer.playerStatus;

                playerInfo.stopAllActions();
                playerInfo.setVisible(true);

                var color = (startColor+i) % MAX_NUMBER_PLAYER;
                playerInfo.setTexture("game/mainBoard/playerInfo/avatar_" + GameUtil.getColorStringById(color) + ".png");

                //avatar
                var av = playerInfo.getChildByName("avatar");
                av.updateAvatar(playerStatusObj.avatarUrl);

                //display name
                var displayName = playerInfo.getChildByName("name");
                displayName.setString(StringUtil.limitWordNumber(playerStatusObj.name, 12));

                var goldLb = playerInfo.getChildByName("gold");
                goldLb.setString(StringUtil.toMoneyString(playerStatusObj.gold));

                //test conflict server and client money
                if (DebugConfig.TRACKING_MONEY_IN_GAME){
                    //playerInfo.getChildByName("server_money").setVisible(true);
                    playerInfo.getChildByName("server_money").setVisible(true);
                    playerInfo.getChildByName("server_money").setString("Server_money: " + playerStatusObj.gold);
                }
                else{
                    playerInfo.getChildByName("server_money").setVisible(false);
                }

            }

            var moneyChangeLabel = new MoneyChangeLabel();
            moneyChangeLabel.setTag(696969);
            if((i==1) || (i==2)) {
                moneyChangeLabel.setFlip(true);
                moneyChangeLabel.setPosition(
                    moneyChangeLabel.getMoneyChangeLabelContentSize().width/2-10,
                    moneyChangeLabel.getMoneyChangeLabelContentSize().height/2+2);
            }
            else{
                moneyChangeLabel.setPosition(
                    moneyChangeLabel.getMoneyChangeLabelContentSize().width/2+10,
                    moneyChangeLabel.getMoneyChangeLabelContentSize().height/2+1);
            }
            playerInfo.addChild(moneyChangeLabel);
        }
    },

    highlightPlayerTurn: function(currTurnPlayerIndex){
        for (var i=0; i<gv.matchMng.playerManager.getNumberPlayer(); i++){
            var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
            var playerInfo = this.getPlayerInfoPanelByStandPos(player.standPos);
            playerInfo.setOpacity(255);
            var avatar = playerInfo.getChildByName("avatar");
            if (i==currTurnPlayerIndex){
                playerInfo.setColor(cc.color(255,255,255,0));
                avatar.defaultAvatar.setColor(cc.color(255,255,255,0));
            }
            else{
                playerInfo.setColor(cc.color(100,100,100,0));
                avatar.defaultAvatar.setColor(cc.color(100,100,100,0));
            }

            //playerInfo.getChildByName("panel").setOpacity(i == currTurnPlayerIndex?255:0);
        }
    },

    runProgressBar: function(playerStandPos, timeOut, callback){
        var progressBar = this.getPlayerInfoPanelByStandPos(playerStandPos).getChildByName("progress_bar");
        progressBar.stopAllActions();
        progressBar.setVisible(true);

        var textCountdown = this.getPlayerInfoPanelByStandPos(playerStandPos).getChildByName("text_countdown");
        textCountdown.setVisible(true);

        progressBar.runAction(cc.progressFromTo(2, 100, 0));

        var countdown = timeOut;
        progressBar.runAction(cc.sequence(
            cc.delayTime(0.01),
            cc.callFunc(function(){
                countdown-=0.01;
                if (countdown<=0){
                    progressBar.setVisible(false);
                    progressBar.stopAllActions();

                    textCountdown.setVisible(false);

                    if (callback)
                        callback();
                }
                else{
                    var percent = countdown/timeOut*100;
                    if (percent<=20 && !progressBar.getActionByTag(999)){
                        var blinkAction = cc.blink(1, 5).repeatForever();
                        blinkAction.setTag(999);
                        progressBar.runAction(blinkAction);

                    }
                    progressBar.setPercentage(percent);
                    textCountdown.setString(Math.ceil(countdown));
                }
            })
        ).repeatForever());

    },

    stopAllProgressBar: function(){
        for(var i=0; i< MAX_NUMBER_PLAYER; i++){
            var playerInfoPanel = this.getPlayerInfoPanelByStandPos(i);
            var progressBar = playerInfoPanel.getChildByName("progress_bar");
            progressBar.stopAllActions();
            progressBar.setVisible(false);

            var textCountdown = playerInfoPanel.getChildByName("text_countdown");
            textCountdown.setVisible(false);
        }
    },

    updateInfoOfAllPlayers:function(changeGoldList,isMinus){
        var changeGoldList = typeof  changeGoldList !== 'undefined' ? changeGoldList : [];
        cc.log("updateInfoOfAllPlayers");
        var playerIndex_deltaMoney = [0,0,0,0];
        //cc.log(changeGoldList.length);
        for (var i=0; i<changeGoldList.length; i++){
            var changeGold = changeGoldList[i];
            if(isMinus){ // neu la am
                if(changeGold.amountChange<0){
                    playerIndex_deltaMoney[changeGold.playerIndex]=changeGold.amountChange;
                }
            }else{
                if(changeGold.amountChange>0){
                    playerIndex_deltaMoney[changeGold.playerIndex]=changeGold.amountChange;
                }
            }

        }

        for(var i=0; i< MAX_NUMBER_PLAYER; i++){

            if (playerIndex_deltaMoney[i]!=0){
                //chay effect tien tren avatar
                var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
                var standPos = playerInfo.standPos;
                var playerPanel = this.getPlayerInfoPanelByStandPos(standPos);
                playerPanel.getChildByTag(696969).showMoneyTransferEffect(playerIndex_deltaMoney[i]);

                //cap nhat thong tin tren avatar
                var gold = playerInfo.playerStatus.gold;
                var playerInfoUI = this.getPlayerInfoPanelByStandPos(playerInfo.standPos);
                var goldLb = playerInfoUI.getChildByName("gold");
                goldLb.setString(StringUtil.toMoneyString(gold));

                //sap xep lai thu tu theo so tien dang co
                //var goldIndexLabel = playerInfoUI.getChildByName("gold_index");
                //goldIndexLabel.setTexture("game/mainBoard/playerInfo/ingame_player_index_" + gv.matchMng.playerManager.getGoldIndexOfPlayer(standPos) + ".png");
            }

        }
    },

    //updateInfoOfAllPlayers : function(changeGoldList){
    //    var changeGoldList = typeof  changeGoldList !== 'undefined' ? changeGoldList : [];
    //
    //    var playerIndex_deltaMoney = [0,0,0,0];
    //    for (var i=0; i<changeGoldList.length; i++){
    //        var changeGold = changeGoldList[i];
    //        playerIndex_deltaMoney[changeGold.playerIndex]=changeGold.amountChange;
    //    }
    //
    //    for(var i=0; i< MAX_NUMBER_PLAYER; i++){
    //
    //        if (playerIndex_deltaMoney[i]!=0){
    //            //chay effect tien tren avatar
    //            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
    //            var standPos = playerInfo.standPos;
    //            var playerPanel = this.getPlayerInfoPanelByStandPos(standPos);
    //            playerPanel.getChildByTag(696969).showMoneyTransferEffect(playerIndex_deltaMoney[i]);
    //
    //            //cap nhat thong tin tren avatar
    //            var gold = playerInfo.playerStatus.gold;
    //            var playerInfoUI = this.getPlayerInfoPanelByStandPos(playerInfo.standPos);
    //            var goldLb = playerInfoUI.getChildByName("gold");
    //            goldLb.setString(StringUtil.toMoneyString(gold));
    //
    //            //sap xep lai thu tu theo so tien dang co
    //            //var goldIndexLabel = playerInfoUI.getChildByName("gold_index");
    //            //goldIndexLabel.setTexture("game/mainBoard/playerInfo/ingame_player_index_" + gv.matchMng.playerManager.getGoldIndexOfPlayer(standPos) + ".png");
    //        }
    //
    //    }
    //},

    getAvatarPosAtStandPos: function(standPos, convertToGloble){
        convertToGloble = typeof convertToGloble !== 'undefined' ? convertToGloble : false;
        var playerInfo = this.getPlayerInfoPanelByStandPos(standPos);
        //cc.log("getAvatarPosAtStandPos: playerInfo pos = " + playerInfo.x + " " + playerInfo.y);
        var localPos = playerInfo.getChildByName("avatar_pos").getPosition();
        //cc.log("getAvatarPosAtStandPos: standPos = " + standPos + ", localPos = " + localPos.x + "," + localPos.y);
        if (!convertToGloble)
            return localPos;
        else{
            return  playerInfo.convertToWorldSpace(localPos);
        }

    },

    addBankruptToPlayer: function(player){
        //Them icon pha san khi thua
        var playerInfoUI = this.getPlayerInfoPanelByStandPos(player.standPos);
        if (player.lose){
            var bankruptIcon = playerInfoUI.getChildByTag(911);
            if (!bankruptIcon){
                bankruptIcon = fr.createSprite("game/mainBoard/bankrupt.png");
                bankruptIcon.setPosition(playerInfoUI.getContentSize().width/2, playerInfoUI.getContentSize().height/2);
                bankruptIcon.setVisible(false);
                bankruptIcon.runAction(cc.sequence(
                    cc.delayTime(3.0),
                    cc.callFunc(function(){
                        bankruptIcon.setVisible(true);
                        bankruptIcon.setScale(3.0);
                    }),
                    cc.scaleTo(0.2, 1.0).easing(cc.easeBackIn())
                ));
                bankruptIcon.setTag(911);
                playerInfoUI.addChild(bankruptIcon);

                if (player.playerIndex == 0){//nguoi choi chinh bi pha san
                    gv.guiMgr.getGuiById(GuiId.SETTING_IN_GAME).setEnableLeaveRoom(true);
                }
           }
        }
    },

    checkConflictGold: function(globalPlayerIndex_cash){
        for(var globalIndex in globalPlayerIndex_cash){
            var standPos = gv.matchMng.mapper.convertGlobalToLocalStandPos(globalIndex);
            var playerInfoGUI = this.getPlayerInfoPanelByStandPos(standPos);
            playerInfoGUI.getChildByName("server_money").setString("Server_money: " + globalPlayerIndex_cash[globalIndex]);
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(standPos);

            DebugUtil.log("[CASH] Player " + globalIndex + ": [Server: " + globalPlayerIndex_cash[globalIndex] + ", client: " + playerInfo.playerStatus.gold +"]", true);

            //check CONFLICT
            if (playerInfo.playerStatus.gold != globalPlayerIndex_cash[globalIndex]){

                DebugUtil.log("CONFLICT CASH: ", true);
                DebugUtil.log("SERVER: player_" + globalIndex + ": " + globalPlayerIndex_cash[globalIndex], true);
                DebugUtil.log("CLIENT: player_" + globalIndex + ": " +playerInfo.playerStatus.gold, true);

                var stringLog = DebugUtil.getTrackLog();
                gv.gameClient.sendTrackLog(stringLog);

                //reconnect when conflict
                if (!gv.guiMgr.getGuiById(GuiId.CONFLICT))
                    gv.guiMgr.addGui(new GuiConflict("CONFLICT CASH"), GuiId.CONFLICT, LayerId.LAYER_LOADING);

                return true;
            }
        }
        return false;
    },

    updatePlayerRank: function(){
        var boardData = gv.matchMng.mainBoard.boardData;
        var numberPlayer = gv.matchMng.playerManager.getNumberPlayer();

        var playerList = [];
        for (var i=0; i<numberPlayer; i++)
            playerList.push(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i));

        for (var i=0; i<playerList.length-1; i++){
            for (var j=i+1; j<playerList.length; j++){
                var numberPieceFinished1 = boardData.getNumberPieceFinished(playerList[i].playerIndex);
                var numberPieceFinished2 = boardData.getNumberPieceFinished(playerList[j].playerIndex);
                if ((numberPieceFinished1 < numberPieceFinished2)
                    || ((numberPieceFinished1 == numberPieceFinished2) && (playerList[i].playerStatus.gold < playerList[j].playerStatus.gold))
                    || ((numberPieceFinished1 == numberPieceFinished2) && (playerList[i].playerStatus.gold == playerList[j].playerStatus.gold) && (playerList[i].playerStatus.index > playerList[j].playerStatus.index))
                ){
                    var temp = playerList[i];
                    playerList[i] = playerList[j];
                    playerList[j] = temp;
                }
            }
        }

        for (var i=0; i<playerList.length; i++){
            var playerStandPos = playerList[i].standPos;
            var panel = this.getPlayerInfoPanelByStandPos(playerStandPos);
            var rankImg = panel.getChildByName("rank");
            rankImg.setVisible(true);
            fr.changeSprite(rankImg, "res/game/mainBoard/playerInfo/avatar_rank_" + (i+1) + ".png");
        }
    },

    setVisibleAllPlayingPanel: function(isVisible){
        for (var i=0; i<gv.matchMng.playerManager.getNumberPlayer(); i++){
            var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
            if (!player.lose){
                var panel = this.getPlayerInfoPanelByStandPos(player.standPos);
                panel.setVisible(isVisible);
            }
        }
    }

});