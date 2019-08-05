# Node

## History & Why
- Node is not a framework but `runtime` environment to execute javascript code.
- Started as high throughput, low latency socket server for network communications. Which started making use of "asynchronous event looping for IO bound communications".
- Threads can be very highly efficient for CPU bound process but threads were not as efficient as CPU when it comes to IO bound process.
- node is NOT for CPU bound tasks ( ex:  video encoding, image manipulation etc )
- Best suitable as middle-wear proxy between front end and backend systems.
- In streams, data are read and written in chunks of size 64Kb, Also it is important to remember `.pipe()` method is only available in readable stream.
- Asynchronous promise handling is great but this process will run until it's finished, there is no cancellation if something bad happens. So we can use `caf` package along with generator to stop the process.


- How node connects to it's environment around it ?
  Node make uses of unix POSIX standards to communicate with it's surrounding environment, this helps node to work with IO ( remember javascript doesn't communicate with IO stream and hence node had to adopt this )

- console.log('text') vs console.error('text')
  In console or terminal (if node) we would see both of them printing without any much difference but in system level console.error('text') is redirected to different output using streams, so using console.error('text') is better while handling error's.



## Pointers
 - In node we refer of `global` object similar to one in browsers like `window` object.
 - `process` is available all over our program
 - `stdout` is one of the three available standard streams, used for output. Example: `process.stdout.write("Hello node")`;
 - By default most IO operations returns low level buffer, hence using console.log on reading file data will output actual low level buffer data. Hence use `process.stdout.write(data)`
 - node focuses on everything to be asynchronous but the start of the script. Hence `require` is synchronous.
 - node's standard signature for callback functions take `error` as first param. i.e `function callback(err, data){ }`.
 - In node, every file we create represents a module. This is achieved by `module` property in node and we can inspect it by `console.log(module)`.
 - While working with files use `path` built in node module which gives useful information about the file. i.e `root, directory, name of the file, extension, file without extension`.
 - If we are interested in running operating system then use `os` module from node.
 - While working with `events` make sure to register the `listener` before declaring `emit` method.
 - `http.createServer()` returns an object which will extends `EventEmitter` class so we can make use of listening and emitting events once the server is created.

## Inner Parts
- node is error first pattern and hence it will always insert error object for first placeholder and data as second placeholder in `callback` (i.e auto run function).
- node uses `libuv` C/C++ library to communicate with computer internals. So this makes the node independent of any operating system and/or machine.
- Mostly `libuv` process all IO related request asynchronously such as `http`, `socket` related. But when it comes to file system it makes use of `threads` to communicate with the computer internals instead of depending on the computer kernel.
- `libuv` has 4 dedicated thread to use but it is designed to use `asynchronous` event handling is all most all situations.
- `POSIX` is used internally by `libuv` to talk to computer networks.
- javascript is `single` threaded and code execution and event loop handling via `call stack` is handled in the same single thread.
- node returns file data in buffer format ( bunch of `1` & `0`) as buffers are used better for storing and managing data.
- `streams` are used to process the file in batches and `callback` queue mechanism to process the returned batch data in order.
- By default batch size is `64KB` but user can always customize.
- `EVENT LOOP` checks on `callback queue` whenever the call stack is done executing the current and pending global function. This constant check is achieved by event loop provided by `libuv`.
- Call Stack will be managed by javascript which keeps track of what function is being run and where it was ran from. Whenever the function needs to be run, it add to the `Call Stack`. However, if any functions delayed from running ( i.e ran from node automatically as callback ) are added to the `Callback Queue` when the background node task has completed. `Event loop`, picks up the function to be ran from the `Callback Queue`. Similar callback queue is actually maintained by `WebApi` for browsers, in our case it's done by Node.
- Order of dequeuing `1. Network Queue`, `2. Timer Queue`, `3. I/O Callback Queue`, `4. Check Queue` and `5. Close Queue`.
- setTimeout will go to Timer Queue, setImmediate will go to Check Queue. All node callbacks ( auto run functions ) will go to `IO Callback Queue`. process & promises will fall into `Network Queue`. 



