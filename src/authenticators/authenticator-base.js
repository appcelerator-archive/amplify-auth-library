import querystring from 'querystring';

import CONST from '../constants';
import requestor from '../requestor';

export default class AuthenticatorBase {
	constructor (opts = {}) {
		this.clientId = opts.clientId;
		this.redirectUri = opts.redirectUri;
		this.scope = opts.scope || CONST.OAUTH2.SCOPE.OPENID;
		this.grantType = opts.grantType || CONST.OAUTH2.GRANT_TYPES.AUTHORIZATION_CODE;
		this.responseType = opts.responseType || CONST.OAUTH2.RESPONSE_TYPE.CODE;
		this.accessType = opts.accessType || CONST.OAUTH2.ACCESS_TYPE.OFFLINE;

		this.baseUrl = opts.baseUrl;
		this.realm = opts.realm;
		this.endpoints = AuthenticatorBase.getDefaultEndpoints(opts);
	}

	static getDefaultEndpoints(opts) {
		return {
			wellKnown: `${opts.baseUrl}/realms/${opts.realm}/.well-known/openid-configuration`,
			auth: `${opts.baseUrl}/realms/${opts.realm}/protocol/openid-connect/auth`,
			token: `${opts.baseUrl}/realms/${opts.realm}/protocol/openid-connect/token`,
			logout: `${opts.baseUrl}/realms/${opts.realm}/protocol/openid-connect/logout`,
			userinfo: `${opts.baseUrl}/realms/${opts.realm}/protocol/openid-connect/userinfo`,
			certs: `${opts.baseUrl}/realms/${opts.realm}/protocol/openid-connect/certs`
		};
	}

	async endpointsDiscovery(url) {
		const endpoint = url || this.endpoints.wellKnown;
		const result = await requestor({
			method: 'get',
			url: endpoint
		});
		this.endpoints = JSON.parse(result);
		return this.endpoints;
	}

	generateAuthorizeUrl(params) {
		return `${this.endpoints.auth}?${querystring.stringify(params)}`;
	}

	async getToken(params) {
		const result = await requestor({
			method: 'post',
			url: this.endpoints.token,
			form: params
		});

		this.tokens = JSON.parse(result);
		return this.tokens;
	}

	async getUserInfo(atoken) {
		const result = await requestor({
			method: 'post',
			url: this.endpoints.userinfo,
			headers: {
				'Authorization': `Bearer ${atoken}`
			}
		});
		return result;
	}
}
