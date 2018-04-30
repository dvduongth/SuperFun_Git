/**
 * Created by GSN on 8/5/2015.
 */

var PlayerColor= {
    BLUE: 0,
    GREEN: 1,
    RED: 2,
    YELLOW: 3,
    NONE: 4
};// Day la 4 mau cua 4 nhan vat trong game

var PlayerClass= {
    CLASS_D: 0,
    CLASS_C: 1,
    CLASS_B: 2,
    CLASS_A: 3,
    CLASS_S: 4
};//Level cua nhan vat

var MatchData = cc.Class.extend({
    ctor : function(){
        this.pieceList = [];
        this.numberFocTurnCooldown = 0;
        //this.numberTurnCooldown = 0;
    }
});

var PlayerStatus = cc.Class.extend({
    ctor : function(){
        this.uID = 0;
        this.name = "";
        this.avatarUrl = "";
        this.index = 0; //global index
        //this.playerState = 0;
        this.gold = 0;
        this.piecePosList = [];
        this.mainCharacter = null;
        this.mainDice = "";
    }
});

var CharacterData = cc.Class.extend({
    uid : 0,
    id : 0,
    clazz : 0,
    level : 0,
    currExp : 0,
    skillList : [],

    ctor : function(){
        this.uid = 0;
        this.id = 0;
        this.clazz = 0;
        this.level = 0;
        this.currExp = 0;
        this.skillList = [];
    },

    getStarFromLevel: function(level){
        var star = level%CCNConst.MAX_STAR_NUMBER;
        if (star==0) star = CCNConst.MAX_STAR_NUMBER;
        return star;
    }
});

var Player = cc.Class.extend({
    ctor : function(){
        this.playerStatus = null;//info from server, detail in doc
        this.standPos = -1;
        this.playerIndex = -1;
        this.playerColor = -1;
        this.matchData = new MatchData();//thong tin van choi
        this.lose = false;
        this.win = false;
    },

    getServerSideString : function(){
        var pieceList = this.matchData.pieceList;
        var resultString = "("+this.playerStatus.index+"=[";
        for(var i=0; i< pieceList.length; i++){
            var pieceSlot = gv.matchMng.mapper.convertLocalToGlobalSlotIndex(pieceList[i].currSlot);
            resultString+=(pieceSlot+",");
        }
        resultString+="]);";

        return resultString;
    },
});