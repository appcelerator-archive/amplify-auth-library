// TODO
// import keytar from 'keytar';
// import CONST from './constants';

export default class SecureStore {
	async addData(email, data) {
		// await keytar.setPassword(CONST.AMPLIFY_AUTH_SERVICE, email, data);
	}

	async getData(email) {
		// const accounts = await keytar.getPassword(CONST.AMPLIFY_AUTH_SERVICE, email);
	}

	async removeData(email) {
		// await keytar.deletePassword(CONST.AMPLIFY_AUTH_SERVICE, email);
	}
}
