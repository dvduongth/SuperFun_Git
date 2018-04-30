var ConstantTestGold = {
    TIME_PER_ACTION: 0.05,
    TIME_DELAY: 0.3,
    TIME_MOVE_ACTION: 0.3
};

var TestGold = BaseGui.extend({

    ctor:function(){
        this._super(res.ZCSD_GUI_GOLD);
        this.listSprite = [];
        var betLevel = gv.matchMng.gameStatusObject.betLevelID;
        this.goldPerCoint = GameModeConfig.getInstance().getMiniGameTuXiMoneyBetLevel(betLevel);
        this.listIn = [];
        this.listOut = [];
        this.callback = null;
        for(var i=0;i<4;i++) {
            var node = this._centerNode.getChildByName("tien_" + (i + 1));
            var desNode = this._centerNode.getChildByName("node_" + (i+1));
            node.setPosition(this.getPositionOutOfScreen(i));
            desNode.setPosition(this.getPositionDesNode(i));
        }
    },

    getPositionDesNode:function(i){
        var size = cc.winSize;
        switch (i){
            case 0:{
                return cc.p(0,-size.height/2+100);
            }
            case 1:{
                return  cc.p(size.width/2-100,0);
            }
            case 2:{
                return cc.p(0,size.height/2-100);
            }
            case 3:{
                return cc.p(-size.width/2+100,0);
            }
        }

    },

    getPositionOutOfScreen:function(i){
        var size = cc.winSize;
        switch (i){
            case 0:{
                return cc.p(0,-size.height/2-100);
            }
            case 1:{
                return  cc.p(size.width/2+100,0);
            }
            case 2:{
                return cc.p(0,size.height/2+100);
            }
            case 3:{
                return cc.p(-size.width/2-100,0);
            }
        }

    },

    resetList:function(){
        var size = cc.winSize;
        for (var i=0;i<this.listSprite.length;i++){
            this.listSprite[i].removeFromParent();
        }
        this.listSprite = [];
        this.listIn = [];
        this.listOut = [];
        //this.listPlayerStandPos = [];
        for(var i=0;i<4;i++){
            var node = this._centerNode.getChildByName("tien_" + (i+1));
            node.setVisible(false);
            node.setPosition(this.getPositionOutOfScreen(i));
        }
    },

    AddList:function(list1,list2){
        for(var i =0;i<list2.length;i++){
            list1.push(list2[i]);
        }
        return list1;
    },

    actionStandPosListIn:function(){
        //for (var i=0;i<this.listIn.length;i++){
        //    //cc.log("actionStandPosListIn " + this.listIn[i]);
        //    if(this.listIn[i]>-1){
        //        var node = this._centerNode.getChildByName("tien_" + (this.listIn[i]+1));
        //        node.setVisible(true);
        //    }
        //}
        //for(var i=0;i<4;i++){
        //    var node = this._centerNode.getChildByName("tien_" + (i+1));
        //    var desNode = this._centerNode.getChildByName("node_" + (i+1));
        //    node.runAction(cc.moveTo(ConstantTestGold.TIME_MOVE_ACTION,desNode.getPosition()));
        //}
    },

    actionStandPosListOut:function(){

        //for (var i=0;i<this.listOut.length;i++){
        //    var node = this._centerNode.getChildByName("tien_" + (this.listOut[i]+1));
        //    node.setVisible(true);
        //}
        //for(var i=0;i<4;i++){
        //    var node = this._centerNode.getChildByName("tien_" + (i+1));
        //    var desNode = this._centerNode.getChildByName("node_" + (i+1));
        //    node.runAction(cc.moveTo(ConstantTestGold.TIME_MOVE_ACTION,desNode.getPosition()));
        //}

    },

    runActionAllNode:function(){
        for(var i=0;i<4;i++) {
            var node = this._centerNode.getChildByName("tien_" + (i + 1));
            node.runAction(cc.moveTo(ConstantTestGold.TIME_MOVE_ACTION,this.getPositionOutOfScreen(i)));
        }
    },

    hideAllNode:function(){
        for(var i=0;i<4;i++) {
            var node = this._centerNode.getChildByName("tien_" + (i + 1));
            node.setVisible(false);
        }
    },

    actionStandPosPlayer:function(callback){
        this.callback = callback;
        this.actionStandPosListIn();
        GameUtil.callFunctionWithDelay(0.4,function(){
            gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).updateInfoOfAllPlayers(ChangeGoldMgr.getInstance().changeGoldList,true);
            this.ActionMove(this.listIn);
        }.bind(this));

    },

    calculateListInAndOut:function(changeGoldList){
        this.listIn = [];
        this.listOut = [];
        for(var i =0;i<changeGoldList.length;i++){
            var multi = this.calculateMultiPoint(Math.abs(changeGoldList[i].amountChange));
            var list2 = this.calculateListPoint(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(changeGoldList[i].playerIndex).standPos,multi);

            if(changeGoldList[i].amountChange>0){
                this.AddList(this.listOut,list2)
            }else{
                this.AddList(this.listIn,list2)
            }
        }

        if(this.listIn.length == 0 && this.listOut.length>0){// tat ca chi nhan tien tu he thong
            for(var i =0;i<this.listOut.length;i++){
                this.listIn.push(-1);
            }
            //cc.log("CUONG  " + this.listIn.length);
            return;
        }

        if(this.listOut.length==0 && this.listIn.length>0){ // tien duoc dua vao he thong
            for(var i =0;i<this.listIn.length;i++){
                this.listOut.push(-1);
            }
            return;
        }

        if(this.listIn.length>30){
            var list = [];
            for (var i=0;i<30;i++){
                list.push(this.listIn[i]);
            }
            this.listIn = list;
        }

        if(this.listIn.length>this.listOut.length){
            var distance = this.listIn.length - this.listOut.length;
            for(var i=0;i<distance;i++){
                this.listOut.push(this.listOut[this.listOut.length-1]);
            }
        }
        if(this.listOut.length > this.listIn.length){
            var list = [];
            for (var i=0;i<this.listIn.length;i++){
                list.push(this.listOut[i]);
            }
            this.listOut = list;
        }

        cc.log("calculateListInAndOut = "+ this.listIn.length + "     " + this.listOut.length);
    },

    ActionMove:function(listPointMove){
        var _this = this;
        var listAction = [];
        if(listPointMove.length>0){
            var point = listPointMove[0];
            listPointMove.splice(0,1);
            listAction.push(cc.callFunc(function(){
                _this.moveGoldToPoint(point,_this.listSprite.length);
                _this.scaleGold(_this._centerNode.getChildByName("tien_" + (point+1)));
            }));
            listAction.push(cc.delayTime(ConstantTestGold.TIME_PER_ACTION));
            listAction.push(cc.callFunc(function(){
                _this.ActionMove(listPointMove);
            }))
        }else{
            listAction.push(cc.delayTime(ConstantTestGold.TIME_DELAY));
            listAction.push(cc.callFunc(function(){
                _this.actionStandPosOut();
            }));
        }
        this.runAction(cc.sequence(listAction));
    },

    calculateListPoint:function(standPos,multiPoint){
        var list = [];
        for(var i=0;i<multiPoint;i++){
            list.push(standPos);
        }
        return list;
    },

    calculateMultiPoint:function(gold){
        if(gold%this.goldPerCoint == 0){
            return gold/this.goldPerCoint;
        }
        return Math.floor(gold/this.goldPerCoint) + 1;
    },


    getPositionWithStandPos:function(i){
        var size =cc.winSize;
        switch (i){
            case 0:{
                return cc.p(0,-size.height/2);
            }
            case 1:{
                return  cc.p(size.width/2,0);
            }
            case 2:{
                return cc.p(0,size.height/2);
            }
            case 3:{
                return cc.p(-size.width/2,0);
            }
        }

    },
    EndAction:function(){
        //var size =cc.winSize;
        var _this =this;
        this.runAction(cc.sequence(
            cc.callFunc(function(){
                for(var i=0;i<4;i++){
                    var node = _this._centerNode.getChildByName("tien_" + (i+1));
                    var position = _this.getPositionOutOfScreen(i);
                    node.runAction(cc.moveTo(0.3,position));
                }
            })
        ));
    },

    actionStandPosOut:function(){
        this.runActionAllNode();
        GameUtil.callFunctionWithDelay(ConstantTestGold.TIME_DELAY,function(){
            this.hideAllNode();
            this.actionStandPosListOut();
        }.bind(this));

        GameUtil.callFunctionWithDelay(0.7,function(){
            gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).updateInfoOfAllPlayers(ChangeGoldMgr.getInstance().changeGoldList,false);
            this.ActionFinish(this.listSprite,this.listOut);
        }.bind(this));
    },

    ActionFinish:function(listSprite,listPointOut){
        //cc.log("ActionFinish " + listSprite.length);
        var listAction = [];
        var _this = this;
        if(listSprite.length<=0|| listPointOut.length<=0){
            GameUtil.callFunctionWithDelay(ConstantTestGold.TIME_DELAY,function(){this.EndAction()}.bind(this));
            return;

        }
        var sprite = listSprite[listSprite.length-1];
        listSprite.splice(listSprite.length-1,listSprite.length);

        var pointOut = listPointOut[0];
        listPointOut.splice(0,1);
        listAction.push(cc.callFunc(function(){
            _this.movePointToStandPos(sprite,pointOut);
        }));
        listAction.push(cc.delayTime(ConstantTestGold.TIME_PER_ACTION));
        listAction.push(cc.callFunc(function(){
            _this.ActionFinish(listSprite,listPointOut);
        }));
        this.runAction(cc.sequence(listAction));
    },

    createGoldIcon:function(){
        //cc.log("createGoldIcon" + this.listSprite.length);
        var sprite = new cc.Sprite("res/game/moneyctp/1-2.png");
        sprite.setScale(0.8,0.8);
        this._centerNode.addChild(sprite,-1);
        this.listSprite.push(sprite);
        sprite.setOpacity(0);
        return sprite;
    },

    moveGoldToPoint:function(standPosOut,indexMove){
        if(this._centerNode.getChildByName("gold_" + (indexMove+1))){
            var goldIcon = this.createGoldIcon();
            goldIcon.setPosition(this._centerNode.getChildByName("tien_" + (standPosOut+1)).getPosition());
            var midDesitnation = this._centerNode.getChildByName("gold_" + (indexMove+1)).getPosition();
            goldIcon.runAction(cc.moveTo(0.3,midDesitnation));
            goldIcon.runAction(cc.fadeIn(0.1));
        }
    },

    movePointToStandPos:function(sprite,standPos){
        var _this = this;
        if(!this._centerNode.getChildByName("tien_" + (standPos+1))){
            return;
        }
        var desPosition = this._centerNode.getChildByName("tien_" + (standPos+1)).getPosition();
        var currentPoint = sprite.getPosition();
        var vector = cc.p(desPosition.x - currentPoint.x,desPosition.y - currentPoint.y);
        var point1 = cc.p(currentPoint.x + vector.x/5, currentPoint.y + vector.y/5);
        var point2 = cc.p(currentPoint.x + vector.x/2, currentPoint.y + vector.y/2);
        //var point1 = cc.p(currentPoint.x + vector.x/5, currentPoint.y + vector.y/5);

        sprite.runAction(cc.sequence(
            cc.moveTo(0.1,point1),
            cc.moveTo(0.1,point2),
            cc.moveTo(0.1,desPosition),
            cc.callFunc(function(){
                sprite.removeFromParent();
                _this.scaleGold(_this._centerNode.getChildByName("tien_" + (standPos+1)));
            })
        ));
        sprite.runAction(cc.sequence(
            cc.delayTime(0.15),
            cc.fadeOut(0.15)
        ));
    },

    scaleGold:function(sprite){
        sprite.runAction(cc.sequence(
            cc.scaleTo(0.05,1.1,1.1),
            cc.scaleTo(0.05,1,1)
        ))
    }
});