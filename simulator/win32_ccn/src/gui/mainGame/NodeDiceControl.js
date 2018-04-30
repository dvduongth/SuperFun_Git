/**
 * Created by user on 3/12/2015.
 */

var NodeDiceSuggestFunction = function() {
    this.initBlah = function() {
        this.listBubble = [];
        this.listDesignatedPos = [];
        for (var i = 0; i < 3; ++i) {
            var tmp = this.getChildByName("n_" + i);
            tmp.setVisible(false);
            this.listBubble.push(tmp);
            this.listDesignatedPos.push(tmp.getPosition());
        }
        this.indexShow = 0;
    },
    this.hideAll = function() {
        this.isStopFlag = true;
        for (var i = 0; i < this.indexShow; ++i) {
            var _tmp = this.listBubble[i];
            _tmp.stopAllActions();
            _tmp.setVisible(false);
            /*this.listBubble[i].runAction(
                cc.sequence(
                    cc.delayTime(i * 0.3),
                    cc.scaleTo(0.3, 0.1, 0.1),
                    cc.callFunc(function() {
                        _tmp.setVisible(false);
                    })
                )
            );*/
        }
        this.indexShow = 0;
    },

    this.showSuggest = function(type, order) {
        this.isStopFlag = false;
        this.runAction(
            cc.sequence(
                cc.delayTime(order * 0.2),
                cc.callFunc(this.showSuggestDelay, this, type)
            )
        )
    },

    this.showSuggestDelay = function(sender, type) {
        if (this.isStopFlag) {
            return;
        }
        if (this.listDesignatedPos.length <= this.indexShow) {
            return;
        }

        var FROM_SCALE = 0.1;
        var TO_SCALE = 1;

        var object = this.listBubble[this.indexShow];
        object.setTexture("res/game/mainBoard/diceControl/suggest_" + type + ".png");
        object.setScale(FROM_SCALE);
        object.setVisible(true);
        object.setPosition(cc.pAdd(this.listDesignatedPos[this.indexShow], cc.p(Math.random() * 20, Math.random() * 20)));

        var tmpArr = [];
        tmpArr.push(object.getPosition());
        tmpArr.push(cc.p(object.getPosition().x / 2 + this.listDesignatedPos[this.indexShow].x / 2, object.getPosition().y / 2 + this.listDesignatedPos[this.indexShow].y / 2 + 20));
        tmpArr.push(this.listDesignatedPos[this.indexShow]);
        object.runAction(
            cc.spawn(
                cc.scaleTo(0.3, TO_SCALE),
                cc.bezierTo(0.3, tmpArr)
            )
        );
        this.indexShow++;
    }
};

