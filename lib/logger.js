'use strict';

module.exports = {
	log: function (msg, ...args) {
		const argsLen = args ? args.length : 0;
		if (argsLen > 0) {
			console.log(msg, ...args);
		} else {
			console.log(msg);
		}
	}
};
