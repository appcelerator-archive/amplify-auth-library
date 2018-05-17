'use strict';

const auth = require('amplify-auth-library');

const config = {
	realm: '###',
	clientId: '###',
	username: '###',
	password: '###',
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
    .then(token => {
        process.exit(0);
    })
	.catch(err => {
		process.exit(0);
	});
