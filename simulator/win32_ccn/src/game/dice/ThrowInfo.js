/**
 * Created by GSN on 1/25/2016.
 */

var ThrowInfo = cc.Class.extend({

    ctor : function(){
        this.bounceCount = 0; //so lan nay len
        this.delayTime = [MAX_NUMBER_DICE]; //delay truoc khi tung tuong ung voi tung xuc sac tam thoi chua dung
        this.resultNumber = [MAX_NUMBER_DICE]; //ket qua tung cua tung xuc sac
        this.displayTime = 0; //thoi gian xuc sac ton tai truoc khi bien mat
        this.startPos = null;   //vi tri bat dau nem
        this.endPos = [MAX_NUMBER_DICE];    //vi tri ket thuc cua tung xuc sac
        this.startRotate = [MAX_NUMBER_DICE]; //goc nghieng ban dau cua tung xuc sac
        this.endRotate = [MAX_NUMBER_DICE]; //goc nghieng cuoi cung cua tung xuc sac
        this.heights = [MAX_NUMBER_DICE]; //do cao khi tung cua xuc sac
        this.throwCallback = null; //finish callback
        this.throwing = false; //dang nem xuc sac hay khong
    }
});