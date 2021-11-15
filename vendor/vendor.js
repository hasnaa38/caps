'use strict';

const io = require('socket.io-client');
const faker = require('faker');
let host = 'http://localhost:3030';

// connect to the namespace:
const capsConnection = io.connect(`${host}/caps`);

// join a room with the store name, and emit a pickup event:
let pickupLoad = {
    store: faker.company.companyName(),
    orderID: faker.datatype.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress()
};

capsConnection.emit('joinRoom', pickupLoad.store);
// Listen for joining room:
capsConnection.on('joinedRoom', (payload) => {
    console.log(payload);
    capsConnection.emit('pickup', pickupLoad);
});

// <-- Listening -->
capsConnection.on('delivered', (payload) => {
    setTimeout(() => {
        console.log(`VENDOR: Thank you for delivering ${payload.orderID}`);
    }, 1000);
});