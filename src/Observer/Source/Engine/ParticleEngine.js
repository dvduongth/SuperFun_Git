function SourceRect (id, x, y, w, h) {
	this.m_id = id;
	this.m_x = x;
	this.m_y = y;
	this.m_w = w;
	this.m_h = h;
}

function Particle(context) {
	var instance = this;
	this.m_context = context;
	
	this.Reset = function () {
		// Life
		instance.m_start = false;
		instance.m_lifeTime = 0;
		instance.m_time = 0;
		
		// Moving
		instance.m_x = 0;
		instance.m_y = 0;
		instance.m_moveSpeedX = 0;
		instance.m_moveSpeedY = 0;
		instance.m_resistant = 0;
		instance.m_gravity = 0;
		
		// Rotating
		instance.m_angle = 0;
		instance.m_rotateSpeed = 0;
		instance.m_rotateResistant = 0;
		instance.m_rotateAcceleration = 0;
		
		// Fade
		instance.m_alpha = 1;
		instance.m_fadeSpeed = 0;
		
		// Image
		instance.m_sourceRectArray = [];
		instance.m_frameLength = 0;
		instance.m_w = 0;
		instance.m_h = 0;
		instance.m_scaleSpeed = 0;
		instance.m_drawAdd = false;
	};
	
	this.Reset();
	
	var frameCount = 0;
	var currentFrame = 0;
	this.Start = function () {
		instance.m_start = true;
		instance.m_time = 0;
		currentFrame = 0;
	};
	
	this.Update = function (deltaTime) {
		if (instance.m_start) {
			// Update life time
			instance.m_time += deltaTime;
			if (instance.m_time >= instance.m_lifeTime) {
				instance.m_start = false;
			}
			
			// Update animation
			frameCount += deltaTime;
			if (frameCount >= instance.m_frameLength) {
				frameCount -= instance.m_frameLength;
				currentFrame ++;
				if (currentFrame >= instance.m_sourceRectArray.length) {
					currentFrame = 0;
				}
			}
			
			// Air resistant
			var resistant = instance.m_resistant * deltaTime;
			
			if (instance.m_moveSpeedX > 0) {
				instance.m_moveSpeedX -= resistant;
				if (instance.m_moveSpeedX < 0) instance.m_moveSpeedX = 0;
			}
			else if (instance.m_moveSpeedX < 0) {
				instance.m_moveSpeedX += resistant;
				if (instance.m_moveSpeedX > 0) instance.m_moveSpeedX = 0;
			}
			
			if (instance.m_moveSpeedY > 0) {
				instance.m_moveSpeedY -= resistant;
				if (instance.m_moveSpeedY < 0) instance.m_moveSpeedY = 0;
			}
			else if (instance.m_moveSpeedY < 0) {
				instance.m_moveSpeedY += resistant;
				if (instance.m_moveSpeedY > 0) instance.m_moveSpeedY = 0;
			}
			
			// Gravity
			instance.m_moveSpeedY += instance.m_gravity * deltaTime;
			
			// Move
			instance.m_x += instance.m_moveSpeedX * deltaTime;
			instance.m_y += instance.m_moveSpeedY * deltaTime;
			
			
			// Rotate air resistant
			resistant = instance.m_rotateResistant * deltaTime;
			if (instance.m_rotateSpeed > resistant) {
				instance.m_rotateSpeed -= resistant;
			}
			else if (instance.m_rotateSpeed < -resistant) {
				instance.m_rotateSpeed += resistant;
			}
			else {
				instance.m_rotateSpeed = 0;
			}
			
			// Rotate acceleration
			if (instance.m_rotateAcceleration != 0) {
				instance.m_rotateSpeed += instance.m_rotateAcceleration * deltaTime;
			}

			instance.m_angle += instance.m_rotateSpeed * deltaTime;
			if (instance.m_angle > 360) instance.m_angle -= 360;
			if (instance.m_angle < 360) instance.m_angle += 360;
			
			// Scale speed
			instance.m_w += instance.m_scaleSpeed * deltaTime * instance.m_w;
			instance.m_h += instance.m_scaleSpeed * deltaTime * instance.m_h;
			
			// Fade
			instance.m_alpha += instance.m_fadeSpeed * deltaTime;
		}
	};
	
	
	this.Draw = function (context, x, y, w, h) {
		if (instance.m_start) {
			if (context == null) context = instance.m_context;
			
			var offsetX = 0;
			var offsetY = 0;
			if (x != null) {
				if (instance.m_x >= x && instance.m_y >= y && instance.m_x + instance.m_w <= x + w && instance.m_y + instance.m_h <= y + h) {
				
				}
				else {
					return;
				}
				
				if (cc.sys.isNative) {
					offsetX = x;
					offsetY = y;
				}
			}
			
			var sourceRect = instance.m_sourceRectArray[currentFrame];
			if (instance.m_drawAdd) instance.m_graphicEngine.SetDrawModeAddActive (context, true);
			 instance.m_graphicEngine.Draw (context, sourceRect.m_id, sourceRect.m_x, sourceRect.m_y, sourceRect.m_w, sourceRect.m_h, instance.m_x - offsetX - (instance.m_w * 0.5) >> 0, instance.m_y - offsetY - (instance.m_h * 0.5) >> 0, instance.m_w, instance.m_h, instance.m_alpha, 0, 0, instance.m_angle);
			if (instance.m_drawAdd) instance.m_graphicEngine.SetDrawModeAddActive (context, false);
		}
	};
	
	
	this.CloneFrom = function (rhs) {
		instance.m_context = rhs.m_context;
		
		// Life
		instance.m_start = rhs.m_start;
		instance.m_lifeTime = rhs.m_lifeTime;
		instance.m_time = rhs.m_time;
		
		// Moving
		instance.m_x = rhs.m_x;
		instance.m_y = rhs.m_y;
		instance.m_moveSpeedX = rhs.m_moveSpeedX;
		instance.m_moveSpeedY = rhs.m_moveSpeedY;
		instance.m_resistant = rhs.m_resistant;
		instance.m_gravity = rhs.m_gravity;
		
		// Rotating
		instance.m_angle = rhs.m_angle;
		instance.m_rotateSpeed = rhs.m_rotateSpeed;
		instance.m_rotateResistant = rhs.m_rotateResistant;
		instance.m_rotateAcceleration = rhs.m_rotateAcceleration;
		
		// Fade
		instance.m_alpha = rhs.m_alpha;
		instance.m_fadeSpeed = rhs.m_fadeSpeed;
		
		// Image
		instance.m_sourceRectArray = rhs.m_sourceRectArray;
		instance.m_frameLength = rhs.m_frameLength;
		instance.m_w = rhs.m_w;
		instance.m_h = rhs.m_h;
		instance.m_scaleSpeed = rhs.m_scaleSpeed;
		instance.m_drawAdd = rhs.m_drawAdd;
	}
}

