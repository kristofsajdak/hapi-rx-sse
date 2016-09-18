'use strict';

const Hapi = require('hapi');
const Rx = require('rx');
const uuid = require('node-uuid');
const EventSource = require('eventsource');
const chai = require('chai');
const expect = chai.expect;
const hapiRxSSE = require('../');
const request = require('request');

const baseUrl = 'http://localhost:9100';

describe(`stream`, function () {

    afterEach(function () {
        return this.server.stop();
    });

    it('should open and close the response stream', function (done) {
        const sseArray = [];
        this.server = createServer(Rx.Observable.fromArray(sseArray));
        this.server.start((err)=> {
            if (err) throw err;
            request
                .get('http://localhost:9100/events/streaming')
                .on('response', function (response) {
                    response.on('end', ()=> done())
                })
        });
    });

    it('should dispose the source Observable when the request is aborted or connection is closed.', function (done) {
        this.server = createServer(Rx.Observable.create((observer)=> {
            setInterval(()=>observer.onNext({data: 'foobar'}), 200);
            return ()=> done(); // this is invoked when the Observable is disposed.
        }));
        this.server.start((err)=> {
            if (err) throw err;
            request
                .get('http://localhost:9100/events/streaming')
                .on('response', function (response) {
                    response.req.abort();
                });
        })
    });

    it('should stream the Observable event objects according to SSE spec', function (done) {

        const sseArray = [
            {
                comment: '',
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
                comment: '',
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

        this.server = createServer(Rx.Observable.fromArray(sseArray));
        this.server.start();
        const source = new EventSource(baseUrl + '/events/streaming');
        Rx.Observable.fromEvent(source, 'books.insert')
            .bufferWithCount(2)
            .subscribe(
                (events) => {
                    assertEventState(events[0], '1', 'books.insert', 5, 'test title5');
                    assertEventState(events[1], '2', 'books.insert', 6, 'test title6');
                    source.close();
                    done();
                },
                done)

    });
});

function createServer(observable) {
    const server = new Hapi.Server();
    server.connection({port: 9100});
    server.route({
        path: '/events/streaming',
        method: 'GET',
        handler: (req, reply) => {
            hapiRxSSE.stream(observable, req, reply);
        }
    });
    return server;
}

function assertEventState(event, id, type, resId, resAttId) {
    expect(event.lastEventId).to.equal(id);
    expect(event.type).to.equal(type);
    var parsed = JSON.parse(event.data);
    expect(parsed).to.deep.equal({
        id: resId,
        attributes: {
            title: resAttId
        }
    })
}

