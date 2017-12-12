<template>
	<v-container fluid grid-list-xs>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Title -->
			<v-flex xs12>
				<v-card tile dark color='primary' class='pa-4'>
					<v-card-text class='text-xs-center'>
						<div class="display-3">Settings</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Welcome page -->
			<v-flex xs12>
				<v-card tile>
					<v-card-text>
						<p class="text-xs-center subheading grey--text mb-0">Welcome page</p>
						<v-switch label='Show welcome page on startup' v-model='welcome'></v-switch>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Appearance -->
			<v-flex xs12>
				<v-card tile>
					<v-container>
						<p class="text-xs-center subheading grey--text mb-0">Appearance</p>
						<v-layout row wrap>
							<v-flex xs12 sm3>
								<v-select label='Theme' v-model='theme' :items='themes'></v-select>
							</v-flex>
							<v-flex xs12 sm9>
								<div class="text-xs-center">
									<p class='mb-0'><v-icon>palette</v-icon> Theme colors</p>
									<v-chip color='primary' text-color='white'>Primary</v-chip>
									<v-chip color='secondary' text-color='white'>Secondary</v-chip>
									<v-chip color='accent' text-color='white'>Accent</v-chip>
									<v-chip color='error' text-color='white'>Error</v-chip>
									<v-chip color='info' text-color='white'>Info</v-chip>
									<v-chip color='success' text-color='white'>Success</v-chip>
									<v-chip color='warning' text-color='white'>Warning</v-chip>
								</div>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card>
			</v-flex>
			<!-- Collaborators -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<p class="subheading grey--text mb-0">Collaborators</p>
						<v-list one-line v-if='knownCollaborators.length > 0'>
							<template v-for='(collaborator, index) in pageCollaborators'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key='collaborator.name'>
									<tile-avatar :name='collaborator.name'></tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ collaborator.name }}</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action>
										<v-icon disabled>edit</v-icon>
									</v-list-tile-action>
								</v-list-tile>
							</template>
							<p class='mb-0'>
								<v-icon>people</v-icon> {{ knownCollaborators.length }} collaborators
							</p>
							<v-pagination :length='nbPages' v-model='page'></v-pagination>
						</v-list>
						<p class='mb-0' v-else>
							No known collaborators. Try to browse your repositories first.
						</p>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import colors from 'vuetify/es5/util/colors';
	import { mapGetters } from 'vuex';
	import TileAvatar from '../TileAvatar';

	export default {
		components: { TileAvatar },
		data () {
			return {
				/* Appearance */
				themes: ['light', 'dark'],
				/* Collaborators */
				page: 1,
				perPage: 5,
			};
		},
		computed: {
			...mapGetters(['knownCollaborators']),
			theme: {
				get () {
					return this.$store.state.theme;
				},
				set (theme) {
					this.$store.dispatch('setTheme', theme);
					/*
					if (theme == 'dark') {
						this.$vuetify.theme.primary = colors.white;
					}
					//*/
				}
			},
			welcome: {
				get () {
					return this.$store.state.welcome;
				},
				set (value) {
					this.$store.dispatch('setWelcome', value);
				}
			},
			pageCollaborators () {
				const start = (this.page - 1) * this.perPage;
				return this.knownCollaborators.slice(start, start + this.perPage);
			},
			nbPages () {
				return Math.ceil(this.knownCollaborators.length / this.perPage);
			}
		}
	}
</script>

<style lang="css">
</style>
