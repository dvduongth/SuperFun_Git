var constant_TileupPopup = {
    TEXT: "",
    MAX_TIME : 5
};

var TileUpPopup = BasePopup.extend({

    ctor: function (callback) {
        this.time = 0;
        this._super(res.ZCSD_GUI_CHANNEL);
        this.setFog(true);

        var title = this._rootNode.getChildByName("channel_title");
        title.setVisible(false);
        title.setScale(0.0);
        title.runAction(cc.sequence(cc.delayTime(0.3), cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut())));

        var btn1vs1 = this._centerNode.getChildByName("btn_1vs1");
        btn1vs1.loadTextureNormal("res/game/tileup/nangodat.png",ccui.Widget.LOCAL_TEXTURE);
        var destination = btn1vs1.getPosition();
        btn1vs1.setPositionX(-btn1vs1.getContentSize().width/2-cc.winSize.width/2);
        btn1vs1.addClickEventListener(this.on1vs1BtnClick.bind(this));
        btn1vs1.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        var btn1vs3 = this._centerNode.getChildByName("btn_1vs3");
        btn1vs3.loadTextureNormal("res/game/tileup/khongnangodat.png",ccui.Widget.LOCAL_TEXTURE);
        destination = btn1vs3.getPosition();
        btn1vs3.setPositionX(cc.winSize.width/2+btn1vs3.getContentSize().width/2);
        btn1vs3.addClickEventListener(this.on1vs3BtnClick.bind(this));
        btn1vs3.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        var exitBtn = this._rootNode.getChildByName("btn_exit");
        exitBtn.addClickEventListener(this.onExitBtnClick.bind(this));

        this.schedule(this.onUpdate,1);
        this.callback = callback;
    },

    on1vs1BtnClick: function(){
        this.unschedule(this.onUpdate);
        this.removeFromParent();
        this.callback();
    },

    on1vs3BtnClick: function(){
        gv.gameClient.sendPacketControlSell(-1);
        this.callback();
        //gv.gameClient._clientListener.dispatchPacketInQueue();
        this.unschedule(this.onUpdate);
        this.removeFromParent();
    },

    onExitBtnClick: function() {
        this.on1vs3BtnClick();
    },

    onUpdate:function(){
        this.time++;
        var timeOut = GameUtil.getTimeAuto(TimeoutConfig.TIMEOUT_ACTION);
        if (this.time >timeOut){
            this.time = 0;
            this.unschedule(this.onUpdate);
            this.on1vs3BtnClick();
        }
    }

});