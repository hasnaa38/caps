'use strict';

const events = require('./event-pool');
require('./events/vendor');
require('./events/driver');
let logger = require('./event-logger');

// Listens to all events and Logs a timestamp and the payload of every event.
events.on('pickup', pickupHandler);
events.on('in-transit', transitHandler);
events.on('delivered', deliveredHandler);

function pickupHandler(payload){
    logger('pickup', payload);
    events.emit('driver-pickup', payload);
}

function transitHandler(payload){
    logger('in-transit', payload);
    events.emit('delivered', payload);
}

function deliveredHandler(payload){
    logger('delivered', payload);
    events.emit('driver-delivered', payload);
}