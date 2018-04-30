/**
 * Created by GSN on 4/21/2016.
 */

var ReconnectHelper = ReconnectHelper || {};

var GameState = {
    WAITING : 0,
    RACE_MINI_GAME : 1,
    PLAYER_IN_FORTUNE : 2,
    PLAYER_ROLL_DICE : 3,
    PLAYER_ACTIVE_PIECE : 4
};

ReconnectHelper.reconnectGame = function(lastDiceResult, nDoubleDice, gameState, params){
    var matchMng = gv.matchMng;
    matchMng.lastDiceResult = lastDiceResult;
    matchMng.numberco
}

ReconnectHelper._reconnectFromWaitng