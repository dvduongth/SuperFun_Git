
var g_canvas           	= null;
var g_context         	= null;
var g_graphicEngine    	= null;
var g_particleEngine   	= null;
var g_inputEngine      	= null;
var g_stateEngine      	= null;
var g_soundEngine		= null;

var g_particleDef		= null;

var UPDATED_STRING = "=21/4/17=";

var GuiLogin = BaseGui.extend({
    _wsiSendText: null,
    _wsiSendBinary: null,
    _wsiError: null,

    _sendTextStatus: null,
    _sendBinaryStatus: null,
    _errorStatus: null,

    _sendTextTimes: 0,
    _sendBinaryTimes: 0,

    ctor:function() {
        this._super(res.ZCSD_GUI_LOGIN);

        this.bg = this._rootNode.getChildByName("bg");

        this.accountSlot = this.bg.getChildByName("account_slot");
        this.accountSlot.setVisible(cc.sys.os == cc.sys.OS_WINDOWS);

        this.textFiledAccount = this.accountSlot.getChildByName('textField_account_name');
        this.textFiledAccount.addEventListener(this.onTextFiledChanged.bind(this));

        this.accountLb = this.accountSlot.getChildByName('text_account_name');
        this.accountLb.setString(fr.LocalStorage.getStringFromKey("session_cache_key", ""));
        //this.accountLb.setString(MathUtil.randomBetween(1,10000));

        this.facebookBtn = this.bg.getChildByName('btn_facebook');
        this.facebookBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.FACEBOOK));

        this.zaloBtn = this.bg.getChildByName('btn_zalo');
        this.zaloBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.ZALO));

        this.googleBtn = this.bg.getChildByName('btn_google');
        this.googleBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.GOOGLE));

        this.zingmeBtn = this.bg.getChildByName('btn_zingme');
        this.zingmeBtn.addClickEventListener(this.onSocialBtnClick.bind(this, SOCIAL_TYPE.ZACCOUNT));

        this.setEnableSocialButton(false);


        var backgroundEffect  = fr.AnimationMgr.createAnimationById(resAniId.loading_effect, this);
        backgroundEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
        backgroundEffect.setPosition(0,cc.winSize.height);
        this.addChild(backgroundEffect);

        var labelText = this._rootNode.getChildByName("lb_update");
        labelText.setString(UPDATED_STRING);

        //this.horseAni = fr.createSprite("res/game/Horse/blue_horse2.png");
        //this.horseAni.setPosition(100,100);
        ////this.addChild(this.horseAni, 999);
        //
        //var end = cc.p(100,150);
        //var jumpTo = cc.jumpTo(0.2, end, 100, 1);
        //this.horseAni.runAction(jumpTo);


        //this.diceControl = new NodeDiceControl();
        //this.diceControl.setPosition(cc.winSize.width-156,cc.winSize.height/2);
        //this._rootNode.addChild(this.diceControl, MainBoardZOrder.DICE_CONTROL);

        //var sp = fr.createSprite("res/game/mainBoard/tile_mini_game_1.png");
        //sp.setPosition(500,500);
        ////this.addChild(sp);
        //
        ////sp.runAction(cc.fadeTo(5.0, 100));
        //s

        /*var x1  = fr.AnimationMgr.createAnimationById(resAniId.CH_D_1, this);
        x1.getAnimation().gotoAndPlay("happy", 0, -1, 0);
        x1.setPosition(100,100);
        this.addChild(x1);*/

        //var x1  = fr.AnimationMgr.createAnimationById(resAniId.docChiemTraiNgua_notification, this);
        //x1.getAnimation().gotoAndPlay("run", 0, -1, 0);
        //x1.setPosition(100,100);
        //this.addChild(x1);
        //var minigameTuXi = new GuiMiniGameTuXi();
        //this.addChild(minigameTuXi);
        ////
        //var x2 = fr.AnimationMgr.createAnimationById(resAniId.tile_light, this);
        //x2.getAnimation().gotoAndPlay("green", 0, -1, 0);
        //x2.setPosition(300, 400);
        //this.addChild(x2);

        //var x3 = fr.AnimationMgr.createAnimationById(resAniId.chuongthutren, this);
        //x3.getAnimation().gotoAndPlay("run", 0, -1, 0);
        //x3.setPosition(500, 400);
        //this.addChild(x3);

        //
        //var nguaxanh = false;
        //for (var i=0; i<14; i++)
        //    x1.getArmature().getBone("layer_"+i).setVisible(nguaxanh);

        //var size = cc.winSize;
        //var x2  = fr.AnimationMgr.createAnimationById(resAniId.skill_rainbow_step_2, this);
        //x2.getAnimation().gotoAndPlay("run", 0, -1, 0);
        //x2.setPosition(size.width/2,size.height/2);
        //this.addChild(x2);
        ////
        //var xxx  = fr.AnimationMgr.createAnimationById(resAniId.current_turn_bottom, this);
        //xxx.getAnimation().gotoAndPlay("run", 0, -1, 0);//start, end
        //xxx.setPosition(size.width/2,size.height/2);
        //this.addChild(xxx);

        //var x2  = fr.AnimationMgr.createAnimationById(resAniId.skill_am_sat_no, this);
        //x2.getAnimation().gotoAndPlay("run", 0, -1, 1);//start, end
        //x2.setPosition(size.width/2,size.height/2);
        //this.addChild(x2);

        //this.diceControl = new NodeDiceControl();
        //this.diceControl.setPosition(cc.winSize.width-156,cc.winSize.height/2);
        //this._rootNode.addChild(this.diceControl, MainBoardZOrder.DICE_CONTROL);


        //this.cardList = [];
        //for (var i=0; i<10; i++){
        //    var cardsprite = fr.createSprite("res/test/labai_" + i +".png");
        //    cardsprite.setPosition(300+ i*60,400);
        //    this.addChild(cardsprite);
        //    cardsprite.setColor(cc.color(100,100,100,0));
        //    cardsprite.setLocalZOrder(i);
        //    this.cardList.push(cardsprite);
        //}
        //
        //this.firstCard = -1;
        //this.firstCardOriginalPos = cc.p(0,0);
        //this.secondCard = -1;
        //
        //this.cardBorder = fr.createSprite("res/test/selectCard.png");
        //this.cardBorder.setVisible(false);
        //this.addChild(this.cardBorder);

        //var x=  fr.createSprite("res/game/mainBoard/crosshair.png");
        //x.setPosition(cc.winSize.width- x.getContentSize().width/2, cc.winSize.height/2);
        //this.addChild(x);
        //
        //cc.log("size = " + cc.winSize.width + "," + cc.winSize.height);
        //cc.log("x pos = " + x.getPosition().x + "," + x.getPosition().y);
        //return;

        //this.testHorse(PlayerColor.YELLOW);

        this.createTestButton();

        //this.init();
    },

    createTestButton: function () {
        //test new button
        this.btnClient_0 = new fr.Button("button/btn_blue_0.png");
        this.btnClient_1 = new fr.Button("button/button_green_0.png");
        //title
        var lb = ccui.Text("CLIENT 0", res.FONT_GAME_BOLD, 25);
        this.btnClient_0.addChild(lb);
        lb.setPosition(this.btnClient_0.getContentSize().width >> 1, this.btnClient_0.getContentSize().height >> 1);

        lb = ccui.Text("CLIENT 1", res.FONT_GAME_BOLD, 25);
        this.btnClient_1.addChild(lb);
        lb.setPosition(this.btnClient_1.getContentSize().width >> 1, this.btnClient_1.getContentSize().height >> 1);

        //x.setPressedActionEnabled(false);
        this.btnClient_0.addClickEventListener(this.testButton.bind(this));
        this.btnClient_1.addClickEventListener(this.testButton.bind(this));
        this.addChild(this.btnClient_0);
        this.addChild(this.btnClient_1);

        this.btnClient_0.setPosition(gv.WIN_SIZE.width / 3,gv.WIN_SIZE.height >> 1);
        this.btnClient_1.setPosition(gv.WIN_SIZE.width * 2 / 3, gv.WIN_SIZE.height >> 1);
    },

    testButton: function (sender) {
        var client = null;
        switch (sender) {
            case this.btnClient_0:
                client = new Client(30);
                break;
            case this.btnClient_1:
                client = new Client(11);
                break;
        }
        if(sender) {
            sender.setEnabled(false);
            sender.setVisible(false);
        }
        g_graphicEngine  = new GraphicEngine();
        g_particleEngine = new ParticleEngine();
        g_inputEngine    = new InputEngine();
        g_stateEngine    = new StateEngine();
        g_soundEngine 	 = new SoundEngine();

        g_particleDef	 = new ParticleDef();

        //CreateCanvas();
        //g_inputEngine.AddEventListener (g_canvas);
        //ResizeCanvas();

        g_context = this;
        g_stateEngine.SetContext(g_context, g_graphicEngine);
        g_particleEngine.SetContext(g_context, g_graphicEngine);

        //window.onresize = ResizeCanvas;

        g_stateEngine.Start();
        GoToLoaderState();
    },

    testHorse: function(horseColor){
        var horseAni  = fr.AnimationMgr.createAnimationById(resAniId.minigame_horse, this);
        horseAni.getAnimation().gotoAndPlay("cham", 0, -1, 0);//start, end
        horseAni.setPosition(300,300);
        this.addChild(horseAni);

        for (var color=0; color<4; color++){
            var colorStr = GameUtil.getColorStringById(color);
            for (var layerIndex=0; layerIndex<5; layerIndex++){
                cc.log(colorStr+"_"+ layerIndex);
                horseAni.getArmature().getBone(colorStr+"_"+ layerIndex).setVisible(color==horseColor);
            }
        }
    },

    onTextFiledChanged: function(sender){
        if (this.accountLb.getString().length>=18) return;
        this.accountLb.setString(sender.getString());
    },

    onSocialBtnClick: function(socialType){
        //this.setEnableSocialButton(false);
        //gv.socialMgr.loginSocial(socialType, this.accountLb.getString());
        //fr.LocalStorage.setStringFromKey("session_cache_key", this.accountLb.getString());
    },

    showLoginFailed: function(){
        var loginNoti = this.bg.getChildByName("login_notification");
        loginNoti.setVisible(true);
        loginNoti.runAction(cc.sequence(
            cc.delayTime(3.0),
            cc.callFunc(function(){
                loginNoti.setVisible(false);
            })
        ));
        this.setEnableSocialButton(true);
    },

    setEnableSocialButton : function(enable){
        this.facebookBtn.setTouchEnabled(enable);
        this.facebookBtn.setVisible(enable);

        this.zaloBtn.setTouchEnabled(enable);
        this.zaloBtn.setVisible(enable);

        this.googleBtn.setTouchEnabled(enable);
        this.googleBtn.setVisible(enable);

        this.zingmeBtn.setTouchEnabled(enable);
        this.zingmeBtn.setVisible(enable);

    },

    onLoginSocialSuccess : function(sessionKey){
        gv.gameClient.setUserLogin(sessionKey);
        gv.gameClient.connect();
    },

    //onTouchBegan : function(touch, event){
    //    var touchPos = touch.getLocation();
    //    var currentGui = gv.guiMgr.getGuiById(GuiId.LOGIN);
    //   currentGui.gun.setTargetPosition(touchPos);
    //   currentGui.gun.fireBullet();
    //
    //    return true;
    //}

    init: function () {

        var winSize = cc.director.getWinSize();

        var MARGIN = 40;
        var SPACE = 35;

        var label = new cc.LabelTTF("WebSocket Test", "Arial", 28);
        label.x = winSize.width / 2;
        label.y = winSize.height - MARGIN;
        this.addChild(label, 0);

        var menuRequest = new cc.Menu();
        menuRequest.x = 0;
        menuRequest.y = 0;
        this.addChild(menuRequest);

        // Send Text
        var labelSendText = new cc.LabelTTF("Send Text", "Arial", 22);
        var itemSendText = new cc.MenuItemLabel(labelSendText, this.onMenuSendTextClicked, this);
        itemSendText.x = winSize.width / 2;
        itemSendText.y = winSize.height - MARGIN - SPACE;
        menuRequest.addChild(itemSendText);

        // Send Binary
        var labelSendBinary = new cc.LabelTTF("Send Binary", "Arial", 22);
        var itemSendBinary = new cc.MenuItemLabel(labelSendBinary, this.onMenuSendBinaryClicked, this);
        itemSendBinary.x = winSize.width / 2;
        itemSendBinary.y = winSize.height - MARGIN - 2 * SPACE;
        menuRequest.addChild(itemSendBinary);


        // Send Text Status Label
        this._sendTextStatus = new cc.LabelTTF("Send Text WS is waiting...", "Arial", 14, cc.size(160, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._sendTextStatus.anchorX = 0;
        this._sendTextStatus.anchorY = 0;
        this._sendTextStatus.x = 0;
        this._sendTextStatus.y = 25;
        this.addChild(this._sendTextStatus);

        // Send Binary Status Label
        this._sendBinaryStatus = new cc.LabelTTF("Send Binary WS is waiting...", "Arial", 14, cc.size(160, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._sendBinaryStatus.anchorX = 0;
        this._sendBinaryStatus.anchorY = 0;
        this._sendBinaryStatus.x = 160;
        this._sendBinaryStatus.y = 25;
        this.addChild(this._sendBinaryStatus);

        // Error Label
        this._errorStatus = new cc.LabelTTF("Error WS is waiting...", "Arial", 14, cc.size(160, 100), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._errorStatus.anchorX = 0;
        this._errorStatus.anchorY = 0;
        this._errorStatus.x = 320;
        this._errorStatus.y = 25;
        this.addChild(this._errorStatus);

        // Back Menu
        var itemBack = new cc.MenuItemFont("Back", this.toExtensionsMainLayer, this);
        itemBack.x = winSize.width - 50;
        itemBack.y = 25;
        var menuBack = new cc.Menu(itemBack);
        menuBack.x = 0;
        menuBack.y = 0;
        this.addChild(menuBack);

        var self = this;

        this._wsiSendText = new WebSocket("ws://echo.websocket.org");
        this._wsiSendText.onopen = function(evt) {
            self._sendTextStatus.setString("Send Text WS was opened.");
        };

        this._wsiSendText.onmessage = function(evt) {
            self._sendTextTimes++;
            var textStr = "response text msg: "+evt.data+", "+self._sendTextTimes;
            cc.log(textStr);

            self._sendTextStatus.setString(textStr);
        };

        this._wsiSendText.onerror = function(evt) {
            cc.log("sendText Error was fired");
        };

        this._wsiSendText.onclose = function(evt) {
            cc.log("_wsiSendText websocket instance closed.");
            self._wsiSendText = null;
        };


        this._wsiSendBinary = new WebSocket("ws://echo.websocket.org");
        this._wsiSendBinary.binaryType = "arraybuffer";
        this._wsiSendBinary.onopen = function(evt) {
            self._sendBinaryStatus.setString("Send Binary WS was opened.");
        };

        this._wsiSendBinary.onmessage = function(evt) {
            self._sendBinaryTimes++;
            var binary = new Uint16Array(evt.data);
            var binaryStr = "response bin msg: ";

            var str = "";
            for (var i = 0; i < binary.length; i++) {
                if (binary[i] == 0)
                {
                    str += "\'\\0\'";
                }
                else
                {
                    var hexChar = "0x" + binary[i].toString("16").toUpperCase();
                    str += String.fromCharCode(hexChar);
                }
            }

            binaryStr += str + ", " + self._sendBinaryTimes;
            cc.log(binaryStr);
            self._sendBinaryStatus.setString(binaryStr);
        };

        this._wsiSendBinary.onerror = function(evt) {
            cc.log("sendBinary Error was fired");
        };

        this._wsiSendBinary.onclose = function(evt) {
            cc.log("_wsiSendBinary websocket instance closed.");
            self._wsiSendBinary = null;
        };

        this._wsiError = new WebSocket("ws://invalid.url.com");
        this._wsiError.onopen = function(evt) {};
        this._wsiError.onmessage = function(evt) {};
        this._wsiError.onerror = function(evt) {
            cc.log("Error was fired");
            self._errorStatus.setString("an error was fired");
        };
        this._wsiError.onclose = function(evt) {
            cc.log("_wsiError websocket instance closed.");
            self._wsiError = null;
        };

        return true;
    },

    onExit: function() {
        if (this._wsiSendText)
            this._wsiSendText.close();

        if (this._wsiSendBinary)
            this._wsiSendBinary.close();

        if (this._wsiError)
            this._wsiError.close();
        this._super();
    },

    // Menu Callbacks
    onMenuSendTextClicked: function(sender) {

        if (this._wsiSendText.readyState == WebSocket.OPEN)
        {
            this._sendTextStatus.setString("Send Text WS is waiting...");
            this._wsiSendText.send("Hello WebSocket中文, I'm a text message.");
        }
        else
        {
            var warningStr = "send text websocket instance wasn't ready...";
            cc.log(warningStr);
            this._sendTextStatus.setString(warningStr);
        }
    },

    _stringConvertToArray:function (strData) {
        if (!strData)
            return null;

        var arrData = new Uint16Array(strData.length);
        for (var i = 0; i < strData.length; i++) {
            arrData[i] = strData.charCodeAt(i);
        }
        return arrData;
    },

    onMenuSendBinaryClicked: function(sender)
    {

        if (this._wsiSendBinary.readyState == WebSocket.OPEN)
        {
            this._sendBinaryStatus.setString("Send Binary WS is waiting...");
            var buf = "Hello WebSocket中文,\0 I'm\0 a\0 binary\0 message\0.";
            var binary = this._stringConvertToArray(buf);

            this._wsiSendBinary.send(binary.buffer);
        }
        else
        {
            var warningStr = "send binary websocket instance wasn't ready...";
            cc.log(warningStr);
            this._sendBinaryStatus.setString(warningStr);
        }
    },

    toExtensionsMainLayer: function (sender) {
        cc.log('toExtensionsMainLayer');
    }

});