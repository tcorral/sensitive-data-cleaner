#!/usr/bin/env node
import * as commandLineArgs from 'command-line-args';
import { writeFileSync } from 'fs';
import { sync } from 'glob';
import { omit, omitBy } from 'lodash';
import { processFiles, WriteFileSync } from './index';

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
    {
        name: 'pattern',
        alias: 'p',
        type: String,
        lazyMultiple: true,
        defaultOption: true,
        defaultValue: [],
    },
    {
        name: 'verbose',
        alias: 'v',
        type: Boolean,
        defaultValue: false,
    }
];

const cliArgs = commandLineArgs.default(optionDefinitions, {});

const patterns: string[] = cliArgs.pattern;

processFiles(patterns, cliArgs.verbose, require, process.cwd(), omit, omitBy, sync, writeFileSync as WriteFileSync);