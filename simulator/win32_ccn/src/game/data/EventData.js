/**
 * Created by GSN on 4/1/2016.
 */

var EventType = {
    FIRST_PAYING : 1,
    CONTINUOUS_LOGIN : 2,
    INVITE_FRIEND : 3,
    PAYING_ACCUMULATE : 4,
    SELFIE_CHARACTER : 5
};

var EventData = cc.Class.extend({

    ctor : function(){
        this.eventID_eventData = [];
    },

    init : function(dataMap){
        this.eventID_eventData = dataMap;
    },

    putEventData : function(eventID, eventData){
        this.eventID_eventData[eventID] = eventData;
    },

    getEventData : function(eventID){
        return this.eventID_eventData[eventID];
    },

    clean : function(){
        this.eventID_eventData=[];
    }
});


EventData.getInstance = function(){
    if (this._instance == null){
        this._instance = new EventData();
    }
    return this._instance;
};