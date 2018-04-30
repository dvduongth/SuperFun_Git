/**
 * Created by bachbv on 4/17/2017.
 */

var Tooltip = {
    _padding: 20,

    init: function(){
        this._init = true;
        this._minSize = cc.p(62, 78);
        this._tooltipIndex = 0;
        this._tooltipPool = {};

        this._nodeContainer = new cc.Node();
        this._nodeContainer.setCascadeOpacityEnabled(true);
        this._nodeContainer.retain();

        this._content = null;

        this._imgBg = new cc.Scale9Sprite(res.bg_tooltip_png, cc.rect(0, 0, 62, 78), cc.rect(29, 38, 3, 3));
        this._imgBg.setCascadeOpacityEnabled(true);
        this._imgBg.retain();

        //this._lbTitle = new cc.LabelBMFont("", "res/fonts/arial-unicode-26.fnt");
        //this._lbTitle.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        //this._lbTitle.retain();

        this._nodeContainer.addChild(this._imgBg);
        //this._imgBg.addChild(this._lbTitle);
    },

    setPadding: function(p){
        this._padding = p;
    },

    /**
     *
     * @private
     */
    _updateParent: function(){
        var curScene = sceneMgr.getCurrentScene();
        if(curScene) {
            var layer = curScene.getLayer(GV.LAYERS.GUI);
            if (this._nodeContainer.parent != layer) {
                this._nodeContainer.removeFromParent(false);
                layer.addChild(this._nodeContainer, 999);
            }
        }
    },

    /**
     *
     * @private
     */
    _updateSize: function(){
        //cc.error("_updateSize");
        var contentSize = this._content.getContentSize();
        var imgSize = this._imgBg.getContentSize();

        //cc.log("update content size %d, %d", contentSize.width, contentSize.height);

        this._imgBg.width = Math.max(contentSize.width + (this._padding << 1), imgSize.width);
        this._imgBg.height =  Math.max(contentSize.height + (this._padding << 1), imgSize.height);

        //cc.log("image content size %d, %d", this._imgBg.width, this._imgBg.height);
        contentSize = null;
        imgSize = null;
    },

    /**
     *
     * @private
     */
    _updateComponentsPosition: function(){
        this._content.setPosition(this._imgBg.width / 2, this._imgBg.height / 2);
    },

    isShowing: function(){
        //cc.log("visible = %s, opacity = %d", this._nodeContainer.visible, this._nodeContainer.getOpacity());
        return this._nodeContainer && this._nodeContainer.visible && this._nodeContainer.getOpacity() > 0;
    },

    _calculatePositionShowing: function(worldPos, targetSize){
        var directionToCenter = cc.pNormalize(cc.pSub(cc.p(GV.VISIBALE_SIZE.width >> 1, GV.VISIBALE_SIZE.height * 0.75), worldPos));
        if(cc.pointEqualToPoint(directionToCenter, cc.p(0, 0))){
            directionToCenter.y = 1;
        }

        var offset = 5;
        if(Math.abs(directionToCenter.x) > Math.abs(directionToCenter.y)){
            var dBetween2Center = (((targetSize.width + this._imgBg.width) >> 1) + offset) / Math.abs(directionToCenter.x);
        }
        else{
            var dBetween2Center = (((targetSize.height + this._imgBg.height) >> 1) + offset) / Math.abs(directionToCenter.y);
        }


        directionToCenter = cc.pMult(directionToCenter, dBetween2Center);
        //cc.log("direction = %d, %d", directionToCenter.x, directionToCenter.y);
        this._imgBg.setPosition(worldPos.x + directionToCenter.x, worldPos.y + directionToCenter.y);

        directionToCenter = null;
    },

    addTooltipText: function(textList, target){
        if(target && target instanceof cc.Node){
            var self = this;
            target.setUserData({tooltipIndex: self._tooltipIndex});
            if(!self._tooltipPool[self._tooltipIndex]){
                self._tooltipPool[self._tooltipIndex] = {textList: textList, target: target};
            }

            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var data = target.getUserData();
                    var tooltipIndex = data.tooltipIndex;

                    if(self._tooltipPool[tooltipIndex]){
                        var locationInNode = target.convertToNodeSpace(touch.getLocation());
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height);

                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            var tooltipObj = self._tooltipPool[tooltipIndex];
                            self.showText(tooltipObj.textList, tooltipObj.target);
                            return true;
                        }
                    }
                    return false;
                },

                onTouchEnded: function (touch, event) {
                    self.hide();
                }
            });

            cc.eventManager.addListener(listener, target);
            ++self._tooltipIndex;
        }
    },

    addTooltip: function(createContentFunc, target){
        if(target && target instanceof cc.Node){

        }
    },

    show: function(content, target){
        //cc.log("content size %d, %d", content.getContentSize().width, content.getContentSize().height);

        if(target && target instanceof cc.Node){
            this._nodeContainer.setVisible(true);

            this._content = content;
            var targetSize = target.getContentSize();
            var targetAnchorPoint = target.getAnchorPoint();

            // re-position to center of target
            var dx = (0.5 - targetAnchorPoint.x) * targetSize.width;
            var dy = (0.5 - targetAnchorPoint.y) * targetSize.height;
            var centerTargetPos = cc.pAdd(target.getPosition(), cc.p(dx, dy));
            var worldPos = target.getParent().convertToWorldSpace(centerTargetPos);

            this._imgBg.addChild(content);

            this._updateParent();
            this._updateSize();
            this._updateComponentsPosition();
            this._calculatePositionShowing(worldPos, targetSize);
        }
    },

    showText: function(textList, target){
        if(!target) return;

        var content = new cc.Node();
        content.retain();
        var label = null;
        var labelPrev = null;
        var width = 0, height;

        var offset = 2;
        for(var i = textList.length - 1; i >= 0; --i){
            label = new cc.LabelTTF("", "font_game_bold", 20);
            label.color = Utility.getColorByName('yellow');
            label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            label.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);

            label.setString(textList[i]);
            var labelSize = label.getContentSize();
            if(labelPrev){
                var prevLabelSize = labelPrev.getContentSize();
                label.setPosition(labelPrev.x - ((prevLabelSize.width - labelSize.width) >> 1), labelPrev.y + ((prevLabelSize.height + labelSize.height) >> 1) + offset);
                //cc.log("pos = %d, %d", labelPrev.x - (prevContentSize.width - labelSize.width) >> 1, labelPrev.y - (prevContentSize.height + labelSize.height) >> 1);
            }
            else{
                label.setPosition(labelSize.width >> 1, labelSize.height >> 1);
            }

            if(labelSize.width > width){
                width = labelSize.width;
            }

            labelPrev = label;
            content.addChild(label);
        }

        height = Math.abs(label.y) + (label.getContentSize().height >> 1);
        content.setContentSize(width, height);
        content.setAnchorPoint(0.5, 0.5);

        //cc.log("width = %d, height = %d", width, height);
        this.show(content, target);
    },

    _cleanContent: function(){
        if(this._content){
            var allChildren = this._content.getChildren();

            if(allChildren && allChildren.length > 0){
                for(var i = 0; i < allChildren.length; ++i){
                    allChildren[i].removeFromParent();
                }

                allChildren.splice(0, allChildren.length);
                allChildren = null;
            }

            this._content.removeFromParent();
            this._content = null;
        }
    },

    hide: function(){
        // clean content
        this._cleanContent();

        // invisible and resize bg
        this._nodeContainer.setVisible(false);
        this._imgBg.width = this._minSize.x;
        this._imgBg.height = this._minSize.y;

        // cleanUp all components
    },

    cleanPool: function(){
        for(var index in this._tooltipPool){
            for(var key in this._tooltipPool[index]){
                this._tooltipPool[index][key] = null;
            }
            this._tooltipPool[index] = null;
        }

        this._tooltipPool = {};
    },

    cleanUp: function(){
        this._cleanContent();
        this._imgBg.removeFromParent();
        this._nodeContainer.removeFromParent();
        this._tooltipPool = null;
        this._minSize = null;
        this._imgBg = null;
        this._nodeContainer = null;
    },
};
