'use strict';

require('dotenv').config();
const port = process.env.PORT || 3000;
const logger = require('./event-logger');

// creating the root namespace on the specified port 
const io = require('socket.io')(port);
io.on('connection', (socket)=>{
    console.log(`socket ${socket.id} is connected to root`);
});

// /caps namespace:
const caps = io.of('/caps');
caps.on('connection', (socket)=>{
    console.log(`socket ${socket.id} connected to /caps`);
    socket.on('joinRoom', (roomName)=>{
        socket.join(roomName);
        console.log('socket joined room: ' + roomName);
        socket.emit('joinedRoom', `Joined room ${roomName}`);
    });

    socket.on('pickup', payload => {
        logger('pickup', payload);
        // emit to the driver socket
        caps.emit('pickup', payload);
    });

    socket.on('in-transit', payload => {
        logger('in-transit', payload);
    });

    socket.on('delivered', payload => {
        logger('delivered', payload);
        // emit to the vendor socket
        caps.emit('delivered', payload);
    });
});

module.exports = { caps };