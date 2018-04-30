var TurnLightMgr = cc.Class.extend({

    ctor : function(){
        this.listLightPlayer = [];   // list index cua light
        //this.listLightSprite = [];   // tuong ung se co 1 list hinh anh ^^
        this.initTurnLight();
        this.isWarningLight = false;
        this.currentWarning = -1;
    },

    initTurnLight : function(){
        for (var i =0;i<MAX_NUMBER_PLAYER;i++){
            this.listLightPlayer[i] = -1; // luu theo stanpos
        }
    },

    initStartGame:function(){
        for(var i =0;i<gv.matchMng.playerManager.getNumberPlayer();i++){
            //cc.log("CUONG    ");
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i);
            //this.listLightPlayer[playerInfo.standPos] = i;
            this.changeLightIndex(i,playerInfo.standPos,null,false);
            cc.log("playerIndex,summonIndex " + i + "    " + playerInfo.standPos);
        }
    },

    //changeLightIndexWithNoPopup
    changeLightIndex:function(playerIndex,summonIndex,callback,needPopup){
        cc.log("playerIndex,summonIndex " + playerIndex + "    " + summonIndex);
        if(this.listLightPlayer[summonIndex] == playerIndex){
            if(callback!=null){
                callback();
            }
            return;
        }
        if(this.listLightPlayer[summonIndex]== this.currentWarning){
            this.isWarningLight = false;
            this.currentWarning = -1;
        }
        if(needPopup!=null){
            if(needPopup){
                var popupTurnLight = new PopupTurnLight(this.listLightPlayer[summonIndex],playerIndex,summonIndex);
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(popupTurnLight,10000);
                this.listLightPlayer[summonIndex] = playerIndex;
                GameUtil.callFunctionWithDelay(3.2,function(){
                    var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
                    this.getTileForHomgateAndColor(summonIndex,playerInfo.playerColor,callback);
                }.bind(this));
            }
            else{
                this.listLightPlayer[summonIndex] = playerIndex;
                var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
                this.getTileForHomgateAndColor(summonIndex,playerInfo.playerColor,callback);
            }
        }else{
            this.listLightPlayer[summonIndex] = playerIndex;
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
            this.getTileForHomgateAndColor(summonIndex,playerInfo.playerColor,callback);
        }

    },

    getTileForHomgateAndColor:function(standPos,color,callback){
        var homeGateTile = gv.matchMng.mapper.getTileForSlot((standPos*10+39)%40);
        homeGateTile.display.addHomeGateLight(color);
        GameUtil.callFunctionWithDelay(1,function(){
            homeGateTile.display.changeTileLightColor(color);
            if(callback!=null){
                callback();
            }
        }.bind(this));
    },

    // 2 ham nay se chay vao luc endturn cua player

    getStandPosNeedRunEffect:function(playerIndex){
        for(var i = 0;i<this.listLightPlayer.length;i++){
            if(this.listLightPlayer[i] != playerIndex){
                return i;
            }
        }
    },
    runEffectWarning:function(playerIndex){
        cc.log("runEffectWarning");
        var callback = function(){
            var standPos = this.getStandPosNeedRunEffect(playerIndex);
            var color = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerColor;
            var homeGateTile = gv.matchMng.mapper.getTileForSlot((standPos*10+39)%40);
            homeGateTile.display.addHomeGateLight(color);
        }.bind(this);
        EffectMgr.getInstance().showEffect(EffectType.SAP_DU_4_DEN,callback);

    },

    checkWarningLightPlayer:function(playerIndex){
        if(this.isWarningLight){
            return false;
        }
        //cc.log("warningLight")
        var count = 0;
        for(var i = 0;i<this.listLightPlayer.length;i++){
            if (playerIndex == this.listLightPlayer[i]){
                count++;
            }
        }
        cc.log("currentCount With playerindex  =  "  + count);
        if(count==3){
            this.currentWarning = playerIndex;
            this.isWarningLight = true;
            this.runEffectWarning(playerIndex);
            return true;
        }
        return false;
    },

    warningLight:function(playerIndex){
        return this.checkWarningLightPlayer(playerIndex);
    },

    reconnect:function(listPlayer){
        cc.log("reconnect turnLightMgr");
        this.listLightPlayer = listPlayer;
        for(var i=0;i<this.listLightPlayer.length;i++){
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.listLightPlayer[i]);
            this.getTileForHomgateAndColor(i,playerInfo.playerColor);
        }
    }

});