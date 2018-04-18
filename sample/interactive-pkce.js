'use strict';

const http = require('http');
const querystring = require('query-string');
const opn = require('opn');

const auth = require('../index').auth;

const client = auth.client({
	realm: '###',
	clientId: '###',
	redirectUri: '###',
	baseUrl: '###'
});

const authUrl = client.generateAuthorizeUrl();

const server = http.createServer((req, res) => {
	console.log('req.url: ', req.url);
	if (req.url.indexOf('/callback') > -1) {
		const qs = querystring.parse(req.url);
		res.end('Authorization successful! Please return to the console.');
		server.close();

		console.log('code: ', qs.code);

		client.getToken(qs.code)
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
	}
}).listen(3000, () => {
	opn(authUrl, {wait: false}).then(cp => cp.unref());
});
