/* eslint security/detect-non-literal-require: 0 */

import path from 'path';

export function createTokenStore(opts = {}) {
	try {
		let storeType = opts.type || 'file';
		const tokenStoreClass = require(path.join(__dirname, 'stores', `${storeType}-store`)).default;
		return new tokenStoreClass(opts.rootDir);
	} catch (err) {
		throw new Error(err);
	}
}
