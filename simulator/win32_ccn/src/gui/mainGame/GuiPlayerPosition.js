var PlayerPositionInfo = cc.Class.extend({

    ctor:function(standPos,character,bot){
        this.standPos = standPos;
        this.character = character;
        this.bot = bot;
        this.bottomEffect = null;
    }
});

var PLAYER_ZORDER = 700;
var GuiPlayerPosition = BaseGui.extend({

    ctor: function () {
        this._super();
        this.listPlayer=[];
        this.bubbleBg = null;

        for(var playerIndex=0; playerIndex < gv.matchMng.playerManager.getNumberPlayer(); playerIndex++){
            var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).standPos;
            var character = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex).playerStatus.mainCharacter.id;
            this.Draw_Player_Stanpos(standPos,character);
        }
        this.schedule(this.updateStatusPlayer,2);
    },

    Get_Position_By_StandPos:function(standPos){
        return gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos);
    },

    Draw_Player_Stanpos:function(stanPos,id){
        var guiMainboard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        //create fixPosition
        var fixPosition = this.Get_Position_By_StandPos(stanPos);
        var sprite = fr.AnimationMgr.createAnimationById(id, this);
        sprite.setPosition(fixPosition);
        sprite.setScale(1);
        if(stanPos==0 || stanPos ==1){
            sprite.setScaleX(-1);
        }

        sprite.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        guiMainboard.addChild(sprite,PLAYER_ZORDER);
        sprite.setLocalZOrder(PLAYER_ZORDER);
        sprite.setVisible(false);
        this.listPlayer.push(new PlayerPositionInfo(stanPos,sprite,null));
    },

    //tuanda
    Show_Player_When_Start_Game: function(callback){
        this.runAction(cc.sequence(
            cc.spawn(
                cc.delayTime(3),
                cc.callFunc(function(){
                    var mainCharacter = this.Get_Player_By_StandPos(0).character;
                    var destination = mainCharacter.getPosition();
                    mainCharacter.setVisible(true);
                    mainCharacter.setPosition(0,0);
                    mainCharacter.setScale(0);
                    mainCharacter.runAction(cc.sequence(
                        cc.scaleTo(0.7, 1.2).easing(cc.easeElasticOut()),
                        cc.delayTime(0.5),
                        cc.spawn(
                            //cc.moveTo(0.6, destination),
                            cc.jumpTo(0.7, destination, 300, 1),
                            cc.scaleTo(0.7, 1)
                        )
                    ));

                }.bind(this))
            ),
            cc.callFunc(function(){
                EffectMgr.getInstance().showEffect(EffectType.YOU_ARE_HERE);
                for (var i=0; i<gv.matchMng.playerManager.getNumberPlayer(); i++){
                    var standPos = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(i).standPos;
                    var char = this.Get_Player_By_StandPos(standPos).character;
                    char.runAction(cc.sequence(
                        cc.delayTime((i+1)*0.6),
                        cc.callFunc(function(char){
                            char.setVisible(true);
                            char.setOpacity(0);
                            char.runAction(cc.fadeIn(0.4));
                        }.bind(this, char))

                    ));
                }
            }.bind(this))
        ));
        GameUtil.callFunctionWithDelay(4+ (gv.matchMng.playerManager.getNumberPlayer()-2)*1.2, callback);
    },

    Set_Visible_All_Character: function(visible){
        for(var i=0;i<this.listPlayer.length;i++){
            this.listPlayer[i].character.setVisible(visible);
        }
    },

    Get_Player_By_StandPos:function(standPos){
        for(var i=0;i<this.listPlayer.length;i++){
            if(this.listPlayer[i].standPos== standPos ){
                return this.listPlayer[i];
            }
        }
        return this.listPlayer[0];
    },

    setVisibleCharacter:function(standPos){
        for(var i=0;i<this.listPlayer.length;i++){
            if(this.listPlayer[i].standPos== standPos){
                this.listPlayer[i].character.setVisible(false);
                return;
            }
        }
    },

    Set_Opacity_Player:function(standpos){
        for(var i=0;i<this.listPlayer.length;i++){
            if(this.listPlayer[i].standPos== standpos ){
                this.listPlayer[i].character.setOpacity(255);
            }else{
                this.listPlayer[i].character.setOpacity(100);
            }
        }
    },

    addEffectCurrentTurn: function(standPos){
        var guiMainBoard = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
        if (!this.bottomEffect){
            this.bottomEffect  = fr.AnimationMgr.createAnimationById(resAniId.current_turn_bottom, this);
            this.bottomEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
            guiMainBoard.addChild(this.bottomEffect);
        }

        var playerStandPos = this.Get_Player_By_StandPos(standPos).character;
        var effect  = fr.AnimationMgr.createAnimationById(resAniId.current_turn, this);
        effect.setPosition(playerStandPos.getPosition());
        effect.getAnimation().gotoAndPlay("run", 0, -1, 1);
        effect.setCompleteListener(function(){
            effect.removeFromParent();
        }.bind(this));
        guiMainBoard.addChild(effect);

        this.bottomEffect.stopAllActions();
        this.bottomEffect.setOpacity(0);
        this.bottomEffect.runAction(cc.fadeIn(2.0));
        this.bottomEffect.getAnimation().gotoAndPlay("run", 0, -1, 0);
        this.bottomEffect.setPosition(playerStandPos.getPosition());
        fr.Sound.playSoundEffect(resSound.m_ready);
    },

    showBubble : function(bubbleType,standpos){
        if(bubbleType == BubbleType.NONE){
            if(this.bubbleBg!=undefined && this.bubbleBg!=null){
                this.bubbleBg.removeFromParent();
                this.bubbleBg = null;
            }
            return;
        }

        if(this.bubbleBg){
            this.bubbleBg.removeFromParent();
            this.bubbleBg = null;
        }

        var message = "";
        if(bubbleType == BubbleType.WAIT_DICE_ROLL){
            message = resString.BUBBLE_WAIT_ROLL_DICE;
        }
        else if(bubbleType == BubbleType.WAIT_PIECE_ACTION){
            message = resString.BUBBLE_WAIT_ACTION;
        }
        else if(bubbleType == BubbleType.BUBBLE_WAIT_PLAY_MINIGAME){
            message = resString.BUBBLE_WAIT_PLAY_MINIGAME;
        }
        else if(bubbleType == BubbleType.BUBBLE_NOT_ENOUGH_MONEY){
            message = resString.BUBBLE_NOT_ENOUGH_MONEY;
        }
        else if(bubbleType == BubbleType.BUBBLE_NOT_ENOUGH_PLAYER){
            message = resString.BUBBLE_NOT_ENOUGH_PLAYER;
        }
        if(bubbleType == BubbleType.WAIT_PLAYER_PAY_TO_SUMMON){
            message = resString.BUBBLE_WAIT_PLAYER_PAY_TO_SUMMON;
        }

        cc.log("bubble message: " + message);
        this.bubbleBg = fr.createSprite("res/game/skill/quote.png");
        var displayMessage = new ccui.Text(message, res.FONT_GAME_BOLD, 18);
        displayMessage.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        displayMessage.setPosition(this.bubbleBg.getContentSize().width/2, this.bubbleBg.getContentSize().height/2+7);
        this.bubbleBg.addChild(displayMessage, 0);

        //cc.log("set postion bubble");
        var character = this.Get_Player_By_StandPos(standpos).character;
        //character.addChild(this.bubbleBg);
        this.bubbleBg.setPosition(this.Get_Bubble_Position(standpos));
        character.getParent().addChild(this.bubbleBg, MainBoardZOrder.EFFECT);
        this.bubbleBg.setScale(0);

        var actions = [];
        if(standpos==2 || standpos ==3){
            //this.bubbleBg.setScaleX(-1);
            displayMessage.setScaleX(-1);
            actions.push(cc.scaleTo(0.75, -1.0,1.0).easing(cc.easeElasticInOut()));
        }else{
            actions.push(cc.scaleTo(0.75, 1.0).easing(cc.easeElasticInOut()));
        }
        this.bubbleBg.runAction(cc.sequence(actions));
    },

    Get_Bubble_Position:function(standPos){
        //var size = cc.winSize;
        //var fixPosition;
        //switch(standPos) {
        //    case 1:
        //    {
        //        fixPosition = new cc.p(size.width/2 - 100-125,50 );
        //        break;
        //    }
        //    case 2:
        //    {
        //        fixPosition = new cc.p(75, size.height/2 - 75 -50+75);
        //        break;
        //    }
        //    case 3:
        //    {
        //        fixPosition = new cc.p(-size.width/2 + 100 + 125 ,75);
        //        break;
        //    }
        //    case 0:
        //    {
        //        fixPosition = new cc.p(-75 , -size.height/2 + 75 -50+125);
        //        break;
        //    }
        //}
        //return fixPosition;
        var fixPos = -60;
        if(standPos==2 || standPos ==3){
            fixPos = 60;
        }
        return cc.p(gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos).x +fixPos,gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).getPlayerPropertyPos(standPos).y +120);
    },

    getPositionAvata:function(standPos){
        var size = cc.winSize;
        switch (standPos){
            case 1:{
               return cc.p(size.width/4 + 100,size.height/2+50);
            }
            case 2:{
               return cc.p(0,size.height/2 + 50);
            }
            case 3:{
                return cc.p(- size.width/4 - 100,size.height/2 + 50);
            }
            case 0:{
                return cc.p(0,size.height/2 + 50);
            }
        }
    },

    runActionTungXucXac:function(standPos){
        var animationPlayer = this.Get_Player_By_StandPos(standPos).character;
        animationPlayer.getAnimation().gotoAndPlay("tungxucxac", 0, 1, 1);
        animationPlayer.setCompleteListener(function(){
            animationPlayer.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        });
    },

    runActionHappy:function(standPos){
        var animationPlayer = this.Get_Player_By_StandPos(standPos).character;
        animationPlayer.getAnimation().gotoAndPlay("happy", 0, 1, 1);
        animationPlayer.setCompleteListener(function(){
            animationPlayer.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        });
    },

    runActionCry:function(standPos){
        var animationPlayer = this.Get_Player_By_StandPos(standPos).character;
        animationPlayer.getAnimation().gotoAndPlay("cry", 0, 1, 1);
        animationPlayer.setCompleteListener(function(){
            animationPlayer.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        });
    },

    runActionSpecialIdle:function(standPos){
        var animationPlayer = this.Get_Player_By_StandPos(standPos).character;
        animationPlayer.getAnimation().gotoAndPlay("specialidle", 0, 1.25, 1);
        animationPlayer.setCompleteListener(function(){
            animationPlayer.getAnimation().gotoAndPlay("idle", 0, -1, 0);
        });
    },

    throwDiceToTheSky:function(standPos){
       this.runActionTungXucXac(standPos);
        var animationPlayer = this.Get_Player_By_StandPos(standPos).character;
        var _this = this;
        var playerInfo = gv.matchMng.playerManager.getPlayerInfoByStandPos(standPos);
        var selectedDice = playerInfo.playerStatus.mainDice;
        var diceTexture ;
        switch (selectedDice){
            case DiceName.DICE_1:
                diceTexture = "dice1.png";
                break;
            case DiceName.DICE_2:
                diceTexture = "dice2.png";
                break;
            case DiceName.DICE_3:
                diceTexture = "dice3.png";
                break;
            case DiceName.DICE_4:
                diceTexture = "dice4.png";
                break;
            case DiceName.DICE_5:
                diceTexture = "dice5.png";
                break;
            case DiceName.DICE_6:
                diceTexture = "dice6.png";
                break;
        }
        GameUtil.callFunctionWithDelay(0.2,function(){
            var diceImage = fr.createSprite("res/lobby/diceShop/" + diceTexture);
            diceImage.setPosition(animationPlayer.getPosition().x,animationPlayer.getPosition().y + 150 );
            diceImage.setScale(0.3);
            gv.guiMgr.getGuiById(GuiId.MAIN_BOARD).addChild(diceImage);
            diceImage.runAction(cc.sequence(
                cc.moveTo(0.2,_this.getPositionAvata(standPos)),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    diceImage.removeFromParent();
                })
            ));
        })
    },

    updateStatusPlayer:function(){
        var random = MathUtil.randomBetweenFloor(0,4);
        var value = random%this.listPlayer.length;
        this.runActionSpecialIdle(value);
    }
});