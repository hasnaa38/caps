'use strict';
const { caps } = require('../socket-hub');
const ioClient = require('socket.io-client');
const host = 'http://localhost:3030/caps';
let testVendor = ioClient.connect(host);
let testDriver = ioClient.connect(host);

describe('Testing The Messages Queue', ()=>{
    let consoleSpy;
    let next = jest.fn();
    let payload = {};
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        consoleSpy.mockRestore();
    });
    afterAll(() => setTimeout(() => process.exit(), 0));

    test('can send pickup requests to the system', async ()=>{
        payload = {
            store: 'acme-widgets',
            orderID: '123-456-789a',
            customer: 'name',
            address: 'address'
        };
        testVendor.emit('pickup', payload);
        payload = {
            store: 'acme-widgets',
            orderID: '123-456-789b',
            customer: 'name',
            address: 'address'
        };
        testVendor.emit('pickup', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });
})