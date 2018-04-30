/**
 * Created by user on 10/9/2015.
 */

var TileType = {
    TILE_IN_HOME: 0,
    TILE_HOME_GATE: 1,
    TILE_NORMAL : 2,
    TILE_DESTINATION_GATE: 3,
    TILE_DESTINATION : 4,
    TILE_MINI_GAME_1: 5,
    TILE_MINI_GAME: 6,
    TILE_TELEPORT: 7,
    TILE_JAIL: 8,
    TILE_BOM: 9,
    TILE_CONTROL:10,
};

var TileStatus = cc.Class.extend({
    ctor: function(){
        this.hasIceTrap = false;
        this.isRaised = false;
        this.params = {};
    }
});

var TileState = {
    TILE_PRESS: 0,
    TILE_RELEASE: 1,
};

var TileACtionTag = {
    BLINK_ACTION : 1
};

var Tile = cc.Class.extend({
    x : 0,
    y : 0,
    direction : PieceDirect.BOTTOM_LEFT,
    tileColor : PlayerColor.NONE,
    tileZOrder: -1,
    alreadyHightlight : true,

    ctor:function(index, x, y, direction, type, image){
        this.index = index;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.display = new TileDisplay(this);
        this.display.setImage(image);
        this.type = type;
        this.pressedCallback = null;
        this.blink = false;
        this.moneyIcon = null;
        this.tileNumber = -1;
        //cuong freeze de luu lai o bi freeze
        this.isFreeze = false;

        //new design
        this.hasIceTrap = false;
        this.isRaised = false;
        this.tileUp = false;
        this.lightOwnerIndex = -1;
        this.multiplyRate = 0;
        this.bomRemainTurn = 0;
        this.bomOwnerIndex = -1;

        if(index >=100){
            if(index % 100 == 0){
                this.moneyIcon = image.getChildByName("icon");
                this.moneyIcon.setLocalZOrder(999);
            }
            else if(index % 100 == NUMBER_DES_SLOT-1){
                this.moneyIcon = image.getChildByName("icon");
                this.moneyIcon.setLocalZOrder(999);
            }
        }
    },

    getTileZOrder: function(){
        return this.tileZOrder;
    },

    setTileZOrder: function(zOrder){
        this.tileZOrder = zOrder;
    },

    getLocalZOrder: function(){
        return this.display.image.getLocalZOrder();
    },

    setLocalZOrder: function(zOrder){
        this.display.image.setLocalZOrder(zOrder);
    },

    getZOrderForPiece: function(){
        return this.tileZOrder + MainBoardZOrder.PIECE_NORMAL;
    },

    getPosition: function(){
        return this.display.image.getPosition();
    },

    setRefererTile : function(refererTile){
        this.referer = refererTile;
    },

    setPressAble : function(callback){
        this.pressedCallback = callback;
    },

    onTilePressed : function(){
        if(this.pressedCallback!= undefined && this.pressedCallback !=null){
            this.pressedCallback();
        }
    },

    getStandingPositionOnTile: function(){
        var result;
        if (this.type == TileType.TILE_JAIL){
            result = cc.p(this.getPosition().x, this.getPosition().y+10);
        }else
        if (this.type == TileType.TILE_MINI_GAME){
            result = cc.p(this.getPosition().x, this.getPosition().y+22);
        }else
        if (this.type == TileType.TILE_TELEPORT){
            result = cc.p(this.getPosition().x, this.getPosition().y+22);
        }else
        if (this.type == TileType.TILE_DESTINATION){
            switch (this.direction){
                case PieceDirect.TOP_LEFT:
                    result = cc.p(this.getPosition().x-5, this.getPosition().y +2);//index 0
                    break;
                case PieceDirect.BOTTOM_LEFT:
                    result = cc.p(this.getPosition().x-3, this.getPosition().y + 3);//index 1
                    break;
                case PieceDirect.BOTTOM_RIGHT:
                    result = cc.p(this.getPosition().x+3, this.getPosition().y +3);//index 2
                    break;
                case PieceDirect.TOP_RIGHT:
                    result = cc.p(this.getPosition().x+3, this.getPosition().y );//index 3
                    break;
            }
        }
        else if (this.type == TileType.TILE_DESTINATION_GATE){
            switch (this.direction){
                case PieceDirect.TOP_LEFT:
                    result = cc.p(this.getPosition().x-4, this.getPosition().y+20);
                    break;
                case PieceDirect.BOTTOM_LEFT:
                    result = cc.p(this.getPosition().x-3, this.getPosition().y+21);
                    break;
                case PieceDirect.BOTTOM_RIGHT:
                    result = cc.p(this.getPosition().x+4, this.getPosition().y+21);
                    break;
                case PieceDirect.TOP_RIGHT:
                    result = cc.p(this.getPosition().x+3, this.getPosition().y+20);
                    break;
            }
        }
        else if (this.type == TileType.TILE_HOME_GATE){
            switch (this.direction){
                case PieceDirect.TOP_LEFT:
                    result = cc.p(this.getPosition().x-2, this.getPosition().y+20);
                    break;
                case PieceDirect.BOTTOM_LEFT:
                    result = cc.p(this.getPosition().x-4, this.getPosition().y+20);
                    break;
                case PieceDirect.BOTTOM_RIGHT:
                    result = cc.p(this.getPosition().x, this.getPosition().y+20);
                    break;
                case PieceDirect.TOP_RIGHT:
                    result = cc.p(this.getPosition().x+5, this.getPosition().y+20);
                    break;
            }
        }
        else if (this.type == TileType.TILE_IN_HOME){
            result = cc.p(this.getPosition().x, this.getPosition().y);
        }
        else{
            switch (this.direction){
                case PieceDirect.TOP_LEFT:
                    result = cc.p(this.getPosition().x-2, this.getPosition().y+20);
                    break;
                case PieceDirect.BOTTOM_LEFT:
                    result = cc.p(this.getPosition().x-4, this.getPosition().y+20);
                    break;
                case PieceDirect.BOTTOM_RIGHT:
                    result = cc.p(this.getPosition().x+2, this.getPosition().y+20);
                    break;
                case PieceDirect.TOP_RIGHT:
                    result = cc.p(this.getPosition().x+2, this.getPosition().y+20);
                    break;
            }
        }
        return result;
    },

    getJumpPositionOnTile : function(){
        //var retPosition = this.getPosition();
        //return retPosition;
        return this.getPosition();
    },

    reloadTile: function(){
        this.display.loadResource(this.type, this.direction, this.index, this.tileColor);
    },

    setEnableGlowEffect: function(enable){
        this.display.setEnableGlowEffect(enable);
    },

    getPieceHolding : function(){
        return gv.matchMng.mainBoard.boardData.getPieceAtSlot(this.index);
    },

    attachNumber: function(number){
        this.display.attachNumber(number);
        this.tileNumber = number;
    },

    getTileNumber : function(){
        return this.tileNumber;
    },

    highLight : function(){
        if(this.alreadyHightlight)
            return;

        this.alreadyHightlight = true;
        this.display.image.runAction(cc.tintTo(0.2,255,255,255));
        //this.display.image.setColor(cc.color(255,255,255,0));
    },

    unhighLight : function(){
        if(!this.alreadyHightlight)
            return;
        this.alreadyHightlight = false;
        this.display.image.runAction(cc.tintTo(0.2,150,150,150));
        //this.display.image.setColor(cc.color(170,170,170, 100));
    },

    setBlink : function(enable){
        if(enable && !this.blink){
            var blinkAction = cc.sequence(cc.tintTo(0.2,150,150,150), cc.delayTime(0.2), cc.tintTo(0.2,255,255,255)).repeatForever();
            blinkAction.setTag(TileACtionTag.BLINK_ACTION);
            this.display.image.runAction(blinkAction);
            this.blink = true;
        }
        else if(!enable && this.blink){
            this.display.image.stopActionByTag(TileACtionTag.BLINK_ACTION);
            this.blink = false;
        }
    },

    onPieceHold : function(isOccupy, piece){
        var log ="Yeah! tile " + this.index + " is hold by piece " + piece.getString();
        cc.log(log);

        if (isOccupy) {
            if (this.type == TileType.TILE_NORMAL){
                var occupyEff = fr.AnimationMgr.createAnimationById(resAniId.eff_piece_occupy_tile, this);
                occupyEff.setPosition(cc.p(this.x, this.y));
                occupyEff.setAnchorPoint(cc.p(0.5, 0));
                occupyEff.getAnimation().gotoAndPlay("run",-1,-1,1);

                occupyEff.getCCSlot("Layer 4").getCCChildArmature().getAnimation().gotoAndPlay(GameUtil.getColorStringById(piece.pieceDisplay.playerColor),-1,-1,0);
                occupyEff.getCCSlot("Layer 9").getCCChildArmature().getAnimation().gotoAndPlay(GameUtil.getColorStringById(piece.pieceDisplay.playerColor),-1,-1,0);
                occupyEff.getCCSlot("Layer 2").getCCChildArmature().getAnimation().gotoAndPlay(GameUtil.getColorStringById(piece.pieceDisplay.playerColor),-1,-1,0);
                occupyEff.getCCSlot("Layer 3").getCCChildArmature().getAnimation().gotoAndPlay(GameUtil.getColorStringById(piece.pieceDisplay.playerColor),-1,-1,0);

                var gameGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                gameGui.addChild(occupyEff, MainBoardZOrder.EFFECT);

                occupyEff.setCompleteListener(function(){ occupyEff.removeFromParent()});
            }
        }
    },

    onPieceRelease : function(){
        cc.log("Oops! tile" + this.index + " have no piece hold");
        this.display.releaseTile(false);
    },

    onPieceEnter: function(piece, isOccupy, needEffect){
        this.display.enterTile(isOccupy, needEffect);
        if(isOccupy && needEffect){
            piece.pieceDisplay.runAction(cc.spawn(
                cc.sequence(
                    cc.moveBy(0.2, 0, -10),
                    cc.moveBy(2.0, 0, 10).easing(cc.easeElasticOut(0.15))
                )
            ));
        }

        fr.Sound.playEnterTileSound(this);
    },

    setEnableHintStone : function(enable, callback){
        if(enable){
            if(this.hintStone==null){
                this.hintStone = new HintDestination();
                this.hintStone.setLocalZOrder(this.getZOrderForPiece());
                this.hintStone.setPosition(this.getStandingPositionOnTile());
                if(callback!=null)
                    this.hintStone.addClickEventListener(callback);
                gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(this.hintStone);

                this.setPressAble(callback);
            }
        }
        else{
            if(this.hintStone !=null){
                this.hintStone.removeFromParent();
                this.hintStone = null;
                this.setPressAble(null);
            }
        }
    },

    setEnableDestinationPoint: function(enable){
        if(enable){
            if(this.destinationPoint==null){
                var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
                var globalPos =  guiMainBoard._centerNode.convertToWorldSpace(this.getStandingPositionOnTile());
                cc.log("setEnableDestinationPoint" + this.display.image.convertToNodeSpace(globalPos).x + ", " + this.display.image.convertToNodeSpace(globalPos).y);
                this.destinationPoint = fr.AnimationMgr.createAnimationById(resAniId.destination_point);//fr.createSprite("res/game/mainBoard/destination_point.png");
                //this.destinationPoint.setScale(0.9);
                this.destinationPoint.gotoAndPlay("run", 0, -1, 0);
                this.destinationPoint.setPosition(this.display.image.convertToNodeSpace(globalPos));
                this.display.image.addChild(this.destinationPoint);
                //this.destinationPoint.runAction(cc.blink(30, 100));
            }
        }
        else{
            if(this.destinationPoint !=null){
                this.destinationPoint.removeFromParent();
                this.destinationPoint = null;
            }
        }
    },

    setEnableIndicator : function(enable, number){
        if(enable){
            if(this.indicatorSprite!=null){
                cc.log("chet cmnr");
            }
            this.indicatorSprite = new cc.Sprite("res/game/mainBoard/indicator/"+number+".png");
            if(this.getPieceHolding()!=null){
                this.indicatorSprite.setPosition(cc.pAdd(this.getStandingPositionOnTile(),cc.p(0, 120)));
            }
            else{
                this.indicatorSprite.setPosition(this.getStandingPositionOnTile());
            }
            this.indicatorSprite.setLocalZOrder(this.getZOrderForPiece());
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(this.indicatorSprite);
            /*this.indicatorSprite.setVisible(false);
            var _this = this;
            GameUtil.callFunctionWithDelay(number/15, function(){
                if(_this.indicatorSprite!=null){
                    _this.indicatorSprite.setVisible(true);
                    _this.indicatorSprite.runAction(cc.sequence(cc.moveBy(0.65,0,15), cc.moveBy(0.65,0,-15)).repeatForever());
                }
            })*/
        }
        else{
            if(this.indicatorSprite!=null){
                this.indicatorSprite.removeFromParent();
                this.indicatorSprite=null;
            }
        }
    },

    setVisibleMoneyIcon : function(visible){
        if(this.moneyIcon!=undefined && this.moneyIcon!=null){
            this.moneyIcon.setVisible(visible);
        }
    },

});

