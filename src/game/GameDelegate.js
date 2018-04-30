/**
 * Created by user on 15/3/2017.
 */

var GameDelegate = cc.Class.extend({

    ctor: function(){
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, this.applicationDidEnterBackground.bind(this));
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.applicationWillEnterForeground.bind(this));
    },

    applicationFinished : function () {

    },

    applicationDidEnterBackground : function () {
        cc.log("applicationDidEnterBackground");
    },
    applicationWillEnterForeground : function () {
        cc.log("applicationWillEnterForeground");
    }
});