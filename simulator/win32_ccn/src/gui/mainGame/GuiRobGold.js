/**
 * Created by user on 27/11/2015.
 */

    var GuiRobGold = BaseGui.extend({

        duration: TimeoutConfig.TIMEOUT_ACTION,
        timeCount: 0,

        ctor: function () {
            this._super(res.ZCSD_GUI_ROB_GOLD);
            this.setFog(true);

            var robBtn = this._rootNode.getChildByName("btn_rob");
            robBtn.addClickEventListener(this.onRobBtnClick.bind(this));
    
            this.schedule(this.update, 1);

        },

    onRobBtnClick: function(){

    },

    update: function(dt){

        if (this.timeCount < this.duration){
            this.timeCount+=dt;
            if (this.timeCount>=this.duration){
                this.unschedule(this);
                this.destroy();
            }
        }
    },
});
