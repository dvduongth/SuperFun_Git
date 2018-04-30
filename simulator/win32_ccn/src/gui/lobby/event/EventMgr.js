/**
 * Created by CPU11644_LOCAL on 8/30/2017.
 */

var EVENT_ID = {
    TOP_RACE: 0
};

var EventMgr = cc.Class.extend({
    ctor: function() {
        this._super();
        this._listEvent = [];
        cc.error("WWTFFFF");
        return true;
    },

    createOpeningEvents: function(listEventId) {
        for(var i=0; i<listEventId.length; i++) {
            if(this._listEvent[listEventId[i]] != undefined) {
                continue;
            }

            switch(listEventId[i]) {
                case EVENT_ID.TOP_RACE:
                    this._listEvent[EVENT_ID.TOP_RACE] = new EventTopRace();
                    break;
                default:
                    cc.error("Invalid event : " + listEventId[i]);
                    break;
            }
        }
    },

    getEventById: function(eventId) {
        var event = this._listEvent[eventId];
        if(event) {
            return event;
        }
        else {
            cc.error("Don't find event by id " + eventId);
            return null;
        }

    }
});