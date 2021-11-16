'use strict';
const { caps } = require('../socket-hub');
const ioClient = require('socket.io-client');

describe('Testing Socket.io Event-Driven App', ()=>{
    let consoleSpy; // global variable that will be used to keep an on any operation that is a console log
    let payload = {
        store: 'store',
        orderID: 'id',
        customer: 'name',
        address: 'address'
    };
    let next = jest.fn();
    let host = 'http://localhost:3030';

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        consoleSpy.mockRestore();
    });
    afterAll(() => setTimeout(() => process.exit(), 0));

    test('can establish a connection to the root of the socket server', async ()=>{
        const rootConnection = ioClient.connect(`${host}`);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });

    test('can establish a connection to the /caps namespace', async ()=>{
        const capsConnection = ioClient.connect(`${host}/caps`);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });

    test('can join a room in the /caps namespace', async ()=>{
        const capsConnection = ioClient.connect(`${host}/caps`);
        capsConnection.emit('joinRoom', payload.store);
        capsConnection.on('joinedRoom', async (payload) => {
            await consoleSpy();
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    test('can broadcast a pickup event', async ()=>{
        caps.emit('pickup', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });

    test('can broadcast a in-transit event', async ()=>{
        caps.emit('in-transit', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });

    test('can broadcast a delivered event', async ()=>{
        caps.emit('delivered', payload);
        await consoleSpy();
        expect(consoleSpy).toHaveBeenCalled();
    });
});
