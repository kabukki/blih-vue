<template>
	<v-app>
		<v-content>
			<page @init='_init_' :snackbar='snackbar' fill-height>
				<!-- Content -->
				<v-layout row align-center justify-space-around>
					<v-flex sm8 md6 lg4>
						<div class='text-xs-center display-2 primary--text '>Log in</div>
						<v-form v-model='valid' @submit.prevent='logIn'>
							<v-text-field label='Email' prepend-icon='person' v-model='email' required
								suffix="@epitech.eu"
								type="email"
								:rules='rules'
								:disabled='loading'/>
							<v-text-field label='Password' prepend-icon='lock' v-model='password' required
								:append-icon="visible ? 'visibility' : 'visibility_off'"
								:append-icon-cb="_ => { visible = !visible }"
								:type="visible ? 'text' : 'password'"
								:rules='rules'
								:disabled='loading'/>
							<div class="text-xs-center">
								<v-btn type="submit" color='primary' :disabled='loading || !valid' :loading='loading'>OK</v-btn>
							</div>
						</v-form>
					</v-flex>
				</v-layout>
			</page>
		</v-content>
	</v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { snackbar } from '../mixins';
import Blih from 'blih';
import Page from './Blih/Page';

export default {
	components: { Page },
	mixins: [snackbar],
	data () {
		return {
			/* Page state */
			loading: false,
			rules: [
				field => !!field || 'Required'
			],
			valid: true,
			/* Data */
			email: '',
			password: '',
			visible: false
		};
	},
	methods: {
		...mapActions(['authenticate', 'addCollaborator', 'setLastEmail']),
		async _init_ (callback) {
			try {
				const time = await Blih.ping();
				this.showSnackbar('success', `Blih is up (responded in ${time}ms)`);
				callback();
			} catch (e) {
				callback(e);
			}
		},
		/* Helpers */
		logIn () {
			this.loading = true;
			this.authenticate({
				email: this.email.includes('@') ? this.email : this.email + '@epitech.eu',
				password: this.password
			}).then(_ => {
				// Remember login for next time
				this.setLastEmail(this.email);
				// Register yourself
				this.addCollaborator(this.login);
				this.$router.push({ name: 'blih.repositories' });
			}).catch(err => {
				this.showSnackbar('error', err);
			}).then(_ => {
				this.password = '';
				this.loading = false;
			});
		}
	},
	computed: {
		...mapGetters(['login', 'lastEmail'])
	},
	created () {
		this.email = this.lastEmail;
	}
};
</script>
