'use strict';

import * as path from 'path';
import { exec, execSync, ExecOptionsWithStringEncoding } from 'child_process';
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
    private execAsync(options: CommandExecOptions): Thenable<string> {
        return <Thenable<string>>this.exec(false, options)
    }

    private execSync(options: CommandExecOptions): string {
        return <string>this.exec(true, options)
    }

    private exec(sync: boolean, options: CommandExecOptions): Thenable<string> | string {
        let direnvCmd = [constants.direnv.cmd, options.cmd].join(' ');
        let execOptions: ExecOptionsWithStringEncoding = { encoding: 'utf8' };
        if (options.cwd == null || options.cwd) {
            execOptions.cwd = this.rootPath;
        }
        if (sync) {
            console.log("NOTE: executing command synchronously", direnvCmd)
            return execSync(direnvCmd, execOptions);
        } else {
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
    }
    // Public methods
    version = () => this.execAsync({ cmd: 'version' });
    allow = () => this.execAsync({ cmd: 'allow' });
    deny = () => this.execAsync({ cmd: 'deny' });
    exportJSONSync = () => {
        const o = this.execSync({ cmd: 'export json' })
        return o ? JSON.parse(o) : {}
    };
}
