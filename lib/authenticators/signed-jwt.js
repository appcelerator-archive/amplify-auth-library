'use strict';

const CONST = require('../constants');
const AuthenticatorBase = require('./authenticator-base');
const log = require('../logger').log;

const fs = require('fs');
const jws = require('jws');

module.exports = class SignedJWT extends AuthenticatorBase {
	constructor(opts = {}) {
		super(opts);
		this.grantType = CONST.OAUTH2.GRANT_TYPES.CLIENT_CREDENTIALS;
		this.keyFile = opts.keyFile;
	}

	generateAuthorizeUrl(opts = {}) {
		return '';
	}

	getToken() {
		const key = fs.readFileSync(this.keyFile);
		const iat = Math.floor(new Date().getTime() / 1000);
		const exp = iat + Math.floor((60 * 60 * 1000) / 1000);
		const header = { alg: 'RS256', typ: 'JWT' };
		const claims = {
			CONST.OAUTH2.JWT.ISSUER: this.clientId,
			CONST.OAUTH2.JWT.SUBJECT: this.clientId,
			CONST.OAUTH2.JWT.AUDIENCE: this.endpoints.token,
			CONST.OAUTH2.JWT.EXPIRES_ON: exp,
			CONST.OAUTH2.JWT.ISSUED_AT: iat
		};
		const signedJWT = jws.sign({ header : header, payload : claims, secret : key });
		this.signedJWT = signedJWT;
		const queryParams = {
			client_id: this.clientId,
			grant_type: this.grantType,
			client_assertion_type: CONST.OAUTH2.GRANT_TYPES.JWT_ASSERTION,
			client_assertion: signedJWT
		};

		log('getToken queryParams: ', queryParams);
		return super.getToken(queryParams);
	}

	refreshToken() {
		const queryParams = {
			client_id: this.clientId,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			client_assertion_type: CONST.OAUTH2.GRANT_TYPES.JWT_ASSERTION,
			client_assertion: this.signedJWT,
			refresh_token: this.tokens.refresh_token
		};

		return super.getToken(queryParams);
	}

};
