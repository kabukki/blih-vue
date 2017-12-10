<template>
	<v-app>
		<v-content>
			<v-container fill-height fluid>
				<!-- Done -->
		    	<v-layout row align-center justify-space-around v-if="!init">
					<!-- OK -->
					<v-flex xs8 class='text-xs-center' v-if="!fatalError">
						<div class='display-2 primary--text '>Log in</div>
						<v-form @submit.prevent='login'>
							<v-text-field label='Email' prepend-icon='person' v-model='email' required
								suffix="@epitech.eu"
								type="email"
								:disabled='loading'/>
							<v-text-field label='Password' prepend-icon='lock' v-model='password' required
								:append-icon="visible ? 'visibility' : 'visibility_off'"
								:append-icon-cb="_ => { visible = !visible }"
								:type="visible ? 'text' : 'password'"
								:disabled='loading'/>
							<v-btn type="submit" color='primary' :loading='loading'>OK</v-btn>
						</v-form>
					</v-flex>
					<!-- Error -->
					<v-flex class='text-xs-center' v-else>
						<error :message="fatalError.message" :description="fatalError.description"/>
						<v-btn color='error' @click='_init_'>Try again</v-btn>
					</v-flex>
		    	</v-layout>

				<!-- Loading -->
				<v-layout align-center v-else>
					<v-flex class='text-xs-center'>
						<loader/>
					</v-flex>
				</v-layout>
			</v-container>
		</v-content>
		<v-snackbar bottom v-model='snackbar' :color='snackbarData.color'>
			{{ snackbarData.message }}
			<v-btn flat dark @click="snackbar = false">Dismiss</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
	import { mapActions } from 'vuex';
	import Blih from 'blih';
	import Error from './Error';
	import Loader from './Loader';

	export default {
		components: { Error, Loader },
		data () {
			return {
				/* Page state */
				init: true,
				error: false,
				fatalError: false,
				/* Login */
				loading: false,
				/* Data */
				snackbar: false,
				snackbarData: {},
				email: '',
				password: '',
				visible: false,
			};
		},
		methods: {
			...mapActions(['authenticate']),
			showSnackbar (color, message) {
				this.snackbarData = {
					color: color,
					message: message
				};
				this.snackbar = true;
			},
			hideSnackbar () {
				this.snackbar = false;
			},
			login () {
				console.log('authenticating with ' + this.email + ' / ' + this.password);
				this.error = false;
				this.hideSnackbar();
				this.loading = true;
				this.authenticate({ email: this.email + '@epitech.eu', password: this.password })
					.then((data) => {
						console.log('ok');
						this.$router.push({ name: 'blih.repositories' });
					}).catch((err) => {
						console.log(err);
						this.error = err;
						this.showSnackbar('error', err);
					}).then(_ => {
						this.password = '';
						this.loading = false;
						console.log('finally');
					})
			},
			_init_ () {
				this.init = true;
				this.fatalError = false;
				Blih.ping()
					.then(_ => {
						this.showSnackbar('success', 'Blih is up');
					}).catch(err => {
						this.fatalError = {
							message: 'Blih is unreachable.',
							description: err
						};
					}).then(_ => {
						this.init = false;
					});
			}
		},
		mounted () {
			this._init_();
			console.log('mounted');
		}
	};
</script>

<style lang="css">
	/* label focus color */
   .input-field input:focus {
     color: #000;
}
/* label underline focus color */
   .input-field input:focus {
     border-bottom: 1px solid #000;
     box-shadow: 0 1px 0 0 #000;
   }
</style>
