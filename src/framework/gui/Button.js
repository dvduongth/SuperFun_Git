/**
 * Created by Tuan on 19-May-17.
 */

fr.Button = ccui.Button.extend({
    ctor: function(normalImage, selectedImage, disableImage, texType){
        this._pressedActionEnabled = false;
        this._pressedColorEnabled = false;
        this._currentScaleX = 1;
        this._currentScaleY = 1;
        this._zoomScale = 0.5;

        this._super(normalImage, selectedImage, disableImage, texType);
        this.initButton();
    },

    initButton: function(){
        this.setPressedActionEnabled(true);
        this.setPressedColorEnabled(false);
        this.addTouchEventListener(this.onButtonTouch, this);
    },

    onButtonTouch: function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                if (this._pressedActionEnabled){
                    this.runAction(cc.scaleTo(0.05, this._currentScaleX + this._zoomScale, this._currentScaleY + this._zoomScale));
                }
                if (this._pressedColorEnabled){
                    this.setColor(cc.color(166,166,166));
                }
                break;
            case ccui.Widget.TOUCH_MOVED:
                var location = this.convertToNodeSpace(sender.getTouchMovePosition());
                if (!cc.rectContainsPoint(cc.rect(0,0, this.getContentSize().width, this.getContentSize().height), location)){
                    if (this._pressedActionEnabled){
                        this.runAction(cc.scaleTo(0.05, this._currentScaleX, this._currentScaleY));
                    }
                    if (this._pressedColorEnabled){
                        this.setColor(cc.color(255, 255,255));
                    }
                }
                else{
                    if (this._pressedActionEnabled){
                        this.runAction(cc.scaleTo(0.05, this._currentScaleX + this._zoomScale, this._currentScaleY + this._zoomScale));
                    }
                    if (this._pressedColorEnabled){
                        this.setColor(cc.color(166,166,166));
                    }
                }
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                if (this._pressedActionEnabled){
                    this.runAction(cc.scaleTo(0.05, this._currentScaleX, this._currentScaleY));
                }
                if (this._pressedColorEnabled){
                    this.setColor(cc.color(255, 255,255));
                }
                break;
                break;
        }
    },

    setPressedActionEnabled: function(enable){
        this._super(enable);
        this._pressedActionEnabled = enable;
    },

    setPressedColorEnabled: function(enable){
        this._pressedColorEnabled = enable;
    },

    setScaleX: function(scaleX){
        this._super(scaleX);
        this._currentScaleX = scaleX;
    },

    setScaleY: function(scaleY){
        this._super(scaleY);
        this._currentScaleY = scaleY;
    },

    setScale: function(scale){
        this._super(scale);
        this._currentScaleX = scale;
        this._currentScaleY = scale;
    },
});