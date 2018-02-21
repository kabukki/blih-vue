import * as defaults from './defaults';
import { ignoreCaseSort, getConfig, getData } from '../helpers';

let [data, config] = [getData(defaults), getConfig()];

// IDEA: one object for all config and data
export default {
	api: null,
	email: null,
	login: null,
	repositories: [],
	keys: [],
	/* Config */
	lastEmail: config.get('lastEmail'),
	theme: config.get('theme'),
	dark: config.get('dark'),
	welcome: config.get('welcome'),
	/* Data */
	collaborators: data.get('collaborators').sort(ignoreCaseSort),
	colorMap: defaults.colorMap, // data.get('colorMap'),
	rawColorMap: defaults.rawColorMap,
	modules: defaults.modules.sort(ignoreCaseSort), // data.get('modules').sort(ignoreCaseSort),
	themes: defaults.themes.sort(ignoreCaseSort) // data.get('themes').sort(ignoreCaseSort)
};
