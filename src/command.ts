'use strict';

import * as path from 'path';
import { exec, ExecOptions } from 'child_process';
import * as constants from './constants';
import * as utils from './utils';

interface CommandExecOptions {
    cmd: string;
    cwd?: boolean;
}

/**
 * Command class
 */
export class Command {
    rootPath: string;
    rcPath: string;
    constructor(rootPath: string) {
        this.rootPath = rootPath;
        this.rcPath = path.join(rootPath, `${constants.direnv.rc}`);
    }
    // Private methods
    private exec(options: CommandExecOptions): Thenable<string> {
        let direnvCmd = [constants.direnv.cmd, options.cmd].join(' ');
        let execOptions: ExecOptions = {};
        if (options.cwd == null || options.cwd) {
            execOptions.cwd = this.rootPath;
        }
        return new Promise((resolve, reject) => {
            exec(direnvCmd, execOptions, (err, stdout, stderr) => {
                if (err) {
                    err.message = stderr;
                    reject(err);
                } else {
                    resolve(stdout);
                }
            });
        });
    }
    // Public methods
    version = () => this.exec({ cmd: 'version' });
    allow = () => this.exec({ cmd: 'allow' });
    deny = () => this.exec({ cmd: 'deny' });
    exportJSON = () => this.exec({ cmd: 'export json' }).then((o) => o ? JSON.parse(o) : {});
}
