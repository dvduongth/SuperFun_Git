/**
 * Created by user on 25/1/2016.
 */

var UserDataUtil = {};

UserDataUtil.createSelfFriendData = function(){
    var userData = UserData.getInstance();
    var selfData = new FriendData();
    selfData.uid = userData.uid;
    selfData.displayName = userData.displayName;
    selfData.goldEarnInWeek = userData.gold;
    selfData.level = userData.level;
    selfData.avatarUrl = userData.avatarUrl;
    return selfData;
};

UserDataUtil.sortFriendListByGold = function(){
    UserData.getInstance().friends.sort(function(a, b){return b.goldEarnInWeek>a.goldEarnInWeek});
};

UserDataUtil.getRankIndexByUId = function(uid){
    var friends = UserData.getInstance().friends;
    for (var i=0; i<friends.length; i++){
        if (friends[i].uid = uid){
            return i;
        }
    }
    cc.assert(false,"rank index not found!");
    return -1;
};

UserDataUtil.getCharListSortedByClazzWithMainCharPriority =  function(ascend){
    var userData = UserData.getInstance();
    var newList = [].concat(userData.characterList);
    var mainChar = userData.getCharacterInfoByUID(userData.mainCharUid);
    newList.splice(newList.indexOf(mainChar),1);
    if (ascend)
        newList.sort(function(a, b){return ((b.clazz > a.clazz))});
    else
        newList.sort(function(a, b){return ((b.clazz < a.clazz))});

    newList.splice(0, 0, mainChar);
    return newList;
};

UserDataUtil.sortCharListByClazz =  function(listCharacter, ascend){
    if (ascend)
        listCharacter.sort(function(a, b){return ((b.clazz > a.clazz))});
    else
        listCharacter.sort(function(a, b){return ((b.clazz < a.clazz))});

    return listCharacter;
};


UserDataUtil.getMainCharData = function(){
    return UserData.getInstance().getCharacterInfoByUID(UserData.getInstance().mainCharUid);
};