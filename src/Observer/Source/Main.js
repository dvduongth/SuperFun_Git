// The network object, handle the socket stuff
var g_network;
var g_replay;
// What state do we need?
var g_gsLoader;
var g_gsActionPhase;


var g_serverHost = "127.0.0.1";
var g_serverPort = 3011;
var g_replayFileName = "";

function LoadAllState () {
	cc.log('main load all state');
	// Create, but not connect yet
	if (g_replayFileName == "") {
		cc.log('create global network', g_serverHost, g_serverPort);
		g_network = new Network(g_serverHost, g_serverPort);
	} else {
		cc.log('create global replay', g_replayFileName);
		g_replay = new Replay(g_replayFileName);
	}
	
	// State
	cc.log('main create new GSActionPhase');
	g_gsActionPhase = new GSActionPhase();
	g_gsActionPhase.Init();
}

function GoToLoaderState () {
	cc.log('Main go to loader state');
	g_gsLoader = new GSLoader();
	g_gsLoader.Init();
	g_stateEngine.SwitchState (g_gsLoader, 0);
}

function GoToActionPhase() {
	cc.log('Main go to action phase');
	g_gsActionPhase.Init();
	g_stateEngine.SwitchState (g_gsActionPhase, 1);
}