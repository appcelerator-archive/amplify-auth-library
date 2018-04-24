import * as assert from 'assert';
import nock from 'nock';

import requestor from '../src/requestor';

nock.disableNetConnect();

describe('requestor', () => {
	it('should support async/await', async () => {
		const url = 'http://test.com';
		const token = '1234';
		const scope = nock(url).get('/').reply(200, {
			token: token
		});
		const result = await requestor({ url: url });
		scope.done();
		assert.equal(JSON.parse(result).token, token);
	});

	it.skip('should use the http proxy if configured', async () => {});
	it.skip('should use the https proxy if configured', async () => {});
	it.skip('should use the https proxy if both http and https are configured', async () => {});
});
