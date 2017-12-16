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
						<v-list two-line v-if='collaborators.length > 0'>
							<template v-for='(collaborator, index) in pageCollaborators'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key='collaborator.name' @click.stop='editCollaborator(collaborator)'>
									<tile-avatar :name='collaborator.name'></tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ collaborator.name }}</v-list-tile-title>
										<v-list-tile-sub-title v-show='collaborator.aliases.length'>aka {{ collaborator.aliases.join(', ') }}</v-list-tile-sub-title>
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
		<v-dialog scrollable persistent max-width='500px' v-model='dialog_editCollaborator.show'>
			<v-card>
				<v-card-title>
					<span class="headline">Edit a collaborator's details</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout row wrap>
							<v-flex xs12 class='text-xs-center'>
								<avatar :name='dialog_editCollaborator.collaborator.name' size='80px'></avatar>
								<p class='headline ellipsis mb-0'>{{ dialog_editCollaborator.collaborator.name }}</p>
							</v-flex>
							<v-flex xs12 class='my-3'>
								<v-divider></v-divider>
							</v-flex>
							<v-flex xs12>
								<v-text-field label='Picture' hint='Optimal size: 100x100' v-model='dialog_editCollaborator.collaborator.picture'></v-text-field>
								<v-list one-line subheader class='text-xs-center'>
									<v-subheader>Aliases</v-subheader>
									<template v-for='(alias, index) in dialog_editCollaborator.collaborator.aliases'>
										<v-divider v-if='index > 0'></v-divider>
										<v-list-tile :key='alias'>
											<v-list-tile-content>
												<v-list-tile-title>{{ alias }}</v-list-tile-title>
											</v-list-tile-content>
											<v-list-tile-action @click.stop='dialog_editCollaborator.collaborator.aliases.splice(index, 1)'>
												<v-btn icon><v-icon>delete</v-icon></v-btn>
											</v-list-tile-action>
										</v-list-tile>
									</template>
									<v-btn @click.stop='dialog_addAlias.show = true'><v-icon left>add</v-icon>Add an alias</v-btn>
								</v-list>
								<p class='mb-0'><v-icon>info</v-icon> Aliases are used to identify collaborators through commit author names, if they are not the same as their login.</p>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat @click.stop='editCollaboratorCancel'>Cancel</v-btn>
					<v-btn color="primary" flat @click.stop='editCollaboratorEdit'>Edit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Dialog: Add alias -->
		<v-dialog persistent max-width='500px' v-model='dialog_addAlias.show'>
			<v-form @submit.prevent='addAliasAdd'>
				<v-card>
					<v-card-title>
						<span class="headline">Add an alias</span>
					</v-card-title>
					<v-card-text>
						<v-text-field label='Alias' prepend-icon='label' v-model='dialog_addAlias.alias'></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat @click.stop='addAliasCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat >Add</v-btn>
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
	import { mapGetters, mapActions } from 'vuex';
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
				dialog_addAlias: {
					show: false,
					alias: ''
				},
				dialog_editModule: {
					show: false,
					module: {}
				}
			};
		},
		computed: {
			...mapGetters(['collaborators', 'modules', 'colorOf']),
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
			...mapActions(['updateCollaborator']),
			/* Dialog: Edit collaborator */
			editCollaborator (collaborator) {
				// Create a copy and mutate later
				this.dialog_editCollaborator.collaborator = {
					name: collaborator.name,
					picture: collaborator.picture,
					aliases: Array.from(collaborator.aliases)
				};
				this.dialog_editCollaborator.show = true;
			},
			editCollaboratorCancel () {
				this.dialog_editCollaborator.show = false;
			},
			editCollaboratorEdit () {
				this.updateCollaborator(this.dialog_editCollaborator.collaborator);
				this.dialog_editCollaborator.show = false;
			},
			/* Dialog: Add alias */
			addAliasCancel () {
				this.dialog_addAlias.show = false;
			},
			addAliasAdd () {
				this.dialog_editCollaborator.collaborator.aliases.push(this.dialog_addAlias.alias);
				this.dialog_addAlias.alias = '';
				this.dialog_addAlias.show = false;
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
