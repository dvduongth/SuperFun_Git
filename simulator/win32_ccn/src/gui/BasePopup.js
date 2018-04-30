/**
 * Created by user on 1/4/2016.
 */

var BasePopup = BaseGui.extend({

    ctor: function (jsonRes){
        this._super(jsonRes);
        this.setFog(true);
        this.setAppearEffect(AppearEffects.ZOOM);
        fr.Sound.playSoundEffect(resSound.m_pop_up_menu);
    },

    destroy: function(){
        this._super(DestroyEffects.ZOOM);
    },

    removeGui: function(){
        this._super();

        if (!gv.guiMgr.isQueueGuiEmpty()){
            var nextGUI = gv.guiMgr.getNextGuiFromQueue();
            gv.guiMgr.addGui(nextGUI, nextGUI.id, LayerId.LAYER_POPUP);
        }
    }
});