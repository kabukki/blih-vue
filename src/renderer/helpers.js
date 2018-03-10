import Store from 'electron-store';
import map from 'language-map';
import colors from 'vuetify/es5/util/colors';
import moment from 'moment';
import store from './store';
import path from 'path';
import os from 'os';

const sshDir = path.join(os.homedir(), '.ssh');

export function ignoreCaseSort (a, b) {
	if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
	else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
	else return 0;
};

export function getConfig () {
	return new Store({
		defaults: {
			lastEmail: '',
			theme: 'Default',
			dark: false,
			welcome: true,
			publicKeyPath: path.join(sshDir, 'id_rsa.pub'),
			privateKeyPath: path.join(sshDir, 'id_rsa')
		}
	});
}

export function getData (defaults) {
	return new Store({
		name: 'data',
		defaults
	});
}

/**
 * Return the language corresponding to this file
 */
export function getFileLanguage (filename) {
	const ext = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 1);
	for (const key in map) {
		const language = map[key];

		if ((language.extensions && language.extensions.includes(ext)) ||
				(language.filenames && language.filenames.includes(filename))) {
			return {
				name: key,
				...language
			};
		}
	}
	return null;
}

/**
 * Get languages of a tree returned by RepositoryHub
 * Returns { lang... }
 */
export function getTreeLanguages (files) {
	let languages = {};

	for (const file of files) {
		if (file.children) {
			let clanguages = getTreeLanguages(file.children);
			for (const lang in clanguages) {
				if (!languages.hasOwnProperty(lang)) {
					languages[lang] = 0;
				}
				languages[lang] += clanguages[lang];
			}
		} else if (file.type !== 'blob') {
			continue;
		}

		let language = getFileLanguage(file.name);
		if (language === null) continue;

		if (!languages.hasOwnProperty(language.name)) {
			languages[language.name] = 0;
		}
		languages[language.name]++;
	}

	return languages;
}

/**
 * Get languages of a tree returned by RepositoryHub as a chart.js data object
 */
export function getTreeLanguagesChart (files) {
	let chart = {};
	let languages = getTreeLanguages(files);

	chart.labels = Object.keys(languages);
	chart.datasets = [{
		data: Object.values(languages),
		backgroundColor: Object.keys(languages).map(lang => map[lang].color || colors.grey.lighten1)
	}];

	return chart;
}

/**
 * Get history of commits returned by RepositoryHub as a chart.js data object
 */
export function getHistoryChart (history) {
	let chart = {};
	let commits = {};

	for (const commit of history) {
		const author = commit.author().name();
		const date = moment(commit.date(), 'YYYY-MM-DD hh:mm:ss ZZ');

		if (!commits.hasOwnProperty(author)) {
			commits[author] = {};
		}
		if (!commits[author].hasOwnProperty(date)) {
			commits[author][date] = 0;
		}
		commits[author][date]++;
	}

	// console.log(commits);
	chart.labels = [];
	chart.datasets = Object.keys(commits)
		.map(author => ({
			label: author,
			data: Object.keys(commits[author])
				.map(date => commits[author][date]),
			backgroundColor: store.getters.rawColorOf(author)
		}));

	return chart;
}

/**
 * Get contributions returned by RepositoryHub as a chart.js data object
 */
export function getContributionsChart (history) {
	let chart = {};
	let commits = {};

	for (const commit of history) {
		const author = commit.author().name();

		if (!commits.hasOwnProperty(author)) {
			commits[author] = 0;
		}
		commits[author]++;
	}

	chart.labels = Object.keys(commits);
	chart.datasets = [{
		data: Object.values(commits),
		backgroundColor: Object.keys(commits).map(author => store.getters.rawColorOf(author))
	}];

	return chart;
}