function Emitter (particle) {
	// Instance
	var instance = this;
	var degToRad = 0.0174532925199433;
	
	// Clear all variable - reset
	this.Reset = function () {
		// Position
		instance.m_x = 0;
		instance.m_y = 0;
		instance.m_w = 0;
		instance.m_h = 0;
		
		// Life
		instance.m_lifeTime = 0;
		instance.m_time = 0;
		instance.m_start = false;
		
		// Emit parameters
		instance.m_emitForceMin = 0;
		instance.m_emitForceMax = 0;
		instance.m_emitAngleStart = 0;
		instance.m_emitAngleEnd = 360;
		instance.m_emitRate = 0;
		
		// Particle parameters
		instance.m_randomizeScaleMin = 0;
		instance.m_randomizeScaleMax = 0;
		instance.m_randomizeAngleMin = 0;
		instance.m_randomizeAngleMax = 0;
		instance.m_randomizeLifeMin  = 0;
		instance.m_randomizeLifeMax  = 0;
		instance.m_randomizeRotateSpeedMin = 0;
		instance.m_randomizeRotateSpeedMax = 0;

		instance.m_sampleParticle = [];
		instance.m_engine = null;
	};
	
	this.Reset();
	
	
	var emitCount = 0;
	
	this.SetSampleParticle = function (particle) {
		var index = instance.m_sampleParticle.length;
		instance.m_sampleParticle[index] = particle;
		
	};
	
	this.Start = function () {
		instance.m_start = true;
		instance.m_time = 0;
		instance.m_emitTime = 0;
	};
	
	this.Pause = function() {
		instance.m_start = false;
	};
	this.Resume = function() {
		instance.m_start = true;
	};
	
	
	this.Update = function (deltaTime) {
		if (instance.m_start) {
			// Life
			instance.m_time += deltaTime;
			if (instance.m_lifeTime > 0) {
				if (instance.m_time >= instance.m_lifeTime) {
					instance.m_start = false;
					return;
				}
			}
			
			var emitNumber = 0;
			emitCount += deltaTime;
			emitNumber = (emitCount * instance.m_emitRate) >> 0;
			if (emitNumber > 0) {
				emitCount -= emitNumber / instance.m_emitRate;
			}
			
			for (var i=0; i<emitNumber; i++) {
				var tempParticle = instance.m_engine.CreateParticle();
				
				if (tempParticle != null) {
					var sample = (Math.random() * instance.m_sampleParticle.length) >> 0;
					tempParticle.CloneFrom (instance.m_sampleParticle[sample]);
					tempParticle.Start ();
					
					// Force and direction
					var randomAngle = Math.random() * (instance.m_emitAngleEnd - instance.m_emitAngleStart) + instance.m_emitAngleStart;
						randomAngle = randomAngle % 360;
						randomAngle *= degToRad;
					var randomForce = Math.random() * (instance.m_emitForceMax - instance.m_emitForceMin) + instance.m_emitForceMin;
					tempParticle.m_moveSpeedX = Math.sin(randomAngle) * randomForce;
					tempParticle.m_moveSpeedY = - Math.cos(randomAngle) * randomForce;
					
					// Position
					if (instance.m_w == 0 && instance.m_h == 0) {
						tempParticle.m_x = instance.m_x;
						tempParticle.m_y = instance.m_y;
					}
					else {
						var randomX = instance.m_x + Math.random() * instance.m_w;
						var randomY = instance.m_y + Math.random() * instance.m_h;
						tempParticle.m_x = randomX;
						tempParticle.m_y = randomY;
					}
					
					// Life
					if (instance.m_randomizeLifeMax == 0 && instance.m_randomizeLifeMin == 0) {}
					else {
						var randomLife = Math.random() * (instance.m_randomizeLifeMax - instance.m_randomizeLifeMin) + instance.m_randomizeLifeMin;
						tempParticle.m_lifeTime =  randomLife;
					}
					
					// Angle
					if (instance.m_randomizeAngleMax == 0 && instance.m_randomizeAngleMin == 0) {}
					else {
						var randomAngle  = Math.random() * (instance.m_randomizeAngleMax - instance.m_randomizeAngleMin) + instance.m_randomizeAngleMin;
						tempParticle.m_angle = randomAngle;
					}
					
					// Rotate speed
					if (instance.m_randomizeRotateSpeedMin == 0 && instance.m_randomizeRotateSpeedMax == 0) {}
					else {
						var randomSpeed  = Math.random() * (instance.m_randomizeRotateSpeedMax - instance.m_randomizeRotateSpeedMin) + instance.m_randomizeRotateSpeedMin;
						tempParticle.m_rotateSpeed = randomSpeed;
					}
					
					// Scale
					if (instance.m_randomizeScaleMin == 0 && instance.m_randomizeScaleMax == 0) {}
					else {
						var randomScale  = Math.random() * (instance.m_randomizeScaleMax - instance.m_randomizeScaleMin) + instance.m_randomizeScaleMin;
						tempParticle.m_w *= randomScale;
						tempParticle.m_h *= randomScale;
					}
					
					tempParticle.Start();
				}
			}
		}
	};
	
	this.ManualEmit = function (emitNumber) {
		for (var i=0; i<emitNumber; i++) {
			var tempParticle = instance.m_engine.CreateParticle();
			
			if (tempParticle != null) {
				var sample = (Math.random() * instance.m_sampleParticle.length) >> 0;
				tempParticle.CloneFrom (instance.m_sampleParticle[sample]);
				tempParticle.Start ();
				
				// Force and direction
				var randomAngle = Math.random() * (instance.m_emitAngleEnd - instance.m_emitAngleStart) + instance.m_emitAngleStart;
					randomAngle = randomAngle % 360;
					randomAngle *= degToRad;
				var randomForce = Math.random() * (instance.m_emitForceMax - instance.m_emitForceMin) + instance.m_emitForceMin;
				tempParticle.m_moveSpeedX = Math.sin(randomAngle) * randomForce;
				tempParticle.m_moveSpeedY = - Math.cos(randomAngle) * randomForce;
				
				// Position
				if (instance.m_w == 0 && instance.m_h == 0) {
					tempParticle.m_x = instance.m_x;
					tempParticle.m_y = instance.m_y;
				}
				else {
					var randomX = instance.m_x + Math.random() * instance.m_w;
					var randomY = instance.m_y + Math.random() * instance.m_h;
					tempParticle.m_x = randomX;
					tempParticle.m_y = randomY;
				}
				
				// Life
				if (instance.m_randomizeLifeMax == 0 && instance.m_randomizeLifeMin == 0) {}
				else {
					var randomLife = Math.random() * (instance.m_randomizeLifeMax - instance.m_randomizeLifeMin) + instance.m_randomizeLifeMin;
					tempParticle.m_lifeTime =  randomLife;
				}
				
				// Angle
				if (instance.m_randomizeAngleMax == 0 && instance.m_randomizeAngleMin == 0) {}
				else {
					var randomAngle  = Math.random() * (instance.m_randomizeAngleMax - instance.m_randomizeAngleMin) + instance.m_randomizeAngleMin;
					tempParticle.m_angle = randomAngle;
				}
				
				// Rotate speed
				if (instance.m_randomizeRotateSpeedMin == 0 && instance.m_randomizeRotateSpeedMax == 0) {}
				else {
					var randomSpeed  = Math.random() * (instance.m_randomizeRotateSpeedMax - instance.m_randomizeRotateSpeedMin) + instance.m_randomizeRotateSpeedMin;
					tempParticle.m_rotateSpeed = randomSpeed;
				}
				
				// Scale
				if (instance.m_randomizeScaleMin == 0 && instance.m_randomizeScaleMax == 0) {}
				else {
					var randomScale  = Math.random() * (instance.m_randomizeScaleMax - instance.m_randomizeScaleMin) + instance.m_randomizeScaleMin;
					tempParticle.m_w *= randomScale;
					tempParticle.m_h *= randomScale;
				}
				
				tempParticle.Start();
			}
		}
	}
}


