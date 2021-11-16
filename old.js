'use strict';

require('dotenv').config();
const port = process.env.PORT || 3000;
const logger = require('./event-logger');
const uuid = require('uuid').v4;

// creating the root namespace on the specified port 
const io = require('socket.io')(port);
io.on('connection', (socket)=>{
    console.log(`socket ${socket.id} is connected to root`);
});

// adding the message queue:
let msgQueue = {
    flowersPickups: {},
    widgetsPickups: {},
    flowersDeliveries: {},
    widgetsDeliveries: {}
};

// caps namespace:
const caps = io.of('/caps');
caps.on('connection', (socket)=>{
    console.log(`socket ${socket.id} connected to caps`);
    
    socket.on('pickup', payload => {
        logger('pickup', payload);
        let queueKey = payload.store === '1-800-flowers' ? 'flowersPickups' : 'widgetsPickups';
        let msgID = uuid();
        msgQueue[queueKey][msgID] = payload;
        console.log('>> a pickup has been added to the queue');
        caps.emit('pickup', {msgID:msgID, payload: msgQueue[queueKey][msgID]});
    });

    socket.on('in-transit', payload => {
        logger('in-transit', payload);
    });

    socket.on('delivered', payload => {
        logger('delivered', payload);
        let queueKey = payload.payload.store === '1-800-flowers' ? 'flowersPickups' : 'widgetsPickups';
        delete msgQueue[queueKey][payload.msgID];
        console.log('>> pickup was delivered, move it from pickups to deliveries')
        queueKey = payload.payload.store === '1-800-flowers' ? 'flowersDeliveries' : 'widgetsDeliveries';
        msgQueue[queueKey][payload.msgID] = payload.payload;
        caps.emit('delivered', payload);
    });

    socket.on('received', payload => {
        console.log('>> vendor thanked the driver, remove from deliveries');
        let queueKey = payload.payload.store === '1-800-flowers' ? 'flowersDeliveries' : 'widgetsDeliveries';
        delete msgQueue[queueKey][payload.msgID];
    });

    socket.on('getAll', client => {
        if(client === 'driver'){
            Object.keys(msgQueue.flowersPickups).forEach(msgID => {
                socket.emit('pickup', {msgID:msgID, payload: msgQueue.flowersPickups[msgID]});
            });
            Object.keys(msgQueue.widgetsPickups).forEach(msgID => {
                socket.emit('pickup', {msgID:msgID, payload: msgQueue.widgetsPickups[msgID]});
            });
        } else {
            Object.keys(msgQueue.flowersDeliveries).forEach(msgID => {
                socket.emit('delivered', {msgID:msgID, payload: msgQueue.flowersDeliveries[msgID]});
            });
            Object.keys(msgQueue.widgetsDeliveries).forEach(msgID => {
                socket.emit('delivered', {msgID:msgID, payload: msgQueue.widgetsDeliveries[msgID]});
            });
        }
    })
});

module.exports = { caps };

/* Monday's Code:
const caps = io.of('/caps');
caps.on('connection', (socket)=>{
    console.log(`socket ${socket.id} connected to caps`);
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

*/