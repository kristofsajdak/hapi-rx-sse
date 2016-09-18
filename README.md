# **hapi-rx-sse**

Stream Rxjs Observable values as Server-Sent Events (SSE) using Hapi. 
  
[![Build Status](https://travis-ci.org/kristofsajdak/hapi-rx-sse.svg?branch=master)](https://travis-ci.org/kristofsajdak/hapi-rx-sse)
  
Hapi-rx-sse is a tiny lib which can be used inside a route handler to stream back data as Server Sent Events (SSE). 

Any [RxJs](https://github.com/Reactive-Extensions/RxJS) Observable can be used as a source of events, which allows for interesting composition. 
The source Observable can encapsulate a Kafka, RabbitMQ, Mongodb oplog consumer... or any other thing which is capable of emitting events. 
           
The composable nature of RxJs allows adding additional operators (map, filter, bufferWithTimeOrCount...) to the source Observable, 
so that data can be transformed into the expected payload, and can be filtered / enriched in an efficient way.

Check out the [Examples](#Examples) section below for some real-world examples. 
  
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

The emitted values are expected to be Objects, any of the following optional properties will be mapped to the wire protocol : `event`, `id`, `data` and `comment`  
    
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
    

## Examples

The examples are located in [hapi-rx-sse-examples](https://github.com/kristofsajdak/hapi-rx-sse-examples)

- [kafka-sse-filter](https://github.com/kristofsajdak/hapi-rx-sse-examples/tree/master/kafka-sse-filter): Hapi app which exposes an endpoint, defined by a route which composes a Kafka Observable ( [rx-no-kafka](https://github.com/kristofsajdak/rx-no-kafka) ) with hapi-rx-sse. 
Supports both query filter parameters and the Last-Event-Id.
- ... more coming soon