## Core Principals

### 1.0 Global Object
In node we have global object similar to one like `window` ( i.e global scope in browsers ) for all the browsers. Below are the methods available in global object.
```javascript
setTimeout();
clearTimeout();

setInterval();
clearInterval();
```
Also it is important to know about `modular` system in node is different than what we are used to in browsers. Example: If we define global object in browsers it will be available in window object. However it's not the same case in node ( i.e is not available in global object ).
```javascript
// run this in browsers
var message = "hello";
console.log(window.message); // hello

// run this in node
var message = "hello";
console.log(global.message); // undefined
```
so whatever is defined the node file is only available in that file and not polluted to global object.

### Being Module
Lets look into `module` in node i.e by doing console.log(module). We are particularly interested in `exports` object which exposes the module to outside world. Important to remember every file is wrapped with a `iffi` which has 4 function parameters such as `exports, module, require, __filename, __dirname`.This helps in exporting and importing the file functions we are about to see.
```javascript
// module property
Module {
  id: '',
  path: 'path_to_file',
  exports: {}, // <-- this help us expose our secluded module to outside world
  parent: null,
  filename: 'path to file',
  ...
}
```

#### 1.0 Example exposing the function
```javascript
//filename: greetFile.js
var message = "Hey there";
function greet(message){
  console.log(message);
}

module.exports.greet = greet; // now this is exposed to global node object
```
Okay, now we need to import this in some other files than defined file. We make use of `require`.
```javascript
const greeting = require('./greetFile');

const test = greeting.greet("I'm here");
console.log(test); // I'm here
```

## Quick Pointers

### 1.0 Making Executable
Typically we will execute our node script with command like `node fileName.js`, however if we make this file as an executable then we don't really need to pass in the `node`, below is the step to do that.
```shell
chmod u+x fileName.js

# now we can execute the script by doing so
./fileName.js
```

### 2.0 Define as node file
Usually if we are writing shell script we define `shebang` at the top of the file to let the compiler know this is of type `shell` script i.e `#!/bin/bash  `. Similarly, phython, perl, list and even node has it's own
```shell
#!/usr/bin/env node
```
The main takeaway from this above shebang is, instead of finding installed node path for this script to use we are letting the environment do the job for us. Hence we are pointing to `env` and then asking env to look for `node`.

### 3.0 Handle Arguments
we could capture all the passed arguments from the `argv` command but it will send array of commands which we need to process. Let us look into how `argv` works, if we use `process.argv` then it will return installed node path and path to file in an array. If we do `process.argv.slice(2)` it would slice first two elements and returns the third passed argument. The best way to handle this is using `minimist` package which will parse the array of objects and returns objects.

#### 3.1 Processing Args
if we add code as mentioned below to `processArgs.js` and execute by running `node processArgs.js` then we will see commented output.
```javascript
console.log(process.argv.slice(2));  // [ '--hello=node', '-hi101' ]
var args = require("minimist")(process.argv.slice(2));
console.log(args) // { _: [], hello: 'node', h: 'i101' }
```

#### 3.2 Customize Args
If we want to enforce some customization based on passed argument name then we could pass in object of key value pair as second argument to `minimist`. Let us look into an example,
```javascript
var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help"],
  string: ["name"]
});

console.log(args); //{ _: [], hello: true, name: '' }
```
ran the file by doing `./fileName.js --hello=node --name`.

#### 3.3 Path
`path` is not package which we can use to find the path of the file or executing command. Below example is continuation of the above,
```javascript
// args are derived from above minimist handling

let path = require('path');
let filepath = path.resolve(args.file);
console.log(filepath); // path of the file
```
Similarly if we make use of in build `__dirname` it will print the absolute path to the current directory.

#### 3.4 File Access
`fs` node package can be used to read and write from the file. we make use of synchronous process `readFileSync` or asynchronous prcess `readFile` and parsed `args` from minimist package.

