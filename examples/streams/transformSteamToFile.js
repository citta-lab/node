#!/usr/bin/env node
"use strict";
let path = require('path');
var fs = require('fs');
var Transform = require('stream').Transform;

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

function readData(){
    const args = require("minimist")(process.argv.slice(2), {
        string: ["file"]
    });

    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFileAsStream(stream, BASE_PATH);
}

function processFileAsStream(streamData){
    var outputStream = streamData;
    var OUTPUTFILE = path.join(BASE_PATH, 'output_file.txt')

    var upperStream = new Transform({
        transform(chunckData, encode, callback){
            this.push(chunckData.toString().toUpperCase());
            callback(); // letting stream know it's processed
        }
    })

    outputStream = outputStream.pipe(upperStream);
    var targetStream = fs.createWriteStream(OUTPUTFILE);
    outputStream.pipe(targetStream);
}

readData(); // HELLO WORLD, MAHESH


/**
 * Instructions to Execute the Script.
 * FileName: prcoessFile.js
 * DataFile: dataFile.js ( contains 'Hello World' )
 * Execute Command: `./processFile.js --file=dataFile.js`
 */
