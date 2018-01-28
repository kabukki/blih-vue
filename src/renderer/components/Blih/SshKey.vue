<template>
	<page @init='_init_' :snackbar='snackbar'>
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
							<v-flex sm12 md6>
								<div class="subheading grey--text">Type</div>
								{{ type }}
							</v-flex>
							<v-flex sm12 md6>
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
						<div class="subheading grey--text">Key contents</div>
						<v-text-field label='Data' textarea readonly auto-grow :value='key.data'></v-text-field>
						<!-- FAB -->
						<v-btn small fab absolute bottom right color='primary' @click.stop='dialog_download.show = true'>
							<v-icon small>file_download</v-icon>
						</v-btn>
					</v-container>
				</v-card>
			</v-flex>
			<!-- Danger zone -->
			<v-flex xs12>
				<v-card tile class='text-xs-center'>
					<v-container>
						<div class="subheading grey--text">Danger zone</div>
						<v-btn color='error' @click.stop='dialogDelete.show = true'>
							<v-icon left>delete</v-icon>
							Delete
						</v-btn>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>

		<!-- Dialog: Delete -->
		<dialog-basic action='Delete' @submit='dialogDelete.submit' v-model='dialogDelete.show'>
			<span slot="header" class="headline">Delete key ?</span>
			This will delete the key "{{ name }}" forever.
		</dialog-basic>

		<!-- Dialog: Download -->
		<v-dialog persistent max-width='500px' v-model='dialog_download.show'>
			<v-form v-model='dialog_download.valid' @submit.prevent='downloadDownload'>
				<v-card>
					<v-card-title>
						<span class="headline">Download a public key</span>
					</v-card-title>
					<v-card-text>
						<v-text-field label='Destination folder' prepend-icon='folder' readonly v-model='dialog_download.destination' :rules='dialog_download.rules'></v-text-field>
						<v-text-field label='File name' prepend-icon='insert_drive_file' v-model='dialog_download.name' :rules='dialog_download.rules'></v-text-field>
						<input type="file" @change='downloadChange' webkitdirectory>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_download.loading' @click.stop='downloadCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='dialog_download.loading || !dialog_download.valid' :loading='dialog_download.loading'>Download</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
	</page>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { snackbar } from '../../mixins';

	import Page from './Page';

	import fingerprint from 'ssh-fingerprint';
	import fs from 'fs-extra';
	import path from 'path';

	export default {
	  components: { Page },
	  mixins: [snackbar],
	  data () {
	    return {
	      /* Dialogs */
	      dialogDelete: {
	        show: false,
	        submit: (success, failure) => {
	          this.api.deleteKey(this.name)
	            .then(_ => {
	              success();
	              this.$router.push({name: 'blih.ssh-keys'});
	            }).catch(err => {
	              failure();
	              this.showSnackbar('error', err);
	            });
	        }
	      },
	      dialog_download: {
	        show: false,
	        loading: false,
	        rules: [
	          path => !!path || 'Required'
	        ],
	        valid: true,
	        destination: null,
	        name: null
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
	    },
	    /* Dialog: Download */
	    downloadCancel () {
	      this.dialog_download.show = false;
	    },
	    downloadDownload () {
	      const keyPath = path.join(this.dialog_download.destination, this.dialog_download.name);
	      this.dialog_download.loading = true;
	      fs.writeFile(keyPath, this.key.data.concat(' ', this.name), (err) => {
	        if (err) {
	          this.showSnackbar('error', err);
	        } else {
	          this.showSnackbar('success', 'Successfully downloaded key to ' + keyPath);
	          this.dialog_download.show = false;
	        }
	        this.dialog_download.loading = false;
	      });
	    },
	    downloadChange (destination) {
	      if (destination.target.files[0]) {
	        this.dialog_download.destination = destination.target.files[0].path;
	      } else {
	        this.dialog_download.destination = null;
	      }
	    }
	  },
	  computed: {
	    ...mapGetters(['api', 'colorOf']),
	    color () {
	      return this.colorOf(this.name);
	    },
	    type () {
	      return this.key.data.split(' ')[0];
	    },
	    fingerprint () {
	      return fingerprint(this.key.data);
	    }
	  },
	  created () {
	    this.name = this.$route.params.name;
	    this.key = this.keys().find(k => k.name === this.name);
	    this.dialog_download.name = this.name + '.pub';
	  }
	};
</script>
