'use strict';

const io = require('socket.io-client');
let host = 'http://localhost:3030';
const capsConnection = io.connect(`${host}/caps`);

capsConnection.on('pickup', payload => {
    console.log('new pickup');
    setTimeout(()=>{
        console.log(`DRIVER: picked up ${payload.payload.orderID}`);
    capsConnection.emit('in-transit', payload.payload);
    }, 2000);
    setTimeout(() => {
        console.log(`DRIVER: delivered ${payload.payload.orderID}`);
        capsConnection.emit('delivered', payload);
    }, 4000);
});

capsConnection.emit('getAll', 'driver');
