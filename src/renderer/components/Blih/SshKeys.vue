<template>
	<page @init='_init_' :snackbar='snackbar'>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Title -->
			<v-flex xs12>
				<v-card tile dark color='primary' class='pa-4'>
					<v-card-text class='text-xs-center'>
						<div class="display-3">SSH keys</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Keys -->
			<v-flex xs12>
				<v-card tile>
					<v-container>
						<v-text-field label='Search' prepend-icon='search' v-model='filter' />
						<v-list one-line v-show='keys.length > 0 && filtered.length > 0'>
							<template v-for='(key, index) in filtered'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key="key.name"
									:to="{ name: 'blih.ssh-key', params: { name: key.name } }"
								>
									<tile-avatar :name='key.name' class='mr-3'></tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ key.name }}</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
							<p class='text-xs-center mb-0'>
								<v-icon>vpn_key</v-icon> Showing {{ filtered.length }} of {{ keys.length }} keys
							</p>
						</v-list>
						<p class='text-xs-center mb-0' v-show='keys.length > 0 && filtered.length == 0'>
							No key matches your query.
						</p>
						<p class='text-xs-center mb-0' v-show='keys.length == 0'>
							No key was found.
						</p>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>

		<!-- Dialog: Upload -->
		<v-dialog persistent max-width='500px' v-model='dialog_upload.show'>
			<v-form v-model='dialog_upload.valid' @submit.prevent='uploadUpload'>
				<v-card>
					<v-card-title>
						<span class="headline">Upload a key</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-text-field label='File' prepend-icon='vpn_key' readonly v-model='dialog_upload.file' :rules='dialog_upload.rules'></v-text-field>
							<input label='File' type="file" @change='uploadChange'>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_upload.loading' @click.stop='uploadCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='dialog_upload.loading || !dialog_upload.valid' :loading='dialog_upload.loading'>Upload</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- FAB -->
		<v-btn v-model='fab' color='primary' fixed bottom right fab @click.stop='dialog_upload.show = true'>
			<v-icon>file_upload</v-icon>
		</v-btn>
	</page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import { snackbar } from '../../mixins';

	import TileAvatar from '../TileAvatar';
	
	import fs from 'fs-extra';
	import Page from './Page';

	export default {
		components: { Page, TileAvatar },
		mixins: [snackbar],
		data () {
			return {
				/* Page state */
				fab: false,
				/* Dialogs */
				// TODO: vuetify file input component to use with dialog-form
				dialog_upload: {
					show: false,
					loading: false,
					error: false,
					rules: [
						path => !!path || 'Required'
					],
					valid: true,
					file: null
				},
				/* Data */
				filter: ''
			};
		},
		computed: {
			...mapGetters(['keys']),
			filtered () {
				return this.keys.filter(e => e.name.toLowerCase().includes(this.filter.toLowerCase()));
			}
		},
		methods: {
			...mapActions(['updateKeys', 'uploadKey']),
			_init_ (callback) {
				this.updateKeys()
					.then(_keys => {
						callback();
					}).catch(err => {
						callback(err);
					});
			},
			/* Dialog: Upload */
			uploadCancel () {
				this.dialog_upload.show = false;
			},
			uploadUpload () {
				this.dialog_upload.loading = true;
				fs.readFile(this.dialog_upload.file, 'utf8', (err, data) => {
					if (err) {
						this.showSnackbar('error', err);
						this.dialog_upload.loading = false;
					} else {
						this.uploadKey(data)
							.then(key => {
								this.$router.push({name: 'blih.ssh-key', params: { name: key.name }});
							}).catch(err => {
								this.showSnackbar('error', err);
							}).then(_ => {
								this.dialog_upload.loading = false;
							});
					}
				});
			},
			uploadChange (file) {
				if (file.target.files[0]) {
					this.dialog_upload.file = file.target.files[0].path;
				}
			}
		}
	};
</script>
