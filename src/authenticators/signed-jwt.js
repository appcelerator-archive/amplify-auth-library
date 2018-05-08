import crypto from 'crypto';
import dbg from 'debug';
import fs from 'fs';
import jws from 'jws';
import CONST from '../constants';
import AuthenticatorBase from './authenticator-base';

const debug = dbg('auth:signedjwt');

const generateSignedJWT = Symbol('generateSignedJWT');

export default class SignedJWT extends AuthenticatorBase {
	constructor(opts = {}) {
		super(opts);
		this.grantType = CONST.OAUTH2.GRANT_TYPES.CLIENT_CREDENTIALS;
		this.keyFile = opts.keyFile;
	}

	generateAuthorizeUrl(opts = {}) {
		return '';
	}

	[generateSignedJWT] () {
		const key = fs.readFileSync(this.keyFile);
		const iat = Math.floor(new Date().getTime() / 1000);
		const exp = iat + Math.floor((60 * 60 * 1000) / 1000);
		const header = { alg: 'RS256', typ: 'JWT' };
		const claims = {
			[CONST.OAUTH2.JWT.ISSUER]: this.clientId,
			[CONST.OAUTH2.JWT.SUBJECT]: this.clientId,
			[CONST.OAUTH2.JWT.AUDIENCE]: this.endpoints.token,
			[CONST.OAUTH2.JWT.EXPIRES_ON]: exp,
			[CONST.OAUTH2.JWT.ISSUED_AT]: iat
		};
		const signedJWT = jws.sign({ header: header, payload: claims, secret: key });
		this.signedJWT = signedJWT;
		return signedJWT;
	}

	getToken() {
		const signedJWT = this[generateSignedJWT]();
		const queryParams = {
			client_id: this.clientId,
			grant_type: this.grantType,
			scope: this.scope,
			client_assertion_type: CONST.OAUTH2.GRANT_TYPES.JWT_ASSERTION,
			client_assertion: signedJWT
		};

		debug('getToken queryParams: ', queryParams);
		return super.getToken(queryParams);
	}

	refreshToken() {
		const queryParams = {
			client_id: this.clientId,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			client_assertion_type: CONST.OAUTH2.GRANT_TYPES.JWT_ASSERTION,
			client_assertion: this.signedJWT || this[generateSignedJWT](),
			refresh_token: this.tokens.refresh_token
		};

		return super.getToken(queryParams);
	}

	getAccessToken() {
		const queryParams = {
			client_id: this.clientId,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			client_assertion_type: CONST.OAUTH2.GRANT_TYPES.JWT_ASSERTION,
			client_assertion: this.signedJWT || this[generateSignedJWT](),
			refresh_token: this.tokens.refresh_token
		};

		return super.getAccessToken(queryParams);
	}

	revokeToken() {
		const queryParams = {
			client_id: this.clientId,
			client_assertion_type: CONST.OAUTH2.GRANT_TYPES.JWT_ASSERTION,
			client_assertion: this.signedJWT || this[generateSignedJWT](),
			refresh_token: this.tokens.refresh_token,
		};

		debug('revoke: ', queryParams);
		return super.revokeToken(queryParams);
	}
}
