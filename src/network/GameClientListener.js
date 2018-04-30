/**
 * Created by KienVN on 5/21/2015.
 */

var GameClientListener = cc.Class.extend(
    {
        ctor:function()
        {
            this.packetQueue  = [];
            this.autoDispatch = false;
            this.waitingForPacket = false;
            //this._basePacket  = null;

            return true;
        },

        setAutoDispatch : function(enable){
            this.autoDispatch=enable;
        },

        isAutoDispatch : function(){
            return this.autoDispatch;
        },

        setWaitingForPacket : function(enable){
            this.waitingForPacket=enable;
        },

        isWaitingForPacket : function(){
            return this.waitingForPacket;
        },

        onFinishConnect:function(isSuccess)
        {
            cc.log("onFinishConnect:" + isSuccess);
            if(isSuccess)
            {
                //notify to gui
                var pk = gv.gameClient.getOutPacket(CmdSendHandshake);
                pk.putData();
                gv.gameClient.getNetwork().send(pk);
                gv.gameClient.startHeartBeat();
            }
            else{
                gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
            }
        },

        onDisconnected:function(disconnectReason)
        {
            cc.log("------------------> DISCONNECT FROM SERVER <------------------");

            if (!gv.guiMgr.getGuiById(GuiId.DISCONNECT))
                gv.guiMgr.addGui(new GuiDisconnect(disconnectReason), GuiId.DISCONNECT, LayerId.LAYER_LOADING);
            //cc.director.end();
        },

        onReceived:function(cmd, pkg)
        {

            var packet = gv.gameClient.getInPacket(cmd,pkg);
            //listener
            gv.gameClient._clientListener.onReceivedPacket(cmd,packet);
        },

        onReceivedPacket : function(cmd, packet)
        {
            if(packet!=null && packet.getCmdId()!=gv.CMD.USER_DISCONNECTED && packet.getError()!=0){
                cc.log("[PACKET] Packet error: "+packet.getError()+" Cmd: "+packet.getCmdId());
                return;
            }
            if(cmd!=gv.CMD.PING){
                //cuong
                this.lasttime = GameUtil.getCurrentTime();
                if(gv.guiMgr.getGuiById(GuiId.MAIN_BOARD)!=null){
                    gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).lasttime = GameUtil.getCurrentTime();
                }
                //
            }
            switch (cmd)
            {
                case gv.CMD.PACKET_ERROR:
                    break;
                case gv.CMD.HAND_SHAKE:
                    gv.gameClient.sendLoginRequest();
                    break;
                case gv.CMD.PING:
                    gv.gameClient.resetHeartBeatDelay();
                    break;
                case gv.CMD.USER_DISCONNECTED:
                   this.onDisconnected(packet.getError());
                    break;
                case gv.CMD.USER_LOGIN:
                    if(packet.getError() == 0){
                        gv.gameClient.sendGetAllCharacter();
                        gv.gameClient.sendGetAllDice();
                    }
                    else{
                        gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
                    }
                    break;
                case gv.CMD.GET_ALL_CHARACTER:
                    if(packet.getError() == 0){
                        UserData.getInstance().mainCharUid = packet.mainCharUid;
                        UserData.getInstance().characterList = packet.listCharacter;

                        gv.gameClient.sendGetEventData();
                    }
                    else{
                        gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
                    }
                    break;
                case gv.CMD.GET_EVENT_DATA:
                    if (packet.getError() == 0){
                        EventData.getInstance().init(packet.eventDataMap);
                        gv.gameClient.sendGetMailData();
                    }
                    else{
                        gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
                    }
                    break;
                case gv.CMD.GET_MAIL_DATA:
                    if (packet.getError() == 0){
                        MailData.getInstance().setMailList(packet.mailList);
                        gv.gameClient.sendGetPlayerData();
                    }
                    else{
                        gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
                    }
                    break;

                case gv.CMD.GET_PLAYER_DATA:
                    if(packet.getError() == 0){
                        var userData = UserData.getInstance();
                        userData.uid = packet.uid;
                        userData.userName = packet.userName;
                        userData.displayName = packet.displayName;
                        userData.gold = packet.gold;
                        userData.xu = packet.xu;
                        userData.level = packet.level;
                        userData.exp = packet.exp;
                        userData.vipLevel = packet.vipLevel;
                        userData.vipDailyGiftClaimed = packet.vipDailyGiftClaimed;
                        userData.vipExpiredTime = packet.vipExpiredTime;
                        userData.avatarUrl = packet.avatarUrl;
                        userData.hasGame = packet.hasGame;
                        userData.timeToGachaFree = packet.timeToGachaFree;
                        userData.deltaServerTime = packet.serverTime-new Date().getTime()/1000;
                        if(!userData.hasGame) {
                            gv.guiMgr.addGui(new GuiLobby(), GuiId.LOBBY, LayerId.LAYER_GUI);

                            gv.guiMgr.addGui(new GuiPlayerInfo(), GuiId.PLAYER_INFO, LayerId.LAYER_GUI);
                            if (!EventData.getInstance().getEventData(EventType.CONTINUOUS_LOGIN).isChecked) {
                                gv.guiMgr.addGui(new PopupEventDailyLogin(true), GuiId.POPUP_EVENT_DAILY_LOGIN, LayerId.LAYER_POPUP);
                            }
                            if ((userData.vipExpiredTime-GameUtil.getCurrentTime() > 0) &&(!UserData.getInstance().vipDailyGiftClaimed)){
                                gv.guiMgr.addGui(new PopupDailyGiftVipCongrats(), GuiId.POPUP_DAILY_GIFT_VIP_CONGRATS, LayerId.LAYER_POPUP);
                            }
                        }
                        gv.socialMgr.trackGSNLogin(userData.uid, userData.userName);
                        gv.guiMgr.getGuiById(GuiId.LOGIN).destroy();
                    }
                    else{
                        gv.guiMgr.getGuiById(GuiId.LOGIN).showLoginFailed();
                    }
                    break;
                case gv.CMD.GET_FRIEND_RANK:

                    var userData = UserData.getInstance();
                    //cc.log("CUONG             " + packet.friends.length);
                    userData.friends = packet.friends;
                    userData.friends.push(UserDataUtil.createSelfFriendData());// tu push minh vao de rank
                    UserDataUtil.sortFriendListByGold(); // sort data

                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.GET_FRIEND_LIST_DATA, null);
                    break;
                case gv.CMD.GET_GLOBAL_RANK:{
                    // cuong lay thong tin global rank
                    //packet lay thong tin goi tin roi, up vao table rank.
                    var listPlayer = packet.globalUser;
                    var playerRank = packet.rank;// lay thong tin rank cua nguoi choi
                    //cc.log("CUONG          Nhan packet global rank           " + playerRank);
                    var guiTableFriend = gv.guiMgr.getGuiById(GuiId.LOBBY).friendTable;
                    guiTableFriend.globalPlayer = listPlayer;
                    if(!guiTableFriend.tableType){
                        if(playerRank>1000){
                            guiTableFriend.myRankNumber.setString("1000+");
                        }else{
                            guiTableFriend.myRankNumber.setString(playerRank);
                        }
                    }
                    guiTableFriend.table.reloadData();
                    break;
                }
                case gv.CMD.DAILY_CHECKIN:
                    EventData.getInstance().getEventData(EventType.CONTINUOUS_LOGIN).isChecked = true;
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.RECEIVE_DAILY_LOGIN_GIFT);
                    break;
                case gv.CMD.INVITE_FRIEND_CLAIM:
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.INVITE_FRIEND_CLAIM);
                    break;
                case gv.CMD.UPDATE_MAIL_DATA:
                    MailData.getInstance().mailList = MailData.getInstance().mailList.concat(packet.mailList);
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.UPDATE_MAIL_DATA);
                    break;
                case gv.CMD.RECEIVE_MAIL_ITEM:
                    var userData = UserData.getInstance();
                    var itemId = packet.gameItem.itemID;
                    var quantity = packet.gameItem.quantity;
                    switch (itemId){
                        case GiftType.GOLD:
                            userData.gold+=quantity;
                            gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("Gift_congrats"), [new GiftData(itemId, quantity)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);
                            break;
                        case GiftType.COIN:
                            userData.xu+=quantity;
                            gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("Gift_congrats"), [new GiftData(itemId, quantity)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);
                            break;
                        case GiftType.CHEST_1:
                        case GiftType.CHEST_2:
                        case GiftType.CHEST_3:
                            userData.characterList = userData.characterList.concat(packet.characterList);
                            var guiOpenCharacter = new GuiOpenCharacter();
                            guiOpenCharacter.openChestWithCharacterDataList(itemId, packet.characterList);
                            gv.guiMgr.addGui(guiOpenCharacter, GuiId.OPEN_CHARACTER, LayerId.LAYER_GUI);
                            break;
                        case GiftType.DICE_1:
                        case GiftType.DICE_2:
                        case GiftType.DICE_3:
                        case GiftType.DICE_4:
                        case GiftType.DICE_5:
                        case GiftType.DICE_6:
                            ////Unlock dice
                            var list = [];
                            list.push(itemId.split("_")[1]);
                            userData.updateDiceList(list);
                            gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("Gift_congrats"), [new GiftData(itemId, quantity)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);
                            break;
                    }

                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.RECEIVE_MAIL_ITEM, packet);
                    break;

                case gv.CMD.VIP_DAILY_GIFT_CLAIM:
                    UserData.getInstance().vipDailyGiftClaimed = true;
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.VIP_DAILY_GIFT_CLAIM);
                    break;
                case gv.CMD.MATCH_INFO:
                    cc.log("match info packet->numberplayer: "+packet.gameStatusObject.listPlayerStatus.length);
                    gv.matchMng=new MatchManager();
                    gv.matchMng.initMatch(packet.gameStatusObject);

                    break;
                case gv.CMD.PLAYER_JOIN_MATCH:
                    gv.matchMng.restRoom.addPlayer(packet.playerStatusObject);
                    break;
                case gv.CMD.PLAYER_LEAVE_MATCH:
                    if (gv.guiMgr.getGuiById(GuiId.REST_ROOM)){
                        gv.matchMng.restRoom.removePlayer(packet.playerIndex);
                    }
                    else{
                        gv.matchMng.leaveMatch();
                    }
                    break;
                case gv.CMD.DO_GACHA:
                    var userData = UserData.getInstance();
                    userData.characterList = userData.characterList.concat(packet.characterList);
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.DO_GACHA_RESULT, packet.characterList);
                    break;
                case gv.CMD.PICK_MAIN_CHARACTER:
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.PICK_MAIN_CHARACTER_RESULT);
                    break;
                case gv.CMD.CHEAT_ADD_CHAR_WITH_SKILL_SET:
                    UserData.getInstance().characterList.push(packet.character);
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.CHEAT_ADD_CHARACTER_RESULT, packet.character);
                    break;
                case gv.CMD.UPGRADE_CHARACTER:
                    gv.guiMgr.getGuiById(GuiId.UPGRADE_CHARACTER).updateResult(packet);
                    break;

                case gv.CMD.SELL_CHARACTER:
                    UserData.getInstance().gold += packet.goldReceived;

                    var guiPlayerInfo = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO);
                    if (guiPlayerInfo){
                        guiPlayerInfo.reloadInfo();
                    }
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.SELL_CHARACTER_RESULT, packet.goldReceived);
                    break;
                case gv.CMD.MATCH_START:
                {
                    gv.matchMng.commitRestRoom(packet.firstPlayerIndex);
                    gv.matchMng.setFirstPlayerIndex(packet.firstPlayerIndex);

                    var guiRestRoom = gv.guiMgr.getGuiById(GuiId.REST_ROOM);
                    if (guiRestRoom!=null)
                        guiRestRoom.destroy();
                    break;
                }
                case gv.CMD.GET_ALL_DICE:
                    UserData.getInstance().mainDice = packet.mainDice;
                    UserData.getInstance().diceList = packet.diceList;
                    break;

                case gv.CMD.BUY_GOLD_PACK:
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.BUY_GOLD_PACK);
                    break;

                case gv.CMD.PAYMENT_UPDATE:
                    var eventData = EventData.getInstance().getEventData(EventType.FIRST_PAYING);
                    var userData = UserData.getInstance();
                    switch (packet.paymentItem){
                        case 1://GOLD
                        {
                            userData.gold += packet.amount;
                            if (packet.paymentChannel == packet.SMS){
                                gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("SMS_success_congrats"), [new GiftData(GiftType.GOLD, packet.amount)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);

                                if (!eventData.isFirstPayingSMSClaimed){//nhan tin lan dau
                                    eventData.isFirstPayingSMSClaimed = true;
                                    if (EventConfig.getInstance().getSMSBonusGiftDataList().length>0)
                                        gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("First_SMS_congrats"), EventConfig.getInstance().getSMSBonusGiftDataList()), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);

                                    //Unlock dice
                                    userData.updateDiceList(DiceConfig.getInstance().getDiceByUnlockCondition(DiceUnlockContion.FIRST_SMS));
                                    var guiDiceShop = gv.guiMgr.getGuiById(GuiId.DICE_SHOP);
                                    if(guiDiceShop != null){
                                        guiDiceShop.table.reloadData();
                                    }
                                }
                                else{
                                    EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).totalGross+=packet.grossAmount;
                                }
                            }
                            break;
                        }
                        case 2://COIN
                        {
                            userData.xu += packet.amount;
                            if (packet.paymentChannel == packet.MCARD || packet.paymentChannel == packet.ZCARD){
                                gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("Paying_card_success_congrats"), [new GiftData(GiftType.COIN, packet.amount)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);

                                if (!eventData.isFirstPayingCardClaimed){//nap the lan dau
                                    eventData.isFirstPayingCardClaimed = true;
                                    if (EventConfig.getInstance().getTelcoBonusGiftDataList().length>0)
                                        gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("First_paying_card_congrats"), EventConfig.getInstance().getTelcoBonusGiftDataList()), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);

                                    //Unlock dice
                                    userData.updateDiceList(DiceConfig.getInstance().getDiceByUnlockCondition(DiceUnlockContion.FIRST_CARD));
                                    var guiDiceShop = gv.guiMgr.getGuiById(GuiId.DICE_SHOP);
                                    if(guiDiceShop != null){
                                        guiDiceShop.table.reloadData();
                                    }
                                }
                                else{
                                    EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).totalGross+=packet.grossAmount;
                                }
                            }
                            break;
                        }
                        case 3://VIP
                        {
                            if (packet.vipSuccess){//nap VIP thanh cong
                                userData.vipExpiredTime = GameUtil.getCurrentTime() + VipConfig.getInstance().getDurationInSecond();
                                gv.guiMgr.addGui(new GuiVipSuccess(), GuiId.VIP_SUCCESS, LayerId.LAYER_POPUP);
                                if (packet.amount>0){ //so tien nap du
                                    gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("Paying_card_success_congrats"), [new GiftData(GiftType.COIN, packet.amount)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);
                                }
                            }
                            else{//nap VIP khong thanh cong
                                if (packet.amount>0){ // so tien nap vao tinh vao mua xu
                                    gv.guiMgr.addGui(new GuiVipFail(packet.amount), GuiId.VIP_FAIL, LayerId.LAYER_POPUP);
                                }
                            }
                            if (packet.amount>0) { // phan nap du chuyen thanh G
                                userData.xu += packet.amount;
                                if (!eventData.isFirstPayingCardClaimed){//nap the lan dau
                                    eventData.isFirstPayingCardClaimed = true;
                                    if (EventConfig.getInstance().getTelcoBonusGiftDataList().length>0)
                                        gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("First_paying_card_congrats"), EventConfig.getInstance().getTelcoBonusGiftDataList()), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);

                                    //Unlock dice
                                    userData.updateDiceList(DiceConfig.getInstance().getDiceByUnlockCondition(DiceUnlockContion.FIRST_CARD));
                                    var guiDiceShop = gv.guiMgr.getGuiById(GuiId.DICE_SHOP);
                                    if(guiDiceShop != null){
                                        guiDiceShop.table.reloadData();
                                    }
                                }
                                else{
                                    EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).totalGross+=packet.grossAmount;
                                }
                            }
                            break;
                        }
                    }
                    break;
                case gv.CMD.PAYING_ACCUMULATE_CLAIM:
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.PAYING_ACCUMULATE_CLAIM);
                    break;
                case gv.CMD.SELFIE_CHARACTER_CLAIM:
                    var selfieData = EventData.getInstance().getEventData(EventType.SELFIE_CHARACTER);
                    selfieData.numberClaimed++;
                    selfieData.lastTimeSelfie = GameUtil.getCurrentTime();
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.SELFIE_CHARACTER_CLAIM);
                    break;
                case gv.CMD.USER_CHEAT_PAYMENT:
                    NotificationHandler.getInstance().postHandler(NotificationHandlerId.USER_CHEAT_PAYMENT);
                    break;
                case gv.CMD.MATCH_CHEAT_ACTIVE_SKILL:
                    var localPlayerIndex = gv.matchMng.mapper.convertGlobalStandPosToLocalIndex(packet.playerIndex);
                    gv.matchMng.skillManager.playerIndex_cheatActiveSkill[localPlayerIndex] = packet.isOn;
                    break;
                case gv.CMD.PLAYER_TUXI_MINI_GAME:
                case gv.CMD.PLAYER_ACTIVE_PIECE:
                case gv.CMD.MATCH_NEXT_TURN:
                case gv.CMD.PLAYER_ROLL_DICE_COMMON:
                case gv.CMD.PLAYER_RESPONSE_SKILL:
                case gv.CMD.MATCH_END_GAME:
                case gv.CMD.PLAYER_CONTROL_CELL:
                case gv.CMD.PLAYER_PAY_TO_SUMMON:
                //case gv.CMD.PLAYER_SINGLE_MINIGAME_PLAY:
                case gv.CMD.HORSERACE_MINIGAME_PLAY:

                    if(this.autoDispatch){
                        cc.log("[PACKET] direct dispatch packet :"+cmd);
                        this.dispatchMatchPacket(packet);
                    }
                    else{
                        if(this.waitingForPacket){
                            cc.log("[PACKET] dispatch delayed packet : "+cmd);
                            this.waitingForPacket=false;
                            this.dispatchMatchPacket(packet);
                        }
                        else{
                            cc.log("[PACKET] queue packet : "+cmd);
                            this.packetQueue.push(packet);
                            //cc.log("[PACKET] put packet in queue: "+cmd);
                            //this.dumpPacketQueue();
                        }
                    }
                    break;
                //cuong player chat
                case gv.CMD.PLAYER_CHAT:
                {
                    var guiChat = gv.guiMgr.getGuiById(GuiId.CHAT_IN_GAME);
                    //convertGlobalToLocalStandPos
                    var index = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).mapper.convertGlobalToLocalStandPos(packet.playerIndex);
                    cc.log("CUONG         " + index + "             " + packet.iconIndex);
                    guiChat.Draw_Action_Chat(index,packet.iconIndex);

                    break;
                }
                case gv.CMD.PLAYER_SWITCH_AUTO:
                {
                    cc.log("Packet AUTO play");
                    //var guiMinigame2 = gv.guiMgr.getGuiById(GuiId.MINI_GAME_2);
                    //guiMinigame2.Action_ChosenGold(packet.indexBet);
                    break;
                }
                case gv.CMD.TREASURE_ATTEMPT:{
                    gv.guiMgr.getGuiById(GuiId.GUI_SANKHOBAU).startAnimationRollDice(new DiceResult(packet.score,0));
                    break;
                }
                case gv.CMD.GET_SPECIAL_EVEN_DATA:{
                    //cc.log("CUONG DA NHAN DUOC GOI TIN OK");
                    var guiSanKhoBau = new GuiSanKhoBau(packet.sankhobauStatus);
                    gv.guiMgr.addGui(guiSanKhoBau,GuiId.GUI_SANKHOBAU,LayerId.LAYER_GUI);
                    break;
                }
                default:
                    //cc.log("onReceivedPacket. Invalid packet cmd:  "+cmd);
                    break;
            }
        },

        dispatchMatchPacket : function(packet){
            if(packet.getCmdId() != gv.CMD.HORSERACE_MINIGAME_PLAY){
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).showWaitingBubble(BubbleType.NONE);
            }
            
            switch(packet.getCmdId()){
                case gv.CMD.PLAYER_ACTIVE_PIECE:
                    DebugUtil.log("Perform piece solution: pieceIndex = "+packet.pieceIndex+" option = "+packet.option, true);

                    if (gv.matchMng.skillManager.skillDataInTurn[gv.matchMng.currTurnPlayerIndex].activeSkill!=null){
                        DebugUtil.log("PLAYER_ACTIVE_PIECE: active by skill", true);
                        gv.matchMng.skillManager.skillDataInTurn[gv.matchMng.currTurnPlayerIndex].activeSkill.onResponseSkillResult(packet.pieceIndex, packet.option);
                    }
                    else {
                        var zoo = packet.escapeFromJail;
                        if(zoo){
                            gv.matchMng.zooMgr.resetByGold();
                            gv.matchMng.mainBoard.performPieceAction(packet.pieceIndex, packet.option);
                        }else{
                            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex,packet.pieceIndex);
                            if(piece.isLockMoveByZoo()){
                                // show khong di chuyen duoc
                                piece.pieceDisplay.lineControl.setVisible(false);
                                if(gv.matchMng.currTurnPlayerIndex == MY_INDEX){
                                    EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){gv.matchMng.onPieceActionMoveFinish(null)}.bind(this));
                                    fr.Sound.playSoundEffect(resSound.g_cant_move);
                                }else{
                                    gv.matchMng.onPieceActionMoveFinish(null);
                                }

                            }else{
                                //var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex,packet.pieceIndex);
                                var tile1 = gv.matchMng.mapper.getTileForSlot(piece.currSlot);
                                if(tile1.type == TileType.TILE_JAIL){
                                    gv.matchMng.zooMgr.resetHorseGoZoo();
                                }
                                var tile = GameUtil.addSlot(piece.currSlot,1,piece.playerIndex); //todo cho nay can phai sua lai de active cuong phong
                                if(piece.isMoveByTileUp&&tile.tileUp){
                                    GameUtil.resetForTurn(piece);
                                    //todo cho nay se code lai cho piece nhay len va dam xuong tai cho
                                    //EffectMgr.getInstance().showEffect(EffectType.NO_MOVE, function(){gv.matchMng.mainBoard.onPieceFinishedActiveMove(piece,piece.currSlot,true,PieceAction.NORMAL_MOVE);}.bind(this));
                                    //fr.Sound.playSoundEffect(resSound.g_cant_move);
                                    gv.matchMng.mainBoard.performPieceAction(packet.pieceIndex, packet.option);
                                    //
                                }else{
                                    gv.matchMng.mainBoard.performPieceAction(packet.pieceIndex, packet.option);
                                }
                            }
                        }
                    }
                    break;
                case gv.CMD.MATCH_NEXT_TURN:
                    var serverState = packet.piecesState;
                    var clientState = gv.matchMng.playerManager.dumpPieceInformationOfAllPlayers();
                    if(serverState != clientState && gv.matchMng.playerManager.getMineGlobalStandPos() == 0){
                        DebugUtil.log("CONFLICT: ", true);
                        DebugUtil.log("SERVER: "+serverState, true);
                        DebugUtil.log("CLIENT: "+clientState, true);

                        var stringLog = DebugUtil.getTrackLog();
                        gv.gameClient.sendTrackLog(stringLog);

                        //reconnect when conflict
                        if (!gv.guiMgr.getGuiById(GuiId.CONFLICT))
                            gv.guiMgr.addGui(new GuiConflict("CONFLICT POSITION"), GuiId.CONFLICT, LayerId.LAYER_LOADING);
                        return;
                    }
                    if (gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).checkConflictGold(packet.playerIndex_cash)){
                        return;
                    }
                    if (packet.skillRandomNCalled != GameGenerator.getInstance().getCountOfRandom()){
                        DebugUtil.log("CONFLICT RANDOM: ", true);
                        DebugUtil.log("SERVER: skillRandomNCalled: " + packet.skillRandomNCalled, true);
                        DebugUtil.log("CLIENT: skillRandomNCalled: " + GameGenerator.getInstance().getCountOfRandom(), true);

                        var stringLog = DebugUtil.getTrackLog();
                        gv.gameClient.sendTrackLog(stringLog);

                        //reconnect when conflict
                        if (!gv.guiMgr.getGuiById(GuiId.CONFLICT))
                            gv.guiMgr.addGui(new GuiConflict("CONFLICT RANDOM"), GuiId.CONFLICT, LayerId.LAYER_LOADING);

                        return;
                    }
                    //log thoi gian thuc hien 1 turn
                    cc.log("Time Action In Turn: " + (new Date().getTime()/1000 - gv.matchMng.nextTurnTime).toFixed(2) + " s");
                    gv.matchMng.nextTurnTime = new Date().getTime()/1000;

                    gv.matchMng.startNewTurn(packet.playerIndex, packet.canPayToSummon);

                    break;
                case gv.CMD.MATCH_END_GAME:
                    var localWinnerIndex = gv.matchMng.mapper.convertGlobalStandPosToLocalIndex(packet.winnerID);
                    var winingType = packet.winingType;
                    gv.matchMng.endGame(localWinnerIndex,winingType);
                    break;
                case gv.CMD.PLAYER_ROLL_DICE_COMMON:
                    gv.matchMng.startAnimationRollDice(packet.diceResult);
                    break;
                case gv.CMD.PLAYER_RESPONSE_SKILL:
                    DebugUtil.log("NOT USE THIS PACKET");
                    //gv.matchMng.skillManager.curActiveSkill.onResponseSkillResult(packet.option);
                    break;
                case gv.CMD.PLAYER_TUXI_MINI_GAME:
                {
                    gv.matchMng.minigameTuXiMgr.updateSelectionList(packet.playerStandPos, packet.selection);
                    break;
                }
                case gv.CMD.HORSERACE_MINIGAME_PLAY:
                {
                    gv.matchMng.horseRaceGameMgr.updateSelectionList(packet.playerStandPos, packet.selection);
                    break;
                }
                case gv.CMD.PLAYER_CONTROL_CELL:{
                    //pk = gv.poolObjects.get(CmdReceiveControlCell);
                    //break;
                    cc.log("CUONG NHAN PACKET    " + packet.cellPos);
                    if(packet.cellPos < 0){
                        gv.matchMng.tileUpMgr.disableHintStone();
                        gv.matchMng.tileUpMgr.callback();
                    }else{
                        var localIndex = gv.matchMng.mapper.convertGlobalToLocalSlotIndex(packet.cellPos);
                        var tile = gv.matchMng.mapper.getTileForSlot(localIndex);
                        gv.matchMng.tileUpMgr.resetTileUp(Math.floor(localIndex/10));
                        tile.display.setTileUp();
                    }
                    break;
                }
                case gv.CMD.PLAYER_PAY_TO_SUMMON:{
                    if (packet.hasPaying){
                        ChangeGoldMgr.getInstance().addChangeGoldElement(gv.matchMng.currTurnPlayerIndex, -packet.payFee);
                        ChangeGoldMgr.getInstance().activeChangeGoldInfo(function () {
                            var piece = gv.matchMng.mainBoard.boardData.getPieceOfPlayer(gv.matchMng.currTurnPlayerIndex, packet.pieceIndex);
                            gv.matchMng.mainBoard.forceSummon(piece);
                        }.bind(this));
                    }
                    else{
                        var currStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(gv.matchMng.currTurnPlayerIndex);
                        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                        if (gv.matchMng.isMineTurn()){
                            guiMainBoard.setEnableDiceControl();
                            gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(currStandPos, GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION)
                                , function(){
                                    gv.gameClient.sendCommonRollDiceRequest(0);
                                });
                        }
                        else{
                            guiMainBoard.setDisableDiceControl();
                            gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).runProgressBar(currStandPos, TimeoutConfig.TIMEOUT_ACTION, null);
                            guiMainBoard.showWaitingBubble(BubbleType.WAIT_DICE_ROLL);
                        }
                        gv.gameClient._clientListener.dispatchPacketInQueue();
                    }
                    break;
                }
                default:
                    cc.assert("Invalid queued Command Id");
            }
        },

        // Action hien ra xong roi moi lay va xu ly goi tin
        dispatchPacketInQueue : function(){
            var result=-1;
            if(this.packetQueue.length!=0){
                var packet = this.packetQueue.shift();
                cc.log("[PACKET] dispatch packet in queue: "+packet.getCmdId());
                result = packet.getCmdId();
                this.dumpPacketQueue();
                this.dispatchMatchPacket(packet);
            }
            else{
                this.waitingForPacket=true;
                cc.log("[PACKET] Packet queue is empty!");
            }

            return result;
        },

        //chi kiem tra xem packet nao tiep theo duoc su dung
        getNextPacketIdInQueue: function(){
            if(this.packetQueue.length!=0){
                return this.packetQueue[0].getCmdId();
            }
            return -1;
        },

        dumpPacketQueue : function(){
            var logText="[";
            for(var i=0; i< this.packetQueue.length; i++)
                logText+=(this.packetQueue[i].getCmdId()+" ");
            logText+="]";

            cc.log(logText);
        },

        clearPacketQueue : function(){
            this.packetQueue=[];
        }

    }
)