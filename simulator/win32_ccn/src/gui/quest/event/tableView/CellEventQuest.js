/**
 * Custom table view cell for table view
 * */
var EventQuestCell = cc.TableViewCell.extend({
    ctor: function (parent_) {
        this._super();
        this._parentView = parent_;
        if (!this._parentView) return;
        var cellWidth = Math.floor(this._parentView._contentSizeHeight - this._parentView._marginLeft - this._parentView._marginRight);
        this.setContentSize(cellWidth, this._parentView._contentSizeHeight);
        this.addChild(new ElementEventQuest(),0, 121);
    },
    draw: function (ctx) {
        this._super(ctx);
    }
});