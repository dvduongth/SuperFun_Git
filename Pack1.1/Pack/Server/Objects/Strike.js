var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Strike (game, id, team) {
	var instance = this;
	// Properties
	this.m_id = id;
	this.m_team = team;
	this.m_type = Enum.POWERUP_AIRSTRIKE;

	this.m_x = 0;
	this.m_y = 0;
	this.m_countDown = 0;
	this.m_living = false;

	// Spawn it
	this.Spawn = function (type, x, y) {
		if (!instance.m_living) {
			instance.m_x = x;
			instance.m_y = y;
			instance.m_type = type;
			instance.m_countDown = Setting.POWERUP_DELAY[type];
			instance.m_living = true;
		}
	};
	
	this.Update = function () {
		if (instance.m_living) {
			if (instance.m_countDown > 0) {
				instance.m_countDown--;
			}
			else {
				// Strike here
				instance.m_living = false;
				
				if (instance.m_type == Enum.POWERUP_AIRSTRIKE) {
					for (var i=0; i<game.m_tanks[Enum.TEAM_1].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_1][i];
						if (tempTank.m_HP > 0) {
							if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
								tempTank.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					for (var i=0; i<game.m_tanks[Enum.TEAM_2].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_2][i];
						if (tempTank.m_HP > 0) {
							if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
								tempTank.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					
					for (var i=0; i<game.m_obstacles.length; i++) {
						var tempObstacle = game.m_obstacles[i];
						if (tempObstacle.m_HP > 0) {
							if ((instance.m_x - tempObstacle.m_x) * (instance.m_x - tempObstacle.m_x) + (instance.m_y - tempObstacle.m_y) * (instance.m_y - tempObstacle.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
								tempObstacle.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					
					for (var i=0; i<game.m_bases[Enum.TEAM_1].length; i++) {
						var tempBase = game.m_bases[Enum.TEAM_1][i];
						if (tempBase.m_HP > 0) {
							if ((instance.m_x - tempBase.m_x) * (instance.m_x - tempBase.m_x) + (instance.m_y - tempBase.m_y) * (instance.m_y - tempBase.m_y) <= (Setting.AIRSTRIKE_AOE + 1) * (Setting.AIRSTRIKE_AOE + 1)) {
								tempBase.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
					for (var i=0; i<game.m_bases[Enum.TEAM_2].length; i++) {
						var tempBase = game.m_bases[Enum.TEAM_2][i];
						if (tempBase.m_HP > 0) {
							if ((instance.m_x - tempBase.m_x) * (instance.m_x - tempBase.m_x) + (instance.m_y - tempBase.m_y) * (instance.m_y - tempBase.m_y) <= (Setting.AIRSTRIKE_AOE + 1) * (Setting.AIRSTRIKE_AOE + 1)) {
								tempBase.Hit(Setting.AIRSTRIKE_DAMAGE);
							}
						}
					}
				}
				else if (instance.m_type == Enum.POWERUP_EMP) {
					for (var i=0; i<game.m_tanks[Enum.TEAM_1].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_1][i];
						if (tempTank.m_HP > 0) {
							if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.EMP_AOE * Setting.EMP_AOE) {
								tempTank.EMP(Setting.EMP_DURATION);
							}
						}
					}
					for (var i=0; i<game.m_tanks[Enum.TEAM_2].length; i++) {
						var tempTank = game.m_tanks[Enum.TEAM_2][i];
						if (tempTank.m_HP > 0) {
							if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.EMP_AOE * Setting.EMP_AOE) {
								tempTank.EMP(Setting.EMP_DURATION);
							}
						}
					}
				}
			}
		}
	};
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (instance.m_living || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_STRIKE);
			packet += Network.EncodeUInt8(instance.m_id);
			packet += Network.EncodeUInt8(instance.m_team);
			packet += Network.EncodeUInt8(instance.m_type);
			packet += Network.EncodeUInt8(instance.m_living);
			packet += Network.EncodeUInt8(instance.m_countDown);
			packet += Network.EncodeFloat32(instance.m_x);
			packet += Network.EncodeFloat32(instance.m_y);
		}
		
		return packet;
	};
};