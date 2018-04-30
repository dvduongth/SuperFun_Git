/**
 * Created by user on 1/4/2016.
 */

var GiftType = {
    GOLD: "GOLD",
    COIN: "COIN",
    CHEST_1: "CHEST_1",
    CHEST_2: "CHEST_2",
    CHEST_3: "CHEST_3",
    DICE_1: "DICE_1",
    DICE_2: "DICE_2",
    DICE_3: "DICE_3",
    DICE_4: "DICE_4",
    DICE_5: "DICE_5",
    DICE_6: "DICE_6"
};

var GiftData = cc.Class.extend({
    type : "",
    quantity : 0,

    ctor: function(type, quantity){
        this.type = type;
        this.quantity = quantity;
    }
});

GiftData.getGiftResourceByType = function(giftType, giftQuantity){
    var result;
    switch (giftType){
        case GiftType.GOLD:
            var goldLevel;
            if (giftQuantity<100000) goldLevel = 1;
            else if (giftQuantity<200000) goldLevel = 2;
            else if (giftQuantity<300000) goldLevel = 3;
            else if (giftQuantity<400000) goldLevel = 4;
            else if (giftQuantity<500000) goldLevel = 5;
            else goldLevel = 6;
            result = "gift_gold_"+ goldLevel+".png";
            break;
        case GiftType.COIN:
            var coinLevel = 1;
            if (giftQuantity>=500) goldLevel = 2;
            result = "gift_coin_" + coinLevel +".png";
            break;
        case GiftType.CHEST_1:
            result = "gift_silver_chest.png";
            break;
        case GiftType.CHEST_2:
            result = "gift_golden_chest.png";
            break;
        case GiftType.CHEST_3:
            result = "gift_violet_chest.png";
            break;
        case GiftType.DICE_1:
            result = "gift_dice_1.png";
            break;
        case GiftType.DICE_2:
            result = "gift_dice_2.png";
            break;
        case GiftType.DICE_3:
            result = "gift_dice_3.png";
            break;
        case GiftType.DICE_4:
            result = "gift_dice_4.png";
            break;
        case GiftType.DICE_5:
            result = "gift_dice_5.png";
            break;
        case GiftType.DICE_6:
            result = "gift_dice_6.png";
            break;
    }
    result = "res/lobby/" + result;
    return result;
};

GiftData.getGiftTextColorByType = function(giftType){
    switch (giftType){
        case GiftType.GOLD:
            return GameUtil.getRGBColorForGold();
            break;
        case GiftType.COIN:
            return GameUtil.getRGBColorForG();
        default:
            return cc.color(255,255,255);
    }
};


GiftData.getGiftNameByType = function(giftType){
    var result;
    switch (giftType){
        case GiftType.GOLD:
            result = "gold";
            break;
        case GiftType.CHEST_1:
            result = "silver_chest";
            break;
        case GiftType.CHEST_2:
            result = "golden_chest";
            break;
        case GiftType.CHEST_3:
            result = "violet_chest";
            break;
        case GiftType.DICE_1:
        case GiftType.DICE_2:
        case GiftType.DICE_3:
        case GiftType.DICE_4:
        case GiftType.DICE_5:
        case GiftType.DICE_6:
            result = "dice_name_" + giftType[giftType.length-1];
            break;
    }
    return result;
};