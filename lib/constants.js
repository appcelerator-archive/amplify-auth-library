'use strict';

const constants = {
	OAUTH2 : {
		ACCESS_TYPE: {
			OFFLINE: 'offline'
		},

		GRANT_TYPES: {
			AUTHORIZATION_CODE: 'authorization_code',
			CLIENT_CREDENTIALS: 'client_credentials',
			REFRESH_TOKEN: 'refresh_token',
			JWT_ASSERTION: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
		},

		RESPONSE_TYPE: {
			CODE: 'code'
		},

		SCOPE: {
			OPENID: 'openid'
		},

		PKCE: {
			CODE_CHALLENGE_METHOD: {
				S256: 'S256',
				PLAIN: 'plain'
			}
		},

		JWT : {
			ISSUER : 'iss',
			SUBJECT : 'sub',
			AUDIENCE : 'aud',
			EXPIRES_ON : 'exp',
			ISSUED_AT: 'iat'
		},
	}
};

module.exports = constants;
