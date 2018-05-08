import dbg from 'debug';
import CONST from '../constants';
import AuthenticatorBase from './authenticator-base';

const debug = dbg('auth:password');

export default class OwnerPassword extends AuthenticatorBase {
	constructor(opts = {}) {
		super(opts);
		this.email = opts.username;
		this.password = opts.password;
		this.grantType = CONST.OAUTH2.GRANT_TYPES.PASSWORD;
	}

	generateAuthorizeUrl(opts = {}) {
		return '';
	}

	getToken() {
		const queryParams = {
			client_id: this.clientId,
			scope: this.scope,
			grant_type: this.grantType,
			username: this.email,
			password: this.password
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

	getAccessToken() {
		const queryParams = {
			client_id: this.clientId,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			refresh_token: this.tokens.refresh_token
		};

		return super.getAccessToken(queryParams);
	}

	revokeToken() {
		const queryParams = {
			client_id: this.clientId,
			refresh_token: this.tokens.refresh_token,
		};

		debug('revoke: ', queryParams);
		return super.revokeToken(queryParams);
	}
}
