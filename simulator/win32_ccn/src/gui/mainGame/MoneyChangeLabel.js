/**
 * Created by GSN on 5/30/2016.
 */

var MoneyChangeLabel = cc.Node.extend({
    ctor : function(){
        this._super();
        this.currentBg = new cc.Sprite("res/game/mainBoard/playerInfo/in_money_slot.png");
        this.contentSize = this.currentBg.getContentSize();

        this.moneyLabel = new ccui.Text("", res.FONT_GAME_BOLD, 50);
        this.moneyLabel.enableOutline(cc.color("##1A1A1A"), 2);
        this.moneyLabel.setPosition(this.contentSize.width/2, this.contentSize.height/2);
        this.currentBg.addChild(this.moneyLabel, 1);

        this.arrow = fr.createSprite("res/game/mainBoard/playerInfo/in_money_arrow.png");
        this.arrow.setPosition(this.contentSize.width, this.contentSize.height/2);
        this.currentBg.addChild(this.arrow);

        this.addChild(this.currentBg);

        this.moneyFlyAni = null;

        this.currMoneyValue = 0;
        this.labelFlip = false;
        this.effectDuration = 2;
        this.timeRunned = 0;
        this.enableUpdate = false;
        this.startMoney = 0;
        this.finishMoney = 0;
        this.schedule(this.update, 0.02);

        this.setVisible(false);
    },

    getMoneyChangeLabelContentSize : function(){
        return this.contentSize;
    },

    showAppearEffect : function(callback){
        var actions = [];
        actions.push(cc.scaleTo(0.0, 1).easing(cc.easeIn(0.5)));

        if(callback!= undefined && callback!=null)
            actions.push(cc.callFunc(callback));
        this.currentBg.setOpacity(255);
        this.currentBg.runAction(cc.sequence(actions));
    },

    showDisappearEffect : function(callback){
        var actions = [];

        actions.push(cc.delayTime(1.0));
        actions.push(cc.spawn(
            cc.scaleTo(0.35, 0).easing(cc.easeIn(0.3)),
            cc.fadeOut(0.2)));
        if(callback!= undefined && callback!=null)
            actions.push(cc.callFunc(callback));

        this.currentBg.runAction(cc.sequence(actions));
    },

    setFlip : function(flip){
        this.labelFlip = flip;
        this.currentBg.setFlippedX(flip);
        this.arrow.setFlippedX(flip);
        if (flip){
            this.arrow.setPosition(0, this.contentSize.height/2)
        }
    },

    setEnableElasticEffect : function(enable){
        if(enable){
            this.currentBg.runAction(cc.sequence(
                cc.scaleTo(0.025, 1.05),
                cc.scaleTo(0.025, 1)
            ).repeatForever());

            this.moneyLabel.setScaleX(1);

            this.moneyFlyAni = fr.AnimationMgr.createAnimationById(resAniId.eff_money_fly, this);
            this.moneyFlyAni.setPositionX(this.labelFlip? -(this.contentSize.width/2-20 ): this.contentSize.width/2-20);
            this.moneyFlyAni.setScaleY(0.5);
            this.moneyFlyAni.setScaleX(0.5);
            this.moneyFlyAni.getAnimation().setTimeScale(1.6);
            this.moneyFlyAni.getAnimation().gotoAndPlay("run", 0, -1, 0);
            this.addChild(this.moneyFlyAni);
            this.moneyFlyAni.setVisible(false);
        }
        else{
            this.moneyFlyAni.removeFromParent();
            this.currentBg.stopAllActions();
        }
    },

    showMoneyTransferEffect : function(moneyChanged){
        this.startMoney = 0;
        this.finishMoney = moneyChanged;
        this.timeRunned = 0;
        this.currMoneyValue = 0;

        if(moneyChanged>0){
            this.currentBg.setTexture("res/game/mainBoard/playerInfo/in_money_slot.png");
            this.arrow.setTexture("res/game/mainBoard/playerInfo/in_money_arrow.png");
            this.moneyLabel.setColor(cc.YELLOW);
        }
        else{
            this.currentBg.setTexture("res/game/mainBoard/playerInfo/out_money_slot.png");
            this.arrow.setTexture("res/game/mainBoard/playerInfo/out_money_arrow.png");
            this.moneyLabel.setColor(cc.color(130,150,165));
        }
        this.setScale(1);
        this.setOpacity(255);

        var _this = this;
        this.showAppearEffect(function(){
            _this.enableUpdate = true;
            _this.setEnableElasticEffect(true);
            _this.setVisible(true);
        })
    },

    update : function(dt){
        if(this.enableUpdate){
            this.timeRunned+=dt;
            if(this.timeRunned >= this.effectDuration) {
                this.timeRunned = this.effectDuration;
                this.enableUpdate = false;
                this.setEnableElasticEffect(false);
                var _this = this;
                this.showDisappearEffect(function(){
                    _this.setVisible(false);
                });
            }

            this.currMoneyValue = Math.floor((this.finishMoney - this.startMoney)*(this.timeRunned/this.effectDuration));
            this.moneyLabel.setString((this.finishMoney>=0?"+":"") + this.currMoneyValue);
        }
    }
});