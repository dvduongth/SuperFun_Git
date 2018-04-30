/**
 * custom table view
 * */
var CustomTableView = cc.Layer.extend({
    _className: "CustomTableView",
    /**
     * constructor with custom parameter
     * @param {int} colNum ColNum is number of col for each row of matrix
     * @param {float} contentSizeWidth
     * @param {float} contentSizeHeight
     * @param {cc.SCROLLVIEW_DIRECTION_NONE | cc.SCROLLVIEW_DIRECTION_VERTICAL | cc.SCROLLVIEW_DIRECTION_HORIZONTAL | cc.SCROLLVIEW_DIRECTION_BOTH} direction
     * @param {float} marginLeft
     * @param {float} marginRight
     * @param {float} marginTop
     * @param {float} marginBottom
     */
    ctor: function (colNum, contentSizeWidth, contentSizeHeight, direction, marginLeft, marginRight, marginTop, marginBottom) {
        this._super();

        this._tableView = null;
        this._elementNum = 0;
        this._elementList = [];
        //set default values if isNeed
        //init colNum value
        this._colNum = (colNum === undefined) ? 1 : colNum;
        //init contentSizeWidth value
        this._contentSizeWidth = (contentSizeWidth === undefined) ? gv.WIN_SIZE.width : contentSizeWidth;
        //init contentSizeHeight value
        this._contentSizeHeight = (contentSizeHeight === undefined) ? gv.WIN_SIZE.height : contentSizeHeight;
        //init direction value
        this._directionValue = (direction === undefined) ? cc.SCROLLVIEW_DIRECTION_VERTICAL : direction;
        //init margin
        this._marginLeft = (marginLeft === undefined) ? 0 : marginLeft;
        this._marginRight = (marginRight === undefined) ? 0 : marginRight;
        this._marginTop = (marginTop === undefined) ? 0 : marginTop;
        this._marginBottom = (marginBottom === undefined) ? 0 : marginBottom;

        //this.setContentSize(this._contentSizeWidth, this._contentSizeHeight);
        this.setOtherDefaultValues();
        this.initValues();
    },

    initValues: function () {
        this._tableView = new cc.TableView(this, cc.size(this._contentSizeWidth, this._contentSizeHeight));
        //this._tableView.anchorX = 0;
        //this._tableView.anchorY = 0;
        this._tableView.x = 0;
        this._tableView.y = 0;

        this._tableView.setDirection(this._directionValue);
        this._tableView.setDelegate(this);
        if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL)
            this._tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this._tableView);
        //this._tableView.reloadData();

        return true;
    },
    setContentSize: function (width, height) {
        this._super(width, height);
        if (this._tableView) {
            this._tableView.setViewSize(cc.size(width, height));
            this._contentSizeWidth = width;
            this._contentSizeHeight = height;
            this.reloadData(true);
        }
    },
    setOtherDefaultValues: function () {
        this.anchorX = 0.0;
        this.anchorY = 0.0;
        this._elementWidth = 100;
        this._elementHeight = 100;
        this._cellHeight = 100;
        this._cellNum = Math.ceil(this.getNumberOfElement() / this._colNum);
    },

    setElementList: function (listItem_) {
        if (listItem_) {
            if (this._elementList.length > 0) this._elementList.splice(0);
            this._elementList = [];

            this._elementNum = listItem_.length.valueOf();
            //append item into list view
            for (var i = 0; i < this._elementNum; ++i) {
                this._elementList.push(listItem_[i]);
            }
        }
        this._tableView.reloadData();
    },

    setTouchEnabled: function (eff) {
        this._tableView.setTouchEnabled(eff);
    },
    setSwallowTouches: function (eff) {
    },
    setBounceEnabled: function (eff) {
        this._tableView.setBounceable(eff);
    },
    setContentOffset: function(contentOffset, isAnimate){
        this._tableView.setContentOffset(contentOffset, isAnimate);
    },

    //updateElementList:function(listItem){
    //    if(listItem){
    //        var curLength = this._elementList.length;
    //        var newLength = listItem.length;
    //
    //        if(curLength > 0) this._elementList.splice(0);
    //            this._elementList = [];
    //
    //        for
    //    }
    //},
    resetView: function () {
        this.reloadData();
    },
    reloadData: function (isKeepOffset, isScrollToEndView, isAnimate) {
        //get old offset
        var contentOffset = this._tableView.getContentOffset();
        //reload view
        this._tableView.reloadData();
        //check new offset

        if (isScrollToEndView) {
            if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
                var newX = this._contentSizeWidth - this._tableView.getContentSize().width;
                contentOffset.x = (this._contentSizeWidth + 15) < this._tableView.getContentSize().width ? newX : 0;
                isAnimate && contentOffset.x != 0 && this._tableView.setContentOffset(cc.p(contentOffset.x + 100, contentOffset.y), false);
                this._tableView.setContentOffset(contentOffset, isAnimate);
            } else {
                var newX = this._contentSizeWidth - this._tableView.getContentSize().width;
                contentOffset.x = (this._contentSizeWidth + 15) < this._tableView.getContentSize().width ? newX : contentOffset.x;
                isAnimate && contentOffset.x != 0 && this._tableView.setContentOffset(cc.p(contentOffset.x - 100, contentOffset.y), false);
                this._tableView.setContentOffset(contentOffset, isAnimate);
            }
        } else {
            if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
                if (this.getNumberCell() * this._cellHeight < this._contentSizeHeight) {
                    isKeepOffset = false;
                    return false;
                }
            } else {
                if (this.getNumberCell() * this._cellHeight < this._contentSizeWidth) {
                    isKeepOffset = false;
                    return false;
                }
            }
            if (isKeepOffset) {
                if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
                    var newY = -(this._tableView.getContentSize().height - this._contentSizeHeight);
                    contentOffset.y = Math.abs(newY) < Math.abs(contentOffset.y) ? newY : contentOffset.y;
                    //set offset again
                    if (isAnimate) {
                        this._tableView.setContentOffset(cc.p(contentOffset.x, contentOffset.y + 223), false);
                        /*}else{
                         this._tableView.setContentOffset(cc.p(contentOffset.x - 100, contentOffset.y), false);
                         }*/
                    }
                } else {
                    var newX = -(this._tableView.getContentSize().width - this._contentSizeWidth);
                    contentOffset.x = Math.abs(newX) < Math.abs(contentOffset.x) ? newX : contentOffset.x;
                    //set offset again
                    if (isAnimate) {
                        this._tableView.setContentOffset(cc.p(contentOffset.x - 100, contentOffset.y), false);
                    }
                }
                this._tableView.setContentOffset(contentOffset, isAnimate);
            }
        }
    },

    scrollToBottom: function (isAnimate) {
        if (this.getNumberCell() * this._cellHeight < this._contentSizeHeight) {
            return false;
        }
        var contentOffset = this._tableView.getContentOffset();
        contentOffset.y = 0;
        this._tableView.setContentOffset(contentOffset, isAnimate);
    },

    setClassName: function (name_) {
        this._className = name_;
    },

    scrollViewDidScroll: function (view) {
    },
    scrollViewDidZoom: function (view) {
    },

    tableCellTouched: function (table, cell) {
        //this.reloadData(true);
        //var idx_ = cell.getIdx();
        //if (idx_ > 0) {
        //    this.updateCellForIndex(idx_ - 1);
        //}
        //this.updateCellForIndex(idx_);
    },

    tableCellSizeForIndex: function (table, idx) {
        //override me with object of cc.size
        return cc.size(this._contentSizeWidth, this._cellHeight);
    },

    tableCellAtIndex: function (table, idx) {
        //override me and return an object of type cc.TableViewCell
    },

    getCellAtIndex: function (idx) {
        return this._tableView.cellAtIndex(idx);
    },

    insertCellForIndex: function (idx) {
        this._tableView.insertCellAtIndex(idx);
    },

    removeCellForIndex: function (idx) {
        this._tableView.removeCellAtIndex(idx);
    },

    updateCellForIndex: function (idx) {
        this._tableView.updateCellAtIndex(idx);
    },

    numberOfCellsInTableView: function (table) {
        this._cellNum = Math.ceil(this.getNumberOfElement() / this._colNum);
        return this._cellNum;
    },
    appendCustomElement: function (customElement) {
        if (customElement == null) {
            return;
        }
        this._elementList.push(customElement);
    },
    updateCellFromIndex: function (idx) {
        if (!idx || idx < 0 || idx > this._cellNum) return;
        for (var i = idx; i < this._cellNum; ++i) this.updateCellForIndex(i);
    },
    getClassName: function () {
        return this._className;
    },
    getList: function () {
        return this._elementList;
    },
    getNumberOfElement: function () {
        return this._elementList.length;
    },
    getNumberCell: function () {
        return this._cellNum;
    },
    insertCustomElement: function (customElement, index_) {
        if (customElement == null) return;
        if (index_ > this._elementList.length) index_ = this._elementList.length;
        this._elementList.splice(index_, 0, customElement);
        //var indexCellUpdate = Math.ceil(index_ / this._colNum);
    },
    getElementGuiById: function (id) {
        return this.getElementGuiByProperty("_id", id);
    },
    getElementGuiByProperty: function (property, value) {
        var indexOfList = this.getIndexOfElementByProperty(property, value);
        if(indexOfList >= 0) {
            var indexCell = Math.floor(indexOfList / this._colNum);
            var indexElement = (indexOfList % this._colNum + 1);
            var cell = this.getCellAtIndex(indexCell);
            if(!cell) {
                //cell at index indexCell not yet create
                this.scrollToCellAtIndex(indexCell);
                cell = this.getCellAtIndex(indexCell);
                if(!cell) {
                    return false;
                }
            }
            return cell.getChildByTag(indexElement);
        }
        return false;
    },
    getElementById: function (id_) {
        if (id_ == null)
            return null;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_]._id === id_) {
                    return this._elementList[index_];
                }
            }
        }
        return null;
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * */
    getElementByProperty: function (property_, value) {
        if (property_ == null)
            return null;
        if (value == null)
            return null;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_][property_] === value) {
                    return this._elementList[index_];
                }
            }
        }
        return null;
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * */
    getIndexOfElementByProperty: function (property_, value) {
        if (property_ == null)
            return -1;
        if (value == null)
            return -1;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_][property_] === value) {
                    return index_;
                }
            }
        }
        return -1;
    },
    getIndexOfElementById: function (id_) {
        if (id_ == null)
            return -1;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_]._id === id_) {
                    return index_;
                }
            }
        }
        return -1;
    },
    getContentOffset: function () {
        return this._tableView.getContentOffset();
    },
    getContentSizeOfTableView: function () {
        return this._tableView.getContentSize();
    },

    removeElementForId: function (id_) {
        if (id_ == null) return -1;
        var index_ = this.getIndexOfElementById(id_);
        if (index_ >= 0) {
            this._elementList.splice(index_, 1);
        }
        return index_;
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * */
    removeElementByProperty: function (property_, value) {
        if (value == null) return -1;
        var index_ = this.getIndexOfElementByProperty(property_, value);
        if (index_ >= 0) {
            this._elementList.splice(index_, 1);
        }
        return index_;
    },

    removeAllCustomElement: function () {
        this._elementList.splice(0);
        this.reloadData();
    },
    updateElementInfoForId: function (id_, info_) {
        if (id_ == null || info_ == null) return;
        var index_ = this.getIndexOfElementById(id_);
        if (index_ >= 0) {
            this._elementList[index_] = info_;
        }
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * @param {Object} info_
     * */
    updateElementInfoByProperty: function (property_, value, info_) {
        if (value == null || info_ == null) return;
        var index_ = this.getIndexOfElementByProperty(property_, value);
        if (index_ >= 0) {
            this._elementList[index_] = info_;
        }
    },
    focusTouchElementById: function (id) {
        this.focusTouchElementByProperty("_id", id);
    },
    focusTouchElementByProperty: function (property, value) {
        var elementGui = this.getElementGuiByProperty(property, value);
        if(elementGui) {
            var parent = this.getParent();
            if(parent) {
                var wPos1 = parent.convertToWorldSpace(this.getPosition());
                var wPos2;
                var anchorY = 0;
                if(elementGui.getWorldPosition) {
                    wPos2 = elementGui.getWorldPosition();
                    anchorY = 0.5;
                }else{
                    wPos2 = elementGui.getParent().convertToWorldSpace(elementGui.getPosition());
                }
                var option = 20;
                var curH = this._contentSizeHeight;
                var elementSize = elementGui.getContentSize();
                var minY = wPos2.y - anchorY * elementSize.height;
                var maxY = wPos2.y + (1 - anchorY) * elementSize.height;
                var delta = minY - wPos1.y;
                var curContentOffset = this.getContentOffset();
                if(delta + option < 0) {
                    //move up
                    curContentOffset.y += Math.abs(delta);
                    this.setContentOffset(curContentOffset, false);
                }else{
                    delta = wPos1.y + curH - maxY;
                    if(delta + option < 0) {
                        //move down
                        curContentOffset.y -= Math.abs(delta);
                        this.setContentOffset(curContentOffset, false);
                    }
                }
            }
        }
    },
    scrollToCellAtIndex: function (idx, isAnimation) {
        if(idx >= 0) {
            var deltaY = this._cellHeight * idx;
            var totalHeight = this._cellHeight * this.getNumberCell();
            var curContentOffset = this.getContentOffset();
            curContentOffset.y = -totalHeight + deltaY + this._cellHeight * 0.5;
            this.setContentOffset(curContentOffset, isAnimation);
        }
    }
});

