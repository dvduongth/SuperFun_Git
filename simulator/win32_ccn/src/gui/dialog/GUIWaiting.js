/**
 * Created by bachbv on 12/29/2015.
 */

var GUIWaiting = BaseGUI.extend({
    _className: "GUIWaiting",

    ctor: function(){
        this._super();

        this.imgWaitingProgress = null;
        this.hiding = false;
        this.init();
    },

    init: function(){
        this._super();
        this.syncAllChildren(res.node_waiting, this);
        this.alignCenter();
    },

    show: function(){
        if(!this.isVisible()){
            this._increaseGUIPopupCounter();
            this.setVisible(true);
        }
        this.setOpacity(128);

        var speedShow = 0.2;
        var fadeIn = cc.fadeIn(speedShow);

        this.runAction(fadeIn);

        var rotationAction = cc.repeatForever(cc.rotateBy(1.5, 300));
        this.imgWaitingProgress.runAction(rotationAction);
    },

    hide: function(){
        if(!this.isVisible() || this.hiding){
            return;
        }
        this.hiding = true;
        this.setOpacity(255);

        this._decreaseGUIPopupCounter();
        sceneMgr.hideFog();

        var speedShow = 0.2;
        var fadeOut = cc.fadeOut(speedShow);

        var self = this;
        this.runAction(
            cc.sequence(
                fadeOut,
                cc.callFunc(function(sender){
                    sender.stopAllActions();
                    sender.setVisible(false);
                    self.hiding = false;
                })
            )
        );
    },
});
