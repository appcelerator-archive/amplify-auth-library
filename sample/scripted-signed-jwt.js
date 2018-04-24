'use strict';

const auth = require('amplify-auth-library');

const config = {
	realm: '###',
	clientId: '###',
	keyFile: '###.pem',
	baseUrl: '###'
};

const client = auth.client(config);

client.getToken()
	.then(result => {
		return client.getUserInfo(result.access_token);
	})
	.then(info => {
		return client.refreshToken();
	})
	.then(result => {
		process.exit(0);
	})
	.catch(err => {
		process.exit(0);
	});
