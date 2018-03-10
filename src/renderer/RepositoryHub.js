import Git from 'nodegit';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import path from 'path';
import store from './store';

export default class RepositoryHub {
	constructor (directory) {
		this.root = directory;
	}

	/*
     * Set up the hub (bare name)
     * Creates directory if it does not exist.
     */
	async init () {
		return fs.ensureDir(this.root);
	}

	/*
     * Set the current user
     */
	async use (name) {
		this.path = path.join(this.root, name);
		return fs.ensureDir(this.path);
	}

	/*
     * Add a repository
     */
	async add (name, url) {
		if (this.path) {
			const repoPath = path.join(this.path, name);
			try {
				await fs.ensureDir(repoPath);
				const repo = await Git.Repository.init(repoPath, 1); // 1 means the repository will be bare
				await Git.Remote.create(repo, 'origin', url);
			} catch (err) {
				return err;
			}
		} else {
			return Promise.reject(new Error('User is not set'));
		}
	}

	/*
	 * If 'name' is specified, deletes this repository, otherwise delete all repositories
     */
	delete (name) {
		if (this.path) {
			return new Promise((resolve, reject) => {
				rimraf(path.join(this.path, name || '.'), {
					disableGlob: true
				}, err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		} else {
			return Promise.reject(new Error('User is not set'));
		}
	}

	/*
     * Perform a git fetch on a repository
     */
	update (name, onProgress) {
		if (this.path) {
			return Git.Repository.openBare(path.join(this.path, name))
				.then(repo => {
					return repo.fetch('origin', {
						callbacks: {
							credentials: (_url, _username) => Git.Cred.sshKeyNew(
								'git',
								store.getters.publicKeyPath,
								store.getters.privateKeyPath,
								''
							),
							transferProgress: {
								// Reduce throttling to get a more accurate progress
								throttle: 50,
								callback (progress) {
									if (onProgress) {
										onProgress(progress);
									}
								}
							}
						}
					});
				});
		} else {
			return Promise.reject(new Error('User is not set'));
		}
	}

	/*
     * Get history for a repository on a given branch, defaulting to master
     */
	async history (name, branch) {
		if (this.path) {
			branch = branch || 'master';
			const repo = await Git.Repository.openBare(path.join(this.path, name));
			const first = await repo.getBranchCommit(`origin/${branch}`);
			return new Promise(
				(resolve, reject) => {
					let history = first.history(Git.Revwalk.SORT.TIME);
					history.on('end', resolve);
					history.on('error', reject);
					history.start();
				}
			);
		} else {
			return Promise.reject(new Error('User is not set'));
		}
	}

	/**
     * Recursively get children for a given tree
     * @param  {Tree} tree The tree
     * @return {[Object]} Array of children (objects)
     */
	async getChildren (tree) {
		let files = [];
		const filemodeStr = {
			'0': 'unreadable',
			'16384': 'tree',
			'33188': 'blob',
			'33261': 'executable',
			'40960': 'link',
			'57344': 'commit'
		};

		for (const entry of tree.entries()) {
			const children = entry.isTree() ? await this.getChildren(await entry.getTree()) : null;
			const blob = entry.isBlob() ? await entry.getBlob() : null;
			files.push({
				name: entry.name(),
				sha: entry.sha(),
				type: filemodeStr[entry.filemode()],
				children,
				blob
			});
		}
		return files;
	}

	/*
   * Get file tree for a repository
   */
	async tree (name, branch) {
		if (this.path) {
			branch = branch || 'master';
			const repo = await Git.Repository.openBare(path.join(this.path, name));
			const first = await repo.getBranchCommit(`origin/${branch}`);
			const tree = await first.getTree();

			return this.getChildren(tree);
		} else {
			return Promise.reject(new Error('User is not set'));
		}
	}

	/*
     * Get branches
     */
	async branches (name) {
		if (this.path) {
			const repo = await Git.Repository.openBare(path.join(this.path, name));
			const refs = await repo.getReferences(Git.Reference.TYPE.LISTALL);
			return refs.filter(ref => ref.isRemote());
		} else {
			return Promise.reject(new Error('User is not set'));
		}
	}

	/**
      * Copy a repository to a non-bare one at the specified destination
      * @param  {[type]} name        the repository to copy
      * @param  {[type]} destination where to copy it
      * @return {[type]}             [description]
      */
	async copy (name, destination) {
		if (!this.path) {
			return Promise.reject(new Error('User is not set'));
		} else if (!destination) {
			return Promise.reject(new Error('Destination not specified'));
		} else {
			const newPath = path.join(destination, name);
			const oldRepo = await Git.Repository.openBare(path.join(this.path, name));
			/* Create new repo */
			await fs.ensureDir(newPath);
			await fs.copy(oldRepo.path(), path.join(newPath, '.git'));
			let newRepo = await Git.Repository.init(newPath, 0);
			/* Set it to non-bare */
			let config = await newRepo.config();
			await config.setString('core.bare', 'false');
			/* Checkout master */
			const first = await newRepo.getBranchCommit('origin/master');
			const branch = await newRepo.createBranch('master', first, 0);
			await newRepo.checkoutBranch(branch);
		}
	}
};
