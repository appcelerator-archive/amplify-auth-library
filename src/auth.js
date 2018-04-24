import path from 'path';

export function client(opts = {}) {
	try {
		let authenticator = 'client-secret';
		if (opts.codeChallengeMethod) {
			authenticator = 'pkce';
		} else if (opts.key || opts.keyFile) {
			authenticator = 'signed-jwt';
		}
		const authenticatorClass = require(path.join(__dirname, 'authenticators', authenticator)).default;
		return new authenticatorClass(opts);
	} catch (err) {
		throw new Error(err);
	}
}
