/**
 * Created by user on 1/4/2016.
 */

var GuiMail = BaseGui.extend({

    MAIL_TABLE_SIZE: cc.size(589, 105*3.92),
    MAIL_TABLE_CELL_SIZE: cc.size(589, 105),

    selectedIndex: -1,

    ctor: function(){
        this._super(res.ZCSD_GUI_MAIL);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);
        this.selectedIndex = -1;
        MailData.getInstance().reloadMailList();

        this.bg = this._rootNode.getChildByName("bg");

        var mailText = this.bg.getChildByName("mail_text");
        mailText.setString(fr.Localization.text("Mail box"));

        var closetBtn = this.bg.getChildByName("close_btn");
        closetBtn.addClickEventListener(function(){
            gv.guiMgr.getGuiById(GuiId.LOBBY).friendTable.reloadMail();
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        if (MailData.getInstance().mailList.length==0){
            var noMailText = ccui.Text(fr.Localization.text("No_mail"), res.FONT_GAME_BOLD, 30);
            noMailText.setPosition(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2);
            this.bg.addChild(noMailText);
        }
        else{
            this.table = new cc.TableView(this, this.MAIL_TABLE_SIZE);
            this.table.setPosition(27,30);
            this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
            this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
            this.table.setDelegate(this);
            this.bg.addChild(this.table);
        }
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();

        var background, itemImage, itemText, quantitySlot, quantityLb, subject, content, timeRemainLb, receiveBtn;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite("res/lobby/mail_slot.png");
            background.setPosition(cellSize.width/2, cellSize.height/2);
            background.setTag(1);
            cell.addChild(background);

            itemImage = fr.createSprite();
            itemImage.setTag(1);
            itemImage.setScale(0.6);
            itemImage.setPosition(60,55);
            background.addChild(itemImage);

            itemText = ccui.Text("", res.FONT_GAME_BOLD, 16);
            itemText.setTag(2);
            itemText.setPosition(itemImage.getPositionX(), 25);
            itemText.enableShadow(cc.color("#000000"), cc.size(0, -1));
            itemText.enableOutline(cc.color("#000000"), 1);
            background.addChild(itemText);

            quantitySlot = fr.createSprite("res/lobby/quantity_slot.png");
            quantitySlot.setTag(1);
            quantitySlot.setPosition(20,20);
            quantitySlot.setCascadeOpacityEnabled(true);
            itemImage.addChild((quantitySlot));

            var quantityLb = ccui.Text("", res.FONT_GAME_BOLD, 15);
            quantityLb.setTag(1);
            quantityLb.setPosition(quantitySlot.getContentSize().width/2-3, quantitySlot.getContentSize().height/2+4);
            quantitySlot.addChild(quantityLb);

            subject = ccui.Text("", res.FONT_GAME_BOLD, 19);
            subject.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            subject.setAnchorPoint(0, 0.5);
            subject.setColor(cc.color("feb16b"));
            subject.enableShadow(cc.color("#585e40"), cc.size(0, -2));
            subject.enableOutline(cc.color("#585e40"), 2);
            subject.setTag(3);
            subject.setPosition(130, background.getContentSize().height-18);
            background.addChild(subject);

            content = ccui.Text("", res.FONT_ARIAL, 20);
            content.setTag(4);
            content.textAlign = cc.TEXT_ALIGNMENT_LEFT;
            content.setAnchorPoint(0, 0.5);
            content.setPosition(subject.getPositionX(), background.getContentSize().height/2-10);
            //content.setColor(cc.color("#7d451b"));
            background.addChild(content);

            receiveBtn = fr.createSimpleButton("res/button/btn_blue_0.png", ccui.Widget.LOCAL_TEXTURE);
            receiveBtn.setTag(6);
            receiveBtn.setPosition(background.getContentSize().width - 85, subject.getPositionY()-20);
            background.addChild(receiveBtn);

            var openMailText = ccui.Text(fr.Localization.text("open_mail"), res.FONT_GAME_BOLD, 22);
            openMailText.setPosition(receiveBtn.getContentSize().width/2, receiveBtn.getContentSize().height/2+2);
            openMailText.enableShadow(cc.color("##07344B"), cc.size(0,-2));
            openMailText.enableOutline(cc.color("##07344B"), 1);
            receiveBtn.addChild(openMailText);

            timeRemainLb = ccui.Text("Con: 3 ngay", res.FONT_ARIAL, 18);
            timeRemainLb.setTag(5);
            timeRemainLb.enableShadow(cc.color("#585e40"), cc.size(0, -2));
            timeRemainLb.enableOutline(cc.color("#585e40"), 2);
            timeRemainLb.setPosition(receiveBtn.getPositionX(), receiveBtn.getPositionY()-40);
            background.addChild(timeRemainLb);
        }

        var mailItem = MailData.getInstance().mailList[idx];

        background = cell.getChildByTag(1);
        itemImage = background.getChildByTag(1);
        itemText = background.getChildByTag(2);
        quantitySlot = itemImage.getChildByTag(1);
        quantityLb = quantitySlot.getChildByTag(1);
        subject = background.getChildByTag(3);
        content = background.getChildByTag(4);
        timeRemainLb = background.getChildByTag(5);
        receiveBtn = background.getChildByTag(6);

        fr.changeSprite(itemImage, GiftData.getGiftResourceByType(mailItem.itemID, mailItem.quantity));

        switch (mailItem.itemID){
            case GiftType.GOLD:
            case GiftType.COIN:
                itemText.setString(StringUtil.normalizeNumber(mailItem.quantity));
                quantitySlot.setVisible(false);
                break;
            case GiftType.CHEST_1:
            case GiftType.CHEST_2:
            case GiftType.CHEST_3:
                itemText.setString(fr.Localization.text(GiftData.getGiftNameByType(mailItem.itemID)));
                quantitySlot.setVisible(true);
                quantityLb.setString("x"+ mailItem.quantity);
                break;
            case GiftType.DICE_1:
            case GiftType.DICE_2:
            case GiftType.DICE_3:
            case GiftType.DICE_4:
            case GiftType.DICE_5:
            case GiftType.DICE_6:
                itemText.setString(fr.Localization.text(GiftData.getGiftNameByType(mailItem.itemID)));
                quantitySlot.setVisible(false);
                break;
        }
        //itemText.setColor(GiftData.getGiftTextColorByType(mailItem.itemID));

        subject.setString(StringUtil.limitWordNumber(fr.Localization.text(mailItem.subject), 24));
        content.setString(StringUtil.toStringWithLimitedWordPerLine(fr.Localization.text(mailItem.content), 25));

        var timeRemain = mailItem.expired - GameUtil.getCurrentTime();
        if (timeRemain>86400)
            timeRemainLb.setString(fr.Localization.text("remain") + ": " + Math.floor(timeRemain/86400)+ " " + fr.Localization.text("day"));
        else if (timeRemain>3600)
            timeRemainLb.setString(fr.Localization.text("remain") + ": " + Math.floor(timeRemain/3600)+ " " + fr.Localization.text("hour"));
        else if (timeRemain>60)
            timeRemainLb.setString(fr.Localization.text("remain") + ": " + Math.floor(timeRemain/60)+ " " + fr.Localization.text("minute"));
        else
            timeRemainLb.setString(fr.Localization.text("remain") + ": " + Math.floor(timeRemain)+ " " + fr.Localization.text("seconds"));

        receiveBtn.addClickEventListener(this.onReceiveBtnClick.bind(this, idx));
        return cell;
    },

    onReceiveBtnClick: function(idx){
        this.selectedIndex = idx;
        GuiUtil.showWaitingGui();
        gv.gameClient.sendReceiveMailItem(MailData.getInstance().mailList[idx].uid);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.RECEIVE_MAIL_ITEM, this.onReceiveMailItemResult.bind(this));
    },

    onReceiveMailItemResult: function(receiveMailItemPk){
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.RECEIVE_MAIL_ITEM);

        MailData.getInstance().removeMailItemAtIndex(this.selectedIndex);
        GuiUtil.hideWaitingGui();

        this.table.reloadData();

        if (MailData.getInstance().mailList.length==0){
            var noMailText = ccui.Text(fr.Localization.text("No_mail"), res.FONT_GAME_BOLD, 30);
            noMailText.setPosition(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2);
            this.bg.addChild(noMailText);
        }
    },

    numberOfCellsInTableView:function (table) {
        return MailData.getInstance().mailList.length;
    },

    tableCellTouched:function (table, cell) {
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.MAIL_TABLE_CELL_SIZE;
    },

});