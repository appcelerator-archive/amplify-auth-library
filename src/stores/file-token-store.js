import crypto from 'crypto';
import dbg from 'debug';
import fs from 'fs';
import path from 'path';

import CONST from '../constants';

const debug = dbg('auth:filestore');

export default class FileTokenStore {
	constructor(configDir) {
		this.tokenDir = path.join(configDir, CONST.TOKEN_FOLDER_NAME);
	}

	addToken(email, url, data) {
		const opts = {
			encoding: 'utf8',
			mode: 384,
			flag: 'w'
		};
		const tokenFilePath = this.generateTokenFilePath(email, url);

		debug(tokenFilePath);
		const newData = Object.assign(data, {
			email: email,
			url: url
		});
		fs.writeFileSync(tokenFilePath, JSON.stringify(data, null, 2), opts);
	}

	getToken(email, url) {
		const tokenFilePath = this.generateTokenFilePath(email, url);
		let result = {};

		const hasFile = fs.existsSync(tokenFilePath);
		if (hasFile) {
			result = this.getTokenFileContent(tokenFilePath);
		}

		return result;
	}

	removeToken(email, url) {
		const tokenFilePath = this.generateTokenFilePath(email, url);
		fs.unlinkSync(tokenFilePath);
	}

	getAccounts() {
		const result = [];
		const dir = this.tokenDir;
		for (const name of fs.readdirSync(dir)) {
			const file = path.join(dir, name);
			const content = this.getTokenFileContent(file);
			result.push({
				email: content.email,
				url: content.url
			});
		}

		return result;
	}

	stripBOM(content) {
		if (Buffer.isBuffer(content)) {
			content = content.toString('utf8');
		}
		content = content.replace(/^\uFEFF/, '');
		return content;
	}

	generateTokenFilePath(email, url) {
		const value = `${email}:${url}`;
		const tokenFileName = crypto.createHash('sha1').update(value).digest('hex');
		return path.join(this.tokenDir, tokenFileName);
	}

	getTokenFileContent(tokenFilePath) {
		const content = fs.readFileSync(tokenFilePath);
		const result = this.stripBOM(content);
		return JSON.parse(result);
	}
}
