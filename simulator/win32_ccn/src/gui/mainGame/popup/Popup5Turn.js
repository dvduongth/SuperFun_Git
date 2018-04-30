var Popup5Turn = BasePopup.extend({

    ctor:function(callback){
        this._super();
        var notification = this.loadData();
        notification.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(notification);
        var _this = this;
        notification.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function(){
                _this.destroy();
                callback();
            })
        ));
    },

    loadData:function(){
        var notificationLabel = new ccui.Text(" Còn 5 Lượt di chuyển nữa ", res.FONT_GAME_BOLD, 50);
        notificationLabel.setColor(cc.color(233,75,22));
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //notificationLabel.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        notificationLabel.enableOutline(cc.color(0,255,64),4);
        return notificationLabel;
    }
});

var Popup15Turn = BasePopup.extend({

    ctor:function(callback){
        this._super();
        var notification = this.loadData();
        notification.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(notification);
        var _this = this;
        notification.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function(){
                _this.destroy();
                callback();
            })
        ));
    },

    loadData:function(){
        var notificationLabel = new ccui.Text(" Hết 15 lượt di chuyển ", res.FONT_GAME_BOLD, 50);
        notificationLabel.setColor(cc.color(233,75,22));
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //notificationLabel.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        notificationLabel.enableOutline(cc.color(0,255,64),4);
        return notificationLabel;
    }
});

var PopupTimeOut = BasePopup.extend({

    ctor:function(callback){
        this._super();
        var notification = this.loadData();
        notification.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(notification);
        var _this = this;
        notification.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function(){
                _this.destroy();
                callback();
            })
        ));
    },

    loadData:function(){
        var notificationLabel = new ccui.Text(" Hết thời gian ", res.FONT_GAME_BOLD, 50);
        notificationLabel.setColor(cc.color(233,75,22));
        notificationLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        //notificationLabel.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        notificationLabel.enableOutline(cc.color(0,255,64),4);
        return notificationLabel;
    }
});

var PopupChiemBoom = BasePopup.extend({

    ctor:function(piece,callback){
        this._super(res.ZCSD_GUI_POPUP_BOOM);
        this.setFog(false);

        this.bg = this._rootNode.getChildByName("bg");
        this.loadData(piece);
        GameUtil.callFunctionWithDelay(1.5,function(){
            if(callback!=null){
                callback();
            }
            this.destroy();
        }.bind(this));
    },

    loadData:function(piece){// load data popup for player
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(piece.playerIndex);
        var color = playerInfo.playerColor;
        var chuycohoi = this.bg.getChildByName("chu_y_co_hoi");
        if(piece.playerIndex != MY_INDEX){// khong phai minh nhay vao boom
            if(gv.matchMng.bomMgr.getPlayerIndexOfBom() != MY_INDEX){  // minh khong so huu boom
                cc.log("minh khong so huu boom");

                fr.changeSprite(chuycohoi,"res/game/popup_in_game/chu_y.png");
            }
        }else{// Minh nhay vao boom
            if(gv.matchMng.bomMgr.getPlayerIndexOfBom() >0 ){  // boom da duoc so huu va khong phai minh so huu
                fr.changeSprite(chuycohoi,"res/game/popup_in_game/chu_y.png");
            }
        }
        var iconHorse = this.bg.getChildByName("icon_horse");
        fr.changeSprite(iconHorse,"res/game/Horse/" +GameUtil.getColorStringById(color) + "_horse2.png");
    }
});
