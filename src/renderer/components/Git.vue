<template>
	<v-card tile>
		<v-container>
			<div class="subheading text-xs-center grey--text">Git</div>
			<v-layout row wrap>
				<!-- Done -->
				<v-flex xs12 v-if="!init && !error">
					<v-select label='Branch' prepend-icon='merge_type' @change='updateAll' :items='branchNames' v-model='branch'></v-select>
					<v-tabs icons-and-text fixed-tabs slider-color='primary'>
						<v-tab>Overview <v-icon>home</v-icon></v-tab>
						<v-tab>Files <v-icon>folder</v-icon></v-tab>
						<v-tab>History <v-icon>history</v-icon></v-tab>
						<v-tab>Insights <v-icon>explore</v-icon></v-tab>

						<!-- Overview -->
						<v-tab-item class='mt-3'>
							<div>
								<v-icon>link</v-icon> URL: <span class="grey--text">{{ url }}</span>
							</div>
							<div>
								<v-icon>merge_type</v-icon> Branches: <span class="grey--text">{{ branches.length }}</span>
							</div>
							<div>
								<v-icon>code</v-icon> Commits: <span class="grey--text">{{ commits.length }}</span>
							</div>
							<div>
								<v-icon>content_copy</v-icon> Files: <span class="grey--text">{{ nbFiles }}</span>
							</div>
						</v-tab-item>

						<!-- Files -->
						<v-tab-item class='mt-3'>
							<file-tree v-for='(file, index) in files' :key='`file${index}`' :file='file'></file-tree>
							<p class="text-xs-center mb-0">
								<v-icon small>info</v-icon> Click on a folder to expand it.
							</p>
						</v-tab-item>

						<!-- History -->
						<v-tab-item class='text-xs-center mt-3'>
							<v-list two-line v-show='commits.length > 0'>
								<template v-for='(commit, index) in pageCommits'>
									<v-divider v-if='index > 0'></v-divider>
									<v-list-tile avatar :key='commit.sha' @click.stop='diff(commit)'>
										<tile-avatar :name='commit.author.name' class='mr-3'></tile-avatar>
										<v-list-tile-content>
											<v-list-tile-title>
												{{ commit.message }} &mdash; <span class="grey--text">{{ shortHash(commit.sha) }}</span>
											</v-list-tile-title>
											<v-list-tile-sub-title>
												<span class='text--primary'>{{ commit.author.name }}</span>
												<span class='text--secondary'>&lt;{{ commit.author.email }}&gt;</span>
											</v-list-tile-sub-title>
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
								<v-pagination :length='nbPages' :total-visible='7' v-model='page'></v-pagination>
							</v-list>
							<p class='text-xs-center mb-0' v-show='commits.length == 0'>
								No commits
							</p>
						</v-tab-item>

						<!-- Insights -->
						<v-tab-item class='mt-3'>
							Insights
						</v-tab-item>
					</v-tabs>
				</v-flex>
				<!-- Error -->
				<v-flex xs12 v-else-if="!init && error">
					Error: {{ error.message }}
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
						<span class='headline'>Clone a repository</span>
					</v-card-title>
					<v-card-text>
						<v-text-field label='Destination' prepend-icon='folder' readonly v-model='dialog_clone.destination' :rules='dialog_clone.rules'></v-text-field>
						<input label='Destination' type="file" @change='cloneChange' webkitdirectory>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat :disabled='dialog_clone.loading' @click.stop='cloneCancel'>Cancel</v-btn>
						<v-btn color="primary" type='submit' flat :disabled='dialog_clone.loading || !dialog_clone.valid' :loading='dialog_clone.loading'>Clone</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- Dialog: Diff -->
		<dialog-basic scrollable v-model='dialogDiff.show' v-if='dialogDiff.commit'>
			<span slot="header" class="headline">
				{{ dialogDiff.commit.message }} &mdash;
				<span class='grey--text'>{{ shortHash(dialogDiff.commit.sha) }}</span>
			</span>
			<v-list two-line v-if='dialogDiff.diff.length > 0'>
				<template v-for='(file, index) in dialogDiff.diff'>
					<v-divider v-if='index > 0'></v-divider>
					<v-list-tile avatar :key='file.oldFile'>
						<v-list-tile-avatar color='grey lighten-1'>
							<span><v-icon>{{ file.status.icon }}</v-icon></span>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>{{ file.oldFile }}</v-list-tile-title>
							<v-list-tile-sub-title>
								<span v-show='file.stats.insertions > 0' class="success--text">{{ file.stats.insertions }} insertions</span>
								<span v-show='file.stats.insertions > 0 && file.stats.deletions > 0'>&mdash;</span>
								<span v-show='file.stats.deletions > 0' class="error--text">{{ file.stats.deletions }} deletions</span>
							</v-list-tile-sub-title>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-list-tile-action-text>
								{{ file.status.str }}
							</v-list-tile-action-text>
						</v-list-tile-action>
					</v-list-tile>
				</template>
			</v-list>
			<p class='text-xs-center mb-0' v-else>
				Nothing to show.
			</p>

			<div slot="footer">
				<v-icon>edit</v-icon>
				Total: {{ dialogDiff.totalAdditions + dialogDiff.totalDeletions }} changes
				(<span class="success--text">{{ dialogDiff.totalAdditions }}</span> /
				<span class="error--text">{{ dialogDiff.totalDeletions }}</span>)
			</div>
		</dialog-basic>

	</v-card>
