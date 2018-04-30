/**
 * Created by GSN on 11/25/2015.
 */

var FocSkill = cc.Class.extend({
    callback : null,


    setCompletedCallback : function(callback){
        this.callback = callback;
    },

    callCompletedCallback : function(){
        if(this.callback!=null)
            this.callback();
    }
});