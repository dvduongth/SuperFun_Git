/**
 * Created by user on 12/11/2015.
 */

var TimerImage = cc.ProgressTimer.extend({

    duration: 0,
    timeCount: 0,
    callback : null,
    enable : true,
    isBlink: false,

    ctor: function(imageResource, duration, callback){
        this._super(new cc.Sprite(imageResource));
        this.duration = duration;
        this.callback = callback;

        this.type = cc.ProgressTimer.TYPE_RADIAL;
        this.setReverseDirection(true);
    },

    update: function(dt){
        if(!this.enable) return;

        if (this.timeCount < this.duration){
            this.timeCount+=dt;
            if (this.timeCount>=2/3*this.duration && !this.isBlink){
                this.setColor(cc.color(255, 0, 0));
                this.runAction(cc.blink(10, 30));
                this.isBlink = true;
            }

            if(this.timeCount >= this.duration){
                if(this.callback!=null){
                    this.callback();
                }
                this.unschedule(this.update);
            }
        }
    },

    setEnable : function(enable){
        this.setVisible(enable);
        this.enable = enable;

        if (!this.enable){
            this.stopAllActions();
        }
    },

    reset: function(duration){
        this.duration = duration;
        this.timeCount = 0;
        this.runAction(cc.progressFromTo(duration, 100, 0));
        this.setColor(cc.color(105, 255, 6));
        this.schedule(this.update, 1);
        this.isBlink = false;
    },

    onExit: function(){
        this._super();
        this.unschedule(this.update);
    },
});