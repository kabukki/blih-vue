<template>
	<page @init='_init_' :snackbar='snackbar'>
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
							<v-flex xs12 sm6>
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
			<!-- Git config -->
			<v-flex xs12>
				<v-card tile>
					<v-container>
						<p class="text-xs-center subheading grey--text mb-0">Git configuration</p>
						<v-layout row wrap>
							<v-flex xs12>
								<v-text-field label='Private key' hint='Path to the private key to use when cloning' v-model='privateKeyPath'></v-text-field>
							</v-flex>
							<v-flex xs12>
								<v-text-field label='Public key' hint='Path to the public key to use when cloning' v-model='publicKeyPath'></v-text-field>
							</v-flex>
							<v-flex xs12>
								<v-btn block color='warning' @click.stop='dialogEmpty.show = true'><v-icon>delete</v-icon> Empty cache</v-btn>
								<div class='caption'>
									<v-icon small>info</v-icon> The cache holds local copies of repositories. This allows a faster experience because repositories only need to be updated and not entirely cloned again.
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

		<!-- Dialog: Empty cache -->
		<dialog-basic action='Delete' @submit='dialogEmpty.submit' v-model='dialogEmpty.show'>
			<span slot="header" class="headline">Empty cache ?</span>
			This will delete the local repositories for user <strong>{{ login }}</strong>.
		</dialog-basic>

		<!-- Dialog: Edit collaborator -->
		<dialog-basic scrollable action='Edit' @submit='dialogEditCollaborator.submit' v-model='dialogEditCollaborator.show'>
			<span slot="header" class="headline">Edit a collaborator's details</span>
			<v-container grid-list-md>
				<v-layout row wrap>
					<v-flex xs12 class='text-xs-center'>
						<avatar :name='dialogEditCollaborator.collaborator.name' size='80px'></avatar>
						<p class='headline ellipsis mb-0'>{{ dialogEditCollaborator.collaborator.name }}</p>
					</v-flex>
					<v-flex xs12 class='my-3'>
						<v-divider></v-divider>
					</v-flex>
					<v-flex xs12>
						<!-- Picture -->
						<v-subheader>Picture</v-subheader>
						<v-text-field label='URI' hint='Optimal size: 100x100' v-model='dialogEditCollaborator.collaborator.picture'></v-text-field>
						<!-- Aliases -->
						<v-subheader>Aliases</v-subheader>
						<v-list one-line subheader dense class='text-xs-center'>
							<template v-for='(alias, index) in dialogEditCollaborator.collaborator.aliases' v-show='dialogEditCollaborator.collaborator.aliases && dialogEditCollaborator.collaborator.aliases.length > 0'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile :key='alias'>
									<v-list-tile-content>
										<v-list-tile-title>{{ alias }}</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action @click.stop='dialogEditCollaborator.collaborator.aliases.splice(index, 1)'>
										<v-btn icon><v-icon>delete</v-icon></v-btn>
									</v-list-tile-action>
								</v-list-tile>
							</template>
							<p class='mb-0' v-show='dialogEditCollaborator.collaborator.aliases && dialogEditCollaborator.collaborator.aliases.length == 0'>
								No aliases
							</p>
							<v-btn @click.stop='dialogAddAlias.show = true'><v-icon left>add</v-icon>Add an alias</v-btn>
						</v-list>
						<p class='caption mb-0'><v-icon small>info</v-icon> Aliases are used to identify collaborators through commit author name, if it is not the same as their login.</p>
					</v-flex>
				</v-layout>
			</v-container>
		</dialog-basic>

		<!-- Dialog: Add alias -->
		<dialog-form action='Add' :fields='dialogAddAlias.fields' @submit='dialogAddAlias.submit' v-model='dialogAddAlias.show'>
			<span slot="header" class="headline">Add an alias</span>
		</dialog-form>

		<!-- Dialog: Edit module -->
		<dialog-basic scrollable action='Edit' @submit='dialogEditModule.submit' v-model='dialogEditModule.show'>
			<span slot="header" class="headline">Edit a module</span>
			<v-container grid-list-md>
				<v-layout row wrap>
					<v-flex xs12 class='text-xs-center'>
						<v-avatar :color='dialogEditModule.module.color' size='80px'>
							<span><v-icon x-large>{{ dialogEditModule.module.icon }}</v-icon></span>
						</v-avatar>
						<p class='headline ellipsis mb-0'>{{ dialogEditModule.module.name }}</p>
					</v-flex>
					<v-flex xs12 class='my-3'>
						<v-divider></v-divider>
					</v-flex>
					<v-flex xs12 sm6>
						<!-- Icon -->
						<v-subheader>Icon</v-subheader>
						<v-text-field label='Icon' hint='Material icon name' :prepend-icon='dialogEditModule.module.icon || "add"' v-model='dialogEditModule.module.icon'></v-text-field>
					</v-flex>
					<v-flex xs12 sm6>
						<!-- Color -->
						<v-subheader>Color</v-subheader>
						<v-text-field label='Color' hint='Material color' prepend-icon='palette' v-model='dialogEditModule.module.color'></v-text-field>
					</v-flex>
					<v-flex xs12>
						<!-- Matches -->
						<v-subheader>Matches</v-subheader>
						<v-list one-line subheader dense class='text-xs-center'>
							<template v-for='(regexp, index) in dialogEditModule.module.regexp'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile :key='regexp'>
									<v-list-tile-content>
										<v-list-tile-title>{{ regexp }}</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
						</v-list>
					</v-flex>
				</v-layout>
			</v-container>
		</dialog-basic>

	</page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import { snackbar } from '../../mixins';

	import Page from './Page';
	import TileAvatar from '../TileAvatar';
	import Avatar from '../Avatar';
	import DialogBasic from '../Dialogs/DialogBasic';
	import DialogForm from '../Dialogs/DialogForm';

	import RepositoryHub from '../../RepositoryHub';
	import electron from 'electron';
	import path from 'path';

	const dataDir = (electron.app || electron.remote.app).getPath('userData');

	export default {
		components: { Page, TileAvatar, Avatar, DialogBasic, DialogForm },
		mixins: [snackbar],
		data () {
			return {
				/* Collaborators */
				pageCollaborator: 1,
				pageModule: 1,
				perPage: 5,
				/* Dialogs */
				dialogEditCollaborator: {
					show: false,
					collaborator: {},
					submit: (success) => {
						this.updateCollaborator(this.dialogEditCollaborator.collaborator);
						success();
					}
				},
				dialogAddAlias: {
					show: false,
					fields: {
						alias: {
							is: 'v-text-field',
							label: 'Alias',
							icon: 'label',
							default: ''
						}
					},
					submit: (data, success) => {
						this.dialogEditCollaborator.collaborator.aliases.push(data.alias);
						success();
					}
				},
				dialogEditModule: {
					show: false,
					module: {},
					submit: (success) => {
						this.updateModule(this.dialogEditModule.module);
						success();
					}
				},
				dialogEmpty: {
					show: false,
					submit: async (success, failure) => {
						try {
							await this.hub.delete();
							success();
							this.showSnackbar('success', `Successfully deleted cache for ${this.login}`);
						} catch (err) {
							failure(err);
							this.showSnackbar('error', err);
						}
					}
				},
				hub: null
			};
		},
		computed: {
			...mapGetters(['collaborators', 'modules', 'colorOf', 'login']),
			welcome: {
				get () {
					return this.$store.state.welcome;
				},
				set (value) {
					this.$store.dispatch('setWelcome', value);
				}
			},
			theme: {
				get () {
					return this.$store.state.theme;
				},
				set (name) {
					const theme = this.$store.getters.themes.find(t => t.name === name);
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
			publicKeyPath: {
				get () {
					return this.$store.state.publicKeyPath;
				},
				set (path) {
					this.$store.dispatch('setPublicKeyPath', path);
				}
			},
			privateKeyPath: {
				get () {
					return this.$store.state.privateKeyPath;
				},
				set (path) {
					this.$store.dispatch('setPrivateKeyPath', path);
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
			...mapActions(['updateCollaborator', 'updateModule']),
			async _init_ (callback) {
				try {
					this.hub = new RepositoryHub(path.join(dataDir, '.hub'));
					await this.hub.init();
					await this.hub.use(this.login);
					callback();
				} catch (err) {
					callback(err);
				}
			},
			/* Dialog: Edit collaborator */
			editCollaborator (collaborator) {
				// Create a copy and mutate later
				this.dialogEditCollaborator.collaborator = {
					name: collaborator.name,
					picture: collaborator.picture,
					aliases: Array.from(collaborator.aliases)
				};
				this.dialogEditCollaborator.show = true;
			},
			/* Dialog: Edit module */
			editModule (module) {
				this.dialogEditModule.module = {
					name: module.name,
					icon: module.icon,
					color: module.color,
					regexp: Array.from(module.regexp)
				};
				this.dialogEditModule.show = true;
			}
		}
	};
</script>
