/**
 * Created by GSN on 8/5/2015.
 */


var PlayerData = cc.Class.extend({

    ctor : function(playerIndex){
        this.playerId=playerIndex;
        this.pieceList=[];
        this.numberFocTurnCooldown = 0;
        this.numberTurnCooldown = 0;
    },

    toString : function(){
        return "";
    }

});