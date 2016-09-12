'use strict';

const Stream = require('stream');

const endl = '\r\n';

module.exports.stream = (sseObservable, req, reply) => {

    const stream = new Stream.PassThrough();
    stream.write('');

    reply(stream)
        .type('text/event-stream')
        .header('Cache-Control', 'no-cache')
        .header('Connection', 'keep-alive')
        .header('Content-Encoding', 'identity');

    var subscription = sseObservable
        .subscribe(
            (sseObject) => {
                const stringifiedSSEPart = stringifyEvent(sseObject);
                stream.write(stringifiedSSEPart)
            },
            (err) => {
                console.error(err.stack);
                end()
            });

    // this is triggered on when the client issues a req.abort() or when the connection closes
    req.raw.req.on('close', function () {
        end()
    });

    function end() {
        subscription.dispose();
        stream.end();
    }

    function stringifyEvent(sseObject) {
        let str = '';
        if (sseObject.event) {
            str += 'event: ' + sseObject.event + endl
        } else {
            str += 'event: message';
        }
        sseObject.data && (str += 'data: ' + sseObject.data + endl);
        sseObject.id && (str += 'id: ' + sseObject.id + endl);
        str += endl;
        return str;
    }

};
