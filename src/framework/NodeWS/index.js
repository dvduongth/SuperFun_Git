'use strict';
var NodeWS_Index = {};
/**
 * Create a WebSocket server
 * @param {Object} [options] will be passed to net.createServer() or tls.createServer(), with the additional property 'secure' (a boolean)
 * @param {Function} callback will be added as 'connection' listener
 * @returns {Server}
 */
NodeWS_Index.createServer = function (options, callback) {
	/*if (typeof options === 'function' || !arguments.length) {
		return new NodeWS_Server(false, options);
	}
	return new NodeWS_Server(Boolean(options.secure), options, callback);*/
};

/**
 * Create a WebSocket client
 * @param {string} URL with the format 'ws://localhost:8000/chat' (the port can be ommited)
 * @param {Object} [options] will be passed to net.connect() or tls.connect()
 * @param {Function} callback will be added as 'connect' listener
 * @returns {NodeWS_Connection}
 */
NodeWS_Index.connect = function (URL, options, callback) {
	var socket;

	if (typeof options === 'function') {
		callback = options;
		options = undefined;
	}
	options = options || {};

	URL = parseWSURL(URL);
	options.port = URL.port;
	options.host = URL.host;
	if (URL.secure) {
		socket = tls.connect(options);
	} else {
		socket = net.connect(options);
	}

	return new NodeWS_Connection(socket, URL, callback);
};

/**
 * Set the minimum size of a pack of binary data to send in a single frame
 * @param {number} bytes
 */
NodeWS_Index.setBinaryFragmentation = function (bytes) {
	NodeWS_Connection.binaryFragmentation = bytes;
};

/**
 * Set the maximum size the internal Buffer can grow, to avoid memory attacks
 * @param {number} bytes
 */
NodeWS_Index.setMaxBufferLength = function (bytes) {
	NodeWS_Connection.maxBufferLength = bytes;
};

/**
 * Parse the WebSocket URL
 * @param {string} URL
 * @returns {Object}
 * @private
 */
function parseWSURL(URL) {
	var parts, secure;

	parts = url.parse(URL);

	parts.protocol = parts.protocol || 'ws:';
	if (parts.protocol === 'ws:') {
		secure = false;
	} else if (parts.protocol === 'wss:') {
		secure = true;
	} else {
		throw new Error('Invalid protocol ' + parts.protocol + '. It must be ws or wss');
	}

	parts.port = parts.port || (secure ? 443 : 80);
	parts.path = parts.path || '/';

	return {
		path: parts.path,
		port: parts.port,
		secure: secure,
		host: parts.hostname
	};
}