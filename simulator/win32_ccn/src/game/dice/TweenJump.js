/**
 * Created by GSN on 1/25/2016.
 */
//action nay cua xuc sac
var TweenJump = cc.Class.extend({
    target : null, //xuc sac 3d image
    duration : 0, //thoi luong cua buoc nay
    startPos : null, //vi tri bat dau
    endPos : null, //vi tri ket thuc
    height : 0, //chieu cao buoc nay
    jumps : 0, //tong so lan nay
    bounce : 0, //so lan nay hien tai tren tong so
    previousPos : null,// vi tri truoc khi cap nhat
    timeElapsed : 0,// thoi gian da thuc hien
    bounceCallback :null, //finish callback
    isJump : false, //da bat dau nay hay chua

    ctor : function(){

    },

    // khoi tao cho viet Jump cua xuc xav
    initJump : function(target, duration, startPos, endPos, height, jumps, bounce){
        //cc.log("Dice jump start: x= "+startPos.x+" y="+startPos.y+" z="+startPos.z+" height: "+height);
        //cc.log("Dice jump des: x= "+endPos.x+" y="+endPos.y+" z="+endPos.z);

        this.target = target;//muc tieu duoc Jump
        this.duration = duration;// thoi gian jump
        this.timeElapsed = 0;   // thoi gian da thuc hien jump
        this.startPos = startPos;   // vi tri bat dau
        this.endPos = endPos;// vi tri ket thuc
        this.endPos = cc.math.vec3Sub(this.endPos, this.startPos);// khoang cach thay doi theo cac vector (vector di chuyen)
        this.previousPos = startPos;// khong thay su dung :)
        this.height = height;   // do cao
        this.jumps = jumps;   // nhay? ko thay su dung
        this.bounce = bounce; // tung len
    },

    update : function(dt){
        if(this.target != null && this.isJump){
            this.timeElapsed+=dt;
            var completedRate = Math.max(0, Math.min(1, this.timeElapsed/this.duration));
            var z = this.height * 4 * completedRate * (1 - completedRate);
            z +=this.endPos.z * completedRate;
            var x = this.endPos.x * completedRate;
            var y = this.endPos.y * completedRate;
            var deltaMove = cc.math.vec3(x, y, z);
            var newPosition = cc.math.vec3Add(this.startPos, deltaMove);
            //cc.log("curr Pos: x="+newPosition.x+" y="+newPosition.y+" z="+newPosition.z);
            this.target.setPosition3D(newPosition);
            if(this.timeElapsed >= this.duration){
                this.onBounce();
            }
        }
    },

    // da nhay xong hay chua?
    isDone : function(){
        return this.timeElapsed >= this.duration;
    },

    // bat dau thi gan dang nhay = true
    start : function(){
        this.isJump = true;
    },

    // sau khi nhay xong thi goi callback
    setBounceCallback : function(callback){
        this.bounceCallback = callback;
    },

    // goi de nhay xuc xac
    onBounce : function(){
        // neu het so lan nhay
        if(this.bounce <= 0){
            this.isJump = false;
            return;
        }

        // goi call back
        if(this.bounceCallback != null){
            this.bounceCallback(this.target, this.bounce);
        }
        else{
            cc.assert(false, "bounce callback null");
        }

        this.isJump = true;
        this.bounce--;
        // tinh khoang cach cua 2 vector
        var vec3Delta = cc.math.vec3Sub(this.startPos, this.endPos);

        vec3Delta = cc.math.vec3Normalize(vec3Delta);
        vec3Delta = cc.math.vec3(-0.07*vec3Delta.x, -0.07*vec3Delta.y, -0.07*vec3Delta.z);
        this.duration*=0.65;
        this.height*=0.2;

        this.initJump(this.target, this.duration, this.target.getPosition3D(), cc.math.vec3Add(this.target.getPosition3D(), vec3Delta), this.height, 1 , this.bounce);

    }
});

// khoi tao jump cho target
TweenJump.makeTweenJump = function(target, duration, startPos, endPos, height, jumps, bounce){
    var jumpObj = target.actionList["tweenjump"];
    if(jumpObj == undefined || jumpObj == null){
        jumpObj = new TweenJump();
        target.actionList["tweenjump"] = jumpObj;
    }

    jumpObj.initJump(target, duration, startPos, endPos, height, jumps, bounce);
    return jumpObj;
}

