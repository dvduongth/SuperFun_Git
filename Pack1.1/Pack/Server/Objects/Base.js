var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function Base (game, id, x, y, team, type) {
	var instance = this;
	// Position
	this.m_id = id;
	this.m_x = x;
	this.m_y = y;
	this.m_team = team;
	this.m_type = type;

	// Status
	this.m_HP = Setting.BASE_HP[this.m_type];
	
	// Need to update or not
	this.m_dirty = false;

	this.Hit = function(damage) {
		if (instance.m_HP == 0) //avoid base still be hit after destroyed
			return;

		instance.m_HP -= damage;
		if (instance.m_HP <= 0) {
			// BOOM!
			instance.m_HP = 0;
			
			//if base lost in sudden death mode -> team lost
			if(game.m_state == Enum.STATE_SUDDEN_DEATH)
				game.m_teamLostSuddenDeath = instance.m_team;
		}

		instance.m_dirty = true;
	};
	
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (instance.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_BASE);
			packet += Network.EncodeUInt8(instance.m_id);
			packet += Network.EncodeUInt8(instance.m_team);
			packet += Network.EncodeUInt8(instance.m_type);
			packet += Network.EncodeUInt16(instance.m_HP);
			packet += Network.EncodeFloat32(instance.m_x);
			packet += Network.EncodeFloat32(instance.m_y);

			instance.m_dirty = false;
		}
		
		return packet;
	};
};