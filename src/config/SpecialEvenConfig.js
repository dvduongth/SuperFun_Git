
var SpecialEvenConfig = cc.Class.extend({

    jsonData : [],

    ctor: function(){
        var _this = this;
        cc.loader.loadJson("json/SpecialEvent.json", function(error, data){
            _this.jsonData = data;
        });
        //cc.log(this.getEvenOfCurrentSlot(10));
        //this.getEvenOfCurrentSlot(10);
    },

    getCostFormRound:function(currentRound){
        //coinCost
        return this.jsonData["TreasureHunting"][currentRound]["coinCost"];
    },

    getEvenOfCurrentSlot:function(currentSlot){
        //TreasureHunting
        var currentRound = Math.floor(currentSlot/7) + 1;
        var currentSlotRound = currentSlot - (currentRound-1)*7;

        //cc.log(currentRound + "         " + currentSlot);
       // var charListKeys = Object.keys(this.jsonData["TreasureHunting"]);
        var informationCurrentSlot = this.jsonData["TreasureHunting"][currentRound]["outcome"][currentSlotRound]["reward"];
        //cc.log("CUONG    " + infomationCurrentSlot);
        var informationList = informationCurrentSlot.split(";")
        //cc.log("CUONG    " + informationList[0])
        return informationList;
    },
});

SpecialEvenConfig.getInstance = function(){
    if (!this._instance){
        this._instance = new SpecialEvenConfig();
    }
    return this._instance;
};