import debug from 'debug';
import rp from 'request-promise-native';

debug('auth:requestor');

async function makeRequest(opts = {}) {
	debug('Requst opts: ', opts);
	opts = _configRequestOpts(opts);

	try {
		const response = await rp(opts);
		debug('Request good');
		return response;
	} catch (err) {
		debug('Request bad', err);
		throw new Error(_processError(err));
	}
}

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

export default makeRequest;
