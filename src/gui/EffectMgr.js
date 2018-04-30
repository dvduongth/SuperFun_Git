/**
 * Created by user on 8/6/2016.
 */

var EffectType = {
    SINGLE_KICK : 1,
    DOUBLE_KICK : 2,
    TRIPLE_KICK : 3,
    COMBO_KICK : 4,
    NO_MOVE : 5,
    ROLL_DICE_MORE: 6,
    SKILL_SUCCESS : 7,
    SKILL_FAILED : 8,
    NOMORE_MONEY: 9,
    YOU_ARE_HERE: 10,
    LEN_DINH: 11,
    SAP_HAM: 12,
    SAP_DU_4_DEN: 13,
    CON_5_LUOT:14,
};

var EffectMgr = cc.Class.extend({
    ctor: function(){
        this.layerEffect = gv.layerMgr.getLayerByIndex(LayerId.LAYER_EFFECT_GAME);
    },

    initEffect: function(){

        this.guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);

        this.layerEffect.setVisible(true);

        this.fog = new cc.LayerColor(cc.color(0, 0, 0, 200));
        this.fog.setVisible(false);
        this.layerEffect.addChild(this.fog);

        this.timeRunner = new TimeRunner();
        this.timeRunner.setPosition(cc.winSize.width/2, cc.winSize.height-60);
        this.timeRunner.setEnable(false);
        this.layerEffect.addChild(this.timeRunner);

        //this.timerImage = new TimerImage("game/mainBoard/playerInfo/Timer.png");
        //this.timerImage.setScale(0.8);
        //this.timerImage.setPosition(gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).getAvatarPosAtStandPos(0, true));
        //this.timerImage.setEnable(false);
        //this.layerEffect.addChild(this.timerImage);

        this.avatarEffect = fr.AnimationMgr.createAnimationById(resAniId.eff_avatar,this);
        this.avatarEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
        this.avatarEffect.setVisible(false);
        this.layerEffect.addChild(this.avatarEffect);

        this.opponentTurnAni = fr.AnimationMgr.createAnimationById(resAniId.eff_opponent_turn, this);
        this.opponentTurnAni.setPosition(cc.winSize.width/2, cc.winSize.height-60);
        this.opponentTurnAni.setScale(0.9);
        this.opponentTurnAni.setVisible(false);
        this.layerEffect.addChild(this.opponentTurnAni);

        this.cantMoveAni = fr.AnimationMgr.createAnimationById(resAniId.cant_move_notification);
        this.cantMoveAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.cantMoveAni.setVisible(false);
        this.layerEffect.addChild(this.cantMoveAni);

        var _this = this;
        this.singleKickAni = fr.AnimationMgr.createAnimationById(resAniId.eff_single_kick, this);
        this.singleKickAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.singleKickAni.setCompleteListener(function(){
            _this.fog.setVisible(false);
            _this.singleKickAni.setVisible(false)});
        this.singleKickAni.setVisible(false);
        this.layerEffect.addChild(this.singleKickAni);

        //this.comboKickAni = fr.AnimationMgr.createAnimationById(resAniId.eff_combo_kick, this);
        //this.comboKickAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        //this.comboKickAni.setCompleteListener(function(){
        //    _this.comboKickAni.setVisible(false);
        //    _this.fog.setVisible(false);});
        //this.comboKickAni.setVisible(false);
        //this.layerEffect.addChild(this.comboKickAni);

        //this.doubleKickAni = fr.AnimationMgr.createAnimationById(resAniId.eff_multi_kick, this);
        //this.doubleKickAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        //this.doubleKickAni.setCompleteListener(function(){
        //    _this.doubleKickAni.setVisible(false);
        //    _this.fog.setVisible(false);});
        //this.doubleKickAni.setVisible(false);
        //this.layerEffect.addChild(this.doubleKickAni, MainBoardZOrder.EFFECT);
        //
        //this.tripleKickAni = fr.AnimationMgr.createAnimationById(resAniId.eff_multi_kick, this);
        //this.tripleKickAni.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        //this.tripleKickAni.setCompleteListener(function(){
        //    _this.tripleKickAni.setVisible(false);
        //    _this.fog.setVisible(false);});
        //this.tripleKickAni.setVisible(false);
        //this.layerEffect.addChild(this.tripleKickAni, MainBoardZOrder.EFFECT);

        this.diceNumberAni = fr.AnimationMgr.createAnimationById(resAniId.eff_dice_number, this);
        this.diceNumberAni.setPosition(cc.winSize.width/2, cc.winSize.height*2/3+100);
        this.diceNumberAni.setOpacity(0);
        this.layerEffect.addChild(this.diceNumberAni);

        this.doubleDiceText = new cc.Sprite("game/mainBoard/double_dice_text.png");
        this.doubleDiceText.setPosition(10, -80);
        this.diceNumberAni.addChild(this.doubleDiceText);

        this.rollDiceMore = fr.AnimationMgr.createAnimationById(resAniId.eff_roll_dice_more, this);
        this.rollDiceMore.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.rollDiceMore.setOpacity(0);
        this.layerEffect.addChild(this.rollDiceMore);

        this.effNoMoreMoney = fr.AnimationMgr.createAnimationById(resAniId.not_enough_money, this);
        this.effNoMoreMoney.setVisible(false);
        this.effNoMoreMoney.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.layerEffect.addChild(this.effNoMoreMoney);

        this.effYouAreHere = fr.AnimationMgr.createAnimationById(resAniId.you_are_here, this);
        this.effYouAreHere.setVisible(false);
        this.layerEffect.addChild(this.effYouAreHere);

        this.initNextTurnEffect();

        return true;
    },

    // cuong action skill
    getStringGroupSkill:function(skillId){
        if(skillId<200){
            return 100;
        }
        if(skillId<300){
            return 200;
        }
        if(skillId<400){
            return 300;
        }
        return 400;
    },

    //Cuong :)
    Create_Action_Skill:function(skillId, color){
        var size = cc.winSize;
        var colorHorse = GameUtil.getColorStringById(color);

        //forder chua background cua skill
        var folderGroupSkill = "res/game/mainBoard/activeskill/" + this.getStringGroupSkill(skillId);

        // background image
        var sprite1 = new cc.Sprite(folderGroupSkill + "/skillBackGround.png");
        sprite1.setPosition(-sprite1.getContentSize().width,size.height/2);
        this.layerEffect.addChild(sprite1,10);

        //forder skill
        //cc.log(skillId);
        var folderSkill = folderGroupSkill + "/" + skillId;
        cc.log(folderSkill);

        //text image
        var textSprite = new cc.Sprite(folderSkill + "/" + skillId + ".png");
        textSprite.setPosition(size.width/2 + textSprite.getContentSize().width/4,size.height + textSprite.getContentSize().height);
        this.layerEffect.addChild(textSprite,200);

        //horseInfo image
        var sprite2 = new cc.Sprite(folderSkill+"/skill_"+skillId + "_"+ colorHorse + ".png");
        sprite2.setPosition(size.width + sprite2.getContentSize().width,size.height/2 );
        this.layerEffect.addChild(sprite2,100);

        var delaytime = 0.25;
        var rotation = 5;
        this.layerEffect.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                sprite1.runAction(cc.moveTo(delaytime,size.width/2,size.height/2));
                sprite2.runAction(cc.moveTo(delaytime,size.width/2-300,size.height/2));
            }),
            cc.delayTime(delaytime),
            cc.callFunc(function(){
                textSprite.runAction(cc.moveTo(delaytime,size.width/2+ textSprite.getContentSize().width/4,size.height/2).easing(cc.easeBackOut()));
            }),
            cc.delayTime(delaytime),
            cc.callFunc(function(){
                textSprite.runAction(cc.sequence(
                    cc.rotateTo(delaytime*2/5/2,rotation),
                    cc.rotateTo(delaytime*2/5/2,-rotation),
                    cc.rotateTo(delaytime/5/2,0),
                    cc.rotateTo(delaytime*2/5/2,rotation),
                    cc.rotateTo(delaytime*2/5/2,-rotation),
                    cc.rotateTo(delaytime/5/2,0),
                    cc.rotateTo(delaytime*2/5/2,rotation),
                    cc.rotateTo(delaytime*2/5/2,-rotation),
                    cc.rotateTo(delaytime/5/2,0),
                    cc.rotateTo(delaytime*2/5/2,rotation),
                    cc.rotateTo(delaytime*2/5/2,-rotation),
                    cc.rotateTo(delaytime/5/2,0)
                ));
            }),
            cc.delayTime(delaytime*3),
            cc.callFunc(function(){
                sprite1.runAction(cc.fadeOut(delaytime*2));
                sprite2.runAction(cc.fadeOut(delaytime*2));
                textSprite.runAction(cc.fadeOut(delaytime*2));
            }),
            cc.delayTime(delaytime*2),
            cc.delayTime(delaytime/2),
            cc.callFunc(function(){
                sprite1.removeFromParent();
                sprite2.removeFromParent();
                textSprite.removeFromParent();
            })
        ))
    },


    showEffect : function(effectType, callback){
        var _this = this;
        this.setFog(false);
        switch (effectType){
            case EffectType.SINGLE_KICK:
                this.setFog(true);
                this.singleKickAni.setVisible(true);
                this.singleKickAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                this.singleKickAni.setCompleteListener(function(){
                    _this.singleKickAni.setVisible(false);
                    _this.setFog(false);
                    callback()});
                break;
            case EffectType.DOUBLE_KICK:
                //this.doubleKickAni.setVisible(true);
                //this.doubleKickAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                //this.doubleKickAni.setCompleteListener(function(){
                //    _this.doubleKickAni.setVisible(false);
                //    _this.setFog(false);
                //    callback()});
                break;
            case EffectType.TRIPLE_KICK:
                //this.tripleKickAni.setVisible(true);
                //this.tripleKickAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                //this.tripleKickAni.setCompleteListener(function(){
                //    _this.tripleKickAni.setVisible(false);
                //    _this.setFog(false);
                //    callback()});
                break;
            case EffectType.COMBO_KICK:
                //this.comboKickAni.setVisible(true);
                //this.comboKickAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                //this.comboKickAni.setCompleteListener(function(){
                //    _this.comboKickAni.setVisible(false);
                //    _this.setFog(false);
                //    callback()});
                break;
            case EffectType.NO_MOVE:

                this.cantMoveAni.setVisible(true);
                this.cantMoveAni.setCompleteListener(function(){
                    _this.cantMoveAni.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function(){
                        callback();
                        _this.setFog(false);
                    })));
                });
                this.cantMoveAni.setOpacity(255);
                this.cantMoveAni.getAnimation().gotoAndPlay("run", 0, -1, 1);

                break;
            case EffectType.ROLL_DICE_MORE:
                //var _this = this;
                this.rollDiceMore.setOpacity(255);
                this.rollDiceMore.getAnimation().gotoAndPlay("run", 0, -1, 1);
                this.rollDiceMore.setCompleteListener(function(){
                    _this.rollDiceMore.runAction(cc.fadeOut(0.5));
                    _this.setFog(false);
                });
                break;
            case EffectType.SKILL_SUCCESS:
                this.singleKickAni.setVisible(true);
                this.singleKickAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                this.singleKickAni.setCompleteListener(function(){
                    _this.setFog(false);
                    callback()});
                break;

            case EffectType.SKILL_FAILED:
                this.cantMoveAni.setVisible(true);
                this.cantMoveAni.setCompleteListener(function(){
                    _this.cantMoveAni.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function(){
                        callback();
                        _this.setFog(false);
                    })));
                });
                this.cantMoveAni.setOpacity(255);
                this.cantMoveAni.getAnimation().gotoAndPlay("run", 0, -1, 1);
                break;
            case EffectType.NOMORE_MONEY:
                this.effNoMoreMoney.setVisible(true);
                this.effNoMoreMoney.getAnimation().gotoAndPlay("run", 0, -1, 1);
                this.effNoMoreMoney.setCompleteListener(function(){
                    this.effNoMoreMoney.runAction(cc.fadeOut(0.5));
                }.bind(this));
                break;

            case EffectType.YOU_ARE_HERE:
                this.effYouAreHere.setVisible(true);
                var playerPos = gv.guiMgr.getGuiById(GuiId.PLAYER_POSITION).Get_Player_By_StandPos(0).character.getPosition();
                var globalPos = this.guiMainBoard._centerNode.convertToWorldSpace(playerPos);
                var localPos = this.layerEffect.convertToNodeSpace(globalPos);


                this.effYouAreHere.setPosition(localPos.x, localPos.y + 140);
                this.effYouAreHere.getAnimation().gotoAndPlay("run", 0, -1, 1);
                this.effYouAreHere.setCompleteListener(function(){
                    this.effYouAreHere.runAction(cc.fadeOut(0.5));
                }.bind(this));

                break;
            case EffectType.LEN_DINH:
                GameUtil.callFunctionWithDelay(0.5, function(){
                    var lenDinhEff = fr.AnimationMgr.createAnimationById(resAniId.len_dinh_noti, this);
                    lenDinhEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
                    lenDinhEff.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                    lenDinhEff.setCompleteListener(function(){
                        lenDinhEff.removeFromParent();
                        callback();
                    }.bind(this));
                    this.layerEffect.addChild(lenDinhEff);
                }.bind(this));
                break;
            case EffectType.SAP_HAM:
                GameUtil.callFunctionWithDelay(0.5, function(){
                    var sapHamEff = fr.AnimationMgr.createAnimationById(resAniId.sapham_noti, this);
                    sapHamEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
                    sapHamEff.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                    sapHamEff.setCompleteListener(function(){
                        sapHamEff.removeFromParent();
                        callback();
                    }.bind(this));
                    this.layerEffect.addChild(sapHamEff);
                }.bind(this));
                break;
            case EffectType.SAP_DU_4_DEN:{
                //var _this = this;
                GameUtil.callFunctionWithDelay(0.5, function(){
                    _this.setFog(true);
                    var size = cc.winSize;
                    var content = content = "res/game/popup_in_game/chu_y.png";
                    if(gv.matchMng.currTurnPlayerIndex == gv.matchMng.turnLightMgr.currentWarning){
                        content = "res/game/popup_in_game/co_hoi.png"
                    }

                    var sprite = fr.createSprite(content);
                    sprite.setPosition(100,size.height/2);
                    this.layerEffect.addChild(sprite);
                    sprite.runAction(cc.sequence(
                        cc.scaleTo(0.2,1.1),
                        cc.scaleTo(0.2,0.9)
                    ).repeatForever());

                    var warningEff = fr.AnimationMgr.createAnimationById(resAniId.chiemdu4den, this);
                    warningEff.getAnimation().gotoAndPlay("run", 0, -1, 1);
                    warningEff.setPosition(size.width/2,size.height/2);
                    warningEff.setCompleteListener(function(){
                        warningEff.removeFromParent();
                        sprite.removeFromParent();
                        _this.setFog(false);
                        callback();
                    }.bind(this));
                    this.layerEffect.addChild(warningEff,10000);
                    //var standPos = _this.getStandPosNeedRunEffect(playerIndex);
                }.bind(this));
                break;
            }
            case EffectType.CON_5_LUOT:{

            }
        }
    },

    //setEnableTimerTurn: function(timeRunnerEnable, timerImageEnable, timeOut,callback){
    //    this.timeRunner.setEnable(timeRunnerEnable);
    //    this.timerImage.setEnable(timerImageEnable);
    //
    //    var avatarPos = gv.guiMgr.getGuiById(GuiId.PLAYER_INFO_PANEL).getAvatarPosAtStandPos(gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(gv.matchMng.currTurnPlayerIndex).standPos, true);
    //    this.timerImage.setPosition(avatarPos);
    //
    //    if (timeRunnerEnable) {
    //        this.timeRunner.reset(timeOut, function(){
    //            this.setEnableTimerTurn(false, false);
    //            //gv.gameClient.sendMatchPlayAsAI();
    //            if(callback!=null){
    //                callback();
    //            }
    //        }.bind(this));
    //        this.timerImage.reset(timeOut);
    //    }
    //},

    showDiceNumber: function(number1, number2){

        var sum = number1 + number2;

        this.diceNumberAni.setOpacity(255);
        this.diceNumberAni.getAnimation().gotoAndPlay("run", 0,-1, 1);
        this.diceNumberAni.getAnimation().setTimeScale(3.0);

        var subAni = this.diceNumberAni.getCCSlot("number_9.png").getCCChildArmature();
        subAni.getAnimation().gotoAndPlay(sum, 0, -1, 0);

        var subAni1 = this.diceNumberAni.getCCSlot("number_9.png_0").getCCChildArmature();
        subAni1.getAnimation().gotoAndPlay(sum, 0, -1, 0);

        var subAni2 = this.diceNumberAni.getCCSlot("number_9.png_1").getCCChildArmature();
        subAni2.getAnimation().gotoAndPlay(sum, 0, -1, 0);

        var subAni3 = this.diceNumberAni.getCCSlot("number_9.png_2").getCCChildArmature();
        subAni3.getAnimation().gotoAndPlay(sum, 0, -1, 0);

        this.diceNumberAni.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.fadeOut(0.5)
        ));

        this.doubleDiceText.setVisible(number1 == number2);
    },

    initNextTurnEffect: function(){
        this.nextTurnNotification = cc.Sprite.create("game/mainBoard/nextTurnNotification/bg.png");
        this.nextTurnNotification.setCascadeOpacityEnabled(true);
        this.nextTurnNotification.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.nextTurnNotification.setOpacity(0);
        this.layerEffect.addChild(this.nextTurnNotification);

        var lightAbove, lightBelow, textPart1, textPart2;

        lightAbove  = new cc.MotionStreak(0.5, 2, 5, cc.color.WHITE, "game/mainBoard/nextTurnNotification/streak.png");
        lightAbove.setTag(1);
        this.nextTurnNotification.addChild(lightAbove);

        lightBelow = new cc.MotionStreak(0.5, 2, 5, cc.color.WHITE, "game/mainBoard/nextTurnNotification/streak.png");
        lightBelow.setTag(2);
        this.nextTurnNotification.addChild(lightBelow);

        textPart1 = cc.Sprite.create();
        textPart1.setTag(3);
        this.nextTurnNotification.addChild(textPart1);

        textPart2 = cc.Sprite.create();
        textPart2.setTag(4);
        this.nextTurnNotification.addChild(textPart2);
    },

    showNextTurnEffect: function(isMyTurn, callback){
        if (!isMyTurn) {
            callback();
            return;
        }
        var lightAbove = this.nextTurnNotification.getChildByTag(1);
        var lightBelow = this.nextTurnNotification.getChildByTag(2);
        var textPart1 = this.nextTurnNotification.getChildByTag(3);
        var textPart2 = this.nextTurnNotification.getChildByTag(4);

        this.nextTurnNotification.setOpacity(255);
        this.nextTurnNotification.runAction(cc.sequence(cc.delayTime(1.0), cc.fadeOut(0.2)));

        lightAbove.setPosition(-20, this.nextTurnNotification.getContentSize().height-12);
        lightAbove.runAction(cc.moveBy(0.3,  this.nextTurnNotification.getContentSize().width*2, 0));

        lightBelow.setPosition(cc.winSize.width+20, 12);
        lightBelow.runAction(cc.moveBy(0.3, - this.nextTurnNotification.getContentSize().width*2, 0));

        var str = "game/mainBoard/nextTurnNotification/"+ (isMyTurn ? "my_turn_": "enemy_turn_");
        textPart1.setTexture(str+"1.png");
        textPart1.setPosition(-textPart1.getContentSize().width/2, this.nextTurnNotification.getContentSize().height/2);
        textPart1.runAction(cc.moveBy(0.15, this.nextTurnNotification.getContentSize().width/2, 0));

        textPart2.setTexture(str+"2.png");
        textPart2.setPosition(this.nextTurnNotification.getContentSize().width+textPart2.getContentSize().width/2, this.nextTurnNotification.getContentSize().height/2);
        textPart2.runAction(cc.moveBy(0.15, -this.nextTurnNotification.getContentSize().width/2, 0));

        GameUtil.callFunctionWithDelay(1.0, callback);
    },

    setFog: function(visible){
        this.fog.setVisible(visible);
    },

    clearEffect: function(){
        this.layerEffect.removeAllChildren();
    },

    hideAllEffects: function(){
        this.layerEffect.setVisible(false);
    }
});

EffectMgr.getInstance = function(){
    if (this._instance == null){
        this._instance = new EffectMgr();
    }
    return this._instance;
};
