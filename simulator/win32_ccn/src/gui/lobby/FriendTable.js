/**
 * Created by user on 22/1/2016.
 */
//color 255,255,0
var FriendTableType = {
    MY_FRIEND: true,
    WORLD: false
};

var FriendTable = BaseGui.extend({

    FRIEND_TABLE_SIZE: cc.size(425, 79*3),
    FRIEND_TABLE_CELL_SIZE: cc.size(400, 68),

    DISPLAY_NAME_COLOR: cc.color(159,226, 255),
    FIRST_DISPLAY_NAME_COLOR: cc.color(205, 112, 55),
    GOLD_COLOR: cc.color(146, 172, 1),
    FIRST_GOLD_COLOR: cc.color(210, 85, 3),

    table: null,
    tableType: false,
    globalPlayer:[],
    indexListTable:0,

    ctor: function(){
        this._super(res.ZCSD_NODE_FRIEND_TABLE);

        var tableBg = this._rootNode.getChildByName("friend_table_bg");

        this.tableType = FriendTableType.WORLD;
        this.friendBtn = tableBg.getChildByName("btn_table_friend");
        this.friendBtn.addClickEventListener(this.onTableTypeBtnClick.bind(this, FriendTableType.MY_FRIEND));
        this.friendBtn.setOpacity(this.tableType==FriendTableType.MY_FRIEND? 255: 150);
        this.friendBtn.setPressedActionEnabled(false);

        this.worldBtn = tableBg.getChildByName("btn_table_world");
        this.worldBtn.addClickEventListener(this.onTableTypeBtnClick.bind(this, FriendTableType.WORLD));
        this.worldBtn.setOpacity(this.tableType==FriendTableType.WORLD? 255: 150);
        this.worldBtn.setPressedActionEnabled(false);

        //this.titleTable = tableBg.getChildByName("title_table");
        gv.gameClient.sendGetGlobalRank(this.indexListTable);

        this.table = new cc.TableView(this, this.FRIEND_TABLE_SIZE);
        this.table.setPosition(-tableBg.getContentSize().width/2+22, -tableBg.getContentSize().height/2 + this.FRIEND_TABLE_CELL_SIZE.height/2-15);
        this.table.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.table.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.table.setDelegate(this);
        this.addChild(this.table);
        this.loadPlayerInfo();

        NotificationHandler.getInstance().addHandler(NotificationHandlerId.UPDATE_MAIL_DATA, this.reloadMail.bind(this));
    },

    onTableTypeBtnClick: function(type){
        this.tableType = type;

        this.worldBtn.loadTextureNormal(this.tableType==FriendTableType.WORLD?
            "res/lobby/bxh_type_1_1.png":"res/lobby/bxh_type_1_2.png", ccui.Widget.LOCAL_TEXTURE);
        this.worldBtn.setPositionX(this.tableType==FriendTableType.WORLD ? 117.93 : 119.93);
        this.worldBtn.setPositionY(this.tableType==FriendTableType.WORLD ? 357.06 : 359.06);
        this.worldBtn.setOpacity(this.tableType==FriendTableType.WORLD? 255: 150);

        this.friendBtn.loadTextureNormal(this.tableType==FriendTableType.MY_FRIEND?
            "res/lobby/bxh_type_2_1.png":"res/lobby/bxh_type_2_2.png", ccui.Widget.LOCAL_TEXTURE);
        this.friendBtn.setPositionX(this.tableType==FriendTableType.MY_FRIEND ? 311.99 : 312.99);
        this.friendBtn.setPositionY(this.tableType==FriendTableType.MY_FRIEND ? 357.80 : 360.80);
        this.friendBtn.setOpacity(this.tableType==FriendTableType.MY_FRIEND? 255: 150);

        //fr.changeSprite(this.titleTable, this.tableType?"res/lobby/version2/text_bxh_banbe.png":"res/lobby/version2/text_bxh_caothu.png");
        if(this.tableType == FriendTableType.WORLD){
            this.indexListTable = 0;
            gv.gameClient.sendGetGlobalRank(this.indexListTable);
            //
        }else if(this.tableType == FriendTableType.MY_FRIEND){
            //CUONG friend rank:)
            fr.Social.getFriendList(gv.socialMgr.currentLoginType, true, this.onGetPlayedFriendsFromSocialResult.bind(this));
        }
        this.table.reloadData();
    },

    loadPlayerInfo: function(){
        var userData = UserData.getInstance();
        var tableBg = this._rootNode.getChildByName("friend_table_bg");

        this.playerInfoSlot = tableBg.getChildByName("my_info_slot");

        this.myRankNumber = this.playerInfoSlot.getChildByName("rank_number");

        var avatar = new fr.Avatar(userData.avatarUrl, AvatarShape.SQUARE);
        avatar.setScale(0.4);
        avatar.setPosition(100, this.playerInfoSlot.getContentSize().height/2);
        this.playerInfoSlot.addChild(avatar);

        var avatarBorder = fr.createSprite("res/lobby/avatar_border_orange.png");
        avatarBorder.setPosition(avatar.getPosition());
        this.playerInfoSlot.addChild(avatarBorder);

        var displayName = this.playerInfoSlot.getChildByName("my_name");
        displayName.setString(userData.displayName);

        var goldNumber = this.playerInfoSlot.getChildByName("my_gold");
        //goldNumber.setColor(GameUtil.getRGBColorForGold());
        goldNumber.setString(StringUtil.toMoneyString(userData.gold));

        this.mailBtn = this.playerInfoSlot.getChildByName("mailBtn");
        this.mailBtn.addClickEventListener(function(){
            gv.guiMgr.addGui(new GuiMail(), GuiId.MAIL, LayerId.LAYER_GUI);
        }.bind(this));
        this.mailBtn.setLocalZOrder(1);

        this.mailCountSlot = this.mailBtn.getChildByName("mail_count_slot");
        this.mailCountLabel = this.mailCountSlot.getChildByName("mail_count_label");
        this.reloadMail();
    },

    onGetPlayedFriendsFromSocialResult: function(errCode, friendList, socialTYpe){
        var socialPlayedFriendIds = [];
        for(var i=0; i< friendList.length; i++){
            socialPlayedFriendIds.push(friendList[i].social_id);
        }
        UserData.getInstance().socialPlayedFriendIds = socialPlayedFriendIds;

        gv.gameClient.sendGetFriendListData(socialPlayedFriendIds);
        NotificationHandler.getInstance().addHandler(NotificationHandlerId.GET_FRIEND_LIST_DATA, this.onGetPlayedFriendsFromServerResult.bind(this));
    },

    onGetPlayedFriendsFromServerResult: function(){
        var userData = UserData.getInstance();
        //this.globalPlayer = userData.friends;
        if(this.tableType){
            this.myRankNumber.setString((UserDataUtil.getRankIndexByUId(userData.uid)+1));
        }
        this.table.reloadData();
    },

    loadMoreFriends: function(){

    },

    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        var background, rankNumberSlot, rankNumber, avatar, displayName, goldNumber;
        if (!cell) {
            cell = new cc.TableViewCell();
            var cellSize = this.tableCellSizeForIndex(table, idx);

            background = fr.createSprite("res/lobby/friend_table_cell.png");
            background.setPosition(cellSize.width/2, cellSize.height/2);
            background.setTag(1);
            cell.addChild(background);

            rankNumberSlot = fr.createSprite("");
            rankNumberSlot.setPosition(35, cellSize.height/2);
            rankNumberSlot.setTag(2);
            cell.addChild(rankNumberSlot);

            rankNumber = new ccui.Text("", res.FONT_GAME_BOLD, 20);
            rankNumber.setPosition(20, 26);
            rankNumber.setTag(999);
            rankNumberSlot.addChild(rankNumber);

            avatar = new fr.Avatar("", AvatarShape.SQUARE);
            avatar.setScale(0.4);
            avatar.setPosition(95, cellSize.height/2);
            avatar.setTag(3);
            cell.addChild(avatar);

            var avatarBorder = fr.createSprite("res/lobby/avatar_border_blue.png");
            avatarBorder.setPosition(avatar.getPosition());
            cell.addChild(avatarBorder);

            displayName = new ccui.Text("", res.FONT_GAME_BOLD, 22);
            displayName.setAnchorPoint(0, 0.5);
            displayName.setPosition(avatar.getPositionX() + 54, avatar.getPositionY()+15);
            displayName.setTag(4);
            cell.addChild(displayName);

            goldNumber = ccui.Text("",res.FONT_GAME_BOLD, 24);
            goldNumber.setAnchorPoint(0, 0.5);
            goldNumber.setColor(GameUtil.getRGBColorForGold());
            goldNumber.setPosition(displayName, avatar.getPositionY()-12);
            goldNumber.setTag(5);
            cell.addChild(goldNumber);
        }

        if(!this.tableType){
            //cuong Global table;
            if(this.globalPlayer.length>0){
                var globalPlayer = this.globalPlayer[idx];

                rankNumberSlot = cell.getChildByTag(2);
                fr.changeSprite(rankNumberSlot, "res/lobby/friend_table_index_" + (idx<=2?(idx+1):4) + ".png");

                rankNumber = rankNumberSlot.getChildByTag(999);
                rankNumber.setString(idx+1);
                rankNumber.setVisible(idx>2);

                avatar = cell.getChildByTag(3);
                avatar.updateAvatar(globalPlayer.avatarUrl);

                displayName = cell.getChildByTag(4);
                displayName.setColor(this.DISPLAY_NAME_COLOR);
                //displayName.enableOutline(cc.color(0,0,0),4);
                //displayName.setScale(10);
                //displayName.setBlendFunc(gl.ONE,gl.ONE);
                displayName.setString(StringUtil.limitWordNumber(globalPlayer.displayName, 15));

                goldNumber = cell.getChildByTag(5);
                goldNumber.setColor(idx==0?this.FIRST_GOLD_COLOR: this.GOLD_COLOR);
                goldNumber.setString(globalPlayer.score);
            }
        }else{
            //Cuong friend table :)

            var userData = UserData.getInstance();
            if(userData.friends.length>0){
                var curFriend = userData.friends[idx];

                rankNumberSlot = cell.getChildByTag(2);
                fr.changeSprite(rankNumberSlot, "res/lobby/friend_table_index_" + (idx<=2?(idx+1):4) + ".png");

                rankNumber = rankNumberSlot.getChildByTag(999);
                rankNumber.setString(idx+1);
                rankNumber.setVisible(idx>2);

                avatar = cell.getChildByTag(3);
                avatar.updateAvatar(curFriend.avatarUrl);

                var buttonThemBan = new ccui.Button();
                buttonThemBan.loadTextureNormal("res/lobby/bt_them_ban.png");
                //todo add click listener
                buttonThemBan.setPosition(125, cell.width/2+20);
                cell.addChild(buttonThemBan);

                displayName = cell.getChildByTag(4);
                displayName.setColor(this.DISPLAY_NAME_COLOR);
                displayName.setString(StringUtil.limitWordNumber(curFriend.displayName, 15));

                goldNumber = cell.getChildByTag(5);
                goldNumber.setString(curFriend.goldEarnInWeek);
                goldNumber.setString(StringUtil.toMoneyString(curFriend.goldEarnInWeek));
            }
        }
        return cell;
    },

    numberOfCellsInTableView:function (table) {

        if(!this.tableType){
            return this.globalPlayer.length;
        }else{
            return UserData.getInstance().friends.length;
        }
    },

    tableCellTouched:function (table, cell) {
    },

    tableCellSizeForIndex:function (table, idx) {
        return this.FRIEND_TABLE_CELL_SIZE;
    },

    reloadData: function(){
        if(this.tableType){
            for (var i=0; i<10; i++){
                UserData.getInstance().friends.push(UserDataUtil.createSelfFriendData());
            }

            var tmp = this.table.getContentOffset();
            tmp.y = -(this.numberOfCellsInTableView() - (this.numberOfCellsInTableView()-10)) * this.tableCellSizeForIndex().height + tmp.y;
            this.table.reloadData();
            if (UserData.getInstance().friends.length-1 > 0)
                this.table.setContentOffset(tmp);
        }
    },

    getGlobalMailBoxPosition: function(){
        return this.playerInfoSlot.convertToWorldSpace(this.mailBtn);
    },

    reloadMail: function(){
        var mailData = MailData.getInstance();
        this.mailCountLabel.setString(mailData.mailList.length);
        this.mailCountSlot.setVisible(mailData.mailList.length > 0);

        this.mailBtn.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.2),
            cc.scaleTo(0.2,1.0)
        ));
    }
});