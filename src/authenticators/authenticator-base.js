import dbg from 'debug';
import querystring from 'querystring';
import jws from 'jws';

import CONST from '../constants';
import requestor from '../requestor';
import { createTokenStore } from '../store';

const debug = dbg('auth:authenticator');

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
		this.endpoints = AuthenticatorBase.getDefaultEndpoints(opts) || opts.endPoints;

		this.tokens = {};
		this.info = {};
		this.email = '';
		this.access_expires = null;
		this.refresh_expires = null;

		this.tokenStore = createTokenStore({
			rootDir: opts.confirDir,
			type: opts.storeType
		});
	}

	static getDefaultEndpoints(opts) {
		return {
			wellKnown: `${opts.baseUrl}/auth/realms/${opts.realm}/.well-known/openid-configuration`,
			auth: `${opts.baseUrl}/auth/realms/${opts.realm}/protocol/openid-connect/auth`,
			token: `${opts.baseUrl}/auth/realms/${opts.realm}/protocol/openid-connect/token`,
			logout: `${opts.baseUrl}/auth/realms/${opts.realm}/protocol/openid-connect/logout`,
			userinfo: `${opts.baseUrl}/auth/realms/${opts.realm}/protocol/openid-connect/userinfo`,
			certs: `${opts.baseUrl}/auth/realms/${opts.realm}/protocol/openid-connect/certs`
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
		const now = new Date().getTime();

		this.tokens = JSON.parse(result);
		const info = jws.decode(this.tokens.id_token || this.tokens.access_token);
		this.email = info.payload.email;

		this.access_expires = (this.tokens.expires_in * 1000) + now;
		this.refresh_expires = (this.tokens.refresh_expires_in * 1000) + now;

		debug('email:', this.email);
		this.tokenStore.addToken(this.email, this.baseUrl, this.tokens);

		return this.tokens;
	}

	async getAccessToken(params) {
		const now = new Date().getTime() + CONST.TOKEN_REFRESH_THRESHOLD;
		if (this.tokens.access_token && this.access_expires > now) {
			return this.tokens.access_token;
		}

		if (!this.tokens.refresh_token || this.refresh_expires <= now) {
			throw new Error('No valid refresh token.');
		}

		// get a new access token
		const result = await this.getToken(params);
		return result.access_token;
	}

	async revokeToken(params) {
		this.tokenStore.removeToken(this.email, this.baseUrl);
		this.tokens = {};
		this.access_expires = null;
		this.refresh_expires = null;

		const result = await requestor({
			method: 'post',
			url: this.endpoints.logout,
			form: params
		});
		return result;
	}

	async getUserInfo(atoken) {
		const result = await requestor({
			method: 'post',
			url: this.endpoints.userinfo,
			headers: {
				'Authorization': `Bearer ${atoken}`
			}
		});
		return JSON.parse(result);
	}
}
