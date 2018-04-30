/**
 * Created by KienVN on 5/21/2015.
 */

var GameClient;
GameClient = cc.Class.extend(
    {
        ctor: function () {
            this.loadConfig();

            this._tcpClient = fr.GsnClient.create();
            this._clientListener = new GameClientListener();
            this._tcpClient.setFinishConnectListener(this._clientListener.onFinishConnect);
            this._tcpClient.setDisconnectListener(this._clientListener.onDisconnected.bind(this, gv.DISCONNECT_REASON.IDLE));
            this._tcpClient.setReceiveDataListener(this._clientListener.onReceived);
            this.packetFactory = new InPacketFactory();
            this.heartBeatDelay = 0;
            return true;
        },
        setUserLogin: function (userName) {
            cc.log("Send login: "+userName);
            this._userName = userName;
        },
        loadConfig: function () {
            var commonData = {};

            var fileName;
            if (cc.sys.os == cc.sys.OS_WINDOWS)
                fileName = "ipConfig_win.json";
            else if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
                fileName = "ipConfig_mobile.json";

            if (!jsb.fileUtils.isFileExist(fileName)) {
                cc.log("File config not exist!!!!");
                return null;
            }
            cc.loader.loadJson(fileName, function (error, jsonData) {
                if (error != null) {
                    cc.log("Load ip config error");
                }
                else {
                    commonData = jsonData;
                }
            });
            this._serverName = commonData.server;
            this._port = commonData.port;
        },
        getNetwork: function () {
            return this._tcpClient;
        },
        connect: function () {
            cc.log("Connect to server: " + this._serverName + ":" + this._port);
            this._tcpClient.connect(this._serverName, this._port);

        },
        sendPacket: function (pk) {
            gv.gameClient.getNetwork().send(pk);
            gv.poolObjects.push(pk);
        },
        getInPacket: function (cmd, pkg) {
            return this.packetFactory.createPacket(cmd, pkg);
        },
        getOutPacket: function (objClass) {
            var pk = gv.poolObjects.get(objClass);
            pk.reset();
            return pk;
        },

        ///////////////////////////////////////////////////
        startHeartBeat : function(){
            this.heartBeatDelay = 0;
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateHeartBeat, 5.0);
        },

        endHeartBeat : function(){
            this.heartBeatDelay = 0;
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.updateHeartBeat);
        },

        updateHeartBeat : function(dt){
            var pk = this.getOutPacket(CmdSendPing);
            pk.putData();
            this.sendPacket(pk);
            cc.log("PING!\n");

            this.heartBeatDelay+=dt;
            if(this.heartBeatDelay > TimeoutConfig.MAX_HEART_BEAT_DELAY){
                this.endHeartBeat();
                this._clientListener.onDisconnected(gv.DISCONNECT_REASON.IDLE);
            }
        },

        resetHeartBeatDelay : function(){
            this.heartBeatDelay = 0;
        },

        sendLoginRequest: function () {
            var pk = this.getOutPacket(CmdSendLogin);
            pk.putData(this._userName);
            this.sendPacket(pk);
        },

        sendLogoutRequest: function () {
            var pk = this.getOutPacket(CmdSendLogout);
            pk.putData();
            this.sendPacket(pk);
        },

        sendGetPlayerData: function(){
            var pk = this.getOutPacket(CmdSendGetPlayerData);
            pk.putData();
            this.sendPacket(pk);
        },

        sendGetFriendListData: function(friendIds){
            var pk = this.getOutPacket(CmdSendGetFriendListData);
            pk.putData(friendIds);
            this.sendPacket(pk);
        },

        sendPlayInstantly : function(gameMode, botMode, testcaseID){
            var pk = this.getOutPacket(CmdQuickPlay);
            pk.putData(gameMode, botMode, testcaseID);
            this.sendPacket(pk);
        },

        sendPlayerLeaveGame: function(){
            var pk = this.getOutPacket(CmdSendPlayerLeaveGame);
            pk.putData();
            this.sendPacket(pk);
        },

        sendActivePiece : function(pieceIndex, solutionId,zoo){
            cc.log("Send Active Piece: pieceIndex = "+pieceIndex + ", solutionId = "+solutionId);
            var pk= this.getOutPacket(CmdActivePiece);
            pk.putData(pieceIndex, solutionId,zoo);
            this.sendPacket(pk);
        },

        sendCommonRollDiceRequest : function(rangeValue){
            var pk=this.getOutPacket(CmdCommonRollDice);
            pk.putData(rangeValue);
            this.sendPacket(pk);
        },

        sendCommonRollDiceCheat : function(score1, score2){
            var pk = this.getOutPacket(CmdCommonRollDiceCheat);
            pk.putData(score1, score2);
            this.sendPacket(pk);
        },

        sendFortuneRollDiceRequest : function(){
            var pk = this.getOutPacket(CmdFortuneRollDice);
            pk.putData();
            this.sendPacket(pk);
        },

        sendFortuneRollDiceCheat : function(score){
            var pk = this.getOutPacket(CmdFortuneRollDiceCheat);
            pk.putData(score);
            this.sendPacket(pk);
        },

        sendCheatActiveSkill: function(isOn){
            var pk = this.getOutPacket(CmdSendCheatActiveSkill);
            pk.putData(isOn);
            this.sendPacket(pk);
        },

        sendPlayerResponseSkill : function(option){
            var pk = this.getOutPacket(CmdPlayerResponseSkill);
            pk.putData(option);
            this.sendPacket(pk);
        },

        sendMatchPlayAsAI : function(){
            cc.log("sendMatchPlayAsAI");
            var pk = this.getOutPacket(CmdMatchPlayAsAI);
            pk.putData();
            this.sendPacket(pk);
        },

        sendActiveFoc : function(isActive){
            var pk = this.getOutPacket(CmdMatchFocActive);
            pk.putData(isActive);
            this.sendPacket(pk);
        },

        sendUseFocSkill : function(param){
            var pk = this.getOutPacket(CmdMatchFocUseSkill);
            pk.putData(param);
            this.sendPacket(pk);
        },

        sendPlayerBankRuptExit : function(){
            var pk = this.getOutPacket(CmdPlayerBankRuptExit);
            pk.putData();
            this.sendPacket(pk);
        },

        sendTrackLog : function(logText){
            var pk = this.getOutPacket(CmdReportConflict);
            pk.putData(logText);
            this.sendPacket(pk);
        },

        //Send goi tin chon mat trong minigame
        sendMiniGameSelection :function(param)
        {
            var pk = this.getOutPacket(CmdSendSelectMiniGame);
            pk.putData(param);
            this.sendPacket(pk);
        },

        sendGetAllCharacter : function(){
            var pk = this.getOutPacket(CmdSendGetAllCharacter);
            pk.putData();
            this.sendPacket(pk);
        },

        sendPickMainCharacter : function(charUid){
            var pk = this.getOutPacket(CmdSendPickMainCharacter);
            pk.putData(charUid);
            this.sendPacket(pk);
        },

        sendUpgradeCharacter : function(charUid, listCharMaterial){
            var pk = this.getOutPacket(CmdSendUpgradeCharacter);
            pk.putData(charUid, listCharMaterial);
            this.sendPacket(pk);
        },

        sendSellCharacter : function(listCharUid){
            var pk = this.getOutPacket(CmdSendSellCharacter);
            pk.putData(listCharUid);
            this.sendPacket(pk);
        },

        sendDoGaCha : function(type){
            var pk = this.getOutPacket(CmdSendDoGaCha);
            pk.putData(type);
            this.sendPacket(pk);
        },

        sendCheatCharacter : function(charID, skillList){
            var pk = this.getOutPacket(CmdSendCheatCharacter);
            pk.putData(charID, skillList);
            this.sendPacket(pk);
        },

        sendGetEventData : function(){
            var pk = this.getOutPacket(CmdSendGetEvent);
            pk.putData();
            this.sendPacket(pk);
        },

        sendGetGlobalRank : function(page){
            var pk = this.getOutPacket(CmdSendGetGlobalRank);
            pk.putData(page);
            this.sendPacket(pk);
        },

        sendGetMailData : function(){
            var pk = this.getOutPacket(CmdSendGetMailData);
            pk.putData();
            this.sendPacket(pk);
        },

        sendReceiveMailItem : function(itemUID){
            var pk = this.getOutPacket(CmdSendReceiveMailItem);
            pk.putData(itemUID);
            this.sendPacket(pk);
        },

        sendDailyCheckin : function(){
            var pk = this.getOutPacket(CmdSendDailyCheckin);
            pk.putData();
            this.sendPacket(pk);
        },

        sendDailySupportClaim : function(){
            var pk = this.getOutPacket(CmdSendDailySupportClaim);
            pk.putData();
            this.sendPacket(pk);
        },

        sendInviteFriendClaim : function(benefitID){
            var pk = this.getOutPacket(CmdSendInviteFriendClaim);
            pk.putData(benefitID);
            this.sendPacket(pk);
        },

        sendPayingAccumulateClaim : function(benefitID){
            var pk = this.getOutPacket(CmdSendPayingAccumulateClaim);
            pk.putData(benefitID);
            this.sendPacket(pk);
        },

        sendSelfieCharacterClaim : function(){
            var pk = this.getOutPacket(CmdSendSelfieCharacterClaim);
            pk.putData();
            this.sendPacket(pk);
        },

        sendUpdateNumberInvitedFriend : function(totalInvited){
            var pk = this.getOutPacket(CmdSendUpdateNumberInvitedFriend);
            pk.putData(totalInvited);
            this.sendPacket(pk);
        },

        sendPaymentUpdate : function(){
            var pk = this.getOutPacket(CmdSendPaymentUpdate);
            pk.putData();
            this.sendPacket(pk);
        },


        sendGetAllDice : function(){
            var pk = this.getOutPacket(CmdSendGetAllDice);
            pk.putData();
            this.sendPacket(pk);
        },

        sendPickDice : function(diceId){
            var pk = this.getOutPacket(CmdSendPickDice);
            pk.putData(diceId);
            this.sendPacket(pk);
        },

        sendVipDailyGiftClaim: function(){
            var pk = this.getOutPacket(CmdSendVipDailyGiftClaim);
            pk.putData();
            this.sendPacket(pk);
        },

        sendUserCheatPayment: function(caseId, grossAmount){
            var pk = this.getOutPacket(CmdSendUserCheatPayment);
            pk.putData(caseId, grossAmount);
            this.sendPacket(pk);
        },

        sendBuyGoldPack: function(goldPackId){
            var pk = this.getOutPacket(CmdSendBuyGoldPack);
            pk.putData(goldPackId);
            this.sendPacket(pk);
        },

        sendCheatWinner : function(){
            var pk = this.getOutPacket(CmdSendCheatWinner);
            pk.putData();
            this.sendPacket(pk);
        },

        //cuong send packet chat
        sendPacketChat: function(idChatIcon){
            var pk = this.getOutPacket(CmdSendChatUser);
            pk.putData(idChatIcon);
            this.sendPacket(pk);
        },
        // cuong sen packet minigame 2
        sendPacketSingleMinigame: function(buttonValue){
            var pk = this.getOutPacket(CmdSendSingleMinigame);
            pk.putData(buttonValue);
            this.sendPacket(pk);
        },
        sendPacketSingleMinigameBet: function(buttonValue){
            var pk = this.getOutPacket(CmdSendSingleMinigameBet);
            pk.putData(buttonValue);
            this.sendPacket(pk);
        },

        sendPacketAutoplay:function(isAutoPlay){
            var pk = this.getOutPacket(CmdSendAutoMode);
            pk.putData(isAutoPlay);
            this.sendPacket(pk);
        },

        sendPacketRollDiceEven:function(cheat){
            var pk = this.getOutPacket(CmdSendRollDiceEven);
            pk.putData(cheat);
            this.sendPacket(pk);
        },

        sendPacketGetSpecialEvenData:function(){
            var pk = this.getOutPacket(CmdSendGetSpecialEvenData);
            pk.putData();
            this.sendPacket(pk);
        },

        sendPacketMiniGameTuXi:function(chosen){
            var pk = this.getOutPacket(CmdSendMiniGameTuXi);
            pk.putData(chosen);
            this.sendPacket(pk);
        },

        sendPacketControlSell:function(globalIndex){
            var pk = this.getOutPacket(CmdSendPlayerControlCell);
            pk.putData(globalIndex);
            this.sendPacket(pk);

        },

        sendPlayerPayToSummon:function(hasPaying){
            var pk = this.getOutPacket(CmdSendPlayerPayToSummon);
            pk.putData(hasPaying);
            this.sendPacket(pk);

        }
    }
);