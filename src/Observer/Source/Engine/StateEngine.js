function StateEngine() {
    var DELTA_TIME_THRESHOLD = 200;
    var FADE_SPEED = 0.003;

    var instance = this;


    this.m_context = null;

    var stateStack = [];
    var newState = null;
    var switching = false;
    var switchStep = 0;
    var switchAlpha = 0;

    this.Update = function (deltaTime) {
        if (deltaTime < DELTA_TIME_THRESHOLD) {
            if (switching == false) {
                if (stateStack.length > 0) {
                    cc.log("StateEngine Update stateStack at index", stateStack.length - 1);
                    stateStack[stateStack.length - 1].Update(deltaTime);
                }else{
                    cc.log("StateEngine Update stateStack is empty");
                }
            }
            //else{
            //    cc.log("StateEngine Update switching");
            //}

            for (var i = 0; i < stateStack.length; i++) {
                cc.log("stateStack at index draw", i);
                stateStack[i].Draw();
            }

            if (switching == true) {
                if (switchStep == 0) {
                    switchAlpha += deltaTime * FADE_SPEED;
                    if (switchAlpha > 1) {
                        switchAlpha = 1;
                        switchStep = 1;

                        cc.log('switching pop and push new', newState != null);
                        stateStack.pop();
                        stateStack.push(newState);
                    }else{
                        cc.log("switching switchAlpha < 1");
                    }
                    g_graphicEngine.FillCanvas(g_context, 255, 255, 255, switchAlpha);
                }
                else if (switchStep == 1) {
                    switchAlpha -= deltaTime * FADE_SPEED;
                    if (switchAlpha < 0) {
                        switchAlpha = 0;
                        switchStep = 0;
                        switching = false;
                    }
                    g_graphicEngine.FillCanvas(g_context, 255, 255, 255, switchAlpha);
                }
            }
        }else{
            cc.log('StateEngine not Update', deltaTime, DELTA_TIME_THRESHOLD);
        }
    };

    this.SwitchState = function (state, fade) {
        cc.log('StateEngine switch state', state != null, fade);
        if (stateStack.length == 0) {
            stateStack.push(state);
        } else {
            if (fade == null) fade = 0;
            if (fade == 0) {
                switchStep = 0;
                switchAlpha = 0;
            } else if (fade == 1) {
                newState = state;
                switchStep = 0;
                switchAlpha = 0;
                switching = true;
            }
        }
    };

    this.PushState = function (state) {
        stateStack.push(state);
    };

    this.PopState = function () {
        stateStack.pop();
    };

    this.Start = function () {
        cc.log('state engine start');
        Update();
    };

    this.SetContext = function (context) {
        this.m_context = context;
    };


    var lastTime = new Date();
    var Update = function () {
        //cc.log('state engine update');
        var curTime = new Date();
        instance.Update(curTime - lastTime);
        lastTime = curTime;
        requestAnimFrame(Update);
    }
}

// Register the main loop here
var requestAnimFrame = (function () {
    return function (callback) {
        //setTimeout(callback, 16);
        setTimeout(callback, 1000);
    };
})();
