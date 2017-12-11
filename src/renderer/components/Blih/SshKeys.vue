<template>
	<page v-on:init='_init_' :snackbar='snackbar'>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Name -->
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
						<v-list one-line class="pt-0 pb-0" v-show='keys.length > 0 && filtered.length > 0'>
							<template v-for='(key, index) in filtered'>
								<v-divider v-if='index > 0'></v-divider>
								<v-list-tile avatar :key="key.name"
									:to="{ name: 'blih.ssh-key', params: { name: key.name } }"
								>
									<avatar :name='key.name' class='mr-3'></avatar>
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
		<!-- FAB --
		<div class="fixed-action-btn" v-if='!init && !error'>
		    <a class="btn-floating btn-large waves-effect waves-light teal" ng-click='keysModal()'>
		        <i class="large material-icons">add</i>
		    </a>

		<!-- Add modal --
		<div id='keysModal' class='modal'>
		    <div class='modal-content'>
		        <h4>Upload a key</h4>
		        <form ng-submit='upload()'>
		            <div class='file-field input-field' ng-hide='loading == true'>
		                <div class='btn'>
		                    <i class='material-icons'>attach_file</i>
		                    <input type='file' required>
		                </div>
		                <div class='file-path-wrapper'>
		                    <input class='file-path validate' type='text' ng-model='keyPath'>
		                </div>
		            </div>
		            <div class='center' ng-hide='loading == true'>
		                <input type='submit' class='waves-effect waves-light btn' value='OK'/>
		            </div>
		            <!-- Loading --
		            <div ng-show='loading == true'>
		                Loading
		            </div>
		        </form>
		    </div>
		</div>-->

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
				dialog_add: {
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
			}
		}
	}
</script>

<style lang="css">
</style>
