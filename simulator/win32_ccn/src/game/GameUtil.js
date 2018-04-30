/**
 * Created by GSN on 9/28/2015.
 */

var GameUtil={};

var makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc32 = function(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

GameUtil.callFunctionWithDelay = function(delay, funcObj){
    GameUtil.callFunctionWithDelay(delay, funcObj, null);
};

GameUtil.callFunctionWithDelay = function(delay, funcObj, tag){
    var currScene = cc.director.getRunningScene();
    var callAction = cc.callFunc(funcObj);
    var delayAction = cc.delayTime(delay);
    var sequeAction = cc.sequence(delayAction, callAction);
    if(tag!= undefined && tag!=null)
        sequeAction.setTag(crc32(tag));
    currScene.runAction(sequeAction);
};

GameUtil.stopDelayFunctionByTag = function(tag){
    var currScene = cc.director.getRunningScene();
    currScene.removeActionByTag(crc32(tag));
};

//tru slot index di mot luong, tu dong quay vong neu slot index <0
GameUtil.subSlot = function(baseSlot, subAmount){
    var result = baseSlot;
    if(baseSlot >= 100){
        if(baseSlot % 100 < subAmount){
            switch (baseSlot / 100){
                case 1:
                    result = 40 - (subAmount - (baseSlot % 100));
                    break;
                case 2:
                    result = 10 - (subAmount - (baseSlot % 100));
                    break;
                case 3:
                    result = 20 - (subAmount - (baseSlot % 100));
                    break;
                case 4:
                    result = 30 - (subAmount - (baseSlot % 100));
                    break;
                default :
                    cc.log("GameUtil.subSlot. error ! can not find stand pos: " + baseSlot / 100);
            }
        }
    }
    else{
        result -= subAmount;
    }
    result = result % NUMBER_SLOT_IN_BOARD;
    if(result < 0)
        result = NUMBER_SLOT_IN_BOARD + result;

    cc.log("GameUtil.subSlot: baseSlot: "+baseSlot+" SubAmount: "+subAmount+" Result: "+result);

    return result;
};

//cong slot index them mot luong, tu dong quay vong ve 0 neu slot index > MAX_NUM_SLOT
//tu dong tang index ve index trong chuong cua player tuong ung
GameUtil.addSlot = function(baseSlot, addAmount, playerIndex){
    var resultSlot = baseSlot;
    var desGateSlot = this.getDestinationGateForPlayer(playerIndex);
    for(var i=0; i< addAmount; i++){
        if(resultSlot == desGateSlot){
            var standPos = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
            resultSlot = (standPos+1)*100;
        }
        else if(resultSlot == NUMBER_SLOT_IN_BOARD - 1){
            resultSlot = 0;
        }
        else{
            resultSlot++;
        }

        if(resultSlot >100 && resultSlot%100 +1 > NUMBER_DES_SLOT){
            //cc.log("Add slot out of range: "+resultSlot+" "+addAmount+" "+playerIndex);
            return -1;
        }
    }
    return resultSlot;
};

GameUtil.minusSlot = function(baseSlot, minusAmount) {
    return ((baseSlot - minusAmount) + NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD;
    //var resultSlot = ((baseSlot - minusAmount) + NUMBER_SLOT_IN_BOARD) % NUMBER_SLOT_IN_BOARD;
    //return resultSlot;
};

GameUtil.getRangeBetweenTwoSlot = function(startSlot, desSlot, playerIndex){
    var range = 0;
    var curSlot = startSlot;
    while (range<100 && curSlot!=desSlot){
        range++;
        curSlot = GameUtil.addSlot(curSlot, 1, playerIndex);
    }
    return (range<100? range: -1);
};


GameUtil.vec3Mul= function(vector, factor){
    return cc.math.vec3(vector.x*factor, vector.y*factor, vector.z*factor);
};

//lay khoang cach (so o) nam giua 2 slot
GameUtil.getSlotDistance = function(slot1, slot2, playerIndex){
    var mapper = gv.matchMng.mapper;

    var slot1InViewPoint = slot1;
    var slot2InViewPoint = slot2;
    if(playerIndex!=0){
        slot1InViewPoint = mapper.convertSlotToViewPointOfPlayer(slot1, 0, playerIndex);
        slot2InViewPoint = mapper.convertSlotToViewPointOfPlayer(slot2, 0, playerIndex);
    }

    cc.assert(slot1InViewPoint < 100 || Math.floor(slot1InViewPoint/100) == 1, "destination slot belong other player!");
    cc.assert(slot2InViewPoint < 100 || Math.floor(slot2InViewPoint/100) == 1, "destination slot belong other player!");

    if(slot1InViewPoint >= 100){
        slot1InViewPoint = NUMBER_SLOT_IN_BOARD + slot1InViewPoint % 100;
    }
    if(slot2InViewPoint >= 100){
        slot2InViewPoint = NUMBER_SLOT_IN_BOARD + slot2InViewPoint % 100;
    }

    return Math.abs(slot1InViewPoint - slot2InViewPoint);
};

GameUtil.getFinalSlotForPlayer = function(playerIndex){
    return this.getDestinationSlotForPlayer(playerIndex, NUMBER_DES_SLOT-1);
};

GameUtil.getDestinationGateForPlayer = function(playerIndex){
    var standIndex = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
    switch (standIndex){
        case 0:
            return 39;
        case 1:
            return 9;
        case 2:
            return 19;
        case 3:
            return 29;
    }
};

GameUtil.getHomeGateForPlayer = function(playerIndex){
    var standIndex = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
    return standIndex*10;
};

GameUtil.getTeleportTargetSlotFrom = function(teleportStartSlot){
    for (var i=0; i<CCNConst.MAX_MOVE_TILE; i++){
        var tile = gv.matchMng.mapper.getTileForSlot(i);
        if ((tile.type == TileType.TILE_TELEPORT) && (i!=teleportStartSlot)){
            return i;
        }
    }
    DebugUtil.log("Ops! Cannot find teleport Target");
};

GameUtil.getHomeSlotForPlayer = function(playerIndex, seque){
    var standIndex = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
    return -((standIndex+1)*100 + seque);
};

GameUtil.getDestinationSlotForPlayer = function(playerIndex, seque){
    var standIndex = gv.matchMng.playerManager.getStandPosOfPlayer(playerIndex);
    return (standIndex+1)*100 + seque;
};


GameUtil.makeHttpRequest = function(url, callback){
    cc.log("Http Request: "+ url);

    var request = cc.loader.getXMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            cc.log("Http status code: "+ request.status);
            var dataJson = "";
            if(request.status == 200){
                dataJson = request.responseText;
            }
            cc.log("response text: " + dataJson);
            callback(request.status, dataJson);
        }
    };

    request.send();
};

