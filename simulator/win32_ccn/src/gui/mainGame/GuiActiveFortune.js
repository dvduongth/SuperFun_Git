/**
 * Created by user on 16/11/2015.
 */

var GuiActiveFortune = BaseGui.extend({

    cardImg: null,
    cardEffect: null,

    ctor: function(){
        this._super(res.ZCSD_GUI_ACTIVE_FORTUNE);
        this.setFog(true);

        this.cardImg = fr.createSprite("fortune_close_card.png");
        this.cardImg.setPosition(0,0);
        this.cardImg.setScale(0.0);
        this.addChild(this.cardImg);
        this.cardImg.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.5, cc.winSize.width/2, cc.winSize.height/2-40),
                cc.rotateBy(0.5, Math.floor(MathUtil.getDistance(this.cardImg.getPosition(), cc.p(cc.winSize.width/2, cc.winSize.height/2-40))/50)*360),
                cc.scaleTo(0.5, 1)
            ),
            cc.delayTime(0.5),
            cc.callFunc(this.onCardMoveFinish.bind(this))
        ));
    },

    onCardMoveFinish: function(){

        var guiCheat = gv.guiMgr.getGuiById(GuiId.CHEAT);
        if (guiCheat.fortuneCheat) {
            var cheatValue = guiCheat.getFortuneCheatNumber();
            gv.gameClient.sendFortuneRollDiceCheat(cheatValue);
        }
        else {
            gv.gameClient.sendFortuneRollDiceRequest();
        }
    },

    openCard: function(number, callback){

        this.cardEffect = fr.AnimationMgr.createAnimationById(resAniId.eff_fortune_card,this);
        this.cardEffect.setPosition(cc.winSize.width/2, cc.winSize.height/2-40);
        this.cardEffect.getAnimation().gotoAndPlay("run", 0, -1, 1);
        this.addChild(this.cardEffect);

        fr.changeSprite(this.cardImg, "fortune_card_" + number + ".png");

        this.runAction(cc.sequence(
            cc.delayTime(2.0),
            cc.callFunc(this.onOpenCardFinish.bind(this, callback))
        ));

        fr.Sound.playSoundEffect(resSound.g_card_active);
    },

    onOpenCardFinish: function(callback){
        var _this = this;
        this.runAction(cc.sequence(
            cc.spawn(
                cc.callFunc(function(){
                    _this.cardEffect.getAnimation().gotoAndPlay("run", 0, -1, 1);
                    _this.cardImg.runAction(cc.fadeOut(1.0));
                }),
                cc.delayTime(1.0)
            ),
            cc.callFunc(function(){
                _this.destroy();
                if (callback!=null)
                    callback();
            })
        ));
    },
});