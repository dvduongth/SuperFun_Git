/**
 * Created by user on 14/10/2015.
 */
/**
 * Created by user on 9/9/2015.
 */

var AppearEffects = {
    NONE: 1,
    ZOOM: 2,
};

var DestroyEffects = {
    NONE: 1,
    FADE_OUT: 2,
    ZOOM: 3,
};

var BaseGui = cc.Layer.extend({

    appearEffect: null,
    destroyEffect: null,

    id: -1,
    fog : false,
    fogLayer: null,
    _rootNode: null,
    _centerNode: null,

    touchEnable: true,

    ctor: function (jsonRes) {

        this._super();

        this.initJson(jsonRes);

        this.fog = false;
        this.touchEnable = true;

        this._centerNode = null;
        if (this._rootNode){
            this._centerNode = this._rootNode.getChildByName("center_node");
        }

        this.fogLayer = cc.LayerColor.create(cc.color(0, 0, 0, 200));
        this.fogLayer.setVisible(false);
        this.addChild(this.fogLayer, -1);

        //using to prevent all touch of behind GUI
        this.preventTouchBehindGuiListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        this.preventTouchBehindGuiListener.setEnabled(false);
        cc.eventManager.addListener(this.preventTouchBehindGuiListener, this);

        this.touchLayer = new cc.Layer();
        this.addChild(this.touchLayer, 9999999);

        //using to prevent all touch of this GUI
        this.preventTouchInGuiListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        this.preventTouchInGuiListener.setEnabled(false);
        cc.eventManager.addListener(this.preventTouchInGuiListener, this.touchLayer);

        this.setCascadeOpacityEnabled(true);

        this.appearEffect = AppearEffects.NONE;
        this.destroyEffect = DestroyEffects.NONE;
    },

    setAppearEffect: function(appearEffect){
        this.appearEffect = appearEffect;
    },

    runAppearEffect: function(){
        switch (this.appearEffect){
            case AppearEffects.NONE:
                break;
            case AppearEffects.ZOOM:
                this.setScale(0.2);
                this.fogLayer.setScale(5);
                this.runAction(cc.scaleTo(0.3,1).easing(cc.easeBackOut()));
                break;
        }
    },

    onEnter: function(){
        this._super();
        this.runAppearEffect();
    },

    initJson: function(jsonRes){
        if (typeof  jsonRes !== 'undefined'){
            var size = cc.director.getVisibleSize();
            var json = ccs.load(jsonRes, res.ZCSD_ROOT);
            this._rootNode = json.node;
            //xu ly da man hinh
            this._rootNode.setContentSize(size);
            ccui.Helper.doLayout(this._rootNode);
            this.addChild(this._rootNode);
        }
    },

    setTouchEnable: function(enable){
        this.preventTouchInGuiListener.setEnabled(!enable);
    },

    setFog: function(fog){
        this.fog = fog;
        this.fogLayer.setVisible(fog);
        this.preventTouchBehindGuiListener.setEnabled(fog);
    },

    destroy: function(destroyEffect){

        this.destroyEffect = typeof  destroyEffect !== 'undefined' ? destroyEffect: DestroyEffects.NONE;
        this.fogLayer.setVisible(false);

        switch (this.destroyEffect){
            case DestroyEffects.NONE:
                this.removeGui();
                break;
            case DestroyEffects.FADE_OUT:
                this.runAction(cc.sequence(
                    cc.spawn(
                        cc.scaleTo(0.4, 2.0,2.0),
                        cc.fadeOut(0.4)
                    ),
                    cc.callFunc(this.removeGui.bind(this))
                ));
                break;
            case DestroyEffects.ZOOM:
                this.runAction(cc.sequence(
                    cc.scaleTo(0.3, 0.3).easing(cc.easeBackIn()),
                    cc.callFunc(this.removeGui.bind(this))
                ));
                break;
        }
    },

    removeGui: function(){
        gv.guiMgr.removeGuiInList(this.id);
        this.removeFromParent();
    },

    addChild: function(child, zOrder){
        zOrder = typeof zOrder!=='undefined' ? zOrder : child.getLocalZOrder();
        if ((this._rootNode) && (child!==this._rootNode))
            this._rootNode.addChild(child, zOrder);
        else
            this._super(child, zOrder);
    },

    syncAllChildren: function () {
        this._syncChildrenInNode(this._rootNode);
    },

    _syncChildrenInNode: function (node) {
        var allChildren = node.getChildren();

        if (allChildren === null || allChildren.length == 0) return;

        var nameChild;
        //cc.log("length",allChildren.length);
        for (var i = 0; i < allChildren.length; i++) {
            nameChild = '_' + allChildren[i].getName();
            //cc.log("_syncChildrenInNode",nameChild);
            if (nameChild in this && this[nameChild] === null) {
                this[nameChild] = allChildren[i];
                if (nameChild.indexOf("btn") != -1) {
                    this[nameChild].addTouchEventListener(this._onTouchUIEvent, this);
                    this[nameChild].setPressedActionEnabled(true);
                }
            }
            this._syncChildrenInNode(allChildren[i]);
        }
    },

    onTouchBegan: function(touch, event){
        return true;
    },

    onTouchMoved: function(touch, event){
    },

    onTouchEnded: function(touch, event){
    },
    _onTouchUIEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.onTouchUIBeganEvent(sender);
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.onTouchUIMovedEvent(sender);
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onTouchUIEndEvent(sender);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this.onTouchUICancelEvent(sender);
                break;
        }
    },

    onTouchUIBeganEvent: function (sender) {
        // override me
    },

    onTouchUIMovedEvent: function (sender) {
        // override me
    },

    onTouchUIEndEvent: function (sender) {
        // override me
    },

    onTouchUICancelEvent: function (sender) {
        // override me
    }
});

BaseGui.TEXT_COLOR_BROWN = cc.color("#642e00");