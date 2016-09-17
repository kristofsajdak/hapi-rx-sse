const Hapi = require('hapi');
const Rx = require('rx');
const hapiRxSSE = require('../');

const sseArray = [
    {
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
    }
];

const server = new Hapi.Server();
server.connection({port: 9100});

server.route({
    path: '/events/streaming',
    method: 'GET',
    handler: (req, reply) => {
        const sseObservable = Rx.Observable.fromArray(sseArray);
        hapiRxSSE.stream(sseObservable, req, reply);
    }
});

module.exports = server;
