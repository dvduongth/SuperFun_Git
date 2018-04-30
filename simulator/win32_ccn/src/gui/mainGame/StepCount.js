/**
 * Created by Cantaloupe on 6/13/2016.
 */

var StepCount = cc.Node.extend({
    ctor:function() {
        this._super();
        this.setLocalZOrder(1000);
        this.label = new NumberSprite(0, 1);
        this.addChild(this.label);
    },

    run:function(val, pos) {
        this.setPosition(pos);
        this.label.setNumber(val);
        this.label.setScale(0.3);
        //this.label.setOpacity(0);
        this.label.runAction(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.3, 1),
                    //cc.fadeIn(0.3),
                    cc.moveBy(0.3, 0, 20)
                ),
                cc.delayTime(0.3),
                cc.spawn(
                    //cc.scaleTo(0.2, 0.5),
                    cc.fadeOut(0.2),
                    cc.moveBy(0.2, 0, 20)
                ),
                cc.callFunc(this.autoRemove, this)
            )
        )
    },

    autoRemove:function() {
        this.removeFromParent();
    }
});