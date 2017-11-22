<template>
	<v-container fill-height>
		<!-- Done -->
		<v-layout row wrap v-if="!init">
			<!-- OK -->
			<v-flex class='text-xs-center' v-if="!error">
				<div v-if="keys.length > 0">
					<v-text-field label='Search' prepend-icon='search' v-model='filter' />
					<v-expansion-panel v-if='filtered.length > 0'>
						<v-expansion-panel-content v-for="key in filtered" :key="key.name">
							<div slot='header' class='primary--text'>
								{{ key.name }}
							</div>
							<v-card class='grey lighten-4'>
								<v-card-text>
									<div style='word-break: break-all'><b>Key</b> : {{ key.data }}</div>
								</v-card-text>
								<v-card-actions>
									<v-spacer/>
									<v-btn flat outline :to="{ name: 'blih.ssh-key', params: { name: key.name } }">Details</v-btn>
									<v-btn flat outline disabled>Download</v-btn>
									<v-btn color='error'><v-icon left>delete</v-icon>Delete</v-btn>
								</v-card-actions>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<div class='text-xs-center' v-else>
						No key matches your query.
					</div>
				</div>
				<div class='text-xs-center' v-else>
					No key was found.
				</div>
			</v-flex>
			<!-- Error -->
			<v-flex v-else>
				<error :message="error"></error>
			</v-flex>
		</v-layout>

		<!-- Loading -->
		<v-layout align-center v-else>
			<v-flex class='text-xs-center'>
				<loader/>
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
	</v-container>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import Error from '../Error';
	import Loader from '../Loader';

	export default {
		components: { Loader, Error },
		data () {
			return {
				init: true,
				error: false,
				loading: false,
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
			goto (key) {
				this.$router.push({ name: 'blih.sshkey', params: { id: key } });
			}
		},
		mounted () {
			this.updateKeys()
				.then(keys => {
					console.log(this.keys);
				}).catch(err => {
					console.log('ko could not update keys');
					this.error = err;
				}).then(_ => {
					this.init = false;
				});
		}
	}
</script>

<style lang="css">
</style>
