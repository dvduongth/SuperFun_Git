/**
 * Created by GSN on 8/15/2016.
 */
var TIME_CHECK = 90;

var AutoPlay = BaseGui.extend({

    ctor:function () {
        this._super();
        this.buttonAuto=null;
        this.autoMode=false;
        this.layout_Full_Screen=null;
        this.text=null;
        this.time=0;
        this.autoMode = false;
        this.time = GameUtil.getCurrentTime();
        this.Add_layout_in_layer();

        this.schedule(this.On_Update,20);
        this.setUpTurn();
    },

    setUpTurn:function(){
        this.textTurn = new ccui.Text("Lượt chơi: " +1, res.FONT_GAME_BOLD, 20);
        this.textTurn.setPosition(cc.winSize.width-80,cc.winSize.height-40);
        this.addChild(this.textTurn);
    },

    changeText:function(){
        this.textTurn.setString("Lượt chơi: " +(gv.matchMng.currentTurnForAllPlayer+1));
    },

    Create_Button_Auto:function(){
        var size = cc.winSize;
        if(!this.buttonAuto){
            this.buttonAuto = new ccui.Button();
            this.buttonAuto.loadTextureNormal("res/game/guiautoplay/BT_tudong.png",ccui.Widget.LOCAL_TEXTURE);
            this.buttonAuto.addClickEventListener(this.onButtonAuto.bind(this));
            this.buttonAuto.setPosition(size.width-this.buttonAuto.getContentSize().width/2+10,this.buttonAuto.getContentSize().height/2);
            this.addChild(this.buttonAuto);
        }
    },

    onButtonAuto:function(){
        this.Disable_Auto_Mode();
    },

    Add_layout_in_layer:function(){
        this.layout_Full_Screen = new ccui.Layout();
        this.layout_Full_Screen.setPosition(0,0);
        this.addChild(this.layout_Full_Screen,10000);
        var _this = this;
        var listener_click_layout = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                _this.time = GameUtil.getCurrentTime();
                if(_this.autoMode){
                    _this.Disable_Auto_Mode();
                }
                return false;
            },

            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_layout ,this.layout_Full_Screen);
    },

    Disable_Auto_Mode: function () {
        this.autoMode = false;
        if(this.buttonAuto){
            this.buttonAuto.removeFromParent();
            this.buttonAuto = null;
        }
        gv.gameClient.sendPacketAutoplay(this.autoMode);
    },

    Enable_Auto_Mode: function () {
        this.autoMode = true;
        this.Create_Button_Auto();
        gv.gameClient.sendPacketAutoplay(this.autoMode);
    },

    On_Update:function(){
        var currentTime = GameUtil.getCurrentTime();
        //todo neu ma minh da pha san roi thi thoi :P
        //if()
        //gv.matchMng
        //for(var i=0; i< this.playerManager.getNumberPlayer(); i++){
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(0);
        if(playerInfo.lose){
            this.unschedule(this.On_Update);
            this.Disable_Auto_Mode();
        }
        if(this.autoMode==false){
            if(currentTime - this.time >TIME_CHECK){
                this.Enable_Auto_Mode();
            }
        }
    }
});