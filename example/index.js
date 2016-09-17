const Exiting = require('exiting');

const server = require('./sseArrayObservable');
new Exiting.Manager(server).start((err)=> {
    if (err) throw err;
    console.log('Server started at:', server.info.uri)
});