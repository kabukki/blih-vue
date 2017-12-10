<template>
	<v-card tile>
		<v-container fluid grid-list-md>
			<div class="subheading grey--text">Git</div>
			<v-layout row wrap>
				<v-flex xs12>
					<v-icon>link</v-icon> URL: <span class="grey--text">{{ url }}</span>
				</v-flex>
				<v-flex xs12 v-if="!init && !error">
					<v-list two-line>
						<template v-for='(commit, index) in latestCommits'>
							<v-divider v-if='index > 0'></v-divider>
							<v-list-tile avatar :key='commit.hash'>
								<avatar :name='commit.author_email' class='mr-3'></avatar>
								<v-list-tile-content>
									<v-list-tile-title>{{ commit.message }}</v-list-tile-title>
									<v-list-tile-sub-title><span class='text--primary'>{{ commit.author_name }}</span> &mdash; {{ shortHash(commit.hash) }}</v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-list-tile-action-text>
										{{ legibleTime(commit.date) }}
									</v-list-tile-action-text>
								</v-list-tile-action>
							</v-list-tile>
						</template>
						<p class='mb-0' v-if='commits.length > 5'>{{ commits.length - 5 }} more ...</p>
					</v-list>
				</v-flex>
				<v-flex xs12 v-else-if="!init && error">
					Error: {{ error }}
				</v-flex>
				<v-flex xs12 v-else>
					<v-progress-linear height='5' color='primary' indeterminate></v-progress-linear>
					<p class="text-xs-center mb-0">Fetching commits ...</p>
				</v-flex>
				<!-- FAB -->
				<v-tooltip left>
					<v-btn small fab absolute bottom right color='primary' slot='activator' @click.stop='dialog_clone.show = true'>
						<v-icon small>cloud_download</v-icon>
					</v-btn>
					<span>Clone</span>
				</v-tooltip>
			</v-layout>
		</v-container>
		<v-dialog persistent max-width='500px' v-model='dialog_clone.show'>
			<v-card>
				<v-card-title>
					<span class="headline">Clone a repository</span>
				</v-card-title>
				<v-card-text>
					<v-text-field label='Destination' prepend-icon='folder' v-model='dialog_clone.destination'
						type="text" disabled>
					</v-text-field>
					<p class="mb-0 error--text">Note: this feature is currently unavailable.</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat :disabled='dialog_clone.loading' @click.stop='cloneCancel'>Cancel</v-btn>
					<v-btn color="primary" flat :disabled='true' :loading='dialog_clone.loading' @click.stop='cloneClone'>Clone</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>
</template>
<script>
	import git from 'simple-git/promise';
	import tmp from 'tmp';
	import moment from 'moment';
	import Avatar from './Avatar';

	export default {
		components: { Avatar },
		props: {
			url: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				/* State */
				init: true,
				error: false,
				/* Dialogs */
				dialog_clone: {
					show: false,
				},
				/* Data */
				git: null,
				commits: [],
				/* Tmp dir */
				local: null,
				cleanup: null
			};
		},
		methods: {
			clone () {
				try {
					this.git.clone(this.url, this.local)
						.then(this.getLog)
						.catch(err => {
							console.log('err: ' + err);
						}).then(_ => {
							this.init = false
						});
				} catch (err) {
					console.log('err : ' + err);
				}
				this.git.status().then(console.log).catch(console.log);
			},
			getLog () {
				return this.git.log()
					.then(log => {
						this.commits = log.all;
					}).catch(err => {
						this.error = err.message;
					});
			},
			/* Dialog: Clone */
			cloneCancel () {
				this.dialog_clone.show = false;
			},
			cloneClone () {
				this.dialog_clone.show = false;
			},
			/* Transform */
			shortHash (hash) {
				return hash.slice(0, 7);
			},
			legibleTime (date) {
				const m = moment.parseZone(date);
				return m.fromNow();
			},
		},
		computed: {
			latestCommits () {
				return this.commits.slice(0, 5);
			}
		},
		mounted () {
			console.log('mounted');
			tmp.dir({ unsafeCleanup: true }, (err, path, cleanup) => {
				if (err) {
					this.error = err;
				} else {
					this.local = path;
					this.cleanup = cleanup;
					this.git = git(path).silent(true);
					this.clone();
				}
			});
		},
		destroyed () {
			if (this.git && this.cleanup) {
				this.git.clearQueue();
				this.git.exec(this.cleanup);
			}
		}
	}
</script>
