/**
 * Created by bachbv on 2/14/2017.
 */

var Popups = {
    _init: false,
    _nodeContainer: null,
    _listButtons: null,
    _imgBg: null,
    _lbTitle: null,
    _imgTitle: null,
    _lbMsg: null,
    _padding: 0,
    _speedShow: 0,
    _minSize: null,
    _okCallbackFunc: null,
    _closeCallbackFunc: null,
    _cancelCallbackFunc: null,
    _otherCallbackFunc: null,
    _willHide: false,

    init: function(){
        this._init = true;
        this._minSize = cc.p(500, 370);

        this._nodeContainer = new cc.Node();
        this._nodeContainer.setCascadeOpacityEnabled(true);
        this._nodeContainer.setCascadeColorEnabled(true);
        this._nodeContainer.setVisible(false);
        Utility.modifiedNodeToCenter(this._nodeContainer);
        this._nodeContainer.retain();

        this._imgBg = new cc.Scale9Sprite(res.bg_gui_popup, cc.rect(0, 0, 668, 495), cc.rect(0, 0, 668, 495));
        this._imgBg.setCascadeOpacityEnabled(true);
        this._imgBg.setCascadeColorEnabled(true);
        this._imgBg.setPosition(GV.VISIBALE_SIZE.width / 2, GV.VISIBALE_SIZE.height / 2);
        this._imgBg.retain();

        this._lbTitle = new ccui.Text("", res.FONT_TAHOMA, 33);
        //this._lbTitle.color = Utility.getColorByName('pale green');
        this._lbTitle.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._lbTitle.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this._lbTitle.retain();

        this._imgTitle = new cc.Sprite();
        this._imgTitle.retain();
        this._imgTitle.setVisible(false);

        this._lbMsg = new ccui.Text("", res.FONT_TAHOMA, 24);
        //this._lbMsg.color = Utility.getColorByName('black');
        this._lbMsg.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._lbMsg.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this._lbMsg.retain();

        this._listButtons = [];

        this._btnClose = new ccui.Button();
        this._btnClose.setTouchEnabled(true);
        this._btnClose.loadTextures(res.btn_close_x, res.btn_close_x, "");
        this._btnClose.addTouchEventListener(this.touchEvent, this);
        this._btnClose.setPressedActionEnabled(true);
        this._btnClose.retain();

        this._imgOk = new cc.Sprite();
        this._btnOk = new ccui.Button();
        this._btnOk.setTouchEnabled(true);
        this._btnOk.loadTextures(res.btn_bg_orange, res.btn_bg_orange, "");
        this._btnOk.addTouchEventListener(this.touchEvent, this);
        this._btnOk.setPressedActionEnabled(true);
        this._btnOk.setVisible(false);
        this._btnOk.setTitleText("");
        //this._btnOk.setTitleFontName(res.FONT_TAHOMA);
        //this._btnOk.setTitleFontSize(34);
        this._btnOk.retain();
        this._imgOk.setPosition(this._btnOk.getContentSize().width >> 1, (this._btnOk.getContentSize().height >> 1) + 5);
        this._btnOk.addChild(this._imgOk);

        this._imgCancel = new cc.Sprite();
        this._btnCancel = new ccui.Button();
        this._btnCancel.setTouchEnabled(true);
        this._btnCancel.loadTextures(res.btn_bg_violet, res.btn_bg_violet, "");
        this._btnCancel.addTouchEventListener(this.touchEvent, this);
        this._btnCancel.setPressedActionEnabled(true);
        this._btnCancel.setVisible(false);
        this._btnCancel.setTitleText("");
        //this._btnCancel.setTitleFontName(res.FONT_TAHOMA);
        //this._btnCancel.setTitleFontSize(34);
        this._btnCancel.retain();
        this._imgCancel.setPosition(this._btnCancel.getContentSize().width >> 1, (this._btnCancel.getContentSize().height >> 1) + 5);
        this._btnCancel.addChild(this._imgCancel);

        this._btnOther = new ccui.Button();
        this._btnOther.setTouchEnabled(true);
        this._btnOther.loadTextures(res.btn_bg_violet, res.btn_bg_violet, "");
        this._btnOther.addTouchEventListener(this.touchEvent, this);
        this._btnOther.setPressedActionEnabled(true);
        this._btnOther.setVisible(false);
        this._btnOther.setTitleFontName(res.FONT_TAHOMA);
        this._btnOther.setTitleFontSize(34);
        this._btnOther.retain();

        // add children to container
        this._nodeContainer.addChild(this._imgBg);
        this._imgBg.addChild(this._lbMsg);
        this._imgBg.addChild(this._lbTitle);
        this._imgBg.addChild(this._imgTitle);
        this._imgBg.addChild(this._btnClose);
        this._imgBg.addChild(this._btnOk);
        this._imgBg.addChild(this._btnCancel);
        this._imgBg.addChild(this._btnOther);

        this.setPadding(20);
        this.setSpeedShow(0.2);

        //cc.error("init");
    },

    setPadding: function(p){
        this._padding = p;
    },

    setSpeedShow: function(s){
        this._speedShow = s;
    },

    setTitle: function(title){
        this._lbTitle.setString(title);
    },

    /**
     *
     * @private
     */
    _updateSize: function(){
        //cc.error("_updateSize");
        this._imgBg.width = Math.max(this._minSize.x, this._lbMsg.width + this._padding * 2);
        this._imgBg.height = Math.max(this._minSize.y, this._lbMsg.height + this._padding * 2 + 100);
    },

    /**
     *
     * @private
     */
    _updateComponentsPosition: function(){
        //cc.error("_updateComponentsPosition");
        var offsetStart = this._btnOk.getSize().width / 3;
        var lengthPart = (this._imgBg.width - offsetStart * 2) / this._listButtons.length;

        if(lengthPart - this._btnOk.getSize().width < 10){
            // scale img width and stretch buttons
            var delta = Math.abs(lengthPart - this._btnOk.getSize().width) + 10;
            this._imgBg.width += delta * this._listButtons.length;
            lengthPart += delta;
        }

        for(var i = 0; i < this._listButtons.length; ++i){
            this._listButtons[i].setPosition(offsetStart + lengthPart * (i + 0.5), this._listButtons[i].getSize().height / 2 + 15);
        }

        this._lbMsg.setPosition(this._imgBg.width >> 1, this._imgBg.height * 0.55);
        this._lbTitle.setPosition(this._imgBg.width >> 1, this._imgBg.height - this._lbTitle.height - 8);
        this._imgTitle.setPosition(this._imgBg.width >> 1, this._imgBg.height - this._imgTitle.height - 8);

        var btnSize = this._btnClose.getSize();
        this._btnClose.setPosition(this._imgBg.width - btnSize.width * 0.7, this._imgBg.height - btnSize.height * 0.7);
    },

    /**
     *
     * @private
     */
    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.GUI);
            if (this._nodeContainer.parent != layer) {
                this._nodeContainer.removeFromParent(false);
                layer.addChild(this._nodeContainer, 2);
            }
        }
    },

    /**
     *
     * @private
     */
    _fadeInOut: function(){
        //cc.error("fade");
        if(this._nodeContainer){
            this._nodeContainer.stopAllActions();
            this._nodeContainer.visible = true;
            this._nodeContainer.setScale(0.5);
            this._nodeContainer.setOpacity(128);

            var fadeIn = cc.fadeIn(this._speedShow);
            var scaleIn = cc.scaleTo(this._speedShow, 1.1, 1.1);
            var scaleOut = cc.scaleTo(0.1, 1.0, 1.0);
            //var fadeOut = fadeIn.reverse();

            this._nodeContainer.runAction(cc.sequence(cc.spawn(fadeIn, scaleIn), scaleOut));
        }
    },

    /**
     *
     * @private
     */
    _visibleFunctionButtons: function(b){
        this._btnOk.setVisible(b);
        this._btnOther.setVisible(b);
        this._btnCancel.setVisible(b);
    },

    /**
     *
     */
    showError: function(errorCode){
        var listButtons = null;

        switch (errorCode){
            case ERROR_CODE.FAIL:
            case ERROR_CODE.PARAM_INVALID:
            case ERROR_CODE.ROOM_NOT_EXIST:
            case ERROR_CODE.ROOM_FULL:
            case ERROR_CODE.NOT_ENOUGH_MIN_BUY_IN:
            case ERROR_CODE.OUT_BUY_IN_RANGE:
            case ERROR_CODE.ALREADY_IN_GAME:
            case ERROR_CODE.GAME_STRUCTURE_INVALID:
            case ERROR_CODE.PLAYER_ACTION_INVALID:
            case ERROR_CODE.NOT_ENOUGH_XU:
            case ERROR_CODE.NOT_ENOUGH_GOLD:
            case ERROR_CODE.TOO_MUCH_GOLD_TO_RECEIVE_SUPPORT:
            case ERROR_CODE.REACH_MAX_DAILY_SUPPORT_TIME:
                listButtons = [
                    {btnName: 'ok', hide: true}
                ];
                break;

            default:
                listButtons = [
                    {btnName: 'ok', hide: true}
                ];
                break;
        }

        this.show({text: languageMgr.getString("ERROR_CODE_" + errorCode)}, listButtons);
    },

    /**
     *
     */
    showMessage: function(message){
        var content = {text: languageMgr.getString(message)};
        var listButtons = [
            {btnName: 'ok', hide: true}
        ];

        this.show(content, listButtons);
    },

    /**
     *
     */
    showMessageNotEnoughGold: function(message){
        var content = {text: languageMgr.getString(message)};
        var listButtons = [
            {btnName: 'other', titleText: languageMgr.getString("SHOP"), hide: true,
                callback: function(){
                    moduleMgr.getLobbyModule().showGUIExchangeGold();
                }}
        ];

        this.show(content, listButtons);
    },

    /**
     * listButtonObj:
     *  ex: [{btnName: 'ok', hide: true, callback: {caller: .., funcName: ..., args: [...]}},
     *      ...
     *      ]
     *      btnName: name of button will added and execute the callback when clicked end
     *              'ok', 'cancel', 'other', 'close'
     *      hide: the popup will hide if true
     * @param {Object} content
     * @param listButtonObj
     * @param showFog
     */
    show: function(content, listButtonObj, showFog){
        if(!this._init){
            this.init();
        }

        sceneMgr.hideGUIWaiting();

        if(showFog === undefined){
            showFog = true;
        }

        if(showFog){
            sceneMgr.showFog();
            if(!this._nodeContainer.isVisible()){
                ++GUIPopupCounter;
                logGUIPopupCounter("Popup");
            }
        }

        if(content.title){
            this._imgTitle.setVisible(false);
            this._lbTitle.setVisible(true);

            this.setTitle(content.title);
        }
        else{
            //this.setTitle(languageMgr.getString("NOTIFICATION"));
            this._imgTitle.setVisible(true);
            this._imgTitle.setSpriteFrame("text_notification.png");
            this._lbTitle.setVisible(false);
        }

        this._visibleFunctionButtons(false);
        if(listButtonObj !== undefined){
            this._addButtons(listButtonObj);
        }

        // change content label notification
        this._lbMsg.setString(content.text);

        this._updateParent();
        this._updateSize();
        this._updateComponentsPosition();
        this._fadeInOut();
    },

    showReconnect: function(){
        if(!connector.isConnected()) return;

        var content = {text: languageMgr.getString("DISCONNECT_UNKNOWN")};
        var listButtons = [
            {btnName: 'other', titleText: languageMgr.getString("RETRY"), hide: true, callback: {caller: connector, funcName: connector.reconnect, args: []}},
            {btnName: 'cancel', hide: true, callback: {caller: sceneMgr, funcName: sceneMgr.viewSceneById, args: [GV.SCENE_IDS.LOGIN]}}
        ];

        this.show(content, listButtons);

        moduleMgr.getPlayerModule().setFirstLogin(true);
        moduleMgr.getPingnModule().setCanShowReconnect(false);
        connector.disconnect();
    },

    hide: function(){
        this._willHide = false;
        if(this.isShowing()){
            this._nodeContainer.setOpacity(255);

            var fadeOut = cc.fadeOut(this._speedShow);
            var scaleOut = cc.scaleTo(this._speedShow, 0.6, 0.6);

            this._nodeContainer.runAction(
                cc.sequence(
                    cc.spawn(fadeOut, scaleOut),
                    cc.callFunc(function(sender){
                        sender.setVisible(false);
                        --GUIPopupCounter;
                        logGUIPopupCounter("Popup");
                        sceneMgr.hideFog();
                    })
                )
            );
            //cc.error("hide");
        }
    },

    isShowing: function(){
        //cc.log("visible = %s, opacity = %d", this._nodeContainer.visible, this._nodeContainer.getOpacity());
        return this._nodeContainer && this._nodeContainer.visible && this._nodeContainer.getOpacity() > 0;
    },

    cleanUp: function () {
        this._nodeContainer.stopAllActions();
        this._nodeContainer.removeFromParentAndCleanup();
    },

    /**
     *
     * @param {Array} listBtn
     * @private
     */
    _addButtons: function(listBtn){
        this._listButtons.splice(0, this._listButtons.length);

        // clean old callback
        this._okCallbackFunc = null;
        this._cancelCallbackFunc = null;
        this._otherCallbackFunc = null;
        this._closeCallbackFunc = null;

        if(listBtn){
            var obj = null;
            var btnName = '';
            for(var i = 0; i < listBtn.length; ++i){
                obj = listBtn[i];
                btnName = obj.btnName.toLowerCase();
                if(btnName === 'ok'){
                    this._okCallbackFunc = obj.callback;
                    this._btnOk.setVisible(true);
                    this._listButtons.push(this._btnOk);

                    this._imgOk.setSpriteFrame("text_ok.png");
                    //this._btnOk.setTitleText(languageMgr.getString("OK"));
                }
                else if(btnName === 'close'){
                    this._closeCallbackFunc = obj.callback;
                }
                else if(btnName === 'cancel'){
                    this._cancelCallbackFunc = obj.callback;
                    this._btnCancel.setVisible(true);
                    this._listButtons.push(this._btnCancel);

                    this._imgCancel.setSpriteFrame("text_cancel.png");
                    //this._btnCancel.setTitleText(languageMgr.getString("CANCEL"));
                }
                else if(btnName === 'other'){
                    this._otherCallbackFunc = obj.callback;
                    this._btnOther.setVisible(true);
                    this._listButtons.push(this._btnOther);
                    if(obj.titleText){
                        this._btnOther.setTitleText(obj.titleText);
                    }
                }

                if(obj.hasOwnProperty('hide')){
                    this._willHide = obj.hide;
                }
            }
        }
    },

    /**
     * obj parameters require:
     *  - caller: _target that call function
     *  - funcName: name of function will call
     *  - args: parameters of function by array object
     * @param cbFunc
     * @private
     */
    _executeCallback: function(cbFunc){
        if(cbFunc){
            if(cc.isFunction(cbFunc)){
                cbFunc();
            }
            else{
                if(cbFunc.hasOwnProperty("func")){
                    cbFunc.func();
                    cbFunc = null;
                }
                else if(cbFunc.hasOwnProperty('caller')
                    && cbFunc.hasOwnProperty('funcName')
                    && cbFunc.hasOwnProperty('args')){

                    cbFunc.funcName.apply(cbFunc.caller, cbFunc.args);

                    cbFunc = null;
                }
            }
        }
    },

    /**
     *
     * @private
     */
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:

                break;

            case ccui.Widget.TOUCH_MOVED:

                break;

            case ccui.Widget.TOUCH_ENDED:
                if(sender === this._btnClose){
                    this.hide();
                    this._executeCallback(this._closeCallbackFunc);
                }
                else if(sender === this._btnOk){
                    if(this._willHide){
                        this.hide();
                    }

                    this._executeCallback(this._okCallbackFunc);
                }
                else if(sender === this._btnCancel){
                    this.hide();
                    this._executeCallback(this._cancelCallbackFunc);
                }
                else if(sender === this._btnOther){
                    if(this._willHide){
                        this.hide();
                    }
                    this._executeCallback(this._otherCallbackFunc);
                }
                break;

            case ccui.Widget.TOUCH_CANCELED:

                break;

            default:
                break;
        }
    }
};