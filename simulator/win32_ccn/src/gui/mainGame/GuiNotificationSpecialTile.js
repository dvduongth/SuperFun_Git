var constant_Gui_NotificationSpecialTile = {
    TEXT_ZOO: "Ô SỞ THÚ",
    TEXT_TILE_UP: "Ô NÂNG Ô ĐẤT",
    TEXT_TURN_LIGHT: "Ô BẬT ĐÈN",
    TEXT_BOOM: "Ô BOOM",
    TEXT_TAX:"Ô THU THUẾ",
    TEXT_MINI_GAME:"Ô LỄ HỘI",
    TEXT_TELEPORT:"Ô DỊCH CHUYỂN",
    TIME_REMOVE: 1
};

var GuiNotificationSpecialTile = BaseGui.extend({

    ctor: function (callback,tile) {
        this._super();
        this.time = 0;
        this.callback = callback;
        this.text = this.getTextWithTypel(tile.type);
        var notification = this.loadData(this.text);
        this.addChild(notification);
        notification.setScale(0.4);
        var size = cc.winSize;
        var desPosition = tile.getStandingPositionOnTile();
        notification.setPosition(desPosition.x,desPosition.y);
        var timeAction = 0.5;
        var action = cc.spawn(
            cc.moveTo(timeAction,0,0).easing(cc.easeBackOut()),
            cc.scaleTo(timeAction,1,1).easing(cc.easeBackOut())
        );
        var _this = this;
        notification.runAction(cc.sequence(action,
            cc.delayTime(0.5),
            cc.spawn(cc.fadeOut(0.8),cc.scaleTo(0.8,2,2)),
            cc.callFunc(function(){
            if(callback){
                _this.removeFromParent();
                callback();
            }
        })));
    },

    loadData:function(text1){
        var notificationLabel = new ccui.Text(text1, res.FONT_GAME_BOLD, 50);
        notificationLabel.setColor(cc.color(245,10,204));
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //notificationLabel.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        notificationLabel.enableOutline(cc.color(0,255,64),4);
        return notificationLabel;
    },

    onClickXButton:function(){
        this.time = 0;
        this.unschedule(this.onUpdate());
        if(this.callback){
            this.callback();
        }
        this.destroy(DestroyEffects.ZOOM);
    },

    getTextWithTypel:function(tileType){
        switch (tileType){
            case TileType.TILE_JAIL: return constant_Gui_NotificationSpecialTile.TEXT_ZOO;
            case TileType.TILE_BOM: return constant_Gui_NotificationSpecialTile.TEXT_BOOM;
            case TileType.TILE_HOME_GATE: return constant_Gui_NotificationSpecialTile.TEXT_TAX;
            case TileType.TILE_CONTROL: return constant_Gui_NotificationSpecialTile.TEXT_TILE_UP;
            case TileType.TILE_DESTINATION_GATE: return constant_Gui_NotificationSpecialTile.TEXT_TURN_LIGHT;
            case TileType.TILE_MINI_GAME: return constant_Gui_NotificationSpecialTile.TEXT_MINI_GAME;
            case TileType.TILE_TELEPORT: return constant_Gui_NotificationSpecialTile.TEXT_TELEPORT;
        }
        return "Unknown";
    },

    onUpdate:function(){
        this.time++;
        if(this.time>2){
          this.onClickXButton();
        }
    },
});