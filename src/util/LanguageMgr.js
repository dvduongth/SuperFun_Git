
var storeKey = {
    KEY_USER_LANGUAGE: "key_user_lang"
};

var LanguageMgr = cc.Class.extend({

    ctor: function () {
        this.langData = null;
        this.langName = null;
        this.langName = cc.sys.localStorage.getItem(storeKey.KEY_USER_LANGUAGE);

        if(!this.langName){
            this.langName = LANGUAGE.VIETNAMESE;
            cc.sys.localStorage.setItem(storeKey.KEY_USER_LANGUAGE, this.langName);
        }
        this.prevLanguage = null;

        this.loadLanguage();
    },

    loadLanguage: function () {
        // load text file
        if (!cc.sys.isNative) {
            var data = cc.loader.getRes(this._getLangPack());
            cc.log("text:"+data);
            if (data) {
                this.langData = JSON.parse(data);
            }else{
                cc.error("load language pack failed!");
            }
        } else {
            data = jsb.fileUtils.getStringFromFile(this._getLangPack());
            if (data) {
                this.langData = JSON.parse(data);
            }else{
                cc.error("load language pack failed!");
            }
        }

        if (this.langData) {
            if(this.prevLanguage){
                cc.spriteFrameCache.removeSpriteFramesFromFile(this._getImgPack(this.prevLanguage));
            }
            cc.spriteFrameCache.addSpriteFrames(this._getImgPack(this.langName));

            cc.sys.localStorage.setItem(storeKey.KEY_USER_LANGUAGE,this.langName);
        }
    },

    _getImgPack: function () {
        return "res/localize/" + this.langName + "/img/pack_" + this.langName + ".plist";
    },

    _getLangPack: function () {
        return "res/localize/" + this.langName + "/lang_" + this.langName + ".txt";
    },

    unLoadLanguage: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(this._getImgPack());
    },

    getSpriteFrame: function (key) {
        return cc.spriteFrameCache.getSpriteFrame(this.langData["img"][key]);
    },

    getString: function (key) {
        return this.langData["text"][key] || key;
    },

    getSpriteFrameName: function (key) {
        return this.langData["img"][key];
    },

    getSound: function (key) {
        return this.langData["sound"][key];
    },

    getCurrentLanguage: function(){
        return this.langName;
    },

    changeLanguage:function(name){
        if(this.langName == name) return;

        this.prevLanguage = this.langName;
        this.langName = name;
        this.loadLanguage();
    }

});

//var LANGUAGE = {
//    VIETNAMESE: 'vie',
//    THAI: 'tha',
//    ENGLISH: 'eng'
//};
//
//var NATIONAL = {
//    VIETNAM: 'vi',
//    THAILAND: 'th',
//    ENGLAND: 'en'
//};

LanguageMgr.langEventName = "lang_changed";

//var languageMgr = languageMgr || new LanguageMgr();