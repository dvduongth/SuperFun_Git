var constant_LineControl = {
    BUTTON:"res/particle/test.png",
    LINE:"res/fx_4h.png",
    MAX_S:2,
    MAX_LINE:12
};

var LineControl = BaseGui.extend({

    ctor: function (standpos,piece) {
        this._super();

        // khoi tao bien
        this.listLine = [];
        this.fixPosition= null;
        this.target=null;
        this.destinationAnim=null;
        // gan cac bien
        this.target = piece;
        //create fixPosition
        var color = GameUtil.getRGBColorById(gv.matchMng.playerManager.getPlayerInfoByStandPos(standpos).playerColor);
        this.fixPosition = this.Get_Position_By_StandPos(standpos);

        var sprite = fr.createSprite(constant_LineControl.BUTTON);
        sprite.setPosition(this.fixPosition);
        sprite.runAction(cc.tintTo(0.01,color));
        sprite.setBlendFunc(gl.ONE,gl.ONE);
        sprite.setScale(1.5*2,1.5*2);
        sprite.setOpacity(180);
        this.addChild(sprite);
        sprite.runAction(cc.sequence(
            cc.scaleBy(1.5,1/2),
            cc.scaleBy(1.5,1/2).reverse()
        ).repeatForever());

        this.destinationAnim = fr.createSprite(constant_LineControl.BUTTON);
        this.destinationAnim.runAction(cc.tintTo(0.01,color));
        this.destinationAnim.setPosition(this.fixPosition);
        this.destinationAnim.setBlendFunc(gl.ONE,gl.ONE);
        this.destinationAnim.setScale(1.5*2,1.5*2);
        this.destinationAnim.setOpacity(180);
        this.addChild(this.destinationAnim);
        this.destinationAnim.runAction(cc.sequence(
            cc.scaleBy(1.5,1/2),
            cc.scaleBy(1.5,1/2).reverse()
        ).repeatForever());


        //
        var list = [];
        for(var i=0;i<constant_LineControl.MAX_LINE;i++){
            var particle = fr.createSprite("res/particle/Particle/fx_4n.png");
            particle.setPosition(0,0);
            particle.setVisible(false);
            list.push(particle);
        }

        this.listLine = list;

        for(var i=0;i<constant_LineControl.MAX_LINE;i++){
            this.listLine[i].setBlendFunc(gl.ONE,gl.ONE);
            this.listLine[i].setAnchorPoint(0,0.5);
            this.addChild(this.listLine[i]);
            this.listLine[i].setVisible(false);
            this.listLine[i].runAction(cc.tintTo(0.01,color));
            this.Action_Sprite(this.listLine[i]);
        }

        //update
        this.schedule(this.update,1/60);
    },

    Get_Position_By_StandPos:function(standPos){
        //var size = cc.winSize;
        //var fixPosition;
        //switch(standPos) {
        //    case 1:
        //    {
        //        fixPosition = new cc.p(size.width/2 - 100, -25);
        //        break;
        //    }
        //    case 2:
        //    {
        //        fixPosition = new cc.p(-50, size.height/2 - 75 );
        //        break;
        //    }
        //    case 3:
        //    {
        //        fixPosition = new cc.p(-size.width/2 + 100 , -25);
        //        break;
        //    }
        //    case 0:
        //    {
        //        fixPosition = new cc.p(50 , -size.height/2 + 75 );
        //        break;
        //    }
        //}
        //return fixPosition;
        return cc.p(gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos).x,gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos).y +50);
    },

    Action_Sprite:function(sprite){
        var deltatime = 1/8;
        sprite.runAction(cc.sequence(
            cc.callFunc(function(){
                sprite.setOpacity(230)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(205)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(180)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(155)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(130)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(105)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(90)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(75)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(90)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(105)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(130)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(155)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(180)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(205)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(230)
            }),
            cc.delayTime(deltatime),
            cc.callFunc(function(){
                sprite.setOpacity(255)
            }),
            cc.delayTime(deltatime)

        ).repeatForever());
    },

    Draw_Line:function(position1,position2){
        this.destinationAnim.setPosition(position1);
        for(var i=0;i<2;i++){
            var random = Math.random()*constant_LineControl.MAX_S*2;
            var random1 = Math.random()*constant_LineControl.MAX_S*2;
            var midPoint = cc.p((position1.x+position2.x)/2 +random-constant_LineControl.MAX_S,(position1.y+position2.y)/2+random1-constant_LineControl.MAX_S);

            random = Math.random()*constant_LineControl.MAX_S*2;
            random1 = Math.random()*constant_LineControl.MAX_S*2;
            var point14 = cc.p((position1.x+midPoint.x)/2 +random-constant_LineControl.MAX_S,(position1.y+midPoint.y)/2+random1-constant_LineControl.MAX_S);
            random = Math.random()*constant_LineControl.MAX_S*2;
            random1 = Math.random()*constant_LineControl.MAX_S*2;
            var point34 = cc.p((position2.x+midPoint.x)/2+random-constant_LineControl.MAX_S ,(position2.y+midPoint.y)/2+random1-constant_LineControl.MAX_S);
            this.Draw_One_Line(position1,point14,this.listLine[i*4]);
            this.Draw_One_Line(point14,midPoint,this.listLine[1+i*4]);
            this.Draw_One_Line(midPoint,point34,this.listLine[2+i*4]);
            this.Draw_One_Line(point34,position2,this.listLine[3+i*4]);
        }
    },

    Draw_One_Line:function(position1,position2,line){
        var d = Math.sqrt((position1.x - position2.x)*(position1.x - position2.x) + (position1.y - position2.y)*(position1.y - position2.y));
        line.setVisible(true);
        if(position1.x > position2.x){
            line.setPosition(position2);
        }else{
            line.setPosition(position1);
        }

        line.setScale((d+1)/line.getContentSize().width,2);

        var a = (position1.y - position2.y)/(position1.x - position2.x);

        line.setRotation(-Math.atan(a)/Math.PI*180);
    },

    update:function(dt){
        this.Draw_Line(this.target.getPosition(),this.fixPosition);
    }

});


//var RainBowRun = BaseGui.extend({
//
//    ctor:function(target){
//        this._super();
//        this._target = target;
//        //this.time = 0;
//        this._streak = new cc.MotionStreak(0.3, 4, 60, cc.color(255,255,255), "res/game/rainbowBlur6.png");
//        this._streak.setBlendFunc(gl.ONE,gl.ONE);
//        this.addChild(this._streak);
//
//        //this.particle = new cc.ParticleSystem("res/particle/Particle/particle_rainbow.plist");
//        //this.addChild(this.particle);
//        ////this.particle.setBlendFunc(gl.ONE,gl.ONE);
//        //this.particle.setScale(1/2);
//
//        this.schedule(this.onUpdate,1/60);
//
//        //var deltatime = 0.15;
//        //var colorAction = cc.sequence(
//        //    cc.tintTo(deltatime, 255, 0, 0),
//        //    cc.tintTo(deltatime, 0, 255, 0),
//        //    cc.tintTo(deltatime, 0, 0, 255),
//        //    cc.tintTo(deltatime, 0, 255, 255),
//        //    cc.tintTo(deltatime, 255, 255, 0),
//        //    cc.tintTo(deltatime, 255, 0, 255),
//        //    cc.tintTo(deltatime, 255, 255, 255)
//        //).repeatForever();
//        //this._streak.runAction(colorAction);
//
//    },
//    onUpdate:function () {
//        this._streak.x = this._target.x;
//        this._streak.y = this._target.y;
//    }
//});