GameUtil.getPlatformName = function(){
   return cc.sys.os;
};

GameUtil.getColorStringById = function(colorId){
    switch (colorId) {
        case PlayerColor.BLUE:
            return "blue";
        case PlayerColor.GREEN:
            return "green";
        case PlayerColor.RED:
            return "red";
        case PlayerColor.YELLOW:
            return "yellow";
        default :
            return "white";
    }
};

GameUtil.getRGBColorById = function(colorId){
    switch (colorId) {
        case PlayerColor.BLUE:
            return cc.color(112, 196, 255);
        case PlayerColor.GREEN:
            return cc.color(105, 255, 6);
        case PlayerColor.RED:
            return cc.color(255, 88, 6);
        case PlayerColor.YELLOW:
            return cc.color(255, 206, 11);
        default :
            return cc.color(255,255,255);
    }
};

GameUtil.getRGBColorForGold = function(){
    return cc.color(247,206,62);
};

GameUtil.getRGBColorForG = function(){
    return cc.color(202,235,70);
};

GameUtil.getRGBColorForVND = function(){
    return cc.color(147,218,224);
};

GameUtil.getClassNameById = function(classId){
    switch (classId) {
        case PlayerClass.CLASS_D:
            return "D";
        case PlayerClass.CLASS_C:
            return "C";
        case PlayerClass.CLASS_B:
            return "B";
        case PlayerClass.CLASS_A:
            return "A";
        case PlayerClass.CLASS_S:
            return "S";
    }
};

GameUtil.getClassIdByName = function(className){
    switch (className) {
        case "D":
            return PlayerClass.CLASS_D;
        case "C":
            return PlayerClass.CLASS_C;
        case "B":
            return PlayerClass.CLASS_B;
        case "A":
            return PlayerClass.CLASS_A;
        case "S":
            return PlayerClass.CLASS_S;
    }
};


