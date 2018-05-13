var SOCKET_IDLE = 0;
var SOCKET_CONNECTING = 1;
var SOCKET_CONNECTED = 2;

var COMMAND_PING = 0;
var COMMAND_SEND_KEY = 1;
var COMMAND_SEND_TEAM = 2;
var COMMAND_UPDATE_STATE = 3;
var COMMAND_UPDATE_MAP = 4;
var COMMAND_UPDATE_TANK = 5;
var COMMAND_UPDATE_BULLET = 6;
var COMMAND_UPDATE_OBSTACLE = 7;
var COMMAND_UPDATE_BASE = 8;
var COMMAND_REQUEST_CONTROL = 9;
var COMMAND_CONTROL_PLACE = 10;
var COMMAND_CONTROL_UPDATE = 11;
var COMMAND_UPDATE_POWERUP = 12;
var COMMAND_MATCH_RESULT = 13;
var COMMAND_UPDATE_INVENTORY = 14;
var COMMAND_UPDATE_TIME = 15;
var COMMAND_CONTROL_USE_POWERUP = 16;
var COMMAND_UPDATE_STRIKE = 17;
var console = cc;
function Network(host, port) {
	var instance = this;
	var socket = null;
	var socketStatus = SOCKET_IDLE;
	
	this.Connect = function () {
		console.log('Network connect');
		socket = new WebSocket("ws://" + host + ":" + port);
		socket.binaryType = "arraybuffer";
		socket.onopen = function() {
			console.log ("Network Socket connected");
			socketStatus = SOCKET_CONNECTED;
			instance.SendStartConnectCommand();
		};
		socket.onmessage = function (evt) {
			//cc.log('Network onmessage with evt', JSON.stringify(evt));
			instance.OnMessage (evt.data);
		};
		socket.onclose = function() { 
			socketStatus = SOCKET_IDLE;
			socket = null;
			console.log ("Network Socket closed");
		};
		
		socketStatus = SOCKET_CONNECTING;
		console.log ("Network Connect to: " + host + ":" + port);
	};
	
	this.GetStatus = function () {
		return socketStatus;
	};
	
	this.Send = function (data) {
		//console.log ("Socket send: " + PacketToString(data));
		console.log ("Network Socket send: data.length" + data.length);
		socket.send (data);
	};

	this.SendPing = function () {
		if (socketStatus == SOCKET_CONNECTED) {
			var packet = "";
			packet += EncodeUInt8(COMMAND_PING);
			instance.Send (packet);
		}
	};
	this.SendStartConnectCommand = function () {
		console.log("Network send start connect command");
		if (socketStatus == SOCKET_CONNECTED) {
			console.log("send start");
			var packet = "";
			packet += EncodeUInt8(COMMAND_SEND_KEY);
			packet += EncodeInt8(-1);
			instance.Send (packet);
		}
	};
	this.OnMessage = function (data) {
		//console.log ("Data received: " + PacketToString(data));
		console.log ("Network Data received: data.length" + data.length);
		if (g_gsActionPhase) {
			g_gsActionPhase.OnUpdatePacket(data);
		}
	};
}

function Replay (path) {
	var request = new XMLHttpRequest();
	request.open("POST", path, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onload = function(e) {
		if (request.readyState == 4 && request.status == 200) {
			if (request.response != "") {
				var seeker = 0;
				var data = request.response;
				while (seeker < data.length) {
					var length = DecodeUInt16 (data, seeker); seeker += 2;
					var packet = "";
					packet = data.substr(seeker, length); seeker += length;
					g_gsActionPhase.OnUpdatePacket(packet);
					
				}
			}
		}
	};
	request.send();
}

var EncodeInt8 = function (number) {
	var arr = new Int8Array(1);
	arr[0] = number;
	return String.fromCharCode(arr[0]);
};
var EncodeInt16 = function (number) {
	var arr = new Int16Array(1);
	var char = new Uint8Array(arr.buffer);
	arr[0] = number;
	return String.fromCharCode(char[0], char[1]);
};
var EncodeUInt8 = function (number) {
	var arr = new Uint8Array(1);
	arr[0] = number;
	return String.fromCharCode(arr[0]);
};
var EncodeUInt16 = function (number) {
	var arr = new Uint16Array(1);
	var char = new Uint8Array(arr.buffer);
	arr[0] = number;
	return String.fromCharCode(char[0], char[1]);
};
var EncodeFloat32 = function (number) {
	var arr  = new Float32Array(1);
	var char = new Uint8Array(arr.buffer);
	
	arr[0] = number;
	return String.fromCharCode(char[0], char[1], char[2], char[3]);
};
var DecodeInt8 = function (string, offset) {
	var arr  = new Int8Array(1);
	var char = new Int8Array(arr.buffer);
	arr[0] = string.charCodeAt(offset);
	return char[0];
};
var DecodeInt16 = function (string, offset) {
	var arr  = new Int16Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<2; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
var DecodeUInt8 = function (string, offset) {
	return string.charCodeAt(offset);
};
var DecodeUInt16 = function (string, offset) {
	var arr  = new Uint16Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<2; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};
var DecodeFloat32 = function (string, offset) {
	var arr  = new Float32Array(1);
	var char = new Uint8Array(arr.buffer);
	
	for (var i=0; i<4; ++i) {
		char[i] = string.charCodeAt(offset + i);
	}
	return arr[0];
};

var PacketToString = function (data) {
	var print = "";
	for (var i=0; i<data.length; i++) {
		print += data.charCodeAt(i) + " ";
	}
	return print;
};