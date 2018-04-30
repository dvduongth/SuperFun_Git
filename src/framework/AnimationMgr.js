/**
 * Created by GSN on 6/10/2015.
 */

fr.AnimationMgr = {};

fr.AnimationMgr.createAnimationById = function(key, object) {
    return fr.AnimationMgr.createAnimation(resAni[key],key, object);
}

fr.AnimationMgr.createAnimation = function(folderPath, key, object)
{
    fr.AnimationMgr.loadAnimationData(folderPath, key, object);
    return db.DBCCFactory.getInstance().buildArmatureNode(key);
};

fr.AnimationMgr.loadAnimationData = function(folderPath, key, object)
{
    if(object != undefined && object != null)
    {
        if(object.listAnimationLoaded == undefined)
        {
            object.listAnimationLoaded = {};
        }
        if(key in object.listAnimationLoaded)
            return;
        object.listAnimationLoaded[key] = key;
    }
    //cc.log("load: " + folderPath + "/texture.plist");
    db.DBCCFactory.getInstance().loadTextureAtlas(folderPath + "/texture.plist", key);
    db.DBCCFactory.getInstance().loadDragonBonesData(folderPath + "/skeleton.xml", key);

};

fr.AnimationMgr.unloadAllAnimationData = function(object)
{
    if(object.listAnimationLoaded == undefined)
    {
        return;
    }

    for(var keyStored in object.listAnimationLoaded)
    {
        db.DBCCFactory.getInstance().removeTextureAtlas(keyStored,false);
    }
    object.listAnimationLoaded = {};
};

fr.AnimationMgr.preloadAllAnimation = function(object)
{
    for(var key in resAni)
    {
        fr.AnimationMgr.loadAnimationData(resAni[key], key, object);
    }
}