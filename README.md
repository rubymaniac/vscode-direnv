# [Direnv](https://github.com/direnv/direnv) for Visual Studio Code

This extension adds support for direnv to VS Code, including:

* Auto-load the environment if the .envrc file is allowed
* Prompt to allow the .envrc if it is not when VS Code opens
* View / Allow the .envrc via commands
* Auto-detect .envrc when it is created
* Auto-detect changes to .envrc
* Auto-detect deletion of .envrc and prompt to revert your environment

## Prerequisites

This extension needs direnv installed to work. Please refer [here](https://github.com/direnv/direnv#install) for installation instructions.

## Install

Via Quick Open:

1. [Download](https://code.visualstudio.com/download), install and open VS Code 
2. Press `cmd+p` to open the Quick Open dialog
3. Type `ext install direnv`
4. Click the *Install* button, then the *Enable* button

Via the Extensions tab:

1. Click the extensions tab or press `cmd+shift+x`
2. Search for *direnv*
3. Click the *Install* button, then the *Enable* button

Via the command line:

1. Open a command-line prompt
2. Run `code --install-extension Rubymaniac.vscode-direnv`

## Usage

The following describes the usage of this extension that is automatically enabled each time you open up VS Code.

### Automation

* If you have a `.envrc` file on the workspace root it will try to load it to the environment. If you haven't allowed it yet then it will prompt you to do so.
* If you have no `.envrc` and you try to view it or allow it you get a prompt to create it.
* If you edit and save the `.envrc` it will prompt you to allow it.
* If you delete the `.envrc` it will prompt you to revert the environment.

### Commands

In order to run a command press `cmd+shift+p` to view the Command Palette. There type:

* `direnv allow` to allow and load the current `.envrc`
* `direnv view` to view your `.envrc` and make changes
* `direnv version` to view the current `direnv` version

## Contribute

For any bugs and feature requests please open an issue. For code contributions please create a pull request. Enjoy!  

## LICENSE

MIT License

Copyright (c) rubymaniac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.