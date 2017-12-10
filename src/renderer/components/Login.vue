<template>
	<v-app>
		<v-content>
			<page v-on:init='_init_' :snackbar='snackbar' fill-height>
				<!-- Content -->
				<v-layout row align-center justify-space-around>
					<v-flex xs8 class='text-xs-center'>
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
				</v-layout>
			</page>
		</v-content>
	</v-app>
</template>

<script>
	import { mapActions } from 'vuex';
	import Blih from 'blih';
	import Page from './Blih/Page';

	export default {
		components: { Page },
		data () {
			return {
				/* Page state */
				loading: false,
				/* Snackbar */
				snackbar: {
					show: false,
					color: '',
					message: ''
				},
				/* Data */
				email: '',
				password: '',
				visible: false,
			};
		},
		methods: {
			...mapActions(['authenticate']),
			_init_ (callback) {
				Blih.ping()
					.then(_ => {
						this.showSnackbar('success', 'Blih is up');
						callback();
					}).catch(err => {
						callback('Blih is unreachable', err); //Blih is unreachable
					});
			},
			/* Helpers */
			login () {
				console.log('authenticating with ' + this.email + ' / ' + this.password);
				this.loading = true;
				this.hideSnackbar();
				this.authenticate({ email: this.email + '@epitech.eu', password: this.password })
					.then((data) => {
						this.$router.push({ name: 'blih.repositories' });
					}).catch((err) => {
						this.showSnackbar('error', err);
					}).then(_ => {
						this.password = '';
						this.loading = false;
					});
			},
			showSnackbar (color, message) {
				this.snackbar = {
					show: true,
					color,
					message
				};
			},
			hideSnackbar () {
				this.snackbar.show = false;
			},
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
