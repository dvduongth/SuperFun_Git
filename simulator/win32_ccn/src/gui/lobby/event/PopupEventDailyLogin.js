/**
 * Created by user on 31/3/2016.
 */

var PopupEventDailyLogin = BasePopupOneByOne.extend({

    eventData: null,
    MAX_NUMBER_GIFT: 15,

    ctor: function(allowReceive){
        this._super(res.ZCSD_POPUP_EVENT_DAILY_LOGIN);
        this.setFog(true);
        this.setDestroyWhenTouchOutOfBoundingBox(false);

        this.background = this._rootNode.getChildByName("background");
        this.background.setPositionY(cc.winSize.height + this.background.getContentSize().height/2);
        this.background.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.moveTo(0.4, cc.winSize.width/2, cc.winSize.height/2).easing(cc.easeBackOut())
        ));

        for(var i=1; i<=this.MAX_NUMBER_GIFT; i++) {
            this["btnDay" + i] = this.background.getChildByName("btnDay" + i);
            this["btnDay" + i].addClickEventListener(this.onReceiveBtnClick.bind(this, i));
            this["btnDay" + i].setLocalZOrder(i);
        }

        this.closeBtn = this.background.getChildByName("btnClose");
        this.closeBtn.addClickEventListener(this.closeEvent.bind(this));

        this.closeBtn.setVisible(!allowReceive);

        this.eventData = EventData.getInstance().getEventData(EventType.CONTINUOUS_LOGIN);

        this.effectCanReceive = fr.AnimationMgr.createAnimationById(resAniId.eff_button_daily_gift, this);
        this.effectCanReceive.getAnimation().gotoAndPlay("vienkhung",0,-1,0);
        this.effectCanReceive.setVisible(false);
        this.effectCanReceive.y += 2;
        this.effectCanReceive.width += 4;
        this.effectCanReceive.height += 4;
        this.background.addChild(this.effectCanReceive, 0);

        this.loadGift();
    },

    loadGift: function(){

        var eventCf = EventConfig.getInstance();

        this.effectCanReceive.setVisible(false);

        for (var i=1; i<=eventCf.getDayNumberOfDailyLoginEvent(); i++){
            var gift = eventCf.getDailyLoginGiftDataByDay(i);
            var giftIcon = this["btnDay" + i].getChildByName("iconGift");
            var giftText = this["btnDay" + i].getChildByName("lbValue");
            var imgReceived = this["btnDay" + i].getChildByName("imgReceived");

            fr.changeSprite(giftIcon, GiftData.getGiftResourceByType(gift.type, gift.quantity));
            giftIcon.setAnchorPoint(0.5, 0.5);
            giftIcon.y += (giftIcon.height >> 1);

            switch (gift.type){
                case GiftType.GOLD:
                case GiftType.COIN:
                    giftText.setString(StringUtil.normalizeNumber(gift.quantity));
                    break;
                case GiftType.CHEST_1:
                case GiftType.CHEST_2:
                case GiftType.CHEST_3:
                    giftText.setString("x"+ gift.quantity);
                    break;
                case GiftType.DICE_1:
                case GiftType.DICE_2:
                case GiftType.DICE_3:
                case GiftType.DICE_4:
                case GiftType.DICE_5:
                case GiftType.DICE_6:
                    giftText.setString(fr.Localization.text(GiftData.getGiftNameByType(gift.type)));
                    break;
            }

            if ((i<this.eventData.dayCanCheck) || ((i==this.eventData.dayCanCheck) && (this.eventData.isChecked))){
                imgReceived.setVisible(true);
                giftIcon.stopAllActions();
                giftIcon.setRotation(0);
                giftIcon.setOpacity(100);
                giftText.setOpacity(100);
                this["btnDay" + i].setTouchEnabled(false);
            }
            else if (i == this.eventData.dayCanCheck){
                imgReceived.setVisible(false);
                giftIcon.runAction(GameUtil.getShakingAction());
                giftIcon.setOpacity(255);
                giftText.setOpacity(255);
                this["btnDay" + i].setTouchEnabled(true);
                this.curGift = gift;
                this.effectCanReceive.setVisible(true);
                this.effectCanReceive.setPosition(this["btnDay" + i].getPosition());
            }
            else{
                imgReceived.setVisible(false);
                giftIcon.stopAllActions();
                giftIcon.setRotation(0);
                giftIcon.setOpacity(255);
                giftText.setOpacity(255);
                this["btnDay" + i].setTouchEnabled(false);
            }
        }
    },

    onReceiveBtnClick: function(index){
        this["btnDay" + index].setTouchEnabled(false);
        gv.gameClient.sendDailyCheckin();
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.RECEIVE_DAILY_LOGIN_GIFT, this.onReceiveGiftResult.bind(this));
    },

    onReceiveGiftResult: function(){

        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.RECEIVE_DAILY_LOGIN_GIFT);
        var giftChecked = this["btnDay" + this.eventData.dayCanCheck].getChildByName("imgReceived");
        giftChecked.setCascadeOpacityEnabled(true);
        giftChecked.setScale(3.0);
        giftChecked.setVisible(true);

        giftChecked.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.0),
            cc.delayTime(1.0),
            cc.callFunc(function(){
                this.background.runAction(cc.fadeOut(0.2));

                var giftIcon = fr.createSprite(GiftData.getGiftResourceByType(this.curGift.type, this.curGift.quantity));
                giftIcon.setPosition(this["btnDay" + this.eventData.dayCanCheck].convertToWorldSpace(giftChecked.getPosition()));
                this.addChild(giftIcon, 999);
                giftIcon.runAction(cc.sequence(
                    cc.delayTime(0.3),
                    cc.spawn(
                        cc.callFunc(function(){
                            this.fogLayer.setVisible(false);
                        }.bind(this)),
                        cc.moveTo(0.8, gv.guiMgr.getGuiById(GuiId.LOBBY).friendTable.getGlobalMailBoxPosition()).easing(cc.easeBackIn()),
                        cc.scaleTo(0.3, 0.5)
                    ),
                    cc.fadeOut(0.1),
                    cc.callFunc(function(){
                        this.destroy();
                    }.bind(this))
                ))
            }.bind(this))
        ))
    },

    closeEvent: function(){
        this.background.runAction(cc.sequence(
            cc.moveTo(0.4, cc.winSize.width/2, cc.winSize.height + this.background.getContentSize().height/2).easing(cc.easeBackIn()),
            cc.callFunc(function(){
                this.destroy();
            }.bind(this))
        ));
    },
});