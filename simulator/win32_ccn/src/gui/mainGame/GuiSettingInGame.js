/**
 * Created by tuanda on 16/7/2015.
 */

var GuiSettingInGame = BaseGui.extend({

    isShow: false,

    ctor:function() {
        this._super(res.ZCSD_GUI_SETTING_IN_GAME);

        this.setPositionX(this.getPositionX()-200);
        this.setOpacity(100);

        var showBtn = this._rootNode.getChildByName('btn_show');
        showBtn.addClickEventListener(this.onShowBtnClick.bind(this));

        this.soundBtn = this._rootNode.getChildByName('btn_sound');
        this.soundBtn.addClickEventListener(this.onSoundBtnClick.bind(this));
        this.soundBtn.getChildByName("prevent_sound").setVisible(!fr.Sound.effectOn);
        this.soundBtn.getChildByName("label_sound").setString(fr.Localization.text(fr.Sound.effectOn? "turn_sound_off":"turn_sound_on"));

        this.musicBtn = this._rootNode.getChildByName('btn_music');
        this.musicBtn.addClickEventListener(this.onMusicBtnClick.bind(this));
        this.musicBtn.getChildByName("prevent_music").setVisible(!fr.Sound.musicOn);
        this.musicBtn.getChildByName("label_music").setString(fr.Localization.text(fr.Sound.musicOn? "turn_music_off":"turn_music_on"));

        this.leaveRoomBtn = this._rootNode.getChildByName("btn_leave_room");
        this.leaveRoomBtn.addClickEventListener(this.onLeaveRoomBtnClick.bind(this));
    },

    open: function(){
        this.isShow = true;
        this.runAction(cc.moveBy(0.5, 200, 0).easing(cc.easeBackOut()));
    },

    close: function(){
        this.isShow = false;
        this.runAction(cc.moveBy(0.5, -200, 0).easing(cc.easeBackOut()));
    },

    onShowBtnClick:function()
    {
        this.isShow = !this.isShow;
        if (this.isShow){
            this.open();
            this.setOpacity(255);
        }
        else{
            this.close();
            this.setOpacity(100);
        }
    },
    onSoundBtnClick: function(soundBtn){
        fr.Sound.setSound(!fr.Sound.effectOn);
        soundBtn.getChildByName("prevent_sound").setVisible(!fr.Sound.effectOn);
        this.soundBtn.getChildByName("label_sound").setString(fr.Localization.text(fr.Sound.effectOn? "turn_sound_off":"turn_sound_on"));
    },

    onMusicBtnClick: function(musicBtn){
        fr.Sound.setMusic(!fr.Sound.musicOn);
        musicBtn.getChildByName("prevent_music").setVisible(!fr.Sound.musicOn);
        this.soundBtn.getChildByName("label_music").setString(fr.Localization.text(fr.Sound.musicOn? "turn_music_off":"turn_music_on"));
    },

    setEnableLeaveRoom: function(enable){
        this.leaveRoomBtn.setVisible(enable);
    },

    onLeaveRoomBtnClick: function(){
        if (!gv.guiMgr.getGuiById(GuiId.REST_ROOM)){
            gv.gameClient.sendCheatWinner();
        }
        else{
            gv.gameClient.sendPlayerLeaveGame();
        }
    },
});