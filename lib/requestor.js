'use strict';

const rp = require('request-promise-native');

const log = require('./logger').log;

module.exports.makeRequest = async function makeRequest(opts = {}) {
	log('Requst opts: ', opts);
	opts = _configRequestOpts(opts);

	try {
		const response = await rp(opts);
		log('Request good');
		return response;
	} catch (err) {
		log('Request bad');
		throw new Error(_processError(err));
	}
};

function _configRequestOpts(opts = {}) {
	opts.method = opts.method ? opts.method : 'get';
	opts.headers = opts.headers || {};
	if (!opts.headers['Content-Type']) {
		opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}
	return opts;
}

function _processError(err) {
	return err;
}