##### 3.4.1 Synchronous File Processing:
```javascript
// fileName: processFile.js
var fs = require('fs');

var file_args = require("minimist")(process.argv.slice(2), {string: ["file"]});
const filepath = path.resolve(file_args.file);

function processFile(filepath){
    var content = fs.readFileSync(filepath);
    process.stdout.write(content); // string buffer to print the data
    console.log(content); // this will print actual low level buffer
}

processFile(filepath)
```
we can run the script by doing below, where `hello.txt` is the file to be read.
```shell
./processFile.js --file=files/hello.txt
```
we can make the `readFileSync` handle the buffering for us by using second parameter as `utf8` encoding. Then the line of code becomes like `var content = fs.readFileSync(filepath, 'utf8');`.

##### 3.4.2 Asynchronous File Processing     

It is okay to read the file synchronously but asynchronous is always a better option as node is built for asynchronous processing. So we will convert above synchronous code to asynchronous by changing `readFileSync` to `readFile` and handling the `callback` instead pf expecting the content.
```javascript
var fs = require('fs');

var file_args = require("minimist")(process.argv.slice(2), {string: ["file"]});
const filepath = path.resolve(file_args.file);

function processFile(filepath){
    fs.readFile(filepath, function onContets(err, content){
        if(err){
            error(err.toString())
        }else{
            process.stdout.write(content)
        }
    });
}

processFile(filepath);
```
##### 3.4.3 Read File as Standard input

If we are interested in reading the file content from the command line and run the node script along with that then we can do that by installing another node package called `get-stdin`. This returns a promise so the response should be handled using then. i.e
```javascript
var getStdin = require('get-stdin');

// handling reading files
getStdin().then(handleFileContentFunction).catch(errorFunction);

// handleFileContentFunction - should take care of handling the content
// errorFunction - should handle error logic.
```

##### 3.4.4 Reading ENV variables
```javascript
// Syntax: process.env.NAME_VARIABLE

var BASE_PATH = path.resolve(
    // if BASE_PATH found use it or use the current directory
    process.env.BASE_PATH || __dirname
);
```
we can test this by executing `BASE_PATH='/testfolder/' ./processFile.js` or `./processFile.js`.

## Streams

#### 1.0 Input & Output Stream:
Though node is meant for IO operations, in case of reading and writing from the file is memory consuming. Because when we read or write to/from the file we do it as a string, not as chunks which need space in memory. Read more about stream [here](https://github.com/substack/stream-handbook).
      Making use of streams to read the data from the file would like this, btw we can execute the file by
doing `./processFile.js --file=dataFile.txt`
```javascript
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
    streamData.pipe(targetStream); // inputstream.pipe(outputstream)
}

readData();
```
Here is the complete [example](https://github.com/citta-lab/node/blob/master/examples/streams/readFileWithStream.js) of the above snippet.

#### 2.0 Transform Input to Screen (using Stream):
If we want to transform the data to something else then we can use `Transform` from stream on chunks as mentioned below,
```javascript
function processFileAsStream(streamData){
    var outputStream = streamData;

    var upperStream = new Transform({
        transform(chunckData, encode, callback){
            this.push(chunckData.toString().toUpperCase());
            callback(); // letting stream know it's processed
        }
    })

    outputStream = outputStream.pipe(upperStream);
    var targetStream = process.stdout;
    outputStream.pipe(targetStream);
}
```
complete runnable example is [here](https://github.com/citta-lab/node/blob/master/examples/streams/transformWithStream.js).

#### 3.0 Writing to File (using Stream)
Instead of writing the transformed stream data to output, we can write it to the file as a stream using `createWriteStream` method from `fs`.
```javascript
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
```
complete example is [here](https://github.com/citta-lab/node/blob/master/examples/streams/transformSteamToFile.js)

#### 4.0 Unzip & Zip (using Stream)
Using node built zip and unzip process for stream. This require a package called `zlip`.
```javascript
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

    //need to zip it before outputting the file
    let zipStream = zlib.createGzip();
    outputStream = outputStream.pipe(zipStream);
    OUTPUTFILE = `${OUTPUTFILE}.gz`;

    var targetStream = fs.createWriteStream(OUTPUTFILE);
    outputStream.pipe(targetStream);
}
```
here is the complete [example]() of gzipping.
