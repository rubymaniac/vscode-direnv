'use strict';

import * as path from 'path';
import { execSync, ExecOptions } from 'child_process';
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
    direnvExe: any;
    constructor(rootPath: string) {
        this.rootPath = rootPath;
        this.rcPath = path.join(rootPath, `${constants.direnv.rc}`);
    }
    // Private methods
    private exec(options: CommandExecOptions): string {
        let direnvCmd = [constants.direnv.cmd, options.cmd].join(' ');
        let execOptions: ExecOptions = {};
        if (options.cwd == null || options.cwd) {
            execOptions.cwd = this.rootPath;
        }
        let result = execSync(direnvCmd, execOptions);
        return result.toString();
    }
    // Public methods
    version = () => this.exec({ cmd: 'version' });
    allow = () => this.exec({ cmd: 'allow' });
    deny = () => this.exec({ cmd: 'deny' });
    exportJSON = () => {
        let o = this.exec({ cmd: 'export json' });
        return o ? JSON.parse(o) : {};
    }
}
