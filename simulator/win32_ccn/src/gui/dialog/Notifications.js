/**
 * Created by bachbv on 2/12/2017.
 */

var Notifications = {
    _init: false,
    _imgBg: null,
    _lbMsg: null,
    _speedShow: 0,
    _color: null,

    init: function(){
        this._init = true;

        this._imgBg = new cc.Scale9Sprite(res.bg_notification2, cc.rect(0, 0, 624, 42), cc.rect(0, 0, 624, 42));
        this._imgBg.setCascadeOpacityEnabled(true);
        this._imgBg.setPosition(GV.VISIBALE_SIZE.width / 2, GV.VISIBALE_SIZE.height - 43);
        this._imgBg.retain();

        this._lbMsg = new ccui.Text("", res.UTM_Swiss_CondensedBold, 21);
        this._lbMsg.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._lbMsg.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this._lbMsg.setPosition(this._imgBg.width >> 1, 2 + this._imgBg.height >> 1);
        this._lbMsg.retain();

        this._imgBg.addChild(this._lbMsg);

        this.setSpeedShow(0.5);

        this.isLanguageDirty = true;
        this.languageListenerEvent = null;
        this.addCustomEvent(LanguageMgr.langEventName, this.languageDirty.bind(this));
    },

    languageDirty: function(){
        this.isLanguageDirty = true;
    },

    localize: function(){
        this.isLanguageDirty = false;

        var font = GameUtils.getStandardGameFont();
        var oldFont = this._lbMsg.getFontName();
        if(font != oldFont){
            this._lbMsg.setFontName(font);
        }
    },

    setSpeedShow: function(s){
        this._speedShow = s;
    },

    /**
     *
     * @private
     */
    _done: function(){
        this._imgBg.setVisible(false);
    },

    /**
     *
     * @private
     */
    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.CURSOR);
            if (this._imgBg.parent != layer) {
                this._imgBg.removeFromParent(false);
                layer.addChild(this._imgBg);
            }
        }
    },

    /**
     *
     * @param objContent
     * @private
     */
    _run: function(objContent){
        this._updateParent();

        // update msg
        this._lbMsg.setString(objContent.text);

        // update position
        this._imgBg.stopAllActions();
        this._imgBg.y = GV.VISIBALE_SIZE.height + (this._imgBg.height >> 1);
        this._imgBg.setVisible(true);

        // create action
        var moveIn = cc.moveTo(this._speedShow, this._imgBg.x, GV.VISIBALE_SIZE.height - (this._imgBg.height >> 1));
        var delay = cc.delayTime(objContent.showTime);
        var moveOut = cc.moveTo(this._speedShow, this._imgBg.x, GV.VISIBALE_SIZE.height + (this._imgBg.height >> 1));

        this._imgBg.runAction(cc.sequence(moveIn, delay, moveOut, cc.callFunc(this._done, this)));
    },

    /**
     * show a message text with color
     * @param text
     * @param duration
     */
    show: function(text, duration){
        if(!this._init){
            this.init();
        }

        this.updateLocalization();

        if(duration == undefined){
            duration = 3;
        }

        var objContent = {
            text: languageMgr.getString(text).replace("\n", ""),
            //color: color,
            showTime: duration
        };

        this._run(objContent);
    },

    hide: function(){
        if(this._imgBg){
            this._imgBg.setVisible(false);
        }
    },

    cleanUp: function () {
        // stop current notification
        if(this._lbMsg){
            this._lbMsg.stopAllActions();
            this._lbMsg.removeFromParentAndCleanup();
        }

        if(this._imgBg){
            this._imgBg.stopAllActions();
            this._imgBg.removeFromParentAndCleanup();
        }
    },
};
