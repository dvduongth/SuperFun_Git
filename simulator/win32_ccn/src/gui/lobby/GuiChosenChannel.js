var CustomTableViewCell = cc.TableViewCell.extend({

    draw:function (ctx) {
        this._super(ctx);
    }
});

var constant_view ={
    TABLE_VIEW_BG :"res/lobby/chonkenh/tableviewbg.png",
    TABLE_VIEW_CELL_LIGHT:"res/lobby/chonkenh/slot_1.png",
    TABLE_VIEW_CELL_UNLIGHT:"res/lobby/chonkenh/slot3.png",
    MONEY_LIGHT:"res/lobby/chonkenh/money.png",
    MONEY_UNLIGHT:"res/lobby/chonkenh/money-dis.png",
    ICON :"res/lobby/chonkenh/icon.png",
    PRORGESS_NULL:"res/lobby/chonkenh/progess.png",
    PRORGESS_FULL:"res/lobby/chonkenh/progess-full.png",

    SELECT_KENH_BG :"res/lobby/chonkenh/selectkenhbg.png",

    SELECT_KENH_TS:"res/lobby/chonkenh/select-kenh_02.png",
    SELECT_KENH_CN:"res/lobby/chonkenh/select-kenh_03.png",
    SELECT_KENH_DG:"res/lobby/chonkenh/select-kenh_04.png",
    SELECT_KENH_TP:"res/lobby/chonkenh/select-kenh_05.png",

    IMAGE_BG:"res/lobby/chonkenh/1.png",
    IMAGE_TS:"res/lobby/chonkenh/tap su.png",
    IMAGE_CN:"res/lobby/chonkenh/chuyen nghiep.png",
    IMAGE_DG:"res/lobby/chonkenh/dai gia.png",
    IMAGE_TP:"res/lobby/chonkenh/trieu phu.png",

    TEXT_IMAGE_TS:"res/lobby/chonkenh/textts.png",
    TEXT_IMAGE_CN:"res/lobby/chonkenh/textcn.png",
    TEXT_IMAGE_DG:"res/lobby/chonkenh/textdg.png",
    TEXT_IMAGE_TP:"res/lobby/chonkenh/texttp.png",

    DICE:"res/lobby/chonkenh/dice.png",

    DELAY_TIME:1/8,

    CLICK_TS : "res/lobby/chonkenh/BT_tapsu.png",
    CLICK_CN : "res/lobby/chonkenh/BT_chuyennghiep.png",
    CLICK_DG : "res/lobby/chonkenh/BT_DaiGia.png",
    CLICK_TP : "res/lobby/chonkenh/BT_Trieu Phu.png",

    BUTTON_BACK: "res/lobby/chonkenh/BT_back.png",

    LOCK_DISABLE : "res/lobby/chonkenh/lock-dis.png"
};
var ObjectConfig =  cc.Class.extend({

    ctor: function (betlevel,goldbet,goldmin,goldmax) {
        this.betlevel = betlevel;
        this.goldbet = goldbet;
        this.goldmin = goldmin;
        this.goldmax = goldmax;
    }

});

