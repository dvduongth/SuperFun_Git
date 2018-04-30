var GuiQuest = BaseGui.extend({
    ctor: function(){
        this._super(res.ZCSD_GUI_QUEST);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);
        this.loadGuiElement();
    },
    loadGuiElement: function () {
        this._rootNode.setPosition(cc.p(
            gv.WIN_SIZE.width >> 1,
            gv.WIN_SIZE.height >> 1
        ));
        this.TAB_INDEX = {
            QUEST: 0,
            EVENT: 1
        };
        this.btnClose = this._rootNode.getChildByName("btnClose");
        this.btnTabQuest = this._rootNode.getChildByName("btnTabQuest");
        this.btnTabEvent = this._rootNode.getChildByName("btnTabEvent");
        this.pageView = this._rootNode.getChildByName("pageView");
        this.setTouchListenerForButton(this.btnClose.getName());
        this.setTouchListenerForButton(this.btnTabQuest.getName());
        this.setTouchListenerForButton(this.btnTabEvent.getName());
        this.initPageForPageView();
    },
    setTouchListenerForButton: function (buttonName) {
        this[buttonName].addTouchEventListener(this._onTouchUIEvent, this);
        this[buttonName].setPressedActionEnabled(true);
        this[buttonName].setZoomScale(gv.SCALE_BUTTON);
    },
    initPageForPageView: function () {
        if(!!this.initPage) {
            return false;
        }
        this.initPage = true;
        this.NUM_TAB = 2;
        for(var i = 0; i < this.NUM_TAB; ++i) {
            var layout = this.getLayoutForNewPageOfPageView();
            var tabObj = this._createPageForIndex(i);
            if (tabObj != null) {
                layout.addChild(tabObj);
            }
            this.pageView.addPage(layout);
        }
        this.pageView.setCurPageIndex(this.TAB_INDEX.QUEST);
        this._checkTabView();
    },
    getLayoutForNewPageOfPageView: function () {
        var layout = new ccui.Layout();
        var contentSize = this.pageView.getContentSize();
        var layoutRect = cc.size(contentSize.width, contentSize.height);
        layout.setContentSize(layoutRect);
        return layout;
    },
    _createPageForIndex: function (index) {
        var guiObj = null;
        switch (index) {
            case this.TAB_INDEX.QUEST:
                if(!this.pageQuest){
                    this.pageQuest = new DailyQuestTableView(1, this.pageView.width, this.pageView.height,
                        cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
                    this.pageQuest.setClassName("pageQuest");
                    //this.pageQuest.setBounceEnabled(false);
                }
                guiObj = this.pageQuest;
                break;
            case this.TAB_INDEX.EVENT:
                if(!this.pageEvent){
                    this.pageEvent = new EventQuestTableView(1, this.pageView.width, this.pageView.height,
                        cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
                    this.pageEvent.setClassName("pageEvent");
                    //this.pageEvent.setBounceEnabled(false);
                }
                guiObj = this.pageEvent;
                break;
            default :
                break;
        }
        if(!!guiObj && !!guiObj.parent) {
            guiObj.removeFromParent(false);
        }
        return guiObj;
    },
    _checkTabView: function () {
        var curPageIndex = this.pageView.getCurPageIndex();
        for(var i = 0; i < this.NUM_TAB; ++i) {
            this.setTabsTouchEnable(i, i != curPageIndex);
        }
    },
    setTabsTouchEnable: function (index, enable) {
        var button, labelTitle, page;
        switch (index) {
            case this.TAB_INDEX.QUEST:
                button = this.btnTabQuest;
                labelTitle = this.btnTabQuest.getChildByName("lbTabQuestTitle");
                page = this.pageQuest;
                break;
            case this.TAB_INDEX.EVENT:
                button = this.btnTabEvent;
                labelTitle = this.btnTabEvent.getChildByName("lbTabEventTitle");
                page = this.pageEvent;
                break;
            default :
                return false;
        }
        if (page) {
            page.visible = !enable;
            if(page.visible) {
                page.resetView();
            }
        }
        this.setTouchEnableForButton(button, enable);
        this.setColorButtonTab(labelTitle, enable);
    },
    setTouchEnableForButton: function (button, isEnable) {
        button.enabled = isEnable;
    },
    setColorButtonTab: function (label, isEnable) {
        if (isEnable) {
            label.setColor(Utility.getColorByName("tab_normal_state"));
        } else {
            label.setColor(Utility.getColorByName("tab_disabled_state"));
        }
    },
    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnClose:
                this.onTouchClose();
                break;
            case this.btnTabQuest:
                this.showPageIndex(this.TAB_INDEX.QUEST);
                break;
            case this.btnTabEvent:
                this.showPageIndex(this.TAB_INDEX.EVENT);
                break;

            default :
                break;
        }
    },
    showPageIndex: function (idx) {
        if(idx === undefined) {
            cc.error("show page index with undefined");
            return false;
        }
        this.pageView.setCurPageIndex(idx);
        this._checkTabView();
    },
    resetView: function () {
        if (this.isSkipResetView) {
            return;
        }
        this.isSkipResetView = true;
        this.pageQuest.resetView();
        this.pageEvent.resetView();
        this.pageView.setCurPageIndex(this.TAB_INDEX.QUEST);
        this._checkTabView();
    },
    update: function (dt) {

    },
    onEnter: function () {
        this._super();
        var arr = [];
        for(var i = 0; i < 3; ++i) {
            arr.push(i);
        }
        this.updateListDailyQuest(arr);
        this.updateListEventQuest(arr);
    },
    updateListDailyQuest: function (list) {
        this.pageQuest.setElementList(list);
    },
    updateListEventQuest: function (list) {
        this.pageEvent.setElementList(list);
    },

    onTouchClose: function () {
        this.hideGui();
    },
    hideGui: function () {
        this.destroy(DestroyEffects.ZOOM);
    }
});