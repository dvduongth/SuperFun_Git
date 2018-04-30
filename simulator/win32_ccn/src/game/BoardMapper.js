/**
 * Created by GSN on 8/5/2015.
 */

var PieceDirect = {
    TOP_RIGHT : 0,
    TOP_LEFT : 1,
    BOTTOM_LEFT : 2,
    BOTTOM_RIGHT : 3,

};

var BoardMapper = cc.Class.extend({
    ctor: function(){
        //this.allStandPos = null;
        this.slotPosMap = [];
        this.HOME_GATE_SLOTS = [0, 10, 20, 30];
        this.DES_GATE_SLOTS = [9, 19, 29, 39];
        this.CORNER_SLOTS = [8, 18, 28, 38];
        this.SPECIAL_SLOTS = [4,14,24,34];
        this.FORTUNE_SLOTS = [];
    },

    loadData : function(boardLayer){

        this.allStandPos = [];
        var logText = "";

        for(var i=0; i< NUMBER_SLOT_IN_BOARD; i++){
            logText+=("add Tile: "+i+"\n");

            var type = TileType.NONE;
            if (this.HOME_GATE_SLOTS.indexOf(i)!=-1){
                type = TileType.TILE_HOME_GATE;
            }
            else if (this.DES_GATE_SLOTS.indexOf(i)!=-1){
                type = TileType.TILE_DESTINATION_GATE;
            }
            else if (this.SPECIAL_SLOTS.indexOf(i)!=-1){
                //do nothing, wait information from server
            }
            else{
                type = TileType.TILE_NORMAL;
            }

            var slotDisplay=boardLayer.getChildByName("slot_"+i);
            this.slotPosMap[i]=new Tile(i, slotDisplay.getPositionX(), slotDisplay.getPositionY(), this.calculateDirectionForSlot(i), type, slotDisplay);

        }

        for(var standIndex=0; standIndex < MAX_NUMBER_PLAYER; standIndex++){
            for(var desIndex=0; desIndex < NUMBER_DES_SLOT; desIndex++){
                var desSlot = (standIndex+1)*100 + desIndex;
                logText+=("add Tile: "+desSlot+"\n");

                var desDisplay=boardLayer.getChildByName("des_"+standIndex+"_"+desIndex);
                this.slotPosMap[desSlot] = new Tile(desSlot, desDisplay.getPositionX(), desDisplay.getPositionY(), this.calculateDirectionForDes(standIndex),  TileType.TILE_DESTINATION, desDisplay);
            }
        }

        for(var standIndex=0; standIndex < MAX_NUMBER_PLAYER; standIndex++){
            for(var homeIndex=0; homeIndex < NUMBER_HOME_SLOT; homeIndex++){
                var homeSlot = -(standIndex+1)*100 - homeIndex;
                logText += ("add Tile: "+homeSlot+"\n");

                var direction=PieceDirect.BOTTOM_LEFT;
                switch (standIndex){
                    case 0:
                        direction=PieceDirect.TOP_RIGHT;
                        break;
                    case 1:
                        direction=PieceDirect.TOP_LEFT;
                        break;
                    case 2:
                        direction=PieceDirect.BOTTOM_LEFT;
                        break;
                    case 3:
                        direction=PieceDirect.BOTTOM_RIGHT;
                        break;
                }

                var homeDisplay=boardLayer.getChildByName("home_"+standIndex+"_"+homeIndex);
                this.slotPosMap[homeSlot] = new Tile(homeSlot, homeDisplay.getPositionX(), homeDisplay.getPositionY(), direction, TileType.TILE_IN_HOME, homeDisplay);
            }
        }

        for(var slotKey in this.slotPosMap){
            var tileObj = this.slotPosMap[slotKey];
            cc.eventManager.addListener({
                event : cc.EventListener.TOUCH_ONE_BY_ONE,

                onTouchBegan : function(touch, event){
                    var target = event.getCurrentTarget();

                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var contentSize = target.getContentSize();
                    var contentRect = cc.rect(0, 0, contentSize.width, contentSize.height);
                    if(cc.rectContainsPoint(contentRect, locationInNode)){
                        var slot = target.getTag();
                        var tileObj = gv.matchMng.mapper.getTileForSlot(slot);
                        tileObj.onTilePressed();
                    }
                    return true;
                },
            }, tileObj.display.image);
        }

        //cc.log(logText);
        this.calculateZOrderInBoard(boardLayer);
    },

    calculateDirectionForDes : function(standPos){
        var direction;

        switch (standPos){
            case 0:
                direction=PieceDirect.TOP_RIGHT;
                break;
            case 1:
                direction=PieceDirect.TOP_LEFT;
                break;
            case 2:
                direction=PieceDirect.BOTTOM_LEFT;
                break;
            case 3:
                direction=PieceDirect.BOTTOM_RIGHT;
                break;
            default :
                cc.assert(false, "tinh direction cho destination tile chet cmnr!");
        }
        return direction;
    },

    calculateDirectionForSlot : function(slotIndex){
        if(slotIndex >=0 && slotIndex < 4)
            return PieceDirect.TOP_RIGHT;
        if(slotIndex >= 4 && slotIndex <8 ){
            return PieceDirect.BOTTOM_RIGHT;
        }
       if((slotIndex >= 8) && (slotIndex <= 9)){
            return PieceDirect.TOP_RIGHT;
        }
        if(slotIndex >=10 && slotIndex < 14){
            return PieceDirect.TOP_LEFT;
        }
        if(slotIndex >=14 && slotIndex < 18){
            return PieceDirect.TOP_RIGHT;
        }
        if((slotIndex >= 18) && (slotIndex <= 19)){
            return PieceDirect.TOP_LEFT;
        }
        if(slotIndex >=20 && slotIndex < 24){
            return PieceDirect.BOTTOM_LEFT;
        }
        if(slotIndex >= 24 && slotIndex < 28){
            return PieceDirect.TOP_LEFT;
        }
        if((slotIndex >= 28) && (slotIndex <= 29)){
            return PieceDirect.BOTTOM_LEFT;
        }
        if(slotIndex >=30 && slotIndex < 34){
            return PieceDirect.BOTTOM_RIGHT;
        }
        if(slotIndex>=34 && slotIndex < 38){
            return PieceDirect.BOTTOM_LEFT;
        }
        if((slotIndex >= 38) && (slotIndex <= 39)){
            return PieceDirect.BOTTOM_RIGHT;
        }
    },

    //tinh toan vi tri cong nha cho vi tri ngoi (standPos) tuong ung
    getSummonSlotForStandPos : function(standIndex){
        return standIndex*(NUMBER_SLOT_IN_BOARD/MAX_NUMBER_PLAYER);
    },



    //tinh toan vi tri cong chuong cho vi tri ngoi (standPos) tuong ung
    getLoadSlotForStandPos : function(standIndex){
        var summonPos=this.getSummonSlotForStandPos(standIndex);
        if(summonPos == 0)
            return NUMBER_SLOT_IN_BOARD - 1;
        else
            return summonPos-1;
    },

    //lay tile object dua tren index tuong ung
    getTileForSlot : function(slotIndex){
        if(this.slotPosMap[slotIndex] == undefined){
            cc.log("Tile with index " + slotIndex + " is not exists");
            return null;
        }

        return this.slotPosMap[slotIndex];
    },

    getSpecialTile: function(type){
        for (var i=0; i<this.SPECIAL_SLOTS.length; i++){
            var tile = this.getTileForSlot(this.SPECIAL_SLOTS[i]);
            if (tile.type == type){
                return tile;
            }
        }
        return null;
    },

    getBomTileList: function(){
        var result = [];
        for (var i=0; i<CCNConst.MAX_MOVE_TILE; i++){
            var tile = this.getTileForSlot(i);
            if (tile.type == TileType.TILE_BOM)
                result.push(tile);
        }
        return result;
    },

    //chuyen doi slot index tu he qy chieu cua server sang he quy chieu cua client
    //doi voi o nha: server chi dung chung gia tri la (-1) nen khi convert ve local can standPos de biet vi tri player, pieceIndex de biet vi tri cua piece
    //doi voi o chuong: server dung chung gia tri(100, 101, 102, 103) nen khi convert ve local can standPos
    //doi voi cac o con lai, chi su dung globalSlot
    convertGlobalToLocalSlotIndex : function(globalSlot, standPos, pieceIndex){
        var result;
        if(globalSlot == -1){
            result =  -1*((standPos+1)*100 + pieceIndex);
        }
        else if(globalSlot >=100){
            result = (standPos+1)*100 + (globalSlot % 100);
        }
        else {
            var sourceLocalStandPos = this.convertGlobalToLocalStandPos(0);
            var sourcePlayerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(sourceLocalStandPos);
            var desPlayerIndex = 0;
            result = this.convertSlotToViewPointOfPlayer(globalSlot, sourcePlayerIndex, desPlayerIndex);
        }
        return result;
    },

    //chuyen doi vi tri ngoi (standPos) tu he qy chieu cua server sang he quy chieu cua client
    convertGlobalToLocalStandPos : function(globalStandPos){
        var deltaStandPos = gv.matchMng.playerManager.getMineGlobalStandPos();
        var localStandPos = ((globalStandPos - deltaStandPos) % MAX_NUMBER_PLAYER);
        if(localStandPos <0)
            localStandPos = localStandPos + MAX_NUMBER_PLAYER;

        return localStandPos;
    },

    convertGlobalStandPosToLocalIndex : function(globalStandPos){
        var localStandPos = this.convertGlobalToLocalStandPos(globalStandPos);
        return gv.matchMng.playerManager.getPlayerIndexAtStandPos(localStandPos);
    },

    ////chuyen doi index tu he qy chieu cua server sang he quy chieu cua client
    //convertLocalIndexToGlobalIndex : function(localIndex){
    //    var localStandPos = gv.matchMng.playerManager.getStandPosOfPlayer(localIndex);
    //    var myGlobalStandPos = localStandPos-gv.matchMng.playerManager.getMineGlobalStandPos();
    //    var localStandPos = ((gldeltaStandPos) % MAX_NUMBER_PLAYER);
    //    if(localStandPos <0)
    //        localStandPos = localStandPos + MAX_NUMBER_PLAYER;
    //
    //    return localStandPos;
    //},

    //chuyen doi slot index tu he qy chieu cua client sang he quy chieu cua server
    convertLocalToGlobalSlotIndex : function(localSlot){
        if(localSlot < 0)
            return -1;
        else if(localSlot >= 100){
            return 100 + (localSlot % 100);
        }
        else{
            var sourcePlayerIndex = 0;
            var desLocalStandPos = this.convertGlobalToLocalStandPos(0);
            var desPlayerIndex = gv.matchMng.playerManager.getPlayerIndexAtStandPos(desLocalStandPos);
            return this.convertSlotToViewPointOfPlayer(localSlot, sourcePlayerIndex, desPlayerIndex);
        }
    },

    //gia su desPlayerIndex ngoi o vi tri cua sourcePlayerIndex, khi do
    //slot co index x doi voi sourcePlayerIndex se co index nao doi voi desPlayerIndex
    convertSlotToViewPointOfPlayer : function(slotIndex, sourcePlayerIndex, desPlayerIndex){
        //var logText = "Convert view point: slot: "+slotIndex+" sourceIndex: "+sourcePlayerIndex+" desIndex: "+desPlayerIndex;
        var playerManager = gv.matchMng.playerManager;
        var sourceStandPos = playerManager.getStandPosOfPlayer(sourcePlayerIndex);
        var desStandPos = playerManager.getStandPosOfPlayer(desPlayerIndex);

        var deltaIndex = desStandPos >= sourceStandPos ? desStandPos - sourceStandPos : desStandPos + (MAX_NUMBER_PLAYER - sourceStandPos);

        if(slotIndex >=100){
            var realSlot = slotIndex%100;
            var prefix = Math.floor(slotIndex/100);
            var newPrefix = (prefix - deltaIndex)%(MAX_NUMBER_PLAYER + 1);
            newPrefix = (newPrefix < 1 ? MAX_NUMBER_PLAYER + newPrefix : newPrefix);
            //logText+=" prefix: "+prefix+" newPrefix: "+newPrefix+" realSlot: "+realSlot;
            //cc.log(logText);
            return newPrefix*100 + realSlot;
        }
        else{
            var rawNewSlot = slotIndex - deltaIndex*(NUMBER_SLOT_IN_BOARD/MAX_NUMBER_PLAYER);
            rawNewSlot = rawNewSlot % NUMBER_SLOT_IN_BOARD;
            return rawNewSlot <0 ? NUMBER_SLOT_IN_BOARD + rawNewSlot : rawNewSlot;
            //var newSlot = rawNewSlot <0 ? NUMBER_SLOT_IN_BOARD + rawNewSlot : rawNewSlot;
            ////logText+=" deltaIndex: " + deltaIndex+" rawNewSlot: "+rawNewSlot+" newSlot: "+newSlot;
            ////cc.log(logText);
            //return newSlot;
        }
    },

    isFortuneSlot : function(slot){
        return (this.FORTUNE_SLOTS.indexOf(slot)!=-1);
    },

    isCornerSlot: function(slot){
        return (this.CORNER_SLOTS.indexOf(slot)!=-1);
    },

    calculateZOrderInBoard: function(boardLayer) {
        var allTile = [];
        for (var i = 0; i < NUMBER_SLOT_IN_BOARD; i++) {
            allTile.push(this.getTileForSlot(i));
        }

        for (var i = 0; i < MAX_NUMBER_PLAYER; i++) {
            for (var j = 0; j < NUMBER_DES_SLOT; j++) {
                allTile.push(this.getTileForSlot((i+1)*100 +j));
            }
        }

        for (var i = 0; i < MAX_NUMBER_PLAYER; i++) {
            for (var j = 0; j < NUMBER_HOME_SLOT; j++) {
                allTile.push(this.getTileForSlot(-((i+1)*100 + j)));
            }
        }

        allTile.sort(function(a, b){return b.getPosition().y - a.getPosition().y});

        //calculate Z-order for piece standing on tile
        for (var i = 0; i < allTile.length; i++){
            allTile[i].setTileZOrder(i);
        }

        //calculate Z-order for these tiles
        var children = boardLayer.getChildren();
        for (var i=0; i<boardLayer.getChildrenCount(); i++){
            children[i].setLocalZOrder(i);
        }
    },
});