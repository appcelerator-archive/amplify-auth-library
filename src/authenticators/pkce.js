import crypto from 'crypto';
import debug from 'debug';

import CONST from '../constants';
import AuthenticatorBase from './authenticator-base';

debug('auth:pkce');

export default class PKCE extends AuthenticatorBase {

	constructor(opts = {}) {
		super(opts);
		this.grantType = CONST.OAUTH2.GRANT_TYPES.AUTHORIZATION_CODE;
		this.codeChallengeMethod = CONST.OAUTH2.PKCE.CODE_CHALLENGE_METHOD.S256;
		this.codeVerifier = null;
		this.codeChallenge = null;
	}

	generateAuthorizeUrl(opts = {}) {
		const { codeVerifier, codeChallenge } = this.generateCodeVerifier();
		this.codeVerifier = codeVerifier;
		this.codeChallenge = codeChallenge;

		debug('codeVerifier: ', codeVerifier);
		debug('codeChallenge: ', codeChallenge);

		const queryParams = {
			scope: this.scope,
			response_type: this.responseType,
			access_type: this.accessType,
			grant_type: this.grantType,
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			code_challenge_method: this.codeChallengeMethod,
			code_challenge: codeChallenge
		};

		return super.generateAuthorizeUrl(queryParams);
	}

	generateCodeVerifier() {
		const randomString = crypto.randomBytes(32).toString('base64');
		const codeVerifier = randomString.replace(/\+/g, '_')
			.replace(/=/g, '~')
			.replace(/\//g, '-');
		const codeChallenge = crypto.createHash('sha256')
			.update(codeVerifier)
			.digest('base64')
			.split('=')[0]
			.replace(/\+/g, '_')
			.replace(/\//g, '-');
		return { codeVerifier, codeChallenge };
	}

	getToken(authCode) {
		const queryParams = {
			client_id: this.clientId,
			code_verifier: this.codeVerifier,
			grant_type: this.grantType,
			redirect_uri: this.redirectUri,
			code: authCode
		};

		debug('getToken queryParams: ', queryParams);
		return super.getToken(queryParams);
	}

	refreshToken() {
		const queryParams = {
			client_id: this.clientId,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			refresh_token: this.tokens.refresh_token
		};

		return super.getToken(queryParams);
	}
}
