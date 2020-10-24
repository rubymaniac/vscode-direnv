'use strict';

export function assign(destination: any, ...sources: any[]): number {
    let changes = 0
    sources.forEach(source => Object.keys(source).forEach((key) => {
        if (source[key] != destination[key]) {
            changes += 1
            if (source[key] == null) {
                delete destination[key]
            } else {
                destination[key] = source[key]
            }
        }
    }));
    return changes
}
