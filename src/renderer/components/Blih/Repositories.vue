<template>
	<v-container fill-height>
		<!-- Done -->
		<v-layout row v-if="!init">
			<!-- OK -->
			<v-flex class='text-xs-center' v-if="!error">
				<div v-if="repositories.length > 0">
					<v-text-field label='Search' prepend-icon='search' v-model='filter' />
					<v-expansion-panel v-show='filtered.length > 0'>
						<v-expansion-panel-content v-for="repo in filtered" :key="repo.name">
							<div slot='header' class='primary--text'>
								{{ repo.name }}
							</div>
							<v-card class='grey lighten-4'>
								<v-card-text>
									<div><b>URL</b> : {{ repo.url }}</div>
									<div><b>UUID</b> : {{ repo.uuid }}</div>
								</v-card-text>
								<v-card-actions>
									<v-spacer/>
									<v-btn flat outline :to="{ name: 'blih.repository', params: { name: repo.name } }">Details</v-btn>
									<v-btn flat outline disabled>Clone</v-btn>
									<v-btn color='error'><v-icon left>delete</v-icon>Delete</v-btn>
								</v-card-actions>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<div class='text-xs-center' v-show='filtered.length == 0'>
						No repository matches your query.
					</div>
				</div>
				<div class='text-xs-center' v-else>
					No repository was found.
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

<!--
		<!-- FAB --
		<div class="fixed-action-btn">
			<a class="btn-floating btn-large waves-effect waves-light teal" @click='addModal'>
		        <i class="large material-icons">add</i>
		    </a>
		</div>

		<!-- Add modal --
		<div id='addModal' class='modal'>
			<div class='modal-content'>
				<h4>Create a repository</h4>
				<form @submit.prevent='create'>
					<div class='input-field' v-if='!loading'>
						<i class='material-icons prefix'>cloud</i>
						<input id='name' type='text' v-model='name' required/>
						<label for='name'>Name</label>
					</div>
					<div class='center' v-if='!loading'>
						<input type='submit' class='waves-effect waves-light btn' value='OK' />
					</div>
					<!-- Loading --
					<div v-if='loading'>
						Loading
					</div>
				</form>
			</div>
		</div>
	-->
		<v-speed-dial fixed v-model='fab' bottom right direction='top'>
			<v-btn slot='activator' fab color='primary'>
				<v-icon>account_circle</v-icon>
				<v-icon>close</v-icon>
			</v-btn>
			<v-btn fab small>
				<v-icon>add</v-icon>
			</v-btn>
		</v-speed-dial>
	</v-container>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import Error from '../Error';
	import Loader from '../Loader';

	export default {
		components: { Error, Loader },
		data () {
			return {
				init: true,
				error: false,
				fab: false,
				loading: false,
				filter: '',
			};
		},
		computed: {
			...mapGetters(['repositories']),
			filtered () {
				return this.repositories.filter(e => e.name.toLowerCase().includes(this.filter.toLowerCase()));
			}
		},
		methods: {
			...mapActions(['updateRepositories']),
			addModal: function () {
				console.log('add');
			}
		},
		mounted () {
			this.updateRepositories()
				.then(_ => {
					console.log('ok repositories updated');
				}).catch(err => {
					console.log('ko could not update repositories');
					this.error = err;
				}).then(_ => {
					this.init = false;
				});
		}
	}
</script>
