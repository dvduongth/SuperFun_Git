/**
 * Created by GSN on 12/11/2015.
 */

var CameraManager = cc.Class.extend({

    mainboardGui : null,
    trackNode : null,
    positionQueue : [],
    tracking : false,
    lockZoom : false,
    cameraSpeed : 300,
    focusing : false,
    scaleVal : 1.2,
    focusCallback : null,

    ctor : function(mainboardGui){
        this.HALF_WIN_SIZE = cc.p(cc.winSize.width/2, cc.winSize.height/2);
        this.mainboardGui = mainboardGui;
        this.trackNode = new cc.Node();
        this.trackNode.setPosition(this.HALF_WIN_SIZE);
        this.mainboardGui.addChild(this.trackNode, 999);

    },

    cleanUp : function(){
        this.trackNode.removeFromParent();
    },

    //schedule update loop cho camera manager
    initUpdateRoutine : function(){
        cc.director.getScheduler().scheduleUpdateForTarget(this, 1, false);
    },

    //add them mot vi tri vao track path, camera se di chyen theo duong noi cac diem cua track path
    addPositionToCameraTrackPath : function(position){
        this.positionQueue.push(position);
    },

    //cho camera zoom vao mot vi tri co dinh
    //initPosition : vi tri zoom vao
    //focusCallback : callback sau khi zoom xong
    makeCameraTracking : function(initPosition, focusCallback){

        cc.log("makeCameraTracking: pos = " + initPosition.x+" "+initPosition.y);
        if(!this.lockZoom && !this.tracking){
            this.tracking = true;
            this.focusing = true;
            if(this.focusCallback!=null)
                cc.log("chet cmnr");
            this.focusCallback = focusCallback;
            this.trackNode.setPosition(cc.pAdd(initPosition, this.HALF_WIN_SIZE));
            cc.log("Tracknode: "+ this.trackNode.getPositionX()+" "+this.trackNode.getPositionY());
            this.positionQueue=[];
            this.mainboardGui.zoomIn(initPosition, this.scaleVal, 0.5, this.onFocusFinished.bind(this));
        }
    },

    //chuyen camera tu trang thai zoom ve trang thai binh thuong
    //focusCallback : callback sau khi thu zoom xong
    disableCameraTracking : function(focusCallback){
        if(this.tracking){
            cc.log("disable cammera tracking");
            this.mainboardGui.stopActionByTag(6969);
            this.tracking = false;
            this.focusing = true;
            this.focusCallback = focusCallback;
            this.mainboardGui.zoomOut(0.5, this.onFocusFinished.bind(this));
        }
    },

    setCameraSpeed : function(speed){
        this.cameraSpeed = speed;
    },

    onFocusFinished : function(){
        this.focusing = false;
        if(this.tracking){
            var followAction =cc.follow(this.trackNode, cc.rect(-999,-999,9999,9999));
            followAction.setTag(6969);
            this.mainboardGui.runAction(followAction);
        }

        if(this.focusCallback !== undefined && this.focusCallback != null) {
            var temp = this.focusCallback;
            this.focusCallback = null;
            temp();
        }
    },

    //update cho camera di chuyen doc theo duong noi cac diem trong track path
    update : function(dt){
        return;
        if(this.tracking && !this.focusing){
            if(this.positionQueue.length!=0){
                var targetPosition = this.positionQueue[0];
                targetPosition = cc.pAdd(targetPosition, this.HALF_WIN_SIZE);
                var moveVector = cc.pSub(targetPosition, this.trackNode.getPosition());
                var directionVector = cc.pMult(moveVector, 1/cc.pLength(moveVector));
                var deltaLength = this.cameraSpeed*dt > cc.pLength(moveVector) ? cc.pLength(moveVector) : this.cameraSpeed*dt;
                var deltaVector = cc.pMult(directionVector, deltaLength);
                this.trackNode.setPosition(cc.pAdd(this.trackNode.getPosition(), deltaVector));
                if(cc.pDistance(this.trackNode.getPosition(), targetPosition) < 1)
                    this.positionQueue.shift();
            }
        }
    },

    isLockZoom : function(){
        return this.lockZoom;
    },

    setLockZoom : function(enable){
        this.lockZoom = enable;
    }

});