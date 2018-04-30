/**
 * Created by user on 9/9/2015.
 */

/**
 * Created by user on 9/9/2015.
 */

var WiningType = {
    BANKRUPT: 0,
    COMPLETE_STABLE:1,
    COMPLETE_LIGHT:2
};
var constantView = {
    BACK_GROUNG_WIN:"res/game/guiwinlose/thang/1.png",
    BACK_GROUND_LOSE:"res/game/guiwinlose/thua/1.png",

    TEXT_WIN:"res/game/guiwinlose/thang/chienthang.png",
    TEXT_LOSE:"res/game/guiwinlose/thua/thua_font.png",

    HORSE_WIN:"res/game/guiwinlose/thang/ngua.png",
    HORSE_LOSE:"res/game/guiwinlose/thua/mhua.png",

    GOLD_IMAGE:"res/game/guiwinlose/thang/tien.png",
    LIGHT_IMAGE:"res/game/guiwinlose/thang/anh sang.png",
    STAR:"res/game/guiwinlose/thang/sao.png",
    SLOT:"res/game/guiwinlose/slot1.png",

    BUTTON_CT:"res/game/guiwinlose/BT_choi tiep.png",
    BUTTON_VS:"res/game/guiwinlose/BT_ve sanh.png",

    TEXT_VIEW:"Phần thưởng tương xứng!",
};

