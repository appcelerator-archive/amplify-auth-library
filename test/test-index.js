import * as assert from 'assert';
import * as lib from '../src';

describe('index', () => {
	it('should export client', () => {
		assert.ok(lib.client);
	});
});
