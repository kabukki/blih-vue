<template>
	<v-app>
		<v-navigation-drawer temporary fixed v-model='left'>
			<v-list>
				<v-list-tile avatar>
					<v-list-tile-avatar><img src="../assets/img/user.png" alt="user"></v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>{{ email }}</v-list-tile-title>
						<v-list-tile-sub-title>{{ login }}</v-list-tile-sub-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
			<v-divider></v-divider>
			<v-list>
				<v-list-tile v-for='link in links' :key='link.title' :to="{name: link.to}">
					<v-list-tile-action><v-icon>{{ link.icon }}</v-icon></v-list-tile-action>
					<v-list-tile-content><v-list-tile-title>{{ link.title }}</v-list-tile-title></v-list-tile-content>
				</v-list-tile>
			</v-list>
			<v-divider></v-divider>
			<v-list>
				<v-list-tile v-for='link in otherLinks' :key='link.title' :to="{name: link.to}">
					<v-list-tile-action><v-icon>{{ link.icon }}</v-icon></v-list-tile-action>
					<v-list-tile-content><v-list-tile-title>{{ link.title }}</v-list-tile-title></v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar dark color='primary' app scroll-target='#content'>
			<v-toolbar-side-icon @click='left = !left'></v-toolbar-side-icon>
			<v-toolbar-title>{{ title }}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon :to="{name: 'login'}"><v-icon>power_settings_new</v-icon></v-btn>
		</v-toolbar>
		<v-content id='content'>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		data () {
			return {
				left: false,
				links: [
					{ icon: 'home', title: 'Home', to: 'blih.repositories' },
					{ icon: 'cloud', title: 'Repositories', to: 'blih.repositories' },
					{ icon: 'vpn_key', title: 'SSH Keys', to: 'blih.ssh-keys' }
				],
				otherLinks: [
					{ icon: 'settings', title: 'Settings', to: 'blih.settings' }
				]
			};
		},
		computed: {
			...mapGetters(['email', 'login']),
			title () {
				return this.$route.params.name
					? this.$route.params.name
					: this.capitalize(this.$route.name.split('.')[1]);
			}
		},
		methods: {
			capitalize (str) {
				return str
					.replace('-', ' ')
					.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
			}
		}
	}
</script>

<style lang="css">
</style>
