#!/usr/bin/env node
"use strict";
let path = require('path');
var fs = require('fs');

function readData(){
    const args = require("minimist")(process.argv.slice(2), {
        string: ["file"]
    });
    const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFileAsStream(stream);
}

function processFileAsStream(streamData){
    var targetStream = process.stdout;
    streamData.pipe(targetStream);
}

readData(); // Hello World


/**
 * Instructions to Execute the Script.
 * FileName: prcoessFile.js
 * DataFile: dataFile.js ( contains 'Hello World' )
 * Execute Command: `./processFile.js --file=dataFile.js`
 */
