var fs = require("fs");

module.exports = function Logger () {
	var instance = this;
	var wstream = null;

	this.__logBuffer = [];
	this.__logPath = "logger";

	this.startLogfile = function (path) {
		instance.wstream = fs.createWriteStream(path);
		//instance.__logPath = path;
	};
	
	this.print = function (string) {
		//instance.__logBuffer.push(string);
		if (instance.wstream != null)
		{
			instance.wstream.write(string + "\r\n");
		}
		else
		{
			console.log(string)
		}
	};
	
	this.closeLogfile = function () {
		/*var buffer = new Buffer(instance.__logBuffer.join("\r\n"));
		var path = instance.__logPath;
		fs.open(path, 'w', function (err, fd) {
			if (err) {
				console.error("error on closeLogfile when open " + path + " to write data");
			}

			fs.write(fd, buffer, 0, buffer.length, null, function (err) {
				if (err) {
					console.error("error on closeLogfile when write " + path + " to write data");
				}

				fs.close(fd, function () {
					console.log("closeLogfile write data done");
				});
			});
		});*/
		if (instance.wstream != null) {
			//instance.wstream.write(instance.__logBuffer.join("\r\n"));

			instance.wstream.end();
			instance.wstream = null;
		}
	}
};