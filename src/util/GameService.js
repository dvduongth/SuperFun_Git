var Enum = Enum || {};
// ========================================================
// Tank
Enum.TEAM_1 = 1;
Enum.TEAM_2 = 2;

Enum.TANK_LIGHT = 1;
Enum.TANK_MEDIUM = 2;
Enum.TANK_HEAVY = 3;

Enum.DIRECTION_UP = 1;
Enum.DIRECTION_RIGHT = 2;
Enum.DIRECTION_DOWN = 3;
Enum.DIRECTION_LEFT = 4;
// ========================================================




// ========================================================
// Maps
Enum.BLOCK_GROUND = 0;
Enum.BLOCK_WATER = 1;
Enum.BLOCK_HARD_OBSTACLE = 2;
Enum.BLOCK_SOFT_OBSTACLE = 3;
Enum.BLOCK_BASE = 4;
// ========================================================




// ========================================================
// Bases
Enum.BASE_MAIN = 1;
Enum.BASE_SIDE = 2;
// ========================================================




// ========================================================
// State
Enum.STATE_WAITING_FOR_PLAYERS = 0;
Enum.STATE_TANK_PLACEMENT = 1;
Enum.STATE_ACTION = 2;
Enum.STATE_SUDDEN_DEATH = 3;
Enum.STATE_FINISHED = 4;
// ========================================================





// ========================================================
// Match result
Enum.MATCH_RESULT_NOT_FINISH = 0;
Enum.MATCH_RESULT_TEAM_1_WIN = 1;
Enum.MATCH_RESULT_TEAM_2_WIN = 2;
Enum.MATCH_RESULT_DRAW = 3;
Enum.MATCH_RESULT_BAD_DRAW = 4;

// ========================================================




// ========================================================
// Command
Enum.COMMAND_PING = 0;
Enum.COMMAND_SEND_KEY = 1;
Enum.COMMAND_SEND_TEAM = 2;
Enum.COMMAND_UPDATE_STATE = 3;
Enum.COMMAND_UPDATE_MAP = 4;
Enum.COMMAND_UPDATE_TANK = 5;
Enum.COMMAND_UPDATE_BULLET = 6;
Enum.COMMAND_UPDATE_OBSTACLE = 7;
Enum.COMMAND_UPDATE_BASE = 8;
Enum.COMMAND_REQUEST_CONTROL = 9;
Enum.COMMAND_CONTROL_PLACE = 10;
Enum.COMMAND_CONTROL_UPDATE = 11;
Enum.COMMAND_UPDATE_POWERUP = 12;
Enum.COMMAND_MATCH_RESULT = 13;
Enum.COMMAND_UPDATE_INVENTORY = 14;
Enum.COMMAND_UPDATE_TIME = 15;
Enum.COMMAND_CONTROL_USE_POWERUP = 16;
Enum.COMMAND_UPDATE_STRIKE = 17;
// ========================================================




// ========================================================
// Power up
Enum.POWERUP_AIRSTRIKE = 1;
Enum.POWERUP_EMP = 2;
// ========================================================

var Utility = Utility || {};

