'use strict';

require('dotenv').config();
const port = process.env.PORT || 3000;
const logger = require('./event-logger');
const uuid = require('uuid').v4;
const MsgQueue = require('./msgQueue');

// creating the root namespace on the specified port 
const io = require('socket.io')(port);
io.on('connection', (socket)=>{
    console.log(`socket ${socket.id} is connected to root`);
});

// adding the message queue:
let flowersQueue = new MsgQueue();
let widgetsQueue = new MsgQueue();

// caps namespace:
const caps = io.of('/caps');
caps.on('connection', (socket)=>{
    console.log(`socket ${socket.id} connected to caps`);
    
    socket.on('pickup', payload => {
        logger('pickup', payload);
        let msgID = uuid();
        if(payload.store === '1-800-flowers'){
            flowersQueue.ePickup(msgID, payload);
        } else if(payload.store === 'acme-widgets'){
            widgetsQueue.ePickup(msgID, payload);
        }
        console.log('>> a pickup has been added to the queue');
        caps.emit('pickup', {msgID:msgID, payload:payload});
    });

    socket.on('in-transit', payload => {
        logger('in-transit', payload);
    });

    socket.on('delivered', payload => {
        logger('delivered', payload);
        console.log('>> pickup was delivered, move it from pickups to deliveries');
        if(payload.payload.store === '1-800-flowers'){
            flowersQueue.dePick(payload);
            flowersQueue.eDelivery(payload);
        } else if(payload.payload.store === 'acme-widgets'){
            widgetsQueue.dePick(payload);
            widgetsQueue.eDelivery(payload);
        }
        caps.emit('delivered', payload);
    });

    socket.on('received', payload => {
        console.log('>> vendor thanked the driver, remove from deliveries');
        if(payload.payload.store === '1-800-flowers'){
            flowersQueue.deDelivery(payload);
        } else if(payload.payload.store === 'acme-widgets'){
            widgetsQueue.deDelivery(payload);
        }
    });

    socket.on('getAll', client => {
        if(client === 'driver'){
            console.log('driver connected, send pickups queue');
            Object.keys(flowersQueue.pickups).forEach(msgID => {
                socket.emit('pickup', {msgID:msgID, payload: flowersQueue.pickups[msgID]});
            });
            Object.keys(widgetsQueue.pickups).forEach(msgID => {
                socket.emit('pickup', {msgID:msgID, payload: widgetsQueue.pickups[msgID]});
            });
        } else {
            console.log('vendor connected, send deliveries queue');
            Object.keys(flowersQueue.deliveries).forEach(msgID => {
                socket.emit('delivered', {msgID:msgID, payload: flowersQueue.deliveries[msgID]});
            });
            Object.keys(widgetsQueue.deliveries).forEach(msgID => {
                socket.emit('delivered', {msgID:msgID, payload: widgetsQueue.deliveries[msgID]});
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