var NodeDiceControl = BaseGui.extend({

    RUNNING_SCALE: 1,
    NORMAL_SCALE: 0.8,

    MAX_RANGE_NUMBER: 4,

    START_PERCENT:0,
    END_PERCENT:65,
    START_ANGLE:-150,
    END_ANGLE:35,
    TIME_RUNNING:0.79,

    nodeProcess: null,
    diceProcess: null,
    diceProcessEffect: null,

    processEnable: true,

    ctor: function(){
        this._super(res.ZCSD_NODE_DICE_CONTROL);

        this.rollDiceBtn = this._rootNode.getChildByName("btn_rollDice");
        this.rollDiceBtn.setScale(this.NORMAL_SCALE);
        this.rollDiceBtn.addTouchEventListener(this.onRollDiceBtnTouch,  this);

        this.rollDiceBtnEff = fr.AnimationMgr.createAnimationById(resAniId.btn_roll_dice);
        this.rollDiceBtnEff.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        this.rollDiceBtnEff.setPosition(this.rollDiceBtn.getContentSize().width/2+4, this.rollDiceBtn.getContentSize().height/2-22);
        this.rollDiceBtn.addChild(this.rollDiceBtnEff, 999);

        this.nodeProcess = this._rootNode.getChildByName("node_process");

        this.nodeProgressTimer = new cc.Node();
        this.rollDiceBtn.addChild(this.nodeProgressTimer);

        this.diceProcess = new cc.ProgressTimer(fr.createSprite("game/mainBoard/diceControl/dice_process_img.png"));
        this.diceProcess.setRotation(-173.18);
        this.diceProcess.setType(cc.ProgressTimer.TYPE_RADIAL);
        this.diceProcess.setPosition(this.rollDiceBtn.getContentSize().width/2-22, this.rollDiceBtn.getContentSize().height/2+7);
        this.diceProcess.setPercentage(this.START_PERCENT);
        this.nodeProgressTimer.addChild(this.diceProcess);

        this.setProcessEnable(false);

        this.diceProcessEffect = fr.AnimationMgr.createAnimationById(resAniId.eff_roll_dice_process);
        this.diceProcessEffect.setPosition(0,120);
        this.diceProcessEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
        this.diceProcessEffect.setScale(1.1);
        this.nodeProcess.addChild(this.diceProcessEffect);

        // list suggest
        this.listSuggest = [];
        for (var i = 0; i < 4; ++i) {
            var tmp = this.rollDiceBtn.getChildByName("sug_" + i);
            tmp.setVisible(false);
            NodeDiceSuggestFunction.apply(tmp);
            tmp.initBlah();
            this.listSuggest.push(tmp);
        }

        this.schedule(this.update, 0.01);

        return true;
    },

    setSuggest:function(listParam) {
        this.listParam = listParam;
        this.showSuggest();
    },

    showSuggest:function() {
        var listParam = this.listParam;
        if (this.listParam == null) {
            return;
        }
        var order = 0;
        for (var i = 0; i < listParam.length; ++i) {
            var tmp = listParam[i];
            var thresVal = Math.ceil(tmp.offset / 3) - 1;
            this.listSuggest[thresVal].setVisible(true);
            this.listSuggest[thresVal].showSuggest(tmp.type, order);
            order++;
        }
    },

    onRollDiceBtnTouch : function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.rollDiceBtn.setScale(this.RUNNING_SCALE);
                this.rollDiceBtnEff.getAnimation().gotoAndPlay("click", 0, -1, 0);
                this.rollDiceBtnEff.setScale(1.1);
                this.setProcessEnable(true);
                fr.Sound.playSoundEffect(resSound.m_push_dice_button);
                break;

            case ccui.Widget.TOUCH_CANCELED:
            case ccui.Widget.TOUCH_ENDED:
                this.rollDiceBtnEff.getAnimation().gotoAndPlay("idle", 0, -1, 0);
                this.rollDiceBtnEff.setScale(1);
                var guiCheat = gv.guiMgr.getGuiById(GuiId.CHEAT);
                if (guiCheat.diceCheat) {
                    gv.gameClient.sendCommonRollDiceCheat(guiCheat.getDiceCheatNumber(1), guiCheat.getDiceCheatNumber(2));
                }
                else {
                    var rangeValue = this.getRangeValue();
                    gv.gameClient.sendCommonRollDiceRequest(rangeValue);
                }
                this.setDisable();
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
        }
    },

    update: function(dt){
        if (this.processEnable){
            var percent = this.diceProcess.getPercentage();
            this.nodeProcess.setRotation(this.START_ANGLE + (this.END_ANGLE - this.START_ANGLE)* (percent - this.START_PERCENT)/(this.END_PERCENT - this.START_PERCENT ));
        }
    },

    setProcessEnable: function(enable) {
        if (enable == this.processEnable) return;
        this.processEnable = enable;
        if (enable){
            this.nodeProcess.setVisible(true);
            this.diceProcess.setVisible(true);
            this.diceProcess.setPercentage(this.START_PERCENT);
            var action = cc.sequence(cc.progressTo(this.TIME_RUNNING, this.END_PERCENT), cc.progressTo(this.TIME_RUNNING, this.START_PERCENT));
            this.diceProcess.runAction(action.repeatForever());
        }
        else{
            this.diceProcess.stopAllActions();
            this.diceProcess.setVisible(false);
            this.nodeProcess.setVisible(false);
        }
    },

    getRangeValue: function(){
        var percent = (this.diceProcess.getPercentage() - this.START_PERCENT)* (100/(this.END_PERCENT - this.START_PERCENT));
        return Math.floor(percent/(100/this.MAX_RANGE_NUMBER));
        //var rangeVal = Math.floor(percent/(100/this.MAX_RANGE_NUMBER));
        //return rangeVal;
    },

    setEnable: function(){

        this.rollDiceBtn.setTouchEnabled(true);
        //this.rollDiceBtn.setBright(true);
        this.rollDiceBtn.setVisible(true);
        this.rollDiceBtn.setScale(this.NORMAL_SCALE);
    },

    setDisable: function(){
        this.setProcessEnable(false);
        this.rollDiceBtn.setTouchEnabled(false);
        //this.rollDiceBtn.setBright(false);
        this.rollDiceBtn.setVisible(false);
        this.setProcessEnable(false);

        for (var i = 0; i < 4; i++) {
            this.listSuggest[i].hideAll();
        }
    },
});