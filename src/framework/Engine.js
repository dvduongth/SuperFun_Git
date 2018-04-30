/**
 * Created by user on 21/10/2015.
 */

var Engine = cc.Class.extend({
    init: function(){
        fr.Sound.loadSetting();

        gv.WIN_SIZE = cc.winSize;
        gv.SCALE_BUTTON = -0.05;

        gv.mainScene = new cc.Scene();
        cc.director.runScene(gv.mainScene);

        gv.layerMgr = new LayerMgr();
        gv.layerMgr.addLayers(gv.mainScene);

        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();

        gv.socialMgr.init();

        gv.gameDelegate = new GameDelegate();


        gv.guiMgr = new GuiMgr();

        //gv.eventMgr = new EventMgr();

        cc.spriteFrameCache.addSpriteFrames(resImg.login_pack);
        gv.guiMgr.addGui(new GuiLogin(), GuiId.LOGIN, LayerId.LAYER_GUI);
        gv.guiMgr.addGui(new GuiLoading(), GuiId.LOADING, LayerId.LAYER_GUI);

        //gv.guiMgr.addGui(new GuiDetailInfo(), GuiId.DETAIL_INFO, LayerId.LAYER_LOADING);

        //gv.guiMgr.addGui(new PopupGiftCongrats(fr.Localization.text("Paying_card_success_congrats"), [new GiftData(GiftType.GOLD, 10000), new GiftData(GiftType.GOLD, 10000)]), GuiId.POPUP_GIFT_CONGRATS, LayerId.LAYER_POPUP);
    }
});