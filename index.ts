import { IOptions } from 'glob';
import { join } from 'path';
import { LoDashStatic } from 'lodash';

export type WriteFileSync = (path: string, data: string, options: { encoding: string }) =>  void;
export type Sync = (pattern: string, options?: IOptions | undefined) => string[];

const packageJSONRegExReplacement = /\/package\.json$/g;

export const processFiles = (patterns: string[], verbose: boolean, require: (id: string) => any, cwd: string, omit: LoDashStatic['omit'], omitBy: LoDashStatic['omitBy'] , sync: Sync, writeFileSync: WriteFileSync) => {
    if (patterns.length === 0) {
        throw new Error('No pattern has been provided. Please use --pattern xxxx to add at least one.');
    }

    if (verbose) {
        console.log('Finding package.json files');
    }

    const startTime = Date.now();

    const packageFiles = patterns
                            .map((pattern) => {
                                const noPackageJsonPattern = pattern.replace(packageJSONRegExReplacement, '');
                                if (verbose) {
                                    console.log(noPackageJsonPattern + '/package.json');
                                }
                                // This has been added to make sure it's only used across package.json files only.
                                return sync(noPackageJsonPattern + '/package.json', { cwd });
                            })
                            .reduce((prev, files) => prev.concat(files));

    const filesFoundLength = packageFiles.length;

    if (verbose) {
        console.log('Starting stripping process');
    }

    packageFiles.forEach((filepath: string, index: number) => {
        const path = join(cwd, filepath);
        if (verbose) {
            console.log(`Loading file ${path} - ${index + 1} of ${filesFoundLength}`);
        }
        try {
            const pkgJson = require(path);
            if (verbose) {
                console.log('Original content', pkgJson);
            }
            const noUnderscorePropertiesJson = omitBy(pkgJson, (value: string, key: string) => key.startsWith('_'));
            if (verbose) {
                console.log('No underscore properties object:', noUnderscorePropertiesJson);
            }
            const toStripPkgJson = omit(noUnderscorePropertiesJson, ['author', 'publishConfig', 'rights']);
            if (verbose) {
                console.log('Stripped object:', toStripPkgJson);
            }
            const newContent = JSON.stringify(toStripPkgJson, undefined, '    ');
            if (verbose) {
                console.log('Stripping underscore prefixed properties from package.json');
            }
            writeFileSync(path, newContent, { encoding: 'utf8'});
            if (verbose) {
                console.log(`File ${path} is ready`);
            }
        } catch (er) {
            if (verbose) {
                console.error(`${filepath} cannot be found or file has parsing issues.`);
            }
        }

    });

    if (verbose) {
        console.log('Finishing stripping process');
    }

    console.log(`Sensitive data has been cleaned.
    ${filesFoundLength} files have been affected and processing them took: ${(Date.now() - startTime) / 1000} seconds`);
};
