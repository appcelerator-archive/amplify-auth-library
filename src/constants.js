import os from 'os';
import path from 'path';

const constants = {
	OAUTH2 : {
		ACCESS_TYPE: {
			OFFLINE: 'offline'
		},

		GRANT_TYPES: {
			AUTHORIZATION_CODE: 'authorization_code',
			CLIENT_CREDENTIALS: 'client_credentials',
			PASSWORD: 'password',
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
				S256: 'S256'
			}
		},

		JWT: {
			ISSUER : 'iss',
			SUBJECT : 'sub',
			AUDIENCE : 'aud',
			EXPIRES_ON : 'exp',
			ISSUED_AT: 'iat'
		},
	},
	TOKEN_REFRESH_THRESHOLD:  5 * 60 * 1000,
	TOKEN_FOLDER_NAME: 'tokens',
	DEFAULT_CONFIG_DIR: path.join(os.homedir(), '.amplify')
};

export default constants;
