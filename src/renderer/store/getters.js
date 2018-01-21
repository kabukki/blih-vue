export default {
    api: state => state.api,
    email: state => state.email,
    login: state => state.login,
    repositories: state => state.repositories,
    keys: state => state.keys,
    /* Config */
    lastEmail: state => state.lastEmail,
    theme: state => state.theme,
    dark: state => state.dark,
    welcome: state => state.welcome,
    /* Data */
    collaborators: state => state.collaborators,
    colorMap: state => state.colorMap,
    colorOf: state => text => {
        const letter = (text && text.length) ? text[0].toLowerCase() : '?';
        return state.colorMap[letter] || 'black';
    },
    modules: state => state.modules,
    getModule: state => repo => {
        for (const module of state.modules) {
            for (const regexp of module.regexp) {
                if (repo.match(regexp)) {
                    return {
                        name: module.name,
                        icon: module.icon,
                        color: module.color
                    };
                }
            }
        }
        return null;
    },
    themes: state => state.themes
};