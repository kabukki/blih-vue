<template>
	<v-card tile>
		<v-container>
			<div class="subheading grey--text">Git</div>
			<v-layout row wrap>
				<v-flex xs12>
					<v-icon>link</v-icon> URL: <span class="grey--text">{{ url }}</span>
				</v-flex>
				<!-- Done -->
				<v-flex xs12 v-if="!init && !error">
					<v-list two-line v-show='commits.length > 0'>
						<template v-for='(commit, index) in pageCommits'>
							<v-divider v-if='index > 0'></v-divider>
							<v-list-tile avatar :key='commit.sha()' @click.stop='diff(commit)'>
								<tile-avatar :name='commit.author().name()' class='mr-3'></tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title>
										{{ commit.message() }} &mdash; <span class="grey--text">{{ shortHash(commit.sha()) }}</span>
									</v-list-tile-title>
									<v-list-tile-sub-title>
										<span class='text--primary'>{{ commit.author().name() }}</span>
										<span class='text--secondary'>&lt;{{ commit.author().email() }}&gt;</span>
									</v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-list-tile-action-text>
										{{ legibleTime(commit.date()) }}
									</v-list-tile-action-text>
								</v-list-tile-action>
							</v-list-tile>
						</template>
						<p class='mb-0'>
							<v-icon>history</v-icon> {{ commits.length }} commits (on branch <span class='grey--text'>{{ branch }}</span>)
						</p>
						<v-pagination :length='nbPages' :total-visible='7' v-model='page'></v-pagination>
					</v-list>
					<p class='text-xs-center mb-0' v-show='commits.length == 0'>
						No commits
					</p>
				</v-flex>
				<!-- Error -->
				<v-flex xs12 v-else-if="!init && error">
					Error: {{ error }}
				</v-flex>
				<!-- Loading -->
				<v-flex xs12 v-else>
					<v-progress-linear height='5' color='primary' indeterminate></v-progress-linear>
					<p class="text-xs-center mb-0">Fetching history ...</p>
				</v-flex>
				<!-- FAB -->
				<v-fab-transition>
					<v-btn small fab absolute bottom right color='primary' v-show='!init && !error' @click.stop='dialog_clone.show = true'>
						<v-icon small>cloud_download</v-icon>
					</v-btn>
				</v-fab-transition>
			</v-layout>
		</v-container>

		<!-- Dialog: Clone -->
		<v-dialog max-width='500px' v-model='dialog_clone.show'>
			<v-form v-model='dialog_clone.valid' @submit.prevent='cloneClone'>
				<v-card>
					<v-card-title>
					</v-card-title>
					<v-card-text>
						<v-text-field label='Destination' prepend-icon='folder' readonly v-model='dialog_clone.destination' :rules='dialog_clone.rules'></v-text-field>
						<input label='Destination' type="file" @change='cloneChange' webkitdirectory>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_clone.loading' @click.stop='cloneCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='dialog_clone.loading || !dialog_clone.valid' :loading='dialog_clone.loading' @click.stop='cloneClone'>Clone</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- Dialog: Diff -->
		<dialog-basic scrollable v-model='dialogDiff.show' v-if='dialogDiff.commit'>
			<span slot="header" class="headline">
				{{ dialogDiff.commit.message() }} &mdash;
				<span class='grey--text'>{{ shortHash(dialogDiff.commit.sha()) }}</span>
			</span>
			<v-list two-line v-if='dialogDiff.diff.files.length > 0'>
				<template v-for='(file, index) in dialogDiff.diff.files'>
					<v-divider v-if='index > 0'></v-divider>
					<v-list-tile avatar :key='file.file'>
						<v-list-tile-avatar color='grey lighten-1'>
							<span><v-icon>insert_drive_file</v-icon></span>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>{{ file.file }}</v-list-tile-title>
							<v-list-tile-sub-title>
								<span v-show='file.insertions > 0' class="success--text">{{ file.insertions }} insertions</span>
								<span v-show='file.insertions > 0 && file.deletions > 0'>&mdash;</span>
								<span v-show='file.deletions > 0' class="error--text">{{ file.deletions }} deletions</span>
							</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
				</template>
			</v-list>
			<p class='text-xs-center mb-0' v-else>
				Nothing to show.
			</p>
			<div slot="footer">
				<v-icon>edit</v-icon>
				Total: {{ dialogDiff.diff.insertions + dialogDiff.diff.deletions }} changes
				(<span class="success--text">{{ dialogDiff.diff.insertions }}</span> /
				<span class="error--text">{{ dialogDiff.diff.deletions }}</span>)
			</div>
		</dialog-basic>

	</v-card>
