/**
 * custom table view
 * */
var DailyQuestTableView = CustomTableView.extend({
    _className: "DailyQuestTableView",

    ctor: function (colNum, contentSizeWidth, contentSizeHeight, direction, marginLeft, marginRight, marginTop, marginBottom) {
        this._super(colNum, contentSizeWidth, contentSizeHeight, direction, marginLeft, marginRight, marginTop, marginBottom);
        this._cellHeight = 300;
    },

    sortList: function (isRising) {
        this._elementList.sort(function (a, b) {
            if (isRising) {
                if (a._level > b._level) {
                    return 1;
                }
                if (a._level < b._level) {
                    return -1;
                }
                return 0;
            } else {
                if (a._level < b._level) {
                    return 1;
                }
                if (a._level > b._level) {
                    return -1;
                }
                return 0;
            }
        });
    },

    tableCellSizeForIndex: function (table, idx) {
        //if(idx) {
            return cc.size(this._cellHeight, this._cellHeight);
        //}else{
        //    return cc.size(this._cellHeight, this._cellHeight - 7);
        //}
    },

    tableCellAtIndex: function (table, idx) {
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new DailyQuestCell(this);
        }
        var element = cell.getChildByTag(121);
        element.setInfo(this._elementList[idx],idx +1);
        return cell;
    }
});
