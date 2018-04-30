var ElementEventQuest = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_ELEMENT_EVENT_QUEST);
        this.loadGuiElement();
    },
    loadGuiElement: function () {
        this.pnElement = this._rootNode.getChildByName("pnElement");
    },
    setInfo: function () {

    },
    getElementContentSize: function () {
        return this.pnElement.getContentSize();
    }
});