</template>
<script>
	import { mapGetters } from 'vuex';
	import { snackbar } from '../mixins';

	import TileAvatar from './TileAvatar';
	import DialogBasic from './Dialogs/DialogBasic';

	import RepositoryHub from '../RepositoryHub';
	import electron from 'electron';
	import path from 'path';
	import moment from 'moment';
	import fs from 'fs-extra';

	const dataDir = (electron.app || electron.remote.app).getPath('userData');

	export default {
		components: { TileAvatar, DialogBasic },
		mixins: [snackbar],
		props: {
			url: {
				type: String,
				required: true
			},
			name: {
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
				// TODO: vuetify file input component to use with dialog-form
				dialog_clone: {
					show: false,
					loading: false,
					rules: [
						path => !!path || 'Required'
					],
					valid: true,
					destination: null
				},
				dialogDiff: {
					show: false,
					commit: null,
					diff: null
				},
				/* Data */
				hub: null,
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
			/* Dialog: Clone */
			cloneCancel () {
				this.dialog_clone.show = false;
			},
			cloneClone () {
				this.dialog_clone.loading = true;
				fs.copy(this.local, this.dialog_clone.destination, err => {
					if (err) {
						this.$emit('snackbar', 'error', err);
					} else {
						this.$emit('snackbar', 'success', 'Successfully cloned repository into ' + this.dialog_clone.destination);
						this.dialog_clone.show = false;
					}
					this.dialog_clone.loading = false;
				});
			},
			cloneChange (destination) {
				if (destination.target.files[0]) {
					this.dialog_clone.destination = destination.target.files[0].path;
				}
			},
			/* Dialog: Diff */
			async diff (commit) {
				const diff = (await commit.getDiff())[0];
				for (const patch of await diff.patches()) {
					for (const hunk of await patch.hunks()) {
						console.log(hunk.header().trim());
					}
				}
				this.dialogDiff.diff = { files: [], insertions: 0, deletions: 0 };
				this.dialogDiff.commit = commit;
				this.dialogDiff.show = true;
				// const parent = this.parentOf(commit);
				// console.log(this.git);
				// console.log(this.git.diffSummary([parent.hash, commit.hash]));
				/*
				this.git.diffSummary([parent.hash, commit.hash])
					.then(diff => {
						this.dialogDiff.diff = diff;
						this.dialogDiff.show = true;
					}).catch(err => {
						this.error = err;
					});
					*/
			},
			/* Transform */
			shortHash (hash) {
				return hash ? hash.slice(0, 7) : '';
			},
			legibleTime (date) {
				const m = moment(date, 'YYYY-MM-DD hh:mm:ss ZZ');
				return m.fromNow();
			},
			/* Helpers */
			parentOf (commit) {
				const index = this.commits.findIndex(c => c.hash === commit.hash);
				return (index !== this.commits.length - 1 ? this.commits[index + 1] : { hash: '4b825dc642cb6eb9a060e54bf8d69288fbee4904' });
			}
		},
		computed: {
			...mapGetters(['login']),
			pageCommits () {
				const start = (this.page - 1) * this.perPage;
				return this.commits.slice(start, start + this.perPage);
			},
			nbPages () {
				return Math.ceil(this.commits.length / this.perPage);
			}
		},
		mounted () {
			// TODO: Allow to switch between branches. Tabs ?
			this.hub = new RepositoryHub(path.join(dataDir, '.hub'));
			this.hub.init()
				.then(_ => this.hub.use(this.login))
				.then(_ => this.hub.add(this.name, this.url))
				.then(_ => this.hub.update(this.name))
				.then(_ => this.hub.history(this.name))
				.then(commits => {
					this.commits = commits;
					this.branch = 'master';
					console.log(this.commits);
					this.init = false;
				});
		}
	};
</script>
