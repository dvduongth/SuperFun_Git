var CANVAS_W = 1180;
var CANVAS_H = 880;

var g_canvas           	= null;
var g_context         	= null;
var g_graphicEngine    	= null;
var g_particleEngine   	= null;
var g_inputEngine      	= null;
var g_stateEngine      	= null;
var g_soundEngine		= null;

var g_particleDef		= null;



var LoadingPhase = {
    LOAD_IMG : 0,
    LOAD_ANI : 1,
    LOAD_SOUND : 2
}

var GuiLoading = BaseGui.extend({
    ctor : function(){
        this._super();
        this.numFileLoaded = 0;
        this.totalFile = 0;
        this.currentLoadPhase = LoadingPhase.LOAD_IMG;
        this.imgList = [];
        this.aniList = [];
        this.soundList = [];

        this.initGui();
    },

    initGui : function(){

        //var size = cc.director.getWinSize();
        //var bg = new cc.Sprite("res/loading/loading_bgr.jpg");
        //var contentSize = bg.getContentSize();
        //var scaleX = size.width/contentSize.width;
        //var scaleY = size.height/contentSize.height;
        //var scale = scaleX>scaleY?scaleX:scaleY;
        //bg.setScale(scale);
        //bg.setPosition(size.width / 2, size.height / 2);
        //this.addChild(bg);

        this._loadingText = ccui.Text(fr.Localization.text("Loading_Phase_"+this.currentLoadPhase), res.FONT_GAME_BOLD, 25);
        this._loadingText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._loadingText.setColor(BaseGui.TEXT_COLOR_BROWN);
        this._loadingText.setPosition(cc.winSize.width/2, 130);
        this.addChild(this._loadingText);

        this.progressBg = fr.createSprite("login_progress_bg.png");
        this.progressBg.setPosition(cc.winSize.width / 2, 74);
        this.addChild(this.progressBg);

        //loading bar
        this._loadingBar = new ccui.LoadingBar();
        this._loadingBar.setName("LoadingBar");
        this._loadingBar.setScale9Enabled(false);
        this._loadingBar.loadTexture("login_progress.png", ccui.Widget.PLIST_TEXTURE);
        this._loadingBar.setCapInsets(cc.rect(0, 0, 0, 0));
        this._loadingBar.setPercent(0);
        this._loadingBar.setPosition(this.progressBg.getPositionX(), this.progressBg.getPositionY()+3);
        this.addChild(this._loadingBar);

        //this.dotFx = fr.createSprite("loading_icon_horse.png");
        //this.dotFx.setPosition(-5, this._loadingBar.getContentSize().height/2);
        //this._loadingBar.addChild(this.dotFx);


        for(var key in resImg){
            this.imgList.push(resImg[key]);
            this.totalFile++;
        }

        //for(var key in resAni){
        //    this.aniList.push({key: key, value: resAni[key]});
        //    this.totalFile++;
        //}

        for(var key in resSound){
            this.soundList.push(resSound[key]);
            this.totalFile++;
        }

        if(this.totalFile != 0) {
            this.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(this.loadNextFile.bind(this))));
        }
        else
            this.onLoadingFinish();

        this.scheduleUpdate();
    },

    loadNextFile : function(){
        cc.log("load next file. loaded: "+this.numFileLoaded+" / "+this.totalFile);

        if(this.currentLoadPhase == LoadingPhase.LOAD_IMG && this.imgList.length == 0){
            this.currentLoadPhase = LoadingPhase.LOAD_ANI;
            this._loadingText.setString(fr.Localization.text("Loading_Phase_"+this.currentLoadPhase));
        }
        if(this.currentLoadPhase == LoadingPhase.LOAD_ANI && this.aniList.length == 0){
            this.currentLoadPhase = LoadingPhase.LOAD_SOUND;
            this._loadingText.setString(fr.Localization.text("Loading_Phase_"+this.currentLoadPhase));
        }

        if(this.currentLoadPhase == LoadingPhase.LOAD_IMG){
            cc.spriteFrameCache.addSpriteFrames(this.imgList.shift());
        }
        else if(this.currentLoadPhase == LoadingPhase.LOAD_ANI){
            //var currPair = this.aniList.shift();
            //fr.AnimationMgr.loadAnimationData(currPair.value, currPair.key);
        }
        else if(this.currentLoadPhase == LoadingPhase.LOAD_SOUND){
            fr.Sound.preloadEffect(this.soundList.shift());
        }

        this.onSingleFileLoaded();
    },

    onSingleFileLoaded : function(){
        this.numFileLoaded++;
        if(this.numFileLoaded == this.totalFile)
            this.onLoadingFinish();
        else
            this.runAction(cc.sequence(cc.delayTime(0.01), cc.callFunc(this.loadNextFile.bind(this))));
    },

    update : function(dt){
        var percent = (this.numFileLoaded / this.totalFile)*100;
        var currPercent = this._loadingBar.getPercent();
        if(currPercent < percent){
            currPercent++;
            if(currPercent > 100) currPercent = 100;
            this._loadingBar.setPercent(currPercent);
            //this.dotFx.x = this._loadingBar.width/100 * currPercent - 5;
            //this.dotFx.y = this._loadingBar.y/3;
        }
    },

    onLoadingFinish : function(){
        this.destroy();
        gv.socialMgr.autoLogin();
        /*g_context = this;
        function Init() {
            g_graphicEngine  = new GraphicEngine();
            g_particleEngine = new ParticleEngine();
            g_inputEngine    = new InputEngine();
            g_stateEngine    = new StateEngine();
            g_soundEngine 	 = new SoundEngine();

            g_particleDef	 = new ParticleDef();

            //CreateCanvas();
            //g_inputEngine.AddEventListener (g_canvas);
            //ResizeCanvas();

            g_stateEngine.SetContext(g_context, g_graphicEngine);
            g_particleEngine.SetContext(g_context, g_graphicEngine);

            //window.onresize = ResizeCanvas;
        }

        Init();

        g_stateEngine.Start();
        GoToLoaderState();*/
    }
});