/**
 * Created by KienVN on 10/19/2015.
 */
var KEY_ENCRYPT = "ccn_gsn";
fr.LocalStorage = {
    getStringFromKey: function (key, defaultValue)
    {
        var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)|| _.isNaN(val))
            return defaultValue;
        else
            return val;
    },
    setStringFromKey:function(key, value)
    {
        cc.sys.localStorage.setItem(key, value);
    },
    getNumberFromKey:function(key, defaultValue)
    {
        var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)|| _.isNaN(val))
            return defaultValue;
        else
            return Number(val);
    },
    setNumberFromKey:function(key, value)
    {
        cc.sys.localStorage.setItem(key, value);
    },
    getBoolFromKey:function(key, defaultValue)
    {
        var val = cc.sys.localStorage.getItem(key);
        cc.log("getBool: " + val);
        if(_.isNull(val)|| _.isNaN(val) || _.isEmpty())
            return defaultValue;
        else
            return val == 1 ? true : false;
    },
    setBoolFromKey:function(key, value)
    {
        cc.sys.localStorage.setItem(key, value ? 1 : 0);
    },
    setStringWithCrypt:function(key, value)
    {
        var val = CryptoJS.AES.encrypt(value, key);
        cc.sys.localStorage.setItem(key, val.toString());
    },
    getStringWithCrypt:function(key, defaultValue){
        var val = cc.sys.localStorage.getItem(key);
        if(_.isNull(val)|| _.isNaN(val))
            return defaultValue;
        else
            return CryptoJS.AES.decrypt(val,KEY_ENCRYPT).toString(CryptoJS.enc.Utf8);
    }
};