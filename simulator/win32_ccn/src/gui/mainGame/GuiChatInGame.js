var constant_chat ={
    POSITION_X : 185,
    POSITION_Y : 20,
    SCALE:0.5,
    EACH_SPRITE_WIDTH:107,
    EACH_SPRITE_HEIGHT:110,
    FIRST_SPRITE_WIDTH:75,
    FIRST_SPRITE_HEIGHT:200,
    FIX_POSITION_CHAT:100
};

var IconChat = cc.Sprite.extend({

    ctor:function(index){
        this.index =index;
        this._super(this.Create_sprite_and_anim_icon());
    },
    //switch de lay res cho vao supper
    // lay animation cho iconchat de add vao player
    Create_sprite_and_anim_icon:function(){
        var res1 = null;
        switch (this.index){
            case 0:{
                res1 = res.ICON_1;
                break;
            }
            case 1:{
                res1 = res.ICON_2;
                break;
            }
            case 2:{
                res1 = res.ICON_3;
                break;
            }
            case 3:{
                res1 = res.ICON_4;
                break;
            }
            case 4:{
                res1 = res.ICON_5;
                break;
            }
            case 5:{
                res1 = res.ICON_6;
                break;
            }
            case 6:{
                res1 = res.ICON_7;
                break;
            }
            case 7:{
                res1 = res.ICON_8;
                break;
            }
            case 8:{
                res1 = res.ICON_9;
                break;
            }
            case 9:{
                res1 = res.ICON_10;
                break;
            }
            case 10:{
                res1 = res.ICON_11;
                break;
            }
            case 11:{
                res1 = res.ICON_12;
                break;
            }
            case 12:{
                res1 = res.ICON_13;
                break;
            }
            case 13:{
                res1 = res.ICON_14;
                break;
            }
            case 14:{
                res1 = res.ICON_15;
                break;
            }
            case 15:{
                res1 = res.ICON_16;
                break;
            }
            case 16:{
                res1 = res.ICON_17;
                break;
            }
            case 17:{
                res1 = res.ICON_18;
                break;
            }
            default :{
                break;
            }
        }
        return res1;
    }

});

var LayoutChat = BasePopup.extend({
    ctor: function (res) {
        this._super();
        //var size = cc.winSize;
        this.setFog(false);
        this.layout_chat = fr.createSprite(res);
        this.addChild(this.layout_chat);
        this.layout_chat.setPosition(0,0);
    }
});

