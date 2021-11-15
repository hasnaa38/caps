'use strict';

const events = require('../event-pool');
const faker = require('faker');

// --> Emitting <--
setInterval(()=>{
    console.log('----------> New Order <------------');
    let payload = {
        store: faker.company.companyName(),
        orderID: faker.datatype.uuid(),
        customer: faker.name.findName(),
        address: faker.address.streetAddress()
    };
    events.emit('pickup', payload);
}, 2000);

// <-- Listening -->
events.on('delivered', (payload)=>{
    setTimeout(()=>{
        console.log(`VENDOR: Thank you for delivering ${payload.orderID}`);
    }, 1000);
});
