/**
 * Created by GSN on 1/27/2016.
 */

    //action quay cua con xuc sac hki duoc tung
var TweenRotate = cc.Class.extend({
    target : null, //hinh anh 3d cua xuc sac
    duration : 0, // thoi luong quay
    timeElapsed : 0, // thoi gian da quay
    startRotate : null, //goc quay bat dau
    desRotate : null, //goc quay ket thuc
    rotating : false,   //da bat dau quay hay chua

    ctor : function(){

    },

    // constructor rotate
    initRotate : function(target, duration, desRotate){
        this.target = target;
        this.duration = duration;
        this.startRotate = target.getRotation3D();
        this.desRotate = desRotate;
        this.timeElapsed = 0;
    },

    //update quay cua xuc xac
    update : function(dt){
        // kiem tra dieu kien
        if(this.target == null || !this.rotating)
            return;

        // cong thoi gian :)
        this.timeElapsed+=dt;
        if(this.timeElapsed >= this.duration){
            this.rotating = false;
            return;
        }


        var factor = this.calculateCurrentFactor();
        var nextRotate = cc.math.vec3(0,0,0);
        nextRotate.x = cc.lerp(this.startRotate.x, this.desRotate.x, factor); // tinh toan doan ti le giua 2 so A, b
        nextRotate.y = cc.lerp(this.startRotate.y, this.desRotate.y, factor);
        nextRotate.z = cc.lerp(this.startRotate.z, this.desRotate.z, factor);

        this.target.setRotation3D(nextRotate);
    },

    // neu thoi gian cang gan thoi gian ket thuc thi factor cang lon
    calculateCurrentFactor : function(){
        return Math.min(1, this.timeElapsed/this.duration);
    },

    // bat dau xoay thi gan dang xoay = true :)
    start : function(){
        this.rotating = true;
    }
});

// khoi tao 1 cai rote cho no
TweenRotate.makeRotate = function(target, duration, desRotate){
    var rotateObj = target.actionList["tweenrotate"];
    if(rotateObj == undefined || rotateObj==null){
        rotateObj = new TweenRotate();
        target.actionList["tweenrotate"] = rotateObj;
    }

    rotateObj.initRotate(target, duration, desRotate);
    return rotateObj;
};