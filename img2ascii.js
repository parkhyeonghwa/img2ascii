#!/usr/bin/env node
'use strict';

const gm = require('gm');
const pictureTube = require('picture-tube');
const argv = require('yargs')
    .usage('Usage: $0 [url|file] --cols [num] --ratio [num]')
    .option('c', {
        alias: 'cols',
        default: 80,
        describe: 'how many cols in terminal'
    })
    .option('r', {
        alias: 'ratio',
        default: 1,
        describe: 'ratio try 0.5 to flatten image\n and 2 to lengthen iamge'
    })
    .demand(1)
    .argv;

const isUrl = (str) => str.match('http|0.0|localhost');

const pipeIn = (isUrl(argv._[0]) ?
    require('request-promise')(argv._[0]) :
    require('fs').createReadStream(argv._[0]))
    .on('error', err => {throw new Error(err)});

gm(pipeIn)
    // magic fix of picture tube ratios
    .resizeExact(300 * 1.2, 300 * argv.ratio)
    .stream('png')
    .pipe(pictureTube({cols: argv.cols}))
    .pipe(process.stdout);
