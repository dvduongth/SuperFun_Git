/**
 * Created by user on 26/1/2016.
 */

var GuiChannel = BaseGui.extend({
    playWithBot : true,
    modeplay:-1,
    ctor: function (isPlayWithAuto,modeplay) {
        this._super(res.ZCSD_GUI_CHANNEL);
        this.setFog(true);
        this.playWithBot = isPlayWithAuto;
        this.modeplay = modeplay;

        var title = this._rootNode.getChildByName("channel_title");
        title.setScale(0.0);
        title.runAction(cc.sequence(cc.delayTime(0.3), cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut())));

        var btn1vs1 = this._centerNode.getChildByName("btn_1vs1");
        var destination = btn1vs1.getPosition();
        btn1vs1.setPositionX(-btn1vs1.getContentSize().width/2-cc.winSize.width/2);
        btn1vs1.addClickEventListener(this.on1vs1BtnClick.bind(this));
        btn1vs1.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        var btn1vs3 = this._centerNode.getChildByName("btn_1vs3");
        destination = btn1vs3.getPosition();
        btn1vs3.setPositionX(cc.winSize.width/2+btn1vs3.getContentSize().width/2);
        btn1vs3.addClickEventListener(this.on1vs3BtnClick.bind(this));
        btn1vs3.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.5, destination).easing(cc.easeBackOut())));

        var exitBtn = this._rootNode.getChildByName("btn_exit");
        exitBtn.addClickEventListener(this.onExitBtnClick.bind(this));
    },

    on1vs1BtnClick: function(){
        gv.gameClient.sendPlayInstantly(PlayMode.MODE_2_PLAYER, this.playWithBot, CheatConfig.MAP_INIT_CASE);
    },

    on1vs3BtnClick: function(){
        gv.gameClient.sendPlayInstantly(PlayMode.MODE_4_PLAYER, this.playWithBot, CheatConfig.MAP_INIT_CASE);
    },

    onExitBtnClick: function() {
        this.destroy();
    },
});