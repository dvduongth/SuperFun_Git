 /**
 * Created by GSN on 4/5/2016.
 */

var MailItem = cc.Class.extend({
    ctor : function(){
        this.uid = 0;
        this.itemID = "";
        this.quantity=0;
        this.subject = "";
        this.content = "";
        this.expired = 0;
    }
});

 var MailData = cc.Class.extend({
     mailList: [],

     ctor: function(){
         this.mailList = [];
     },

     setMailList: function(mailList){
         this.mailList = mailList;
     },

     addMailItem: function(mailItem){
         this.mailList.push(mailItem);
     },

     removeMailItemAtIndex: function(index){
         this.mailList.splice(index, 1);
     },

     reloadMailList: function(){
        for (var i=this.mailList.length-1; i>=0; i--){
            var mailItem = this.mailList[i];
            if (mailItem.expired < GameUtil.getCurrentTime()){
                this.removeMailItemAtIndex(i);
            }
        }
     },
 });

 MailData.getInstance = function(){
     if (this._instance == null){
         this._instance = new MailData();
     }
     return this._instance;
 };