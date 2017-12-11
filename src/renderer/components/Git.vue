<template>
	<v-card tile>
		<v-container grid-list-md>
			<div class="subheading grey--text">Git</div>
			<v-layout row wrap>
				<v-flex xs12>
					<v-icon>link</v-icon> URL: <span class="grey--text">{{ url }}</span>
				</v-flex>
				<v-flex xs12 v-if="!init && !error">
					<v-list two-line v-show='commits.length > 0'>
						<template v-for='(commit, index) in latestCommits'>
							<v-divider v-if='index > 0'></v-divider>
							<v-list-tile avatar :key='commit.hash' @click.stop='diff(commit)'>
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
						<p class='mb-0'>
							<v-icon>history</v-icon> {{ commits.length }} commits (on branch <span class='grey--text'>{{ branch }}</span>)
						</p>
						<v-pagination :length='nbPages' v-model='page'></v-pagination>
					</v-list>
					<p class='text-xs-center mb-0' v-show='commits.length == 0'>
						No commits
					</p>
				</v-flex>
				<v-flex xs12 v-else-if="!init && error">
					Error: {{ error }}
				</v-flex>
				<v-flex xs12 v-else>
					<v-progress-linear height='5' color='primary' indeterminate></v-progress-linear>
					<p class="text-xs-center mb-0">Fetching history ...</p>
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

		<!-- Dialog: Clone -->
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

		<!-- Dialog: Diff -->
		<v-dialog persistent max-width='500px' v-model='dialog_diff.show'>
			<v-card v-if='dialog_diff.show'>
				<v-card-title>
					<span class="headline">
						 {{ dialog_diff.commit.message }} &mdash;
						 <span class='grey--text'>{{ shortHash(dialog_diff.commit.hash) }}</span>
					</span>
				</v-card-title>
				<v-container>
					<v-layout row wrap class='text-xs-center' v-if='dialog_diff.diff'>
						<v-flex xs12>
							<v-list two-line>
								<template v-for='(file, index) in dialog_diff.diff.files'>
									<v-divider v-if='index > 0'></v-divider>
									<v-list-tile avatar :key='file.file'>
										<v-list-tile-avatar color='grey lighten-2' class='text-xs-center'>
											<v-icon>insert_drive_file</v-icon>
										</v-list-tile-avatar>
										<v-list-tile-content>
											<v-list-tile-title>{{ file.file }}</v-list-tile-title>
											<v-list-tile-sub-title><span class="success--text">{{ file.insertions }} insertions</span> &mdash; <span class="error--text">{{ file.deletions }} deletions</span></v-list-tile-sub-title>
										</v-list-tile-content>
									</v-list-tile>
								</template>
								<p class='mb-0'>
									<v-icon>edit</v-icon> Total: {{ dialog_diff.diff.insertions + dialog_diff.diff.deletions }} changes (<span class="success--text">{{ dialog_diff.diff.insertions }}</span> /  <span class="error--text">{{ dialog_diff.diff.deletions }}</span>)
								</p>
							</v-list>
						</v-flex>
					</v-layout>
					<v-layout row wrap v-else>
						<v-flex xs12>
							This commit has no parent.
						</v-flex>
					</v-layout>
				</v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat @click.stop='diffClose'>Close</v-btn>
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
				dialog_diff: {
					show: false,
					commit: {},
					diff: {},
				},
				/* Data */
				git: null,
				branch: null,
				commits: [],
				page: 1,
				perPage: 5,
				/* Tmp dir */
				local: null,
				cleanup: null
			};
		},
		methods: {
			clone () {
				try {
					this.git.clone(this.url, this.local)
						.then(this.getStatus)
						.then(this.getLog)
						.catch(err => {
							this.error = err.message;
						}).then(_ => {
							this.init = false
						});
					// TODO: Allow to switch between branches. Tabs ?
					//this.git.branch().then(console.log).catch(console.log)
				} catch (err) {
					this.error = err.message;
				}
			},
			getStatus () {
				return this.git.status()
					.then(status => {
						this.branch = status.current;
					}).catch(err => {
						this.error = err.message;
					});
			},
			getLog () {
				return this.git.log()
					.then(log => {
						this.commits = log.all;
					}).catch(err => {
						this.commits = [];
						//this.error = err.message;
					});
			},
			/* Dialog: Clone */
			cloneCancel () {
				this.dialog_clone.show = false;
			},
			cloneClone () {
				this.dialog_clone.show = false;
			},
			/* Dialog: Diff */
			diff (commit) {
				const parent = this.parentOf(commit);
				this.dialog_diff.commit = commit;
				if (parent != null) {
					this.git.diffSummary([parent.hash, commit.hash])
						.then(diff => {
							this.dialog_diff.diff = diff;
						}).catch(console.log)
				} else {
					this.dialog_diff.diff = false;
				}
				this.dialog_diff.show = true;
			},
			diffClose () {
				this.dialog_diff.show = false;
				this.dialog_diff.commit = '';
				this.dialog_diff.diff = {};
			},
			/* Transform */
			shortHash (hash) {
				return hash.slice(0, 7);
			},
			legibleTime (date) {
				const m = moment(date, "YYYY-MM-DD hh:mm:ss ZZ");
				return m.fromNow();
			},
			/* Helpers */
			parentOf (commit) {
				const index = this.commits.findIndex(c => c.hash == commit.hash);
				return (index != this.commits.length - 1 ? this.commits[index + 1] : { hash: '4b825dc642cb6eb9a060e54bf8d69288fbee4904' });
			}
		},
		computed: {
			latestCommits () {
				const start = (this.page - 1) * this.perPage;
				return this.commits.slice(start, start + this.perPage);
			},
			nbPages () {
				return Math.ceil(this.commits.length / this.perPage);
			}
		},
		mounted () {
			tmp.setGracefulCleanup();
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
