'use strict';

const auth = require('amplify-auth-library');

const config = {
	realm: '###',
	clientId: '###',
	clientSecret: '###',
	baseUrl: '###',
	serviceAcct: true
};

const client = auth.client(config);

client.getToken()
	.then(result => {
		return client.getUserInfo(result.access_token);
	})
	.then(info => {
		process.exit(0);
	})
	.catch(err => {
		process.exit(0);
	});
