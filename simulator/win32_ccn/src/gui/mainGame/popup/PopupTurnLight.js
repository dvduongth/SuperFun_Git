var PopupTurnLight = BaseGui.extend({

    ctor: function (currentStandPos, desStandPos,standPosTile) {
        this._super();
        var _this = this;

        this.setFog(false);
        var giayto = fr.createSprite("res/game/turnlight/giayto.png");
        this.addChild(giayto);
        giayto.setPosition(this.getPositionWithStandPos(currentStandPos));
        giayto.setScale(0,0);

        var tile = this.getTileWithStandPos(standPosTile);
        tile.setPosition(giayto.getContentSize().width/2,giayto.getContentSize().height/2);
        giayto.addChild(tile);

        var sprite = this.getSpriteTileColorWithStandPos(currentStandPos);
        sprite.setPosition(235,210);
        giayto.addChild(sprite);
        sprite.runAction(cc.sequence(
            cc.delayTime(0.75),
            cc.callFunc(function(){
                var light  = fr.AnimationMgr.createAnimationById(resAniId.tile_light, this);
                //light.getAnimation().gotoAndPlay(GameUtil.getColorStringById(color), 0, 1, 1);
                light.getAnimation().gotoAndPlay("run", 0, 1, 1);
                light.setPosition(238,195);
                light.setCompleteListener(function(){
                    light.removeFromParent();
                    sprite.removeFromParent();
                    sprite = _this.getSpriteTileColorWithStandPos(desStandPos)
                    sprite.setPosition(238,210);
                    giayto.addChild(sprite);
                });
                giayto.addChild(light);

            })
        ));
        var timeAction =0.75;
        var action1 = cc.spawn(
            cc.scaleTo(timeAction,1).easing(cc.easeBackOut()),
            cc.moveTo(timeAction,0,0).easing(cc.easeBackOut())
        );

        var action2 = cc.spawn(
            cc.moveTo(timeAction,_this.getPositionWithStandPos(desStandPos)).easing(cc.easeBackOut()),
            cc.scaleTo(timeAction,0,0));
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(desStandPos);
        giayto.runAction(cc.sequence(
            action1,
            cc.callFunc(function(){
                var dau = fr.createSprite("res/game/turnlight/dongdau.png");
                dau.setPosition(giayto.getContentSize().width - dau.getContentSize().width +20,40);
                giayto.addChild(dau);
                dau.setScale(10);
                dau.runAction(cc.scaleTo(0.2,1).easing(cc.easeBackOut()))
            }),
            cc.delayTime(2.5),
            action2,
            cc.callFunc(function(){
                _this.removeFromParent();
            })
        ));
    },

    getPositionWithStandPos:function(standPos){
        var size = cc.winSize;
        switch (standPos){
            case 0: return cc.p(0,-240);
            case 1: return cc.p(400,0);
            case 2: return cc.p(0,240);
            case 3: return cc.p(-400,0);
        }
        return cc.p(-size.width,-size.height);
    },

    getTileWithStandPos:function(standPos){
        var tile = gv.matchMng.mapper.getTileForSlot((standPos*10 + 39) %40);
        var sprite = new cc.Sprite(tile.display.image.getTexture());
        //sprite.initWithSpriteFrame(Re());
        return sprite;
        //cc.clone()
        //var action = new cc.Action();
        //var sprite = action.copy(tile.display.image);
        //return sprite;
        //if(standPos<0){
        //
        //    return fr.createSprite("res/game/turnlight/d6.png");
        //}else{
        //    var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(standPos);
        //    var color = playerInfo.playerColor;
        //    return fr.createSprite("res/game/mainBoard/tile_" + GameUtil.getColorStringById(color) + "_3.png")
        //}
    },

    getSpriteTileColorWithStandPos:function(desStandPos){
        if(desStandPos<0){
            var sprite =  fr.createSprite("res/game/turnlight/d6.png")
            //sprite.setRotation(-90);
            return sprite;
        }else{
            var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(desStandPos);
            var color = playerInfo.playerColor;
            return fr.createSprite("res/game/mainBoard/flag_tile_light_" + GameUtil.getColorStringById(color) + ".png")
        }
    }
});