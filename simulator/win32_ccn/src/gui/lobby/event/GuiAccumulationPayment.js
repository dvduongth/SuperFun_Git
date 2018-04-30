/**
 * Created by user on 30/3/2016.
 */

var GuiAccumulationPayment = BaseGui.extend({

    milestoneList: [],
    priorityGift: -1,
    eventData: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_ACCUMULATION_PAYMENT);
        this.setFog(false);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.milestoneList = [0];

        var eventCf = EventConfig.getInstance();
        for (var i=1; i<=eventCf.getPayingAccumulateGiftNumber(); i++){
            this.milestoneList.push(eventCf.getPayingAccumulateVNDRequireByIndex(i));        }
        this.eventData = EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE);
        this.totalGross = this.eventData.totalGross;
        //cc.log("sfsfsd",this.totalGross);
    },

    onEnter: function(){
        this._super();

        this.setFog(true);

        this.bg = this._rootNode.getChildByName("bg");
        this.imgRewardsUpArrows = this.bg.getChildByName("imgRewardsUpArrows");
        this.lbRequireStep1 = this.bg.getChildByName("lbRequireStep1");
        this.lbRequireStep2 = this.bg.getChildByName("lbRequireStep2");
        this.lbRequireStep3 = this.bg.getChildByName("lbRequireStep3");
        this.lbRequireStep4 = this.bg.getChildByName("lbRequireStep4");
        this.lbRequireStep5 = this.bg.getChildByName("lbRequireStep5");

        this.lbRequireStep1.setLocalZOrder(2);
        this.lbRequireStep2.setLocalZOrder(2);
        this.lbRequireStep3.setLocalZOrder(2);
        this.lbRequireStep4.setLocalZOrder(2);
        this.lbRequireStep5.setLocalZOrder(2);
        this.imgRewardsUpArrows.setLocalZOrder(2);

        for (var i=1; i<this.milestoneList.length; i++){
            this["lbRequireStep"+i].setString(StringUtil.toMoneyString(this.milestoneList[i]));
        }
        //cc.log(fr.Localization.text("Accumulate_description"));
        this.description = CustomRichText.create(fr.Localization.text("Accumulate_description"), cc.size(900,80), res.FONT_GAME_BOLD);
        this.description.setPosition(483.00,457.71);
        this.description.setDefaultSize(35);
        this.bg.addChild(this.description);

        var closeBtn = this.bg.getChildByName("close_btn");
        closeBtn.addClickEventListener(function(){
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        this.receiveBtn = this.bg.getChildByName("btn_receive");
        this.receiveBtn.setLocalZOrder(2);
        this.receiveBtn.addClickEventListener(this.onReceiveBtnClick.bind(this));

        this.progressTimer = new cc.ProgressTimer(fr.createSprite("res/lobby/event/accumulatePayment/accumulate_gross_progress.png"));
        this.progressTimer.setPosition(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2+5);
        this.progressTimer.barChangeRate = cc.p(1, 0);
        this.progressTimer.midPoint = cc.p(0, 0);
        this.progressTimer.type = cc.ProgressTimer.TYPE_BAR;
        this.progressTimer.setLocalZOrder(1);
        this.bg.addChild(this.progressTimer);

        this.totalGross = EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).totalGross;

        //this.totalGross = 290000;
        var progressSlot = this.bg.getChildByName("progress_slot");
        progressSlot.setLocalZOrder(1);
        progressSlot.setVisible(false);

        this.flag = this.bg.getChildByName("flag");
        this.flag.setLocalZOrder(10);

        this.infoBtn = this.bg.getChildByName("btn_info");
        this.infoBtn.addTouchEventListener(this.onInfoBtnTouch, this);

        this.reloadAllInfo();
    },

    reloadAllInfo: function(){
        var index = this.milestoneList.length-1;
        var maxMoney = this.milestoneList[this.milestoneList.length-1];
        for (var i=0; i<=this.milestoneList.length-1; i++){
            if (this.milestoneList[i]>this.totalGross){
                index = i-1;
                break;
            }
        }

        var duration = 0.5;
        var fromPercentage = 0;
        var toPercentage = (index/(this.milestoneList.length-1))*100;
        if (index<this.milestoneList.length-1)
            toPercentage += ((this.totalGross-this.milestoneList[index])/(this.milestoneList[index+1]-this.milestoneList[index]))/(this.milestoneList.length-1)*100;

        this.progressTimer.runAction(cc.progressFromTo(duration, fromPercentage, toPercentage));

        var moveLength = Math.min(toPercentage/100* this.progressTimer.getContentSize().width, this.progressTimer.getContentSize().width-5);
        moveLength = Math.max(moveLength, 1);

        this.flag.x = 30;

        this.flag.runAction(cc.moveBy(duration, moveLength, 0));
        this.totalGrossLabel = this.flag.getChildByName("total_gross_label");
        this.totalGrossLabel.setString(StringUtil.toMoneyString(Math.min(this.totalGross,maxMoney)));

        this.priorityGift = -1;
        this.receiveBtn.setVisible(false);

        for (var i=1; i<=EventConfig.getInstance().getPayingAccumulateGiftNumber(); i++){
            var giftBtn = this.bg.getChildByName("btn_gift_"+i);
            giftBtn.setTag(i);
            giftBtn.setLocalZOrder(1);

            //create giftAvailable
            var giftAvaiBg = this.bg.getChildByTag(1000+i);
            if (!giftAvaiBg){
                giftAvaiBg = fr.createSprite("res/lobby/event/accumulatePayment/accumulate_gift_available_bg.png");
                giftAvaiBg.setPosition(giftBtn.getPositionX(), 153.66);
                giftAvaiBg.setTag(1000 + i);
                this.bg.addChild(giftAvaiBg);
            }
            giftAvaiBg.setVisible(false);

            //create label received
            var receivedLb = this.bg.getChildByName("label_receive_"+i);
            if (!receivedLb){
                receivedLb = fr.createSprite("res/localize/gift_checked.png");
                receivedLb.setPosition(giftBtn.getPosition());
                receivedLb.setName("label_receive_"+i);
                this.bg.addChild(receivedLb,1);
            }
            receivedLb.setVisible(false);

            giftBtn.stopAllActions();

            if (this.totalGross>=this.milestoneList[i]){//du dieu kien nap tien nhan qua
                if (!EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).payingMileStoneMap[i]){//not received
                    giftAvaiBg.setVisible(true);

                    giftBtn.runAction(cc.sequence(
                        cc.scaleTo(1.0, 1.1),
                        cc.scaleTo(1.0, 0.9)
                    ).repeatForever());

                    if (this.priorityGift == -1){//chi duoc nhan qua dau tien thoa man dieu kien
                        this.receiveBtn.setVisible(true);
                        this.receiveBtn.setPositionX(giftBtn.getPositionX());
                        this.priorityGift = i;
                    }
                }
                else{//received
                    receivedLb.setVisible(true);
                }
            }
            giftBtn.addTouchEventListener(this.onGiftBtnTouch, this);
        }
    },

    checkGiftAvailable: function(giftIndex){

        return ((this.totalGross>=this.milestoneList[giftIndex]) && (!EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).payingMileStoneMap[giftIndex]));
        //return ((giftIndex<this.milestoneList.length) && (this.totalGross>=this.milestoneList[giftIndex]));
    },

    onGiftBtnTouch : function(sender, type) {
        //cc.error("on touch " + sender.getTag() + " " + type);
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.showGifts(sender.getTag());
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                this.hideGifts();
                break;
        }
    },

    onReceiveBtnClick: function(){
        GuiUtil.showWaitingGui();
        gv.gameClient.sendPayingAccumulateClaim(this.priorityGift);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.PAYING_ACCUMULATE_CLAIM, this.onReceiveGiftResult.bind(this));
    },

    onReceiveGiftResult: function(){
        GuiUtil.hideWaitingGui();
        this.showPopupRecieveGift();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.PAYING_ACCUMULATE_CLAIM);
        EventData.getInstance().getEventData(EventType.PAYING_ACCUMULATE).payingMileStoneMap[this.priorityGift] = true;

        //ghi nhan qua nay da duoc nhan
        var curGift = this.bg.getChildByName("btn_gift_"+this.priorityGift);
        var giftAvaiBg = this.bg.getChildByTag(1000+this.priorityGift);
        if (giftAvaiBg)
            giftAvaiBg.setVisible(false);
        curGift.stopAllActions();

        var receivedLb = this.bg.getChildByName("label_receive_"+this.priorityGift);
        receivedLb.setVisible(true);
        receivedLb.setScale(2.0);
        receivedLb.runAction(cc.scaleTo(0.2, 1.0));

        //chuyen sang uu tien qua khac neu co
        this.priorityGift++;
        if (this.priorityGift<=EventConfig.getInstance().getPayingAccumulateGiftNumber()){
            if (this.checkGiftAvailable(this.priorityGift)){
                //neu con qua` va qua` do co the nhan duoc
                this.receiveBtn.setPositionX(this.bg.getChildByName("btn_gift_"+this.priorityGift).getPositionX());
            }
            else{
                this.priorityGift = -1;
                this.receiveBtn.setVisible(false);
            }
        }
        else{//xoay vong lai, nhan gift o vong sau
            //this.resetGifts();
            this.priorityGift = -1;
            this.receiveBtn.setVisible(false);
        }

        if(gv.guiMgr.getGuiById(GuiId.LOBBY)) {
            gv.guiMgr.getGuiById(GuiId.LOBBY).updateStateAlertPayment();
        }

        if(gv.guiMgr.getGuiById(GuiId.GUI_SHOP)) {
            gv.guiMgr.getGuiById(GuiId.GUI_SHOP).updateAlertAccumulate();
        }

        if(gv.guiMgr.getGuiById(GuiId.GUI_SHOP_BUY_GOLD)) {
            gv.guiMgr.getGuiById(GuiId.GUI_SHOP_BUY_GOLD).updateAlertAccumulate();
        }
    },

    resetGifts: function(){
        var maxPayingAccumulateVNDRequire = this.milestoneList[EventConfig.getInstance().getPayingAccumulateGiftNumber()];
        if (this.eventData.totalGross >= maxPayingAccumulateVNDRequire)
            this.eventData.totalGross-=maxPayingAccumulateVNDRequire;
        this.totalGross = this.eventData.totalGross;

        for (var i=1; i<=EventConfig.getInstance().getPayingAccumulateGiftNumber(); i++){
            this.eventData.payingMileStoneMap[i] = false;
        }
        this.reloadAllInfo();
    },

    showGifts: function(index){
        if(!this.rewardBg) {
            this.rewardBg = fr.createSprite("res/lobby/event/accumulatePayment/accumulate_rewards_slot.png");
            this._rootNode.addChild(this.rewardBg,1);

            var title = ccui.Text(fr.Localization.text("reward_info"), res.FONT_GAME_BOLD, 25);
            title.setPosition(this.rewardBg.getContentSize().width/2, this.rewardBg.getContentSize().height-25);
            this.rewardBg.addChild(title);
        }
        else {
            this.rewardBg.setVisible(true);
        }

        if (index<=EventConfig.getInstance().getPayingAccumulateGiftNumber()/2)
            this.rewardBg.setAnchorPoint(0,0);
        else
            this.rewardBg.setAnchorPoint(1,0);

        //this.rewardBg.setPosition(this.bg.getChildByName("btn_gift_"+index).getPosition());
        //this.bg.addChild(this.rewardBg,1);
        var btn = this.bg.getChildByName("btn_gift_" + index);
        var pos = this._rootNode.convertToNodeSpace(btn.getParent().convertToWorldSpace(btn.getPosition()));
        this.rewardBg.setPosition(pos);


        if(!this.listGiftImg) {
            this.listGiftImg = [];
        }

        var giftList = EventConfig.getInstance().getPayingAccumulateRewardListByIndex(index);

        for (var i=0; i<giftList.length; i++) {
            //var giftImage = GraphicSupporter.drawGift(giftList[i], "res/lobby/common_gift_slot.png");
            if(this.listGiftImg[i]) {
                this.listGiftImg[i].removeFromParent();
            }

            this.listGiftImg[i] = GraphicSupporter.drawGift(giftList[i], "res/lobby/event/accumulatePayment/slotGift.png");
            this.rewardBg.addChild(this.listGiftImg[i]);

            var dxChange = (this.rewardBg.getContentSize().width - giftList.length * this.listGiftImg[i].width)/(giftList.length+1);

            //giftImage.setScale(0.8);
            //giftImage.setPosition(this.rewardBg.getContentSize().width * (i + 0.5) / (giftList.length), this.rewardBg.getContentSize().height/2-10);
            this.listGiftImg[i].setPosition((i+1)*dxChange + (i+0.5)*this.listGiftImg[i].width, this.rewardBg.getContentSize().height/2-10);

        }
    },
    showPopupRecieveGift:function()
    {
        var index = this.priorityGift;
        var giftList = EventConfig.getInstance().getPayingAccumulateRewardListByIndex(index);
        var popupReceiveGif = new PopupReceiveGift(fr.Localization.text("Gift_congrats"), giftList);
        popupReceiveGif.activeActionMailMoveToLobby(false);
        gv.guiMgr.addGui(popupReceiveGif, GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP_ONE_BY_ONE);
    },

    hideGifts: function(){
        this.rewardBg.setVisible(false);
    },

    onInfoBtnTouch : function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.showInfo();
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                this.hideInfo();
                break;
        }
    },

    showInfo: function(){
        this.infoBg = fr.createSprite("res/lobby/event/accumulatePayment/accumulate_rewards_slot.png");
        this.infoBg.setAnchorPoint(1,0);
        //this.infoBg.setPosition(this.infoBtn.getPositionX(), this.infoBtn.getPositionY()+20);

        var pos = this._rootNode.convertToNodeSpace(this.infoBtn.getParent().convertToWorldSpace(this.infoBtn.getPosition()));
        this.infoBg.setPosition(pos.x,pos.y+20);

        this._rootNode.addChild(this.infoBg,1);

        var infoTitle = new ccui.Text(fr.Localization.text("Accumulate_info_title"), res.FONT_GAME_BOLD, 19);
        infoTitle.setPosition(this.infoBg.getContentSize().width/2, this.infoBg.getContentSize().height-30);
        infoTitle.setColor(cc.color(255,255,0));
        this.infoBg.addChild(infoTitle);

        var infoContent = new ccui.Text(fr.Localization.text("Accumulate_info_content"), res.FONT_GAME_BOLD, 16);
        infoContent.setPosition(this.infoBg.getContentSize().width/2, infoTitle.getPositionY()-50);
        infoContent.setAnchorPoint(0.5, 1);
        this.infoBg.addChild(infoContent);
    },

    hideInfo: function(){
        this.infoBg.removeFromParent();
    }
});