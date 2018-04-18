'use strict';

const CONST = require('../constants');
const AuthenticatorBase = require('./authenticator-base');
const log = require('../logger').log;

module.exports = class ClientSecret extends AuthenticatorBase {
	constructor(opts = {}) {
		super(opts);
		this.clientSecret = opts.clientSecret;
		this.grantType = opts.serviceAcct ? CONST.OAUTH2.GRANT_TYPES.CLIENT_CREDENTIALS : this.grantType;
	}

	generateAuthorizeUrl(opts = {}) {
		const queryParams = {
			scope: this.scope,
			response_type: this.responseType,
			access_type: this.accessType,
			grant_type: this.grantType,
			client_id: this.clientId,
			redirect_uri: this.redirectUri
		};

		return super.generateAuthorizeUrl(queryParams);
	}

	getToken(authCode) {
		const queryParams = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: this.grantType
		};

		if (this.grantType === CONST.OAUTH2.GRANT_TYPES.AUTHORIZATION_CODE) {
			queryParams['redirect_uri'] = this.redirectUri;
			queryParams['code'] = authCode;
		}

		log('getToken queryParams: ', queryParams);
		return super.getToken(queryParams);
	}

	refreshToken() {
		const queryParams = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			refresh_token: this.tokens.refresh_token
		};

		return super.getToken(queryParams);
	}
};
