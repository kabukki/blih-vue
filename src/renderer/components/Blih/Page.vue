<template>
	<!-- Done -->
	<v-container fluid grid-list-xs v-if="!init && !error">
		<slot></slot>
	</v-container>
	<!-- Error -->
	<v-container fill-height v-else-if="!init && error">
		<v-layout align-center>
			<v-flex class='text-xs-center'>
				<error :message="error"/>
				<v-btn color='error' @click='_init_'>Try again</v-btn>
			</v-flex>
		</v-layout>
	</v-container>
	<!-- Loading -->
	<v-container fill-height v-else>
		<v-layout align-center>
			<v-flex class='text-xs-center'>
				<loader/>
			</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
	import Error from '../Error';
	import Loader from '../Loader';

	export default {
		components: { Error, Loader },
		data () {
			return {
				init: true,
				error: false
			};
		},
		methods: {
			_init_ () {
				this.init = true;
				this.error = false;
				this.$emit('init', err => {
					this.error = err;
					this.init = false;
				});
			}
		},
		mounted () {
			console.log('page mounted');
			this._init_();
		}
	}
</script>
