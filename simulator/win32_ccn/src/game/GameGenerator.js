/**
 * Created by tuanda on 11/10/2015.
 */
//var isSuccess = gv.gameWorld.gameGenerator.randomSkillResult(skillId, skillData);

var GameGenerator = cc.Class.extend(
{
    ctor:function(){
        //this.gameWorld = gameWorld;
    },

    initRandom:function(seed, countOfRandom)
    {
        this.random = new fr.Random(seed, countOfRandom);
    },

    randomSkillResult:function(skillId, chance)
    {
        var success;
        success = this.random.checkSuccess100(chance);
        fr.GameLog.log("RANDOM SKILL: " + skillId + ": with chance = " + chance + ", result = " + success);
        return success;
    },

    getCountOfRandom:function()
    {
        return this.random.countOfRandom;
    }
}
);

GameGenerator.getInstance = function(){
    if (!this._instance){
        this._instance = new GameGenerator();
    }
    return this._instance;
};