'use strict';

class MsgQueue {
    constructor() {
        this.pickups = {};
        this.deliveries = {}
    }

    ePickup(msgID, pickupLoad){
        this.pickups[msgID] = pickupLoad;
        return this.pickups;
    }

    dePick(payload){
        delete this.pickups[payload.msgID];
        return this.pickups;
    }

    eDelivery(payload){
        this.deliveries[payload.msgID] = payload.payload;
        return this.deliveries;
    }

    deDelivery(payload){
        delete this.deliveries[payload.msgID];
        return this.deliveries;
    }
}

module.exports = MsgQueue;