var GuiChatInGame = BaseGui.extend({

    ctor:function () {
        this._super();
        var size = cc.winSize;
        // khoi tao cac bien
        this.click_view=null;
        this.layout_chat=null;
        this.isLayoutInScreen=false;
        this.rectangle = null;
        this.currentChosen = -1;
        this.animPlayer= [];
        // gan cac bien
        for(var i =0;i<4;i++){
            this.animPlayer[i] = null;
        }
        this.click_view =  new ccui.Button();
        this.click_view.loadTextureNormal(res.CHAT_CLICK,ccui.Widget.LOCAL_TEXTURE);
        this.click_view.addClickEventListener(this.onClickButtonView.bind(this));
        this.click_view.setPosition(this.click_view.getContentSize().width/2,50);
        this.addChild(this.click_view);
    },

    onClickButtonView:function(){
        if(!this.isLayoutInScreen){
            this.CreateLayOutChat();
            this.isLayoutInScreen = true;
        }else{
            this.isLayoutInScreen = false;
            this.RemoveLayoutChat();
        }
    },

    CreateLayOutChat: function () {
        var size = cc.winSize;
        this.currentChosen =2;
        this.layout_chat = new LayoutChat(res.CHAT_BACKGROUND);
        this.addChild(this.layout_chat);
        this.layout_chat.setPosition(size.width/2,size.height/2);
        this.rectangle = fr.createSprite("res/game/guichatingame/rounded_rec.png");
        this.layout_chat.addChild(this.rectangle);
        this.rectangle.setPosition(-265
            ,constant_chat.EACH_SPRITE_HEIGHT*2- 130);

        var list = [];
        for(var i=0;i<6;i++){
            for(var j=0;j<3;j++){
                var sprite = new IconChat(i*3+j);
                list.push(sprite);
                sprite.setScale(0.95);
                sprite.setAnchorPoint(0.5,0.5);
                sprite.setPosition(constant_chat.EACH_SPRITE_WIDTH*i - 265
                    ,constant_chat.EACH_SPRITE_HEIGHT*j- 130);
                this.layout_chat.addChild(sprite);
                //if(i*3+j>10){
                //    sprite.setScale(0.5);
                //}
                var _this = this;
                var listener_click_view = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget();

                        var locationInNode = target.convertToNodeSpace(touch.getLocation());
                        var s = target.getContentSize();
                        var rect = cc.rect(0,0, s.width, s.height);
                        if(cc.rectContainsPoint(rect,locationInNode)){
                            _this.rectangle.setPosition(target.getPosition());
                            list[_this.currentChosen].setScale(0.95);
                            _this.currentChosen = target.index;
                            list[_this.currentChosen].setScale(1.3);
                            _this.onClickButtonSend();
                            return true;
                        }
                        return false;
                    },
                    onTouchMoved: function (touch, event) {
                    },
                    onTouchEnded: function (touch, event) {
                    }
                });
                cc.eventManager.addListener(listener_click_view.clone(),sprite);
            }
        }
        list[2].setScale(1.3);

        //var buttonSend =  fr.createSimpleButton();
        //buttonSend.loadTextureNormal("res/game/guichatingame/bt_send.png",ccui.Widget.LOCAL_TEXTURE);
        //buttonSend.addClickEventListener(this.onClickButtonSend.bind(this));
        //buttonSend.setPosition(0 ,-190);
        //this.layout_chat.addChild(buttonSend);
    },

    //onClickSpriteNode:function(list){
    //    this.rectangle.setPosition(target.getPosition());
    //    list[this.currentChosen].setScale(0.95);
    //    this.currentChosen = target.index;
    //    list[this.currentChosen].setScale(1.2);
    //},

    onClickButtonSend:function(){
        if(this.currentChosen>=0){
            gv.gameClient.sendPacketChat(this.currentChosen);
        }
    },

    Get_Position_By_StandPos:function(standPos){
        var size = cc.winSize;
        var position;
        switch(standPos) {
            case 1:{
                position = new cc.p(size.width - constant_chat.FIX_POSITION_CHAT, size.height / 2);
                break;
            }
            case 2:{
                position = new cc.p(size.width / 2, size.height - constant_chat.FIX_POSITION_CHAT);
                break;
            }
            case 3:{
                position = new cc.p(constant_chat.FIX_POSITION_CHAT, size.height / 2);
                break;
            }
            case 0:{
                position = new cc.p(size.width / 2, constant_chat.FIX_POSITION_CHAT);
                break;
            }
            default:{
                position = new cc.p(0, 0);
                break;
            }
        }
        return position;
    },

    Draw_Action_Chat:function(standPos,iconindex){
        // Cuong       sau nay can phai swith sprite theo tag (co the la animation)
        var position = this.Get_Position_By_StandPos(standPos);
        if(this.animPlayer[standPos]!=null){
            this.animPlayer[standPos].removeFromParent();
            this.animPlayer[standPos] = null;
        }
        var _this = this;
        this.animPlayer[standPos] = fr.AnimationMgr.createAnimationById(resAniId.emotion, this);
        this.animPlayer[standPos].getAnimation().gotoAndPlay("run_"+(iconindex+1), 0, 0.75, 3);

        this.animPlayer[standPos].setPosition(position);
        this.animPlayer[standPos].setCompleteListener(function(){
            if(_this.animPlayer[standPos]!=null){
                _this.animPlayer[standPos].removeFromParent();
                _this.animPlayer[standPos] = null;
            }
        });
        this.addChild(this.animPlayer[standPos]);
        if(this.isLayoutInScreen){
            this.RemoveLayoutChat();
            this.isLayoutInScreen = false;
        }
    },

    RemoveLayoutChat:function(){
        this.layout_chat.destroy();
    }
});