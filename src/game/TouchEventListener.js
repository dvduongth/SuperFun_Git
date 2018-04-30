/**
 * Created by GSN on 12/3/2015.
 */

var InteractType = {
    NONE : 0,
    SELECT : 1,
    DRAG_N_DROP : 2,
    SLICE : 3
};

checkEventInsideTarget = function(touch, target){
    var locationInNode = target.convertToNodeSpace(touch.getLocation());
    var contentSize = target.getContentSize();
    var contentRect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.rectContainsPoint(contentRect, locationInNode);
    //if(cc.rectContainsPoint(contentRect, locationInNode)){
    //    return true;
    //}
    //return false;
};

var TouchEventListener = cc.Class.extend({

    event : cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches : true,

    onTouchBegan : function(touch, event){
        var target = event.getCurrentTarget();
        cc.assert(target instanceof PieceDisplay , "TouchEventListener.onTouchBegan() only accept PieceDisplay type!");

        if(target.interactType == InteractType.NONE) {
            return false;
        }

        if(checkEventInsideTarget(touch, target)){
            target.touchHodling = true;
            target.originPosition = target.getPosition();
            return true;
        }

        return false;
    },

    onTouchesMoved : function(touch, event){
        var target = event.getCurrentTarget();
        cc.assert(target instanceof PieceDisplay , "TouchEventListener.onTouchBegan() only accept PieceDisplay type!");
        if(target.interactType == InteractType.NONE)
            return;

        if(target.interactType == InteractType.SELECT){
            if(!checkEventInsideTarget(target, touch)){
                target.touchHodling=false;
            }
        }
        else if(target.interactType == InteractType.DRAG_N_DROP){
            if(target.touchHodling){
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
            }
        }
        else if(target.interactType == InteractType.SLICE){
            var delta = touch.getDelta();
            target.interactCallback(target, delta);
        }
    },

    onTouchEnded : function(touch, event){
        var target = event.getCurrentTarget();
        cc.assert(target instanceof PieceDisplay , "TouchEventListener.onTouchBegan() only accept PieceDisplay type!");
        if(target.interactType == InteractType.NONE)
            return;

        if(target.interactType == InteractType.DRAG_N_DROP){
            if(target.touchHodling){
                var result = target.interactCallback(target);
                if(!result){
                    target.setPosition(target.originPosition);
                }
            }
        }
        if(target.interactType == InteractType.SELECT){
            if(target.touchHodling){
                target.interactCallback(target);
            }
        }
        target.touchHodling = false;
    },

    onTouchCancelled : function(touch, event){
        var target = event.getCurrentTarget();
        cc.assert(target instanceof PieceDisplay , "TouchEventListener.onTouchBegan() only accept PieceDisplay type!");
        if(target.interactType == InteractType.NONE)
            return;
        this.onTouchEnded(touch, event);
    }

});