GameUtil.getSkillDescription = function(skillId, clazz){
    var result = fr.Localization.text("skill_description_" + skillId);
    var skillInfo = CharacterConfig.getInstance().getSkillInfoById(skillId, clazz);
    switch (skillId){
        case PieceSkill.SKY_HORSE:
        case PieceSkill.LAND_HORSE:
        case PieceSkill.COMBO_KICK:
            result = result.replace("@Rate", skillInfo.chance);

            var valueStr = "";
            var incrementalTarget = [];
            if (skillInfo.value.length>0){
                incrementalTarget.push(skillInfo.value[0]);
                for (var i=1; i<skillInfo.value.length; i++){
                    incrementalTarget.push(incrementalTarget[i-1]+skillInfo.value[i]);
                }
                valueStr = JSON.stringify(incrementalTarget);
                valueStr = valueStr.slice(1,valueStr.length-1);
            }

            result = result.replace("@Value", valueStr);
            break;
        case PieceSkill.MOVE_BACK:
        case PieceSkill.MOVE_TO_DESTINATION_GATE:
        case PieceSkill.SWAP:
        case PieceSkill.MOVE_TO_MINI_GAME_1:
        case PieceSkill.SHIELD_ANGEL:
        case PieceSkill.DOUBLE_EXP:
            result = result.replace("@Rate", skillInfo.chance.toString());
            break;
    }
    return result;
};

GameUtil.screenShot = function(fileName)
{
    var texture = new cc.RenderTexture(cc.winSize.width, cc.winSize.height);
    texture.begin();
    cc.director.getRunningScene().visit();
    texture.end();
    var imgPath = jsb.fileUtils.getWritablePath();
    if(imgPath.length == 0)
    {
        cc.log("capture failed!");
        return;
    }
    var result = texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPEG);
    if(result)
    {
        imgPath += fileName;
        // WinRT accept only backslashes -> replace all forward slashes
        if (sys.platform == sys.WINRT || sys.platform == sys.WP8) {
            imgPath = imgPath.replace(/\//g, "\\");
        }
        cc.log("save image: " + imgPath);
        return imgPath;
    }
};

GameUtil.getGlobalDiceId = function(idDice) {
    return ("DICE_" + idDice);
};

GameUtil.getCurrentTime = function(){
    return (new Date().getTime()/1000)+UserData.getInstance().deltaServerTime;
};

GameUtil.getStarFromLevel = function(level){
    var star = level%CCNConst.MAX_STAR_NUMBER;
    if (star==0) star = CCNConst.MAX_STAR_NUMBER;
    return star;
};


// cuong
GameUtil.getValueSkillInfo = function(skillId,playerIndex){
    var charCf = CharacterConfig.getInstance();
    var playerInfo = gv.matchMng.playerManager.getPlayerInfoByPlayerIndex(playerIndex);
    var mainChar = playerInfo.playerStatus.mainCharacter;
    var skillInfo = charCf.getSkillInfoById(skillId, mainChar.clazz);
    return skillInfo.value[0];
};

GameUtil.getTimeAuto = function(time){
    var guiAutoplay = gv.guiMgr.getGuiById(GuiId.AUTO_PLAY);
    if(guiAutoplay == null) return time;
    if(guiAutoplay.autoMode){
        return 1;
    }else{
        return time;
    }
};


// ham nay se tinh toan buoc di thuc te cua piece (chi di chuyen den vi tri nay thoi.)
// neu i<distace thi se thuc hien move kieu khac
GameUtil.calculateRealMoveFromPiece = function(piece,distance){
    if(distance>0){
        // tinh toan den cong chuong gan nhat gap phai thoi
        for(var i=1;i<=distance;i++){
            var currentDistance = GameUtil.addSlot(piece.currSlot, i, piece.playerIndex);
            if(currentDistance>99){
                return [distance,null];
            }
            var tile = gv.matchMng.mapper.getTileForSlot(currentDistance);
            if(tile.tileUp){
                return [i-1,MoveType.TILE_UP];
            }
            if(tile.isFreeze){
                return [i,MoveType.FREEZE_TRAP]; // cho nay la tim kiem vi tri bay bang dau tien gap phai
            }
        }
    }
    return [distance,null];
};

GameUtil.calculateDestinationMoveFromPiece=function(piece,distance){
    for(var i = 1;i<=distance;i++){
        var currentDistance = GameUtil.addSlot(piece.currSlot,i,piece.playerIndex);
        if(currentDistance>99){
            return distance;
        }
        var tile = gv.matchMng.mapper.getTileForSlot(currentDistance);
        if(tile.tileUp){
            return i-1;
        }
    }
    return distance;
};

GameUtil.resetForTurn=function(piece){
    var piece1 = piece;
    if(piece1.isMoveByTileUp){
        piece1.isMoveByTileUp = false;
        var slot= GameUtil.addSlot(piece1.currSlot,1,piece1.playerIndex);
        var tile = gv.matchMng.mapper.getTileForSlot(slot);
        if(tile != null){
            if(tile.tileUp){
                tile.display.resetTileUp();
            }
        }
    }
};

