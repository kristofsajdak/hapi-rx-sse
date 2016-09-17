# **hapi-rx-sse**

Stream Rxjs Observable values over SSE using Hapi. 

This tiny lib takes care of setting the appropriate Content-Type and Response headers, 
and streams back [RxJs](https://github.com/Reactive-Extensions/RxJS) Observable values to the client in the stringified event payload format.
  
## Installation

```
npm install hapi-rx-sse
```

## Example

```javascript

const hapiRxSSE = require('hapi-rx-sse');

const sseObjects = [{
    id: '1',
    event: 'books.insert',
    data: JSON.stringify({
        id: 5,
        attributes: {
            title: 'test title5'
        }
    })
},
{
    id: '2',
    event: 'books.insert',
    data: JSON.stringify({
        id: 6,
        attributes: {
            title: 'test title6'
        }
    })
}]
 
//...   
 
server.route({
    path: '/events/streaming',
    method: 'GET',
    handler: (req, reply) => {
        const observable = Rx.Observable.fromArray(sseObjects);
        hapiRxSSE.stream(observable, req, reply);
    }
});
```