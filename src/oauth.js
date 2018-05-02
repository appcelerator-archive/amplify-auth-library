/* eslint security/detect-non-literal-require: 0 */

import path from 'path';

export function client(opts) {
	if (!opts) {
		throw new Error('Please provide client credentials.');
	}

	try {
		let authenticator = 'pkce';
		if (opts.clientSecret) {
			authenticator = 'client-secret';
		} else if (opts.key || opts.keyFile) {
			authenticator = 'signed-jwt';
		}

		const authenticatorClass = require(path.join(__dirname, 'authenticators', authenticator)).default;
		return new authenticatorClass(opts);
	} catch (err) {
		throw new Error(err);
	}
}
