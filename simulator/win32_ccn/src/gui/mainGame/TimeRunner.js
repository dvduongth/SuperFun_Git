/**
 * Created by user on 14/12/2015.
 */

var TimeRunner = cc.Node.extend({

    timeLabel: null,
    duration: 0,
    timeCount: 0,
    isRedTime: false,
    callback: null,
    enable: false,


    ctor: function(){
        this._super();

        this.clock = fr.createSprite("game/mainBoard/clock.png");
        this.addChild(this.clock);

        this.timeLabel = new NumberSprite(0, 1);
        this.timeLabel.setPosition(-6, 0);
        this.addChild(this.timeLabel);
        this.setEnable(true);

        return true;
    },

    update: function(dt){
        //cc.log("TimeRunner: " + this.timeCount);
        if (this.timeCount < this.duration){
            this.timeCount++;
            this.timeLabel.setNumber(this.duration-this.timeCount);

            if ((this.timeCount>=2/3*this.duration) && (!this.isRedTime)){
                this.isRedTime = true;
            }

            if (this.isRedTime){
                //this.timeLabel.setScale(3.0);
                //this.timeLabel.setOpacity(0);
                //this.timeLabel.runAction(cc.spawn(cc.scaleTo(0.5, 1.0), cc.fadeIn(0.5)));

                var seqs = [];
                for (var i=0; i<10; i++){
                    seqs.push(cc.sequence(
                        cc.rotateTo(0.025, -5),
                        cc.rotateTo(0.05, 5),
                        cc.rotateTo(0.025, 5)
                    ));
                }

                this.clock.runAction(cc.sequence(seqs));
            }
        }
        else{
            this.setEnable(false);

            if(this.callback!=null){
                this.callback();
            }
        }
    },

    reset: function(duration, callback){

        if (!this.enable) return;

        this.duration = typeof duration !== 'undefined' ? duration : this.duration;
        this.callback = typeof callback !== 'undefined' ? callback : this.callback;
        this.timeCount = 0;

        this.timeLabel.setScale(1.0);
        this.timeLabel.setOpacity(255);
        this.timeLabel.setNumber(duration);

        this.isRedTime = false;
    },

    setEnable: function(enable){
        //cc.log("TimeRunner: setEnable: " + enable);
        if (this.enable == enable) return;
        this.enable = enable;
        this.setVisible(enable);
        if (enable){
            //cc.log("TimeRunner: update");
            this.schedule(this.update, 1);
        }
        else{
            //cc.log("TimeRunner: unschedule update");
            this.unschedule(this.update);
            this.timeLabel.stopAllActions();
            this.clock.stopAllActions();
        }
    },

});