// Stuff...
var Enum = require("./Config/Enum");
var Setting = require("./Config/Setting");
var Network = require("./Network");

var ServerUtility = require("./Utility/ServerUtility");

// Game object
var Tank = require("./Objects/Tank");
var Obstacle = require("./Objects/Obstacle");
var Bullet = require("./Objects/Bullet");
var Base = require("./Objects/Base");
var PowerUp = require("./Objects/PowerUp");
var Strike = require("./Objects/Strike");

// Require filesystem
var fs = require('fs');

var rollInt = function (mn, mx) {
    return Math.floor(mn + Math.random() * (1 + mx - mn));
};


// Logger
var Logger;
try {
    Logger = require("./NodeWS/Logger");
}
catch (e) {
    Logger = require("./../NodeWS/Logger");
}
var logger = new Logger();

logger.startLogfile("Pack1.1/Pack/Server/LoggerGame.txt");

module.exports = function Game(key1, key2, replayFilename) {
    var instance = this;
    // Get the map data
    this.m_map = Setting.MAP;

    // Hold all game object here
    this.m_obstacles = [];
    for (var i = 0; i < Setting.MAP_W; i++) {
        for (var j = 0; j < Setting.MAP_H; j++) {
            if (this.m_map[j * Setting.MAP_W + i] == Enum.BLOCK_SOFT_OBSTACLE) {
                var id = this.m_obstacles.length;
                this.m_obstacles.push(new Obstacle(this, id, i, j));
            }
        }
    }

    this.m_tanks = [];
    this.m_tanks[Enum.TEAM_1] = [];
    this.m_tanks[Enum.TEAM_2] = [];

    this.m_bullets = [];
    this.m_bullets[Enum.TEAM_1] = [];
    this.m_bullets[Enum.TEAM_2] = [];

    this.m_inventory = [];
    this.m_inventory[Enum.TEAM_1] = [];
    this.m_inventory[Enum.TEAM_2] = [];

    //le.huathi - init player bases
    this.m_bases = [];
    this.m_bases[Enum.TEAM_1] = [];
    this.m_bases[Enum.TEAM_2] = [];
    this.m_bases[Enum.TEAM_1].push(new Base(this, 0, Setting.BASE_POSITION_1[0][0], Setting.BASE_POSITION_1[0][1], Enum.TEAM_1, Enum.BASE_MAIN));
    this.m_bases[Enum.TEAM_1].push(new Base(this, 1, Setting.BASE_POSITION_1[1][0], Setting.BASE_POSITION_1[1][1], Enum.TEAM_1, Enum.BASE_SIDE));
    this.m_bases[Enum.TEAM_1].push(new Base(this, 2, Setting.BASE_POSITION_1[2][0], Setting.BASE_POSITION_1[2][1], Enum.TEAM_1, Enum.BASE_SIDE));
    this.m_bases[Enum.TEAM_2].push(new Base(this, 0, Setting.BASE_POSITION_2[0][0], Setting.BASE_POSITION_2[0][1], Enum.TEAM_2, Enum.BASE_MAIN));
    this.m_bases[Enum.TEAM_2].push(new Base(this, 1, Setting.BASE_POSITION_2[1][0], Setting.BASE_POSITION_2[1][1], Enum.TEAM_2, Enum.BASE_SIDE));
    this.m_bases[Enum.TEAM_2].push(new Base(this, 2, Setting.BASE_POSITION_2[2][0], Setting.BASE_POSITION_2[2][1], Enum.TEAM_2, Enum.BASE_SIDE));

    this.m_powerUps = [];

    this.m_strikes = [];
    this.m_strikes[Enum.TEAM_1] = [];
    this.m_strikes[Enum.TEAM_2] = [];

    //le.huathi - match result
    this.m_loser = [];
    this.m_loser[Enum.TEAM_1] = false;
    this.m_loser[Enum.TEAM_2] = false;
    this.m_matchResult = Enum.MATCH_RESULT_NOT_FINISH;
    this.m_teamLostSuddenDeath = -1; //for checking if base's destroyed in sudden death mode

    // Internal variables?
    this.m_server = null;
    this.m_player1Index = -1;
    this.m_player2Index = -1;

    this.m_state = Enum.STATE_WAITING_FOR_PLAYERS;
    this.m_loopNumber = 0;
    this.m_spawnPowerUpCount = 0;

    var inventoryDirty = false;
    var loopBeforeEnding = 20;

    // Replay String
    var replayData = [];


    // ==================================================================
    // Start timeout checking here.
    function CheckConnection() {
        if (instance.m_player1Index != -1 && instance.m_player2Index != -1) {
            // Both player has connected, we do nothing
            console.log("Both player has connected, we do nothing");
            logger.print("Both player has connected, we do nothing");
        }
        else {
            if (instance.m_player1Index != -1 && instance.m_player2Index == -1) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
                instance.m_state = Enum.STATE_FINISHED;
            }
            else if (instance.m_player1Index == -1 && instance.m_player2Index != -1) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
                instance.m_state = Enum.STATE_FINISHED;
            }
            else if (instance.m_player1Index == -1 && instance.m_player2Index == -1) {
                instance.m_matchResult = Enum.MATCH_RESULT_BAD_DRAW;
                instance.m_state = Enum.STATE_FINISHED;
            }
            console.log("CheckConnection for start timeout", ServerUtility.matchResultToString(instance.m_matchResult), ServerUtility.stateToString(instance.m_state));
            logger.print("CheckConnection for start timeout " + ServerUtility.matchResultToString(instance.m_matchResult) + " " + ServerUtility.stateToString(instance.m_state));
            matchResultPacket = instance.GetMatchResultPackage();
            stateUpdatePacket = instance.GetStateUpdatePacket();

            instance.Broadcast(stateUpdatePacket + matchResultPacket);
            instance.AddToReplay(matchResultPacket);

            setTimeout(function () {
                instance.SaveReplay();
            }, 2000);
        }
    }

    setTimeout(CheckConnection, Setting.CONNECTION_TIMEOUT);

    function CheckPickTank() {
        console.log("game check pick tank");
        logger.print("game check pick tank");
        if (instance.m_tanks[Enum.TEAM_1].length == Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length == Setting.NUMBER_OF_TANK) {
            console.log("both player are get max number of tank");
            logger.print("both player are get max number of tank");
        }
        else {
            if (instance.m_tanks[Enum.TEAM_1].length < Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length < Setting.NUMBER_OF_TANK) {
                instance.m_matchResult = Enum.MATCH_RESULT_BAD_DRAW;
                instance.m_state = Enum.STATE_FINISHED;
            }
            else if (instance.m_tanks[Enum.TEAM_1].length == Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length < Setting.NUMBER_OF_TANK) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
                instance.m_state = Enum.STATE_FINISHED;
            }
            else if (instance.m_tanks[Enum.TEAM_1].length < Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length == Setting.NUMBER_OF_TANK) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
                instance.m_state = Enum.STATE_FINISHED;
            }

            matchResultPacket = instance.GetMatchResultPackage();
            stateUpdatePacket = instance.GetStateUpdatePacket();

            instance.Broadcast(stateUpdatePacket + matchResultPacket);
            instance.AddToReplay(matchResultPacket);

            setTimeout(function () {
                console.log("Game SaveReplay on setTimeout");
                logger.print("Game SaveReplay on setTimeout");
                instance.SaveReplay();
            }, 2000);
        }
    }


    // ==================================================================

    // ==================================================================
    // Basic network command
    this.SetServerInstance = function (server) {
        instance.m_server = server;
    };
    this.Send = function (player, data) {
        console.log('game request send data to player', player, data.length);
        logger.print('game request send data to player ' + player + " " + data.length);
        if (data.length >= 26) {
            console.error("Game Send big data with data.length", data.length);
            logger.print("Game Send big data with data.length " + data.length);
        }
        if (instance.m_server) {
            instance.m_server.Send(player, data);
        }
    };
    this.Broadcast = function (data) {
        console.log("game request broadcast data.length", data.length);
        logger.print("game request broadcast data.length " + data.length);
        if (data.length >= 26) {
            console.error("Game Broadcast big data with data.length", data.length);
            logger.print("Game Broadcast big data with data.length " + data.length);
        }
        if (instance.m_server) {
            instance.m_server.Broadcast(data);
        }
    };


    this.OnCommand = function (sender, data) {
        console.log("game on command");
        logger.print("game on command");
        var readOffset = 0;
        while (true) {
            var command = Network.DecodeUInt8(data, readOffset);
            readOffset++;
            console.log("game command", ServerUtility.commandToString(command));
            logger.print("game command " + ServerUtility.commandToString(command));
            console.log("wait for both player are connected. State:", ServerUtility.stateToString(instance.m_state));
            logger.print("wait for both player are connected. State: " + ServerUtility.stateToString(instance.m_state));
            if (command == Enum.COMMAND_PING) {
                // Receive a ping? Just send it back.
                console.log("game send ping");
                logger.print("game send ping");
                instance.Send(sender, data);
            }
            else if (command == Enum.COMMAND_SEND_KEY) {
                var announceTeamPacket = "";

                var key = Network.DecodeInt8(data, readOffset);
                readOffset++;

                // If the one who've just connected have a correct key
                if (key == key1 || key == key2) {
                    var team;
                    if (key == key1) {
                        instance.m_player1Index = sender;
                        team = Enum.TEAM_1;
                    }
                    if (key == key2) {
                        instance.m_player2Index = sender;
                        team = Enum.TEAM_2;
                    }
                    // Prepare to tell him his team id.
                    // We merge this packet to fullsync and send it below.
                    announceTeamPacket += Network.EncodeUInt8(Enum.COMMAND_SEND_TEAM);
                    announceTeamPacket += Network.EncodeUInt8(team);
                }

                // Send full sync, so everyone can setup their own data
                console.log("game send key", team, key);
                logger.print("game send key team " + team + " key " + key);
                instance.Send(sender, announceTeamPacket + instance.GetFullSyncPacket());

                // When both player are connected
                // Change to state place tank, and announce to all party
                if (instance.m_state == Enum.STATE_WAITING_FOR_PLAYERS && instance.m_player1Index != -1 && instance.m_player2Index != -1) {
                    console.log("Change to state place tank, and announce to all party");
                    logger.print("Change to state place tank, and announce to all party");
                    instance.m_state = Enum.STATE_TANK_PLACEMENT;
                    instance.Broadcast(instance.GetStateUpdatePacket());

                    setTimeout(CheckPickTank, Setting.PICK_TANK_TIMEOUT);
                } else {
                    console.log("wait for both player are connected. State:", ServerUtility.stateToString(instance.m_state), ". m_player1Index:", instance.m_player1Index, ". m_player2Index:", instance.m_player2Index);
                    logger.print("wait for both player are connected. State: " + ServerUtility.stateToString(instance.m_state) + " . m_player1Index: " + instance.m_player1Index + " . m_player2Index: " + instance.m_player2Index);
                }
            }
            else if (command == Enum.COMMAND_CONTROL_PLACE) {
                // Only allow to place tank during this state
                console.log('command control place. Only allow to place tank during this state');
                logger.print('command control place. Only allow to place tank during this state');
                if (instance.m_state == Enum.STATE_TANK_PLACEMENT) {
                    // Who send?
                    var team = -1;
                    if (sender == instance.m_player1Index) {
                        team = Enum.TEAM_1;
                    }
                    else if (sender == instance.m_player2Index) {
                        team = Enum.TEAM_2;
                    }

                    // Oh, the correct player sent it.
                    console.log('Oh, the correct player sent it, state tank placement');
                    logger.print('Oh, the correct player sent it, state tank placement');
                    console.log('Who send?', team);
                    logger.print('Who send? ' + team);
                    if (team == Enum.TEAM_1 || team == Enum.TEAM_2) {
                        var type = Network.DecodeUInt8(data, readOffset);
                        readOffset++;
                        var x = Network.DecodeUInt8(data, readOffset);
                        readOffset++;
                        var y = Network.DecodeUInt8(data, readOffset);
                        readOffset++;
                        console.log('perform pick tank');
                        logger.print('perform pick tank');
                        instance.PickTank(team, type, x, y);
                    } else {
                        console.log('Who send? not define');
                        logger.print('Who send? not define');
                    }

                    // When enough tank picked, start the game.
                    if (instance.m_tanks[Enum.TEAM_1].length == Setting.NUMBER_OF_TANK && instance.m_tanks[Enum.TEAM_2].length == Setting.NUMBER_OF_TANK) {
                        console.log('When enough tank picked, start the game.');
                        logger.print('When enough tank picked, start the game.');
                        instance.m_state = Enum.STATE_ACTION;
                        var fullSyncPacket = instance.GetFullSyncPacket();
                        instance.Broadcast(fullSyncPacket);
                        instance.AddToReplay(fullSyncPacket);
                        instance.Start();
                    } else {
                        console.log('not enough tank picked, wait ...');
                        logger.print('not enough tank picked, wait ...');
                    }
                } else {
                    console.log('not state tank placement');
                    logger.print('not state tank placement');
                }
            }
            else if (command == Enum.COMMAND_CONTROL_UPDATE) {
                console.log('command control update');
                logger.print('command control update');
                // Who send?
                var team = -1;
                if (sender == instance.m_player1Index) {
                    team = Enum.TEAM_1;
                }
                else if (sender == instance.m_player2Index) {
                    team = Enum.TEAM_2;
                }
                console.log('Who send?', team);
                logger.print('Who send? ' + team);
                // Oh, the correct player sent it.
                if (team == Enum.TEAM_1 || team == Enum.TEAM_2) {
                    var id = Network.DecodeUInt8(data, readOffset);
                    readOffset++;
                    var dir = Network.DecodeUInt8(data, readOffset);
                    readOffset++;
                    var move = Network.DecodeUInt8(data, readOffset);
                    readOffset++;
                    var shoot = Network.DecodeUInt8(data, readOffset);
                    readOffset++;

                    console.log('turn tank id', id, 'dir', dir);
                    logger.print('turn tank id ' + id + ' dir ' + dir);
                    instance.m_tanks[team][id].Turn(dir);
                    if (move) {
                        console.log('move tank id', id);
                        logger.print('move tank id ' + id);
                        instance.m_tanks[team][id].Move();
                    }
                    if (shoot) {
                        console.log('tank shoot id', id);
                        logger.print('tank shoot id ' + id);
                        instance.m_tanks[team][id].Shoot();
                    }
                } else {
                    console.log('Who send? not define');
                    logger.print('Who send? not define');
                }
            }
            else if (command == Enum.COMMAND_CONTROL_USE_POWERUP) {
                console.log('command control use powerup');
                logger.print('command control use powerup');
                // Who send?
                var team = -1;
                if (sender == instance.m_player1Index) {
                    team = Enum.TEAM_1;
                }
                else if (sender == instance.m_player2Index) {
                    team = Enum.TEAM_2;
                }
                console.log('Who send? ', team);
                logger.print('Who send? ' + team);

                // Oh, the correct player sent it.
                if (team == Enum.TEAM_1 || team == Enum.TEAM_2) {
                    console.log('Oh, the correct player sent it.', team);
                    logger.print('Oh, the correct player sent it.', team);
                    var powerup = Network.DecodeUInt8(data, readOffset);
                    readOffset++;
                    var x = Network.DecodeFloat32(data, readOffset);
                    readOffset += 4;
                    var y = Network.DecodeFloat32(data, readOffset);
                    readOffset += 4;

                    console.log('use power up team', team, x, y);
                    logger.print('use power up team ' + team + " x " + x + " y " + y);
                    instance.UsePowerUp(team, powerup, x, y);
                } else {
                    console.log('Oop, the invalid player sent it.');
                    logger.print('Oop, the invalid player sent it.');
                }

            }
            else {
                // TODO: What should we do when an invalid command is issued?
                console.log("Invalid command id: " + command);
                logger.print("Invalid command id: " + command);
                return;
            }

            // Break when the end of the packet reach
            if (readOffset >= data.length) {
                console.log('The end of the packet reach ok');
                logger.print('The end of the packet reach ok');
                break;
            }
        }
    };
    // ==================================================================


    // ==================================================================
    // Package handling
    this.GetStateUpdatePacket = function () {
        var packet = "";
        packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_STATE);
        packet += Network.EncodeUInt8(instance.m_state);
        return packet;
    };
    this.GetUpdatePacket = function (force) {
        // Command
        var packet = "";

        // Time
        packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_TIME);
        packet += Network.EncodeInt16(Setting.LOOPS_MATCH_END - instance.m_loopNumber);


        // Tank
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_1].length; i++) {
            packet += instance.m_tanks[Enum.TEAM_1][i].ToPacket(force);
        }
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_2].length; i++) {
            packet += instance.m_tanks[Enum.TEAM_2][i].ToPacket(force);
        }

        // Bullet
        for (var i = 0; i < instance.m_bullets[Enum.TEAM_1].length; i++) {
            packet += instance.m_bullets[Enum.TEAM_1][i].ToPacket(force);
        }
        for (var i = 0; i < instance.m_bullets[Enum.TEAM_2].length; i++) {
            packet += instance.m_bullets[Enum.TEAM_2][i].ToPacket(force);
        }

        //Obstacles
        for (var i = 0; i < instance.m_obstacles.length; i++) {
            packet += instance.m_obstacles[i].ToPacket(force);
        }

        // Bases
        for (var i = 0; i < instance.m_bases[Enum.TEAM_1].length; i++) {
            packet += instance.m_bases[Enum.TEAM_1][i].ToPacket(force);
        }
        for (var i = 0; i < instance.m_bases[Enum.TEAM_2].length; i++) {
            packet += instance.m_bases[Enum.TEAM_2][i].ToPacket(force);
        }

        // Power Up
        for (var i = 0; i < instance.m_powerUps.length; i++) {
            packet += instance.m_powerUps[i].ToPacket(force);
        }

        // Strike
        for (var i = 0; i < instance.m_strikes[Enum.TEAM_1].length; i++) {
            packet += instance.m_strikes[Enum.TEAM_1][i].ToPacket(force);
        }
        for (var i = 0; i < instance.m_strikes[Enum.TEAM_2].length; i++) {
            packet += instance.m_strikes[Enum.TEAM_2][i].ToPacket(force);
        }


        // Inventory
        packet += instance.GetInventoryPacket(false);

        return packet;
    };
    this.GetInventoryPacket = function (force) {
        var packet = "";

        if (force || inventoryDirty) {
            // Code
            packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_INVENTORY);

            // Number of power up belong to team 1
            packet += Network.EncodeUInt8(instance.m_inventory[Enum.TEAM_1].length);
            // Each of them
            for (var i = 0; i < instance.m_inventory[Enum.TEAM_1].length; i++) {
                packet += Network.EncodeUInt8(instance.m_inventory[Enum.TEAM_1][i]);
            }

            // Number of power up belong to team 2
            packet += Network.EncodeUInt8(instance.m_inventory[Enum.TEAM_2].length);
            // Each of them
            for (var i = 0; i < instance.m_inventory[Enum.TEAM_2].length; i++) {
                packet += Network.EncodeUInt8(instance.m_inventory[Enum.TEAM_2][i]);
            }
        }

        inventoryDirty = false;

        return packet;
    };
    this.GetFullSyncPacket = function () {
        // Command
        var packet = "";
        packet += instance.GetStateUpdatePacket();

        // Map - (not this way)
        packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_MAP);

        //var mTest = [];
        for (var i = 0; i < Setting.MAP_W; i++) {
            //var tempTest = [];
            for (var j = 0; j < Setting.MAP_H; j++) {
                packet += Network.EncodeUInt8(instance.m_map[j * Setting.MAP_W + i]);
                //packet += Network.EncodeInt8(instance.m_map[j * Setting.MAP_W + i]);
                //tempTest.push(Network.DecodeUInt8(Network.EncodeUInt8(instance.m_map[j * Setting.MAP_W + i])));
            }
            //mTest.push(tempTest.join(", "));
        }
        //console.log("Game GetFullSyncPacket Enum.COMMAND_UPDATE_MAP\n", mTest.join("\n"));

        packet += instance.GetInventoryPacket(true);
        packet += instance.GetUpdatePacket(true);

        console.log("Game GetFullSyncPacket Enum.COMMAND_UPDATE_MAP with packet.length", packet.length);
        logger.print("Game GetFullSyncPacket Enum.COMMAND_UPDATE_MAP with packet.length " + packet.length);
        return packet;
    };


    this.GetMatchResultPackage = function () {
        // Command
        var packet = Network.EncodeUInt8(Enum.COMMAND_MATCH_RESULT);
        // match result
        packet += Network.EncodeUInt8(instance.m_matchResult);
        return packet;
    };
    // ==================================================================


    // ==================================================================
    // Game logic
    /**
     * @return boolean
     * */
    this.PickTank = function (player, type, x, y) {
        console.log('pick tank', player, type, x, y);
        logger.print('pick tank ' + player + " type " + type + " x " + x + " y " + y);
        // Check if this player have picked enough tank
        if (instance.m_tanks[player].length == Setting.NUMBER_OF_TANK) {
            console.log("Player " + player + " tried to pick more tank than he is allowed.");
            logger.print("Player " + player + " tried to pick more tank than he is allowed.");
            return false;
        }
        // Check if tank is out of map
        if (x < 0 || x > 22 || y < 0 || y > 22) {
            console.log("Player " + player + " tried to place a tank out side of the map.");
            logger.print("Player " + player + " tried to place a tank out side of the map.");
            return false;
        }
        // Check if tank is out of base
        if (player == Enum.TEAM_1 && x > 7) {
            console.log("Player " + player + " tried to place a tank out side of his base.");
            logger.print("Player " + player + " tried to place a tank out side of his base.");
            return false;
        }
        else if (player == Enum.TEAM_2 && x < 14) {
            console.log("Player " + player + " tried to place a tank out side of his base.");
            logger.print("Player " + player + " tried to place a tank out side of his base.");
            return false;
        }
        // Check collision with map
        if (instance.m_map[y * Setting.MAP_W + x] != Enum.BLOCK_GROUND) {
            console.log("Player " + player + " tried to place a tank on an obstacles.");
            logger.print("Player " + player + " tried to place a tank on an obstacles.");
            return false;
        }
        // Check collision with other tank
        for (var i = 0; i < instance.m_tanks[player].length; i++) {
            if (instance.m_tanks[player][i].m_x == x && instance.m_tanks[player][i].m_y == y) {
                console.log("Player " + player + " tried to place a tank on another tank.");
                logger.print("Player " + player + " tried to place a tank on another tank.");
                return false;
            }
        }
        // Check collision with base building
        if (instance.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_BASE) {
            console.log("Player " + player + " tried to place a tank on a base.");
            logger.print("Player " + player + " tried to place a tank on a base.");
            return false;
        }

        // All valid
        console.log('All valid');
        logger.print('All valid');
        var id = instance.m_tanks[player].length;
        var tempTank = new Tank(instance, id, x, y, player, type);
        console.log('push tank id', id, x, y, player, type);
        logger.print('push tank id ' + id + " x " + x + " y " + y + " player " + player + " type " + type);
        instance.m_tanks[player].push(tempTank);

        return true;
    };

    this.Fire = function (tank) {
        var team = tank.m_team;
        var bullet = null;
        for (var i = 0; i < instance.m_bullets[team].length; i++) {
            if (instance.m_bullets[team][i].m_live == false && instance.m_bullets[team][i].m_needToAnnounceHit == false) {
                bullet = instance.m_bullets[team][i];
            }
        }

        if (bullet == null) {
            var id = instance.m_bullets[team].length;
            bullet = new Bullet(instance, team, id);
            instance.m_bullets[team][id] = bullet;
        }
        bullet.Fire(tank.m_x, tank.m_y, tank.m_type, tank.m_direction);
    };

    this.SpawnPowerUp = function () {
        console.log('game spawn power up');
        logger.print('game spawn power up');
        for (var i = 0; i < instance.m_powerUps.length; i++) {
            if (instance.m_powerUps[i].m_active == false) {
                instance.m_powerUps[i].Spawn();
                return;
            }
        }

        var newPowerUp = new PowerUp(instance, instance.m_powerUps.length);
        instance.m_powerUps.push(newPowerUp);
        newPowerUp.Spawn();
    };

    this.AcquirePowerup = function (team, powerUp) {
        instance.m_inventory[team].push(powerUp);
        inventoryDirty = true;
    };


    this.UsePowerUp = function (team, powerup, x, y) {
        console.log('game use power up');
        logger.print('game use power up');
        var checkOK = false;

        for (var i = 0; i < instance.m_inventory[team].length; i++) {
            if (instance.m_inventory[team][i] == powerup) {
                instance.m_inventory[team].splice(i, 1);
                inventoryDirty = true;
                checkOK = true;
                break;
            }
        }

        if (checkOK) {
            var strike = null;
            for (var i = 0; i < instance.m_strikes[team].length; i++) {
                if (instance.m_strikes[team][i].m_live == false) {
                    strike = instance.m_strikes[team][i];
                }
            }

            if (strike == null) {
                var id = instance.m_strikes[team].length;
                strike = new Strike(instance, id, team);
                instance.m_strikes[team][id] = strike;
            }
            console.log('strike spawn ', x, y);
            logger.print('strike spawn x ' + x + " y " + y);
            strike.Spawn(powerup, x, y);
        }
    };


    this.Start = function () {
        console.log('game start');
        logger.print('game start');
        setInterval(instance.Update, Setting.TIME_UPDATE_INTERVAL);
        instance.SpawnPowerUp();
    };

    this.CloseServer = function () {
        console.log("Game CloseServer");
        logger.print("Game CloseServer");
        logger.closeLogfile();
        instance.m_server.CloseServer();
    };

    this.AddToReplay = function (data) {
        //console.log('Game AddToReplay');
        if (replayFilename != null) {
            console.log('add to replay');
            logger.print('add to replay');
            console.log('replayFilename', replayFilename);
            logger.print('replayFilename ' + replayFilename);
            replayData.push(Network.EncodeUInt16(data.length) + data);
        } else {
            //console.log('replayFilename is null', replayFilename);
        }
    };
    this.SaveReplay = function () {
        console.log("Game SaveReplay");
        logger.print("Game SaveReplay");
        if (replayFilename != null) {
            var replayString = "";
            for (var i = 0; i < replayData.length; i++)
                replayString += replayData[i];

            var buffer = new Buffer(replayString);
            var path = replayFilename;

            fs.open(path, 'w', function (err, fd) {
                if (err) {
                    instance.CloseServer();
                }

                fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                    if (err) {
                        instance.CloseServer();
                    }

                    fs.close(fd, function () {
                        instance.CloseServer();	// Close server after done writing replay string to file
                    });
                });
            });
        } else {
            instance.CloseServer();
        }
    };

    this.Update = function () {
        // If game has result,
        if (instance.m_matchResult != Enum.MATCH_RESULT_NOT_FINISH) {
            loopBeforeEnding--;
            //Save replay, CloseServer will be called after done writing replay string to file
            if (loopBeforeEnding == 0) {
                instance.SaveReplay();
                logger.print("Save replay, CloseServer will be called after done writing replay string to file");
                return console.log("Save replay, CloseServer will be called after done writing replay string to file");
            } else if (loopBeforeEnding < 0) {
                logger.print("Game Update return loopBeforeEnding < 0");
                return console.log("Game Update return loopBeforeEnding < 0");
            }
        }

        instance.m_loopNumber++;

        instance.m_spawnPowerUpCount++;
        if (instance.m_spawnPowerUpCount >= Setting.POWERUP_INTERVAL) {
            instance.m_spawnPowerUpCount -= Setting.POWERUP_INTERVAL;
            instance.SpawnPowerUp();
        }

        // Update all tank
        console.log("Game Update num tank of TEAM_1 " + instance.m_tanks[Enum.TEAM_1].length);
        logger.print("Game Update num tank of TEAM_1 " + instance.m_tanks[Enum.TEAM_1].length);
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_1].length; i++) {
            instance.m_tanks[Enum.TEAM_1][i].Update();
        }
        console.log("Game Update num tank of TEAM_2 " + instance.m_tanks[Enum.TEAM_2].length);
        logger.print("Game Update num tank of TEAM_2 " + instance.m_tanks[Enum.TEAM_2].length);
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_2].length; i++) {
            instance.m_tanks[Enum.TEAM_2][i].Update();
        }

        // Update all bullet
        console.log("Game Update number bullets of TEAM_1 " + instance.m_bullets[Enum.TEAM_1].length);
        logger.print("Game Update number bullets of TEAM_1 " + instance.m_bullets[Enum.TEAM_1].length);
        for (var i = 0; i < instance.m_bullets[Enum.TEAM_1].length; i++) {
            instance.m_bullets[Enum.TEAM_1][i].Update();
        }
        console.log("Game Update number bullets of TEAM_2 " + instance.m_bullets[Enum.TEAM_2].length);
        logger.print("Game Update number bullets of TEAM_2 " + instance.m_bullets[Enum.TEAM_2].length);
        for (var i = 0; i < instance.m_bullets[Enum.TEAM_2].length; i++) {
            instance.m_bullets[Enum.TEAM_2][i].Update();
        }

        // Update all runes
        console.log("Game Update number PowerUps " + instance.m_powerUps.length);
        logger.print("Game Update number PowerUps " + instance.m_powerUps.length);
        for (var i = 0; i < instance.m_powerUps.length; i++) {
            instance.m_powerUps[i].Update();
        }

        // Update all strike
        console.log("Game Update number strikes of TEAM_1 " + instance.m_strikes[Enum.TEAM_1].length);
        logger.print("Game Update number strikes of TEAM_1 " + instance.m_strikes[Enum.TEAM_1].length);
        for (var i = 0; i < instance.m_strikes[Enum.TEAM_1].length; i++) {
            instance.m_strikes[Enum.TEAM_1][i].Update();
        }
        console.log("Game Update number strikes of TEAM_2 " + instance.m_strikes[Enum.TEAM_2].length);
        logger.print("Game Update number strikes of TEAM_2 " + instance.m_strikes[Enum.TEAM_2].length);
        for (var i = 0; i < instance.m_strikes[Enum.TEAM_2].length; i++) {
            instance.m_strikes[Enum.TEAM_2][i].Update();
        }

        var stateUpdatePacket = "";
        var matchResultPacket = "";
        if (instance.m_matchResult == Enum.MATCH_RESULT_NOT_FINISH) {
            console.log("Game Update instance.m_matchResult == Enum.MATCH_RESULT_NOT_FINISH -- check win-lost if match isn't finished");
            logger.print("Game Update instance.m_matchResult == Enum.MATCH_RESULT_NOT_FINISH -- check win-lost if match isn't finished");
            //le.huathi - check win-lost if match isn't finished
            if ((instance.m_matchResult == Enum.MATCH_RESULT_NOT_FINISH) && (instance.CheckWinLost())) {
                instance.m_state = Enum.STATE_FINISHED;
                matchResultPacket = instance.GetMatchResultPackage();
                stateUpdatePacket = instance.GetStateUpdatePacket();
                console.log("Game Update instance.m_state = Enum.STATE_FINISHED");
                logger.print("Game Update instance.m_state = Enum.STATE_FINISHED");
            }
            //Should turn on sudden death mode?
            else if ((instance.m_state == Enum.STATE_ACTION) && (instance.m_loopNumber >= Setting.LOOPS_SUDDEN_DEATH)) {
                instance.SetSuddenDeathMode();
                stateUpdatePacket = instance.GetStateUpdatePacket();
                console.log("Game Update Should turn on sudden death mode");
                logger.print("Game Update Should turn on sudden death mode");
            }
            //or time's up?
            else if ((instance.m_state == Enum.STATE_SUDDEN_DEATH) && (instance.m_loopNumber >= Setting.LOOPS_MATCH_END)) {
                instance.ProcessTimeUp();
                matchResultPacket = instance.GetMatchResultPackage();
                stateUpdatePacket = instance.GetStateUpdatePacket();
                console.log("Game Update time's up");
                logger.print("Game Update time's up");
            }
        }

        // Broadcast all that changed, and add a request control input from player here.
        var requestControlPacket = "";
        requestControlPacket += Network.EncodeUInt8(Enum.COMMAND_REQUEST_CONTROL);

        var updatePacket = instance.GetUpdatePacket(false);
        instance.Broadcast(stateUpdatePacket + updatePacket + requestControlPacket + matchResultPacket);

        instance.AddToReplay(stateUpdatePacket + updatePacket + matchResultPacket);
    };

    /**
     * @return boolean
     * */
    this.CheckWinLost = function () {
        var hasLoser = false;
        // Check bases
        for (var i = 0; i < instance.m_bases[Enum.TEAM_1].length; i++) {
            if ((instance.m_bases[Enum.TEAM_1][i].m_type == Enum.BASE_MAIN) && (instance.m_bases[Enum.TEAM_1][i].m_HP == 0)) {
                instance.m_loser[Enum.TEAM_1] = true;
                hasLoser = true;
            }
        }
        for (var i = 0; i < instance.m_bases[Enum.TEAM_2].length; i++) {
            if ((instance.m_bases[Enum.TEAM_2][i].m_type == Enum.BASE_MAIN) && (instance.m_bases[Enum.TEAM_2][i].m_HP == 0)) {
                instance.m_loser[Enum.TEAM_2] = true;
                hasLoser = true;
            }
        }
        if (hasLoser) {
            if (instance.m_loser[Enum.TEAM_1] == instance.m_loser[Enum.TEAM_2]) { //both team lost the main base
                if (instance.CheckWinLostTimeUp()) {
                    instance.m_matchResult = (instance.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
                }
                else {
                    instance.m_matchResult = Enum.MATCH_RESULT_DRAW;
                }
            }
            else if (instance.m_loser[Enum.TEAM_1] == false) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
            }
            else {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
            }
            return true;
        }

        // Check tanks
        var dieCount = 0;
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_1].length; i++) {
            if (instance.m_tanks[Enum.TEAM_1][i].m_HP == 0)
                dieCount++;
        }
        if (dieCount == instance.m_tanks[Enum.TEAM_1].length) {
            //TEAM_1 lost!!!
            instance.m_loser[Enum.TEAM_1] = true;
            hasLoser = true;
        }

        dieCount = 0;
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_2].length; i++) {
            if (instance.m_tanks[Enum.TEAM_2][i].m_HP == 0)
                dieCount++;
        }
        if (dieCount == instance.m_tanks[Enum.TEAM_2].length) {
            //TEAM_1 lost!!!
            instance.m_loser[Enum.TEAM_2] = true;
            hasLoser = true;
        }

        if (hasLoser) {
            if (instance.m_loser[Enum.TEAM_1] == instance.m_loser[Enum.TEAM_2]) {
                if (instance.CheckWinLostTimeUp())
                    instance.m_matchResult = (instance.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
                else
                    instance.m_matchResult = Enum.MATCH_RESULT_DRAW;
            }
            else if (instance.m_loser[Enum.TEAM_1] == false) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
            }
            else {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
            }
            return true;
        }

        //Check win-lost in SuddenDeath mode
        if ((instance.m_state == Enum.STATE_SUDDEN_DEATH) && (instance.m_teamLostSuddenDeath != -1)) {
            if (instance.m_teamLostSuddenDeath == Enum.TEAM_1) {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_2_WIN;
                instance.m_loser[Enum.TEAM_1] = true;
            }
            else {
                instance.m_matchResult = Enum.MATCH_RESULT_TEAM_1_WIN;
                instance.m_loser[Enum.TEAM_2] = true;
            }
            return true;
        }

        return false;
    };
    /**
     * @return boolean
     * */
    this.CheckWinLostTimeUp = function () {
        //Check bases living
        var count1 = 0;
        var count2 = 0;
        for (var i = 0; i < instance.m_bases[Enum.TEAM_1].length; i++) {
            if (instance.m_bases[Enum.TEAM_1][i].m_HP > 0) {
                count1++;
            }
        }
        for (var i = 0; i < instance.m_bases[Enum.TEAM_2].length; i++) {
            if (instance.m_bases[Enum.TEAM_2][i].m_HP > 0) {
                count2++;
            }
        }

        if (count1 < count2) {
            //must set both values because function CheckWinLost need both
            instance.m_loser[Enum.TEAM_1] = true;
            instance.m_loser[Enum.TEAM_2] = false;
            return true;
        }
        else if (count1 > count2) {
            //must set both values because function CheckWinLost need both
            instance.m_loser[Enum.TEAM_1] = false;
            instance.m_loser[Enum.TEAM_2] = true;
            return true;
        }

        //Same bases count -> check tanks living
        count1 = 0;
        count2 = 0;
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_1].length; i++) {
            if (instance.m_tanks[Enum.TEAM_1][i].m_HP > 0)
                count1++;
        }
        for (var i = 0; i < instance.m_tanks[Enum.TEAM_2].length; i++) {
            if (instance.m_tanks[Enum.TEAM_2][i].m_HP > 0)
                count2++;
        }
        if (count1 < count2) {
            instance.m_loser[Enum.TEAM_1] = true;
            instance.m_loser[Enum.TEAM_2] = false;
            return true;
        }
        else if (count1 > count2) {
            instance.m_loser[Enum.TEAM_1] = false;
            instance.m_loser[Enum.TEAM_2] = true;
            return true;
        }

        //Still the same?
        return false;
    };

    this.ProcessTimeUp = function () {
        if (instance.CheckWinLostTimeUp()) {
            instance.m_matchResult = (instance.m_loser[Enum.TEAM_1] == false) ? Enum.MATCH_RESULT_TEAM_1_WIN : Enum.MATCH_RESULT_TEAM_2_WIN;
            console.log("ProcessTimeUp, match result: " + instance.m_matchResult);
            logger.print("ProcessTimeUp, match result: " + instance.m_matchResult);
        }
        else { //need more checking here, if no base's destroyed -> DRAW_NEGATIVE
            var count = 0;
            for (var i = 0; i < instance.m_bases[Enum.TEAM_1].length; i++) {
                if (instance.m_bases[Enum.TEAM_1][i].m_HP == 0) {
                    count++;
                    break;
                }
            }
            for (var i = 0; i < instance.m_tanks[Enum.TEAM_1].length; i++) {
                if (instance.m_tanks[Enum.TEAM_1][i].m_HP == 0) {
                    count++;
                    break;
                }
            }
            if (count > 0) {
                instance.m_matchResult = Enum.MATCH_RESULT_DRAW;
            }
            else {
                instance.m_matchResult = Enum.MATCH_RESULT_BAD_DRAW;
            }
            console.log("ProcessTimeUp case 2, match result: " + instance.m_matchResult);
            logger.print("ProcessTimeUp case 2, match result: " + instance.m_matchResult);
        }

        instance.m_state = Enum.STATE_FINISHED;
    };

    this.SetSuddenDeathMode = function () {
        //Destroy all obstacles
        for (var i = 0; i < instance.m_obstacles.length; i++) {
            if (instance.m_obstacles[i].m_HP > 0) {
                //console.log("Destroy obstacle (" + instance.m_obstacles[i].m_x + "," + instance.m_obstacles[i].m_y + ")");
                instance.m_obstacles[i].m_HP = 0;
                instance.m_obstacles[i].m_dirty = true;
                instance.m_map[instance.m_obstacles[i].m_y * Setting.MAP_W + instance.m_obstacles[i].m_x] = Enum.BLOCK_GROUND;
            }
        }
        //change state
        instance.m_state = Enum.STATE_SUDDEN_DEATH;
    };


    // ==================================================================
    // Helper functions
    // ==================================================================
    //le.huathi - get existing obstacle at cell (x,y)
    /**
     * @return object
     * */
    this.GetObstacle = function (x, y) {
        for (var i = 0; i < instance.m_obstacles.length; i++) {
            if ((instance.m_obstacles[i].m_x == x) && (instance.m_obstacles[i].m_y == y))
                return instance.m_obstacles[i];
        }
        return null;
    };
    /**
     * @return object
     * */
    this.GetBase = function (x, y) {
        for (var i = 0; i < instance.m_bases[Enum.TEAM_1].length; i++) {
            if ((instance.m_bases[Enum.TEAM_1][i].m_x - 1 < x) && (instance.m_bases[Enum.TEAM_1][i].m_x + 1 > x)
                && (instance.m_bases[Enum.TEAM_1][i].m_y - 1 < y) && (instance.m_bases[Enum.TEAM_1][i].m_y + 1 > y))
                return instance.m_bases[Enum.TEAM_1][i];
        }
        for (var i = 0; i < instance.m_bases[Enum.TEAM_2].length; i++) {
            if ((instance.m_bases[Enum.TEAM_2][i].m_x - 1 < x) && (instance.m_bases[Enum.TEAM_2][i].m_x + 1 > x)
                && (instance.m_bases[Enum.TEAM_2][i].m_y - 1 < y) && (instance.m_bases[Enum.TEAM_2][i].m_y + 1 > y))
                return instance.m_bases[Enum.TEAM_2][i];
        }
        return null;
    };


    // ==================================================================
    // This part is for testing

    // ==================================================================
};