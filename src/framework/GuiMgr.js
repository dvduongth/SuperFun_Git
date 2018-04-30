
var GuiMgr = cc.Class.extend({
    ctor:function () {
        this._listGui = {};
        this._queueGui = [];
        return true;
    },

    addGui: function(gui, guiId, layerId){

        if ((layerId==LayerId.LAYER_POPUP) && (gv.layerMgr.getLayerByIndex(layerId).getChildrenCount()>0)){
            this.addGuiToQueue(gui, guiId);
            return;
        }

        this._listGui[guiId] = gui;
        gui.id = guiId;
        gv.layerMgr.getLayerByIndex(layerId).addChild(gui);
    },

    addGuiToQueue: function(gui, guiId){
        if (this._queueGui.indexOf(gui) == -1){
            this._queueGui.push(gui);
            gui.id = guiId;
            gui.retain();
        }
    },

    isQueueGuiEmpty: function(){
        return (this._queueGui.length == 0);
    },

    getNextGuiFromQueue: function(){
        var gui = this._queueGui[0];
        this._queueGui.splice(0,1);
        return gui;
    },

    getGuiById: function(guiId){
        if(guiId in this._listGui)
        {
            return this._listGui[guiId];
        }
        return null;
    },

    removeGuiInList: function(guiId){
        delete this._listGui[guiId];
    },

    removeAllGui: function(){
        for(var guiId in this._listGui){
            var gui = this._listGui[guiId];
            gui.setVisible(false);
            gui.destroy();
        }
    }
});