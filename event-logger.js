'use strict';

function logger(eventName, payload){
    let date = new Date();
    console.log('EVENT ', {
        event: eventName,
        time: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        payload: payload
    });
}

module.exports = logger;