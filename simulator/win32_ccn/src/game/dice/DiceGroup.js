/**
 * Created by GSN on 1/25/2016.
 */

//var MAX_NUMBER_DICE = 3;
/*
    chua thong tin ve cac con xuc sac cua moi nguoi choi
*/

var DiceGroup = cc.Class.extend({

    diceObjArray : [], //moi phan tu la mot instance cua con xuc sac kieu DiceObject
    bounceSoundEff : [], //moi phan tu la file path mp3 cua hieu ung am thanh khi xuc sac cham san
    swingSound : null, //file path mp3 cua hieu ung am thanh khi lac xuc sac
    throwInfo : null, //chua thong tin tha xuc sac, kieu du lieu ThrowInfo
    diceDataInfo : null, //chua cac config cua dice, tam thoi chua dung
    standPos : -1,  //standpos cua nguoi choi so huu

    ctor : function(){
        this.diceObjArray = [];
        this.bounceSoundEff = [];
        this.swingSound = null;
        this.throwInfo = new ThrowInfo();
        this.diceDataInfo = null;
        this.standPos = -1;
    }
});