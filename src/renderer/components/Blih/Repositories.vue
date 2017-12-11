<template>
	<page v-on:init='_init_' :snackbar='snackbar'>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Name -->
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
						<v-list one-line class="pt-0 pb-0" v-show='repositories.length > 0 && filtered.length > 0'>
							<template v-for='(repo, index) in filtered'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key="repo.name"
									:to="{ name: 'blih.repository', params: { name: repo.name } }"
								>
									<avatar :name='repo.name' class='mr-3'></avatar>
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
		<v-dialog max-width='500px' v-model='dialog_create.show'>
			<v-card>
				<v-card-title>
					<span class="headline">Create a new repository</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-text-field label='Name' prepend-icon='cloud' v-model='dialog_create.name' required
							type="text"
							:disabled="dialog_create.loading"/>
						<v-text-field label='Description' prepend-icon='description' v-model='dialog_create.description'
							type="text"
							:disabled="dialog_create.loading"/>
						<v-checkbox label='Add ramassage-tek for turn-in' v-model='dialog_create.turnIn'></v-checkbox>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat :disabled='dialog_create.loading' @click.stop='createCancel'>Cancel</v-btn>
					<v-btn color="primary" flat :disabled='dialog_create.loading' :loading='dialog_create.loading' @click.stop='createCreate'>Create</v-btn>
				</v-card-actions>
			</v-card>
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
	import Avatar from '../Avatar';

	export default {
		components: { Page, Avatar },
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
