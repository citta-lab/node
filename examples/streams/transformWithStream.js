#!/usr/bin/env node
"use strict";
let path = require('path');
var fs = require('fs');
var Transform = require('stream').Transform;

function readData(){
    const args = require("minimist")(process.argv.slice(2), {
        string: ["file"]
    });
    const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFileAsStream(stream);
}

function processFileAsStream(streamData){
    var outputStream = streamData;

    var upperStream = new Transform({
        transform(chunckData, encode, callback){
            this.push(chunckData.toString().toUpperCase());
            callback(); // letting stream know it's processed
        }
    })

    outputStream = outputStream.pipe(upperStream); // this will keep adding input data to output
    var targetStream = process.stdout;
    outputStream.pipe(targetStream); // finally all gathered input is written to output console 
}

readData(); // Hello World


/**
 * Instructions to Execute the Script.
 * FileName: prcoessFile.js
 * DataFile: dataFile.js ( contains 'Hello World' )
 * Execute Command: `./processFile.js --file=dataFile.js`
 */
