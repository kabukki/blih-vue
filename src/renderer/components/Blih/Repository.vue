<template>
	<v-container fill-height>
		<!-- Done -->
		<v-layout row v-if="!init">
			<!-- OK -->
			<v-flex v-if="!error">
				<div class='display-2'>Information</div>
				<v-divider/>
				<p v-if='!info.error'>
					<p><b>Description:</b> {{ info.description }}</p>
					<p><b>Created on:</b> {{ info.creation_time }}</p>
					<p><b>URL:</b> {{ info.url }}</p>
					<p><b>Visibility:</b> {{ info.public == 'True' ? 'Public' : 'Private' }}</p>
					<p><b>UUID:</b> {{ info.uuid }}</p>
				</p>
				<div class='display-2'>Collaborators</div>
				<v-divider/>
				<v-data-table class='elevation-1' :headers="headers" :items="acl" hide-actions v-if="acl.length > 0">
					<template slot="items" slot-scope="props">
						<td>{{ props.item.name }}</td>
						<td>{{ props.item.rights }}</td>
					</template>
				</v-data-table>
				<p v-else>
					No ACL is set for this repository.
				</p>
			</v-flex>
			<!-- Error -->
			<v-flex v-else>
				<error :message="error"/>
			</v-flex>
		</v-layout>

		<!-- Loading -->
		<v-layout align-center v-else>
			<v-flex class='text-xs-center'>
				<loader/>
			</v-flex>
		</v-layout>

<!--
		<!-- Delete modal --
		<div id='deleteModal' class='modal'>
		    <div class='modal-content'>
		        <h4>Delete a repository</h4>
		        <form ng-submit='delete()'>
		            <div class='center' ng-hide='loading == true'>
		                <p>Are you sure you want to delete this repository ? This cannot be undone.</p>
		                <input type='submit' class='waves-effect waves-light red btn' value='Yes'/>
		            </div>
		            <!-- Loading --
		            <div ng-show='loading == true'>
		                Loading
		            </div>
		        </form>
		    </div>
		</div>

		<!-- Add modal --
		<div id='addModal' class='modal'>
		    <div class='modal-content'>
		        <h4>Add a collaborator</h4>
		        <form ng-submit='add()'>
		            <div class='input-field' ng-hide='loading == true'>
		                <i class='material-icons prefix'>person</i>
		                <input id='name' type='text' ng-model='name' required/>
		                <label for='name'>Name</label>
		            </div>
		            <p><label>
		                <input name='rights' type='checkbox' ng-model='rights.r'><span>Read</span>
		            </label></p>
		            <p><label>
		                <input name='rights' type='checkbox' ng-model='rights.w'><span>Write</span>
		            </label></p>
		            <p><label>
		                <input name='rights' type='checkbox' ng-model='rights.a'><span>Admin</span>
		            </label></p>
		            <div class='center' ng-hide='loading == true'>
		                <input type='submit' class='waves-effect waves-light btn' value='OK'/>
		            </div>
		            <!-- Loading --
		            <div ng-show='loading == true'>
		                Loading
		            </div>
		        </form>
		    </div>
		</div>
-->
		<!-- FAB -->
		<v-speed-dial v-model='fab' fixed bottom right direction='top'>
			<v-btn slot='activator' v-model='fab' fab color='primary'>
				<v-icon>add</v-icon>
				<v-icon>close</v-icon>
			</v-btn>
			<v-btn fab small color='secondary'>
				<v-icon>delete</v-icon>
			</v-btn>
			<v-btn fab small color='secondary'>
				<v-icon>file_download</v-icon>
			</v-btn>
			<v-btn fab small color='secondary'>
				<v-icon>person_add</v-icon>
			</v-btn>
		</v-speed-dial>
	</v-container>
</template>

<script>
	import { mapGetters } from 'vuex';
	import Error from '../Error';
	import Loader from '../Loader';

	export default {
		components: { Error, Loader },
		data () {
			return {
				init: true,
				error: false,
				fab: false,
				name: '',
				info: {},
				acl: [],
				headers: [
					{ text: 'Collaborator', value: 'name', align: 'left' },
					{ text: 'Rights', value: 'rights', align: 'left' },
				]
			};
		},
		computed: {
			...mapGetters(['api'])
		},
		methods: {
			addModal () {
				console.log('add');
			}
		},
		mounted () {
			this.name = this.$route.params.name;
			this.api.repositoryInfo(this.$route.params.name)
				.then(data => {
					console.log('ok got repository info');
					this.info = data.message;
					this.api.getACL(this.$route.params.name)
					.then(data => {
						console.log('ok got repository acl');
						console.log(data);
						this.acl = Object.keys(data).map(c => ({ name: c, rights: data[c] }));
						console.log(this.acl);
					}).catch(err => {
						console.log('ko could not get acl');
						this.error = err;
					}).then(_ => {
						this.init = false;
					});
				}).catch(err => {
					console.log('ko could not get info');
					this.error = err;
				})
		}
	}
</script>

<style lang="css">
</style>
