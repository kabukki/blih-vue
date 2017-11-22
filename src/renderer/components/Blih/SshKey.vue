<template>
	<v-container fill-height>
		<!-- Done -->
		<v-layout row v-if="!init">
			<!-- OK -->
			<v-flex v-if="!error">
				<div class='display-2'>Information</div>
				<v-divider/>
				<p v-if='!info.error'>
					<p><b>Owner:</b> {{ info.owner }}</p>
					<p><b>Host:</b> {{ info.host }}</p>
				</p>
				<div class='display-2'>Contents</div>
				<v-divider/>
				<v-text-field readonly textarea label='Public SSH key' v-model='key.data' />
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

		<!-- FAB -->
		<v-speed-dial v-model='fab' fixed bottom right direction='top'>
			<v-btn slot='activator' v-model='fab' fab color='primary'>
				<v-icon>add</v-icon>
				<v-icon>close</v-icon>
			</v-btn>
			<v-btn fab small color='secondary'>
				<v-icon>delete_forever</v-icon>
			</v-btn>
			<v-btn fab small color='secondary'>
				<v-icon>file_download</v-icon>
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
				key: {}
			};
		},
		methods: {
			...mapGetters(['keys'])
		},
		mounted () {
			this.name = this.$route.params.name;
			this.key = this.keys().find(k => k.name == this.name);
			let info = this.key.name.split('@');
			if (info) {
				this.info = {
					owner: info[0],
					host: info[1]
				};
			} else {
				this.info = {
					error: 'Cannot get key info'
				};
			}
			console.log(this.key);
			this.init = false;
		}
	}
</script>

<style lang="css">
</style>
