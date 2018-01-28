import Store from 'electron-store';

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
      welcome: true
    }
  });
}

export function getData (defaults) {
  return new Store({
    name: 'data',
    defaults
  });
}
