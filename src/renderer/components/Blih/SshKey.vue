<template>
	<page v-on:init='_init_' :snackbar='snackbar'>
		<!-- Content -->
		<v-layout row wrap>
			<!-- Name -->
			<v-flex xs12>
				<v-card tile dark :color='color' class='pa-4'>
					<v-card-text class='text-xs-center'>
						<div class="display-3">{{ name }}</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<!-- Information -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<v-layout row wrap>
							<v-flex sm12 md4>
								<div class="subheading grey--text">Type</div>
								{{ type }}
							</v-flex>
							<v-flex sm12 md4>
								<div class="subheading grey--text">Comment</div>
								{{ comment }}
							</v-flex>
							<v-flex sm12 md4>
								<div class="subheading grey--text">Fingerprint</div>
								{{ fingerprint }}
							</v-flex>
						</v-layout>
					</v-container>
				</v-card>
			</v-flex>
			<!-- Data -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<div class="subheading grey--text">Danger zone</div>
						<v-text-field label='Contents' textarea readonly auto-grow :value='key.data'></v-text-field>
					</v-container>
				</v-card>
			</v-flex>
			<!-- Danger zone -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<div class="subheading grey--text">Danger zone</div>
						<v-btn color='error' @click.stop='dialog_delete.show = true'>
							<v-icon left>delete</v-icon>
							Delete
						</v-btn>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>

	</page>
	<!-- work-break: break-all -->
</template>

<script>
	import { mapGetters } from 'vuex';
	import Page from './Page';

	export default {
		components: { Page },
		data () {
			return {
				/* Snackbar */
				snackbar: {
					show: false,
					color: '',
					message: ''
				},
				/* Dialogs */
				dialog_delete: {
					show: false,
					loading: false
				},
				/* Data */
				name: '',
				key: {}
			};
		},
		methods: {
			...mapGetters(['keys']),
			_init_ (callback) {
				callback();
			}
		},
		computed: {
			...mapGetters(['colorOf']),
			color () {
				return this.colorOf(this.name);
			},
			type () {
				console.log('Key in type:');
				console.log(this.key);
				return this.key.data.split(' ')[0];
			},
			comment () {
				return this.key.name;
			},
			fingerprint () {
				return 'f';
			}
		},
		created () {
			this.name = this.$route.params.name;
			this.key = this.keys().find(k => k.name == this.name);
		}
	}
</script>

<style lang="css">
</style>
