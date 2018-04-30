/**
 * Created by tuanda on 16/7/2015.
 */



var GuiFindOpponent = BaseGui.extend({

    TIME_LIMIT : 5,

    ctor:function(isPlayWithAuto) {
        this._super(res.ZCSD_GUI_FIND_OPPONENT);

        this.setFog(true);

        this.runLoading();


        this.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(this.startFindOpponent.bind(this, isPlayWithAuto))
        ));
    },

    runLoading: function(){

        this.findLb = this._rootNode.getChildByName("label_find");

        var dot = [];
        for (var i=0; i<3; i++){
            dot.push(new ccui.Text(".", res.FONT_UNICODE_VREVUE_TFF, 30));
            dot[i].runAction(cc.sequence(
                    cc.delayTime(0.1*i),
                    cc.callFunc(function(target){
                        target.runAction(cc.repeatForever(cc.blink(0.5, 1)))}, dot[i])
                )
            );
            this.addChild(dot[i]);

        }

        this.findLb = this._rootNode.getChildByName("label_find");
        dot[1].setPosition(this.findLb.getPositionX(), this.findLb.getPositionY()-30);
        dot[0].setPosition(dot[1].getPositionX()-15, dot[1].getPositionY());
        dot[2].setPosition(dot[1].getPositionX()+15, dot[1].getPositionY());
    },


    startFindOpponent: function(isPlayWithAuto){
        this.counter = this.TIME_LIMIT;
        this.schedule(this.update, 1);

        this.findLb.setVisible(true);

        gv.gameClient.sendPlayInstantly(PlayMode.MODE_4_PLAYER, isPlayWithAuto, CheatConfig.MAP_INIT_CASE);
    },

    update:function(dt){
        this.counter--;
        if (this.counter == 0){
            this.destroy();
        }
    }
});