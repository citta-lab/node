#!/usr/bin/env node
"use strict";
let path = require('path');
var file_args = require("minimist")(process.argv.slice(2), {string: ["file"]});

function readData(){
    const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFileAsStream(stream);
}

function processFileAsStream(streamData){
    var targetStream = process.stdout;
    streamData.pipe(targetStream);
}

readData();
