/**
 * Created by CPU11644_LOCAL on 8/28/2017.
 */
var GuiEventTopRace = BaseGui.extend({
    ctor: function() {
        this._super(res.ZCSD_GUI_TOP_RACE);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");
        this.bg.getChildByName("btnBack").addClickEventListener(this.destroy.bind(this));

        this.initRankTable();
        this.initGiftDescription();
    },

    initRankTable: function() {

    },

    initGiftDescription: function() {

    },

    updateMyInfo: function(myInfo) {

    },

    showTopRank: function(topData) {

    },

    updateAroundMe: function(aroundData) {

    },





});