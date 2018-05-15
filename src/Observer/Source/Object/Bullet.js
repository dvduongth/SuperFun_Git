function Bullet (game, id, team) {
	var instance = this;
	// Identifier
	this.m_id = id;
	this.m_team = team;
	
	// An array to contain state in the past
	function DataAnchor() {
		instance.m_time = 0;
		instance.m_type = 0;
		instance.m_x = 0;
		instance.m_y = 0;
		instance.m_direction = 0;
		instance.m_live = false;
		instance.m_hit = false;
	}
	this.m_data = [];
	
	// Current state
	this.m_type = 0;
	this.m_x = -1;
	this.m_y = -1;
	this.m_direction = 0;
	this.m_live = false;
	this.m_hit = false;
	
	// Local variable
	// Indicate if the object is updated by a packet
	var dirty = false;
	
	// Image
	var imgBullet = [];
	imgBullet[TANK_LIGHT] = g_graphicEngine.LoadImage("Image/Bullet/1.png");
	imgBullet[TANK_MEDIUM] = g_graphicEngine.LoadImage("Image/Bullet/2.png");
	imgBullet[TANK_HEAVY] = g_graphicEngine.LoadImage("Image/Bullet/3.png");
	
	// Particle
	var whiteSmoke = g_particleDef.CreateBulletSmokeEmitter();
	whiteSmoke.m_x = 0;
	whiteSmoke.m_y = 0;
	
	
	// Add a state in a specific time
	this.AddDataAnchor = function (time, type, x, y, dir, live, hit) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_type = type;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		tempAnchor.m_direction = dir;
		tempAnchor.m_live = live;
		tempAnchor.m_hit = hit;
		
		
		if (tempAnchor.m_hit) {
			if (tempAnchor.m_type == TANK_HEAVY) {
				game.SpawnExplosion (time, EXPLOSION_BULLET, tempAnchor.m_x, tempAnchor.m_y);
			}
			else {
				game.SpawnExplosion (time, EXPLOSION_CANNON, tempAnchor.m_x, tempAnchor.m_y);
			}
		}

		instance.m_data.push (tempAnchor);
		dirty = true;
	};

	// Clone a new state, at a new time, but with old data like previous state
	// This process to make a contiuous timeline. You can think of it as a fake update
	// We won't do it if was updated by a real packet.
	this.AddIdleDataAnchor = function (time) {
		if (!dirty) {
			var previousAnchor = instance.m_data[instance.m_data.length-1];
			
			if (previousAnchor) {
				var tempAnchor = new DataAnchor();
				tempAnchor.m_time = time;
				tempAnchor.m_type = previousAnchor.m_type;
				tempAnchor.m_x = previousAnchor.m_x;
				tempAnchor.m_y = previousAnchor.m_y;
				tempAnchor.m_direction = previousAnchor.m_direction;
				tempAnchor.m_live = previousAnchor.m_live;
				instance.m_data.push (tempAnchor);
			}
		}
		else {
			dirty = false;
		}
	};

	// Update function, called with a specific moment in the timeline
	// We gonna interpolate all state, based on the data anchors.
	this.Update = function (time) {
		cc.log('Bullet Update', time);
		var prevAnchor = null;
		var nextAnchor = null;
		
		for (var i=0; i<instance.m_data.length-1; i++) {
			if (time >= instance.m_data[i].m_time && time < instance.m_data[i+1].m_time) {
				prevAnchor = instance.m_data[i];
				nextAnchor = instance.m_data[i+1];
				break;
			}
		}
		
		if (prevAnchor && nextAnchor) {
			if (prevAnchor.m_live == false) {
				instance.m_x = nextAnchor.m_x;
				instance.m_y = nextAnchor.m_y;
			}
			else {
				var interpolateFactor = (time - prevAnchor.m_time) / (nextAnchor.m_time - prevAnchor.m_time);
				instance.m_x = prevAnchor.m_x + (nextAnchor.m_x - prevAnchor.m_x) * interpolateFactor;
				instance.m_y = prevAnchor.m_y + (nextAnchor.m_y - prevAnchor.m_y) * interpolateFactor;
			}
			instance.m_type = prevAnchor.m_type;
			instance.m_direction = prevAnchor.m_direction;
			instance.m_live = prevAnchor.m_live;
		}
		else {
			instance.m_live = false;
		}
	};
	
	// Draw - obvious comment is obvious
	this.Draw = function () {
		if (instance.m_live) {
			var angle = 0;
			if (instance.m_direction == DIRECTION_UP) {
				angle = 0;
			}
			else if (instance.m_direction == DIRECTION_RIGHT) {
				angle = 90;
			}
			else if (instance.m_direction == DIRECTION_DOWN) {
				angle = 180;
			}
			else if (instance.m_direction == DIRECTION_LEFT) {
				angle = 270;
			}
			cc.log('Bullet Draw when live with angle ' + angle);
			g_graphicEngine.SetDrawModeAddActive (g_context, true);
			g_graphicEngine.Draw (g_context, imgBullet[instance.m_type], 0, 0, BLOCK_SIZE, BLOCK_SIZE, instance.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, instance.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
			g_graphicEngine.SetDrawModeAddActive (g_context, false);
			
			if (instance.m_type == TANK_HEAVY) {
				cc.log('Bullet type == TANK_HEAVY and whiteSmoke.Pause');
				whiteSmoke.Pause();
			}
			else {
				cc.log('Bullet whiteSmoke.Resume');
				whiteSmoke.Resume();
				whiteSmoke.m_x = (instance.m_x + 0.5) * BLOCK_SIZE;
				whiteSmoke.m_y = (instance.m_y + 0.5) * BLOCK_SIZE;
			}
		}
		else {
			cc.log('Bullet whiteSmoke.Pause when dead');
			whiteSmoke.Pause();
		}
	};
}