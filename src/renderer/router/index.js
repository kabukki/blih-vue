/* eslint object-property-newline: 0 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import Welcome from '../components/Welcome';
import Login from '../components/Login';
import Blih from '../components/Blih';
import Repositories from '../components/Blih/Repositories';
import Repository from '../components/Blih/Repository';
import SshKeys from '../components/Blih/SshKeys';
import SshKey from '../components/Blih/SshKey';
import Settings from '../components/Blih/Settings';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'welcome', component: Welcome },
    { path: '/login', name: 'login', component: Login },
    { path: '/blih', name: 'blih', component: Blih, children: [
      { path: '/repositories', name: 'blih.repositories', component: Repositories },
      { path: '/repository/:name', name: 'blih.repository', component: Repository },
      { path: '/ssh-keys', name: 'blih.ssh-keys', component: SshKeys },
      { path: '/ssh-key/:name', name: 'blih.ssh-key', component: SshKey },
      { path: '/settings', name: 'blih.settings', component: Settings }
    ]},
    { path: '*', redirect: '/' }
  ]
});
