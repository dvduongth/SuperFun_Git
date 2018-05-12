function Explosion (game, id) {
	var instance = this;
	var EXPLOSION_SPEED = [];
	EXPLOSION_SPEED[EXPLOSION_TANK] = 4;
	EXPLOSION_SPEED[EXPLOSION_CANNON] = 5;
	EXPLOSION_SPEED[EXPLOSION_OBSTACLE] = 5;
	EXPLOSION_SPEED[EXPLOSION_EMP] = 7;
	EXPLOSION_SPEED[EXPLOSION_BULLET] = 7;
	EXPLOSION_SPEED[EXPLOSION_CANNON_MUZZLE] = 3;
	EXPLOSION_SPEED[EXPLOSION_GUN_MUZZLE] = 8;
	
	var EXPLOSION_SIZE = [];
	EXPLOSION_SIZE[EXPLOSION_TANK] = 150;
	EXPLOSION_SIZE[EXPLOSION_CANNON] = 100;
	EXPLOSION_SIZE[EXPLOSION_OBSTACLE] = 50;
	EXPLOSION_SIZE[EXPLOSION_EMP] = 200;
	EXPLOSION_SIZE[EXPLOSION_BULLET] = 50;
	EXPLOSION_SIZE[EXPLOSION_CANNON_MUZZLE] = 150;
	EXPLOSION_SIZE[EXPLOSION_GUN_MUZZLE] = 122;

	var EXPLOSION_FRAME = [];
	EXPLOSION_FRAME[EXPLOSION_TANK] = 35;
	EXPLOSION_FRAME[EXPLOSION_CANNON] = 48;
	EXPLOSION_FRAME[EXPLOSION_OBSTACLE] = 16;
	EXPLOSION_FRAME[EXPLOSION_EMP] = 48;
	EXPLOSION_FRAME[EXPLOSION_BULLET] = 32;
	EXPLOSION_FRAME[EXPLOSION_CANNON_MUZZLE] = 30;
	EXPLOSION_FRAME[EXPLOSION_GUN_MUZZLE] = 20;

	var EXPLOSION_FRAME_W = [];
	EXPLOSION_FRAME_W[EXPLOSION_TANK] = 5;
	EXPLOSION_FRAME_W[EXPLOSION_CANNON] = 8;
	EXPLOSION_FRAME_W[EXPLOSION_OBSTACLE] = 8;
	EXPLOSION_FRAME_W[EXPLOSION_EMP] = 8;
	EXPLOSION_FRAME_W[EXPLOSION_BULLET] = 8;
	EXPLOSION_FRAME_W[EXPLOSION_CANNON_MUZZLE] = 8;
	EXPLOSION_FRAME_W[EXPLOSION_GUN_MUZZLE] = 8;
	
	var EXPLOSION_SCALE = [];
	EXPLOSION_SCALE[EXPLOSION_TANK] = 1;
	EXPLOSION_SCALE[EXPLOSION_CANNON] = 1;
	EXPLOSION_SCALE[EXPLOSION_OBSTACLE] = 1;
	EXPLOSION_SCALE[EXPLOSION_EMP] = 2;
	EXPLOSION_SCALE[EXPLOSION_BULLET] = 1;
	EXPLOSION_SCALE[EXPLOSION_CANNON_MUZZLE] = 1;
	EXPLOSION_SCALE[EXPLOSION_GUN_MUZZLE] = 1;
	
	var EXPLOSION_ADDITIVE_DRAW = [];
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_TANK] = true;
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_CANNON] = true;
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_OBSTACLE] = true;
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_EMP] = true;
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_BULLET] = true;
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_CANNON_MUZZLE] = false;
	EXPLOSION_ADDITIVE_DRAW[EXPLOSION_GUN_MUZZLE] = false;
	
	

	// Identifier
	this.m_id = id;
		
	// An array to contain state in the past
	function DataAnchor() {
		instance.m_time = 0;
		instance.m_type = 0;
		instance.m_x = 0;
		instance.m_y = 0;
		instance.m_angle = 0;
		instance.m_flipX = false;
		instance.m_flipY = false;
	}
	this.m_data = [];
	
	// Current state
	this.m_type = EXPLOSION_TANK;
	this.m_x = -1;
	this.m_y = -1;
	this.m_angle = 0;
	this.m_frame = 0;
	this.m_flipX = false;
	this.m_flipY = false;
	this.m_live = false;
	
	// Image
	var imgExplosion = [];
	imgExplosion[EXPLOSION_TANK] = g_graphicEngine.LoadImage("Image/Explosion/1.png");
	imgExplosion[EXPLOSION_CANNON] = g_graphicEngine.LoadImage("Image/Explosion/2.png");
	imgExplosion[EXPLOSION_OBSTACLE] = g_graphicEngine.LoadImage("Image/Explosion/3.png");
	imgExplosion[EXPLOSION_EMP] = g_graphicEngine.LoadImage("Image/Explosion/4.png");
	imgExplosion[EXPLOSION_BULLET] = g_graphicEngine.LoadImage("Image/Explosion/5.png");
	
	imgExplosion[EXPLOSION_CANNON_MUZZLE] = g_graphicEngine.LoadImage("Image/Explosion/7.png");
	imgExplosion[EXPLOSION_GUN_MUZZLE] = g_graphicEngine.LoadImage("Image/Explosion/8.png");
	
	
	var sndExplosion = [];
	sndExplosion[0] = g_soundEngine.LoadSound("Sound/Explosion 1.mp3", 5, 80);
	sndExplosion[1] = g_soundEngine.LoadSound("Sound/Explosion 2.mp3", 5, 80);
	sndExplosion[2] = g_soundEngine.LoadSound("Sound/Explosion 3.mp3", 5, 80);
	sndExplosion[3] = g_soundEngine.LoadSound("Sound/Explosion 4.mp3", 5, 80);
	
	var sndGun = g_soundEngine.LoadSound("Sound/GunShot.mp3", 10, 50);
	var sndImpact = g_soundEngine.LoadSound("Sound/BulletImpact.mp3", 10, 50);
	
	var sndEMP = g_soundEngine.LoadSound("Sound/EMP.mp3", 5, 80);
	var sndCannon = g_soundEngine.LoadSound("Sound/CannonShot.mp3", 5, 80);
	
	
	// Particle
	var fragEmitter = g_particleDef.CreateFragScatteringEmitter();
	fragEmitter.Pause();
	
	// Add a state in a specific time
	this.Spawn = function (time, type, x, y, angle, flipX, flipY) {
		var tempAnchor = new DataAnchor();
		tempAnchor.m_time = time;
		tempAnchor.m_type = type;
		tempAnchor.m_x = x;
		tempAnchor.m_y = y;
		if (angle == null) tempAnchor.m_angle = (Math.random() * 360) >> 0;
		else tempAnchor.m_angle = angle;
		
		if (flipX == null)  tempAnchor.m_flipX = false;
		else tempAnchor.m_flipX = flipX;
		if (flipY == null)  tempAnchor.m_flipY = false;
		else tempAnchor.m_flipY = flipY;

		instance.m_data.push (tempAnchor);
	};
	
	// Update function, called with a specific moment in the timeline
	// We gonna interpolate all state, based on the data anchors.
	this.Update = function (time) {
		cc.log('Explosion Update', time);
		var anchor = null;
		
		if (instance.m_data.length > 0) {
			anchor = instance.m_data[instance.m_data.length-1];
		}
		
		for (var i=0; i<instance.m_data.length-1; i++) {
			if (time >= instance.m_data[i].m_time && time < instance.m_data[i+1].m_time) {
				anchor = instance.m_data[i];
				break;
			}
		}
		
		if (time < instance.m_data[0].m_time) {
			anchor = null;
		}
		
		if (anchor) {
			instance.m_x = anchor.m_x;
			instance.m_y = anchor.m_y;
			instance.m_type = anchor.m_type;
			instance.m_angle = anchor.m_angle;
			instance.m_flipX = anchor.m_flipX;
			instance.m_flipY = anchor.m_flipY;

			instance.m_frame = ((time - anchor.m_time) * EXPLOSION_SPEED[instance.m_type]) >> 0;
			if (instance.m_frame > EXPLOSION_FRAME [instance.m_type]) {
				instance.m_live = false;
			}
			else {
				if (instance.m_live == false) {
					fragEmitter.m_x = (instance.m_x + 0.5) * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX;
					fragEmitter.m_y = (instance.m_y + 0.5) * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY;
					if (instance.m_type == EXPLOSION_TANK) {
						fragEmitter.m_emitForceMin = 0.3;
						fragEmitter.m_emitForceMax = 0.45;
						fragEmitter.ManualEmit (30);
					}
					else if (instance.m_type == EXPLOSION_CANNON) {
						fragEmitter.m_emitForceMin = 0.33;
						fragEmitter.m_emitForceMax = 0.38;
						fragEmitter.ManualEmit (15);
					}
					else if (instance.m_type == EXPLOSION_BULLET) {
						fragEmitter.m_emitForceMin = 0.25;
						fragEmitter.m_emitForceMax = 0.3;
						fragEmitter.ManualEmit (3);
					}
					
					if (instance.m_type == EXPLOSION_TANK || instance.m_type == EXPLOSION_CANNON || instance.m_type == EXPLOSION_OBSTACLE) {
						var index = (Math.random() * sndExplosion.length) >> 0;
						g_soundEngine.PlaySound (sndExplosion[index]);
					}
					else if (instance.m_type == EXPLOSION_EMP) {
						g_soundEngine.PlaySound (sndEMP);
					}
					else if (instance.m_type == EXPLOSION_BULLET) {
						g_soundEngine.PlaySound (sndImpact);
					}
					else if (instance.m_type == EXPLOSION_CANNON_MUZZLE) {
						g_soundEngine.PlaySound (sndCannon);
					}
					else if (instance.m_type == EXPLOSION_GUN_MUZZLE) {
						g_soundEngine.PlaySound (sndGun);
					}
				}
				instance.m_live = true;
			}
		}
		else {
			instance.m_live = false;
		}
	};
	
	// Draw - obvious comment is obvious
	this.Draw = function () {
		if (instance.m_live) {
			var angle = 0;
			if (EXPLOSION_ADDITIVE_DRAW[instance.m_type]) {
				g_graphicEngine.SetDrawModeAddActive (g_context, true);
			}
			
			var scale = EXPLOSION_SCALE[instance.m_type];
			var spriteSize = EXPLOSION_SIZE[instance.m_type];
			var sourceX = (instance.m_frame % EXPLOSION_FRAME_W[instance.m_type]) * spriteSize;
			var sourceY = ((instance.m_frame / EXPLOSION_FRAME_W[instance.m_type]) >> 0) * spriteSize;
			var spriteOffset = (BLOCK_SIZE - spriteSize * scale) * 0.5;
			
			g_graphicEngine.Draw (g_context, imgExplosion[instance.m_type], sourceX, sourceY, spriteSize, spriteSize, instance.m_x * BLOCK_SIZE + spriteOffset + g_gsActionPhase.m_screenShakeX, instance.m_y * BLOCK_SIZE + spriteOffset + g_gsActionPhase.m_screenShakeY, spriteSize * scale, spriteSize * scale, 1, instance.m_flipX, instance.m_flipY, instance.m_angle);
			
			if (EXPLOSION_ADDITIVE_DRAW[instance.m_type]) {
				g_graphicEngine.SetDrawModeAddActive (g_context, false);
			}
		}
	};
	
	
	// Is this object free at this moment?
	this.IsFreeAt = function (time) {
		var anchor = null;
		
		if (instance.m_data.length > 0) {
			anchor = instance.m_data[instance.m_data.length-1];
		}
		
		if (anchor) {
			if (time > anchor.m_time) {
				var frame = ((time - anchor.m_time) * EXPLOSION_SPEED[anchor.m_type]) >> 0;
				if (frame > EXPLOSION_FRAME [anchor.m_type]) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		}
		
		// This case will never happen
		return true;
	};
}