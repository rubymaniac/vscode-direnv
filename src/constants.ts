'use strict';

export const direnv = {
    name: 'Direnv',
    cmd: 'direnv',
    rc: '.envrc'
};

export const vscode = {
    commands: {
        open: 'vscode.open'
    },
    extension: {
        actions: {
            allow: 'Allow',
            revert: 'Revert',
            view: 'View'
        }
    }
};

export const messages = {
    error: (e) => `${direnv.name} error: ` + (e.message || e),
    version: (v) => `${direnv.name} version: ` + v,
    reverted: `${direnv.name}: You are now using the old environment.`,
    assign: {
        success: `${direnv.name}: Your ${direnv.rc} loaded successfully!`,
        warn: `${direnv.name}: Your ${direnv.rc} is blocked! You can view ${direnv.rc} or allow it directly.`,
        allow: `${direnv.name}: Would you like to allow this ${direnv.rc}?`
    },
    rc: {
        changed: `${direnv.name}: Your ${direnv.rc} has changed. Would you like to allow it?`,
        deleted: `${direnv.name}: You deleted the ${direnv.rc}. Would you like to revert to the old environment?`
    }
};
