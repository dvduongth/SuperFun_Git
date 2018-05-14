var fs = require("fs");

module.exports = function Logger () {
	var instance = this;
	var wstream = null;

	this.__logBuffer = [];

	this.startLogfile = function (path) {
		instance.wstream = fs.createWriteStream(path);
	};
	
	this.print = function (string) {
		instance.__logBuffer.push(string);
		/*
		if (instance.wstream != null)
		{
			instance.wstream.write(string + "\r\n");
		}
		else
		{
			console.log(string)
		}*/
	};
	
	this.closeLogfile = function () {
		if (instance.wstream != null) {
			instance.wstream.write(instance.__logBuffer.join("\r\n"));
			instance.wstream.end();
			instance.wstream = null;
		}
	}
};