</template>
<script>
	import { mapGetters } from 'vuex';
	import { snackbar } from '../mixins';

	import TileAvatar from './TileAvatar';
	import DialogBasic from './Dialogs/DialogBasic';
	import FileTree from './FileTree';

	import RepositoryHub from '../RepositoryHub';
	import electron from 'electron';
	import path from 'path';
	import moment from 'moment';

	const dataDir = (electron.app || electron.remote.app).getPath('userData');

	export default {
		components: { TileAvatar, DialogBasic, FileTree },
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
					diff: [],
					totalAdditions: 0,
					totalDeletions: 0
				},
				/* Data */
				hub: null,
				branches: [],
				branch: 'master',
				files: [],
				commits: [],
				insights: {},
				page: 1,
				perPage: 5,
				/* Tmp dir */
				local: null,
				cleanup: null
			};
		},
		methods: {
			async getFiles (branch) {
				return this.hub.tree(this.name, branch);
			},
			async getHistory (branch) {
				const history = await this.hub.history(this.name, branch);
				return Promise.all(
					history.map(
						async commit => ({
							sha: commit.sha(),
							date: commit.date(),
							message: commit.message(),
							author: {
								name: commit.author().name(),
								email: commit.author().email()
							},
							diff: (await commit.getDiff())[0]
						})
					)
				);
			},
			async getInsights (_branch) {

			},
			/**
			 * Update overview, files, history and insights according to a branch
			 */
			async updateAll (branch) {
				this.files = await this.getFiles(branch);
				this.commits = await this.getHistory(branch);
				this.insights = await this.getInsights(branch);
			},
			getNbChildren (file) {
				if (file.children) {
					return file.children.reduce(
						(total, child) => total + (child.type === 'tree' ? this.getNbChildren(child) : 1), 0
					);
				} else {
					return 0;
				}
			},
			/* Dialog: Clone */
			cloneCancel () {
				this.dialog_clone.show = false;
			},
			async cloneClone () {
				this.dialog_clone.loading = true;
				try {
					await this.hub.copy(this.name, this.dialog_clone.destination);
					this.$emit('snackbar', 'success', 'Successfully cloned repository to ' + this.dialog_clone.destination);
				} catch (err) {
					this.$emit('snackbar', 'error', err.message);
				}
				this.dialog_clone.loading = false;
			},
			cloneChange (destination) {
				if (destination.target.files[0]) {
					this.dialog_clone.destination = destination.target.files[0].path;
				}
			},
			/* Dialog: Diff */
			async diff (commit) {
				this.dialogDiff.diff = [];
				this.dialogDiff.totalAdditions = 0;
				this.dialogDiff.totalDeletions = 0;
				const patchStatus = [
					{ str: 'unmodified', icon: 'insert_drive_file' },
					{ str: 'added', icon: 'add' },
					{ str: 'deleted', icon: 'remove' },
					{ str: 'modified', icon: 'edit' },
					{ str: 'renamed', icon: 'swap_horiz' },
					{ str: 'copied', icon: 'content_copy' },
					{ str: 'ignored', icon: 'visibility_off' },
					{ str: 'untracked', icon: 'clear' },
					{ str: 'typechange', icon: 'insert_drive_file' },
					{ str: 'unreadable', icon: 'visibility_off' },
					{ str: 'conflicted', icon: 'report' }
				];
				// const diff = (await commit.getDiff())[0];
				// [ConvenientPatch] patch = a file that changed
				for (const patch of await commit.diff.patches()) {
					const stats = patch.lineStats();

					let summary = {
						oldFile: patch.oldFile().path(),
						newFile: patch.newFile().path(),
						status: patchStatus[patch.status()],
						stats: {
							insertions: stats.total_additions,
							deletions: stats.total_deletions
						},
						hunks: []
					};
					// each hunk shows one area where the files differ.
					for (const hunk of await patch.hunks()) {
						const lines = await hunk.lines();
						summary.hunks.push({
							header: hunk.header().trim(),
							lines: lines.map(line => ({
								type: String.fromCharCode(line.origin()),
								content: line.content()
							}))
						});
					}
					this.dialogDiff.diff.push(summary);
					this.dialogDiff.totalAdditions += stats.total_additions;
					this.dialogDiff.totalDeletions += stats.total_deletions;
				}
				this.dialogDiff.commit = commit;
				this.dialogDiff.show = true;
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
			},
			branchNames () {
				return this.branches.map(branch => branch.shorthand().split('/')[1]);
			},
			nbFiles () {
				return this.getNbChildren({
					children: this.files
				});
			}
		},
		async mounted () {
			try {
				this.hub = new RepositoryHub(path.join(dataDir, '.hub'));
				await this.hub.init();
				await this.hub.use(this.login);
				await this.hub.add(this.name, this.url);
				await this.hub.update(this.name);
				this.branches = await this.hub.branches(this.name);
				await this.updateAll(this.branch);
			} catch (err) {
				this.error = err;
			}
			this.init = false;
		}
	};
</script>
