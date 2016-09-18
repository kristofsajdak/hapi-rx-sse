'use strict';

const Stream = require('stream');

const endl = '\r\n';

module.exports.stream = (sseObservable, req, reply) => {

    const stream = new Stream.PassThrough();
    // force response by sending over an end-line marker, this is particularly useful during tests
    stream.write(`${endl}`);

    reply(stream)
        .type('text/event-stream')
        .header('Cache-Control', 'no-cache')
        .header('Connection', 'keep-alive')
        .header('Content-Encoding', 'identity');

    sseObservable
        .doOnNext((sseObject) => {
            stream.write(stringifyEvent(sseObject));
        })
        .doOnCompleted(()=> {
            // close the response stream on Observable completion
            stream.end();
        })
        .subscribe();

    // this is triggered on when the client issues a req.abort() or when the connection closes
    req.raw.req.on('close', function () {
        stream.end(); // close the response stream
    });

    // stringify the SSE object according to the spec, if the event is not specified the default value of 'message' is set
    function stringifyEvent(sseObject) {
        let str = '';
        sseObject.comment && (str += ': ' + sseObject.comment + endl);
        sseObject.event && (str += 'event: ' + sseObject.event + endl);
        sseObject.data && (str += 'data: ' + sseObject.data + endl);
        sseObject.id && (str += 'id: ' + sseObject.id + endl);
        str += endl;
        return str;
    }

};