function ParticleEngine () {
	var instance = this;
	var NUMBER_OF_EMITTER = 200;
	var NUMBER_OF_PARTICLE = 20000;
	var particlePool = [];
	var emitterPool = [];
	
	
	this.m_context = null;
	this.m_graphicEngine = null;
	
	this.SetContext = function (context, engine) {
		instance.m_context = context;
		instance.m_graphicEngine = engine;
	};
	
	this.CreateEmitter = function () {
		var tempEmitter = new Emitter();
		tempEmitter.m_engine = instance;
		
		emitterPool.push (tempEmitter);
		return tempEmitter;
	};
	
	this.RemoveEmitter = function (e) {
		for (var i=0; i<emitterPool.length; i++) {
			if (e == emitterPool[i]) {
				emitterPool.splice (i, 1);
			}
		}
	};
	
	this.CreateParticle = function () {
		var tempParticle = null;
		
		for (var j=0; j<particlePool.length; j++) {
			if (particlePool[j]) {
				if (!particlePool[j].m_start) {
					tempParticle = particlePool[j];
					break;
				}
			}
		}
		
		if (tempParticle == null) {
			if (particlePool.length == NUMBER_OF_PARTICLE) {
				return;
			}
			tempParticle = new Particle(instance.m_context);
			tempParticle.m_graphicEngine = instance.m_graphicEngine;
			// CocoonJS hack
			//tempParticle.m_graphicEngine = g_graphicEngine;
			particlePool.push(tempParticle);
		}
		
		return tempParticle;
	};
	
	this.Update = function (deltaTime) {
		cc.log("ParticleEngine update", deltaTime);
		for (var i=0; i<emitterPool.length; i++) {
			if (emitterPool.m_start == false) {
				emitterPool.splice (i, 1);
			}
			else {
				emitterPool[i].Update(deltaTime);
			}
		}
		for (var i=0; i<particlePool.length; i++) {
			particlePool[i].Update(deltaTime);
		}
	};
	
	this.Draw = function (context, x, y, w, h) {
		cc.log('ParticleEngine Draw');
		for (var i=0; i<particlePool.length; i++) {
			particlePool[i].Draw(context, x, y, w, h);
		}
	};
	
	this.Clean = function () {
		cc.log('ParticleEngine Clean');
		particlePool = [];
		emitterPool = [];
	};
}