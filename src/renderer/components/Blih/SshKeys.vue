<template>
	<page v-on:init='_init_' :snackbar='snackbar'>
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
			<v-form @submit.prevent='uploadUpload'>
				<v-card>
					<v-card-title>
						<span class="headline">Upload a key</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-text-field label='File' prepend-icon='folder' v-model='dialog_upload.file'
								type="text" disabled>
							</v-text-field>
							<p class="mb-0 error--text">Note: this feature is currently unavailable.</p>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_upload.loading' @click.stop='uploadCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='true' :loading='dialog_upload.loading'>Upload</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- FAB -->
		<v-btn v-model='fab' color='primary' fixed bottom right fab @click.stop='dialog_upload.show = true'>
			<v-icon>file_upload</v-icon>
		</v-btn>

		<!-- Add modal --
            <div class='file-field input-field' ng-hide='loading == true'>
                <div class='btn'>
                    <i class='material-icons'>attach_file</i>
                    <input type='file' required>
                </div>
                <div class='file-path-wrapper'>
                    <input class='file-path validate' type='text' ng-model='keyPath'>
                </div>
            </div>-->
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
				dialog_upload: {
					show: false,
					loading: false,
					error: false,
					file: ''
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
			...mapActions(['updateKeys']),
			_init_ (callback) {
				this.updateKeys()
					.then(keys => {
						console.log(this.keys);
						callback();
					}).catch(err => {
						console.log('ko could not update keys');
						callback(err);
					});
			},
			/* Dialog: Upload */
			uploadCancel () {
				this.dialog_upload.show = false;
			},
			uploadUpload () {
				this.dialog_upload.show = false;
			}
		}
	}
</script>

<style lang="css">
</style>
