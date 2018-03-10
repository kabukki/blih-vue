import Blih from 'blih';

import { ignoreCaseSort } from '../helpers';

export default {
	authenticate (context, credentials) {
		try {
			let api = new Blih({ email: credentials.email, password: credentials.password });
			return api.whoami()
				.then(data => {
					context.commit('AUTHENTICATE', {
						api,
						email: credentials.email,
						login: data
					});
				});
		} catch (err) {
			return Promise.reject(err);
		}
	},
	async updateRepositories (context) {
		const repos = await context.getters.api.listRepositories();
		context.commit('UPDATE_REPOSITORIES', {
			repositories: repos.sort(ignoreCaseSort)
				.map(r => Object.freeze({
					...r,
					module: context.getters.getModule(r.name)
				}))
		});
	},
	createRepository (context, name) {
		return context.getters.api.createRepository(name)
			.then(_ => {
				context.commit('ADD_REPOSITORY', {
					name,
					label: context.getters.getModule(name)
				});
			});
	},
	deleteRepository (context, name) {
		return context.getters.api.deleteRepository(name)
			.then(_ => {
				context.commit('REMOVE_REPOSITORY', {
					name
				});
			});
	},
	updateKeys (context) {
		return context.getters.api.listKeys()
			.then(data => {
				context.commit('UPDATE_KEYS', { keys: data });
			});
	},
	uploadKey (context, key) {
		const oldKeys = context.getters.keys;
		return context.getters.api.uploadKey(key)
			.then(_ => context.dispatch('updateKeys'))
		// Return the new key
			.then(_ => context.getters.keys.filter(k => !oldKeys.find(ok => ok.name === k.name))[0]);
	},
	deleteKey (context, key) {
		return context.getters.api.deleteKey(key)
			.then(_ => {
				context.commit('REMOVE_KEY', {
					name: key
				});
			});
	},
	/* Config */
	setLastEmail (context, email) {
		context.commit('SET_LAST_EMAIL', { email });
	},
	setTheme (context, theme) {
		context.commit('SET_THEME', { theme });
	},
	setDark (context, value) {
		context.commit('SET_DARK', { value });
	},
	setWelcome (context, value) {
		context.commit('SET_WELCOME', { value });
	},
	setPublicKeyPath (context, path) {
		context.commit('SET_PUBLIC_KEY_PATH', { path });
	},
	setPrivateKeyPath (context, path) {
		context.commit('SET_PRIVATE_KEY_PATH', { path });
	},
	/* Data */
	addCollaborator (context, name) {
		if (!context.getters.collaborators.find(c => c.name === name)) {
			context.commit('ADD_COLLABORATOR', {
				name,
				picture: false,
				aliases: []
			});
		}
	},
	updateCollaborator (context, data) {
		if (context.getters.collaborators.find(c => c.name === data.name)) {
			context.commit('UPDATE_COLLABORATOR', data);
		}
	},
	updateModule (context, data) {
		if (context.getters.modules.find(c => c.name === data.name)) {
			context.commit('UPDATE_MODULE', data);
		}
	}
};
