# Node

## History & Why
- Started as high throughput, low latency socket server for network communications. Which started making use of "asynchronous event looping for IO bound communications".
- Threads can be very highly efficient for CPU bound process but threads were not as efficient as CPU when it comes to IO bound process.
- node is NOT for CPU bound tasks
- Best suitable as middle-wear proxy between front end and backend systems.


- How node connects to it's environment around it ?
  Node make uses of unix POSIX standards to communicate with it's surrounding environment, this helps node to work with IO ( remember javascript doesn't communicate with IO stream and hence node had to adopt this )

- console.log('text') vs console.error('text')
  In console or terminal (if node) we would see both of them printing without any much difference but in system level console.error('text') is redirected to different output using streams, so using console.error('text') is better while handling error's.



## Pointers
 - `process` is available all over our program
 - `stdout` is one of the three available standard streams, used for output. Example: `process.stdout.write("Hello node")`;
 - `#!/usr/bin/env node` is same as writing `#!sh` for shell, but in our case we are letting the system figure out to find the node by using `env`.
 - by doing `chmod u+x fileName.js` we can convert node script to executable, so we can run the file by doing `./fileName.js` instead of `node fileName.js`


## Quick Pointers

#### 1.0 Making Executable
Typically we will execute our node script with command like `node fileName.js`, however if we make this file as an executable then we don't really need to pass in the `node`, below is the step to do that.
```shell
chmod u+x fileName.js

# now we can execute the script by doing so
./fileName.js
```

#### 2.0 Define as node file
Usually if we are writing shell script we define `shebang` at the top of the file to let the compiler know this is of type `shell` script i.e `#!/bin/bash  `. Similarly, phython, perl, list and even node has it's own
```shell
#!/usr/bin/env node
```
The main takeaway from this above shebang is, instead of finding installed node path for this script to use we are letting the environment do the job for us. Hence we are pointing to `env` and then asking env to look for `node`.

#### 3.0 Handle Arguments
we could capture all the passed arguments from the `argv` command but it will send array of commands which we need to process. Let us look into how `argv` works, if we use `process.argv` then it will return installed node path and path to file in an array. If we do `process.argv.slice(2)` it would slice first two elements and returns the third passed argument. The best way to handle this is using `minimist` package which will parse the array of objects and returns objects.
if we add code as mentioned below to `processArgs.js` and execute by running `node processArgs.js` then we will see commented output.
```javascript
console.log(process.argv.slice(2));  // [ '--hello=node', '-hi101' ]
var args = require("minimist")(process.argv.slice(2));
console.log(args) // { _: [], hello: 'node', h: 'i101' }
```
