<template>
	<v-container fill-height>
		<!-- Done -->
		<v-layout row :align-center="error" v-if="!init">
			<!-- OK -->
			<v-flex class='text-xs-center' v-if="!error">
				<div v-if="repositories.length > 0">
					<v-text-field label='Search' prepend-icon='search' v-model='filter' />
					<v-list class="pt-0" v-show='filtered.length > 0'>
						<v-list-tile avatar
							v-for="repo in filtered" :key="repo.name"
							:to="{ name: 'blih.repository', params: { name: repo.name } }"
						>
							<v-list-tile-avatar color="red" class="align-center">
								<span class=" headline">{{ repo.name[0].toUpperCase() }}</span>
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title>{{ repo.name }}</v-list-tile-title>
								<v-list-tile-sub-title>{{ repo.uuid }}</v-list-tile-sub-title>
							</v-list-tile-content>
							<v-list-tile-action>
								<v-icon color='error'>delete</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
					<div class='text-xs-center' v-show='filtered.length == 0'>
						No repository matches your query.
					</div>
				</div>
				<div class='text-xs-center' v-else>
					No repository was found.
				</div>
			</v-flex>
			<!-- Error -->
			<v-flex class='text-xs-center' v-else>
				<error :message="error"/>
				<v-btn color='error' @click='_init_'>Try again</v-btn>
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
				filter: ''
			};
		},
		computed: {
			...mapGetters(['repositories']),
			filtered () {
				return this.repositories.filter(e => e.name.toLowerCase().includes(this.filter.toLowerCase()));
			}
		},
		methods: {
			_init_ () {
				this.init = true;
				this.error = false;
				this.updateRepositories()
				.then(_ => {
					console.log('ok repositories updated');
				}).catch(err => {
					console.log('ko could not update repositories');
					this.error = err;
				}).then(_ => {
					this.init = false;
				});
			},
			...mapActions(['updateRepositories']),
			addModal: function () {
				console.log('add');
			}
		},
		mounted () {
			this._init_();
		}
	}
</script>
