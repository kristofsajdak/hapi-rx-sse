'use strict';

const Hapi = require('hapi');
const Rx = require('rx');
const uuid = require('node-uuid');
const EventSource = require('eventsource');
const chai = require('chai');
const expect = chai.expect;
const hapiRxSSE = require('../');

const baseUrl = 'http://localhost:9100';

describe('Given a Hapi server ' +
    'with a route handler using hapi-rx-sse to broadcast objects over SSE', function () {

        beforeEach(function () {

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

            const server = this.server = new Hapi.Server();
            server.connection({ port: 9100 });

            return server.start()
                .then(() => {
                    server.route({
                        path: '/events/streaming',
                        method: 'GET',
                        handler: (req, reply) => {
                            const sseObservable = Rx.Observable.fromArray(sseArray);
                            hapiRxSSE.stream(sseObservable, req, reply);
                        }
                    });

                    return server
                });

        });

        afterEach(function () {
            return this.server.stop();
        });

        describe('When an EventSource is created', function () {

            beforeEach(function () {
                this.source = new EventSource(baseUrl + '/events/streaming');
            });

            it('Then it should receive the broadcasted objects', function (done) {

                Rx.Observable.fromEvent(this.source, 'books.insert')
                    .bufferWithCount(2)
                    .subscribe(
                    (events) => {
                        assertEventState(events[0], '1', 'books.insert', 5, 'test title5');
                        assertEventState(events[1], '2', 'books.insert', 6, 'test title6');
                        this.source.close();
                        done();
                    },
                    done)

            })
        });
    });

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

