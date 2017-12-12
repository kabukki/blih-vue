<template>
	<v-app>
		<v-content>
			<page v-on:init='_init_' :snackbar='snackbar' fill-height>
				<!-- Content -->
				<v-layout row align-center justify-space-around>
					<v-flex sm8 md6 lg4 class='text-xs-center'>
						<div class='display-2 primary--text '>Log in</div>
						<v-form @submit.prevent='logIn'>
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
	import { mapGetters, mapActions } from 'vuex';
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
			...mapActions(['authenticate', 'addCollaborator']),
			_init_ (callback) {
				Blih.ping()
					.then(_ => {
						this.showSnackbar('success', 'Blih is up');
						callback();
					}).catch(err => {
						callback('Blih is unreachable', err);
					});
			},
			/* Helpers */
			logIn () {
				this.loading = true;
				this.authenticate({
					email: this.email.includes('@') ? this.email : this.email + '@epitech.eu',
					password: this.password
				}).then((data) => {
					// Register yourself
					this.addCollaborator(this.login);
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
			}
		},
		computed: {
			...mapGetters(['login'])
		}
	};
</script>
