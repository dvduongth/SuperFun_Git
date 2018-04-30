/**
 * Created by GSN on 11/24/2015.
 */

var FocPoolDisplay = cc.Node.extend({

    poolSprite : null,

    ctor: function(){
        this._super();
        this.poolSprite = new cc.Sprite();
        this.addChild(this.poolSprite);
        this.poolSprite.setVisible(false);

    },

    setCurrentPercent : function(percent){
        cc.assert(percent >=0 && percent <=100, "FocPoolDisplay.setCurrentPercent invalid param: "+ percent);
        this.poolSprite.setOpacity(255*(percent/100));
    },

    setActive : function(enable){
        this.poolSprite.setScale(enable? 1.2 : 1.0);
    },

    setOverLoad : function(enable){
        this.poolSprite.setScale(enable? 1.5 : 1.0);
    },

    setSpecialState : function(enable){
        this.poolSprite.setScale(enable? 2.0 : 1.0);
    }
});