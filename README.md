# **hapi-rx-sse**

Stream Rxjs Observable values as Server-Sent Events (SSE) using Hapi. 
  
[![Build Status](https://travis-ci.org/kristofsajdak/hapi-rx-sse.svg?branch=master)](https://travis-ci.org/kristofsajdak/hapi-rx-sse)
  
Hapi-rx-sse is a tiny lib which can be used inside a route handler to stream back data as Server Sent Events (SSE). 

Any [RxJs](https://github.com/Reactive-Extensions/RxJS) Observable can be used as a source of events, which allows for interesting composition. 
The source Observable could encapsulate a Kafka, RabbitMQ, Mongodb oplog consumer... or any other thing which is capable of emitting events. 
           
The composable nature of RxJs allows adding additional operators (map, filter, bufferWithTimeOrCount...) to the source Observable, 
so that we can transform the data into the expected SSE payload, and filter / enrich the content in an efficient way.
  
## Installation

```
npm install hapi-rx-sse
```

## How to use

Hapi-rx-sse exposes a single `stream` function which accepts any RxJs Observable and Hapi's req and reply.  

```javascript
hapiRxSSE.stream(createObservable(), req, reply);
```

Simply invoke it within a route handler to stream back the Rxjs Observable values as Server-Sent Events.

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

The emitted values are expected as Objects, any of the following optional properties will be mapped to the wire protocol : event, id, data and comment  
    
For example
  
```javascript
{ 
    event: 'books.insert',
    id: 12345,
    data: '{foo: bar}',
    comment: 'whatever comments you want to provide'   
}
```

will translate into 

```
event: books.insert\r\n
id: 12345\r\n
data: {foo: bar}\r\n
: whatever comments you want to provide\r\n
\r\n
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
 