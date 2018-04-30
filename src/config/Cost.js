/**
 * Created by user on 1/4/2016.
 */

var Cost = cc.Class.extend({
    type : "",  //"GOLD", "G", "TIME
    costValue : 0,

    ctor: function(type, costValue){
        this.type = type;
        this.costValue = costValue;
    }
});
