/**
 * Created by KienVN on 11/10/2015.
 */

fr.Random =  cc.Class.extend({
    ctor:function(seed, countOfRandom)
    {
        this.m = new MersenneTwister(seed);
        this.countOfRandom = 0;
        if(countOfRandom)
        {
            for(var i = 0; i < countOfRandom; i++)
            {
                this.random();
            }
        }
    },
    /*
        return a random number between (0 inclusive) and 1 (exclusive)
     */
    random:function()
    {
        this.countOfRandom++;
        return this.m.random();
    },
    randomBool:function()
    {
        return this.random() > 0.5;
    },
    /*
        return a random integer between min (included) and max (excluded)
     */
    randomInt:function(min, max)
    {
        if(max != undefined) {
            return Math.floor(this.random() * (max - min)) + min;
        }
        else{
            return Math.floor(this.random() * (min));
        }
    },

    /*
        return a random integer between min(included) and max(included)
     */
    randomIntInclusive:function(min, max)
    {
        if(max != undefined) {
            return Math.floor(this.random() * (max - min + 1)) + min;
        }
        else{
            return Math.floor(this.random() * (min + 1));
        }
    },

    checkSuccess100:function(p) {
        if ( p < 0 ) {
            p = 0;
        }
        var x = this.randomInt(0);
        DebugUtil.log("checkSuccess100: x = " + x + " , chance = " + p);
        return x < p;
        //if ( x < p ) {
        //    return true;
        //}
        //return false;
        //can return x<p
    }
});