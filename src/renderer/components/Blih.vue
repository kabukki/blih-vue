<template>
	<v-app :dark="dark">
		<v-navigation-drawer app temporary v-model='drawer'>
			<v-toolbar flat class='transparent'>
				<v-list class='pa-0'>
					<v-list-tile avatar>
						<tile-avatar :name='login'></tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>{{ email }}</v-list-tile-title>
							<v-list-tile-sub-title>{{ login }}</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-toolbar>
			<v-divider></v-divider>
			<v-list class='pt-0'>
				<v-list-tile ripple v-for='link in links' :key='link.title' :to="{name: link.to}">
					<v-list-tile-action><v-icon>{{ link.icon }}</v-icon></v-list-tile-action>
					<v-list-tile-content><v-list-tile-title>{{ link.title }}</v-list-tile-title></v-list-tile-content>
				</v-list-tile>
				<v-divider></v-divider>
				<v-list-tile ripple v-for='link in otherLinks' :key='link.title' :to="{name: link.to}">
					<v-list-tile-action><v-icon>{{ link.icon }}</v-icon></v-list-tile-action>
					<v-list-tile-content><v-list-tile-title>{{ link.title }}</v-list-tile-title></v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar app dark color='secondary'>
			<v-btn icon @click='drawer = !drawer' v-if="navicon == 'drawer'">
				<v-icon>menu</v-icon>
			</v-btn>
			<v-btn icon @click='goBack' v-else>
				<v-icon>arrow_back</v-icon>
			</v-btn>
			<v-toolbar-title>{{ title }}</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-toolbar>
		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	import { mapGetters } from 'vuex';
	import TileAvatar from './TileAvatar';

	export default {
		components: { TileAvatar },
		data () {
			return {
				drawer: false,
				links: [
					{ icon: 'cloud', title: 'Repositories', to: 'blih.repositories', nav: 'drawer' },
					{ icon: 'vpn_key', title: 'SSH keys', to: 'blih.ssh-keys', nav: 'drawer' }
				],
				otherLinks: [
					{ icon: 'settings', title: 'Settings', to: 'blih.settings', nav: 'drawer' },
					{ icon: 'exit_to_app', title: 'Log out', to: 'login', nav: 'drawer' }
				],
				noLinks: [
					{ title: 'Repository', to: 'blih.repository', nav: 'back' },
					{ title: 'SSH key', to: 'blih.ssh-key', nav: 'back' }
				]
			};
		},
		computed: {
			...mapGetters(['email', 'login', 'dark']),
			title () {
				let page = this.getCurrentPage();
				return (page ? page.title : '[untitled]');
			},
			navicon () {
				let page = this.getCurrentPage();
				return (page ? page.nav : 'drawer');
			}
		},
		methods: {
			getCurrentPage () {
				let links = this.links.concat(this.otherLinks, this.noLinks);
				return links.filter(l => l.to === this.$route.name)[0];
			},
			goBack () {
				this.$router.go(-1);
			}
		}
	};
</script>

<style lang="css">
</style>
