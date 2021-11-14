# CAPS - The Code Academy Parcel Service

## Description

This system emulates a real world supply chain, in which CAPS is a delivery service where vendors will ship products using this delivery service and when drivers deliver them, be notified that their customers received what they purchased.

### Phase 1

Created an Event-Driven application that distributes the responsibility of stimulating different parts of the system to separate modules, using only events to trigger logging the processes based on activity.

* `event-pool.js` is the global event pool module in which we created a single EventEmitter from the Node JS module and exported it to the app modules.
* `event-manager.js` is the module that manages all the global package events. It listens to all the events in the event pool, logs a timestamp and the payload of every event, and emits other events.
* `vendor.js` is the module the manages the vendor events. It simulates a *pickup* event for the a store; it generates a payload for the event, them emits it. Additionally, it listens for delivered event and responds by logging a message to the console.
* `driver.js` is the module that manages driver events. It listens for a pickup event and responds with a log a message to the console, emitting an *in-transit* event, logging a confirmation message to the consol, then emitting a *delivered* event.

## Results

![results](./images/events.PNG)

## Testing

![tests](./images/testing.PNG)

## UML

![uml](./images/uml.png)
