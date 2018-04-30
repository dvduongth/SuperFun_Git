/**
 * Created by user on 17/2/2016.
 */

var GuiRestRoom = BaseGui.extend({

    ctor: function () {
        this._super();

        this.timeRunner = new TimeRunner();
        this.timeRunner.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.timeRunner.reset(TimeoutConfig.TIMEOUT_ACTION, this.onTimeOut.bind(this));
        this.timeRunner.setEnable(false);
        this.addChild(this.timeRunner);

        var description = cc.Sprite.create("game/mainBoard/waiting_player.png");
        description.setPosition(this.timeRunner.getPositionX(), this.timeRunner.getPositionY()-70);
        this.addChild(description);
    },

    onTimeOut: function(){
    },

    addPlayerInRestRoom: function(){
        if (gv.matchMng.restRoom.getNumberPlayerInRoom() >= 2){
            this.timeRunner.setEnable(true);
            this.timeRunner.reset(TimeoutConfig.RESTROOM_TIMEOUT);
        }
    },

    removePlayerInRestRoom: function(){
        if (gv.matchMng.restRoom.getNumberPlayerInRoom() <= 1) {
            this.timeRunner.setEnable(false);
        }
    },

});
