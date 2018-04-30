/**
 * Created by user on 31/3/2016.
 */

var PopupEventBetaTest = BasePopupOneByOne.extend({
    ctor: function(){
        this.btnClose = null;
        this.ndLight = null;
        this.sprCharacter_1 = null;
        this.sprCharacter_2 = null;
        this.sprCharacter_3 = null;
        this.sprDiceGreen = null;
        this.sprDiceYellow = null;
        this.sprDiceWhite = null;
        this.sprCoCaNgua = null;
        this.sprAboveEffect = null;
        this.sprUnderEffect = null;
        this.sprTimeBetaTest = null;

        this._super(res.ZCSD_POPUP_EVENT_BETA_TEST);

        this.TOTAL_ACTION_TIME = 1;
        this.RATIO_UP = 0.6;
        this.RATIO_DOWN = 0.4;
        this.DELTA_MOVE_UP = 150;
        this.DELTA_START_JUMP = 200;

        this.syncChildrenInNode(this._rootNode);
    },
    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnClose:
                this.destroy();
                break;
            default :
                break;
        }
    },
    runAppearEffect: function (callback) {
        this.hideElementWillHasAppearAction();
        this._super(callback);
    },
    hideElementWillHasAppearAction: function () {
        this.ndLight.visible = false;
        this.sprCharacter_1.visible = false;
        this.sprCharacter_2.visible = false;
        this.sprCharacter_3.visible = false;
        this.sprDiceGreen.visible = false;
        this.sprDiceYellow.visible = false;
        this.sprDiceWhite.visible = false;
        this.sprCoCaNgua.visible = false;
        this.sprAboveEffect.visible = false;
        this.sprUnderEffect.visible = false;
    },
    didFinishAppearEffect: function () {
        this.appearCharacter(this.sprCharacter_2,function () {
            GameUtil.createActionLightForNode(this.ndLight);
        }.bind(this));

        this._rootNode.runAction(cc.sequence(
            cc.delayTime(MathUtil.randomBetween(0.1, 0.3)),
            cc.callFunc(function () {
                this.appearCharacter(this.sprCharacter_3);
            }.bind(this))
        ));
        this._rootNode.runAction(cc.sequence(
            cc.delayTime(MathUtil.randomBetween(0.2, 0.4)),
            cc.callFunc(function () {
                this.appearCharacter(this.sprCharacter_1);
            }.bind(this))
        ));

        this.sprDiceGreen.runAction(Utility.getActionAppearFloating(this.sprDiceGreen, MathUtil.randomBetween(3, 4)));
        this.sprDiceYellow.runAction(Utility.getActionAppearFloating(this.sprDiceYellow, -MathUtil.randomBetween(3, 4)));
        this.sprDiceWhite.runAction(Utility.getActionAppearFloating(this.sprDiceWhite,0, MathUtil.randomBetween(3, 4)));

        this.sprCoCaNgua.runAction(Utility.getActionBigScaleForAppear(this.sprCoCaNgua));
        this.sprTimeBetaTest.runAction(Utility.getActionRotateForButton(this.sprTimeBetaTest));

        var actionFadeInOut = cc.sequence(
            cc.delayTime(MathUtil.randomBetween(0,0.15)),
            cc.fadeIn(this.TOTAL_ACTION_TIME * MathUtil.randomBetween(1.7,2.5)),
            cc.delayTime(MathUtil.randomBetween(0.01,0.15)),
            cc.fadeOut(this.TOTAL_ACTION_TIME * MathUtil.randomBetween(1.7,2.5))
        ).repeatForever();
        this.sprAboveEffect.visible = true;
        this.sprUnderEffect.visible = true;
        this.sprAboveEffect.opacity = 0;
        this.sprUnderEffect.opacity = 0;

        this.sprAboveEffect.runAction(actionFadeInOut);
        this.sprUnderEffect.runAction(actionFadeInOut.clone());
    },
    appearCharacter: function (sprCharacter, callback) {
        if(!sprCharacter) {
            Utility.executeCallback(callback);
            callback = null;
        }

        //character chồi lên
        sprCharacter.visible = true;
        sprCharacter.stopAllActions();
        if(!sprCharacter["oldScale"]) {
            sprCharacter["oldScale"] = sprCharacter.getScaleX();
        }
        if(!sprCharacter["oldPos"]) {
            sprCharacter["oldPos"] = sprCharacter.getPosition();
        }
        var oldPos = sprCharacter["oldPos"];
        var oldScale = sprCharacter["oldScale"];
        sprCharacter.y -= this.DELTA_START_JUMP;
        sprCharacter.setScale(0);

        sprCharacter.runAction(cc.spawn(
            cc.sequence(
                cc.moveTo(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.3, oldPos.x, oldPos.y + this.DELTA_MOVE_UP),
                //cc.jumpTo(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.4, oldPos.x, oldPos.y + this.DELTA_MOVE_UP, -this.DELTA_MOVE_UP * 0.5, 1)
                cc.moveTo(this.RATIO_DOWN * this.TOTAL_ACTION_TIME, oldPos.x, oldPos.y),
                cc.callFunc(function () {
                    Utility.executeCallback(callback);
                    callback = null;
                })
            ),
            cc.sequence(
                cc.scaleTo(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.3, 1.1 * oldScale),
                cc.delayTime(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.1 * 0.1),
                cc.scaleTo(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.1 * 0.9, 1.12 * oldScale),
                cc.delayTime(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.3 * 0.1),
                cc.scaleTo(this.RATIO_UP * this.TOTAL_ACTION_TIME * 0.3 * 0.9, 1.15 * oldScale),
                cc.scaleTo(this.RATIO_DOWN * this.TOTAL_ACTION_TIME, 1 * oldScale)
            )
        ));
    },
});