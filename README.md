# **hapi-rx-sse**

Stream Rxjs Observable values over SSE using Hapi. 
  
[![Build Status](https://travis-ci.org/kristofsajdak/hapi-rx-sse.svg?branch=master)](https://travis-ci.org/kristofsajdak/hapi-rx-sse)
  
This tiny lib takes care of setting the appropriate Content-Type and Response headers, 
and streams back [RxJs](https://github.com/Reactive-Extensions/RxJS) Observable values to the client with the correct SSE payload format.
  
## Installation

```
npm install hapi-rx-sse
```

## How to use

Hapi-rx-sse is a single function which accepts any RxJs Observable and Hapi's req and reply.  

```javascript
hapiRxSSE.stream(createObservable(), req, reply);
```

Simply invoke it within a route handler to stream the Rxjs Observable values over SSE

```javascript
server.route({
    path: '/events/streaming',
    method: 'GET',
    handler: (req, reply) => { 
        hapiRxSSE.stream(createObservable(), req, reply);
    }
});

function createObservable() {
  // ... 
}
```

## Example 

There is a very simple example included which outputs an Rxjs Observable created from a static array.

```
cd example
node index.js
```

open your browser at (http://localhost:9100/events/streaming)[http://localhost:9100/events/streaming] to see the output
 
or use curl instead
```
curl http://localhost:9100/events/streaming -v
```
 