/**
 * Created by user on 15/8/2016.
 */

fr.GameLog = {

    LOG_ENABLE: 1,

    log: function(logText){
        if (fr.GameLog.LOG_ENABLE){
            cc.log(logText);
        }
    }
};