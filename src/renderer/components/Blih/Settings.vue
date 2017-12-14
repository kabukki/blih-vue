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
							<v-flex xs12 sm6>
								<v-select label='Theme' v-model='theme' :items='themes'></v-select>
							</v-flex>
							<v-flex xs12 sm6 text-xs-center>
								<v-switch label='Use a dark variant' v-model='dark'></v-switch>
							</v-flex>
							<v-flex xs12>
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
								<v-list-tile avatar :key='collaborator.name' @click.stop='edit(collaborator)'>
									<tile-avatar :name='collaborator.name'></tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ collaborator.name }}</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action>
										<v-btn icon><v-icon>edit</v-icon></v-btn>
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

		<!-- Dialog: Edit -->
		<v-dialog persistent max-width='500px' v-model='dialog_edit.show'>
			<v-form @submit.prevent='editEdit'>
				<v-card>
					<v-card-title>
						<span class="headline">Edit a collaborator's details</span>
					</v-card-title>
					<v-container grid-list-md text-xs-center>
						<v-layout row wrap>
							<v-flex xs12 sm6>
								<tile-avatar :name='dialog_edit.name'></tile-avatar>
							</v-flex>
							<v-flex xs12 sm6>
								<p>{{ dialog_edit.name }}</p>
							</v-flex>
						</v-layout>
					</v-container>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_edit.loading' @click.stop='editCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='dialog_edit.loading' :loading='dialog_edit.loading'>Edit</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
	</v-container>
</template>

<script>
	import colors from 'vuetify/es5/util/colors';
	import { mapGetters } from 'vuex';
	import TileAvatar from '../TileAvatar';
	import Avatar from '../Avatar';

	export default {
		components: { TileAvatar, Avatar },
		data () {
			return {
				/* Appearance */
				/* Collaborators */
				page: 1,
				perPage: 5,
				/* Dialogs */
				dialog_edit: {
					show: false,
					name: ''
				}
			};
		},
		computed: {
			...mapGetters(['knownCollaborators']),
			welcome: {
				get () {
					return this.$store.state.welcome;
				},
				set (value) {
					this.$store.dispatch('setWelcome', value);
				}
			},
			/* Appearance */
			theme: {
				get () {
					return this.$store.state.theme;
				},
				set (name) {
					const theme = this.$store.getters.themes.find(t => t.name == name);
					this.$vuetify.theme = theme.colors;
					this.$store.dispatch('setTheme', name);
				}
			},
			dark: {
				get () {
					return this.$store.state.dark;
				},
				set (value) {
					this.$store.dispatch('setDark', value);
				}
			},
			themes () {
				return this.$store.getters.themes.map(t => t.name);
			},
			pageCollaborators () {
				const start = (this.page - 1) * this.perPage;
				return this.knownCollaborators.slice(start, start + this.perPage);
			},
			nbPages () {
				return Math.ceil(this.knownCollaborators.length / this.perPage);
			}
		},
		methods: {
			/* Dialog: Edit */
			edit (collaborator) {
				this.dialog_edit.name = collaborator.name;
				this.dialog_edit.show = true;
			},
			editCancel () {
				this.dialog_edit.show = false;
			},
			editEdit () {
				this.dialog_edit.show = false;
			}
		}
	}
</script>

<style lang="css">
</style>
