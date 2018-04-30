/**
 * Created by user on 22/5/2016.
 */

var GuiInviteFriend = BaseGui.extend({

    INVITE_FRIEND_JSON_DATA_KEY: "",

    FRIEND_TABLE_SIZE: cc.size(334, 79*3.55),
    FRIEND_TABLE_CELL_SIZE: cc.size(334, 79),

    TIME_INVITE_AGAIN: 30,//s

    DISPLAY_NAME_NORMAL_COLOR: cc.color(0, 145, 178),
    DISPLAY_NAME_SELECTED_COLOR: cc.color(225, 90, 0),

    invitedList: null,
    friendList: null,
    friendCheckBoxList: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_INVITE_FRIEND);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);

        this.INVITE_FRIEND_JSON_DATA_KEY = "invited_friend_json_data_"+UserData.getInstance().uid;

        this.bg = this._rootNode.getChildByName("bg");
        var closeBtn = this.bg.getChildByName("btn_close");
        closeBtn.addClickEventListener(function(){
            this.destroy(DestroyEffects.ZOOM);
        }.bind(this));

        this.friendList = [];
        this.table = new cc.TableView(this, this.FRIEND_TABLE_SIZE);
        this.table.setPosition(573, 130);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.setDelegate(this);
        this.bg.addChild(this.table);

        var inviteFriendEventData = EventData.getInstance().getEventData(EventType.INVITE_FRIEND);
        this.invitedFriendNumberLb = this.bg.getChildByName("invited_friend_number");
        this.invitedFriendNumberLb.setString(StringUtil.normalizeNumber(inviteFriendEventData.numberInvitedFriend));

        this.loadGifts();

        var btnInvite = this.bg.getChildByName("btn_invite");
        btnInvite.addClickEventListener(this.onInviteFriendBtnClick.bind(this));

        var btnRefresh = this.bg.getChildByName("btn_refresh");
        btnRefresh.addClickEventListener(this.onRefreshBtnClick.bind(this));

        this.invitedList = [];
        var jsonData = fr.LocalStorage.getStringFromKey(this.INVITE_FRIEND_JSON_DATA_KEY, "");
        if (jsonData!=""){
            var jsonObj = JSON.parse(jsonData);
            for (var i=0; i<jsonObj.length; i++){
                this.invitedList.push({
                    social_id:jsonObj[i].social_id,
                    invited_time: jsonObj[i].invited_time
                });
            }
        }

        fr.Social.getFriendList(gv.socialMgr.currentLoginType, false, this.onGetFriendListResult.bind(this));
    },

    onGetFriendListResult: function(socialAction, friendList, socialType){
        if (socialAction == SOCIAL_ACTION.SUCCEED){
            this.friendList = friendList;

            //loai bo nhung friend da dc invite
            var curTime = GameUtil.getCurrentTime();
            for (var i=this.friendList.length-1; i>=0; i--){
                var friend = this.friendList[i];
                for (var j=this.invitedList.length-1; j>=0; j--){
                    if (friend.social_id == this.invitedList[j].social_id){
                        if (curTime-this.invitedList[j].invited_time<this.TIME_INVITE_AGAIN)
                            this.friendList.splice(i,1);
                        else
                            this.invitedList.splice(j,1);
                        break;
                    }
                }
            }

            var numberFriendCanInviteToday = this.getNumberFriendCanInviteToday();
            this.friendCheckBoxList = [];
            this.numberFriendCheckingBox = 0;
            for (var i=0; i<this.friendList.length; i++){
                this.friendCheckBoxList.push(i<numberFriendCanInviteToday);
                if (i<numberFriendCanInviteToday)
                    this.numberFriendCheckingBox++;
            }
            this.table.reloadData();
        }
    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();

        var background, avatar, displayName,checkbox;//, indexLb
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite("res/lobby/invite_friend/invite_friend_cell_normal.png");
            background.setPosition(cellSize.width/2, cellSize.height/2);
            background.setTag(1);
            cell.addChild(background);

            //indexLb = new ccui.Text("", res.FONT_UNICODE_VREVUE_TFF, 20);
            //indexLb.setPosition(30, background.getContentSize().height/2);
            //indexLb.setTag(0);
            //background.addChild(indexLb);

            avatar = new fr.Avatar("", AvatarShape.CIRCLE);
            avatar.setScale(0.62);
            avatar.setPosition(52, background.getContentSize().height/2);
            avatar.setTag(1);
            background.addChild(avatar);

            displayName = new ccui.Text("", res.FONT_GAME_BOLD, 20);
            displayName.setAnchorPoint(0, 0.5);
            displayName.setPosition(avatar.getPositionX() + 50, avatar.getPositionY());
            displayName.setTag(2);
            background.addChild(displayName);

            var checkbox = new ccui.CheckBox();
            checkbox.loadTextureBackGround("res/lobby/checkbox_bg.png", ccui.Widget.LOCAL_TEXTURE);
            checkbox.loadTextureFrontCross("res/lobby/checkbox_cross.png", ccui.Widget.LOCAL_TEXTURE);
            checkbox.setPosition(background.getContentSize().width-40, background.getContentSize().height/2);
            checkbox.setTag(3);
            background.addChild(checkbox);
        }
        var curFriend = this.friendList[idx];

        background = cell.getChildByTag(1);
        //indexLb = background.getChildByTag(0);
        avatar = background.getChildByTag(1);
        displayName = background.getChildByTag(2);
        checkbox = background.getChildByTag(3);

        fr.changeSprite(background, "res/lobby/invite_friend/invite_friend_cell_" + (this.friendCheckBoxList[idx]?"selected":"normal")+ ".png");

        //indexLb.setString(idx);
        avatar.updateAvatar(curFriend.avatar_url);
        displayName.setString(StringUtil.limitWordNumber(curFriend.name, 15));
        displayName.setColor(this.friendCheckBoxList[idx]? this.DISPLAY_NAME_SELECTED_COLOR: this.DISPLAY_NAME_NORMAL_COLOR);

        checkbox.setSelected(this.friendCheckBoxList[idx]);
        checkbox.addEventListener(function(idx){
            if (!this.friendCheckBoxList[idx]){
                if (this.getNumberFriendCanInviteToday()>this.numberFriendCheckingBox) {
                    this.friendCheckBoxList[idx] = true;
                    this.numberFriendCheckingBox++;
                }
                else{
                    checkbox.setSelected(false);
                    var notiText =  fr.Localization.text("invite_friend_over_invite_friend_per_day").replace("@Value", EventConfig.getInstance().getMaxFriendInvitationPerDay());
                    gv.guiMgr.addGui(new PopupNotification(notiText), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
                }
            }
            else{
                this.friendCheckBoxList[idx] = false;
                this.numberFriendCheckingBox--;
            }
            fr.changeSprite(background, "res/lobby/invite_friend/invite_friend_cell_" + (this.friendCheckBoxList[idx]?"selected":"normal")+ ".png");
            displayName.setColor(this.friendCheckBoxList[idx]? this.DISPLAY_NAME_SELECTED_COLOR: this.DISPLAY_NAME_NORMAL_COLOR);
        }.bind(this, idx));

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.friendList.length;
    },

    tableCellTouched:function (table, cell) {
        //var idx = cell.getIdx();
        //var background = cell.getChildByTag(1);
        //var displayName = background.getChildByTag(2);
        //
        //if (!this.friendCheckBoxList[idx]){
        //    if (this.getNumberFriendCanInviteToday()>this.numberFriendCheckingBox) {
        //        this.friendCheckBoxList[idx] = true;
        //        this.numberFriendCheckingBox++;
        //    }
        //    else{
        //        var notiText =  fr.Localization.text("invite_friend_over_invite_friend_per_day").replace("@Value", EventConfig.getInstance().getMaxFriendInvitationPerDay());
        //        gv.guiMgr.addGui(new PopupNotification(notiText), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        //    }
        //}
        //else{
        //    this.friendCheckBoxList[idx] = false;
        //    this.numberFriendCheckingBox--;
        //}
        //fr.changeSprite(background, "res/lobby/version2/invite_friend/invite_friend_cell_" + (this.friendCheckBoxList[idx]?"selected":"normal")+ ".png");
        //displayName.setColor(this.friendCheckBoxList[idx]? this.DISPLAY_NAME_SELECTED_COLOR: this.DISPLAY_NAME_NORMAL_COLOR);
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.FRIEND_TABLE_CELL_SIZE;
    },

    onInviteFriendBtnClick: function(){
        this.inviteIdList = [];
        for (var i=0; i<this.friendList.length; i++){
            if (this.friendCheckBoxList[i])
                this.inviteIdList.push(this.friendList[i].social_id)
        }
        if (this.inviteIdList.length == 0){
            gv.guiMgr.addGui(new PopupNotification(fr.Localization.text("invite_at_least_one")), GuiId.POPUP_NOTIFICATION, LayerId.LAYER_POPUP);
        }
        else{
            fr.Social.requestInviteMessage(gv.socialMgr.currentLoginType, this.inviteIdList, fr.Localization.text("request_invite_message"), this.onRequestInviteResult.bind(this));
        }
    },

    onRequestInviteResult: function(socialResult){
        if (socialResult == SOCIAL_ACTION.SUCCEED){

            var numberFriendInvited = this.inviteIdList.length;

            gv.gameClient.sendUpdateNumberInvitedFriend(numberFriendInvited);

            EventData.getInstance().getEventData(EventType.INVITE_FRIEND).numberInvitedFriend+=numberFriendInvited;
            EventData.getInstance().getEventData(EventType.INVITE_FRIEND).numberInvitedFriendToday+=numberFriendInvited;

            this.reloadAllData();
        }
    },

    reloadAllData: function(){
        var inviteFriendEventData = EventData.getInstance().getEventData(EventType.INVITE_FRIEND);
        this.invitedFriendNumberLb.setString(StringUtil.normalizeNumber(inviteFriendEventData.numberInvitedFriend));

        //reload gift state
        for (var i=1; i<=EventConfig.getInstance().getInviteFriendGiftNumber(); i++){
            this.loadGiftState(i);
        }

        for (var i=this.friendList.length-1; i>=0; i--){
            if (this.friendCheckBoxList[i]){

                this.invitedList.push({
                    social_id: this.friendList[i].social_id,
                    invited_time: GameUtil.getCurrentTime()
                });
                this.friendList.splice(i,1);
                this.friendCheckBoxList.splice(i,1);
                this.table.reloadData();
            }
        }
        this.numberFriendCheckingBox = 0;

        fr.LocalStorage.setStringFromKey(this.INVITE_FRIEND_JSON_DATA_KEY, JSON.stringify(this.invitedList));
    },

    loadGifts: function(){
        var eventCf = EventConfig.getInstance();
        var giftNumber = eventCf.getInviteFriendGiftNumber();
        for (var i=1; i<=giftNumber; i++){
            var gift = eventCf.getInviteFriendGiftDataByIndex(i);
            var giftSlot = this.bg.getChildByName("gift_slot_" + (i));
            var giftIcon = giftSlot.getChildByName("gift_icon");
            var giftText = giftSlot.getChildByName("gift_text");
            fr.changeSprite(giftIcon, GiftData.getGiftResourceByType(gift.type, gift.quantity));
            giftText.setColor(GiftData.getGiftTextColorByType(gift.type));

            switch (gift.type){
                case GiftType.GOLD:
                case GiftType.COIN:
                    giftText.setString(StringUtil.normalizeNumber(gift.quantity));
                    break;
                case GiftType.CHEST_1:
                case GiftType.CHEST_2:
                case GiftType.CHEST_3:
                    giftText.setString(fr.Localization.text(GiftData.getGiftNameByType(gift.type)));
                    var quantitySlot = fr.createSprite("res/lobby/quantity_slot.png");
                    quantitySlot.setPosition(20,20);
                    quantitySlot.setCascadeOpacityEnabled(true);
                    giftIcon.addChild((quantitySlot));
                    var quantityLb = ccui.Text("x"+ gift.quantity, res.FONT_UNICODE_VREVUE_TFF, 15);
                    quantityLb.setPosition(quantitySlot.getContentSize().width/2-3, quantitySlot.getContentSize().height/2+3);
                    quantitySlot.addChild(quantityLb);
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
            //var numberFriendLb = giftSlot.getChildByName("number_friend");
            //numberFriendLb.setString("+" + eventCf.getFriendNumberNeedForGift(i) + " " + fr.Localization.text("friend"));

            this.loadGiftState(i);
        }
    },

    loadGiftState: function(giftIndex){
        var inviteFriendData = EventData.getInstance().getEventData(EventType.INVITE_FRIEND);
        var eventCf = EventConfig.getInstance();
        var giftSlot = this.bg.getChildByName("gift_slot_" + (giftIndex));
        var giftNumberSlot = giftSlot.getChildByName("gift_number_slot");
        if (inviteFriendData.numberInvitedFriend<eventCf.getFriendNumberNeedForGift(giftIndex)){
            giftSlot.loadTextureNormal("res/lobby/invite_friend/invite_friend_gift_slot_1.png",ccui.Widget.LOCAL_TEXTURE);
            giftSlot.setTouchEnabled(false);
            giftNumberSlot.setVisible(true);
        }
        else{
            giftNumberSlot.setVisible(false);
            if (!inviteFriendData.invitedFriendClaimedMap[giftIndex]){
                giftSlot.loadTextureNormal("res/lobby/invite_friend/invite_friend_gift_slot_2.png",ccui.Widget.LOCAL_TEXTURE);
                giftSlot.setTouchEnabled(true);
                giftSlot.addClickEventListener(this.onReceiveGiftBtnClick.bind(this, giftIndex));
            }
            else{
                giftSlot.loadTextureNormal("res/lobby/invite_friend/invite_friend_gift_slot_1.png",ccui.Widget.LOCAL_TEXTURE);
                giftSlot.setTouchEnabled(false);

                var receivedIcon = fr.createSprite("res/lobby/gift_checked.png");
                receivedIcon.setPosition(giftSlot.getContentSize().width/2, giftSlot.getContentSize().height/2);
                receivedIcon.setTag(999);
                giftSlot.addChild(receivedIcon);
            }
        }
    },

    onReceiveGiftBtnClick: function(giftIndex){
        this.selectedGiftIndex = giftIndex;
        GuiUtil.showWaitingGui();
        gv.gameClient.sendInviteFriendClaim(giftIndex);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.INVITE_FRIEND_CLAIM, this.onReceiveGiftResult.bind(this));
    },

    onReceiveGiftResult: function(){
        GuiUtil.hideWaitingGui();
        NotificationHandler.getInstance().removeHandler(NotificationHandlerId.INVITE_FRIEND_CLAIM);

        EventData.getInstance().getEventData(EventType.INVITE_FRIEND).invitedFriendClaimedMap[this.selectedGiftIndex] = true;

        this.loadGiftState(this.selectedGiftIndex);
        var receivedIcon = this.bg.getChildByName("gift_slot_"+this.selectedGiftIndex).getChildByTag(999);
        receivedIcon.setScale(2.0);
        receivedIcon.runAction(cc.scaleTo(0.15, 1.0));
    },

    getNumberFriendCanInviteToday: function(){
        var maxFriendInvitationPerDay = EventConfig.getInstance().getMaxFriendInvitationPerDay();
        var numberInvitedFriendToday = EventData.getInstance().getEventData(EventType.INVITE_FRIEND).numberInvitedFriendToday;
        return Math.max(0, maxFriendInvitationPerDay-numberInvitedFriendToday);
    },

    onRefreshBtnClick: function(){
        fr.Social.getFriendList(gv.socialMgr.currentLoginType, false, this.onGetFriendListResult.bind(this));
    },
});