/**
 * Created by GSN on 8/5/2015.
 */

var DiceResult =cc.Class.extend({
    score1 : 0,
    score2 :0,
    ctor:function(score1,score2){
        this.score1 = score1;
        this.score2 = score2;
    },
    getString : function(){
        return "("+this.score1+", "+this.score2+")";
    }
});