var GuiChosenChanel = BaseGui.extend({

    ctor:function(playergold) {
        this._super();
        var size = cc.winSize;
        this.objectConfig = [];

        var lobbyBG = fr.createSprite("res/lobby/lobby_bg.jpg");
        lobbyBG.setPosition(size.width/2,size.height/2);
        this.addChild(lobbyBG);

        this.playerGold = parseInt(playergold);
        this.spriteTableView = fr.createSprite(constant_view.TABLE_VIEW_BG);
        this.spriteTableView.setPosition(size.width*3/2, size.height/2);
        this.addChild(this.spriteTableView);

        this.tableView = new cc.TableView(this, cc.size(this.spriteTableView.getContentSize().width, this.spriteTableView.getContentSize().height-110));
        this.tableView.x = 20;
        this.tableView.y = 45;
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.tableView.setDelegate(this);
        this.spriteTableView.addChild(this.tableView);
        this.tableView.reloadData();
        this.tableIsScreen = false;

        this.selectkenhbg = fr.createSprite(constant_view.SELECT_KENH_BG);
        this.selectkenhbg.setPosition(size.width/2,size.height - this.selectkenhbg.height/2 );
        this.addChild(this.selectkenhbg);

        this.Create_Button_TS();
        this.Create_Button_CN();
        this.Create_Button_DG();
        this.Create_Button_TP();
        this.Create_Button_Back();
        this.Load_Object_Config();
        this.Action_Chosen_Mode(this.Calculate_Chanel_For_Player());
        //this.tableView;
    },

    Load_Object_Config:function(){
        var modeConfig = GameModeConfig.getInstance();
        for(var i =1;i<=30;i++){
            var objectConfig = new ObjectConfig(i,modeConfig.getBetLevelChanel(i),modeConfig.getMinLevelChanel(i),modeConfig.getMaxLevelChanel(i));
            this.objectConfig.push(objectConfig);
        }
    },

    Conver_Global_To_Local_Node:function(globalnode){
        switch (this.currentTableView){
            case 0: {
                return globalnode;
            }
            case 1: {
                return globalnode-4;
            }
            case 2: {
                return globalnode- 10;
            }
            case 3: {
                return globalnode- 17;
            }
        }
    },

    Conver_Local_To_Global_Node:function(localnode){
        switch (this.currentTableView){
            case 0: {
                return localnode;
            }
            case 1: {
                return localnode+4;
            }
            case 2: {
                return localnode + 10;
            }
            case 3: {
                return localnode + 17;
            }
        }
    },

    Calculate_Chanel_For_Player:function(){
        var min = 0;
        var max = 0;
        for(var i =0;i<24;i++){
            if(this.Check_IsEnable(i)){
                if(min==0){
                    min = i;
                }
                max = i;
            }
        }
        var mid = (min + max)/2;
        this.min = mid;
        if(mid<4){
            return 0;
        }
        if(mid<10){
            return 1;
        }
        if(mid<17){
            return 2;
        }
        return 3;
    },

    Create_Button_TS:function(){
        var _this = this;
        this.button_ts = fr.createSprite(constant_view.SELECT_KENH_TS);
        this.button_ts.setPosition(58 + this.button_ts.width/2,this.button_ts.height/2+6);
        this.selectkenhbg.addChild(this.button_ts);
        var listener_click_button_ts = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    _this.Action_Chosen_Mode(0);
                    fr.Sound.playSoundEffect(resSound.m_button_click);
                    return false;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_button_ts,this.button_ts);
    },

    Create_Button_CN:function(){
        var _this = this;
        this.button_cn = fr.createSprite(constant_view.SELECT_KENH_CN);
        this.button_cn.setPosition(58 + this.button_cn.width/2*3,this.button_cn.height/2+6);
        this.selectkenhbg.addChild(this.button_cn);
        var listener_click_button_cn = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    _this.Action_Chosen_Mode(1);
                    fr.Sound.playSoundEffect(resSound.m_button_click);
                    return false;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_button_cn,this.button_cn);
    },

    Create_Button_DG:function(){
        var _this = this;
        this.button_dg = fr.createSprite(constant_view.SELECT_KENH_DG);
        this.button_dg.setPosition(58 + this.button_dg.width/2*5,this.button_dg.height/2+6);
        this.selectkenhbg.addChild(this.button_dg);
        var listener_click_button_dg = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    _this.Action_Chosen_Mode(2);
                    fr.Sound.playSoundEffect(resSound.m_button_click);
                    return false;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_button_dg,this.button_dg);
    },

    Create_Button_TP:function(){
        var _this = this;
        this.button_tp = fr.createSprite(constant_view.SELECT_KENH_TP);
        this.button_tp.setPosition(58 + this.button_tp.width/2*7,this.button_tp.height/2+6);
        this.selectkenhbg.addChild(this.button_tp);
        var listener_click_button_tp = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    _this.Action_Chosen_Mode(3);
                    fr.Sound.playSoundEffect(resSound.m_button_click);
                    return false;                }
                return false;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener_click_button_tp,this.button_tp);
    },

    Create_Button_Back:function(){
        var size = cc.winSize;
        var buttonback = new ccui.Button();
        buttonback.loadTextureNormal(constant_view.BUTTON_BACK,ccui.Widget.LOCAL_TEXTURE);
        buttonback.addClickEventListener(this.onButtonBackClick.bind(this));
        buttonback.setPosition(size.width*3/4 + 100,size.height/2+20);
        buttonback.setPosition(50,size.height - 50 );
        this.addChild(buttonback);
    },

    onButtonBackClick:function(){
        var guilobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
        fr.Sound.playSoundEffect(resSound.m_button_click);
        guilobby.setVisible(true);
        this.destroy();
    },

    Action_Chosen_Mode:function(mode){
        var size = cc.winSize;
        this.currentTableView = mode;
        this.spriteTableView.stopAllActions();
        if(this.animChosenMode!=null){
            this.animChosenMode.removeFromParent();
        }
        this.animChosenMode = fr.AnimationMgr.createAnimationById(resAniId.eff_channel, this);
        switch (mode){
            case 0:{
                this.numbercell = 4;
                this.button_ts.removeFromParent();
                this.button_ts = null;
                if( this.button_cn==null){
                    this.Create_Button_CN();
                }
                if( this.button_dg==null){
                    this.Create_Button_DG();
                }
                if(this.button_tp==null){
                    this.Create_Button_TP();
                }
                this.animChosenMode.getAnimation().gotoAndPlay("tapsu", 0, 2, 1);
                break;
            }
            case 1:{
                this.numbercell = 6;
                this.button_cn.removeFromParent();
                this.button_cn = null;
                if( this.button_ts==null){
                    this.Create_Button_TS();
                }
                if( this.button_dg==null){
                    this.Create_Button_DG();
                }
                if(this.button_tp==null){
                    this.Create_Button_TP();
                }
                this.animChosenMode.getAnimation().gotoAndPlay("chuyennghiep", 0, 2, 1);
                break;
            }
            case 2:{
                this.numbercell = 7;
                this.button_dg.removeFromParent();
                this.button_dg = null;
                if( this.button_cn==null){
                    this.Create_Button_CN();
                }
                if( this.button_ts==null){
                    this.Create_Button_TS();
                }
                if(this.button_tp==null){
                    this.Create_Button_TP();
                }
                this.animChosenMode.getAnimation().gotoAndPlay("daigia", 0, 2, 1);
                break;
            }
            case 3:{
                this.numbercell = 7;
                this.button_tp.removeFromParent();
                this.button_tp = null;
                if( this.button_cn==null){
                    this.Create_Button_CN();
                }
                if( this.button_dg==null){
                    this.Create_Button_DG();
                }
                if(this.button_ts==null){
                    this.Create_Button_TS();
                }
                this.animChosenMode.getAnimation().gotoAndPlay("trieuphu", 0, 2, 1);
                break;
            }
        }
        this.animChosenMode.setPosition(size.width/2 - 250, size.height/2);
        this.addChild(this.animChosenMode);
        this.Action_Table_View();
    },

    Action_Table_View:function(){
        var _this = this;
        var count = 6;
        var delaytime = constant_view.DELAY_TIME;
        var size = cc.winSize;
        if(this.tableIsScreen==false){
            this.tableIsScreen = true;
            this.spriteTableView.runAction(cc.sequence(
                cc.delayTime(delaytime*(count+1)),
                cc.callFunc(function(){
                    _this.tableView.reloadData();
                    var midle = _this.Conver_Global_To_Local_Node(_this.min);
                    if(midle>4){
                        var tmp = _this.tableView.getContentOffset();
                        tmp.y = (midle-5.5)*_this.tableCellSizeForIndex().height;
                        _this.tableView.setContentOffset(tmp);
                    }
                }),
                cc.moveTo(3*delaytime,size.width/2 + 185,size.height/2).easing(cc.easeBackOut())
            ));
        }else{
            this.spriteTableView.runAction(cc.sequence(
                cc.delayTime(delaytime*(count-2)),
                cc.moveTo(3*delaytime,size.width*3/2,size.height/2),
                cc.callFunc(function(){
                    _this.tableView.reloadData();
                }),
                cc.moveTo(3*delaytime,size.width/2 + 185,size.height/2).easing(cc.easeBackOut())
            ));
        }
    },

    Preprocessing_Money:function(money){
        money = money + "";
        if(money.length<4){
            return money;
        }
        var string = "";
        var count = 1;
        for(var i =0;i<money.length;i++){
            string = money[money.length-1-i] + string;
            if(count%3==0&&count!=money.length){
                string = "." + string;
            }
            count++;
        }
        return string;
    },

    //funtion table view
    tableCellTouched:function (table, cell) {
        cc.log("global node " +this.Conver_Local_To_Global_Node(cell.getIdx()));
        if(this.Check_IsEnable(this.Conver_Local_To_Global_Node(cell.getIdx()))){
            var isPlayWithAuto = CheatConfig.PLAY_WITH_BOT;
            gv.guiMgr.addGui(new GuiChannel(isPlayWithAuto,this.Conver_Local_To_Global_Node(cell.getIdx())), GuiId.CHANNEL, LayerId.LAYER_GUI);
            fr.Sound.playSoundEffect(resSound.m_button_click)
        }
    },

    tableCellSizeForIndex:function (table, idx) {
        return cc.size(450, 90);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new CustomTableViewCell();
        }else{
            cell.removeFromParent();
            cell = new CustomTableViewCell();
        }
        var globalnode = this.Conver_Local_To_Global_Node(idx);
        var sprite = this.Draw_Card(globalnode);
        cell.addChild(sprite);
        return cell;
    },

    Draw_Card:function(globalnode){
        // neu enable thi draw enable
        if(this.Check_IsEnable(globalnode)){
            return this.Draw_Card_Enable(globalnode);
        }else{
            return this.Draw_Card_Disable(globalnode);
        }
    },

    Check_IsEnable:function(globalnode){
        return this.objectConfig[globalnode].goldmin< this.playerGold&&this.objectConfig[globalnode].goldmax> this.playerGold;
        //if(this.objectConfig[globalnode].goldmin< this.playerGold
        //    && this.objectConfig[globalnode].goldmax> this.playerGold ){
        //    return true;
        //}
        //return false;
    },

    Draw_Card_Enable:function(globalnode)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  {
        var sprite = fr.createSprite(constant_view.TABLE_VIEW_CELL_LIGHT);
        sprite.anchorX = 0;
        sprite.anchorY = 0;
        sprite.x = 0;
        sprite.y = 0;

        var money = fr.createSprite(constant_view.MONEY_LIGHT);
        money.setPosition(40,sprite.height/2);
        sprite.addChild(money);

        var icon = fr.createSprite(constant_view.ICON);
        icon.setPosition(sprite.width-40,sprite.height/2);
        sprite.addChild(icon);

        var progressnull = fr.createSprite(constant_view.PRORGESS_NULL);
        progressnull.setPosition(sprite.width-40,sprite.height/2 - icon.height/2-5);
        sprite.addChild(progressnull);

        var label_money = new ccui.Text(this.Preprocessing_Money(this.objectConfig[globalnode].goldbet) , res.FONT_GAME_BOLD, 25);
        label_money.setColor(cc.color(153,96,45));
        label_money.setAnchorPoint(cc.p(0,0.5));
        label_money.x =75 ;
        label_money.y = sprite.height/2;
        sprite.addChild(label_money);
        return sprite;
    },

    Draw_Card_Disable:function(globalnode){
        var sprite = fr.createSprite(constant_view.TABLE_VIEW_CELL_UNLIGHT);
        sprite.anchorX = 0;
        sprite.anchorY = 0;
        sprite.x = 0;
        sprite.y = 0;

        var icon = fr.createSprite(constant_view.ICON);
        icon.setPosition(sprite.width-80,sprite.height/2+20);
        sprite.addChild(icon);

        var progressnull = fr.createSprite(constant_view.PRORGESS_NULL);
        progressnull.setPosition(sprite.width-80,sprite.height/2 - icon.height/2-5 + 20);
        sprite.addChild(progressnull);

        var money = fr.createSprite(constant_view.MONEY_UNLIGHT);
        money.setPosition(40,sprite.height/2);
        sprite.addChild(money);

        var label_money = new ccui.Text(this.Preprocessing_Money(this.objectConfig[globalnode].goldbet) , res.FONT_GAME_BOLD, 25);
        label_money.setColor(cc.color(237,240,181));
        label_money.setAnchorPoint(cc.p(0,0.5));
        label_money.x =75 ;
        label_money.y = sprite.height/2;
        sprite.addChild(label_money);

        var label_money_small = new ccui.Text(this.Preprocessing_Money(this.objectConfig[globalnode].goldmin) + " - "
            + this.Preprocessing_Money(this.objectConfig[globalnode].goldmax), res.FONT_GAME_BOLD, 25);
        label_money_small.setScale(1/2,1/2);
        label_money_small.setColor(cc.color(237,240,181));
        label_money_small.setAnchorPoint(cc.p(1,1/2));
        label_money_small.x =sprite.width-50 ;
        label_money_small.y = sprite.height/2 - icon.height/2 - 5;
        sprite.addChild(label_money_small);

        var moneysmall = fr.createSprite(constant_view.MONEY_UNLIGHT);
        moneysmall.setScale(3/4,3/4);
        moneysmall.setAnchorPoint(1,1/2);
        moneysmall.setPosition(sprite.width - 15,sprite.height/2 - icon.height/2  );
        sprite.addChild(moneysmall);

        var lockdisable = fr.createSprite(constant_view.LOCK_DISABLE);
        lockdisable.setAnchorPoint(1,0);
        lockdisable.setPosition(sprite.width - 10,sprite.height/2-5 );
        sprite.addChild(lockdisable);

        return sprite;
    },

    scrollViewDidScroll:function (view) {
    },

    scrollViewDidZoom:function (view) {
    },

    numberOfCellsInTableView:function (table) {
        return this.numbercell;
    }

});