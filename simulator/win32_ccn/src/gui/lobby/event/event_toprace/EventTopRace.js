/**
 * Created by CPU11644_LOCAL on 8/29/2017.
 */
var EventTopRace = cc.Class.extend({
    ctor: function() {
        this.timeRemain = 0;
        this.myRank = 1;
        this.topList = [];
        this.isClaimed = false;

        //this.config =

        gv.gameClient.sendGetEventTopRaceInfo();
    },

    setData: function(data) {
        this.timeRemain = data.timeRemain;
        this.myRank = data.myRank;
        this.topList = data.topList;
        this.isClaimed = data.isClaimed;
    },

    showGuiEvent: function() {
        if(this.timeRemain > 0) {
            gv.guiMgr.addGui(new GuiEventTopRace(), GuiId.GUI_EVENT_TOP_RACE, LayerId.LAYER_GUI);
        }
    },

    showPopupEventOpening: function() {
        if(this.timeRemain > 0) {
            gv.guiMgr.addGui(new PopupEventTopRace(), GuiId.POPUP_EVENT_TOP_RACE, LayerId.LAYER_POPUP_ONE_BY_ONE);
        }
    },

    showPopupFillInfo: function() {
        if(this.timeRemain == 0 && !this.isClaimed) {
            gv.guiMgr.addGui(new PopupFillPlayerInfo(), GuiId.POPUP_FILL_PLAYER_INFO, LayerId.LAYER_POPUP_ONE_BY_ONE);
        }
    }
});