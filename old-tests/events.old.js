/*
'use strict';

const faker = require('faker');
let events = require('../basic-event-driven/event-pool');

describe('events testing', () => {
    let consoleSpy; // global variable that will be used to keep an on any operation that is a console log
    let payload = {
        store: faker.company.companyName(),
        orderID: faker.datatype.uuid(),
        customer: faker.name.findName(),
        address: faker.address.streetAddress()
    };
    let next = jest.fn(); // spy method. mock function

    // initialize our testing variable before executing every testing unit
    // we are spying on/watching for any console-log from our events
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    // reset our testing variable after executing every testing unit
    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('can log the pickup event', async ()=>{
        events.emit('pickup', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });
    test('can log the in-transit event', async ()=>{
        events.emit('in-transit', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });
    test('can log the delivered event', async ()=>{
        events.emit('delivered', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });
})


*/