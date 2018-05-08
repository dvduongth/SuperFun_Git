function GSLoader () {
	var instance = this;
	var STATE_LOADING_OWN_ASSETS = 0;
	var STATE_LOADING_OTHERS_ASSETS = 1;
	var STATE_CONNECT_TO_SERVER = 2;
	var STATE_ALL_DONE = 3;
	
	var init = false;
	var imgSplash = null;
	
	var state = STATE_LOADING_OWN_ASSETS;

	this.loadingStateToString = function (state) {
		switch (state) {
			case STATE_LOADING_OWN_ASSETS:
				return "STATE_LOADING_OWN_ASSETS";
			case STATE_LOADING_OTHERS_ASSETS:
				return "STATE_LOADING_OTHERS_ASSETS";
			case STATE_CONNECT_TO_SERVER:
				return "STATE_CONNECT_TO_SERVER";
			case STATE_ALL_DONE:
				return "STATE_LOADING_OWN_ASSETS";

			default :
				return "state undefined";
		}
	};

	this.Init = function () {
		if (init == false) {
			cc.log('GSLoader init');
			if(!imgSplash) {
				imgSplash = fr.createSprite("src/Observer/Image/Splash.png");
				imgSplash.retain();
			}
			var parent = gv.layerMgr.getLayerByIndex(LayerId.LAYER_LOADING);
			if(parent) {
				parent.addChild(imgSplash);
				imgSplash.attr({
					anchorX: 0.5,
					anchorY: 0.5,
					x: 0.5 * gv.WIN_SIZE.width,
					y: 0.5 * gv.WIN_SIZE.height
				});
			}
			init = true;
		}
	};
	
	this.Update = function (deltaTime) {
		cc.log('GSLoader update', deltaTime, 'state', instance.loadingStateToString(state));
		switch (state) {
			case STATE_LOADING_OWN_ASSETS:
				if (g_graphicEngine.GetLoadingProgress() == 1) {
					state = STATE_LOADING_OTHERS_ASSETS;
					LoadAllState();
				}
				break;
			case STATE_LOADING_OTHERS_ASSETS:
				if (g_graphicEngine.GetLoadingProgress() == 1) {
					state = STATE_CONNECT_TO_SERVER;
					if (g_replayFileName == "") {
						g_network.Connect();
					}
					else {
						GoToActionPhase();
					}
				}
				break;
			case STATE_CONNECT_TO_SERVER:
				if (g_replayFileName == "" && g_network.GetStatus() == SOCKET_CONNECTED) {
					state = STATE_ALL_DONE;
				}
				break;
			case STATE_ALL_DONE:
				GoToActionPhase();
				break;
		}
	};
	
	this.Draw = function () {
		if(init){
			init = false;
			imgSplash.removeFromParent(false);
			this.Init();
		}
	};
}