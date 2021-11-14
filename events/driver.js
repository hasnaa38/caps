'use strict';

const events = require('../event-pool');
require('../event-manager');

events.on('driver-pickup', (payload)=>{
    console.log(`DRIVER: picked up ${payload.orderID}`);
    events.emit('in-transit', payload);   
});

events.on('driver-delivered', (payload)=>{
    console.log(`DRIVER: delivered ${payload.orderID}`);   
});
