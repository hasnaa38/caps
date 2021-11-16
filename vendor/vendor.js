'use strict';

const io = require('socket.io-client');
const faker = require('faker');
let host = 'http://localhost:3030';

// connect to the namespace:
const capsConnection = io.connect(`${host}/caps`);

setInterval(()=>{
    let pickupLoad = {
        store: '1-800-flowers',
        orderID: faker.datatype.uuid(),
        customer: faker.name.findName(),
        address: faker.address.streetAddress()
    };
    capsConnection.emit('pickup', pickupLoad);
}, 20000);
// store2: 'acme-widgets'

// get all deliveries, if any
capsConnection.emit('getAll', 'vendor');

capsConnection.on('delivered', (payload) => {
    setTimeout(() => {
        console.log(`VENDOR: Thank you for delivering ${payload.payload.orderID}`);
        capsConnection.emit('received', payload);
    }, 500);
});

/* Monday's code: 
capsConnection.on('joinedRoom', (payload) => {
    console.log(payload);
    capsConnection.emit('pickup', pickupLoad);
});
*/
