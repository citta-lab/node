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



 process: Available all over our program
 stdout: One of the three available method to communicate.
