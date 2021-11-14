'use strict';

// requiring the js event module
const EventEmitter = require('events');
// creating an instance of the EventEmitter
const events = new EventEmitter();

// this instance will be exported and shared between all the modules of our code -> Singleton design pattern
module.exports = events;