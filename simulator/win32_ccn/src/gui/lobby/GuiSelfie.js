/**
 * Created by user on 22/5/2016.
 */

var GuiSelfie = BaseGui.extend({

    SELFIE_GOLD_CONDITION_NUMBER: 20000,

    ctor: function(){
        this._super(res.ZCSD_GUI_SELFIE);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.bg = this._rootNode.getChildByName("bg");

        this.closeBtn =  this._rootNode.getChildByName("btn_close");
        this.closeBtn.addClickEventListener(this.destroy.bind(this, DestroyEffects.ZOOM));

        var characterSay = this.bg.getChildByName("character_say");
        characterSay.setString(fr.Localization.text(UserDataUtil.getMainCharData().id+"_character_selfie_say"));

        this.giftSlot = this._rootNode.getChildByName("gift_slot");
        this.btnShoot = this.giftSlot.getChildByName("btn_shoot");
        this.btnShoot.addClickEventListener(this.onSefieBtnClick.bind(this));

        this.loadMainCharacter();
        this.loadSelfieCondition();
        this.loadGift();
    },

    loadMainCharacter: function(){
        var mainCharData = UserDataUtil.getMainCharData();
        var mainCharSlot = this.bg.getChildByName("main_char_slot");

        var image = mainCharSlot.getChildByName("main_char_image");
        fr.changeSprite(image, mainCharData.id+"_model.png");

        var name = mainCharSlot.getChildByName("main_char_name");
        name.setString(fr.Localization.text("character_name_" + mainCharData.id));

        var starSlot = mainCharSlot.getChildByName("main_char_star_slot");
        starSlot.setCascadeOpacityEnabled(false);
        var starNumber = mainCharData.getStarFromLevel(mainCharData.level);
        for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++){
            var star = fr.createSprite(j<starNumber?"card_star_enable.png":"card_star_disable.png");
            star.setPosition(-30+(star.getContentSize().width+7) * j, starSlot.getContentSize().height/2+5);
            starSlot.addChild(star);
        }
    },

    loadSelfieCondition: function(){

        this.textTimeRemain = this.giftSlot.getChildByName("text_time_remain");
        this.timeRemainNumber = this.textTimeRemain.getChildByName("time_remain_number");

        var eventCf = EventConfig.getInstance();
        var currentTime = GameUtil.getCurrentTime();
        var lastTimeSelfie = EventData.getInstance().getEventData(EventType.SELFIE_CHARACTER).lastTimeSelfie;

        this.timeRemainSelfie = eventCf.getSelfieCoolDownTime()- (currentTime-lastTimeSelfie);

        if (this.timeRemainSelfie<=0){//selfie available
            this.btnShoot.setVisible(true);
            this.textTimeRemain.setVisible(false);
        }
        else{//selfie disable
            this.btnShoot.setVisible(false);
            this.textTimeRemain.setVisible(true);
            this.timeRemainNumber.setString(StringUtil.toStringTime(this.timeRemainSelfie));
            this.schedule(this.updateTimeRemain, 1);
        }
    },

    updateTimeRemain: function(dt){
        this.timeRemainSelfie--;
        if (this.timeRemainSelfie>0){
            this.timeRemainNumber.setString(StringUtil.toStringTime(this.timeRemainSelfie));
        }
        else{
            this.btnShoot.setVisible(true);
            this.textTimeRemain.setVisible(false);
            this.unschedule(this.updateTimeRemain);
        }
    },

    loadGift: function(){
        var selfieData = EventData.getInstance().getEventData(EventType.SELFIE_CHARACTER);
        var giftData;
        if (selfieData.numberClaimed == 0){
            giftData = EventConfig.getInstance().getSelfieFirstReward();
        }
        else{
            giftData = EventConfig.getInstance().getSelfieStandardReward();
        }
        if (this.gift){
            this.gift.removeFromParent();
        }
        this.gift = GraphicSupporter.drawGift(giftData,  "res/lobby/common_gift_slot.png");
        this.gift.setPosition(this.giftSlot.getContentSize().width/2,this.giftSlot.getContentSize().height/2-80);
        this.giftSlot.addChild(this.gift);
    },

    onSefieBtnClick: function(){
        this.giftSlot.setVisible(false);
        this.closeBtn.setVisible(false);
        fr.Social.captureAndSharePhoto(gv.socialMgr.currentLoginType, this.onSharePhotoResult.bind(this));
        this.giftSlot.setVisible(true);
        this.closeBtn.setVisible(true);
    },

    onSharePhotoResult: function(success){
        if (success){
            GuiUtil.showWaitingGui();
            gv.gameClient.sendSelfieCharacterClaim();
            NotificationHandler.getInstance().addHandler(NotificationHandlerId.SELFIE_CHARACTER_CLAIM, this.onSefieResult.bind(this));
        }
    },

    onSefieResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.SELFIE_CHARACTER_CLAIM);
        this.loadSelfieCondition();
        this.loadGift();

        //show success pop-up
        var selfieData = EventData.getInstance().getEventData(EventType.SELFIE_CHARACTER);
        if ((selfieData.numberClaimed == 1) || ((selfieData.numberClaimed > 1) && (UserData.getInstance().gold < this.SELFIE_GOLD_CONDITION_NUMBER))){
            gv.guiMgr.addGui(new PopupNotification(fr.Localization.text("share_success"), PopupNotificationSize.SMALL), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        }
        else{
            var text = fr.Localization.text("share_success_condition_false");
            text = text.replace("@Value", StringUtil.normalizeNumber(this.SELFIE_GOLD_CONDITION_NUMBER));
            gv.guiMgr.addGui(new PopupNotification(text, PopupNotificationSize.SMALL), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        }
    },

});