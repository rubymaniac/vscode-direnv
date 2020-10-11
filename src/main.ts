'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';
import * as constants from './constants';
import { Command } from './command';

let restartExtensionHost= () => vscode.commands.executeCommand("workbench.action.restartExtensionHost")
let command = new Command(vscode.workspace.rootPath);
let watcher = vscode.workspace.createFileSystemWatcher(command.rcPath, true);
let displayError = (e) =>
    vscode.window.showErrorMessage(constants.messages.error(e));
let handleError = (t: Thenable<any>) => t.then(undefined, displayError);
let version = () =>
    command.version().then(v => vscode.window.showInformationMessage(constants.messages.version(v)), displayError);
let revertFromOption = (option) => {
    if (option === constants.vscode.extension.actions.revert) {
        restartExtensionHost()
    }
};

let initialize: () => Thenable<number> = () => {
    try {
        const envDiff = command.exportJSONSync()
        console.log("loaded direnv diff:", envDiff)
        return Promise.resolve(utils.assign(process.env, envDiff))
    } catch(err) {
        return Promise.reject<number>(err)
    }
}

let postInitialize = (result: Thenable<number>, options: { showSuccess: boolean }) => {
    return result.then(() => {
        if (options.showSuccess) {
            return vscode.window.showInformationMessage(constants.messages.assign.success);
        }
    }, (err) => {
        if (err.message.indexOf(`${constants.direnv.rc} is blocked`) !== -1) {
            return vscode.window.showWarningMessage(constants.messages.assign.warn,
                constants.vscode.extension.actions.allow, constants.vscode.extension.actions.view
            ).then((option) => {
                if (option === constants.vscode.extension.actions.allow) {
                    return allow();
                } else if (option === constants.vscode.extension.actions.view) {
                    return viewThenAllow();
                }
            });
        } else {
            return displayError(err);
        }
    })
}

let reinitialize = (options: { showSuccess: boolean }) => {
    const result = initialize()
    result.then((changes) => {
        if (changes > 0) {
            postInitialize(result, options).then(() => restartExtensionHost())
        } else {
            return postInitialize(result, options)
        }
    })
};

let allow = () => {
    return command.allow().then(() => reinitialize({ showSuccess: true }), (err) => {
        if (err.message.indexOf(`${constants.direnv.rc} file not found`) !== -1) {
            return vscode.commands.executeCommand(constants.vscode.commands.open, vscode.Uri.file(command.rcPath));
        } else {
            displayError(err);
        }
    });
};
let allowFromOption = (option) => {
    if (option === constants.vscode.extension.actions.allow) {
        return allow();
    }
};
let view = () =>
    handleError(vscode.commands.executeCommand(constants.vscode.commands.open, vscode.Uri.file(command.rcPath)));
let viewThenAllow = () => view().then(() =>
    vscode.window.showInformationMessage(constants.messages.assign.allow,
        constants.vscode.extension.actions.allow)).then(allowFromOption);

watcher.onDidChange((e) => vscode.window.showWarningMessage(constants.messages.rc.changed,
    constants.vscode.extension.actions.allow).then(allowFromOption));
watcher.onDidDelete((e) => vscode.window.showWarningMessage(constants.messages.rc.deleted,
    constants.vscode.extension.actions.revert).then(revertFromOption));

// NOTE: we apply synchronously on extension import to ensure it takes effect for all extensions.
// This means plugin activation state isn't actually respected.
let initializeResult = initialize()

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('direnv.version', version));
    context.subscriptions.push(vscode.commands.registerCommand('direnv.view', view));
    context.subscriptions.push(vscode.commands.registerCommand('direnv.allow', allow));
    postInitialize(initializeResult, { showSuccess: false })
}

export function deactivate() {
}
