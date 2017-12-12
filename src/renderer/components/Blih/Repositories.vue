<template>
	<page v-on:init='_init_' :snackbar='snackbar'>
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
						<v-text-field label='Search' prepend-icon='search' v-model='filter' />
						<v-list one-line v-show='repositories.length > 0 && filtered.length > 0'>
							<template v-for='(repo, index) in filtered'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key="repo.name"
									:to="{ name: 'blih.repository', params: { name: repo.name } }"
								>
									<tile-avatar :name='repo.name' class='mr-3'></tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ repo.name }}</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
							<p class='text-xs-center mb-0'>
								<v-icon>cloud</v-icon> Showing {{ filtered.length }} of {{ repositories.length }} repositories
							</p>
						</v-list>
						<div class='text-xs-center' v-show='repositories.length > 0 && filtered.length == 0'>
							No repository matches your query.
						</div>
						<div class='text-xs-center' v-show='repositories.length == 0'>
							No repository was found.
						</div>
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
				filter: ''
			};
		},
		computed: {
			...mapGetters(['repositories']),
			filtered () {
				// TODO: maybe create specific getter to filter ? (might optimize)
				return this.repositories.filter(e => e.name.toLowerCase().includes(this.filter.toLowerCase()));
			}
		},
		methods: {
			...mapActions(['updateRepositories', 'createRepository']),
			_init_ (callback) {
				this.updateRepositories()
					.then(_ => {
						callback();
					}).catch(err => {
						console.log('ko could not update repositories');
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
					.then(data => {
						console.log(data);
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
