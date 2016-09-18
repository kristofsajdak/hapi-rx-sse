# **hapi-rx-sse**

Stream Rxjs Observable values as SSE using Hapi. 
  
[![Build Status](https://travis-ci.org/kristofsajdak/hapi-rx-sse.svg?branch=master)](https://travis-ci.org/kristofsajdak/hapi-rx-sse)
  
Hapi-rx-sse is a tiny lib which can be used inside a route handler to stream out data as Server Sent Events (SSE). 

Any [RxJs](https://github.com/Reactive-Extensions/RxJS) Observable can be used as the source of event data, which allows for interesting composition. 
For example the source Observable could encapsulate a Kafka, RabbitMQ, Redis consumer... or any other thing which is capable of emitting events. 
           
The composable nature of RxJs allows us to add mappers, filters and buffers to the source Observable, 
so that we can transform the data into the expected SSE payload, filter and enrich the content in an efficient way.
  
## Installation

```
npm install hapi-rx-sse
```

## How to use

Hapi-rx-sse exposes a single `stream` function which accepts any RxJs Observable and Hapi's req and reply.  

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

There is a very simple example included which streams out Rxjs Observable events created from a static array.

```
cd example
node index.js
```

open your browser at [http://localhost:9100/events/streaming](http://localhost:9100/events/streaming) to see the output
 
or use curl instead
```
curl http://localhost:9100/events/streaming -v
```
 