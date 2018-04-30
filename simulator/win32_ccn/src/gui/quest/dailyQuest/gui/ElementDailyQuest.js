var ElementDailyQuest = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_ELEMENT_DAILY_QUEST);
        this.loadGuiElement();
    },
    loadGuiElement: function () {
        this.pnElement = this._rootNode.getChildByName("pnElement");
    },
    setInfo: function (info) {

    },
    getElementContentSize: function () {
        return this.pnElement.getContentSize();
    }
});