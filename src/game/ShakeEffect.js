/**
 * Created by GSN on 12/16/2015.
 */

var ShakeAction = cc.Class.extend({
    _initial_x : 0,
    _initial_y : 0,
    _strength_x : 0,
    _strength_y : 0,
    m_pTarget : null,
    time : 0,
    timeRunned : 0,
    stopped : false,
    originPos : null,


    startWithTarget : function(time, node ,strength,fixpos){
        this.m_pTarget = node;
        //this._initial_x = node.getPosition().x;
        //this._initial_y = node.getPosition().y;
        this._initial_x = fixpos.x;
        this._initial_y = fixpos.y;
        this._strength_x = strength;
        this._strength_y = strength;
        //this.originPos = node.getPosition();
        this.originPos = fixpos;

        this.time = time;
    },

    update : function(time){
        this.timeRunned+= time;
        if(this.timeRunned >= this.time)
            this.stopped = true;

        var randx = this.fgRangeRand( -this._strength_x, this._strength_x );
        var randy = this.fgRangeRand( -this._strength_y, this._strength_y );
        randx = randx*(1-this.timeRunned/this.time);
        randy = randy*(1-this.timeRunned/this.time);

        // move the target to a shaked position
        this.m_pTarget.setPosition(cc.pAdd(this.originPos, cc.p( randx, randy)) );
    },

    isStopped : function(){
        return this.stopped;
    },

    fgRangeRand : function(min, max )
    {
        var rnd = Math.random();
        return rnd*(max-min)+min;
    },

    finish : function(){
        this.m_pTarget.setPosition(this.originPos);
    }
});

var ShakeEffect = {
    shakeList : [],
    running : false,

    addShakeEffectToNode : function(time, node, strength,fixpos){
        var shakeAction = new ShakeAction();
        shakeAction.startWithTarget(time, node, strength,fixpos);
        this.shakeList.push(shakeAction);

        if(!this.running){
            cc.director.getScheduler().scheduleUpdateForTarget(this, 1, false);
        }
    },

    update : function(dt){
        for(var i=0; i< this.shakeList.length; i++){
            var shakeAction = this.shakeList[i];
            shakeAction.update(dt);
        }

        var i = this.shakeList.length;
        while(i--){
            if(this.shakeList[i].isStopped()) {
                this.shakeList[i].finish();
                this.shakeList.splice(i, 1);
            }
        }
    }
};