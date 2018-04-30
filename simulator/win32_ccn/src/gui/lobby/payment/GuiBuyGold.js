/**
 * Created by user on 30/3/2016.
 */

var GuiBuyGold = BaseGui.extend({

    goldDataCount: 0,

    GOLD_TABLE_SIZE: cc.size(275*3.1, 249),
    GOLD_TABLE_CELL_SIZE: cc.size(275, 249),

    ctor: function(){
        this._super(res.ZCSD_GUI_BUY_GOLD);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");

        var closeBtn = this._rootNode.getChildByName("close_btn");
        closeBtn.addClickEventListener(function(){
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        this.goldDataCount = GoldPackConfig.getInstance().getGoldPackCount();
        this.table = new cc.TableView(this, this.GOLD_TABLE_SIZE);
        this.table.setPosition(10, -9);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this.table.setDelegate(this);
        this.bg.getChildByName("payment_slot").addChild(this.table);
        this.table.reloadData();

        this.loadSMSGoldPack();
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();

        var background, goldPackImage, goldLabel, gLabel;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite("res/lobby/version2/payment/payment_cell_bg.png");
            background.setPosition(cellSize.width/2, cellSize.height/2);
            background.setTag(1);
            cell.addChild(background);

            goldPackImage = new cc.Sprite();
            goldPackImage.setPosition(background.getContentSize().width/2, background.getContentSize().height/2);
            goldPackImage.setScale(1.2);
            goldPackImage.setTag(1);
            background.addChild(goldPackImage);

            goldLabel = new ccui.Text("", res.FONT_GAME_BOLD, 24);
            goldLabel.setPosition(background.getContentSize().width/2-10, background.getContentSize().height-45);
            goldLabel.setRotation(-12);
            goldLabel.enableShadow(cc.color("#000000"), cc.size(0, -1));
            goldLabel.enableOutline(cc.color("#000000"), 1);
            goldLabel.setTag(2);
            background.addChild(goldLabel);

            gLabel = new ccui.Text("", res.FONT_GAME_BOLD, 24);
            gLabel.setPosition(background.getContentSize().width/2-10, 40);
            gLabel.enableShadow(cc.color("#000000"), cc.size(0, -1));
            gLabel.enableOutline(cc.color("#000000"), 1);
            gLabel.setTag(3);
            background.addChild(gLabel);

            //var goldIcon = fr.createSprite("gold_icon.png");
            //goldIcon.setPosition(background.getContentSize().width-55, goldLabel.getPositionY()-2);
            //background.addChild(goldIcon);

            var gIcon = fr.createSprite("res/lobby/g_icon.png");
            gIcon.setPosition(background.getContentSize().width-90, gLabel.getPositionY()+1);
            background.addChild(gIcon);
        }

        var packData = GoldPackConfig.getInstance().getGoldPackDataByIndex(idx+1);

        background = cell.getChildByTag(1);

        goldPackImage = background.getChildByTag(1);
        fr.changeSprite(goldPackImage, "gift_gold_" + (idx+1)+".png");

        goldLabel = background.getChildByTag(2);
        goldLabel.setString("+" + StringUtil.normalizeNumber(packData.gold));

        gLabel = background.getChildByTag(3);
        gLabel.setString(StringUtil.normalizeNumber(packData.cost));

        return cell;
    },

    tableCellTouched:function (table, cell) {
        var goldPackIdx = cell.getIdx()+1;
        var packData = GoldPackConfig.getInstance().getGoldPackDataByIndex(goldPackIdx);
        if (UserData.getInstance().xu < packData.cost){
            gv.guiMgr.addGui(new GuiNotEnoughG(), GuiId.NOT_ENOUGH_G, LayerId.LAYER_GUI);
        }
        else{
            gv.guiMgr.addGui(new GuiBuyGoldByGConfirm(goldPackIdx), GuiId.BUY_GOLD_BY_G_CONFIRM, LayerId.LAYER_GUI);
        }
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.GOLD_TABLE_CELL_SIZE;
    },

    numberOfCellsInTableView:function (table) {
        return this.goldDataCount;
    },

    loadSMSGoldPack: function(){
        var goldPackCf = GoldPackConfig.getInstance();
        for (var i=1; i<=goldPackCf.getSMSPackCount(); i++){
            var goldPackData = goldPackCf.getZaloSMSGoldPackDataByIndex(i);
            var smsBtn = this.bg.getChildByName("btn_sms_"+i);
            smsBtn.addClickEventListener(this.onSMSGoldPackBtnClick.bind(this, i));

            var goldLabel = smsBtn.getChildByName("gold");
            //goldLabel.setColor(GameUtil.getRGBColorForGold());
            goldLabel.setString(StringUtil.normalizeNumber(goldPackData.gold));

            var costLabel = smsBtn.getChildByName("cost");
            //costLabel.setColor(GameUtil.getRGBColorForVND());
            costLabel.setString(StringUtil.normalizeNumber(goldPackData.cost) + " vnd");
        }
    },

    onSMSGoldPackBtnClick: function(packIndex){
        if (CheatConfig.PAYMENT){
            gv.guiMgr.addGui(new GuiCheatPayment(CheatPaymentType.GOLD_SMS), GuiId.CHEAT_PAYMENT, LayerId.LAYER_GUI);
        }
        else{
            var mount = GoldPackConfig.getInstance().getZaloSMSGoldPackDataByIndex(packIndex).cost;
            fr.zalo.purchaseSMS(mount, UserData.getInstance().uid, UserData.getInstance().userName);
        }
    }
});