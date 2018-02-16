
<p align="center">
  <img src='build/icons/256.png' alt='logo'/>
  </p>

<h1 align='center'>
  Blih Vue
  </h1>

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> Managing repositories has never been easier.

Blih Vue is an intuitive and easy-to-use app that helps you efficiently manage your Epitech repositories.

## Easy to use

Sick of typing your password or to mess up the arguments order every time you use the Blih python script ?

With Blih Vue, authenticate once and you're good to go ! Navigate seamlessly through the application and manage your keys and repositories with ease.

## Features

* Browse, create, delete and edit your repositories :cloud:
* Edit collaborators and their rights :busts_in_silhouette:
* Get git insights on a repository :bar_chart:
* Manage your SSH keys :key:

## Download

Coming soon

## Build instructions

Simply run `npm run build`. This will build the application for the current platform into the `build` folder.

:information_source: You will first need to compile the native `nodegit` it on your platform or to download a pre-built binary. This step takes place when running `npm install`, but it may fail for several reasons.

Then, `electron-rebuild` will rebuild the module against the version of Node.js that Electron is using.

### Troubleshooting

#### When installing

> ...

This means you do not have the build tools required to compile native modules.
* On Windows:
Run `npm i -g windows-build-tools` as administrator to install C++ build tools, or do it manually.

> fatal error: curl/curl.h: No such file or directory

This happens when compiling nodegit from source. It requires the libcurl-dev package to be installed.
* On Ubuntu:
Run `apt install libcurl-dev` and install the appropriate package (`libcurl4-gnutls-dev` or similar).

#### When running

> libcurl.so.4: cannot open shared object file: No such file or directory

That means nodegit cannot find the libcurl shared library. 