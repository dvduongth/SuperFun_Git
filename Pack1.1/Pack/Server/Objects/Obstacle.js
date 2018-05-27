var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Obstacle (game, id, x, y) {
	var instance = this;
	// Position
	this.m_id = id;
	this.m_x = x;
	this.m_y = y;

	// Status
	this.m_HP = Setting.OBSTACLE_HP;
	
	// Need to update or not
	this.m_dirty = false;

	this.Hit = function(damage) {
		instance.m_HP -= damage;
		instance.m_dirty = true;
		if (instance.m_HP <= 0) {
			// BOOM!
			instance.m_HP = 0;
			game.m_map[instance.m_y * Setting.MAP_W + instance.m_x] = Enum.BLOCK_GROUND;
		}
	};
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (instance.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_OBSTACLE);
			packet += Network.EncodeUInt8(instance.m_id);
			packet += Network.EncodeUInt8(instance.m_x);
			packet += Network.EncodeUInt8(instance.m_y);
			packet += Network.EncodeUInt8(instance.m_HP);

			instance.m_dirty = false;
		}
		
		return packet;
	};
};