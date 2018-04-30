/**
 * Created by user on 10/9/2015.
 */
ACTION_FADE_TAG = 0;
var TileDisplay = cc.Class.extend({

    ctor: function(tileLogic){
        this.tileLogic = tileLogic;
        this.image = null;
        this.imageIce = null;
        this.numberImg = null;
        this.tileupAnim = null;
        this.lightFlag = null;
        this.zOrderBackup = 0;

        //1 so element ko the gan truc tiep vao tile display dc vi van de z-order se dc add vao list outside element
        this.listOutsideElement = [];
    },

    setImage: function(image) {
        this.image = image;
        this.imgBlend = new cc.Sprite();
        this.image.addChild(this.imgBlend);
        this.imgBlend.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        this.imgBlend.setFlippedX(this.image.flippedX);
        this.imgBlend.setFlippedY(this.image.flippedY);
        this.image.setTag(this.tileLogic.index);
    },

    loadResource: function(tileType, direction, index, color){
        var resource = "";

        switch(tileType){
            case TileType.TILE_IN_HOME:
                break;
            case TileType.TILE_HOME_GATE:
                //resource = this.getHomeGateResource(direction, color);
                break;
            case TileType.TILE_NORMAL:
                resource = this.getNormalResource(direction, index, color);
                break;
            case TileType.TILE_CONTROL:
                resource = this.getTileControlResource();
                break;
            case TileType.TILE_DESTINATION_GATE:
                resource = this.getDestinationGateResource(direction, color);
                break;
            case TileType.TILE_DESTINATION:
                resource = this.getDestinationResource(direction, color);
                break;
            case TileType.TILE_MINI_GAME_1:
                resource = this.getMiniGame1Resource();
                break;
            case TileType.TILE_MINI_GAME:
                resource = this.getMiniGame2Resource();
                break;
            case TileType.TILE_TELEPORT:
                resource = this.getSwapResource();
                break;
            case TileType.TILE_JAIL:
                resource = this.getJailResource();
                break;
            case TileType.TILE_BOM:
                resource = this.getBomResource();
                break;
        }
        this.changeImage(resource);
    },

    addOutsideElement: function(element){
        this.listOutsideElement.push(element);
    },

    enterTile: function(isOccupy, needEffect){
        if (needEffect){
            if (isOccupy){//o cuoi cung
                this.image.runAction(cc.sequence(
                    cc.moveBy(0.2, 0, -10),
                    cc.moveBy(2.0, 0, 10).easing(cc.easeElasticOut(0.15))
                ));
                for (var i = 0; i<this.listOutsideElement.length; i++){
                    var element = this.listOutsideElement[i];
                    if (element)
                        element.runAction(cc.sequence(
                            cc.moveBy(0.2, 0, -10),
                            cc.moveBy(2.0, 0, 10).easing(cc.easeElasticOut(0.15))
                        ));
                }
            }
            else{
                this.image.runAction(cc.sequence(
                    cc.moveBy(0.2, 0, -10),
                    cc.moveBy(0.2, 0, 10).easing(cc.easeBackOut())
                ));
                for (var i = 0; i<this.listOutsideElement.length; i++){
                    var element = this.listOutsideElement[i];
                    if (element)
                        element.runAction(cc.sequence(
                            cc.moveBy(0.2, 0, -10),
                            cc.moveBy(0.2, 0, 10).easing(cc.easeBackOut())
                        ));
                }
            }

            this.imgBlend.runAction(cc.sequence(
                cc.fadeIn(0.2),
                cc.fadeOut(0.2)
            ));
        }
        else{
            //do nothing
        }
    },

    releaseTile: function(needEffect){
        needEffect = typeof needEffect!=='undefined'?needEffect:false;
        if (needEffect){
            this.image.runAction(cc.sequence(
                cc.moveBy(0.2, 0, -20),
                cc.moveBy(2.0, 0, 20).easing(cc.easeElasticOut(0.15))
            ));
        }
        else{
            //do nothing
        }
    },

    changeImage: function(resource){
        if (resource != ""){
            this.image.setVisible(true);
            this.image.setTexture(resource);
            this.imgBlend.setTexture(resource);
            this.imgBlend.setPosition(this.imgBlend._getWidth() / 2, this.imgBlend._getHeight() / 2);
            this.imgBlend.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
            this.imgBlend.setOpacity(0);
        }
        //else
        //    this.image.setVisible(false);
    },

    getMiniGame1Resource: function(){
        return "res/game/mainBoard/tile_mini_game_1.png";
    },

    getMiniGame2Resource: function(){
        return "res/game/mainBoard/tile_mini_game_1.png";
    },

    getSwapResource: function(){
        return "res/game/mainBoard/tile_swap.png";
    },

    getJailResource: function(){
        return "res/game/mainBoard/tile_jail.png";
    },

    getBomResource: function(){
        var color = PlayerColor.NONE;
        var player = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(this.tileLogic.bomOwnerIndex);
        if (player!=null){
            color = player.playerColor;
        }
        return "res/game/mainBoard/tile_bom_" + GameUtil.getColorStringById(color) + ".png";
    },

    getNormalResource: function(direction, index, color){
        //var corner = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).mapper.isCornerSlot(index);
        //var resource = "res/game/mainBoard/block" + (direction+1) + "/tile_"+ GameUtil.getColorStringById(color) + "_" + (corner?"corner":"a") +".png";
        //var resource = "res/game/mainBoard/block" + (direction+1) + "/tile_"+ GameUtil.getColorStringById(color) + "_" + (corner?"corner":"a") +".png";

        var type = 3;
        var number = index % 10;
        if (number==1 || number==2 || number==5)
            type = 1;
        else if (number==3 || number==6 || number==7)
            type = 2;
        return "res/game/mainBoard/tile_" + ((type==3)?"white":GameUtil.getColorStringById(color)) + (type!=3?("_"+type):"") + ".png";
        //var resource = "res/game/mainBoard/tile_" + ((type==3)?"white":GameUtil.getColorStringById(color)) + (type!=3?("_"+type):"") + ".png";
        //
        //return resource;
    },

    getTileControlResource: function(){
        return "res/game/mainBoard/tile_control.png";
    },


    getDestinationGateResource: function(direction, color){
        //var resource;
        //switch (direction){
        //    case PieceDirect.TOP_LEFT:
        //    case PieceDirect.BOTTOM_LEFT:
        //    {
        //        resource = "res/game/mainBoard/block_common/gate_"+ GameUtil.getColorStringById(color) + "_1_4.png";
        //        break;
        //    }
        //    case PieceDirect.BOTTOM_RIGHT:
        //    case PieceDirect.TOP_RIGHT:
        //    {
        //        resource = "res/game/mainBoard/block_common/gate_"+ GameUtil.getColorStringById(color) + "_2_3.png";
        //        break;
        //    }
        //}
        return "res/game/mainBoard/tile_" + GameUtil.getColorStringById(color) + "_3.png";
        //resource = "res/game/mainBoard/tile_" + GameUtil.getColorStringById(color) + "_3.png";
        //return resource;
    },

    getHomeGateResource:function(direction, color){
        return "res/game/mainBoard/block" + (direction+1) + "/homeStart_"+ GameUtil.getColorStringById(color) + ".png";
    },

    getDestinationResource: function(direction, color){
        var pieceHolding = this.tileLogic.getPieceHolding();
        //var resource;
        if ((pieceHolding!=null) && (pieceHolding.getState() == PieceState.FINISHED)){
            if (this.numberImg)
                this.numberImg.setVisible(false);

            //switch (direction) {
            //    case PieceDirect.TOP_RIGHT:
            //    case PieceDirect.TOP_LEFT:
            //        resource = "res/game/mainBoard/block_common/finish_" + GameUtil.getColorStringById(color) + "_1_4.png";
            //        break;
            //    case PieceDirect.BOTTOM_LEFT:
            //    case PieceDirect.BOTTOM_RIGHT:
            //        resource = "res/game/mainBoard/block_common/finish_" + GameUtil.getColorStringById(color) + "_2_3.png";
            //        break;
            //}
        }
        else{
            if (this.numberImg)
                this.numberImg.setVisible(true);
            //resource = "res/game/mainBoard/block_common/des_" + GameUtil.getColorStringById(color) + ".png";
        }
        return "";
    },

    addSpecialEffect: function(tileType){
        switch (tileType){
            case TileType.TILE_MINI_GAME:
            {
                var miniGameEle = fr.createSprite("game/mainBoard/tile_mini_game_1_element.png");
                miniGameEle.setPosition(53.50,80.88);
                this.image.addChild(miniGameEle);

                var bottomEff = fr.AnimationMgr.createAnimationById(resAniId.minigame2_tile_effect, this);
                bottomEff.getAnimation().gotoAndPlay("run",-1,-1,0);
                bottomEff.setPosition(this.image.getContentSize().width/2, this.image.getContentSize().height/2);
                this.image.addChild(bottomEff);

                //var topEff = fr.AnimationMgr.createAnimationById(resAniId.eff_mini_game_top, this);
                //topEff.getAnimation().gotoAndPlay("run",-1,-1,1);
                //topEff.setPosition(this.image.getContentSize().width/2, this.image.getContentSize().height/2+10);
                //this.image.addChild(topEff);
                //topEff.setCompleteListener(function(){
                //    topEff.runAction(cc.sequence(cc.delayTime(MathUtil.randomBetween(2, 5)), cc.callFunc(function(){
                //        topEff.getAnimation().gotoAndPlay("run",-1,-1,1);
                //    })));
                //});
                break;
            }
            case TileType.TILE_TELEPORT:
            {
                var eff = fr.AnimationMgr.createAnimationById(resAniId.teleport, this);
                eff.getAnimation().gotoAndPlay("idle",-1,-1,0);
                eff.setPosition(this.image.getContentSize().width/2-4, this.image.getContentSize().height/2+18);
                this.image.addChild(eff);
                eff.setVisible(false);

                break;
            }
            case TileType.TILE_MINI_GAME_1:
            {
                var miniGameEle = fr.createSprite("game/mainBoard/tile_mini_game_1_element.png");
                miniGameEle.setPosition(53.50,80.88);
                this.image.addChild(miniGameEle);

                var bottomEff = fr.AnimationMgr.createAnimationById(resAniId.minigame2_tile_effect, this);
                bottomEff.getAnimation().gotoAndPlay("run",-1,-1,0);
                bottomEff.setPosition(this.image.getContentSize().width/2, this.image.getContentSize().height/2);
                this.image.addChild(bottomEff);
                break;
            }
            case TileType.TILE_HOME_GATE:
            {
                //for (var i=0; i<1; i++){
                //    var helve = this.image.getChildByName("home_flag_helve_"+i);
                //
                //    var effect  = fr.AnimationMgr.createAnimationById(resAniId.home_flag, this);
                //    effect.getAnimation().gotoAndPlay(GameUtil.getColorStringById(this.tileLogic.tileColor), 0, -1, 0);
                //    effect.setPosition(3,42);
                //    helve.addChild(effect);
                //}
                break;
            }

            case TileType.TILE_BOM:
            {
                this.remainTurnLabel = this.image.getChildByName("number");
                this.remainTurnLabel.setTag(1);
                this.remainTurnLabel.setVisible(false);
                break;
            }

            case TileType.TILE_JAIL:
            {
                //var jailIcon = fr.createSprite("res/game/mainBoard/tile_jail_icon.png");
                //jailIcon.setPosition(50, 61);
                //this.image.addChild(jailIcon);
                break;
            }
            case TileType.TILE_CONTROL:{
            }
        }
    },

    attachNumber : function(number){
        var typeStr = "a";
        if (this.tileLogic.direction == PieceDirect.TOP_RIGHT || this.tileLogic.direction == PieceDirect.BOTTOM_LEFT)
            typeStr = "b";

        this.numberImg = fr.createSprite("game/mainBoard/destination_element/des_number_" + GameUtil.getColorStringById(this.tileLogic.tileColor) +"_" + number + typeStr + ".png");
        this.numberImg.setPosition(this.image.getContentSize().width/2+0.5, this.image.getContentSize().height/2-0.5);
        this.numberImg.setOpacity(0);
        this.image.addChild(this.numberImg);
    },

    showDestinationNumber: function(delayTime){
        if (this.numberImg){
            if (this.numberImg.getOpacity() == 255) return;
            this.numberImg.runAction(cc.sequence(
                cc.delayTime(delayTime),
                cc.fadeIn(0.2)
            ));
        }
    },

    hideDestinationNumber: function(){
        if (this.numberImg){
            if (this.numberImg.getOpacity() == 0) return;
            this.numberImg.runAction(cc.fadeOut(0.2));
        }
    },

    setEnableGlowEffect: function(enable){

        if (!this.image) return;

        if (!this.glowEffect){
            this.glowEffect = cc.Sprite.create();
            this.glowEffect.setBlendFunc(gl.ONE, gl.ONE);
            this.glowEffect.setColor(cc.color(255,0,0,255));
            this.glowEffect.setPosition(this.image.getContentSize().width/2, this.image.getContentSize().height/2);
            this.image.addChild(this.glowEffect, -1);

            var seq = cc.sequence(
                cc.scaleTo(1.0, 1.1, 1.1),
                cc.scaleTo(1.0, 1.05, 1.05)
            );
            this.glowEffect.runAction(cc.repeatForever(seq));
        }
        this.glowEffect.setVisible(enable);
    },

    resetFreezeTile:function(){
        this.tileLogic.isFreeze = false;
        this.imageIce.removeFromParent();
        this.image.setVisible(true);
        //this.showAllChild();
        //this.image.setVisible(true);
    },

    getPositionFreePiece:function(type){
        switch (type){
            case TileType.TILE_MINI_GAME_1:
            case TileType.TILE_MINI_GAME:
            case TileType.TILE_TELEPORT:
                return cc.p(this.image.getContentSize().width/2-5,this.image.getContentSize().height/2+14);
            default :
                return cc.p(this.image.getContentSize().width/2-2,this.image.getContentSize().height/2+17);
        }
    },

    //hideAllChild:function(){
    //    var list = this.image.getChildren();
    //    for(var i=0;i<list.length;i++){
    //        list[i].setVisible(false);
    //    }
    //},
    //
    //showAllChild:function(){
    //    var list = this.image.getChildren();
    //    for(var i=0;i<list.length;i++){
    //        list[i].setVisible(true);
    //    }
    //},

    setFreezeTile:function(){
        this.tileLogic.isFreeze = true;
        //switch (this.tileLogic.type){
        //    case TileType.TILE_MINI_GAME_1:{
        //        this.hideAllChild();
        //        break;
        //    }
        //    case TileType.TILE_MINI_GAME:{
        //        this.hideAllChild();
        //        break;
        //    }
        //}
        this.imageIce = fr.AnimationMgr.createAnimationById(resAniId.tile_ice_trap, this);
        this.imageIce.getAnimation().gotoAndPlay("run", 0, -1, 1);
        //this.imageIce.setPosition(this.getPositionFreePiece(this.tileLogic.type));
        //this.addChild(this.imageIce);
        //var fixPosition = this.getPositionFreePiece(this.tileLogic.type);
        this.imageIce.setPosition(this.image.getPosition().x,this.image.getPosition().y +20);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(this.imageIce,this.image.getLocalZOrder());
        this.image.setVisible(false);
    },

    addSapHamEffect: function(){
        var sapHamEff = fr.AnimationMgr.createAnimationById(resAniId.sapham_fx, this);
        sapHamEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        sapHamEff.setPosition(this.image.getPosition());
        sapHamEff.setCompleteListener(function(){
            sapHamEff.removeFromParent();
        }.bind(this));
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(sapHamEff, 999999);
    },

    addLenDinhEffect: function(){
        var lenDinhEff = fr.AnimationMgr.createAnimationById(resAniId.len_dinh_tile, this);
        lenDinhEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
        lenDinhEff.setPosition(this.image.getContentSize().width/2, this.image.getContentSize().height/2);
        lenDinhEff.setCompleteListener(function(){
            lenDinhEff.removeFromParent();
        }.bind(this));
        this.image.addChild(lenDinhEff);
    },

    sendPacket:function(){
        var globalPos = gv.matchMng.mapper.convertLocalToGlobalSlotIndex(this.tileLogic.index);
        gv.gameClient.sendPacketControlSell(globalPos);
        gv.gameClient._clientListener.dispatchPacketInQueue();
    },

    actionShakeTile:function(){
        var currentPosition = this.image.getPosition();
        //var maxiumShake = 10;
        //var deltaShake = 2;
        var timeMove =0.5/28;   // tong thoi gian va cham la 0.3s
        var seq = cc.sequence(
            cc.moveTo(timeMove,currentPosition.x + 14, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x - 14, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x + 12, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x - 12, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x + 10, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x - 10, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x +8, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x -8, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x + 6, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x-6, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x + 4, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x -4, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x +  2, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x -2, currentPosition.y),
            cc.moveTo(timeMove,currentPosition.x , currentPosition.y)
        );
        //var seq1 = seq.copy();
        seq.setTag(ACTION_FADE_TAG);

        var seqTileAnim = cc.sequence(
            cc.rotateTo(timeMove,7),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-7),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,6),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-6),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,5),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-5),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,4),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-4),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,3),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-3),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,2),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-2),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,1),
            cc.rotateTo(timeMove,0),
            cc.rotateTo(timeMove,-1),
            cc.rotateTo(timeMove,0)
        );
        this.image.runAction(seq);
        this.tileupAnim.runAction(seqTileAnim);
    },
    actionJumpTileUp:function(){
        this.actionShakeTile();
        //var tmeFade = 0.1;
        //var seq = cc.sequence(cc.fadeOut(tmeFade),cc.fadeIn(tmeFade)).repeatForever();
        //var seq1 = seq.copy();
        //seq.setTag(ACTION_FADE_TAG);
        //this.image.runAction(seq);
        //this.tileupAnim.runAction(seq1);
    //this.display.runAction(cc.sequence)
    },

    disableActionJumpTileUp:function(){
        var seq = this.image.getActionByTag(ACTION_FADE_TAG);
        if(seq != null){
            seq.stop();
        }
    },

    setTileUp:function(){
        this.zOrderBackup = this.image.getLocalZOrder();
        this.tileLogic.tileUp = true;
        this.image.setLocalZOrder(this.tileLogic.getZOrderForPiece()-1);
        //runAction o day
        gv.matchMng.tileUpMgr.disableHintStone();
        //gui len server o day
        this.tileupAnim = fr.AnimationMgr.createAnimationById(resAniId.tile_up, this);
        this.tileupAnim.getAnimation().gotoAndPlay("run", 0,-1, 1);
        var tilePositon = cc.p(this.image.getPosition().x ,this.image.getPosition().y);
        this.tileupAnim.setPosition(tilePositon.x+5,tilePositon.y - 20);
        gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(this.tileupAnim,this.zOrderBackup -1);
        //this.image.addChild(this.tileupAnim,-1);

        this.image.runAction(cc.moveBy(0.3,cc.p(0,50)).easing(cc.easeBackOut()));
        for(var i =0;i< this.listOutsideElement.length;i++){
            this.listOutsideElement[i].runAction(cc.moveBy(0.3,cc.p(0,50)).easing(cc.easeBackOut()));
        }
        if(gv.matchMng.tileUpMgr.callback){
            gv.matchMng.tileUpMgr.callback();
        }
    },

    resetTileUp:function(){
        if(this.tileupAnim){
            //this.disableActionJumpTileUp();
            this.tileLogic.tileUp= false;
            this.image.setLocalZOrder(this.zOrderBackup);
            this.tileupAnim.removeFromParent();
            this.image.runAction(cc.moveBy(0.1,cc.p(0,-50)).easing(cc.easeBackOut()));
            for(var i =0;i< this.listOutsideElement.length;i++){
                this.listOutsideElement[i].runAction(cc.moveBy(0.1,cc.p(0,-50)).easing(cc.easeBackOut()));
            }
        }
    },

    setVisibleWall: function(isVisible){

    },

    addBoomChangeEffect: function(callback){
        var bomChange  = fr.AnimationMgr.createAnimationById(resAniId.bom_change, this);
        bomChange.getAnimation().gotoAndPlay("run", 0, -1, 1);
        bomChange.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.callFunc(callback)));
        bomChange.setCompleteListener(function(){
            bomChange.removeFromParent();
        });
        bomChange.setPosition(this.image.getContentSize().width/2, this.image.getContentSize().height/2);
        this.image.addChild(bomChange);
    },

    setBomRemain: function(remainTime){
        if (remainTime>0){
            var resource = "res/game/mainBoard/tile_bom_number_type_" + ((this.tileLogic.index==8 || this.tileLogic.index==18)?1:2) + "_" + remainTime + ".png";
            fr.changeSprite(this.remainTurnLabel, resource);
            this.remainTurnLabel.setVisible(true);
        }
        else{
            this.remainTurnLabel.setVisible(false);
        }
    },

    addIconTileTax:function(color){
        var tileIcon = fr.createSprite("res/game/mainBoard/tax/tax_"+GameUtil.getColorStringById(color)+".png");
        //cc.log("res/game/mainBoard/tax/tax_"+GameUtil.getColorStringById(color)+".png")
        tileIcon.setPosition(50,63);
        this.image.addChild(tileIcon);
    },

    addHomeGateLight: function(color){
        var light  = fr.AnimationMgr.createAnimationById(resAniId.tile_light, this);
        //light.getAnimation().gotoAndPlay(GameUtil.getColorStringById(color), 0, 1, 1);
        light.getAnimation().gotoAndPlay("run", 0, 1, 1);
        light.setPosition(52,71);
        light.setCompleteListener(function(){
            light.removeFromParent();
        });
        this.image.addChild(light);
    },

    changeTileLightColor: function(color){
        fr.changeSprite(this.lightFlag, "res/game/mainBoard/flag_tile_light_" + GameUtil.getColorStringById(color)+ ".png");
    },

});