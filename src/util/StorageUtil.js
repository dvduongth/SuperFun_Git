/**
 * Created by KienVN on 10/19/2015.
 */
//var KEY_ENCRYPT = "poKer_sEa_2234";
var KEY_ENCRYPT = "ccn_gsn";

var StorageKey = {
    SELECTED_SOCIAL_TYPE : "selected_social_type_key",
    SESSION_KEY : "session_key_key"
};

fr.StorageUtil = {

    getStringFromKey: function (key, defaultValue) {
        var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)|| _.isNaN(val))
            return defaultValue;
        else{
            return val;
        }
    },

    setStringFromKey:function(key, value) {
        cc.log("setStringFromKey: ");
        cc.log("Key: "+key);
        cc.log("Value: "+value);

        cc.sys.localStorage.setItem(key, value);
    },

    getNumberFromKey:function(key, defaultValue) {
        var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)|| _.isNaN(val))
            return defaultValue;
        else
            return Number(val);
    },

    setNumberFromKey:function(key, value) {
        cc.sys.localStorage.setItem(key, value);
    },

    getBoolFromKey:function(key, defaultValue) {
        var val = cc.sys.localStorage.getItem(key);
        //cc.log("getBool: " + val);
        if(_.isNull(val)||
            _.isNaN(val) ||
            _.isEmpty(val))
            return defaultValue;
        else
        {
            return val == 1;
            //var valBool = val == 1 ? true : false;
            //return valBool;
        }

    },

    setBoolFromKey:function(key, value) {
        var numVal = value ? 1 : 0;
        cc.sys.localStorage.setItem(key, numVal);
    },

    setStringWithCrypt:function(key, value) {
        try{
            var val = CryptoJS.AES.encrypt(value, KEY_ENCRYPT);
            cc.sys.localStorage.setItem(key, val.toString());
        }
        catch(err){
        }
    },

    getStringWithCrypt:function(key, defaultValue){
        var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)|| _.isNaN(val))
            return defaultValue;
        else{
            return CryptoJS.AES.decrypt(val,KEY_ENCRYPT).toString(CryptoJS.enc.Utf8);
            //var value = CryptoJS.AES.decrypt(val,KEY_ENCRYPT).toString(CryptoJS.enc.Utf8);
            //
            //return value;
        }
    },

};