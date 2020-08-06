'use strict';

import * as vscode from 'vscode';
import * as utils from './utils';
import * as constants from './constants';
import { Command } from './command';

let oldEnvDiff = {};
let command = new Command(vscode.workspace.rootPath);
let watcher = vscode.workspace.createFileSystemWatcher(command.rcPath, true);
let displayError = (e) =>
    vscode.window.showErrorMessage(constants.messages.error(e));
let handleError = (t: Thenable<any>) => t.then(undefined, displayError);
let version = () =>
    vscode.window.showInformationMessage(constants.messages.version(command.version()));
let revertFromOption = (option) => {
    if (option === constants.vscode.extension.actions.revert) {
        utils.assign(process.env, oldEnvDiff);
        oldEnvDiff = {};
        vscode.window.showInformationMessage(constants.messages.reverted);
    }
};
let assignEnvDiff = async (options: { showSuccess: boolean }) => {
    try {
        let envDiff = command.exportJSON()
        Object.keys(envDiff).forEach((key) => {
            if (key.indexOf('DIRENV_') === -1 && oldEnvDiff[key] !== envDiff[key]) {
                oldEnvDiff[key] = process.env[key];
            }
        });
        utils.assign(process.env, envDiff);
        if (options.showSuccess) {
            return vscode.window.showInformationMessage(constants.messages.assign.success);
        }
    } catch (err) {
        let optionP;
        if (err.message.indexOf(`${constants.direnv.rc} is blocked`) !== -1) {
            optionP = vscode.window.showWarningMessage(constants.messages.assign.warn,
                constants.vscode.extension.actions.allow, constants.vscode.extension.actions.view);
        } else {
            optionP = displayError(err);
        }
        let option = await optionP
        if (option === constants.vscode.extension.actions.allow) {
            return allow();
        } else if (option === constants.vscode.extension.actions.view) {
            return viewThenAllow();
        }
    }
};
let allow = () => {
    try {
        command.allow();
        return assignEnvDiff({ showSuccess: true });
    } catch (err) {
        if (err.message.indexOf(`${constants.direnv.rc} file not found`) !== -1) {
            return vscode.commands.executeCommand(constants.vscode.commands.open, vscode.Uri.file(command.rcPath));
        } else {
            return displayError(err);
        }
    };
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

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('direnv.version', version));
    context.subscriptions.push(vscode.commands.registerCommand('direnv.view', view));
    context.subscriptions.push(vscode.commands.registerCommand('direnv.allow', allow));
    assignEnvDiff({ showSuccess: false });
}

export function deactivate() {
}
