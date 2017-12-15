<template>
	<page @init='_init_' :snackbar='snackbar'>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Title -->
			<v-flex xs12>
				<v-card tile dark color='primary' class='pa-4'>
					<v-card-text class='text-xs-center'>
						<div class="display-3">Repositories</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Repositories -->
			<v-flex xs12>
				<v-card tile>
					<v-container>
						<v-layout row wrap>
							<!-- Search fields -->
							<v-flex xs6 sm8 md10>
								<v-text-field label='Search' prepend-icon='search' v-model='filter'></v-text-field>
							</v-flex>
							<v-flex xs6 sm4 md2>
								<v-select label='Order by' prepend-icon='swap_vert' :items='orderByItems' v-model='orderBy' ></v-select>
							</v-flex>
							<!-- Search results -->
							<v-flex x12 v-show='repositories.length > 0 && filtered.length > 0'>
								<v-list one-line subheader v-for='category in ordered' :key='category.name'>
									<v-subheader>{{ category.name }}</v-subheader>
									<template v-for='(repo, index) in category.repositories'>
										<v-divider v-if='index > 0'></v-divider>
										<v-list-tile avatar :key="repo.name"
											:to="{ name: 'blih.repository', params: { name: repo.name } }"
										>
											<v-list-tile-avatar :color='repo.module.color' v-if='repo.module'>
												<span><v-icon>{{ repo.module.icon }}</v-icon></span>
											</v-list-tile-avatar>
											<tile-avatar :name='repo.name' v-else></tile-avatar>
											<v-list-tile-content>
												<v-list-tile-title>{{ repo.name }}</v-list-tile-title>
											</v-list-tile-content>
										</v-list-tile>
									</template>
								</v-list>
								<p class='text-xs-center mb-0'>
									<v-icon>cloud</v-icon> Showing {{ filtered.length }} of {{ repositories.length }} repositories
								</p>
							</v-flex>
							<v-flex xs12 v-show='repositories.length > 0 && filtered.length == 0'>
								<div class='text-xs-center' >
									No repository matches your query.
								</div>
							</v-flex>
							<v-flex xs12 v-show='repositories.length == 0'>
								<div class='text-xs-center' >
									No repository was found.
								</div>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>

		<!-- Dialog: Create -->
		<v-dialog persistent max-width='500px' v-model='dialog_create.show'>
			<v-form v-model='dialog_create.valid' @submit.prevent='createCreate'>
				<v-card>
					<v-card-title>
						<span class="headline">Create a new repository</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-text-field label='Name' prepend-icon='cloud' v-model='dialog_create.name' required
								:rules='dialog_create.rules' type="text"
								:disabled="dialog_create.loading">
							</v-text-field>
							<v-text-field label='Description' prepend-icon='description' v-model='dialog_create.description'
								type="text"
								:disabled="dialog_create.loading">
							</v-text-field>
							<v-checkbox label='Add read rights to ramassage-tek for turn-in' v-model='dialog_create.turnIn'></v-checkbox>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_create.loading' @click.stop='createCancel'>Cancel</v-btn>
						<v-btn color="primary" flat type='submit' :disabled='dialog_create.loading || !dialog_create.valid' :loading='dialog_create.loading'>Create</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- FAB -->
		<v-btn v-model='fab' color='primary' fixed bottom right fab @click.stop='dialog_create.show = true'>
			<v-icon>add</v-icon>
		</v-btn>
	</page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import Page from './Page';
	import TileAvatar from '../TileAvatar';

	export default {
		components: { Page, TileAvatar },
		data () {
			return {
				/* Page state */
				fab: false,
				/* Snackbar */
				snackbar: {
					show: false,
					color: '',
					message: ''
				},
				/* Dialogs */
				dialog_create: {
					show: false,
					loading: false,
					error: false,
					rules: [
						name => !!name || 'Required',
						name => !name.includes(' ') || 'No spaces allowed'
					],
					valid: true,
					name: '',
					description: '',
					turnIn: false
				},
				/* Data */
				filter: '',
				orderByItems: ['name', 'year', 'module'],
				orderBy: 'name'
			};
		},
		computed: {
			...mapGetters(['api', 'repositories']),
			filtered () {
				// TODO: maybe create specific getter to filter ? (might optimize)
				return this.repositories.filter(e => e.name.toLowerCase().includes(this.filter.toLowerCase()));
			},
			ordered () {
				// TODO: DRY here
				if (this.orderBy == 'name') {
					let res = {};
					for (const elem of this.filtered) {
						const category = elem.name[0].toUpperCase();

						if (!res.hasOwnProperty(category)) {
							res[category] = [];
						}
						res[category].push(elem);
					}
					return Object.keys(res).map(m => ({
						name: m,
						repositories: res[m]
					})).sort((a, b) => {
						if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
						else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
						else return 0;
					});
				} else if (this.orderBy == 'year') {
					let res = {};
					for (const elem of this.filtered) {
						const match = elem.name.match(/20\d{2}/);
						const category = match ? match : 'other';

						if (!res.hasOwnProperty(category)) {
							res[category] = [];
						}
						res[category].push(elem);
					}
					return Object.keys(res).map(m => ({
						name: m,
						repositories: res[m]
					})).sort((a, b) => {
						if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
						else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
						else return 0;
					});
				} else if (this.orderBy == 'module') {
					let res = {};
					for (const elem of this.filtered) {
						const module = elem.module ? elem.module.name : 'other';
						if (!res.hasOwnProperty(module)) {
							res[module] = [];
						}
						res[module].push(elem);
					}
					return Object.keys(res).map(m => ({
						name: m,
						repositories: res[m]
					})).sort((a, b) => {
						if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
						else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
						else return 0;
					});
				}
			}
		},
		methods: {
			...mapActions(['updateRepositories', 'createRepository']),
			_init_ (callback) {
				this.updateRepositories()
					.then(_ => {
						callback();
					}).catch(err => {
						callback(err);
					});
			},
			/* Dialog: Create */
			createCancel () {
				this.dialog_create.show = false;
				this.dialog_create.name = '';
				this.dialog_create.description = '';
			},
			createCreate () {
				this.dialog_create.loading = true;
				this.createRepository(this.dialog_create.name, this.dialog_create.description)
					.then(_ => {
						if (this.dialog_create.turnIn) {
							return this.api.setACL(this.dialog_create.name, 'ramassage-tek', 'r')
						} else {
							return Promise.resolve();
						}
					}).then(data => {
						this.$router.push({name: 'blih.repository', params: { name: this.dialog_create.name }});
					}).catch(err => {
						this.showSnackbar('error', err);
					}).then(_ => {
						this.dialog_create.loading = false;
					});
			},
			/* Helpers */
			showSnackbar (color, message) {
				this.snackbar = {
					show: true,
					color,
					message
				};
			}
		}
	}
</script>
