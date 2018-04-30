/**
 * Created by GSN on 1/29/2016.
 */

var RestRoom = cc.Class.extend({
    standPos_player : [],

    ctor : function(){
        this.standPos_player = [];
    },

    init : function(){
        /*
        var mainBoardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        for(var i=0; i< MAX_NUMBER_PLAYER; i++)
            mainBoardGui.removePlayerInRestRoom(i);
        */
    },

    addPlayer : function(playerStatusObj){
        var localStandPos = gv.matchMng.mapper.convertGlobalToLocalStandPos(playerStatusObj.index);
        cc.assert(this.standPos_player[localStandPos] == undefined || this.standPos_player[localStandPos] == null, "RestRoom.addPlayer: already have player at standpos: "+localStandPos);
        this.standPos_player[localStandPos] = playerStatusObj;

        var guiPlayerInfoPanel = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL);
        guiPlayerInfoPanel.addPlayerInRestRoom(localStandPos, playerStatusObj);

        var guiRestRoom = gv.guiMgr.getGuiById(GuiId.REST_ROOM);
        guiRestRoom.addPlayerInRestRoom();
    },

    removePlayer : function(gStandPos){
        var localStandPos = gv.matchMng.mapper.convertGlobalToLocalStandPos(gStandPos);
        cc.assert(this.standPos_player[localStandPos] != undefined && this.standPos_player[localStandPos] !=null, "RestRoom.removePlayer: no player at standPos: "+localStandPos);
        if(localStandPos == 0){
            gv.matchMng.leaveMatch();
        }
        else{
            this.standPos_player[localStandPos] = null;
            var guiPlayerInfoPanel = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL);
            guiPlayerInfoPanel.removePlayerInRestRoom(localStandPos);

            var guiRestRoom = gv.guiMgr.getGuiById(GuiId.REST_ROOM);
            guiRestRoom.removePlayerInRestRoom();
        }
    },

    getListPlayerInRoom : function(){
        var returnList = [];
        for(var key in this.standPos_player){
            if (this.standPos_player[key])
                returnList.push(this.standPos_player[key]);
        }
        return returnList;
    },

    getNumberPlayerInRoom: function(){
        return this.getListPlayerInRoom().length;
    },


    getPlayerStatusAtStandPos : function(localStandPos){
        return this.standPos_player[localStandPos];
    },

    showGuiChooseCard : function(winnerStandPos){
        cc.log("SHOW FLIP CARD GUI");
        gv.guiMgr.addGui(new GuiChooseCard(winnerStandPos, gv.matchMng.playerManager.getMineGlobalStandPos(), gv.matchMng.playerManager.getNumberPlayer()), GuiId.CHOOSE_CARD, LayerId.LAYER_GUI);
    }
});