/**
 * Created by GSN on 11/24/2015.
 */

var FocConfig = cc.Class.extend({

    numberTurnNeedToChangeSkill : 2,
    minSuccessRate : 30,
    maxSuccessRate : 70,

    poolConfig : {
        specialPoint : [200, 400, 600, 800],
        activeThresHold : 100,
        overloadThresHold : 900,
        maxCapacity : 1000
    },

    pointResidue : {
        pointResidueSuccess : 10,
        pointResidueFailure : 20,
        pointResidueOverload : 30
    },

    pointRate : {
        pointRateInit : 1,
        pointRateIncStep : 0.5,
        pointRateMax : 3.0,
        numTurnNeedToIncRate : 3
    }
});