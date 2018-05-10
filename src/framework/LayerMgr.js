/**
 * Created by user on 21/10/2015.
 */

var LayerId = {
    LAYER_BG_GAME: 0,
    LAYER_GAME: 1,
    LAYER_GUI: 2,
    LAYER_EFFECT_GAME: 3,
    LAYER_POPUP: 4,
    LAYER_CURSOR: 5,
    LAYER_LOADING: 6
};
var MAX_LAYER = Object.keys(LayerId).length;
var LayerMgr = cc.Class.extend({
    layerList: [],

    addLayers: function (scene) {
        for (var i = 0; i < MAX_LAYER; i++) {
            var layer = new cc.Layer();
            scene.addChild(layer);
            this.layerList.push(layer);
        }
    },

    getLayerByIndex: function (index) {
        if (index <0 || index > MAX_LAYER)
            return null;
        return this.layerList[index];
    },

});