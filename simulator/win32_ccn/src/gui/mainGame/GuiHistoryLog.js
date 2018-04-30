/**
 * Created by GSN on 7/5/2016.
 */

var constant_GUI = {
    MAX_LIST_STRING :9,
    DIVIDE:6,
    SCALE:0.7,
    FIX_VALUE:10,
    FONT_SIZE:22
};

var zOrDer ={
    VIEW_ZODER : 100,
    LAYOUT_ZODER:90
};

var LogObject = cc.Class.extend({

    ctor : function(playerInfo,action,targetInfo){
        this.playerInfo = playerInfo;
        this.targetInfo = targetInfo;
        this.action = action
    }
});

var GuiHistoryLog = BaseGui.extend({

    ctor:function (jsonRes) {
        this._super(jsonRes);
        var winSize = cc.winSize;
        // khoi tao cac bien
        this.layout_Full_Screen=null;
        this.view=null;
        this.inScreen=null;
        this.button_view=null;
        this.inScreen = false;
        //Create list action
        this.list_acion = [constant_GUI.MAX_LIST_STRING];
        for (var i =0;i< constant_GUI.MAX_LIST_STRING;i++){
            this.list_acion[i] = null;
        }
        //create view
        this.view = fr.createSprite(res.BACKGROUND_HISTORY);
        var size = this.view.getContentSize();
        this.view.setPosition(cc.p(winSize.width/2,-2*size.height/constant_GUI.DIVIDE*constant_GUI.SCALE -constant_GUI.FIX_VALUE));
        this.view.setAnchorPoint(cc.p(0.5,0.5));
        this.view.setScale(constant_GUI.SCALE,constant_GUI.SCALE);
        var _this = this;
        var listener_click_view = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(!_this.inScreen){
                        _this.Move_To_Screen();
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_view,this.view);
        this.addChild(this.view,zOrDer.VIEW_ZODER);
        this.Draw_View();
        // draw list action
        this.Draw_action_in_view();
        this.setVisible(false);
    },

    Draw_View:function(){
        var size = this.view.getContentSize();
        this.button_view = fr.createSprite(res.TRIANGLE_BUTTON);
        this.button_view.setScale(2);
        if(this.inScreen){
            this.button_view.setRotation(180);
        }
        this.button_view.setPosition(cc.p(size.width-60,size.height-35));
        var _this = this;
        var listenerButtonView = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(!_this.inScreen){
                        _this.Move_To_Screen();
                    }else{
                        _this.Back_To_Out_Screen();

                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listenerButtonView,this.button_view);
        this.view.addChild(this.button_view);

        var text = fr.createSprite("res/game/history_log/text_history_log.png");
        text.setPosition(size.width/2-30,size.height-40);
        text.setScale(2);
        this.view.addChild(text);
    },

    //add layout
    Add_layout_in_layer:function(){
        var winSize = cc.winSize;
        this.layout_Full_Screen = new ccui.Layout();
        this.layout_Full_Screen.setSize(winSize.width,winSize.height);
        this.layout_Full_Screen.setPosition(0,0);
        this.addChild(this.layout_Full_Screen,zOrDer.LAYOUT_ZODER);
        var listener_click_layout = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                target.getParent().Back_To_Out_Screen();
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_layout ,this.layout_Full_Screen);
        cc.log(this.layout_Full_Screen.width + "         " + this.layout_Full_Screen.height);
    },

    //Draw historylog
    Draw_action_in_view : function(){
        this.view.removeAllChildren();
        this.Draw_View();
        var size = this.view.getContentSize();
        for (var i =0;i<constant_GUI.MAX_LIST_STRING;i++){
            if(this.list_acion[i]!=null) {
                var colorPlayer = this.list_acion[i].playerInfo.playerColor;
                var playername = this.list_acion[i].playerInfo.playerStatus.name;
                var color = GameUtil.getRGBColorById(colorPlayer);
                var sprite = null;
                switch(colorPlayer){
                    case 0:{// BLUE
                        sprite = fr.createSprite(res.BLUE_HORSE);
                        break;}
                    case 1:{//GREEN
                        sprite = fr.createSprite(res.GREEN_HORSE);
                        break;}
                    case 2:{//RED
                        sprite = fr.createSprite(res.RED_HORSE);
                        break;}
                    case 3:{//YELLOW
                        sprite = fr.createSprite(res.YELLOW_HORSE);
                        break;}
                }
                var position_x = 25;
                var position_y = size.height/(constant_GUI.MAX_LIST_STRING +2 )* (i+0.6);
                sprite.x = position_x;
                sprite.y = position_y-2;
                sprite.setAnchorPoint(cc.p(0,0));
                this.view.addChild(sprite);

                var label_playername = new ccui.Text(this.PreProcessing_Name(playername) , res.FONT_GAME_BOLD, constant_GUI.FONT_SIZE);
                label_playername.setAnchorPoint(cc.p(0,0));
                label_playername.setColor(color);
                label_playername.x =position_x + 20 ;
                label_playername.y = position_y;
                this.view.addChild(label_playername);

                var label_action = new ccui.Text("-"+this.list_acion[i].action , res.FONT_GAME_BOLD, constant_GUI.FONT_SIZE);
                label_action.setAnchorPoint(cc.p(0,0));
                label_action.x =label_playername.x + label_playername.getContentSize().width +10;
                label_action.y = position_y;
                this.view.addChild(label_action);
                if(!this.list_acion[i].action.localeCompare(" Xuất quân ")){
                    label_action.setColor(color);
                }

                if(this.list_acion[i].targetInfo!=null){
                    var colortarget = GameUtil.getRGBColorById(this.list_acion[i].targetInfo.playerColor);
                    var playertarget = this.list_acion[i].targetInfo.playerStatus.name;
                    var label_targetname = new ccui.Text(this.PreProcessing_Name(playertarget), res.FONT_GAME_BOLD, constant_GUI.FONT_SIZE);
                    label_targetname.setAnchorPoint(cc.p(0,0));
                    label_targetname.setColor(colortarget);
                    label_targetname.x = label_action.x + label_action.getContentSize().width +10;
                    label_targetname.y = position_y;
                    this.view.addChild(label_targetname);
                }
            }
        }
    },

    //add item in list
    Return_New_List: function(new_action){
        for(var i = 0;i<constant_GUI.MAX_LIST_STRING;i++) {
            if (i == constant_GUI.MAX_LIST_STRING-1) {
                this.list_acion[i] =new_action;
            } else {
                if( this.list_acion[i+1]!=null){
                    this.list_acion[i] = this.list_acion[i+1];
                }
            }
        }
        this.Draw_action_in_view();
    },

    //move all view in screen
    Move_To_Screen: function(){
        var size = this.view.getContentSize();
        var action = cc.moveBy(0.2,0,5*size.height/constant_GUI.DIVIDE*constant_GUI.SCALE + constant_GUI.FIX_VALUE).easing(cc.easeBackOut());
        this.view.runAction(action);
        cc.log("Go to screen");
        this.inScreen = true;
        this.Add_layout_in_layer();
        this.button_view.setRotation(180);
    },

    //back move to screen
    Back_To_Out_Screen:function(){
        var size = this.view.getContentSize();
        var action = cc.moveBy(0.2,0,5*size.height/constant_GUI.DIVIDE*constant_GUI.SCALE + constant_GUI.FIX_VALUE).reverse().easing(cc.easeBackOut());
        this.view.runAction(action);
        this.layout_Full_Screen.removeFromParent();
        this.inScreen = false;
        this.button_view.setRotation(0);
        cc.log("Remove on screen");
    },

    PreProcessing_Name:function(name){
        if(name.length>6){
            var string = "";
            for(var i=0;i<6;i++){
                string += name[i];
            }
            return string+"...";
        }else{
            return name+"   ";
        }
    },

    Add_Log_Kick:function(playername,playertarget){
        var logObject = new LogObject(playername, " Đá ", playertarget);
        this.Return_New_List(logObject);
    },

    Add_Log_Move:function(playername,range){
        var logObject = new LogObject(playername, " Nhảy " + range + " bước" , null);
        this.Return_New_List(logObject);
    },

    Add_Log_Summon:function(playername){
        var logObject = new LogObject(playername, " Xuất quân " , null);
        this.Return_New_List(logObject);
    },

    Add_Log_Teleport:function(playername){
        var logObject = new LogObject(playername, " Vào ô dịch chuyển " , null);
        this.Return_New_List(logObject);
    },

    Add_Log_SwapPlayer:function(playername,playertarget){
        var logObject = new LogObject(playername, " Đổi chỗ cho " , playertarget);
        this.Return_New_List(logObject);
    },

    Add_Log_Skill:function(playername,skill){
        var logObject = new LogObject(playername, " Kích hoạt " +skill , null);
        this.Return_New_List(logObject);
    },

    // phan nay ko dung nua
    Add_Log_GoToDestination:function(playername){
        var logObject = new LogObject(playername, " Đã về chuồng " , null);
        this.Return_New_List(logObject);
    },

    Add_Log_Back8Step: function (playername) {
        var logObject = new LogObject(playername, " Lùi 8 bước " , null);
        this.Return_New_List(logObject);
    },

    Add_Log_JumpToDestinationGate:function(playername){
        var logObject = new LogObject(playername, " Nhảy đến cổng kế tiếp " , null);
        this.Return_New_List(logObject);
    },

    Add_Log_All3Step:function(playername){
        var logObject = new LogObject(playername, " Tất cả nhảy 3 bước " , null);
        this.Return_New_List(logObject);
    }
});