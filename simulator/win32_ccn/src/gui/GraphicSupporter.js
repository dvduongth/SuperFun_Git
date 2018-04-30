/**
 * Created by CPU11674-local on 4/7/2016.
 */

var GraphicSupporter = {};
GraphicSupporter.drawCard = function(characterData){
    var background, characterImage, characterName;

    //Khung nen tuong uong voi cac class A, B, C, D
    background = fr.createSimpleButton("card_" +  GameUtil.getClassNameById(characterData.clazz) + ".png");
    //background.loadTexturePressed("card_" +  GameUtil.getClassNameById(characterData.clazz) + ".png", ccui.Widget.PLIST_TEXTURE);
    background.setPressedActionEnabled(false);

    //Hinh nhan vat
    characterImage = fr.createSprite(characterData.id+ "_card.png");
    characterImage.setPosition(background.getContentSize().width/2,background.getContentSize().height/5-14);
    characterImage.setAnchorPoint(0.5, 0);
    characterImage.setTag(111);
    background.addChild(characterImage, 1);

    //Ten nhan vat
    characterName = new ccui.Text(fr.Localization.text("character_name_" + characterData.id),res.FONT_GAME_BOLD, 30);
    //characterName.enableOutline(cc.color("#5c3014"), cc.size(1,1));
    //characterName.enableShadow(BaseGui.TEXT_COLOR_BROWN, cc.size(0, -2));
    characterName.setPosition(background.getContentSize().width/2, 40);
    characterName.setTag(222);
    background.addChild(characterName, 1);

    var starSlot = fr.createSprite("card_" + GameUtil.getClassNameById(characterData.clazz) + "_star_slot.png");
    starSlot.setPosition(background.getContentSize().width/2, background.getContentSize().height-30);
    starSlot.setTag(333);
    background.addChild(starSlot, 1);

    var classImage = fr.createSprite("word_" + GameUtil.getClassNameById(characterData.clazz) + ".png");
    classImage.setPosition(30, starSlot.getContentSize().height-15);
    classImage.setTag(999);
    starSlot.addChild(classImage, 1);

    //So sao tren card
    var starNumber = characterData.getStarFromLevel(characterData.level);
    for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
        var star = fr.createSprite(j + 1 <= starNumber?"card_star_enable.png":"card_star_disable.png");
        star.setScale(0.95);
        star.setPosition(85 + (star.getContentSize().width*star.getScale()-2) * j, starSlot.getContentSize().height/2);
        star.setTag(j);
        starSlot.addChild(star, 1);
    }

    var eff = fr.AnimationMgr.createAnimationById(resAniId.eff_card, background);
    eff.getAnimation().gotoAndPlay(GameUtil.getClassNameById(characterData.clazz), 0, -1, 0);
    eff.setScale(1.8);
    eff.setTag(444);
    eff.setPosition(background.getContentSize().width/2, background.getContentSize().height/2);
    background.addChild(eff);

    return background;
};

GraphicSupporter.changeCard = function(card, characterData){
    var characterImage = card.getChildByTag(111);
    var characterName = card.getChildByTag(222);
    var starSlot = card.getChildByTag(333);
    var classImage = starSlot.getChildByTag(999);
    var eff = card.getChildByTag(444);

    //Khung nen tuong uong voi cac class A, B, C, D
    card.loadTextureNormal("card_" +  GameUtil.getClassNameById(characterData.clazz) + ".png", ccui.Widget.PLIST_TEXTURE);
    card.loadTexturePressed("card_" +  GameUtil.getClassNameById(characterData.clazz) + ".png", ccui.Widget.PLIST_TEXTURE);

    //Hinh nhan vat
    fr.changeSprite(characterImage, characterData.id+ "_card.png");
    //Ten nhan vat
    characterName.setString(fr.Localization.text("character_name_" + characterData.id));
    //effect
    eff.getAnimation().gotoAndPlay(GameUtil.getClassNameById(characterData.clazz), 0, -1, 0);

    //star slot
    fr.changeSprite(starSlot, "card_" + GameUtil.getClassNameById(characterData.clazz) + "_star_slot.png");

    fr.changeSprite(classImage, "word_" + GameUtil.getClassNameById(characterData.clazz) + ".png");

    //So sao tren card
    var starNumber = characterData.getStarFromLevel(characterData.level);
    for (var j=0; j<CCNConst.MAX_STAR_NUMBER; j++) {
        var star = starSlot.getChildByTag(j);
        fr.changeSprite(star, j + 1 <= starNumber?"card_star_enable.png":"card_star_disable.png");
    }

    return card;
};

