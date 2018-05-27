var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Tank (game, id, x, y, team, type) {
	var instance = this;
	// Position
	this.m_x = x;
	this.m_y = y;
	
	// Properties
	this.m_id = id;
	this.m_team = team; //Enum.TEAM_1;
	this.m_type = type; //Enum.TANK_MEDIUM;
	
	// Status
	this.m_HP = Setting.TANK_HP [this.m_type];
	if (this.m_team == Enum.TEAM_1) {
		this.m_direction = Enum.DIRECTION_RIGHT;
	}
	else {
		this.m_direction = Enum.DIRECTION_LEFT;
	}
	this.m_speed = Setting.TANK_SPEED [this.m_type];
	this.m_rateOfFire = Setting.TANK_ROF [this.m_type];
	this.m_coolDown = 0; // Cooldown = 0 and the tank is allowed to shoot again.
	this.m_damage = Setting.TANK_DAMAGE [this.m_type];
	this.m_disabled = 0;
	
	// Need to update or not
	this.m_dirty = false;
	
	
	
	var commandTurn = -1;
	var commandMove = false;
	var commandShoot = false;
	
	// Called by the client
	this.Turn = function(direction) {
		commandTurn = direction;
	};
	this.Move = function() {
		commandMove = true;
	};
	this.Shoot = function() {
		commandShoot = true;
	};
	
	// Called by the server to update based on command
	this.Update = function() {
		if (instance.m_HP > 0) {
			if (instance.m_disabled <= 0) {
				if (commandTurn == Enum.DIRECTION_DOWN || commandTurn == Enum.DIRECTION_RIGHT
				||  commandTurn == Enum.DIRECTION_LEFT || commandTurn == Enum.DIRECTION_UP) {
					instance.m_direction = commandTurn;
					instance.m_dirty = true;
				}
				
				if (commandMove) {
					// Move the tank to an imaginary position first
					var newX = instance.m_x;
					var newY = instance.m_y;
					var newPositionOK = false;
					if (instance.m_direction == Enum.DIRECTION_UP) {
						newY = instance.m_y - instance.m_speed;
					}
					else if (instance.m_direction == Enum.DIRECTION_DOWN) {
						newY = instance.m_y + instance.m_speed;
					}
					else if (instance.m_direction == Enum.DIRECTION_LEFT) {
						newX = instance.m_x - instance.m_speed;
					}
					else if (instance.m_direction == Enum.DIRECTION_RIGHT) {
						newX = instance.m_x + instance.m_speed;
					}
					
					// Round up on a square, because, in javascript, sometimes:
					// 0.2 + 0.2 + 0.2 + 0.2 + 0.2 = 0.9999999...
					// Lol... ^^
					if (newX % 1 < 0.05) newX = (newX >> 0);
					if (newX % 1 > 0.95) newX = (newX >> 0) + 1;
					if (newY % 1 < 0.05) newY = (newY >> 0);
					if (newY % 1 > 0.95) newY = (newY >> 0) + 1;
					
					// Check to see if that position is valid (no collision)
					newPositionOK = instance.CheckForCollision(newX, newY);

					// Update if OK.
					if (newPositionOK) {
						instance.m_x = newX;
						instance.m_y = newY;
						instance.m_dirty = true;
					}
				}
				
				if (commandShoot) {
					if (instance.m_HP > 0) {
						if (instance.m_coolDown == 0) {
							instance.m_coolDown = instance.m_rateOfFire;
							game.Fire (instance);
						}
					}
				}
			}
			else {
				instance.m_disabled --;
				if (instance.m_disabled == 0) {
					instance.m_dirty = true;
				}
			}
			
			// Reset all command
			commandTurn = -1;
			commandMove = false;
			commandShoot = false;
			
			// Internal stuff
			if (instance.m_coolDown > 0 && instance.m_disabled <= 0) {
				instance.m_coolDown --;
			}
		}
		else {
			//le.huathi - reset m_dirty if already died last frame
			if (instance.m_dirty) {
				instance.m_dirty = false;
			}
		}
	};
	
	this.CheckForCollision = function (newX, newY) {
		// Check landscape
		var roundedX = newX >> 0;
		var roundedY = newY >> 0;
		var squareNeedToCheckX = [];
		var squareNeedToCheckY = [];
		
		// Find the square the tank occupy (even part of)
		if (newX == roundedX && newY == roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
		}
		else if (newX != roundedX && newY == roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY);
		}
		else if (newX == roundedX && newY != roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY+1);
		}
		else if (newX != roundedX && newY != roundedY) {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY+1);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY+1);
		}
		
		// Check if that square is invalid
		for (var i=0; i<squareNeedToCheckX.length; i++) {
			var x = squareNeedToCheckX[i];
			var y = squareNeedToCheckY[i];
			if (game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_WATER
			||  game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_HARD_OBSTACLE
			||  game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_SOFT_OBSTACLE
			||  game.m_map[y * Setting.MAP_W + x] == Enum.BLOCK_BASE) {
				return false;
			}
		}
		
		// If landscape is valid, time to check collision with other tanks.
		for (var i=0; i<game.m_tanks[Enum.TEAM_1].length; i++) {
			if (instance.m_team == Enum.TEAM_1 && instance.m_id == i) {
				continue;
			}
			var tempTank = game.m_tanks[Enum.TEAM_1][i];
			if (Math.abs(newX - tempTank.m_x) < 1 && Math.abs(newY - tempTank.m_y) < 1) {
				return false;
			}
		}
		for (var i=0; i<game.m_tanks[Enum.TEAM_2].length; i++) {
			if (instance.m_team == Enum.TEAM_2 && instance.m_id == i) {
				continue;
			}
			var tempTank = game.m_tanks[Enum.TEAM_2][i];
			if (Math.abs(newX - tempTank.m_x) < 1 && Math.abs(newY - tempTank.m_y) < 1) {
				return false;
			}
		}
		
		return true;
	};
	
	//le.huathi - call this when tank meet opponent's bullet
	this.Hit = function(damage) {
		if(instance.m_HP == 0) //do nothing if already died
			return;
		instance.m_HP -= damage;
		instance.m_dirty = true;
		if (instance.m_HP <= 0) {
			// BOOM!
			instance.m_HP = 0;
		}
	};

	this.EMP = function(duration) {
		if(instance.m_HP == 0) //do nothing if already died
			return;
		instance.m_disabled = duration;
		instance.m_dirty = true;
	};
	
	// tien.dinhvan - call this when tank picks a rune
	this.PickRune = function(rune) {
		rune.m_state = instance.m_team;
	};
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (instance.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_TANK);
			packet += Network.EncodeUInt8(instance.m_id);
			packet += Network.EncodeUInt8(instance.m_team);
			packet += Network.EncodeUInt8(instance.m_type);
			packet += Network.EncodeUInt16(instance.m_HP);
			packet += Network.EncodeUInt8(instance.m_direction);
			packet += Network.EncodeFloat32(instance.m_speed);
			packet += Network.EncodeUInt8(instance.m_rateOfFire);
			packet += Network.EncodeUInt8(instance.m_coolDown);
			packet += Network.EncodeUInt8(instance.m_damage);
			packet += Network.EncodeUInt8(instance.m_disabled);
			packet += Network.EncodeFloat32(instance.m_x);
			packet += Network.EncodeFloat32(instance.m_y);

			instance.m_dirty = false;
		}
		return packet;
	};
};