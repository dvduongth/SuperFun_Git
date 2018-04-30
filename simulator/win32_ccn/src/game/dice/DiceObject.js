/**
 * Created by GSN on 1/25/2016.
 */

var DiceObject = jsb.Sprite3D.extend({
    tailParticle : null, //particle gan vao duoi xuc sac tam thoi chua dung
    bounceEffect : [2], //hieu ung 3D khi xuc sac cham san
    bounceIndex : 0, //so lan nay len hien tai
    actionList : [], //danh sach cac chuyen dong hien tai cua xuc sac
    standPos : -1, //standpos cua nguoi choi so huu xuc sac
    diceIndex : -1, //index cua xuc sac

    //createTail:true,
    ctor : function(modelResourceName, textureResourceName, bounceParticle, tailParticle, parent){
        this._super(modelResourceName);
        this.setTexture(textureResourceName);
        this.setScale(70);
        this.setPosition3D({x: 0, y: 0, z: 0});
        this.bounceEffect = [2];
        this.initDiceEffect(bounceParticle, tailParticle, parent);
        this.bounceIndex = 0;
        this.actionList = [];
        parent.addChild(this);

        this.setLightMask(cc.LightFlag.LIGHT0);

        //init shadow
        //bong cua con xuc xac
        this.shadow = new cc.Sprite("res/shadow/shadow1.png");
        parent.addChild(this.shadow);
        this.shadow.setScale(1);
        this.countReset = 0;

        //this.tailParticle =new cc.ParticleSystem("res/particle/Particle/tail_particle1.plist");
        //this.tailParticle = jsb.PUParticleSystem3D.create("res/particle/particle3d/scripts/"+"tail1.pu");
        //this.tailParticle.setScale(20);
        //this.tailParticle.setRotation3D(cc.math.vec3(90,0,0));
        //parent.addChild(this.tailParticle);
        //this.setVisibleTailParticle(false);
        //this.Create_Tail_3D();
        this.schedule(this.update,1/60);
        //this.Create_Tail_3D();


    },

    initDiceInfo : function(standPos, diceIndex){
        this.standPos = standPos;
        this.diceIndex = diceIndex;
    },

    initDiceEffect : function(bounceParticle, tailParticle, parent){
        //init bounce pariticle
        for(var i=0; i< 2; i++){
            this.bounceEffect[i] = jsb.PUParticleSystem3D.create(bounceParticle);
            this.bounceEffect[i].setPosition3D(cc.math.vec3(0,0,0));
            this.bounceEffect[i].setScale(20);
            this.bounceEffect[i].setRotation3D(cc.math.vec3(90,0,0));
            parent.addChild(this.bounceEffect[i]);
        }


        //init tail particle
        //this.tailParticle = jsb.PUParticleSystem3D.create("res/particle/particle3d/scripts/"+"spiralStars.pu");
        //this.addChild(this.tailParticle);


    },

    setVisibleTailParticle : function(visible){
        this.tailParticle.setVisible(visible);
    },

    makeBounceEffect : function(){
        var bounceEff = this.bounceEffect[this.bounceIndex];
        var dicePosition = this.getPosition3D();
        bounceEff.setPosition3D(cc.math.vec3(dicePosition.x, dicePosition.y, dicePosition.z ));
        bounceEff.stopParticleSystem();
        bounceEff.startParticleSystem();
        //cc.log("Make bounce Effect: x="+dicePosition.x+" y="+dicePosition.y+" z="+dicePosition.z - 10);
        this.bounceIndex=(this.bounceIndex+1)%2;
        //this.setVisibleTailParticle(false);
    },

    Create_Tail_3D:function(){
        var parent = this.getParent();
        //var tail = new jsb.Sprite3D("res/dice/dice.obj");
        //tail.setTexture("res/dice/dice-5.jpg");
        //tail.setScale(70);
        var dicePosition = this.getPosition3D();
        var tail = new cc.Sprite("res/shadow/shadow1.png");
        tail.setPosition(cc.math.vec3(dicePosition.x+20, dicePosition.y+10, dicePosition.z));
        parent.addChild(tail);
        tail.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(function(){
                tail.removeFromParent();
            })
        ));
    },
    update:function(dt){
        if(this.countReset>0){
            this.countReset--;
        }
        var dicePosition = this.getPosition3D();
        var shadowPosition = this.shadow.getPosition3D();
        if(shadowPosition.z == dicePosition.z-50){

        }else{
            this.shadow.setPosition3D(cc.math.vec3(dicePosition.x-10, dicePosition.y+10, dicePosition.z-50-this.countReset*3));
            //cc.log("CUONG" + (dicePosition.x) + "     " + dicePosition.y + "           "+dicePosition.z);
        }
        //if(this.createTail){
        //    this.Create_Tail_3D();
        //}
        //this.tailParticle.setPosition(dicePosition);

    },

});