// ========================================================
Utility.stateToString = function (state) {
    switch (state) {
        case Enum.STATE_WAITING_FOR_PLAYERS:
            return "Enum.STATE_WAITING_FOR_PLAYERS";
        case Enum.STATE_TANK_PLACEMENT:
            return "Enum.STATE_TANK_PLACEMENT";
        case Enum.STATE_ACTION:
            return "Enum.STATE_ACTION";
        case Enum.STATE_SUDDEN_DEATH:
            return "Enum.STATE_SUDDEN_DEATH";
        case Enum.STATE_FINISHED:
            return "Enum.STATE_FINISHED";
        default :
            return "state is undefined " + state;
    }
};
// ========================================================
// Command
Utility.commandToString = function (command) {
    switch (command) {
        case Enum.COMMAND_PING:
            return "Enum.COMMAND_PING";

        case Enum.COMMAND_SEND_KEY:
            return "Enum.COMMAND_SEND_KEY";

        case Enum.COMMAND_SEND_TEAM:
            return "Enum.COMMAND_SEND_TEAM";

        case Enum.COMMAND_UPDATE_STATE:
            return "Enum.COMMAND_UPDATE_STATE";

        case Enum.COMMAND_UPDATE_MAP:
            return "Enum.COMMAND_UPDATE_MAP";

        case Enum.COMMAND_UPDATE_TANK:
            return "Enum.COMMAND_UPDATE_TANK";

        case Enum.COMMAND_UPDATE_BULLET:
            return "Enum.COMMAND_UPDATE_BULLET";

        case Enum.COMMAND_UPDATE_OBSTACLE:
            return "Enum.COMMAND_UPDATE_OBSTACLE";

        case Enum.COMMAND_UPDATE_BASE:
            return "Enum.COMMAND_UPDATE_BASE";

        case Enum.COMMAND_REQUEST_CONTROL:
            return "Enum.COMMAND_REQUEST_CONTROL";

        case Enum.COMMAND_CONTROL_PLACE:
            return "Enum.COMMAND_CONTROL_PLACE";

        case Enum.COMMAND_CONTROL_UPDATE:
            return "Enum.COMMAND_CONTROL_UPDATE";

        case Enum.COMMAND_UPDATE_POWERUP:
            return "Enum.COMMAND_UPDATE_POWERUP";

        case Enum.COMMAND_MATCH_RESULT:
            return "Enum.COMMAND_MATCH_RESULT";

        case Enum.COMMAND_UPDATE_INVENTORY:
            return "Enum.COMMAND_UPDATE_INVENTORY";

        case Enum.COMMAND_UPDATE_TIME:
            return "Enum.COMMAND_UPDATE_TIME";

        case Enum.COMMAND_CONTROL_USE_POWERUP:
            return "Enum.COMMAND_CONTROL_USE_POWERUP";

        case Enum.COMMAND_UPDATE_STRIKE:
            return "Enum.COMMAND_UPDATE_STRIKE";

        default :
            return "command is undefined " + command;
    }
};
// ========================================================
// Match result
Utility.matchResultToString = function (result) {
    switch (result) {
        case Enum.MATCH_RESULT_NOT_FINISH:
            return "Enum.MATCH_RESULT_NOT_FINISH";

        case Enum.MATCH_RESULT_TEAM_1_WIN:
            return "Enum.MATCH_RESULT_TEAM_1_WIN";

        case Enum.MATCH_RESULT_TEAM_2_WIN:
            return "Enum.MATCH_RESULT_TEAM_2_WIN";

        case Enum.MATCH_RESULT_DRAW:
            return "Enum.MATCH_RESULT_DRAW";

        case Enum.MATCH_RESULT_BAD_DRAW:
            return "Enum.MATCH_RESULT_BAD_DRAW";

        default :
            return "result is undefined " + result;
    }
};
// ========================================================
Utility.blockToString = function(value) {
    switch (value) {
        case Enum.BLOCK_GROUND:
            return "Enum.BLOCK_GROUND";
        case Enum.BLOCK_WATER:
            return "Enum.BLOCK_WATER";
        case Enum.BLOCK_HARD_OBSTACLE:
            return "Enum.BLOCK_HARD_OBSTACLE";
        case Enum.BLOCK_SOFT_OBSTACLE:
            return "Enum.BLOCK_SOFT_OBSTACLE";
        default :
            return "BLOCK UNDEFINED " + value;
    }
};

// ========================================================
Utility.teamToString = function(value) {
    switch (value) {
        case Enum.TEAM_1:
            return "Enum.TEAM_1";
        case Enum.TEAM_2:
            return "Enum.TEAM_2";
        default :
            return "TEAM UNDEFINED " + value;
    }
};


