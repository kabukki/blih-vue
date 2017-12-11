<template>
	<page v-on:init='_init_' :snackbar='snackbar'>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Name -->
			<v-flex xs12>
				<v-card tile dark :color='color' class='pa-4'>
					<v-card-text class='text-xs-center'>
						<div class="display-3">{{ name }}</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Labels -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-card-text>
						<v-chip v-for='label in labels' :key='label.name' :color='label.color' :text-color='label.text'>
							<v-icon left>{{ label.icon }}</v-icon>{{ label.name }}
						</v-chip>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Information -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<v-layout row wrap>
							<v-flex sm12 md4>
								<div class="subheading grey--text">Description</div>
								{{ info.description }}
							</v-flex>
							<v-flex sm12 md4>
								<div class="subheading grey--text">Creation date</div>
								{{ legibleTime(info.creation_time) }}
							</v-flex>
							<v-flex sm12 md4>
								<div class="subheading grey--text">Visibility</div>
								{{ info.public == 'True' ? 'Public' : 'Private' }}
							</v-flex>
						</v-layout>
					</v-container>
					<!-- FAB -->
					<v-btn small fab absolute bottom right color='primary' @click.stop='dialog_add.show = true'>
						<v-icon small>person_add</v-icon>
					</v-btn>
				</v-card>
			</v-flex>
			<!-- Collaborators -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<div class="subheading grey--text">Collaborators</div>
						<v-list two-line v-if='acl.length > 0'>
							<template v-for='(collaborator, index) in acl'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key='collaborator.name' @click.stop='edit(collaborator)'>
									<avatar :name='collaborator.name' class='mr-3'></avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ collaborator.name }}</v-list-tile-title>
										<v-list-tile-sub-title>{{ legibleRights(collaborator.rights) }}</v-list-tile-sub-title>
									</v-list-tile-content>
									<v-list-tile-action>
										<v-btn icon><v-icon>edit</v-icon></v-btn>
									</v-list-tile-action>
								</v-list-tile>
							</template>
						</v-list>
						<p class='mb-0' v-else>
							No ACL is set for this repository.
						</p>
					</v-container>
				</v-card>
			</v-flex>
			<!-- Git -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<git :url="gitUrl"></git>
				</v-card>
			</v-flex>
			<!-- Danger zone -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<div class="subheading grey--text">Danger zone</div>
						<v-btn color='error' @click.stop='dialog_delete.show = true'>
							<v-icon left>delete</v-icon>
							Delete
						</v-btn>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>

		<!-- Dialog: Delete -->
		<v-dialog persistent max-width='500px' v-model='dialog_delete.show'>
			<v-card>
				<v-card-title>
					<span class="headline">Delete repository ?</span>
				</v-card-title>
				<v-card-text>
					This will delete the repository "{{ name }}" forever.
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat :disabled='dialog_delete.loading' @click.stop='deleteCancel'>Cancel</v-btn>
					<v-btn color="primary" flat :disabled='dialog_delete.loading' :loading='dialog_delete.loading'@click.stop='deleteDelete'>Delete</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Dialog: Add -->
		<v-dialog persistent max-width='500px' v-model='dialog_add.show'>
			<v-card>
				<v-card-title>
					<span class="headline">Add a collaborator</span>
				</v-card-title>
				<v-container grid-list-md text-xs-center>
					<v-layout row wrap align-center>
						<v-flex xs12>
							<v-select label='Name' prepend-icon='person' v-model='dialog_add.name' required
								:disabled="dialog_add.loading"
								combobox clearable :items="knownCollaborators">
							</v-select>
						</v-flex>
						<!-- Read -->
						<v-flex xs2 offset-sm2>
							<v-checkbox label='Read' v-model='dialog_add.rights' value='r' color='green'></v-checkbox>
						</v-flex>
						<v-flex xs10 sm8>
							<p class="grey--text">Allow the user to access the repository</p>
						</v-flex>
						<!-- Write -->
						<v-flex xs2 offset-sm2>
							<v-checkbox label='Write' v-model='dialog_add.rights' value='w' color='orange'></v-checkbox>
						</v-flex>
						<v-flex xs10 sm8>
							<p class="grey--text">Allow the user to push to the remote</p>
						</v-flex>
						<!-- Admin -->
						<v-flex xs2 offset-sm2>
							<v-checkbox label='Admin' v-model='dialog_add.rights' value='a' color='red'></v-checkbox>
						</v-flex>
						<v-flex xs10 sm8>
							<p class="grey--text">Grant admin privileges</p>
						</v-flex>
					</v-layout>
		        </v-container>
				<v-card-actions>
					<p class='red--text' v-show='dialog_add.error'>{{ dialog_add.error }}</p>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat :disabled='dialog_add.loading' @click.stop='addCancel'>Cancel</v-btn>
					<v-btn color="primary" flat :disabled='dialog_add.loading' :loading='dialog_add.loading' @click.stop='addAdd'>Add</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Dialog: Edit -->
		<v-dialog persistent max-width='500px' v-model='dialog_edit.show'>
			<v-card>
				<v-card-title>
					<span class="headline">Edit a collaborator's rights</span>
				</v-card-title>
				<v-container grid-list-md text-xs-center>
					<v-layout row wrap align-center>
						<v-flex xs2>
							<avatar :name='dialog_edit.name'></avatar>
						</v-flex>
						<v-flex xs10>
							<div class="display-1 ellipsis">{{ dialog_edit.name }}</div>
						</v-flex>
						<v-flex xs12 class='my-3'>
							<v-divider></v-divider>
						</v-flex>
						<!-- Read -->
						<v-flex xs2 offset-sm2>
							<v-checkbox label='Read' v-model='dialog_edit.rights' value='r' color='green'></v-checkbox>
						</v-flex>
						<v-flex xs10 sm8>
							<p class="grey--text">Allow the user to access the repository</p>
						</v-flex>
						<!-- Write -->
						<v-flex xs2 offset-sm2>
							<v-checkbox label='Write' v-model='dialog_edit.rights' value='w' color='orange'></v-checkbox>
						</v-flex>
						<v-flex xs10 sm8>
							<p class="grey--text">Allow the user to push to the remote</p>
						</v-flex>
						<!-- Admin -->
						<v-flex xs2 offset-sm2>
							<v-checkbox label='Admin' v-model='dialog_edit.rights' value='a' color='red'></v-checkbox>
						</v-flex>
						<v-flex xs10 sm8>
							<p class="grey--text">Grant admin privileges</p>
						</v-flex>
					</v-layout>
		        </v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat :disabled='dialog_edit.loading' @click.stop='editCancel'>Cancel</v-btn>
					<v-btn color="primary" flat :disabled='dialog_edit.loading' :loading='dialog_edit.loading' @click.stop='editEdit'>Edit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import moment from 'moment';
	import Page from './Page';
	import Avatar from '../Avatar';
	import Git from '../Git'

	export default {
		components: { Page, Git, Avatar },
		data () {
			return {
				/* Page state */
				/* Snackbar */
				snackbar: {
					show: false,
					color: '',
					message: ''
				},
				/* Dialogs */
				dialog_delete: {
					show: false,
					loading: false
				},
				dialog_add: {
					show: false,
					loading: false,
					name: '',
					rights: []
				},
				dialog_edit: {
					show: false,
					loading: false,
					name: '',
					rights: []
				},
				/* Data */
				name: '',
				info: {},
				acl: []
			};
		},
		methods: {
			...mapActions(['deleteRepository', 'addCollaborator']),
			_init_ (callback) {
				Promise.all([
					this.api.repositoryInfo(this.name),
					this.api.getACL(this.name)
				]).then(data => {
					this.info = data[0];
					this.acl = data[1];
					// Register collaborators
					this.acl.forEach(a => { this.addCollaborator(a.name) });
					callback();
				}).catch(err => {
					callback(err);
				});
			},
			/* Transform */
			legibleTime (timestamp) {
				const m = moment.unix(timestamp);
				return `${m.format('LLL')} (${m.fromNow()})`;
			},
			legibleRights (rights) {
				const acl = {
					r: 'Read',
					w: 'Write',
					a: 'Admin'
				};
				return rights.split('')
					.reduce((string, r) =>
						string += (string.length > 0 ? ', ' : '') + acl[r],
					'') || 'None';
			},
			/* Dialog: Delete */
			deleteCancel () {
				this.dialog_delete.show = false;
			},
			deleteDelete () {
				this.dialog_delete.loading = true;
				this.deleteRepository(this.name)
					.then(data => {
						this.$router.push({name: 'blih.repositories'});
					}).catch(err => {
						this.showSnackbar('error', err);
					}).then(_ => {
						this.dialog_delete.show = false;
						this.dialog_delete.loading = false;
					});
			},
			/* Dialog: Add */
			addCancel () {
				this.dialog_add.show = false;
			},
			addAdd () {
				this.dialog_add.loading = true;
				this.setACL(this.name, this.dialog_add.name, this.dialog_add.rights)
					.then(_ => {
						this.dialog_add.show = false;
						this.dialog_add.error = false;
						this.dialog_add.name = '';
						this.dialog_add.rights = [];
					}).catch(err => {
						this.showSnackbar('error', err);
					}).then(_ => {
						this.dialog_add.loading = false;
					});
			},
			/* Dialog: Edit */
			edit (collaborator) {
				this.dialog_edit.name = collaborator.name;
				this.dialog_edit.rights = collaborator.rights.split('');
				this.dialog_edit.show = true;
			},
			editCancel () {
				this.dialog_edit.show = false;
			},
			editEdit () {
				this.dialog_edit.loading = true;
				this.setACL(this.name, this.dialog_edit.name, this.dialog_edit.rights.join(''))
					.then(_ => {
						this.dialog_edit.show = false;
						this.dialog_edit.name = '';
						this.dialog_edit.rights = [];
					}).catch(err => {
						this.showSnackbar('error', err);
					}).then(_ => {
						this.dialog_edit.loading = false;
					});
			},
			/* Helpers */
			setACL(name, user, acl) {
				return this.api.setACL(name, user, acl)
					.then(_ => this.api.getACL(name))
					.then(acl => {
						console.log(acl);
						// Register collaborator
						this.addCollaborator(user);
						this.acl = acl;
					});
			},
			showSnackbar (color, message) {
				this.snackbar = {
					show: true,
					color,
					message
				};
			}
		},
		computed: {
			...mapGetters(['api', 'login', 'knownRepositories', 'knownCollaborators', 'colorOf']),
			color () {
				return this.colorOf(this.name);
			},
			labels () {
				let labels = [];

				if (this.info) {
					/* Turn-in check status */
					if (this.acl.find(acl => acl.name == 'ramassage-tek' && acl.rights.includes('r'))) {
						labels.push({ name: 'Ready for turn-in', icon: 'check_circle', color: 'green', text: 'white' });
					} else {
						labels.push({ name: 'Not ready for turn-in', icon: 'warning', color: 'orange', text: 'white' });
					}
					/* Anniversaries */
					let creation = moment.unix(this.info.creation_time);
					let diff = moment().diff(creation, 'years')

					if (diff >= 1) {
						labels.push({ name: diff + ' year' + (diff > 1 ? 's' : ''), icon: 'cake', color: 'amber', text: 'white' });
					}
					/* Maths */
					if (this.knownRepositories.maths.includes(this.name)) {
						labels.push({ name: 'Maths', icon: 'functions', color: 'indigo', text: 'white' });
					}
					/* French */
					if (this.knownRepositories.french.includes(this.name)) {
						labels.push({ name: 'French', icon: 'font_download', color: 'red', text: 'white' });
					}
					/* CPE */
					if (this.name.match(/^CPE_/)) {
						labels.push({ name: 'CPE', icon: 'code', color: 'cyan', text: 'white' });
					}
					/* PSU */
					if (this.name.match(/^PSU_/)) {
						labels.push({ name: 'PSU', icon: 'code', color: 'red', text: 'white' });
					}
					/* C pool */
					if (this.name.match(/^Piscine_C/)) {
						labels.push({ name: 'C Pool', icon: 'pool', color: 'blue-grey', text: 'white' });
					}
					/* C++ pool */
					if (this.knownRepositories.cppPool.includes(this.name)) {
						labels.push({ name: 'C++ Pool', icon: 'pool', color: 'blue', text: 'white' });
					}
					/* .NET */
					if (this.name.match(/^DOT_/)) {
						labels.push({ name: '.NET', icon: 'code', color: 'teal', text: 'white' });
					}
					/* OCAML */
					if (this.name.match(/^OCAML_/)) {
						labels.push({ name: 'OCAML', icon: 'code', color: 'purple', text: 'white' });
					}
					/* SHL */
					if (this.name.match(/^SHL/)) {
						labels.push({ name: 'Shell', icon: 'code', color: 'amber', text: 'white' });
					}
					/* Internship */
					if (this.name.match(/^stageTEK/)) {
						labels.push({ name: 'Internship', icon: 'work', color: 'pink', text: 'white' });
					}
				}

				return labels;
			},
			gitUrl () {
				return `git@git.epitech.eu:/${this.login}/${this.name}`;
			}
		},
		created () {
			this.name = this.$route.params.name;
		}
	}
</script>

<style lang="css">
</style>
