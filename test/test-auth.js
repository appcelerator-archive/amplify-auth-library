import * as assert from 'assert';

import { client } from '../src/auth';
import CONST from '../src/constants';
import ClientSecret from '../src/authenticators/client-secret';
import PKCE from '../src/authenticators/pkce';
import SignedJWT from '../src/authenticators/signed-jwt';

const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';
const REDIRECT_URI = 'REDIRECT';
const BASE_URL = 'BASE';
const REALM = 'REALM';
const KEY_FILE = 'PEM';
const CODE_CHALLENGE_METHOD = 'CODE';

describe('auth', () => {
	it('should get an instance of ClientSecret', () => {
		const authClient = client({
			realm: REALM,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			redirectUri: REDIRECT_URI,
			baseUrl: BASE_URL
		});
		assert.ok(authClient instanceof ClientSecret);
		assert.equal(authClient.grantType, CONST.OAUTH2.GRANT_TYPES.AUTHORIZATION_CODE);
	});

	it('should get an instance of PKCE', () => {
		const authClient = client({
			realm: REALM,
			clientId: CLIENT_ID,
			codeChallengeMethod: CODE_CHALLENGE_METHOD,
			redirectUri: REDIRECT_URI,
			baseUrl: BASE_URL
		});
		assert.ok(authClient instanceof PKCE);
		assert.equal(authClient.grantType, CONST.OAUTH2.GRANT_TYPES.AUTHORIZATION_CODE);
	});

	it('should get an instance of ClientSecret with client credentials flow', () => {
		const authClient = client({
			realm: REALM,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			serviceAcct: true,
			baseUrl: BASE_URL,

		});
		assert.ok(authClient instanceof ClientSecret);
		assert.equal(authClient.grantType, CONST.OAUTH2.GRANT_TYPES.CLIENT_CREDENTIALS);

	});

	it('should get an instance of SignedJWT', () => {
		const authClient = client({
			realm: REALM,
			clientId: CLIENT_ID,
			baseUrl: BASE_URL,
			keyFile: KEY_FILE
		});
		assert.ok(authClient instanceof SignedJWT);
		assert.equal(authClient.grantType, CONST.OAUTH2.GRANT_TYPES.CLIENT_CREDENTIALS);
	});
});
