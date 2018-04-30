/**
 * Created by GSN on 11/24/2015.
 */

var FocPool = cc.Class.extend({

    focPoolDisplay : null,
    currentPoint : 0,
    actived : false,
    overloaded : false,
    specialState : false,
    fulled : false,
    maxCapacity : 0,

    focManager : null,

    ctor : function(focManager, maxCapacity){
        this.focManager = focManager;
        this.maxCapacity = maxCapacity;
        this.focPoolDisplay = new FocPoolDisplay();
        this.focPoolDisplay.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
    },

    getCurrentPointPercent : function(){
        return (this.currentPoint/this.maxCapacity)*100;
    },

    addPoint : function(point){
        this.setPoint(this.currentPoint + point);
    },

    setPoint : function(point){
        this.currentPoint=point;

        var configMng = this.focManager.focConfig;
        this.currentPoint = this.currentPoint > this.maxCapacity ? this.maxCapacity : this.currentPoint;
        this.currentPoint = this.currentPoint < 0 ? 0 : this.currentPoint;

        this.actived = this.currentPoint > configMng.activeThresHold;
        this.overloaded = this.currentPoint > configMng.overloadThresHold;
        this.specialState = (configMng.poolConfig.specialPoint.indexOf(this.currentPoint) >=0);
        this.fulled = this.currentPoint == this.maxCapacity;

        this.updateDisplay();
    },

    updateDisplay : function(){
        this.focPoolDisplay.setActive(this.actived);
        this.focPoolDisplay.setSpecialState(this.specialState);
        this.focPoolDisplay.setOverLoad(this.overloaded);
    },

    isActived: function(){
        return this.actived;
    },

    isOverLoad : function(){
        return this.overloaded;
    },

    isAtSpecialState : function(){
        return this.specialState;
    },

    isFull : function(){
        return this.fulled;
    },

    explosive : function(){
        this.currentPoint = 0;
        var explosiveAction = cc.sequence(cc.scaleTo(1.0,2.0), cc.scaleTo(1.0,1.0));
        this.focPoolDisplay.runAction(explosiveAction);
    },

    attachToScreen : function(parent){
        parent.addChild(this.focPoolDisplay);
    }

});