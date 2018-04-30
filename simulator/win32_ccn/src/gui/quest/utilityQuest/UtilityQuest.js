var Utility = Utility || {};
/**
 *
 * @param {String} name
 * @returns {cc.color} color
 */
Utility.getColorByName = function (name) {
    if (!cc.isString(name)) return cc.color.WHITE;
    name = name.toLowerCase();
    var color;
    switch (name) {
        case 'green':
            color = cc.color.GREEN;
            break;
        case 'red':
            color = cc.color.RED;
            break;
        case 'violet':
            color = cc.color(238, 130, 238);
            break;
        case 'yellow':
            color = cc.color.YELLOW;
            break;
        case 'brown':
            color = cc.color(139, 69, 19);
            break;
        case 'black':
            color = cc.color.BLACK;
            break;
        case 'white':
            color = cc.color.WHITE;
            break;
        case 'blue':
            color = cc.color.BLUE;
            break;
        case 'orange':
            color = cc.color.ORANGE;
            break;
        case 'salmon': // red
            color = cc.color(250, 128, 114);
            break;
        case 'olive': // green
            color = cc.color(128, 128, 0);
            break;
        case 'teal': // blue
            color = cc.color(0, 128, 128);
            break;
        case 'cyan': // blue
            color = cc.color(152, 255, 255);
            break;
        case 'gray': // gray
        case 'grey': // gray
            color = cc.color(128, 128, 128);
            break;
        case 'bisque': // light
            color = cc.color(255, 228, 196);
            break;
        case 'light_pink': // light pink
            color = cc.color(235, 190, 247);
            break;
        case 'dirt_milk':
            color = cc.color(249, 243, 131);
            break;
        case 'content_completed':
            color = cc.color(183, 85, 0);
            break;
        case 'content_processing':
            color = cc.color(129, 67, 0);
            break;
        case 'name_achievement':
            color = cc.color(250, 213, 252);
            break;
        case 'reward_completed':
            color = cc.color(178, 133, 1);
            break;
        case 'reward_processing':
            color = cc.color(118, 93, 2);
            break;
        case 'tab_disabled_state':
            color = cc.color(253, 226, 134);
            break;
        case 'tab_normal_state':
            color = cc.color(223, 185, 233);
            break;
        case 'text_green':
            color = cc.color(97, 222, 3);
            break;
        case 'lock':
            color = cc.color(190, 197, 253);
            break;
        case 'unlock':
            color = cc.color(246, 237, 169);
            break;
        case 'count_down_slot':
            color = cc.color(250, 201, 71);
            break;
        case 'tooltip':
            color = cc.color(248, 237, 184);
            break;
        case 'tooltip_title':
            color = cc.color(234, 120, 122);
            break;
        case 'stroke':
            color = cc.color(39, 17, 10);
            break;
        default :
            color = cc.color.WHITE;
            break;
    }
    return color;
};
Utility.showTextAndIconOnScene = function (parent, position, text, urlIcon, fontName, fontSize, color, moveOffset, isSkipRetain, actionTime) {
    if(!parent) {
        parent = gv.layerMgr.getLayerByIndex(LayerId.LAYER_GUI);
    }
    //text
    if (position === undefined) {
        position = cc.p(0, 0);
    }
    if (fontName === undefined) {
        fontName = res.FONT_GAME_BOLD;
    }
    if (fontSize === undefined) {
        fontSize = 20;
    }
    if (color === undefined) {
        color = Utility.getColorByName("tooltip");
    }
    //show text on scene
    moveOffset = moveOffset || {x: 0, y: 170};
    actionTime = actionTime || 1;
    isSkipRetain = isSkipRetain !== undefined ? isSkipRetain : false;
    Utility.showTextOnScene(parent, text, fontName, fontSize, position, color, moveOffset, isSkipRetain, actionTime);
    var label = Utility._lbText;
    //icon
    if (urlIcon) {
        var icon = new cc.Sprite(urlIcon);
        icon.setPosition(position);
        icon.x += icon.getContentSize().width * icon.getAnchorPoint().x
            + fontSize * 0.5
            + label.getContentSize().width * label.getAnchorPoint().x;
        //show icon on scene
        parent.addChild(icon, 2016);
        icon.runAction(cc.spawn(
            cc.sequence(
                cc.moveBy(actionTime, moveOffset.x, moveOffset.y),
                cc.spawn(
                    cc.fadeOut(actionTime * 0.25),
                    cc.moveBy(actionTime, moveOffset.x, moveOffset.y * 0.5)
                ),
                cc.callFunc(icon.removeFromParent, icon)
            ),
            cc.fadeIn(0.1)
        ));
    }
};
Utility.showTextOnScene = function (parent, text, fontName, fontSize, position, color, moveOffset, isSkipRetain, actionTime) {
    if(!parent) {
        parent = gv.layerMgr.getLayerByIndex(LayerId.LAYER_GUI);
    }
    if (fontName === undefined) {
        fontName = res.FONT_GAME_BOLD;
    }
    if (fontSize === undefined) {
        fontSize = 24;
    }
    if (color === undefined) {
        color = Utility.getColorByName("tooltip");
    }
    moveOffset = moveOffset || {x: 0, y: 170};
    actionTime = actionTime || 1;
    isSkipRetain = isSkipRetain !== undefined ? isSkipRetain : false;
    if (!this._lbText || isSkipRetain) {
        if (this._lbText) {
            this._lbText = null;
        }
        this._lbText = new ccui.Text(text, fontName, fontSize);
        this._lbText.enableShadow(Utility.getColorByName('black'), {width: 0, height: -2}, 1);
        this._lbText.enableOutline(Utility.getColorByName('stroke'), 1);
        this._lbText.retain();
    } else {
        this._lbText.setString(text);
    }
    //update view state
    this._lbText.setColor(color);
    this._lbText.setFontName(fontName);
    this._lbText.setFontSize(fontSize);

    this._lbText.stopAllActions();
    this._lbText.removeFromParent(false);
    parent.addChild(this._lbText);

    if (!actionTime) {
        actionTime = 0.5;
    }
    if (moveOffset === undefined) {
        moveOffset = {x: 0, y: 100};
    }
    moveOffset.x = moveOffset.x !== undefined ? moveOffset.x : moveOffset.width;
    moveOffset.y = moveOffset.y !== undefined ? moveOffset.y : moveOffset.height;
    this._lbText.setCascadeOpacityEnabled(true);
    this._lbText.setOpacity(0);
    this._lbText.setPosition(position);
    this._lbText.runAction(cc.spawn(
        cc.sequence(
            cc.moveBy(actionTime, moveOffset.x, moveOffset.y),
            cc.spawn(
                cc.fadeOut(actionTime * 0.25),
                cc.moveBy(actionTime, moveOffset.x, moveOffset.y * 0.5)
            ),
            cc.callFunc(this._lbText.removeFromParent, this._lbText, isSkipRetain)
        ),
        cc.fadeIn(0.1)
    ));
};
Utility.getDynamicContentSizeTextWith = function (width, height, text, fontName, fontSize) {
    if (fontName === undefined) {
        fontName = res.FONT_GAME_BOLD;
    }
    if (fontSize === undefined) {
        fontSize = 20;
    }

    if (!this.preDynamicText) {
        this.preDynamicText = new ccui.Text("", fontName, fontSize);
        this.preDynamicText.retain();
        this.preDynamicText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.preDynamicText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
    }
    this.preDynamicText.setTextAreaSize(cc.size(width, 0));
    this.preDynamicText.setString(text);
    return this.preDynamicText.getContentSize();
};
Utility.getHeightDynamicFromText = function (width, text, fontName, fontSize) {
    return Utility.getDynamicContentSizeTextWith(width, 0, text, fontName, fontSize).height;
};
Utility.numDaysOfMonth = function (month, year) {
    var isLeapYear;
    if (!year) {
        isLeapYear = false;
    } else {
        isLeapYear = (((year % 4) == 0) && ((year % 100) != 0)) || ((year % 400) == 0);
    }
    if (!month) {
        month = 1;
    }
    if (month == 2) {
        return isLeapYear ? 29 : 28;
    }
    var isEvenNum = (month % 2) == 0;
    if (month < 8) {
        return isEvenNum ? 30 : 31;
    } else {
        return isEvenNum ? 31 : 30;
    }
};

Utility.getDaysOfMonth = function (year, month) {
    var month_;
    var year_;
    if (year_ === undefined && month_ === undefined) {
        var date = new Date();
        month_ = date.getMonth() + 1;//getMonth return (0-11)
        year_ = date.getFullYear();
    }
    return (new Date(year_, month_, 0)).getDate();
};

Utility.getCurrentYear = function () {
    return (new Date).getFullYear();
};

Utility.getCurrentMonth = function () {
    return (new Date).getMonth() + 1;//getMonth return (0-11)
};

Utility.getCurrentDay = function () {
    return (new Date).getDate();
};
