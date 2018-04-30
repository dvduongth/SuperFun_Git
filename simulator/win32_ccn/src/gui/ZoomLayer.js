/**
 * Created by zoro on 7/21/2018.
 */





var ZOOM_FACTOR = 1.5;

var ZoomLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.isZoomIn = false;
        this.isForceZoom = false;
        this.bgSize = {};
        this.firstTouch = {x:0, y:0};
        this.isFinishZoom = false;
        this.viewPointSize = {};

        return true;
    },
    initZoom: function (bgSize, viewPoint) {
        this.bgSize = bgSize;
        this.setContentSize(bgSize);
        this.viewPointSize = viewPoint;
    },
    onZoomTouchBegan:function(touch)
    {
       // var self = event.getCurrentTarget();
        var pos = touch.getLocation();
        this.firstTouch.x = pos.x;
        this.firstTouch.y = pos.y;



        var winSize = cc.director.getWinSize();
        this.newAnchor = cc.p(pos.x/winSize.width, pos.y/winSize.height);
        this.setAnchorPoint(this.newAnchor);
        //this.oldPos =  this.getPosition();
    },
    setNewAnchorPoint: function (point) {
        this.newAnchor = point;
    },
    onZoomTouchEnded: function (touch) {
        this.ZoomOut(false);
    },
    updateCamera:function(moveX, moveY) {
        var rateX;
        var rateY;
        if(this.newAnchor.x > 0.5)
        {
            rateX = 1.0 - this.newAnchor.x;
        }else
        {
            rateX = this.newAnchor.x;
        }
        if(this.newAnchor.y >0.5)
        {
            rateY = 1.0 - this.newAnchor.y;
        }else
        {
            rateY = this.newAnchor.y;
        }
        var maxX = (this.bgSize.width * ZOOM_FACTOR - cc.director.getWinSize().width)*rateX;
        var maxY = (this.bgSize.height * ZOOM_FACTOR - cc.director.getWinSize().height)*rateY;

        moveX = Math.max(Math.min(moveX, maxX), -maxX);
        moveY = Math.max(Math.min(moveY, maxY), -maxY);

        this.setPosition(moveX,moveY);


    },
    onZoomTouchMove: function (touch) {
        var pos = touch.getLocation();

        this.ZoomIn(false);

        //if (this.isForceZoom) {
        //    return;
        //}
        if(!this.isFinishZoom)
        {
            this.firstTouch.x = pos.x;
            this.firstTouch.y = pos.y;
            return;
        }

        var moveX = pos.x - this.firstTouch.x;
        var moveY = pos.y - this.firstTouch.y;

        this.updateCamera(moveX,moveY);
    },
    ZoomOut: function (isForceZoom) {
       // return;
       // if (this.isZoomIn == true ) {
       //
       //     this.setIsZoomIn(false);
       //     var actionZoom = cc.scaleTo(0.2, this.defaultScale);
       //     this.runAction(actionZoom);
       //
       //     var actionMove = cc.moveTo(0.2, cc.p(0, 0));
       //     this.runAction(actionMove);
       //
       //
       //
       //     this.isFinishZoom = false;
       // }
        if (this.isZoomIn == true && (isForceZoom || this.isForceZoom == false)) {

            this.setIsZoomIn(false);
            var actionZoom = cc.scaleTo(0.2, 1);
            this.runAction(actionZoom);

            var actionMove = cc.moveTo(0.2, cc.p(0, 0));


            var sequence = cc.sequence(actionMove, cc.callFunc(this.onZoomOutFinish,this));
            this.runAction(sequence);
            this.isForceZoom = false;

            this.isFinishZoom = false;
        }

    },
    setIsZoomIn: function (val) {
        this.isZoomIn = val;
    },
    onZoomOutFinish:function()
    {
    },
    onActionZoomInFinish: function () {
        this.isFinishZoom = true;

    },
    ZoomIn: function (isForceZoom ) {
        //return;
        if (this.isZoomIn == false && (isForceZoom || this.isForceZoom == false)) {

            this.setIsZoomIn(true);
            var actionZoom = cc.scaleTo(0.2, ZOOM_FACTOR);

            var sequence = cc.sequence(actionZoom, cc.callFunc(this.onActionZoomInFinish,this));
            this.runAction(sequence);
            this.isForceZoom = isForceZoom;
        }

    }
});
