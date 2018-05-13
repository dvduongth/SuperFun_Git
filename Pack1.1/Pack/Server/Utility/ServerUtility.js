var Enum = require("./../Config/Enum");

// ========================================================
exports.stateToString = function (state) {
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
exports.commandToString = function (command) {
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
exports.matchResultToString = function (result) {
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
exports.blockToString = function(value) {
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