GraphicSupporter.drawGift = function(giftData, slotResource){

    var giftSlot = fr.createSprite(slotResource);

    var giftIcon = fr.createSprite(GiftData.getGiftResourceByType(giftData.type, giftData.quantity));
    giftIcon.setPosition(giftSlot.getContentSize().width/2, giftSlot.getContentSize().height/2+5);
    giftSlot.addChild(giftIcon);

    var giftText = new ccui.Text("", res.FONT_GAME_BOLD, 15);
    giftText.setPosition(giftSlot.getContentSize().width/2, 25);
    giftText.setColor(GiftData.getGiftTextColorByType(giftData.type));
    giftSlot.addChild(giftText);

    switch (giftData.type){
        case GiftType.GOLD:
        case GiftType.COIN:
            giftText.setString(StringUtil.normalizeNumber(giftData.quantity));
            break;
        case GiftType.CHEST_1:
        case GiftType.CHEST_2:
        case GiftType.CHEST_3:
            giftText.setString(fr.Localization.text(GiftData.getGiftNameByType(giftData.type)));
            var quantitySlot = fr.createSprite("res/lobby/quantity_slot.png");
            quantitySlot.setPosition(20,20);
            quantitySlot.setCascadeOpacityEnabled(true);
            giftIcon.addChild(quantitySlot);
            var quantityLb = ccui.Text("x"+ giftData.quantity, res.FONT_UNICODE_VREVUE_TFF, 15);
            quantityLb.setPosition(quantitySlot.getContentSize().width/2-3, quantitySlot.getContentSize().height/2+3);
            quantitySlot.addChild(quantityLb);
            break;
        case GiftType.DICE_1:
        case GiftType.DICE_2:
        case GiftType.DICE_3:
        case GiftType.DICE_4:
        case GiftType.DICE_5:
        case GiftType.DICE_6:
            giftText.setString(fr.Localization.text(GiftData.getGiftNameByType(giftData.type)));
            break;
    }
    return giftSlot;
};


GraphicSupporter.drawHintPath = function(listPos, repeatTime){
    if(repeatTime == 0)
    {
        return;
    }
    var mainboardGui = gv.guiMgr.getGuiById(GuiId.MAIN_BOARD);
    var actionArr = [];//Mang cac action

    for (var j=0; j<listPos.length; j++){
        var currPos =  listPos[j];
        actionArr.push(cc.jumpTo(0.2, cc.p(currPos.x, currPos.y), 40, 1));
    }

    if(actionArr.length <= 0)
        return;

    var duration = 1;
    actionArr.push(cc.callFunc(function(){
        this.drawHintPath(listPos, repeatTime -1);
    }.bind(this)));
    actionArr.push(cc.delayTime(duration));
    actionArr.push(cc.callFunc(this.motionStreakCallBack.bind(this)));

    //init motion streak
    var motionStreak = new cc.MotionStreak(duration, 1, 8, cc.color(50, 50, 50), "res/particle/test.png");
    motionStreak.setPosition(listPos[0]);

    var seq = cc.sequence(actionArr);
    motionStreak.runAction(seq.repeatForever());
    motionStreak.setBlendFunc(gl.ONE, gl.ONE);

    var colorAction = cc.sequence(
        cc.tintTo(0.2, 255, 0, 0),
        cc.tintTo(0.2, 0, 255, 0),
        cc.tintTo(0.2, 0, 0, 255),
        cc.tintTo(0.2, 0, 255, 255),
        cc.tintTo(0.2, 255, 255, 0),
        cc.tintTo(0.2, 255, 0, 255),
        cc.tintTo(0.2, 255, 255, 255)
    ).repeatForever();

    motionStreak.runAction(colorAction);
    mainboardGui.addChild(motionStreak, MainBoardZOrder.EFFECT);
};

//Khi phan goi y chay den dich
GraphicSupporter.motionStreakCallBack = function (target) {
    target.removeFromParent();
};

