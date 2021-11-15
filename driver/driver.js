'use strict';

const io = require('socket.io-client');
let host = 'http://localhost:3030';
const capsConnection = io.connect(`${host}/caps`);

capsConnection.on('d-pickup', payload => {
    console.log('hi');
    console.log(`DRIVER: picked up ${payload.orderID}`);
    capsConnection.emit('in-transit', payload);
    setTimeout(() => {
        console.log(`DRIVER: delivered ${payload.orderID}`);
        capsConnection.emit('delivered', payload);
    }, 2000);
});
