import Git from 'nodegit';
import mkdirp from 'mkdirp-promise';
import path from 'path';
import fs from 'fs';
import os from 'os';
import rimraf from 'rimraf';

const sshDir = path.join(os.homedir(), '.ssh');

export default class RepositoryHub {
    constructor (directory) {
        this.root = directory;
    }

    /*
     * Set up the hub (bare name)
     * Creates directory if it does not exist.
     */
    init () {
        return mkdirp(this.root);
    }

    /*
     * Set the current user
     */
    use (name) {
        this.path = path.join(this.root, name);
        return mkdirp(this.path);
    }

    /*
     * Add a repository
     */
    add (name, url) {
        if (this.path) {
            const repoPath = path.join(this.path, name);
            try {
                fs.accessSync(repoPath, fs.constants.R_OK | fs.constants.W_OK);
                return Git.Repository.openBare(repoPath);
            } catch (_) {
                return Git.Clone(url, repoPath, {
                    bare: 1,
                    fetchOpts: {
                        callbacks: {
                            credentials: (_url, _username) => Git.Cred.sshKeyNew(
                                'git',
                                path.join(sshDir, 'id_rsa.pub'),
                                path.join(sshDir, 'id_rsa'),
                                ''
                            )
                        }
                    }
                });
            }
        } else {
            return Promise.reject(new Error('User is not set'));
        }
    }

    /*
     * Delete a repository
     */
    delete (name) {
        if (this.path) {
            return new Promise((resolve, reject) => {
                rimraf(path.join(this.path, name), {
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
     * Perform a git pull on a repository
     */
    update (name) {
        if (this.path) {
            let repository;
            return Git.Repository.openBare(path.join(this.path, name))
                .then(repo => {
                    repository = repo;
                    return repo.fetchAll({
                        callbacks: {
                            credentials: (_url, _username) => Git.Cred.sshKeyNew(
                                'git',
                                path.join(sshDir, 'id_rsa.pub'),
                                path.join(sshDir, 'id_rsa'),
                                ''
                            )
                        }
                    });
                })
                .then(_ => repository.mergeBranches('master', 'origin/master'));
        } else {
            return Promise.reject(new Error('User is not set'));
        }
    }

    /*
     * Get history for a repository on the master branch
     */
    history (name) {
        if (this.path) {
            return Git.Repository.openBare(path.join(this.path, name))
                .then(repo => repo.getMasterCommit())
                .then(first => new Promise(
                    (resolve, reject) => {
                        let history = first.history(Git.Revwalk.SORT.TIME);
                        let commits = [];

                        history.on('commit', commit => {
                            commits.push(commit);
                        });

                        history.on('end', _ => {
                            resolve(commits);
                        });

                        history.on('error', err => {
                            reject(err);
                        });

                        history.start();
                    }
                ));
        } else {
            return Promise.reject(new Error('User is not set'));
        }
    }

    /*
     * Get file tree for a repository
     */
    tree (name) {
        if (this.path) {
            return Git.Repository.openBare(path.join(this.path, name))
                .then(repo => repo.getMasterCommit())
                .then(first => first.getTree())
                .then(tree => new Promise(
                    (resolve, reject) => {
                        let walker = tree.walk();
                        let entries = [];

                        walker.on('entry', entry => {
                            entries.push(entry);
                        });

                        walker.on('end', _ => {
                            resolve(entries);
                        });

                        walker.on('error', err => {
                            reject(err);
                        });

                        walker.start();
                    }
                ));
        } else {
            return Promise.reject(new Error('User is not set'));
        }
    }
};
