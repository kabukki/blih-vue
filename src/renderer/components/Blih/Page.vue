<template>
	<!-- Done -->
	<v-container fluid grid-list-xs :fill-height="fillHeight" v-if="!init && !error">
		<slot></slot>
		<!-- Snackbar -->
		<v-snackbar bottom v-model='snackbar.show' :color='snackbar.color'>
			{{ snackbar.message }}
			<v-btn flat dark @click.stop="snackbar.show = false">Dismiss</v-btn>
		</v-snackbar>
	</v-container>
	<!-- Error -->
	<v-container fill-height v-else-if="!init && error">
		<v-layout align-center>
			<v-flex class='text-xs-center'>
				<error :error="error"/>
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
		props: {
			fillHeight: Boolean,
			snackbar: {
				type: Object,
				default: _ => ({ show: false })
			}
		},
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
				this.$emit('init', (err) => {
					this.error = err;
					this.init = false;
				});
			}
		},
		created () {
			this._init_();
		}
	};
</script>
