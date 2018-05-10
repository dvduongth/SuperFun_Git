/**
 * Created by GSN on 3/31/2016.
 */

var GuiUtil = GuiUtil || {};

fr.createSprite = function(name) {
    cc.log('create sprite with name', name);
    if ((typeof name == "undefined")|| (name =="")){
        cc.log('create new sprite with undefined name', name);
        return new cc.Sprite();
    }
    else{
        if(cc.spriteFrameCache.getSpriteFrame(name))
        {
            cc.log('create new sprite with spriteFrameCache', name);
            return new cc.Sprite("#" + name);
        }
        else
        {
            cc.log('create new sprite without cache', name);
            return new cc.Sprite(name);
        }
    }
};

fr.changeSprite = function(sprite, name) {
    if (cc.spriteFrameCache.getSpriteFrame(name)) {
        cc.log('fr.changeSprite with cache');
        sprite.setSpriteFrame(name);
    }
    else {
        cc.log("fr.changeSprite:" + name);
        sprite.setTexture(name);
    }
};

fr.createSimpleButton = function(normal, texType)
{
    texType = typeof texType !== "undefined" ? texType : ccui.Widget.PLIST_TEXTURE;
    var btnKeep = new ccui.Button();
    btnKeep.loadTextureNormal(normal,texType);
    return btnKeep;
};

GuiUtil.showWaitingGui = function(){
    var waitingGui = gv.guiMgr.getGuiById(GuiId.WAITING_GUI);
    if(waitingGui == null){
        gv.guiMgr.addGui(new GuiWaiting(), GuiId.WAITING_GUI, LayerId.LAYER_LOADING);
    }
};

GuiUtil.hideWaitingGui = function(){
    var waitingGui = gv.guiMgr.getGuiById(GuiId.WAITING_GUI);
    if(waitingGui!=null)
        waitingGui.destroy();
};