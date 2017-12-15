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
					<v-container>
						<p class="text-xs-center subheading grey--text mb-0">Welcome page</p>
						<v-layout row wrap>
							<v-flex xs12>
								<v-switch label='Show welcome page on startup' v-model='welcome'></v-switch>
							</v-flex>
						</v-layout>
					</v-container>
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
						<v-list one-line v-if='collaborators.length > 0'>
							<template v-for='(collaborator, index) in pageCollaborators'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key='collaborator.name' @click.stop='editCollaborator(collaborator)'>
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
								<v-icon>people</v-icon> {{ collaborators.length }} collaborators
							</p>
							<v-pagination :length='nbPagesCollaborators' v-model='pageCollaborator'></v-pagination>
						</v-list>
						<p class='mb-0' v-else>
							No known collaborators. Try to browse your repositories first.
						</p>
					</v-container>
				</v-card>
			</v-flex>
			<!-- Modules -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<p class="subheading grey--text mb-0">Modules</p>
						<v-list one-line v-if='modules.length > 0'>
							<template v-for='(module, index) in pageModules'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key='module.name' @click.stop='editModule(module)'>
									<v-list-tile-avatar :color='module.color'>
										<span><v-icon>{{ module.icon }}</v-icon></span>
									</v-list-tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ module.name }}</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action>
										<v-btn icon><v-icon>edit</v-icon></v-btn>
									</v-list-tile-action>
								</v-list-tile>
							</template>
							<p class='mb-0'>
								<v-icon>extension</v-icon> {{ modules.length }} modules
							</p>
							<v-pagination :length='nbPagesModules' v-model='pageModule'></v-pagination>
						</v-list>
						<p class='mb-0' v-else>
							No known modules.
						</p>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>

		<!-- Dialog: Edit collaborator -->
		<v-dialog persistent max-width='500px' v-model='dialog_editCollaborator.show'>
			<v-form @submit.prevent='editCollaboratorEdit'>
				<v-card>
					<v-card-title>
						<span class="headline">Edit a collaborator's details</span>
					</v-card-title>
					<v-container grid-list-md text-xs-center>
						<v-layout row wrap>
							<v-flex xs12 sm6>
								<tile-avatar :name='dialog_editCollaborator.collaborator.name'></tile-avatar>
							</v-flex>
							<v-flex xs12 sm6>
								<p>{{ dialog_editCollaborator.collaborator.name }}</p>
							</v-flex>
						</v-layout>
					</v-container>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_editCollaborator.loading' @click.stop='editCollaboratorCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='dialog_editCollaborator.loading' :loading='dialog_editCollaborator.loading'>Edit</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- Dialog: Edit module -->
		<v-dialog persistent scrollable max-width='500px' v-model='dialog_editModule.show'>
				<v-card>
					<v-card-title>
						<span class="headline">Edit a module</span>
					</v-card-title>
					<v-card-text>
						<v-list teo>
							<v-list-tile avatar>
								<v-list-tile-avatar :color='dialog_editModule.module.color'>
									<span><v-icon>{{ dialog_editModule.module.icon }}</v-icon></span>
								</v-list-tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title>{{ dialog_editModule.module.name }}</v-list-tile-title>
									<v-list-tile-sub-title>Icon: {{ dialog_editModule.module.icon }}, color: {{ dialog_editModule.module.color }}</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
						<v-list one-line subheader class='text-xs-center'>
							<v-subheader>Matches</v-subheader>
							<template v-for='(regexp, index) in dialog_editModule.module.regexp'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile :key='regexp'>
									<v-list-tile-content>
										<v-list-tile-title>{{ regexp }}</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
							<v-btn>Add a regexp</v-btn>
						</v-list>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat @click.stop='editModuleCancel'>Close</v-btn>
					</v-card-actions>
				</v-card>
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
				pageCollaborator: 1,
				pageModule: 1,
				perPage: 5,
				/* Dialogs */
				dialog_editCollaborator: {
					show: false,
					collaborator: {}
				},
				dialog_editModule: {
					show: false,
					module: {}
				}
			};
		},
		computed: {
			...mapGetters(['collaborators', 'modules']),
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
				const start = (this.pageCollaborator - 1) * this.perPage;
				return this.collaborators.slice(start, start + this.perPage);
			},
			pageModules () {
				const start = (this.pageModule - 1) * this.perPage;
				return this.modules.slice(start, start + this.perPage);
			},
			nbPagesCollaborators () {
				return Math.ceil(this.collaborators.length / this.perPage);
			},
			nbPagesModules () {
				return Math.ceil(this.modules.length / this.perPage);
			}
		},
		methods: {
			/* Dialog: Edit collaborator */
			editCollaborator (collaborator) {
				this.dialog_editCollaborator.collaborator = collaborator;
				this.dialog_editCollaborator.show = true;
			},
			editCollaboratorCancel () {
				this.dialog_editCollaborator.show = false;
			},
			editCollaboratorEdit () {
				this.dialog_editCollaborator.show = false;
			},
			/* Dialog: Edit collaborator */
			editModule (module) {
				this.dialog_editModule.module = module;
				this.dialog_editModule.show = true;
			},
			editModuleCancel () {
				this.dialog_editModule.show = false;
			},
			editModuleEdit () {
				this.dialog_editModule.show = false;
			}
		}
	}
</script>

<style lang="css">
</style>
