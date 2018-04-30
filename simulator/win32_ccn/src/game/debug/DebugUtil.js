/**
 * Created by GSN on 2/29/2016.
 */


var DebugUtil = DebugUtil || {
        trackLogArr : []
    };

DebugUtil.log = function(logtext, needTrack){
    cc.log(logtext);
    needTrack = needTrack!=undefined ? needTrack: true;
    if(needTrack){
        if(DebugUtil.trackLogArr.length == DebugConfig.MAX_TRACK_STEP)
            DebugUtil.trackLogArr.shift();
        DebugUtil.trackLogArr.push(logtext);
    }
}

DebugUtil.getTrackLog = function(){
    var resultText = "";
    for(var i=0; i< DebugUtil.trackLogArr.length; i++){
        resultText+= DebugUtil.trackLogArr[i];
        resultText+="\n";
    }

    return resultText;
}

DebugUtil.clearTrackLog = function(){
    DebugUtil.trackLogArr = [];
}