var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Bullet (game, team, id) {
	var instance = this;
	// Position
	this.m_x = 0;
	this.m_y = 0;
	
	// Properties
	this.m_id = id;
	this.m_team = team;
	this.m_type = Enum.TANK_MEDIUM;
	this.m_direction = Enum.DIRECTION_UP;
	
	// Status
	this.m_speed = 0;
	this.m_damage = 0;
	
	// Projectile active?
	this.m_live = false;
	
	this.m_needToAnnounceHit = false;
	
	
	this.Fire = function(x, y, type, direction) {
		instance.m_x = x;
		instance.m_y = y;
		instance.m_type = type;
		instance.m_direction = direction;
		instance.m_live = true;
		instance.m_speed = Setting.BULLET_SPEED [instance.m_type];
		instance.m_damage = Setting.TANK_DAMAGE [instance.m_type];
	};
	
	// Called by the server to update based on command
	this.Update = function() {
		if (instance.m_live) {
			// Because tank get to move first in a loop, some tanks could have slammed into this bullet
			instance.CheckCollisionWithTank();
			
			// No tank slammed into the bullet
			if (instance.m_live) {
				if (instance.m_direction == Enum.DIRECTION_UP) {
					instance.m_y = instance.m_y - instance.m_speed;
				}
				else if (instance.m_direction == Enum.DIRECTION_DOWN) {
					instance.m_y = instance.m_y + instance.m_speed;
				}
				else if (instance.m_direction == Enum.DIRECTION_LEFT) {
					instance.m_x = instance.m_x - instance.m_speed;
				}
				else if (instance.m_direction == Enum.DIRECTION_RIGHT) {
					instance.m_x = instance.m_x + instance.m_speed;
				}
				
				// Check to see if that position is valid (no collision)
				instance.CheckForCollision();
			}
		}
	};
	
	this.CheckForCollision = function () {
		// Check collision with opponent's tanks.
		var oppTeam = (instance.m_team == Enum.TEAM_2) ? Enum.TEAM_1 : Enum.TEAM_2;
		for (var i=0; i<game.m_tanks[oppTeam].length; i++) {
			var tempTank = game.m_tanks[oppTeam][i];
			if (tempTank.m_HP > 0) {
				if (Math.abs(instance.m_x - tempTank.m_x) <= 0.5 && Math.abs(instance.m_y - tempTank.m_y) <= 0.5) {
					instance.m_live = false;
					instance.m_needToAnnounceHit = true;
					//le.huathi - update tank's HP
					tempTank.Hit(instance.m_damage);
					return;
				}
			}
		}
		
		// Check landscape
		var roundedX = (instance.m_x + 0.5) >> 0;
		var roundedY = (instance.m_y + 0.5) >> 0;
		
		if (game.m_map[roundedY * Setting.MAP_W + roundedX] == Enum.BLOCK_HARD_OBSTACLE
			||  game.m_map[roundedY * Setting.MAP_W + roundedX] == Enum.BLOCK_SOFT_OBSTACLE
			||  game.m_map[roundedY * Setting.MAP_W + roundedX] == Enum.BLOCK_BASE) 
		{
			instance.m_needToAnnounceHit = true;
			instance.m_live = false;
			//le.huathi - update obstacle HP
			if(game.m_map[roundedY * Setting.MAP_W + roundedX] == Enum.BLOCK_SOFT_OBSTACLE) {
				obstacle = game.GetObstacle(roundedX, roundedY);
				if(obstacle != null) {
					obstacle.Hit(instance.m_damage);
				}
			}
			//le.huathi - update player base's HP
			else if(game.m_map[roundedY * Setting.MAP_W + roundedX] == Enum.BLOCK_BASE) {
				base = game.GetBase(roundedX, roundedY);
				if(base != null) {
					base.Hit(instance.m_damage);
				}
			}
		}
	};
	
	this.CheckCollisionWithTank = function () {
		// Check collision with opponent's tanks.
		var oppTeam = (instance.m_team == Enum.TEAM_2) ? Enum.TEAM_1 : Enum.TEAM_2;
		for (var i=0; i<game.m_tanks[oppTeam].length; i++) {
			var tempTank = game.m_tanks[oppTeam][i];
			if (tempTank.m_HP > 0) {
				if (Math.abs(instance.m_x - tempTank.m_x) <= 0.5 && Math.abs(instance.m_y - tempTank.m_y) <= 0.5) {
					instance.m_live = false;
					instance.m_needToAnnounceHit = true;
					//le.huathi - update tank's HP
					tempTank.Hit(instance.m_damage);
					return;
				}
			}
		}
	};
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (instance.m_live || instance.m_needToAnnounceHit || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_BULLET);
			packet += Network.EncodeUInt8(instance.m_id);
			packet += Network.EncodeUInt8(instance.m_live);
			packet += Network.EncodeUInt8(instance.m_team);
			packet += Network.EncodeUInt8(instance.m_type);
			packet += Network.EncodeUInt8(instance.m_direction);
			packet += Network.EncodeFloat32(instance.m_speed);
			packet += Network.EncodeUInt8(instance.m_damage);
			packet += Network.EncodeUInt8(instance.m_needToAnnounceHit);
			packet += Network.EncodeFloat32(instance.m_x);
			packet += Network.EncodeFloat32(instance.m_y);
			
			if (!instance.m_live) {
				instance.m_needToAnnounceHit = false;
			}
		}
		return packet;
	};
};