var GuiEndGame = BaseGui.extend({

    resultAni: null,

    ctor:function(isWin,winingType){
        this._super();
        this.setFog(true);

        this.winingType = winingType;
        if (isWin){
            this.resultAni = fr.AnimationMgr.createAnimationById(resAniId.eff_win);
            fr.Sound.playSoundEffect(resSound.g_victory);
        }
        else{
            this.resultAni = fr.AnimationMgr.createAnimationById(resAniId.eff_lose);
            fr.Sound.playSoundEffect(resSound.g_lose);
        }

        this.resultAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.resultAni.getAnimation().gotoAndPlay("run",-1,-1,1);
        this.resultAni.setCompleteListener(this.createGui.bind(this,1000000 ,isWin));
        this.addChild(this.resultAni);

        //
        //this.createGui(1000000,isWin);
    },

    Draw_Card_Player:function(playerIndex){
        var size = cc.winSize;
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
        var spriteCard =GraphicSupporter.drawCard(playerInfo.playerStatus.mainCharacter);
        spriteCard.setScale(0.45,0.45);
        spriteCard.setPosition(size.width/2-260,size.height/2-60);
        this.addChild(spriteCard,103);
    },

    createGui:function(gold,win){
        this.resultAni.removeFromParent();
        this.createBackground(gold,win);
        this.createGift();
        this.createButtonBack();
        this.Draw_Card_Player(0);
    },

    createBackground:function(gold,win){
        var size = cc.winSize;
        if(win){
            var x4 = fr.AnimationMgr.createAnimationById(resAniId.gui_result_win, this);
            x4.getAnimation().gotoAndPlay("nonloop", 0, -1, 1);
            x4.setPosition(size.width/2,size.height/2+170);
            this.addChild(x4);
        }else{
            var x4 = fr.AnimationMgr.createAnimationById(resAniId.gui_result_lose, this);
            x4.getAnimation().gotoAndPlay("run", 0, -1, 1);
            x4.setPosition(size.width/2,size.height/2+170);
            this.addChild(x4);
            //var sprite1 = fr.createSprite(win?constantView.BACK_GROUNG_WIN:constantView.BACK_GROUND_LOSE);
            //sprite1.setPosition(size.width/2,size.height/2+100);
            //this.addChild(sprite1,50);

            //var chienthang = fr.createSprite(win?constantView.TEXT_WIN:constantView.TEXT_LOSE);
            //chienthang.setPosition(size.width/2,size.height/2+235);
            //this.addChild(chienthang,100);
            //
            //// ve ben phai
            //this.createHorse(win?cc.p(size.width/2+230,size.height/2+200):cc.p(size.width/2+200,size.height/2+220),20,255,!win,
            //    win?constantView.HORSE_WIN:constantView.HORSE_LOSE);
            //this.createHorse(cc.p(size.width/2+280,size.height/2+180),19,150,!win,win?constantView.HORSE_WIN:constantView.HORSE_LOSE);
            //if(win){
            //    var goldSprite = fr.createSprite(constantView.GOLD_IMAGE);
            //    goldSprite.setPosition(size.width/2+230,size.height/2+210);
            //    this.addChild(goldSprite,21);
            //    var light = fr.createSprite(constantView.LIGHT_IMAGE);
            //    light.setPosition(size.width/2+280,size.height/2+180);
            //    this.addChild(light);
            //}
            //
            ////ve ben trai
            //this.createHorse(win?cc.p(size.width/2-230,size.height/2+200):cc.p(size.width/2-200,size.height/2+220),20,255,win,
            //    win?constantView.HORSE_WIN:constantView.HORSE_LOSE);
            //this.createHorse(cc.p(size.width/2-280,size.height/2+180),19,150,win,
            //    win?constantView.HORSE_WIN:constantView.HORSE_LOSE);
            //
            //
            //if(win){
            //    goldSprite = fr.createSprite(constantView.GOLD_IMAGE);
            //    goldSprite.setPosition(size.width/2-230,size.height/2+210);
            //    goldSprite.setScale(-1,1);
            //    this.addChild(goldSprite,21);
            //    light = fr.createSprite(constantView.LIGHT_IMAGE);
            //    light.setPosition(size.width/2-280,size.height/2+180);
            //    light.setScale(-1,1);
            //    this.addChild(light);
            //}
            //
            //
            ////ve sao
            //if(win){
            //    var star = fr.createSprite(constantView.STAR);
            //    star.setPosition(size.width/2,size.height/2+220);
            //    this.addChild(star,101);
            //}
        }
        //text

        var text = new ccui.Text(constantView.TEXT_VIEW,res.FONT_GAME_BOLD,30);
        text.setPosition(size.width/2+20,size.height/2+38);
        this.addChild(text);

        //money
        var money = this.Preprocessing_Money(gold);
        text = new ccui.Text(money,res.FONT_GAME_BOLD,60);
        text.setPosition(size.width/2,size.height/2+130);
        this.addChild(text,102);
    },

    createHorse:function(position,zOrder,opacity,flip,texture){
        var horse = fr.createSprite(texture);
        horse.setPosition(position);
        horse.setOpacity(opacity);
        this.addChild(horse,zOrder);
        if(flip){
            horse.setScale(-1,1);
        }

    },

    createGift:function(){
        var size = cc.winSize;
        var slot = fr.createSprite(constantView.SLOT);
        var fizSize = 50;
        slot.setPosition(size.width/2-slot.getContentSize().width/2+fizSize,size.height/2-65);
        this.addChild(slot);

        slot = fr.createSprite(constantView.SLOT);
        slot.setPosition(size.width/2-3*slot.getContentSize().width/2+fizSize,size.height/2-65);
        this.addChild(slot);

        slot = fr.createSprite(constantView.SLOT);
        slot.setPosition(size.width/2+3*slot.getContentSize().width/2+fizSize,size.height/2-65);
        this.addChild(slot);

        slot = fr.createSprite(constantView.SLOT);
        slot.setPosition(size.width/2+slot.getContentSize().width/2+fizSize,size.height/2-65);
        this.addChild(slot);
    },

    createButtonBack:function(){
        var size = cc.winSize;
        var buttonct = new ccui.Button();
        buttonct.loadTextureNormal(constantView.BUTTON_CT,ccui.Widget.LOCAL_TEXTURE);
        buttonct.setPosition(size.width/2+buttonct.getContentSize().width/2 + 40,size.height/2 - 230);
        buttonct.setScale(1.25);
        buttonct.addClickEventListener(this.onPlayAgainBtnClick.bind(this));
        this.addChild(buttonct);

        var buttonvs = new ccui.Button();
        buttonvs.loadTextureNormal(constantView.BUTTON_VS,ccui.Widget.LOCAL_TEXTURE);
        buttonvs.setPosition(size.width/2-buttonvs.getContentSize().width/2 - 40,size.height/2 - 230);
        buttonvs.addClickEventListener(this.onExitBtnClick.bind(this));
        this.addChild(buttonvs);
        buttonvs.setScale(1.25);
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

    onPlayAgainBtnClick: function(){
        gv.matchMng.cleanUpMatch();
        gv.gameClient.sendPlayInstantly(gv.matchMng.gameStatusObject.modeID, gv.matchMng.gameStatusObject.isBotMode, CheatConfig.MAP_INIT_CASE);
    },

    onExitBtnClick: function(){
        //this.destroy();
        //gv.guiMgr.addGui(new GuiEndGame(true), GuiId.END_GAME, LayerId.LAYER_GUI);
        gv.matchMng.leaveMatch();
    },

});

//var GuiEndGame = BaseGui.extend({
//
//    resultAni: null,
//
//    ctor: function (isWin) {
//        this._super();
//
//        this.setFog(true);
//
//        if (isWin){
//            this.resultAni = fr.AnimationMgr.createAnimationById(resAniId.eff_win);
//            fr.Sound.playSoundEffect(resSound.g_victory);
//        }
//        else{
//            this.resultAni = fr.AnimationMgr.createAnimationById(resAniId.eff_lose);
//            fr.Sound.playSoundEffect(resSound.g_lose);
//        }
//        this.resultAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
//        this.resultAni.getAnimation().gotoAndPlay("run",-1,-1,1);
//        this.resultAni.setCompleteListener(this.onAnimationFinish.bind(this, isWin));
//        this.addChild(this.resultAni);
//    },
//
//    onAnimationFinish: function(isWin){
//
//        this.resultAni.removeFromParent();
//
//        this.initJson(res.ZCSD_GUI_END_GAME);
//        this._centerNode = this._rootNode.getChildByName("center_node");
//
//        var playAgainBtn = this._centerNode.getChildByName("btn_playAgain");
//        playAgainBtn.addClickEventListener(this.onPlayAgainBtnClick.bind(this));
//
//        var exitBtn = this._centerNode.getChildByName("btn_exit");
//        exitBtn.addClickEventListener(this.onExitBtnClick.bind(this));
//
//        this.loadData(isWin);
//    },
//
//    loadData:function(isWin){
//        var mainSlot = this._centerNode.getChildByName("main_slot");
//        var ani = null;
//        if (isWin){
//            fr.changeSprite(mainSlot, "winner_slot.png");
//            ani = fr.AnimationMgr.createAnimationById(resAniId.win_eff_on_gui);
//            ani.setPosition(-16, 220);
//        }
//        else {
//            fr.changeSprite(mainSlot, "loser_slot.png");
//            ani = fr.AnimationMgr.createAnimationById(resAniId.lose_eff_on_gui);
//            ani.setPosition(0, 100);
//        }
//        ani.getAnimation().gotoAndPlay("run", 0, -1, 1);
//        this._centerNode.addChild(ani);
//
//        var moneyIcon = this._centerNode.getChildByName("money_icon");
//        moneyIcon.setLocalZOrder(1);
//
//        var moneyNumber = new NumberSprite(-14200, 3);
//        moneyNumber.setPosition(0, moneyIcon.getPositionY());
//        this._centerNode.addChild(moneyNumber, 1);
//    },
//
//    onPlayAgainBtnClick: function(){
//        gv.matchMng.cleanUpMatch();
//        gv.gameClient.sendPlayInstantly(gv.matchMng.gameStatusObject.modeID, gv.matchMng.gameStatusObject.isBotMode, CheatConfig.MAP_INIT_CASE);
//    },
//
//    onExitBtnClick: function(){
//        //this.destroy();
//        //gv.guiMgr.addGui(new GuiEndGame(true), GuiId.END_GAME, LayerId.LAYER_GUI);
//        gv.matchMng.leaveMatch();
//    },
//});