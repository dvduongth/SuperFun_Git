/**
 * Created by GSN on 10/15/2015.
 */

var CharacterShadow = cc.Node.extend({
        shadowList : [],
        pieceDisplay: null,
        followTarget : null,
        currFrameTime: 0,
        enable : false,
        flip : false,

        ctor: function (charDisplay, followTarget) {
            this._super();
            this.pieceDisplay = charDisplay;
            this.shadowList = [];
            this.followTarget = followTarget;
            this.flip = false;
        },

        update: function (dt) {
            this.currFrameTime += dt;
            if(this.currFrameTime > 0.07){
                this.currFrameTime = 0;
                this.makeNewShadow();
            }
        },

        makeNewShadow: function () {
            var shadow = null;
            if(this.shadowList.length == 0) {
                shadow = new cc.Sprite(this.pieceDisplay);
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(shadow);
            }
            else {
                shadow = this.shadowList.shift();
                shadow.setVisible(true);
            }
            shadow.setScaleX(this.followTarget.getScaleX());
            shadow.setScaleY(this.followTarget.getScaleY());
            shadow.setAnchorPoint(this.followTarget.getAnchorPoint());
            shadow.setPosition(cc.p(this.followTarget.getPosition().x - 10, this.followTarget.getPosition().y - 10));
            shadow.setOpacity(100);
            shadow.setLocalZOrder(this.followTarget.getLocalZOrder()-1);

            var _this = this;
            shadow.runAction(cc.sequence(cc.fadeOut(1.0), cc.callFunc(function(){
                shadow.setVisible(false);
                _this.shadowList.push(shadow);
            })));

        },

        setEnable: function (enable) {
            //return;
            if(enable == this.enable)
                return;

            this.enable = enable;
            if(enable){
                this.scheduleUpdate();
            }
            else{
                this.unscheduleUpdate();
            }
        },

        isEnable : function(){
            return this.enable;
        },

        setFlip : function(flip){
            this.flip = flip;
        }
});
